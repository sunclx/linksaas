import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { ColumnsType } from 'antd/lib/table';
import { useStores } from "@/hooks";
import { ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE, ISSUE_STATE_PROCESS } from "@/api/project_issue";
import { Table } from 'antd';

interface StatInfo {
    memberUserId: string
    name: string
    totalTaskCount: number;
    inExecTaskCount: number;
    inCheckTaskCount: number;
    doneTaskCount: number;
    totalTaskHour: number;
    remainTaskHour: number;
    taskProgress: number;

    totalBugCount: number;
    inExecBugCount: number;
    inCheckBugCount: number;
    doneBugCount: number;
    totalBugHour: number;
    remainBugHour: number;
    bugProgress: number;

}


const StatPanel = () => {
    const spritStore = useStores('spritStore');
    const memberStore = useStores('memberStore');

    const [statInfoList, setStatInfoList] = useState<StatInfo[]>([]);

    const genStatInfo = () => {
        const tmpList: StatInfo[] = [];
        memberStore.memberList.forEach(member => {
            const tmpStat = {
                memberUserId: member.member.member_user_id,
                name: member.member.display_name,
                totalTaskCount: 0,
                inExecTaskCount: 0,
                inCheckTaskCount: 0,
                doneTaskCount: 0,
                totalTaskHour: 0,
                remainTaskHour: 0,
                taskProgress: 0,

                totalBugCount: 0,
                inExecBugCount: 0,
                inCheckBugCount: 0,
                doneBugCount: 0,
                totalBugHour: 0,
                remainBugHour: 0,
                bugProgress: 0,
            };
            for (const task of spritStore.taskList) {
                if (task.exec_user_id == tmpStat.memberUserId || task.check_user_id == tmpStat.memberUserId) {
                    tmpStat.totalTaskCount += 1;
                }

                if (task.exec_user_id == tmpStat.memberUserId && task.state == ISSUE_STATE_PROCESS) {
                    tmpStat.inExecTaskCount += 1;
                } else if (task.check_user_id == tmpStat.memberUserId && task.state == ISSUE_STATE_CHECK) {
                    tmpStat.inCheckTaskCount += 1
                } else if (task.state == ISSUE_STATE_CLOSE) {
                    tmpStat.doneTaskCount += 1
                }

                if (task.exec_user_id == tmpStat.memberUserId) {
                    tmpStat.totalTaskHour += (task.estimate_minutes / 60);
                    tmpStat.remainTaskHour += (task.remain_minutes / 60);
                }
            }
            for (const bug of spritStore.bugList) {
                if (bug.exec_user_id == tmpStat.memberUserId || bug.check_user_id == tmpStat.memberUserId) {
                    tmpStat.totalBugCount += 1;
                }

                if (bug.exec_user_id == tmpStat.memberUserId && bug.state == ISSUE_STATE_PROCESS) {
                    tmpStat.inExecBugCount += 1;
                } else if (bug.check_user_id == tmpStat.memberUserId && bug.state == ISSUE_STATE_CHECK) {
                    tmpStat.inCheckBugCount += 1
                } else if (bug.state == ISSUE_STATE_CLOSE) {
                    tmpStat.doneBugCount += 1
                }

                if (bug.exec_user_id == tmpStat.memberUserId) {
                    tmpStat.totalBugHour += (bug.estimate_minutes / 60);
                    tmpStat.remainBugHour += (bug.remain_minutes / 60);
                }
            }
            if (tmpStat.totalBugCount == 0 && tmpStat.totalTaskCount == 0) {
                return;
            }
            if (tmpStat.totalTaskHour > 0.00000000000001) {
                tmpStat.taskProgress = 1.0 - tmpStat.remainTaskHour / tmpStat.totalTaskHour;
            }
            if (tmpStat.totalBugHour > 0.00000000000001) {
                tmpStat.bugProgress = 1.0 - tmpStat.remainBugHour / tmpStat.totalBugHour;
            }
            tmpList.push(tmpStat);
        })
        //计算累计值
        const allStat = {
            memberUserId: "",
            name: "总计",
            totalTaskCount: 0,
            inExecTaskCount: 0,
            inCheckTaskCount: 0,
            doneTaskCount: 0,
            totalTaskHour: 0,
            remainTaskHour: 0,
            taskProgress: 0,

            totalBugCount: 0,
            inExecBugCount: 0,
            inCheckBugCount: 0,
            doneBugCount: 0,
            totalBugHour: 0,
            remainBugHour: 0,
            bugProgress: 0,
        };
        for (const stat of tmpList) {
            allStat.totalTaskCount += stat.totalTaskCount;
            allStat.inExecTaskCount += stat.inExecTaskCount;
            allStat.inCheckTaskCount += stat.inCheckTaskCount;
            allStat.doneTaskCount += stat.doneTaskCount;
            allStat.totalTaskHour += stat.totalTaskHour;
            allStat.remainTaskHour += stat.remainTaskHour;

            allStat.totalBugCount += stat.totalBugCount
            allStat.inExecBugCount += stat.inExecBugCount
            allStat.inCheckBugCount += stat.inCheckBugCount
            allStat.doneBugCount += stat.doneBugCount
            allStat.totalBugHour += stat.totalBugHour
            allStat.remainBugHour += stat.remainBugHour
        }
        if (allStat.totalTaskHour > 0.00000000000001) {
            allStat.taskProgress = 1.0 - allStat.remainTaskHour / allStat.totalTaskHour;
        }
        if (allStat.totalBugHour > 0.00000000000001) {
            allStat.bugProgress = 1.0 - allStat.remainBugHour / allStat.totalBugHour;
        }
        tmpList.push(allStat);
        setStatInfoList(tmpList);
    }

    const columns: ColumnsType<StatInfo> = [
        {
            title: "名称",
            dataIndex: "name",
        },
        {
            title: "总任务数",
            dataIndex: "totalTaskCount",
        },
        {
            title: "执行中任务",
            dataIndex: "inExecTaskCount",
        },
        {
            title: "检查中任务",
            dataIndex: "inCheckTaskCount",
        },
        {
            title: "完成任务",
            dataIndex: "doneTaskCount",
        },
        {
            title: "任务预估时间",
            dataIndex: "totalTaskHour",
            render: (v: number) => (<>
                {v < 0.000000001 && <span>-</span>}
                {v > 0.000000001 && <span>{v.toFixed(1)}小时</span>}
            </>),
        },
        {
            title: "任务剩余时间",
            render: (_, record: StatInfo) => (<>
                {record.totalTaskHour < 0.000000001 && <span>-</span>}
                {record.totalTaskHour > 0.000000001 && <span>{record.remainTaskHour.toFixed(1)}小时</span>}
            </>),
        },
        {
            title: "任务执行进度",
            render: (_, record: StatInfo) => (<>
                {record.totalTaskHour < 0.000000001 && <span>-</span>}
                {record.totalTaskHour > 0.000000001 && <span>{(record.taskProgress * 100.0).toFixed(0)}%</span>}
            </>),
        },
        {
            title: "总缺陷数",
            dataIndex: "totalBugCount",
        },
        {
            title: "执行中缺陷",
            dataIndex: "inExecBugCount",
        },
        {
            title: "检查中缺陷",
            dataIndex: "inCheckBugCount",
        },
        {
            title: "完成缺陷",
            dataIndex: "doneBugCount",
        },
        {
            title: "缺陷预估时间",
            dataIndex: "totalBugHour",
            render: (v: number) => (<>
                {v < 0.000000001 && <span>-</span>}
                {v > 0.000000001 && <span>{v.toFixed(1)}小时</span>}
            </>),
        },
        {
            title: "缺陷剩余时间",
            render: (_, record: StatInfo) => (<>
                {record.totalBugHour < 0.000000001 && <span>-</span>}
                {record.totalBugHour > 0.000000001 && <span>{record.remainBugHour.toFixed(1)}小时</span>}
            </>),
        },
        {
            title: "缺陷执行进度",
            render: (_, record: StatInfo) => (<>
                {record.totalBugHour < 0.000000001 && <span>-</span>}
                {record.totalBugHour > 0.000000001 && <span>{(record.bugProgress * 100.0).toFixed(0)}%</span>}
            </>),
        },

    ];

    useEffect(() => {
        genStatInfo();
    }, [spritStore.taskList, spritStore.bugList]);

    return (
        <div>
            <Table rowKey="memberUserId" dataSource={statInfoList} columns={columns} pagination={false} />
        </div>
    );
}

export default observer(StatPanel);