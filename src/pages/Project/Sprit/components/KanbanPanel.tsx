import React, { useEffect, useState } from "react";
import s from './Panel.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import type { IssueInfo, ISSUE_STATE } from "@/api/project_issue";
import { ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE, ISSUE_TYPE_TASK, ISSUE_TYPE_BUG, assign_check_user, assign_exec_user, change_state } from "@/api/project_issue";
import { Card, Empty } from "antd";
import { request } from "@/utils/request";
import MemberSelect from "@/components/MemberSelect";
import { bugLevel, bugPriority, taskPriority } from "@/utils/constant";
import { useHistory } from "react-router-dom";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { cancelEstimateMinutes, cancelRemainMinutes, updateEstimateMinutes, updateRemainMinutes } from "@/pages/Issue/components/utils";
import { hourSelectItems } from "@/pages/Issue/components/constant";
import { showShortNote } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import { ExportOutlined } from "@ant-design/icons";

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
    const spritStore = useStores('spritStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [{ isDragging }, drag] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: props.issue,
        canDrag: props.issue.user_issue_perm.next_state_list.length != 0,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const assignExecUser = async (memberUserId: string) => {
        await request(assign_exec_user(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, memberUserId));
        await spritStore.updateIssue(props.issue.issue_id);
    };

    const assignCheckUser = async (memberUserId: string) => {
        await request(assign_check_user(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, memberUserId));
        await spritStore.updateIssue(props.issue.issue_id);
    };

    return (
        <div ref={drag} style={{
            display: isDragging ? "none" : "block",
            cursor: isDragging ? "pointer" : "move",
        }}>
            <Card title={`${props.issue.issue_type == ISSUE_TYPE_TASK ? "任务" : "缺陷"} ${props.issue.issue_index}`}
                style={{ backgroundColor: "#fafafa", marginBottom: "10px" }}
                headStyle={{ backgroundColor: "#e4e4e8", fontSize: "14px", fontWeight: 500, textAlign: "center" }}
                extra={
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        showShortNote(userStore.sessionId, {
                            shortNoteType: props.issue.issue_type == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
                            data: props.issue,
                        }, projectStore.curProject?.basic_info.project_name ?? "");
                    }}><ExportOutlined style={{ fontSize: "16px" }} /></a>
                }>
                <div className={s.row}>
                    <div className={s.label}>
                        标题:
                    </div>
                    <div className={s.value}>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.issue.issue_type == ISSUE_TYPE_TASK) {
                                linkAuxStore.goToLink(new LinkTaskInfo("", projectStore.curProjectId, props.issue.issue_id), history);
                            } else if (props.issue.issue_type == ISSUE_TYPE_BUG) {
                                linkAuxStore.goToLink(new LinkBugInfo("", projectStore.curProjectId, props.issue.issue_id), history);
                            }
                        }}>{props.issue.basic_info.title}</a>
                    </div>
                </div>
                <div className={s.row}>
                    <div className={s.label}>
                        执行人:
                    </div>
                    <div className={s.value}>
                        <MemberSelect value={props.issue.exec_user_id} disabled={props.issue.user_issue_perm.can_assign_exec_user == false}
                            onChange={value => assignExecUser(value)} />
                    </div>
                </div>
                <div className={s.row}>
                    <div className={s.label}>
                        检查人:
                    </div>
                    <div className={s.value}>
                        <MemberSelect value={props.issue.check_user_id} disabled={props.issue.user_issue_perm.can_assign_check_user == false}
                            onChange={value => assignCheckUser(value)} />
                    </div>
                </div>
                {props.issue.issue_type == ISSUE_TYPE_TASK && (
                    <>
                        <div className={s.row}>
                            <div className={s.label}>
                                优先级:
                            </div>
                            <div className={s.value}>
                                <span style={{ color: taskPriority[props.issue.extra_info.ExtraTaskInfo?.priority ?? 0].color }}>
                                    {taskPriority[props.issue.extra_info.ExtraTaskInfo?.priority ?? 0].label}
                                </span>
                            </div>
                        </div>
                    </>
                )}
                {props.issue.issue_type == ISSUE_TYPE_BUG && (
                    <>
                        <div className={s.row}>
                            <div className={s.label}>
                                优先级:
                            </div>
                            <div className={s.value}>
                                <span style={{ color: bugPriority[props.issue.extra_info.ExtraBugInfo?.priority ?? 0].color }}>
                                    {bugPriority[props.issue.extra_info.ExtraBugInfo?.priority ?? 0].label}
                                </span>
                            </div>
                        </div>
                        <div className={s.row}>
                            <div className={s.label}>
                                级别:
                            </div>
                            <div className={s.value}>
                                <span style={{ color: bugLevel[props.issue.extra_info.ExtraBugInfo?.level ?? 0].color }}>
                                    {bugLevel[props.issue.extra_info.ExtraBugInfo?.level ?? 0].label}
                                </span>
                            </div>
                        </div>
                    </>
                )}
                <div className={s.row}>
                    <div className={s.label}>
                        预估工时:
                    </div>
                    <div className={s.value}>
                        <EditSelect
                            allowClear={false}
                            editable={props.issue.exec_user_id == userStore.userInfo.userId && props.issue.state == ISSUE_STATE_PROCESS}
                            curValue={props.issue.has_estimate_minutes ? props.issue.estimate_minutes : -1}
                            itemList={hourSelectItems}
                            onChange={async (value) => {
                                if (value === undefined) {
                                    return await cancelEstimateMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id);
                                }
                                return await updateEstimateMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value as number);
                            }} showEditIcon={true} />
                    </div>
                </div>
                <div className={s.row}>
                    <div className={s.label}>
                        剩余工时:
                    </div>
                    <div className={s.value}>
                        <EditSelect
                            allowClear={true}
                            editable={props.issue.exec_user_id == userStore.userInfo.userId && props.issue.state == ISSUE_STATE_PROCESS}
                            curValue={props.issue.has_remain_minutes ? props.issue.remain_minutes : -1}
                            itemList={hourSelectItems}
                            onChange={async (value) => {
                                if (value === undefined) {
                                    return await cancelRemainMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id);
                                }
                                return await updateRemainMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value as number);
                            }} showEditIcon={true} />
                    </div>
                </div>
            </Card>
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
            <Card title="规划中" headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} />}
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
            <Card title="进行中" style={{ backgroundColor: isOver ? "#e4e4e8" : "inherit" }} headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} />}
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
            <Card title="检查中" style={{ backgroundColor: isOver ? "#e4e4e8" : "inherit" }} headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} />}
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
            <Card title="完成" style={{ backgroundColor: isOver ? "#e4e4e8" : "inherit" }} headStyle={{ fontSize: "18px", fontWeight: 700, backgroundColor: "#e4e4e8", textAlign: "center" }}>
                {issueList?.length == 0 && <Empty style={{ marginTop: '10%' }} />}
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
            <div className={s.panel_wrap}>
                <div className={s.kanban_column_list}>
                    <PlanIssueColumn />
                    <ProcessIssueColumn />
                    <CheckIssueColumn />
                    <CloseIssueColumn />
                </div>
            </div>
        </DndProvider>
    );
};


export default KanbanPanel;