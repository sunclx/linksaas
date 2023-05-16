import React, { useEffect, useState } from "react";
import s from './Panel.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import type { IssueInfo, ISSUE_STATE } from "@/api/project_issue";
import { ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE, ISSUE_TYPE_TASK, ISSUE_TYPE_BUG, change_state } from "@/api/project_issue";
import { Card, Empty, Popover, Progress, Space, Tag } from "antd";
import { request } from "@/utils/request";
import { bugLevel, bugPriority, taskPriority } from "@/utils/constant";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { EditOutlined, ExportOutlined, WarningOutlined } from "@ant-design/icons";
import { showShortNote } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";

const DND_ITEM_TYPE = "issue";

const filterIssueList = (taskList: IssueInfo[], bugList: IssueInfo[], state: ISSUE_STATE) => {
    const retList: IssueInfo[] = [];
    taskList.forEach(item => {
        if (item.state == state) {
            retList.push(item);
        }
    });
    bugList.forEach(item => {
        if (item.state == state) {
            retList.push(item);
        }
    });
    retList.sort((a: IssueInfo, b: IssueInfo) => b.update_time - a.update_time);
    return retList;
}

interface IssueCardProps {
    issue: IssueInfo;
}

const IssueCard: React.FC<IssueCardProps> = observer((props) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const memberStore = useStores('memberStore');

    const [{ isDragging }, drag] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: props.issue,
        canDrag: props.issue.user_issue_perm.next_state_list.length != 0,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} style={{
            display: isDragging ? "none" : "block",
            cursor: isDragging ? "pointer" : "move",
        }}>
            <div style={{ marginBottom: "10px", backgroundColor: props.issue.user_issue_perm.next_state_list.length != 0 ? "#faccff" : "#ddd", padding: "10px 10px", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ flex: 1, fontSize: "14px", fontWeight: 600 }}>{`${props.issue.issue_type == ISSUE_TYPE_TASK ? "任务" : "缺陷"} #${props.issue.issue_index}`}</div>
                    <Space>
                        {props.issue.exec_user_id != "" && (
                            <Popover trigger="hover" content={
                                <div style={{ padding: "10px 10px" }}>执行人: {memberStore.getMember(props.issue.exec_user_id)?.member.display_name ?? ""}</div>
                            } style={{ cursor: "default" }}>
                                <div style={{ cursor: "default" }}>
                                    <UserPhoto logoUri={memberStore.getMember(props.issue.exec_user_id)?.member.logo_uri ?? ""} width="20px"
                                        style={{ borderRadius: "10px" }} />
                                </div>
                            </Popover>
                        )}
                        {props.issue.check_user_id != "" && (
                            <Popover trigger="hover" content={
                                <div style={{ padding: "10px 10px" }}>检查人: {memberStore.getMember(props.issue.check_user_id)?.member.display_name ?? ""}</div>
                            } style={{ cursor: "default" }}>
                                <div style={{ cursor: "default" }}>
                                    <UserPhoto logoUri={memberStore.getMember(props.issue.check_user_id)?.member.logo_uri ?? ""} width="20px"
                                        style={{ borderRadius: "10px" }} />
                                </div>
                            </Popover>
                        )}
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            showShortNote(userStore.sessionId, {
                                shortNoteType: props.issue.issue_type == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
                                data: props.issue,
                            }, projectStore.curProject?.basic_info.project_name ?? "");

                        }}><ExportOutlined style={{ width: "20px" }} /></a>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.issue.issue_type == ISSUE_TYPE_TASK) {
                                linkAuxStore.goToLink(new LinkTaskInfo("", props.issue.project_id, props.issue.issue_id), history);
                            } else if (props.issue.issue_type == ISSUE_TYPE_BUG) {
                                linkAuxStore.goToLink(new LinkBugInfo("", props.issue.project_id, props.issue.issue_id), history);
                            }
                        }}><EditOutlined style={{ width: "20px" }} /></a>
                    </Space>
                </div>
                <h4>{props.issue.basic_info.title}</h4>
                {props.issue.estimate_minutes > 0 && props.issue.remain_minutes >= 0 && props.issue.state == ISSUE_STATE_PROCESS && (
                    <div>
                        <Progress
                            percent={Math.round((props.issue.estimate_minutes - props.issue.remain_minutes) / props.issue.estimate_minutes * 100)}
                            size="small"
                            showInfo={false} />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            {(props.issue.remain_minutes / 60).toFixed(1)}小时(剩余)&nbsp;/&nbsp;{(props.issue.estimate_minutes / 60).toFixed(1)}小时(预估)
                        </div>
                    </div>
                )}
                <div>
                    {props.issue.exec_user_id == "" && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea", color: "red" }}>
                            <span><WarningOutlined />&nbsp;未设置执行人</span>
                        </Tag>
                    )}
                    {props.issue.check_user_id == "" && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span><WarningOutlined />&nbsp;未设置检查人</span>
                        </Tag>
                    )}
                    {props.issue.state == ISSUE_STATE_PROCESS && props.issue.estimate_minutes <= 0 && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span><WarningOutlined />&nbsp;未设置预估时间</span>
                        </Tag>
                    )}
                    {props.issue.issue_type == ISSUE_TYPE_TASK && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span style={{ color: taskPriority[props.issue.extra_info.ExtraTaskInfo?.priority ?? 0].color }}>
                                优先级{taskPriority[props.issue.extra_info.ExtraTaskInfo?.priority ?? 0].label}
                            </span>
                        </Tag>
                    )}
                    {props.issue.issue_type == ISSUE_TYPE_BUG && (
                        <>
                            <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                                <span style={{ color: bugPriority[props.issue.extra_info.ExtraBugInfo?.priority ?? 0].color }}>{bugPriority[props.issue.extra_info.ExtraBugInfo?.priority ?? 0].label}</span>
                            </Tag>
                            <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                                缺陷级别:&nbsp;
                                <span style={{ color: bugLevel[props.issue.extra_info.ExtraBugInfo?.level ?? 0].color }}>{bugLevel[props.issue.extra_info.ExtraBugInfo?.level ?? 0].label}</span>
                            </Tag>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

const PlanIssueColumn = observer(() => {
    const spritStore = useStores('spritStore');
    const [issueList, setIssueList] = useState<IssueInfo[]>();

    useEffect(() => {
        setIssueList(filterIssueList(spritStore.taskList, spritStore.bugList, ISSUE_STATE_PLAN));
    }, [spritStore.taskList, spritStore.bugList]);

    return (
        <div className={s.kanban_column}>
            <Card title="规划中" style={{ border: "2px solid #e4e4e8", borderBottom: "none" }}
                headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}
                bodyStyle={{ minHeight: "calc(100vh - 200px)" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} description="" />}
                {issueList?.map(item => (
                    <IssueCard issue={item} key={item.issue_id} />
                ))}
            </Card>
        </div>
    );
});

const ProcessIssueColumn = observer(() => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');
    const [issueList, setIssueList] = useState<IssueInfo[]>();

    const setProcess = async (issue: IssueInfo) => {
        if (issue.exec_user_id == "") {
            return;
        }
        await request(change_state({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: issue.issue_id,
            state: ISSUE_STATE_PROCESS,
        }));
        await spritStore.updateIssue(issue.issue_id);
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: IssueInfo) => setProcess(item),
        canDrop: (item: IssueInfo) => item.exec_user_id != "" && item.user_issue_perm.next_state_list.includes(ISSUE_STATE_PROCESS),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    useEffect(() => {
        setIssueList(filterIssueList(spritStore.taskList, spritStore.bugList, ISSUE_STATE_PROCESS));
    }, [spritStore.taskList, spritStore.bugList]);

    return (
        <div className={s.kanban_column} ref={drop}>
            <Card title="进行中" style={{ backgroundColor: isOver ? "#e4e4e8" : "inherit", border: "2px solid #e4e4e8", borderBottom: "none" }}
                headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}
                bodyStyle={{ minHeight: "calc(100vh - 200px)" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} description="" />}
                {issueList?.map(item => (
                    <IssueCard issue={item} key={item.issue_id} />
                ))}
            </Card>
        </div>
    );
});

