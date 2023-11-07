import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { useHistory } from "react-router-dom";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import { Descriptions } from "antd";
import { getStateColor } from "@/pages/Issue/components/utils";
import { bugPriority, issueState, taskPriority } from "@/utils/constant";
import type { ExtraBugInfo, ExtraTaskInfo, IssueInfo } from "@/api/project_issue";
import { ISSUE_TYPE_TASK } from "@/api/project_issue";
import { issueTypeIsTask, timeToDateString } from "@/utils/utils";
import RenderSelectOpt from "@/components/RenderSelectOpt";
import moment from "moment";

export interface IssueCardProps {
    issueInfo: IssueInfo;
}

const IssueCard = (props: IssueCardProps) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const getExtraInfoType = (row: IssueInfo): ExtraTaskInfo | ExtraBugInfo | undefined => {
        const isTask = issueTypeIsTask(row);
        return isTask ? row.extra_info.ExtraTaskInfo : row.extra_info.ExtraBugInfo;
    };

    const renderName = (id: string, name: string) => {
        if (!id) return '-';
        const isCurrentUser = id === userStore.userInfo.userId;
        return isCurrentUser ? <span style={{ color: 'red' }}>{name}</span> : <span>{name}</span>;
    };

    const renderManHour = (has: boolean, v: number) => {
        return has ? v / 60 + 'h' : '-';
    };

    const renderEndTime = (has: boolean, v: number) => {
        if (!has) return '-';
        const isPast = v < moment().startOf('days').valueOf();
        return isPast ? (
            <span style={{ color: 'red' }}>{timeToDateString(v, 'YYYY-MM-DD')}</span>
        ) : (
            <span>{timeToDateString(v, 'YYYY-MM-DD')}</span>
        );
    };

    return (
        <div>
            <p><a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.issueInfo.issue_type == ISSUE_TYPE_TASK) {
                    linkAuxStore.goToLink(new LinkTaskInfo("", projectStore.curProjectId, props.issueInfo.issue_id), history);
                } else {
                    linkAuxStore.goToLink(new LinkBugInfo("", projectStore.curProjectId, props.issueInfo.issue_id), history);
                }
            }} style={{ fontSize: "16px", fontWeight: 600 }}>{props.issueInfo.basic_info.title}</a></p>
            <Descriptions column={1} labelStyle={{ width: "90px" }}>
                <Descriptions.Item label="状态">
                    <div
                        style={{
                            background: `rgb(${getStateColor(props.issueInfo.state)} / 20%)`,
                            width: '50px',
                            margin: '0 auto',
                            borderRadius: '50px',
                            textAlign: 'center',
                            color: `rgb(${getStateColor(props.issueInfo.state)})`,
                        }}
                    >
                        {issueState[props.issueInfo.state].label}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="优先级别">
                    {RenderSelectOpt(props.issueInfo.issue_type == ISSUE_TYPE_TASK ?
                        taskPriority[getExtraInfoType(props.issueInfo)?.priority || 0] : bugPriority[getExtraInfoType(props.issueInfo)?.priority || 0])}
                </Descriptions.Item>
                {props.issueInfo.exec_user_id != "" && (
                    <Descriptions.Item label="执行人">
                        {renderName(props.issueInfo.exec_user_id, props.issueInfo.exec_display_name)}
                    </Descriptions.Item>
                )}
                {props.issueInfo.check_user_id != "" && (
                    <Descriptions.Item label="检查人">
                        {renderName(props.issueInfo.check_user_id, props.issueInfo.check_display_name)}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="剩余工时">
                    {renderManHour(props.issueInfo.has_remain_minutes, props.issueInfo.remain_minutes)}
                </Descriptions.Item>
                <Descriptions.Item label="预估工时">
                    {renderManHour(props.issueInfo.has_estimate_minutes, props.issueInfo.estimate_minutes)}
                </Descriptions.Item>
                <Descriptions.Item label="预估完成时间">
                    {renderEndTime(props.issueInfo.has_end_time, props.issueInfo.end_time)}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
};


export default observer(IssueCard);