import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from "./index.module.less";
import { Collapse, Input, List, Modal, message } from "antd";
import Button from "@/components/Button";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import {
    ASSGIN_USER_ALL, ISSUE_STATE_CHECK, ISSUE_STATE_PROCESS, ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC,
    TASK_PRIORITY_LOW, BUG_LEVEL_MINOR, BUG_PRIORITY_LOW,
    list as list_issue, create as create_issue, assign_exec_user
} from "@/api/project_issue";
import type { IssueInfo, ISSUE_TYPE } from "@/api/project_issue";
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { showShortNote } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";

const SimpleModePanel = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [taskList, setTaskList] = useState<IssueInfo[]>([]);
    const [bugList, setBugList] = useState<IssueInfo[]>([]);
    const [addIssueType, setAddIssueType] = useState<ISSUE_TYPE | null>(null);
    const [title, setTitle] = useState("");

    const loadMyIssue = async () => {
        const res = await request(list_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_issue_type: false,
                issue_type: 0,
                filter_by_state: true,
                state_list: [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
                filter_by_create_user_id: false,
                create_user_id_list: [],
                filter_by_assgin_user_id: true,
                assgin_user_id_list: [userStore.userInfo.userId],
                assgin_user_type: ASSGIN_USER_ALL,
                filter_by_sprit_id: false,
                sprit_id_list: [],
                filter_by_create_time: false,
                from_create_time: 0,
                to_create_time: 0,
                filter_by_update_time: false,
                from_update_time: 0,
                to_update_time: 0,
                filter_by_title_keyword: false,
                title_keyword: "",
                ///任务相关
                filter_by_task_priority: false,
                task_priority_list: [],
                ///缺陷相关
                filter_by_software_version: false,
                software_version_list: [],
                filter_by_bug_priority: false,
                bug_priority_list: [],
                filter_by_bug_level: false,
                bug_level_list: [],
            },
            sort_type: SORT_TYPE_DSC,
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: 0,
            limit: 99,
        }));
        const tmpTaskList: IssueInfo[] = [];
        const tmpBugList: IssueInfo[] = [];
        res.info_list.forEach(item => {
            if (item.issue_type == ISSUE_TYPE_TASK) {
                tmpTaskList.push(item);
            } else if (item.issue_type == ISSUE_TYPE_BUG) {
                tmpBugList.push(item);
            }
        });
        setTaskList(tmpTaskList);
        setBugList(tmpBugList);
    };

    const addIssue = async () => {
        if (addIssueType == null || title.trim() == "") {
            return;
        }
        const res = await request(create_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_type: addIssueType,
            basic_info: {
                title: title.trim(),
                content: "{}",
            },
            extra_info: {
                ExtraTaskInfo: addIssueType == ISSUE_TYPE_TASK ? {
                    priority: TASK_PRIORITY_LOW,
                } : undefined,
                ExtraBugInfo: addIssueType == ISSUE_TYPE_BUG ? {
                    software_version: "",
                    level: BUG_LEVEL_MINOR,
                    priority: BUG_PRIORITY_LOW,
                } : undefined,
            },
        }));
        await request(assign_exec_user(userStore.sessionId, projectStore.curProjectId, res.issue_id, userStore.userInfo.userId));
        await loadMyIssue();
        message.info(`增加${addIssueType == ISSUE_TYPE_TASK ? "任务" : "缺陷"}成功`);
        setAddIssueType(null);
    }

    useEffect(() => {
        loadMyIssue();
    }, [projectStore.curProjectId]);

    return (
        <div className={s.content_wrap}>
            <Collapse bordered={true} className={s.collapse} activeKey={["task", "bug"]}>
                <Collapse.Panel key="task" header="待处理任务" extra={
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAddIssueType(ISSUE_TYPE_TASK);
                    }}><PlusOutlined />增加任务</Button>
                }>
                    <List dataSource={taskList} renderItem={item => (
                        <List.Item>
                            <a className={s.issue_title} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                linkAuxStore.goToLink(new LinkTaskInfo("", item.project_id, item.issue_id, taskList.map(task => task.issue_id)), history);
                            }}>{item.basic_info.title}</a>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                showShortNote(userStore.sessionId, {
                                    shortNoteType: SHORT_NOTE_TASK,
                                    data: item,
                                }, projectStore.curProject?.basic_info.project_name ?? "");
                            }}><ExportOutlined /></a>
                        </List.Item>
                    )} />
                </Collapse.Panel>
                <Collapse.Panel key="bug" header="待处理缺陷" extra={
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAddIssueType(ISSUE_TYPE_BUG);
                    }}><PlusOutlined />增加缺陷</Button>
                }>
                    <List dataSource={bugList} renderItem={item => (
                        <List.Item>
                            <a className={s.issue_title} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                linkAuxStore.goToLink(new LinkBugInfo("", item.project_id, item.issue_id, bugList.map(bug => bug.issue_id)), history);
                            }}>{item.basic_info.title}</a>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                showShortNote(userStore.sessionId, {
                                    shortNoteType: SHORT_NOTE_BUG,
                                    data: item,
                                }, projectStore.curProject?.basic_info.project_name ?? "");
                            }}><ExportOutlined /></a>
                        </List.Item>
                    )} />
                </Collapse.Panel>
            </Collapse>
            {addIssueType != null && (
                <Modal open title={`增加${addIssueType == ISSUE_TYPE_TASK ? "任务" : "缺陷"}`}
                    okText="增加"
                    okButtonProps={{ disabled: title.trim() == "" }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAddIssueType(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addIssue();
                    }}>
                    <Input addonBefore={`${addIssueType == ISSUE_TYPE_TASK ? "任务" : "缺陷"}名称`} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }} />
                </Modal>
            )
            }
        </div >
    );
};

export default observer(SimpleModePanel);