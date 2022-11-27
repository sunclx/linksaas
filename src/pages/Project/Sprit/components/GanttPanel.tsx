import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './Panel.module.less';
import RcGantt from 'rc-gantt';
import { useStores } from "@/hooks";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";

interface GanttPanelProps {
    spritName: string;
    startTime: number;
    endTime: number;
}

const GanttPanel: React.FC<GanttPanelProps> = (props) => {
    const spritStore = useStores('spritStore');
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
                }}>任务：{task.basic_info.title}</a>,
                startDate: moment(task.start_time).format("YYYY-MM-DD"),
                endDate: moment(task.end_time).format("YYYY-MM-DD"),
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
                }}>缺陷：{bug.basic_info.title}</a>,
                startDate: moment(bug.start_time).format("YYYY-MM-DD"),
                endDate: moment(bug.end_time).format("YYYY-MM-DD"),
                disabled: true,
                estimateHour: (bug.estimate_minutes / 60).toFixed(1) + "小时",
                remainHour: (bug.remain_minutes / 60).toFixed(1) + "小时",
            });
        }
        const spritTask: Record<string, any> = {
            name: props.spritName,
            startDate: moment(props.startTime).format("YYYY-MM-DD"),
            endDate: moment(props.endTime).format("YYYY-MM-DD"),
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
                columns={[
                    {
                        name: 'name',
                        label: '名称',
                        width: 250,
                        maxWidth: 300,
                        minWidth: 200,
                    },
                    {
                        name: 'estimateHour',
                        label: '预估时间',
                        width: 100,
                        maxWidth: 100,
                        minWidth: 100,
                    },
                    {
                        name: 'remainHour',
                        label: '剩余时间',
                        width: 100,
                        maxWidth: 100,
                        minWidth: 100,
                    }
                ]} onUpdate={async () => {
                    return false
                }}
            />
        </div>
    );
}

export default observer(GanttPanel);