const CheckIssueColumn = observer(() => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');
    const [issueList, setIssueList] = useState<IssueInfo[]>();

    const setCheck = async (issue: IssueInfo) => {
        if (issue.check_user_id == "") {
            return;
        }
        await request(change_state({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: issue.issue_id,
            state: ISSUE_STATE_CHECK,
        }));
        await spritStore.updateIssue(issue.issue_id);
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: IssueInfo) => setCheck(item),
        canDrop: (item: IssueInfo) => item.check_user_id != "" && item.user_issue_perm.next_state_list.includes(ISSUE_STATE_CHECK),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    useEffect(() => {
        setIssueList(filterIssueList(spritStore.taskList, spritStore.bugList, ISSUE_STATE_CHECK));
    }, [spritStore.taskList, spritStore.bugList]);

    return (
        <div className={s.kanban_column} ref={drop}>
            <Card title="检查中" style={{ backgroundColor: isOver ? "#e4e4e8" : "inherit", border: "2px solid #e4e4e8", borderBottom: "none" }}
                headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}
                bodyStyle={{ minHeight: "calc(100vh - 200px)" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} description="" />}
                {issueList?.map(item => (
                    <IssueCard issue={item} key={item.issue_id} />
                ))}
            </Card>
        </div>
    );
});

const CloseIssueColumn = observer(() => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');
    const [issueList, setIssueList] = useState<IssueInfo[]>();

    const setClose = async (issue: IssueInfo) => {
        await request(change_state({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: issue.issue_id,
            state: ISSUE_STATE_CLOSE,
        }));
        await spritStore.updateIssue(issue.issue_id);
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: IssueInfo) => setClose(item),
        canDrop: (item: IssueInfo) => item.user_issue_perm.next_state_list.includes(ISSUE_STATE_CLOSE),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    useEffect(() => {
        setIssueList(filterIssueList(spritStore.taskList, spritStore.bugList, ISSUE_STATE_CLOSE));
    }, [spritStore.taskList, spritStore.bugList]);

    return (
        <div className={s.kanban_column} ref={drop}>
            <Card title="完成" style={{ backgroundColor: isOver ? "#e4e4e8" : "inherit", border: "2px solid #e4e4e8", borderBottom: "none" }}
                headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}
                bodyStyle={{ minHeight: "calc(100vh - 200px)" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} description="" />}
                {issueList?.map(item => (
                    <IssueCard issue={item} key={item.issue_id} />
                ))}
            </Card>
        </div>
    );
});

const KanbanPanel = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={s.kanban_column_list}>
                <PlanIssueColumn />
                <ProcessIssueColumn />
                <CheckIssueColumn />
                <CloseIssueColumn />
            </div>
        </DndProvider>
    );
};


export default KanbanPanel;