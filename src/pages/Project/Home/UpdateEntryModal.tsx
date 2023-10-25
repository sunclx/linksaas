import { Checkbox, DatePicker, Form, Input, Modal, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { EntryInfo } from "@/api/project_entry";
import { get as get_entry, update_title, update_perm, update_tag, update_extra_info, ENTRY_TYPE_SPRIT } from "@/api/project_entry";
import { request } from "@/utils/request";
import UserPhoto from "@/components/Portrait/UserPhoto";
import s from "./UpdateEntryModal.module.less";
import moment, { type Moment } from "moment";

const UpdateEntryModal = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const memberStore = useStores('memberStore');

    const [entryInfo, setEntryInfo] = useState<EntryInfo | null>(null);
    const [tagIdList, setTagIdList] = useState<string[]>([]);
    const [titleChanged, setTitleChanged] = useState(false);
    const [permChanged, setPermChanged] = useState(false);
    const [tagChanged, setTagChanged] = useState(false);
    const [extraChanged, setExtraChanged] = useState(false);

    const loadEntryInfo = async () => {
        const res = await request(get_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: entryStore.editEntryId,
        }));
        setEntryInfo(res.entry);
        setTagIdList(res.entry.tag_list.map(tag => tag.tag_id));
    };

    const checkDayValid = (day: Moment): boolean => {
        if (entryInfo == null) {
            return false;
        }
        const startTime = entryInfo.extra_info.ExtraSpritInfo?.start_time ?? 0;
        const endTime = entryInfo.extra_info.ExtraSpritInfo?.end_time ?? 0;
        const dayTime = day.valueOf();
        return dayTime >= startTime && dayTime <= endTime;
    };

    const updateEntry = async () => {
        if (entryInfo == null) {
            return;
        }
        if (titleChanged) {
            await request(update_title({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: entryInfo.entry_id,
                title: entryInfo.entry_title,
            }));
        }
        if (entryInfo == null) {
            return;
        }
        if (permChanged) {
            await request(update_perm({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: entryInfo.entry_id,
                entry_perm: {
                    update_for_all: entryInfo.entry_perm.update_for_all,
                    extra_update_user_id_list: entryInfo.entry_perm.update_for_all ? [] : entryInfo.entry_perm.extra_update_user_id_list,
                },
            }));
        }
        if (entryInfo == null) {
            return;
        }
        if (tagChanged) {
            await request(update_tag({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: entryInfo.entry_id,
                tag_id_list: tagIdList,
            }));
        }
        if (entryInfo == null) {
            return;
        }
        if (extraChanged) {
            await request(update_extra_info({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: entryInfo.entry_id,
                extra_info: entryInfo.extra_info,
            }))
        }
        message.info("修改成功");
        await entryStore.updateEntry(entryInfo.entry_id);
        entryStore.editEntryId = "";
    };

    useEffect(() => {
        loadEntryInfo();
    }, [entryStore.editEntryId, projectStore.curProjectId]);

    return (
        <Modal open title="修改内容信息"
            okText="修改"
            okButtonProps={{ disabled: entryInfo == null || entryInfo.can_update == false || entryInfo.entry_title == "" || (!titleChanged && !permChanged && !tagChanged && !extraChanged) }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                entryStore.editEntryId = "";
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateEntry();
            }}>
            {entryInfo != null && (
                <Form labelCol={{ span: 6 }}>
                    <Form.Item label="标题">
                        <Input value={entryInfo.entry_title} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setEntryInfo({ ...entryInfo, entry_title: e.target.value.trim() });
                            setTitleChanged(true);
                        }} />
                    </Form.Item>
                    <Form.Item label="所有成员可修改">
                        <Checkbox checked={entryInfo.entry_perm.update_for_all} onChange={e => {
                            e.stopPropagation();
                            setEntryInfo({ ...entryInfo, entry_perm: { ...entryInfo.entry_perm, update_for_all: e.target.checked } });
                            setPermChanged(true);
                        }} />
                    </Form.Item>
                    {entryInfo.entry_perm.update_for_all == false && (
                        <Form.Item label="可修改成员" help="管理员始终具有修改权限">
                            <Checkbox.Group value={entryInfo.entry_perm.extra_update_user_id_list}
                                options={memberStore.memberList.filter(member => member.member.can_admin == false).map(member => (
                                    {
                                        label: (<div>
                                            <UserPhoto logoUri={member.member.logo_uri} style={{ width: "16px", borderRadius: "10px", marginRight: "10px" }} />
                                            {member.member.display_name}
                                        </div>),
                                        value: member.member.member_user_id,
                                    }
                                ))} onChange={value => {
                                    setEntryInfo({ ...entryInfo, entry_perm: { ...entryInfo.entry_perm, extra_update_user_id_list: value as string[] } });
                                    setPermChanged(true);
                                }} />
                        </Form.Item>
                    )}
                    <Form.Item label="标签">
                        <Checkbox.Group value={tagIdList} options={(projectStore.curProject?.tag_list ?? []).filter(tag => tag.use_in_entry).map(tag => ({
                            label: <div style={{ backgroundColor: tag.bg_color, padding: "0px 4px", marginBottom: "10px" }}>{tag.tag_name}</div>,
                            value: tag.tag_id,
                        }))} onChange={value => {
                            setTagIdList(value as string[]);
                            setTagChanged(true);
                        }} />
                    </Form.Item>
                    {entryInfo.entry_type == ENTRY_TYPE_SPRIT && (
                        <>
                            <Form.Item label="时间区间">
                                <DatePicker.RangePicker popupClassName={s.date_picker}
                                    allowClear={false}
                                    value={[moment(entryInfo.extra_info.ExtraSpritInfo?.start_time ?? 0), moment(entryInfo.extra_info.ExtraSpritInfo?.end_time ?? 0)]}
                                    onChange={value => {
                                        if (value == null) {
                                            return;
                                        }
                                        if ((value[0]?.valueOf() ?? 0) >= (value[1]?.valueOf() ?? 0)) {
                                            return;
                                        }
                                        setEntryInfo({
                                            ...entryInfo, extra_info: {
                                                ExtraSpritInfo: {
                                                    start_time: value[0]?.startOf("day").valueOf() ?? 0,
                                                    end_time: value[1]?.endOf("day").valueOf() ?? 0,
                                                    non_work_day_list: entryInfo.extra_info.ExtraSpritInfo?.non_work_day_list ?? [],
                                                }
                                            }
                                        });
                                        setExtraChanged(true);
                                    }} />
                            </Form.Item>
                            <Form.Item label="非工作日">
                                {(entryInfo.extra_info.ExtraSpritInfo?.non_work_day_list ?? []).map(dayTime => (
                                    <Tag key={dayTime} style={{ lineHeight: "26px", marginTop: "2px" }}
                                        closable onClose={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            const tmpList = (entryInfo.extra_info.ExtraSpritInfo?.non_work_day_list ?? []).filter(item => item != dayTime);
                                            setEntryInfo({
                                                ...entryInfo, extra_info: {
                                                    ExtraSpritInfo: {
                                                        start_time: entryInfo.extra_info.ExtraSpritInfo?.start_time ?? 0,
                                                        end_time: entryInfo.extra_info.ExtraSpritInfo?.end_time ?? 0,
                                                        non_work_day_list: tmpList,
                                                    }
                                                }
                                            });
                                            setExtraChanged(true);
                                        }}>
                                        {moment(dayTime).format("YYYY-MM-DD")}
                                    </Tag>
                                ))}
                                <DatePicker popupClassName={s.date_picker} value={null}

                                    disabled={(entryInfo.extra_info.ExtraSpritInfo?.start_time ?? 0) == 0 || (entryInfo.extra_info.ExtraSpritInfo?.end_time ?? 0) == 0}
                                    disabledDate={(day) => checkDayValid(day) == false}
                                    onChange={value => {
                                        if (value !== null) {
                                            if (checkDayValid(value) == false) {
                                                return;
                                            }
                                            const dayTime = value.startOf("day").valueOf();
                                            if ((entryInfo.extra_info.ExtraSpritInfo?.non_work_day_list ?? []).includes(dayTime) == false) {
                                                const tmpList = (entryInfo.extra_info.ExtraSpritInfo?.non_work_day_list ?? []).slice();
                                                tmpList.push(dayTime);
                                                tmpList.sort();
                                                setEntryInfo({
                                                    ...entryInfo, extra_info: {
                                                        ExtraSpritInfo: {
                                                            start_time: entryInfo.extra_info.ExtraSpritInfo?.start_time ?? 0,
                                                            end_time: entryInfo.extra_info.ExtraSpritInfo?.end_time ?? 0,
                                                            non_work_day_list: tmpList,
                                                        }
                                                    }
                                                });
                                                setExtraChanged(true);
                                            }
                                        }
                                    }} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            )}
        </Modal>
    );
};

export default observer(UpdateEntryModal);
