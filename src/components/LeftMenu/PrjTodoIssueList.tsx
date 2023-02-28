import React from "react";
import { observer } from 'mobx-react';
import { Badge, List, Popover, Space } from "antd";
import { useStores } from "@/hooks";
import cls from './prjIssue.module.less';
import { ExportOutlined, LinkOutlined } from "@ant-design/icons";
import type { ISSUE_TYPE } from '@/api/project_issue';
import { ISSUE_TYPE_TASK, ISSUE_TYPE_BUG } from '@/api/project_issue';
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";
import { showShortNote } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";

interface PrjTodoIssueListProps {
    issueType: ISSUE_TYPE;
}

const PrjTodoIssueList: React.FC<PrjTodoIssueListProps> = (props) => {
    const history = useHistory();

    const issueStore = useStores('issueStore');
    const linkAuxStore = useStores('linkAuxStore');
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const appStore = useStores('appStore');

    if (props.issueType == ISSUE_TYPE_TASK && issueStore.prjTodoTaskList.length == 0) {
        return (<></>);
    }
    if (props.issueType == ISSUE_TYPE_BUG && issueStore.prjTodoBugList.length == 0) {
        return (<></>);
    }
    return (
        <Popover content={
            <List pagination={false} className={cls.issue_list_wrap}>
                {props.issueType == ISSUE_TYPE_TASK && (
                    <>
                        {issueStore.prjTodoTaskList.map(item => (
                            <List.Item key={item.issue_id}>
                                <Space size="small">
                                    <div style={{ width: "230px" }}>
                                        <a onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            linkAuxStore.goToLink(new LinkTaskInfo("", item.project_id, item.issue_id, []), history);
                                        }}><LinkOutlined />&nbsp;{item.basic_info.title}</a>
                                    </div>
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        showShortNote(userStore.sessionId, {
                                            shortNoteType: props.issueType == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
                                            data: item,
                                        }, projectStore.curProject?.basic_info.project_name ?? "");
                                    }}><ExportOutlined /></a>
                                </Space>
                            </List.Item>
                        ))}
                    </>
                )}
                {props.issueType == ISSUE_TYPE_BUG && (
                    <>
                        {issueStore.prjTodoBugList.map(item => (
                            <List.Item key={item.issue_id}>
                                <Space size="small">
                                    <div style={{ width: "230px" }}>
                                        <a onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            linkAuxStore.goToLink(new LinkBugInfo("", item.project_id, item.issue_id, []), history);
                                        }}><LinkOutlined />&nbsp;{item.basic_info.title}</a>
                                    </div>
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        showShortNote(userStore.sessionId, {
                                            shortNoteType: props.issueType == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
                                            data: item,
                                        }, projectStore.curProject?.basic_info.project_name ?? "");
                                    }}><ExportOutlined /></a>
                                </Space>
                            </List.Item>
                        ))}
                    </>
                )}
            </List>
        } placement="right" trigger={[]}
            open={(props.issueType == ISSUE_TYPE_TASK && appStore.simpleModeExpand == "task") || (props.issueType == ISSUE_TYPE_BUG && appStore.simpleModeExpand == "bug")}>
            <div className={cls.content_wrap} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.issueType == ISSUE_TYPE_TASK) {
                    if (appStore.simpleModeExpand == "task") {
                        appStore.simpleModeExpand = null;
                    } else {
                        appStore.simpleModeExpand = "task";
                    }

                } else if (props.issueType == ISSUE_TYPE_BUG) {
                    if (appStore.simpleModeExpand == "bug") {
                        appStore.simpleModeExpand = null;
                    } else {
                        appStore.simpleModeExpand = "bug";
                    }
                }
            }}>
                {props.issueType == ISSUE_TYPE_TASK && (
                    <>
                        <Badge count={issueStore.prjTodoTaskList.length} className={cls.badge} dot={true} style={{ boxShadow: "none" }} /> 待处理任务
                    </>
                )}
                {props.issueType == ISSUE_TYPE_BUG && (
                    <>
                        <Badge count={issueStore.prjTodoBugList.length} className={cls.badge} dot={true} style={{ boxShadow: "none" }} /> 待处理缺陷
                    </>
                )}
            </div>
        </Popover>
    );
};

export default observer(PrjTodoIssueList);