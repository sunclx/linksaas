import type { IssueInfo, PROCESS_STAGE } from "@/api/project_issue";
import { ISSUE_STATE_PROCESS, PROCESS_STAGE_DOING, PROCESS_STAGE_DONE, PROCESS_STAGE_TODO } from "@/api/project_issue";

import { getIsTask, timeToDateString } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import s from './IssueDetailRight.module.less';
import { Timeline, Tooltip } from 'antd';
import type { PluginEvent } from '@/api/events';
import { EVENT_TYPE_BUG, EVENT_TYPE_TASK, EVENT_REF_TYPE_TASK, EVENT_REF_TYPE_BUG, list_event_by_ref } from '@/api/events';
import EventCom from "@/components/EventCom";
import { useStores } from "@/hooks";
import type { ListEventByRefRequest } from '@/api/events';
import { request } from '@/utils/request';
import { issueState } from "@/utils/constant";
import { EditText } from "@/components/EditCell/EditText";
import {
    cancelDeadLineTime, cancelEndTime, cancelEstimateMinutes, cancelRemainMinutes, cancelStartTime, getMemberSelectItems,
    getStateColor, updateCheckUser, updateDeadLineTime, updateEndTime, updateEstimateMinutes, updateExecUser, updateExtraInfo,
    updateProcessStage, updateRemainMinutes, updateStartTime
} from "./utils";
import { EditOutlined } from "@ant-design/icons";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { bugLvSelectItems, bugPrioritySelectItems, hourSelectItems, taskPrioritySelectItems } from "./constant";
import { EditDate } from "@/components/EditCell/EditDate";


type TimeLineType = PluginEvent;

export interface IssueDetailRightProps {
    issue: IssueInfo;
    dataVersion: number;
    onUpdate: () => void;
    setShowStageModal: () => void;
}

