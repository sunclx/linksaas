import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './Panel.module.less';
import RcGantt from 'rc-gantt';
import { useStores } from "@/hooks";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import { ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE, ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS } from "@/api/project_issue";
import { issueState, ISSUE_STATE_COLOR_ENUM } from "@/utils/constant";
import { Space } from "antd";
import { LinkOutlined } from "@ant-design/icons";

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


interface GanttPanelProps {
    spritName: string;
    startTime: number;
    endTime: number;
}

const GanttPanel: React.FC<GanttPanelProps> = (props) => {
    const spritStore = useStores('spritStore');
    const userStore = useStores('userStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [taskList, setTaskList] = useState<Record<string, any>[]>([]);

    useEffect(() => {
        const tmpList: Record<string, any>[] = [];
        for (const task of spritStore.taskList) {
            tmpList.push({
                name: <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkTaskInfo("", task.project_id, task.issue_id), history);
                }}><LinkOutlined />&nbsp;任务：{task.basic_info.title}</a>,
                startDate: moment(task.start_time).format("YYYY-MM-DD"),
                endDate: moment(task.end_time).format("YYYY-MM-DD"),
                execDisplayName: task.exec_display_name,
                myExec: userStore.userInfo.userId == task.exec_user_id,
                checkDisplayName: task.check_display_name,
                myCheck: userStore.userInfo.userId == task.check_user_id,
                state: renderState(task.state),
                disabled: true,
                estimateHour: (task.estimate_minutes / 60).toFixed(1) + "小时",
                remainHour: (task.remain_minutes / 60).toFixed(1) + "小时",
            });
        }
        for (const bug of spritStore.bugList) {
            tmpList.push({
                name: <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkBugInfo("", bug.project_id, bug.issue_id), history);
                }}><LinkOutlined />&nbsp;缺陷：{bug.basic_info.title}</a>,
                startDate: moment(bug.start_time).format("YYYY-MM-DD"),
                endDate: moment(bug.end_time).format("YYYY-MM-DD"),
                execDisplayName: bug.exec_display_name,
                myExec: userStore.userInfo.userId == bug.exec_user_id,
                checkDisplayName: bug.check_display_name,
                myCheck: userStore.userInfo.userId == bug.check_user_id,
                state: renderState(bug.state),
                disabled: true,
                estimateHour: (bug.estimate_minutes / 60).toFixed(1) + "小时",
                remainHour: (bug.remain_minutes / 60).toFixed(1) + "小时",
            });
        }
        const spritTask: Record<string, any> = {
            name: props.spritName,
            startDate: moment(props.startTime).format("YYYY-MM-DD"),
            endDate: moment(props.endTime).format("YYYY-MM-DD"),
            execDisplayName: "",
            state: "",
            disabled: true,
            children: tmpList,
        };
        setTaskList([spritTask]);
    }, [spritStore.taskList, spritStore.bugList]);

    return (
        <div className={s.panel_wrap}>
            <RcGantt
                unit="day"
                showBackToday={true}
                data={taskList}
                tableCollapseAble={false}
                renderLeftText={() => <span />}
                renderRightText={(item) => {
                    return (<div style={{ display: "flex", backgroundColor: "#e4e4e8", padding: "2px 10px", borderRadius: "10px" }}>
                        {item.record.children == undefined &&
                            <Space>
                                {item.record.name} |
                                <div style={{display: "flex"}}>状态：{item.record.state} </div> |
                                <div>执行：{item.record.execDisplayName}{item.record.myExec && <span style={{ color: "red" }}>(我)</span>}</div>
                                {item.record.checkDisplayName != "" && (<div>检查：{item.record.checkDisplayName}{item.record.myCheck && <span style={{ color: "red" }}>(我)</span>}</div>)} |
                                <div>预估工时：{item.record.estimateHour}</div> |
                                <div>剩余时间：{item.record.remainHour}</div>
                            </Space>
                        }
                    </div>);
                }}
                columns={[]}
                disabled={true}
                onUpdate={async () => {
                    return false
                }}
            />
        </div>
    );
}

export default observer(GanttPanel);