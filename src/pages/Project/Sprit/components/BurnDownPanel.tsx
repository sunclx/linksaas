import React, { useEffect, useRef, useState } from "react";
import s from './Panel.module.less';
import { observer, useLocalObservable } from 'mobx-react';
import type { SpritInfo } from "@/api/project_sprit";
import { list_burn_down, update_burn_down } from "@/api/project_sprit";
import { useStores } from "@/hooks";
import type { MemberInfo } from "@/api/project_member";
import { request } from "@/utils/request";
import moment from 'moment';
import { Card, Table } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import { EditNumber } from "@/components/EditCell/EditNumber";
import { makeAutoObservable, runInAction } from "mobx";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useSize } from "ahooks";

class DayInfo {
    constructor(day: number) {
        this.day = day;
        makeAutoObservable(this);
    }
    day: number;
    remainMinutes?: number;
}

class MemberBurnDownInfo {
    constructor(memberUserId: string, dayInfoList: DayInfo[]) {
        this.memberUserId = memberUserId;
        this.dayInfoList = dayInfoList;
        makeAutoObservable(this);
    }
    memberUserId: string;
    memberInfo?: MemberInfo;
    dayInfoList: DayInfo[];
    totalRemain: number = 0;
    totalEstimate: number = 0;
}

interface BurnDownPanelProps {
    spritInfo: SpritInfo;
}