const IssueDetailRight: React.FC<IssueDetailRightProps> = (props) => {
    const { pathname } = useLocation();
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores("memberStore");

    const [timeLine, setTimeLine] = useState<TimeLineType[]>();

    const loadEvent = async () => {
        const req: ListEventByRefRequest = {
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            event_type: getIsTask(pathname) ? EVENT_TYPE_TASK : EVENT_TYPE_BUG,
            ref_type: getIsTask(pathname) ? EVENT_REF_TYPE_TASK : EVENT_REF_TYPE_BUG,
            ref_id: props.issue.issue_id,
        };
        const res = await request(list_event_by_ref(req));
        if (res) {
            setTimeLine(res.event_list);
        }
    }

    useEffect(() => {
        loadEvent();
    }, [props.issue.issue_id, props.dataVersion]);

    const memberSelectItems = getMemberSelectItems(memberStore.memberList.map(item => item.member));

    return (
        <div className={s.RightCom}>
            <div className={s.basic_info_wrap}>
                <div className={s.basic_info}>
                    <span>当前状态</span>
                    <div
                        tabIndex={0}
                        style={{
                            background: `rgb(${getStateColor(props.issue.state)} / 20%)`,
                            width: '70px',
                            borderRadius: '50px',
                            textAlign: 'center',
                            color: `rgb(${getStateColor(props.issue.state)})`,
                            cursor: `${props.issue.user_issue_perm.next_state_list.length > 0 ? "pointer" : "default"}`,
                            paddingLeft: "0px",
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.issue.user_issue_perm.next_state_list.length > 0) {
                                props.setShowStageModal();
                            }
                        }}
                    >
                        <Tooltip title={`${props.issue.user_issue_perm.next_state_list.length > 0 ? "" : "请等待同事更新状态"}`}>{issueState[props.issue.state].label}</Tooltip>
                        {props.issue.user_issue_perm.next_state_list.length > 0 && <a><EditOutlined /></a>}
                    </div>
                </div>
                {props.issue.state == ISSUE_STATE_PROCESS && (
                    <div className={s.basic_info}>
                        <span>执行阶段</span>
                        <div>
                            <EditSelect
                                allowClear={false}
                                editable={userStore.userInfo.userId == props.issue.exec_user_id}
                                curValue={props.issue.process_stage}
                                itemList={[
                                    {
                                        value: PROCESS_STAGE_TODO,
                                        label: "未开始",
                                        color: "black",
                                    },
                                    {
                                        value: PROCESS_STAGE_DOING,
                                        label: "执行中",
                                        color: "black",
                                    },
                                    {
                                        value: PROCESS_STAGE_DONE,
                                        label: "待检查",
                                        color: "black",
                                    },
                                ]} onChange={async (value) => {
                                    return await updateProcessStage(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, value as PROCESS_STAGE);
                                }} showEditIcon={true} /></div>
                    </div>
                )}
                {!getIsTask(pathname) && (
                    <>
                        <div className={s.basic_info}>
                            <span>级别</span>
                            <div>
                                <EditSelect
                                    allowClear={false}
                                    editable={props.issue.user_issue_perm.can_update}
                                    curValue={props.issue.extra_info.ExtraBugInfo!.level}
                                    itemList={bugLvSelectItems} onChange={async (value) => {
                                        return await updateExtraInfo(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, {
                                            ExtraBugInfo: {
                                                ...props.issue.extra_info.ExtraBugInfo!,
                                                level: value as number,
                                            },
                                        });
                                    }} showEditIcon={true} /></div>
                        </div>
                        <div className={s.basic_info}>
                            <span>优先级</span>
                            <div>
                                <EditSelect
                                    allowClear={false}
                                    editable={props.issue.user_issue_perm.can_update}
                                    curValue={props.issue.extra_info.ExtraBugInfo!.priority}
                                    itemList={bugPrioritySelectItems}
                                    onChange={async (value) => {
                                        return await updateExtraInfo(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, {
                                            ExtraBugInfo: {
                                                ...props.issue.extra_info.ExtraBugInfo!,
                                                priority: value as number,
                                            }
                                        });

                                    }} showEditIcon={true} />
                            </div>
                        </div>
                        <div className={s.basic_info}>
                            <span>软件版本</span>
                            <div>
                                <EditText editable={props.issue.user_issue_perm.can_update}
                                    content={props.issue.extra_info.ExtraBugInfo?.software_version ?? ""}
                                    onChange={async (value: string) => {
                                        return await updateExtraInfo(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, {
                                            ExtraBugInfo: {
                                                ...props.issue.extra_info.ExtraBugInfo!,
                                                software_version: value,
                                            },
                                        });
                                    }} showEditIcon={true} />
                            </div>
                        </div>

                    </>
                )}
                {getIsTask(pathname) && (
                    <div className={s.basic_info}>
                        <span>优先级</span>
                        <div><EditSelect
                            allowClear={false}
                            editable={props.issue.user_issue_perm.can_update}
                            curValue={props.issue.extra_info.ExtraTaskInfo!.priority}
                            itemList={taskPrioritySelectItems}
                            onChange={async (value) => {
                                return await updateExtraInfo(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, {
                                    ExtraTaskInfo: {
                                        ...props.issue.extra_info.ExtraTaskInfo!,
                                        priority: value as number,
                                    }
                                });

                            }} showEditIcon={true} />
                        </div>
                    </div>
                )}
                <div className={s.basic_info}>
                    <span>处理人</span>
                    <div>
                        <EditSelect
                            allowClear={false}
                            editable={props.issue.user_issue_perm.can_assign_exec_user}
                            curValue={props.issue.exec_user_id}
                            itemList={memberSelectItems}
                            onChange={async (value) => {
                                const res = await updateExecUser(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value as string);
                                if (res) {
                                    props.onUpdate();
                                }
                                return res;
                            }} showEditIcon={true} />
                    </div>
                </div>
                <div className={s.basic_info}>
                    <span>验收人</span>
                    <div>
                        <EditSelect
                            allowClear={false}
                            editable={props.issue.user_issue_perm.can_assign_check_user}
                            curValue={props.issue.check_user_id}
                            itemList={memberSelectItems}
                            onChange={async (value) => {
                                const res = await updateCheckUser(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value as string);
                                if (res) {
                                    props.onUpdate();
                                }
                                return res;
                            }} showEditIcon={true} />
                    </div>
                </div>
                <div className={s.basic_info}>
                    <span>截止时间</span>
                    <div>
                        <EditDate
                            editable={projectStore.isAdmin && props.issue.user_issue_perm.can_update}
                            hasTimeStamp={props.issue.has_dead_line_time}
                            timeStamp={props.issue.dead_line_time}
                            onChange={async (value) => {
                                if (value === undefined) {
                                    const res = await cancelDeadLineTime(userStore.sessionId, props.issue.project_id, props.issue.issue_id);
                                    if (res) {
                                        props.onUpdate();
                                    }
                                    return true;
                                }
                                const res = await updateDeadLineTime(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value);
                                if (res) {
                                    props.onUpdate();
                                }
                                return res;
                            }} showEditIcon={true} />
                    </div>
                </div>
                <div className={s.basic_info}>
                    <span>预估开始时间</span>
                    <div>
                        <EditDate
                            editable={props.issue.exec_user_id == userStore.userInfo.userId && props.issue.state == ISSUE_STATE_PROCESS}
                            hasTimeStamp={props.issue.has_start_time}
                            timeStamp={props.issue.start_time}
                            onChange={async (value) => {
                                if (value === undefined) {
                                    const res = await cancelStartTime(userStore.sessionId, props.issue.project_id, props.issue.issue_id);
                                    if (res) {
                                        props.onUpdate();
                                    }
                                    return true;
                                }
                                const res = await updateStartTime(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value);
                                if (res) {
                                    props.onUpdate();
                                }
                                return res;
                            }} showEditIcon={true} />
                    </div>
                </div>
                <div className={s.basic_info}>
                    <span>预估完成时间</span>
                    <div>
                        <EditDate
                            editable={props.issue.exec_user_id == userStore.userInfo.userId && props.issue.state == ISSUE_STATE_PROCESS}
                            hasTimeStamp={props.issue.has_end_time}
                            timeStamp={props.issue.end_time}
                            onChange={async (value) => {
                                if (value === undefined) {
                                    const res = await cancelEndTime(userStore.sessionId, props.issue.project_id, props.issue.issue_id);
                                    if (res) {
                                        props.onUpdate();
                                    }
                                    return true;
                                }
                                const res = await updateEndTime(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value);
                                if (res) {
                                    props.onUpdate();
                                }
                                return res;
                            }} showEditIcon={true} />
                    </div>
                </div>
                <div className={s.basic_info}>
                    <span>预估工时</span>
                    <div>
                        <EditSelect
                            allowClear={true}
                            editable={props.issue.exec_user_id == userStore.userInfo.userId && props.issue.state == ISSUE_STATE_PROCESS}
                            curValue={props.issue.has_estimate_minutes ? props.issue.estimate_minutes : ""}
                            itemList={hourSelectItems}
                            onChange={async (value) => {
                                if (value === undefined) {
                                    const res = await cancelEstimateMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id);
                                    if (res) {
                                        props.onUpdate();
                                    }
                                    return res;
                                }
                                const res = await updateEstimateMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value as number);
                                if (res) {
                                    props.onUpdate();
                                }
                                return res;
                            }} showEditIcon={true} />
                    </div>
                </div>
                <div className={s.basic_info}>
                    <span>剩余工时</span>
                    <div>
                        <EditSelect
                            allowClear={true}
                            editable={props.issue.exec_user_id == userStore.userInfo.userId && props.issue.state == ISSUE_STATE_PROCESS}
                            curValue={props.issue.has_remain_minutes ? props.issue.remain_minutes : ""}
                            itemList={hourSelectItems}
                            onChange={async (value) => {
                                if (value === undefined) {
                                    const res = await cancelRemainMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id)
                                    if (res) {
                                        props.onUpdate();
                                    }
                                    return res;
                                }
                                const res = await updateRemainMinutes(userStore.sessionId, props.issue.project_id, props.issue.issue_id, value as number);
                                if (res) {
                                    props.onUpdate();
                                }
                                return res;
                            }} showEditIcon={true} />
                    </div>
                </div>
            </div>
            <div className={s.hr} />
            <div
                className={s.time_line_wrap}
                style={{
                    height: `${getIsTask(pathname) ? 'calc(100% - 330px)' : 'calc(100% - 390px)'}`
                }}
            >
                <h2>动态</h2>
                <Timeline className={s.timeLine} reverse={true}>
                    {timeLine?.map((item) => (
                        <Timeline.Item color="gray" key={item.event_id}>
                            <p>{item.cur_user_display_name}&nbsp;{timeToDateString(item.event_time)}</p>
                            <EventCom key={item.event_id} item={item} skipProjectName={true} skipLink={true} showMoreLink={true} />
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        </div>
    );
};

export default IssueDetailRight;