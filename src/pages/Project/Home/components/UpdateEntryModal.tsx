import { Button, Checkbox, DatePicker, Form, Input, Modal, Progress, Radio, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { EntryInfo, ExtraFileInfo } from "@/api/project_entry";
import { get as get_entry, update_title, update_perm, update_tag, update_extra_info, ENTRY_TYPE_SPRIT, ISSUE_LIST_ALL, ISSUE_LIST_LIST, ISSUE_LIST_KANBAN, ENTRY_TYPE_PAGES, ENTRY_TYPE_FILE } from "@/api/project_entry";
import { request } from "@/utils/request";
import UserPhoto from "@/components/Portrait/UserPhoto";
import s from "./UpdateEntryModal.module.less";
import moment, { type Moment } from "moment";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { uniqId } from "@/utils/utils";
import { pack_min_app } from "@/api/min_app";
import { FILE_OWNER_TYPE_FILE, FILE_OWNER_TYPE_PAGES, get_file_name, set_file_owner, write_file } from "@/api/fs";
import type { FsProgressEvent } from '@/api/fs';
import { listen } from '@tauri-apps/api/event';
import { FolderOpenOutlined } from "@ant-design/icons";

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

    const [localPagesPath, setLocalPagesPath] = useState("");
    const [uploadPagesTraceId, setUploadPagesTraceId] = useState("");
    const [packFileName, setPackFileName] = useState("");
    const [uploadRatio, setUploadRatio] = useState(0);

    const [localFilePath, setLocalFilePath] = useState("");
    const [uploadFileTraceId, setUploadFileTraceId] = useState("");

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

    const choicePagesPath = async () => {
        const selected = await open_dialog({
            title: "打开本地应用目录",
            directory: true,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalPagesPath(selected);
        setExtraChanged(true);
    };

    const choiceFilePath = async () => {
        const selected = await open_dialog({
            title: "选择本地文件",
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalFilePath(selected);
        setExtraChanged(true);
    };

    const uploadPages = async () => {
        const traceId = uniqId();
        setUploadPagesTraceId(traceId);
        try {
            const path = await pack_min_app(localPagesPath, traceId);
            const res = await request(write_file(userStore.sessionId, projectStore.curProject?.pages_fs_id ?? "", path, traceId));
            return res.file_id;
        } finally {
            setUploadRatio(0);
            setUploadPagesTraceId("");
            setPackFileName("");
        }
    };

    const uploadFile = async (): Promise<ExtraFileInfo> => {
        const traceId = uniqId();
        setUploadFileTraceId(traceId);
        try {
            const res = await request(write_file(userStore.sessionId, projectStore.curProject?.file_fs_id ?? "", localFilePath, traceId));
            const fileName = await get_file_name(localFilePath);
            return {
                file_id: res.file_id,
                file_name: fileName,
            };
        } finally {
            setUploadRatio(0);
            setUploadFileTraceId("");
        }
    }

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
            if (entryInfo.entry_type == ENTRY_TYPE_PAGES) {
                const pagesFileId = await uploadPages();
                await request(set_file_owner({
                    session_id: userStore.sessionId,
                    fs_id: projectStore.curProject?.pages_fs_id ?? "",
                    file_id: pagesFileId,
                    owner_type: FILE_OWNER_TYPE_PAGES,
                    owner_id: entryInfo.entry_id,
                }));
                await request(update_extra_info({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    entry_id: entryInfo.entry_id,
                    extra_info: {
                        ExtraPagesInfo: {
                            file_id: pagesFileId,
                        },
                    },
                }));
            } else if (entryInfo.entry_type == ENTRY_TYPE_FILE) {
                const fileExtraInfo = await uploadFile();
                await request(set_file_owner({
                    session_id: userStore.sessionId,
                    fs_id: projectStore.curProject?.file_fs_id ?? "",
                    file_id: fileExtraInfo.file_id,
                    owner_type: FILE_OWNER_TYPE_FILE,
                    owner_id: entryInfo.entry_id,
                }));
                await request(update_extra_info({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    entry_id: entryInfo.entry_id,
                    extra_info: {
                        ExtraFileInfo: fileExtraInfo,
                    },
                }));
            } else {
                await request(update_extra_info({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    entry_id: entryInfo.entry_id,
                    extra_info: entryInfo.extra_info,
                }));
            }
        }
        message.info("修改成功");
        await entryStore.updateEntry(entryInfo.entry_id);
        entryStore.editEntryId = "";
    };

    useEffect(() => {
        loadEntryInfo();
    }, [entryStore.editEntryId, projectStore.curProjectId]);

    useEffect(() => {
        if (uploadPagesTraceId == "") {
            return;
        }
        const unListenFn = listen<FsProgressEvent>("uploadFile_" + uploadPagesTraceId, ev => {
            if (ev.payload.total_step == 0) {
                setUploadRatio(100);
            } else {
                setUploadRatio(Math.round(ev.payload.cur_step * 100 / ev.payload.total_step));
            }
        });

        const unListenFn2 = listen<string>(uploadPagesTraceId, ev => {
            setPackFileName(ev.payload);
        });
        return () => {
            unListenFn.then((unListen) => unListen());
            unListenFn2.then((unListen) => unListen());
        };
    }, [uploadPagesTraceId]);

    useEffect(() => {
        if (uploadFileTraceId == "") {
            return;
        }
        const unListenFn = listen<FsProgressEvent>("uploadFile_" + uploadFileTraceId, ev => {
            if (ev.payload.total_step == 0) {
                setUploadRatio(100);
            } else {
                setUploadRatio(Math.round(ev.payload.cur_step * 100 / ev.payload.total_step));
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, [uploadFileTraceId]);

    return (
        <Modal open title="修改内容信息"
            okText="修改"
            okButtonProps={{ disabled: entryInfo == null || entryInfo.can_update == false || entryInfo.entry_title == "" || (!titleChanged && !permChanged && !tagChanged && !extraChanged) || packFileName != "" || uploadRatio > 0 }}
            cancelButtonProps={{ disabled: packFileName != "" || uploadRatio > 0 }}
            closable={!(packFileName != "" || uploadRatio > 0)}
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
                <Form labelCol={{ span: 6 }} disabled={packFileName != "" || uploadRatio > 0}>
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
                                                    ...entryInfo.extra_info.ExtraSpritInfo!,
                                                    start_time: value[0]?.startOf("day").valueOf() ?? 0,
                                                    end_time: value[1]?.endOf("day").valueOf() ?? 0,
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
                                                        ...entryInfo.extra_info.ExtraSpritInfo!,
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
                                                            ...entryInfo.extra_info.ExtraSpritInfo!,
                                                            non_work_day_list: tmpList,
                                                        }
                                                    }
                                                });
                                                setExtraChanged(true);
                                            }
                                        }
                                    }} />
                            </Form.Item>
                            <Form.Item label="列表样式">
                                <Radio.Group value={entryInfo.extra_info.ExtraSpritInfo?.issue_list_type ?? ISSUE_LIST_ALL} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setEntryInfo({
                                        ...entryInfo, extra_info: {
                                            ExtraSpritInfo: {
                                                ...entryInfo.extra_info.ExtraSpritInfo!,
                                                issue_list_type: e.target.value,
                                            }
                                        }
                                    });
                                    setExtraChanged(true);
                                }}>
                                    <Radio value={ISSUE_LIST_ALL}>列表和看板</Radio>
                                    <Radio value={ISSUE_LIST_LIST}>列表</Radio>
                                    <Radio value={ISSUE_LIST_KANBAN}>看板</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="隐藏甘特图">
                                <Checkbox checked={entryInfo.extra_info.ExtraSpritInfo?.hide_gantt_panel ?? false} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setEntryInfo({
                                        ...entryInfo, extra_info: {
                                            ExtraSpritInfo: {
                                                ...entryInfo.extra_info.ExtraSpritInfo!,
                                                hide_gantt_panel: e.target.checked,
                                            }
                                        }
                                    });
                                    setExtraChanged(true);
                                }} />
                            </Form.Item>
                            <Form.Item label="隐藏燃尽图" >
                                <Checkbox checked={entryInfo.extra_info.ExtraSpritInfo?.hide_burndown_panel ?? false} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setEntryInfo({
                                        ...entryInfo, extra_info: {
                                            ExtraSpritInfo: {
                                                ...entryInfo.extra_info.ExtraSpritInfo!,
                                                hide_burndown_panel: e.target.checked,
                                            }
                                        }
                                    });
                                    setExtraChanged(true);
                                }} />
                            </Form.Item>
                            <Form.Item label="隐藏统计信息" >
                                <Checkbox checked={entryInfo.extra_info.ExtraSpritInfo?.hide_stat_panel ?? false} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setEntryInfo({
                                        ...entryInfo, extra_info: {
                                            ExtraSpritInfo: {
                                                ...entryInfo.extra_info.ExtraSpritInfo!,
                                                hide_stat_panel: e.target.checked,
                                            }
                                        }
                                    });
                                    setExtraChanged(true);
                                }} />
                            </Form.Item>
                            <Form.Item label="隐藏工作总结" >
                                <Checkbox checked={entryInfo.extra_info.ExtraSpritInfo?.hide_summary_panel ?? false} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setEntryInfo({
                                        ...entryInfo, extra_info: {
                                            ExtraSpritInfo: {
                                                ...entryInfo.extra_info.ExtraSpritInfo!,
                                                hide_summary_panel: e.target.checked,
                                            }
                                        }
                                    });
                                    setExtraChanged(true);
                                }} />
                            </Form.Item>
                        </>
                    )}
                    {entryInfo.entry_type == ENTRY_TYPE_PAGES && (
                        <>
                            <Form.Item label="网页目录" help="目录中需包含index.html">
                                <Input value={localPagesPath} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setLocalPagesPath(e.target.value);
                                    setExtraChanged(true);
                                }}
                                    addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        choicePagesPath();
                                    }} />} />
                            </Form.Item>
                            {uploadRatio == 0 && packFileName != "" && (
                                <Form.Item label="打包进度">
                                    {packFileName}
                                </Form.Item>
                            )}
                            {uploadRatio > 0 && (
                                <Form.Item label="上传进度">
                                    <Progress percent={uploadRatio} />
                                </Form.Item>
                            )}
                        </>
                    )}
                    {entryInfo.entry_type == ENTRY_TYPE_FILE && (
                        <>
                            <Form.Item label="本地文件">
                                <Input value={localFilePath} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setLocalFilePath(e.target.value);
                                }}
                                    addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        choiceFilePath();
                                    }} />} />
                            </Form.Item>
                            {uploadRatio > 0 && (
                                <Form.Item label="上传进度">
                                    <Progress percent={uploadRatio} />
                                </Form.Item>
                            )}
                        </>
                    )}
                </Form>
            )}
        </Modal>
    );
};

export default observer(UpdateEntryModal);
