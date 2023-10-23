import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import type { IssueInfo } from "@/api/project_issue";
import { ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE, ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS, ISSUE_TYPE_TASK } from "@/api/project_issue";
import { issueState, ISSUE_STATE_COLOR_ENUM } from "@/utils/constant";
import type { Task as GanttTask } from 'gantt-task-react';
import { Gantt, ViewMode, } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Descriptions } from "antd";

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

const renderState = (val: number) => {
    const v = issueState[val];
    return (
        <div
            style={{
                background: `rgb(${getColor(val)} / 20%)`,
                width: '50px',
                margin: '0 auto',
                borderRadius: '50px',
                textAlign: 'center',
                color: `rgb(${getColor(val)})`,
            }}
        >
            {v?.label}
        </div>
    );
};

const TooltipContent: React.FC<{
    task: GanttTask;
    fontSize: string;
    fontFamily: string;
}> = observer((props) => {
    const spritStore = useStores('spritStore');

    const [issue, setIssue] = useState<IssueInfo | null>(null);

    useEffect(() => {
        let index = spritStore.taskList.findIndex(item => item.issue_id == props.task.id);
        if (index != -1) {
            setIssue(spritStore.taskList[index]);
            return;
        }
        index = spritStore.bugList.findIndex(item => item.issue_id == props.task.id);
        if (index != -1) {
            setIssue(spritStore.bugList[index]);
            return;
        }
    }, [props.task.id]);
    return (
        <div style={{ backgroundColor: "white", padding: "10px 10px", border: "1px solid #e4e4e8" }}>
            {issue !== null && (
                <Descriptions title={`${issue.issue_type == ISSUE_TYPE_TASK ? "任务" : "缺陷"}:${issue.basic_info.title}`} bordered={true}>
                    <Descriptions.Item label="阶段">{renderState(issue.state)}</Descriptions.Item>
                    <Descriptions.Item label="预估时间">{(issue.estimate_minutes / 60).toFixed(1)}小时</Descriptions.Item>
                    <Descriptions.Item label="剩余时间">{(issue.remain_minutes / 60).toFixed(1)}小时</Descriptions.Item>
                    <Descriptions.Item label="预估开始时间">{moment(issue.start_time).format("YYYY-MM-DD")}</Descriptions.Item>
                    <Descriptions.Item label="预估结束时间">{moment(issue.end_time).format("YYYY-MM-DD")}</Descriptions.Item>
                    <Descriptions.Item label="截止时间">
                        {issue.has_dead_line_time == true && moment(issue.dead_line_time).format("YYYY-MM-DD")}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建者">{issue.create_display_name}</Descriptions.Item>
                    <Descriptions.Item label="执行者">{issue.exec_display_name}</Descriptions.Item>
                    <Descriptions.Item label="检查者">{issue.check_display_name}</Descriptions.Item>
                </Descriptions>
            )}
        </div>
    );
});

interface GanttPanelProps {
    spritName: string;
    startTime: number;
    endTime: number;
}

const GanttPanel: React.FC<GanttPanelProps> = (props) => {
    const spritStore = useStores('spritStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [taskList, setTaskList] = useState<GanttTask[]>([]);

    const calcName = (issue: IssueInfo): string => {
        const parts: string[] = [`状态:${issueState[issue.state].label}`];
        if (issue.exec_display_name != "") {
            parts.push("执行者:" + issue.exec_display_name);
        }
        if (issue.check_display_name != "") {
            parts.push("检查者:" + issue.check_display_name)
        }
        return `${issue.issue_type == ISSUE_TYPE_TASK ? "任务" : "缺陷"}:${issue.basic_info.title}(${parts.join(",")})`;
    }

    useEffect(() => {
        const tmpList: GanttTask[] = [];
        let totalEstimate = 0;
        let totalRemain = 0;
        for (const task of spritStore.taskList) {
            tmpList.push({
                id: task.issue_id,
                type: "task",
                name: calcName(task),
                start: moment(task.start_time).startOf("day").toDate(),
                end: moment(task.end_time).endOf("day").toDate(),
                progress: Math.floor((1 - task.remain_minutes / task.estimate_minutes) * 100),
            });
            totalEstimate += task.estimate_minutes;
            totalRemain += task.remain_minutes;
        }
        for (const bug of spritStore.bugList) {
            tmpList.push({
                id: bug.issue_id,
                type: "task",
                name: calcName(bug),
                start: moment(bug.start_time).startOf("day").toDate(),
                end: moment(bug.end_time).endOf("day").toDate(),
                progress: Math.floor((1 - bug.remain_minutes / bug.estimate_minutes) * 100),
            });
            totalEstimate += bug.estimate_minutes;
            totalRemain += bug.remain_minutes;
        }
        const spritTask: GanttTask = {
            id: projectStore.curEntry?.entry_id??"",
            type: "project",
            name: `${props.spritName}(${moment(props.startTime).format("YYYY-MM-DD")}至${moment(props.endTime).format("YYYY-MM-DD")})`,
            start: moment(props.startTime).startOf("day").toDate(),
            end: moment(props.endTime).endOf("day").toDate(),
            progress: Math.floor((1 - totalRemain / totalEstimate) * 100),
        };
        setTaskList([spritTask, ...tmpList]);
    }, [spritStore.taskList, spritStore.bugList]);

    return (
        <div style={{ height: (spritStore.taskList.length + spritStore.bugList.length) * 40 + 400 }}>
            {taskList.length > 0 && (
                <Gantt tasks={taskList} viewMode={ViewMode.Day} locale="chi" listCellWidth="" TooltipContent={TooltipContent}
                    rowHeight={40} rtl={false} preStepsCount={1}
                    onClick={task => {
                        if (spritStore.taskList.map(item => item.issue_id).includes(task.id)) {
                            linkAuxStore.goToLink(new LinkTaskInfo("", projectStore.curProjectId, task.id, spritStore.taskList.map(item => item.issue_id)), history);
                        } else if (spritStore.bugList.map(item => item.issue_id).includes(task.id)) {
                            linkAuxStore.goToLink(new LinkBugInfo("", projectStore.curProjectId, task.id, spritStore.bugList.map(item => item.issue_id)), history);
                        }
                    }} />
            )}
        </div>
    );
}

export default observer(GanttPanel);