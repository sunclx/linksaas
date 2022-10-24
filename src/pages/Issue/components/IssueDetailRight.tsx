import { IssueInfo, ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE, ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS } from "@/api/project_issue";
import { getIsTask, timeToDateString } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import s from './IssueDetailRight.module.less';
import { Timeline, Tooltip, } from 'antd';
import type { PluginEvent } from '@/api/events';
import { EVENT_TYPE_BUG, EVENT_TYPE_TASK, EVENT_REF_TYPE_TASK, EVENT_REF_TYPE_BUG, list_event_by_ref } from '@/api/events';
import EventCom from "@/components/EventCom";
import { useStores } from "@/hooks";
import type { ListEventByRefRequest } from '@/api/events';
import { request } from '@/utils/request';
import { issueState, ISSUE_STATE_COLOR_ENUM } from "@/utils/constant";
import { EditText } from "@/components/EditCell/EditText";


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
    }, [props.issue.issue_id, props.dataVersion])

    const getColor = (v: number) => {
        switch (v) {
            case ISSUE_STATE_PLAN:
                return ISSUE_STATE_COLOR_ENUM.规划中颜色;
            case ISSUE_STATE_PROCESS:
                return ISSUE_STATE_COLOR_ENUM.处理颜色;
            case ISSUE_STATE_CHECK:
                return ISSUE_STATE_COLOR_ENUM.验收颜色;
            case ISSUE_STATE_CLOSE:
                return ISSUE_STATE_COLOR_ENUM.关闭颜色;
            default:
                return ISSUE_STATE_COLOR_ENUM.规划中颜色;
        }
    };

    return (
        <div className={s.RightCom}>
            <div className={s.basic_info_wrap}>
                <div className={s.basic_info}>
                    <span>当前阶段</span>
                    <div
                        tabIndex={0}
                        style={{
                            background: `rgb(${getColor(props.issue.state)} / 20%)`,
                            width: '50px',
                            borderRadius: '50px',
                            textAlign: 'center',
                            color: `rgb(${getColor(props.issue.state)})`,
                            cursor: `${props.issue.user_issue_perm.next_state_list.length > 0 ? "pointer" : "default"}`,
                            margin: '0 auto',
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.issue.user_issue_perm.next_state_list.length > 0) {
                                props.setShowStageModal();
                            }
                        }}
                    >
                        <Tooltip title={""}>{issueState[props.issue.state].label}</Tooltip>
                    </div>
                </div>
                {!getIsTask(pathname) && (
                    <>
                        <div className={s.basic_info}>
                            <span>软件版本</span>
                            <EditText editable={true}
                                content={props.issue.extra_info.ExtraBugInfo?.software_version ?? ""}
                                onChange={async (content: string) => {
                                    //TODO
                                    return false;
                                }} showEditIcon={true} />
                        </div>
                        <div className={s.basic_info}>
                            <span>级别</span>
                            <div>XXX</div>
                        </div>
                    </>
                )}
            </div>
            <div className={s.hr} />
            <div
                className={s.time_line_wrap}
                style={{
                    height: `${!getIsTask(pathname) ? 'calc(100% - 470px)' : 'calc(100% - 390px)'}`,
                }}
            >
                <h2>动态</h2>
                <Timeline className={`${s.timeLine} detailsTimeline`} reverse={true}>
                    {timeLine?.map((item) => (
                        <Timeline.Item color="gray" key={item.event_id}>
                            <p>{timeToDateString(item.event_time)}</p>
                            <EventCom item={item} skipProjectName={true} skipLink={true} showMoreLink={true} />
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        </div>
    );
};

export default IssueDetailRight;