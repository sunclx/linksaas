import { Checkbox, DatePicker, Form, Input, Modal, Radio, Tag } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import { create_doc } from "@/api/project_doc";
import { create as create_sprit } from "@/api/project_sprit";
import { ENTRY_TYPE_DOC, ENTRY_TYPE_SPRIT, ISSUE_LIST_ALL, ISSUE_LIST_KANBAN, ISSUE_LIST_LIST, create as create_entry } from "@/api/project_entry";
import { useStores } from "@/hooks";
import type { EntryPerm, ExtraSpritInfo, CreateRequest } from "@/api/project_entry";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment, { type Moment } from "moment";
import s from "./UpdateEntryModal.module.less";
import { request } from "@/utils/request";
import { APP_PROJECT_KB_DOC_PATH, APP_PROJECT_WORK_PLAN_PATH } from "@/utils/constant";
import { useHistory } from "react-router-dom";



const CreateEntryModal = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const memberStore = useStores('memberStore');
    const docStore = useStores('docStore');

    const [title, setTitle] = useState("");
    const [entryPerm, setEntryPerm] = useState<EntryPerm>({
        update_for_all: true,
        extra_update_user_id_list: [],
    });
    const [tagIdList, setTagIdList] = useState<string[]>([]);
    const [spritExtraInfo, setSpritExtraInfo] = useState<ExtraSpritInfo>({
        start_time: moment().startOf("day").valueOf(),
        end_time: moment().add(7, "days").endOf("day").valueOf(),
        non_work_day_list: [],
        issue_list_type: ISSUE_LIST_ALL,
        hide_gantt_panel: false,
        hide_burndown_panel: false,
        hide_stat_panel: false,
        hide_summary_panel: false,
    });

    const checkDayValid = (day: Moment): boolean => {
        const startTime = spritExtraInfo.start_time;
        const endTime = spritExtraInfo.end_time;
        const dayTime = day.valueOf();
        return dayTime >= startTime && dayTime <= endTime;
    };

    const createEntry = async () => {
        if (title == "" || entryStore.createEntryType == null) {
            return;
        }
        let entryId = "";
        if (entryStore.createEntryType == ENTRY_TYPE_SPRIT) {
            const res = await request(create_sprit(userStore.sessionId, projectStore.curProjectId));
            entryId = res.sprit_id;
        } else if (entryStore.createEntryType == ENTRY_TYPE_DOC) {
            const res = await request(create_doc({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                base_info: {
                    content: JSON.stringify({ type: "doc" }),
                },
            }));
            entryId = res.doc_id;
        }
        if (entryId == "" || entryStore.createEntryType == null) {
            return;
        }
        const createReq: CreateRequest = {
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: entryId,
            entry_type: entryStore.createEntryType,
            entry_title: title,
            tag_id_list: tagIdList,
            entry_perm: {
                update_for_all: entryPerm.update_for_all,
                extra_update_user_id_list: entryPerm.update_for_all ? [] : entryPerm.extra_update_user_id_list,
            },
        };
        if (entryStore.createEntryType == ENTRY_TYPE_SPRIT) {
            createReq.extra_info = {
                ExtraSpritInfo: spritExtraInfo,
            };
        }
        console.log(createReq);
        await request(create_entry(createReq));

        await entryStore.loadEntry(entryId);
        if (entryStore.createEntryType == ENTRY_TYPE_SPRIT) {
            history.push(APP_PROJECT_WORK_PLAN_PATH);
        } else if (entryStore.createEntryType == ENTRY_TYPE_DOC) {
            await docStore.loadDoc();
            docStore.inEdit = true;
            history.push(APP_PROJECT_KB_DOC_PATH);
        }
        entryStore.createEntryType = null;
    };

    return (
        <Modal open title="创建内容"
            okText="创建" okButtonProps={{ disabled: title == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                entryStore.createEntryType = null;
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createEntry();
            }}>
            <Form labelCol={{ span: 6 }}>
                <Form.Item label="标题">
                    <Input value={title} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="类型">
                    <Radio.Group value={entryStore.createEntryType} onChange={e => {
                        e.stopPropagation();
                        entryStore.createEntryType = e.target.value;
                    }}>
                        <Radio value={ENTRY_TYPE_SPRIT}>工作计划</Radio>
                        <Radio value={ENTRY_TYPE_DOC}>文档</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="所有成员可修改">
                    <Checkbox checked={entryPerm.update_for_all} onChange={e => {
                        e.stopPropagation();
                        setEntryPerm({ ...entryPerm, update_for_all: e.target.checked });
                    }} />
                </Form.Item>
                {entryPerm.update_for_all == false && (
                    <Form.Item label="可修改成员" help="管理员始终具有修改权限">
                        <Checkbox.Group value={entryPerm.extra_update_user_id_list}
                            options={memberStore.memberList.filter(member => member.member.can_admin == false).map(member => (
                                {
                                    label: (<div>
                                        <UserPhoto logoUri={member.member.logo_uri} style={{ width: "16px", borderRadius: "10px", marginRight: "10px" }} />
                                        {member.member.display_name}
                                    </div>),
                                    value: member.member.member_user_id,
                                }
                            ))} onChange={value => {
                                setEntryPerm({ ...entryPerm, extra_update_user_id_list: value as string[] });
                            }} />
                    </Form.Item>
                )}
                <Form.Item label="标签">
                    <Checkbox.Group value={tagIdList} options={(projectStore.curProject?.tag_list ?? []).filter(tag => tag.use_in_entry).map(tag => ({
                        label: <div style={{ backgroundColor: tag.bg_color, padding: "0px 4px", marginBottom: "10px" }}>{tag.tag_name}</div>,
                        value: tag.tag_id,
                    }))} onChange={value => {
                        setTagIdList(value as string[]);
                    }} />
                </Form.Item>
                {entryStore.createEntryType == ENTRY_TYPE_SPRIT && (
                    <>
                        <Form.Item label="时间区间">
                            <DatePicker.RangePicker popupClassName={s.date_picker}
                                allowClear={false}
                                value={[moment(spritExtraInfo.start_time), moment(spritExtraInfo.end_time)]}
                                onChange={value => {
                                    if (value == null) {
                                        return;
                                    }
                                    if ((value[0]?.valueOf() ?? 0) >= (value[1]?.valueOf() ?? 0)) {
                                        return;
                                    }
                                    setSpritExtraInfo({
                                        ...spritExtraInfo,
                                        start_time: value[0]?.startOf("day").valueOf() ?? 0,
                                        end_time: value[1]?.endOf("day").valueOf() ?? 0,
                                    });
                                }} />
                        </Form.Item>
                        <Form.Item label="非工作日">
                            {(spritExtraInfo.non_work_day_list).map(dayTime => (
                                <Tag key={dayTime} style={{ lineHeight: "26px", marginTop: "2px" }}
                                    closable onClose={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        const tmpList = (spritExtraInfo.non_work_day_list).filter(item => item != dayTime);
                                        setSpritExtraInfo({
                                            ...spritExtraInfo,
                                            non_work_day_list: tmpList,
                                        });
                                    }}>
                                    {moment(dayTime).format("YYYY-MM-DD")}
                                </Tag>
                            ))}
                            <DatePicker popupClassName={s.date_picker} value={null}
                                disabled={spritExtraInfo.start_time == 0 || spritExtraInfo.end_time == 0}
                                disabledDate={(day) => checkDayValid(day) == false}
                                onChange={value => {
                                    if (value !== null) {
                                        if (checkDayValid(value) == false) {
                                            return;
                                        }
                                        const dayTime = value.startOf("day").valueOf();
                                        if (spritExtraInfo.non_work_day_list.includes(dayTime) == false) {
                                            const tmpList = spritExtraInfo.non_work_day_list.slice();
                                            tmpList.push(dayTime);
                                            tmpList.sort();
                                            setSpritExtraInfo({
                                                ...spritExtraInfo,
                                                non_work_day_list: tmpList,
                                            });
                                        }
                                    }
                                }} />
                        </Form.Item>
                        <Form.Item label="列表样式">
                            <Radio.Group value={spritExtraInfo.issue_list_type} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSpritExtraInfo({
                                    ...spritExtraInfo,
                                    issue_list_type: e.target.value,
                                });
                            }}>
                                <Radio value={ISSUE_LIST_ALL}>列表和看板</Radio>
                                <Radio value={ISSUE_LIST_LIST}>列表</Radio>
                                <Radio value={ISSUE_LIST_KANBAN}>看板</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="隐藏甘特图">
                            <Checkbox checked={spritExtraInfo.hide_gantt_panel} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSpritExtraInfo({
                                    ...spritExtraInfo,
                                    hide_gantt_panel: e.target.checked,
                                });
                            }} />
                        </Form.Item>
                        <Form.Item label="隐藏燃尽图">
                            <Checkbox checked={spritExtraInfo.hide_burndown_panel} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSpritExtraInfo({
                                    ...spritExtraInfo,
                                    hide_burndown_panel: e.target.checked,
                                });
                            }} />
                        </Form.Item>
                        <Form.Item label="隐藏统计信息">
                            <Checkbox checked={spritExtraInfo.hide_stat_panel} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSpritExtraInfo({
                                    ...spritExtraInfo,
                                    hide_stat_panel: e.target.checked,
                                });
                            }} />
                        </Form.Item>
                        <Form.Item label="隐藏工作总结">
                            <Checkbox checked={spritExtraInfo.hide_summary_panel} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSpritExtraInfo({
                                    ...spritExtraInfo,
                                    hide_summary_panel: e.target.checked,
                                });
                            }} />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default observer(CreateEntryModal);