const BurnDownPanel: React.FC<BurnDownPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const memberStore = useStores('memberStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');

    const domRef = useRef<HTMLDivElement>(null);
    const domRefSize = useSize(domRef);

    const localStore = useLocalObservable(() => ({
        burnDownInfoList: [] as MemberBurnDownInfo[],
        setBurnDownInfoList(infoList: MemberBurnDownInfo[]) {
            runInAction(() => {
                this.burnDownInfoList = infoList;
            });
        },
    }));
    const [columns, setColumns] = useState<ColumnsType<MemberBurnDownInfo>>([]);
    const [dataVersion, setDataVersion] = useState(0);

    const updateTotalValue = (infoList: MemberBurnDownInfo[]) => {
        //计算每个用户的totalRemain
        const tmpRemainMap: Map<string, number> = new Map();
        const tmpEstimateMap: Map<string, number> = new Map();
        spritStore.taskList.forEach(item => {
            if (item.exec_user_id != "") {
                if (item.has_remain_minutes) {
                    const oldValue = tmpRemainMap.get(item.exec_user_id) ?? 0.0;
                    tmpRemainMap.set(item.exec_user_id, oldValue + item.remain_minutes);
                }
                if (item.has_estimate_minutes) {
                    const oldValue = tmpEstimateMap.get(item.exec_user_id) ?? 0.0;
                    tmpEstimateMap.set(item.exec_user_id, oldValue + item.estimate_minutes);
                }
            }
        });
        spritStore.bugList.forEach(item => {
            if (item.exec_user_id != "") {
                if (item.has_remain_minutes) {
                    const oldValue = tmpRemainMap.get(item.exec_user_id) ?? 0.0;
                    tmpRemainMap.set(item.exec_user_id, oldValue + item.remain_minutes);
                }
                if (item.has_estimate_minutes) {
                    const oldValue = tmpEstimateMap.get(item.exec_user_id) ?? 0.0;
                    tmpEstimateMap.set(item.exec_user_id, oldValue + item.estimate_minutes);
                }
            }
        });
        for (const info of infoList) {
            if (info.memberUserId != "") {
                info.totalRemain = tmpRemainMap.get(info.memberUserId) ?? 0;
                info.totalEstimate = tmpEstimateMap.get(info.memberUserId) ?? 0;
            }
        }
        //找到总计值
        const totalIndex = infoList.findIndex(item => item.memberUserId == "");
        if (totalIndex == -1) {
            return;
        }
        infoList[totalIndex].totalRemain = infoList.filter(item => item.memberUserId != "").map(item => item.totalRemain).reduce((total, value) => total + value);
        infoList[totalIndex].totalEstimate = infoList.filter(item => item.memberUserId != "").map(item => item.totalEstimate).reduce((total, value) => total + value);

        for (const dayInfo of infoList[totalIndex].dayInfoList) {
            let totalRemainMinutes = 0;
            let emptyCount = 0;
            for (const info of infoList) {
                if (info.memberUserId == "") {
                    continue
                }
                for (const memberDayInfo of info.dayInfoList) {
                    if (dayInfo.day == memberDayInfo.day) {
                        if (memberDayInfo.remainMinutes == undefined) {
                            emptyCount += 1;
                        }
                        totalRemainMinutes += memberDayInfo.remainMinutes ?? 0;
                    }
                }
            }
            if (emptyCount == 0) {
                dayInfo.remainMinutes = totalRemainMinutes;
            }
        }

        localStore.setBurnDownInfoList(infoList);
    };

    const calcColumns = (dayList: number[]) => {
        const tmpColumns: ColumnsType<MemberBurnDownInfo> = [
            {
                title: "用户",
                width: 100,
                render: (row: MemberBurnDownInfo) => (
                    <>
                        {row.memberUserId == "" && <span>总计</span>}
                        {row.memberUserId != "" && <span>{row.memberInfo?.display_name ?? ""}</span>}
                    </>
                ),
            },
            {
                title: "总预估工时",
                width: 100,
                render: (row: MemberBurnDownInfo) => (
                    <span>{(row.totalEstimate / 60).toFixed(2)}</span>
                ),
            },
            {
                title: "当前剩余工时",
                width: 100,
                render: (row: MemberBurnDownInfo) => (
                    <span>{(row.totalRemain / 60).toFixed(2)}</span>
                ),
            },
        ];
        dayList.forEach((day, index) => {
            tmpColumns.push({
                title: `${day}`,
                width: 150,
                render: (row: MemberBurnDownInfo) => {
                    const dayInfo = row.dayInfoList[index];
                    return (
                        <>
                            {row.memberUserId == "" && <span>{dayInfo.remainMinutes == undefined ? "-" : (dayInfo.remainMinutes / 60).toFixed(2)}</span>}
                            {row.memberUserId != "" && (
                                <EditNumber
                                    editable={projectStore.isAdmin || row.memberUserId == userStore.userInfo.userId}
                                    value={dayInfo.remainMinutes == undefined ? undefined : dayInfo.remainMinutes / 60.0} onChange={async (value) => {
                                        if (value < 0.0) {
                                            return false;
                                        }
                                        try {
                                            await request(update_burn_down({
                                                session_id: userStore.sessionId,
                                                project_id: projectStore.curProjectId,
                                                sprit_id: props.spritInfo.sprit_id,
                                                day: dayInfo.day,
                                                member_user_id: row.memberUserId,
                                                remain_minutes: value * 60.0,
                                            }));
                                        } catch (e) {
                                            return false;
                                        }
                                        setDataVersion(version => version + 1);
                                        return true;
                                    }} showEditIcon={true} />
                            )}
                        </>);
                },
            });
        })
        setColumns(tmpColumns);
    }

    const calcBurnDownInfoList = async () => {
        const tmpDayList: number[] = [];
        //计算工作日
        for (const dayTime = moment(props.spritInfo.basic_info.start_time).startOf("day"); dayTime <= moment(props.spritInfo.basic_info.end_time).startOf("day"); dayTime.add(1, "days")) {
            let matchNonWorkDay = false;
            for (const nonWorkDayTime of props.spritInfo.basic_info.non_work_day_list) {
                if (dayTime.valueOf() == moment(nonWorkDayTime).startOf("day").valueOf()) {
                    matchNonWorkDay = true;
                    break;
                }
            }
            if (!matchNonWorkDay) {
                tmpDayList.push(parseInt(dayTime.format("YYYYMMDD")));
            }
        }

        const execUserIdSet = new Set<string>();
        spritStore.taskList.forEach(item => {
            if (item.exec_user_id != "") {
                execUserIdSet.add(item.exec_user_id);
            }
        });
        spritStore.bugList.forEach(item => {
            if (item.exec_user_id != "") {
                execUserIdSet.add(item.exec_user_id);
            }
        });
        const tmpInfoList: MemberBurnDownInfo[] = [];
        memberStore.memberList.forEach(item => {
            if (execUserIdSet.has(item.member.member_user_id)) {
                const tmpInfo = new MemberBurnDownInfo(item.member.member_user_id, []);
                tmpInfo.memberInfo = item.member;
                tmpInfoList.push(tmpInfo);
            }
        })
        const tmpMap: Map<string, number> = new Map();
        const res = await request(list_burn_down({
            session_id: userStore.sessionId,
            project_id: props.spritInfo.project_id,
            sprit_id: props.spritInfo.sprit_id,
        }));
        res.info_list.forEach(item => {
            const key = `${item.member_user_id}${item.day}`;
            tmpMap.set(key, item.remain_minutes);
        });
        tmpInfoList.forEach((info, index) => {
            const dayInfoList: DayInfo[] = [];
            for (const day of tmpDayList) {
                const key = `${info.memberInfo?.member_user_id ?? ""}${day}`;
                const tmpDayInfo = new DayInfo(day);
                tmpDayInfo.remainMinutes = tmpMap.get(key);
                dayInfoList.push(tmpDayInfo);
            }
            tmpInfoList[index].dayInfoList = dayInfoList;
        });
        //计算累计值
        {
            const dayInfoList: DayInfo[] = [];
            for (const day of tmpDayList) {
                dayInfoList.push(new DayInfo(day));
            }
            tmpInfoList.push(new MemberBurnDownInfo("", dayInfoList));
        }
        updateTotalValue(tmpInfoList);
        calcColumns(tmpDayList);
    };

    const getChartData = () => {
        if (localStore.burnDownInfoList.length == 0) {
            return [];
        }
        const totalInfo = localStore.burnDownInfoList[localStore.burnDownInfoList.length - 1];
        if (totalInfo.dayInfoList.length == 0) {
            return [];
        }
        let step = 0;
        if (totalInfo.dayInfoList.length > 1) {
            step = Math.round(totalInfo.totalEstimate / (totalInfo.dayInfoList.length - 1) * 100) / 100;
        }
        const retList = totalInfo.dayInfoList.map((item, index) => {
            return {
                name: `${item.day}`,
                "预期": (totalInfo.totalEstimate - step * index) / 60.0,
                "实际": item.remainMinutes == undefined ? undefined : item.remainMinutes / 60.0,
            };
        });
        retList[retList.length - 1]["预期"] = 0;
        console.log("abc", step, retList);
        return retList;
    };

    useEffect(() => {
        calcBurnDownInfoList();
    }, [spritStore.bugList, spritStore.taskList, dataVersion]);

    return (
        <div className={s.panel_wrap}>
            <Card title="统计表" bordered={false}>
                <Table rowKey="memberUserId" columns={columns} dataSource={localStore.burnDownInfoList} pagination={false}
                    scroll={{ x: "max-content" }} />
            </Card>
            <Card title="燃尽图" bordered={false}>
                <div ref={domRef}>
                    {localStore.burnDownInfoList.length > 1 && (
                        <LineChart height={300} width={(domRefSize?.width ?? 600) * 0.95} data={getChartData()}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="实际" stroke="orange" />
                            <Line type="monotone" dataKey="预期" stroke="green" />
                        </LineChart>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default observer(BurnDownPanel);