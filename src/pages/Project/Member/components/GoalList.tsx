import { useStores } from "@/hooks";
import { Card, DatePicker, Empty, Input, List, Space, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { WebMemberInfo } from "@/stores/member";
import Button from "@/components/Button";
import s from "./GoalList.module.less";
import type { BasicGoalInfo, Okr, GoalInfo } from '@/api/project_member';
import { create_goal, update_goal, list_goal } from '@/api/project_member';
import { uniqId } from "@/utils/utils";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { Moment } from 'moment';
import moment from 'moment';
import { request } from "@/utils/request";
import Pagination from "@/components/Pagination";
import UserPhoto from '@/components/Portrait/UserPhoto';


interface KeyResultWrap {
    id: string;
    value: string;
}

interface OkrWrap {
    id: string;
    objective: string;
    key_result_list: KeyResultWrap[];
};

interface EditGoal {
    goal_id: string;
    from_time: number | null;
    to_time: number | null;
    okr_list: OkrWrap[];
}

const GoalItem: React.FC<{ item: WebMemberInfo, onShowHistory: (memberUserId: string) => void }> = observer(({ item, onShowHistory }) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [editGoal, setEditGoal] = useState<EditGoal | null>(null);

    const setTime = (values: (Moment | null)[] | null) => {
        if (editGoal == null) {
            return;
        }
        if (values == null) {
            return;
        }
        if (values.length != 2) {
            return;
        }
        if (values[0] == null || values[1] == null) {
            return;
        }
        setEditGoal({
            ...editGoal,
            from_time: values[0].valueOf(),
            to_time: values[1].valueOf(),
        })
    };

    const setObjectiveValue = (okrId: string, value: string) => {
        if (editGoal == null) {
            return;
        }
        const okrList = editGoal.okr_list.slice();
        const index = okrList.findIndex(okr => okr.id == okrId);
        if (index != -1) {
            okrList[index].objective = value;
        }
        setEditGoal({
            ...editGoal,
            okr_list: okrList,
        });
    };

    const setKrValue = (okrId: string, krId: string, value: string) => {
        if (editGoal == null) {
            return;
        }
        const okrList = editGoal.okr_list.slice();
        const okrIndex = okrList.findIndex(okr => okr.id == okrId);
        if (okrIndex != -1) {
            const krIndex = okrList[okrIndex].key_result_list.findIndex(kr => kr.id == krId);
            if (krIndex != -1) {
                okrList[okrIndex].key_result_list[krIndex].value = value;
            }
        }
        setEditGoal({
            ...editGoal,
            okr_list: okrList,
        });
    };

    const addOkr = (index: number) => {
        if (editGoal == null) {
            return;
        }
        const okrList = editGoal.okr_list.slice();
        okrList.splice(index + 1, 0, {
            id: uniqId(),
            objective: "",
            key_result_list: [
                {
                    id: uniqId(),
                    value: "",
                },
            ],
        });
        setEditGoal({
            ...editGoal,
            okr_list: okrList,
        });
    }

    const removeOkr = (okrId: string) => {
        if (editGoal == null) {
            return;
        }
        const okrList = editGoal.okr_list.filter(okr => okr.id != okrId);
        setEditGoal({
            ...editGoal,
            okr_list: okrList,
        });
    }

    const addKeyResult = (okrId: string, index: number) => {
        if (editGoal == null) {
            return;
        }
        const okrList = editGoal.okr_list.map(okr => {
            if (okr.id == okrId) {
                okr.key_result_list.splice(index + 1, 0, {
                    id: uniqId(),
                    value: "",
                });
            }
            return okr;
        })
        setEditGoal({
            ...editGoal,
            okr_list: okrList,
        });
    };

    const removeKeyResult = (okrId: string, index: number) => {
        if (editGoal == null) {
            return;
        }
        const okrList = editGoal.okr_list.map(okr => {
            if (okr.id == okrId) {
                okr.key_result_list = okr.key_result_list.filter((_, krIndex) => index != krIndex);
            }
            return okr;
        })
        setEditGoal({
            ...editGoal,
            okr_list: okrList,
        });
    };

    const genEditGoal = () => {
        const okrList: OkrWrap[] = [];
        item.member.last_goal_info.okr_list.forEach(okr => {
            okrList.push({
                id: uniqId(),
                objective: okr.objective,
                key_result_list: okr.key_result_list.map(kr => {
                    return {
                        id: uniqId(),
                        value: kr,
                    };
                }),
            });
        })
        setEditGoal({
            goal_id: item.member.last_goal_id,
            from_time: item.member.last_goal_info.from_time,
            to_time: item.member.last_goal_info.to_time,
            okr_list: okrList,
        });
    };

    const saveGoal = async () => {
        if (editGoal == null) {
            return;
        }

        if (editGoal.from_time == null || editGoal.to_time == null) {
            message.error("时间区间不能为空");
            return;
        }
        if (editGoal.okr_list.length == 0) {
            message.error("未定义OKR");
            return;
        }
        const okrList: Okr[] = [];
        for (const okr of editGoal.okr_list) {
            if (okr.key_result_list.length == 0) {
                message.error("关键结果缺失");
                return;
            }
            okrList.push({
                objective: okr.objective,
                key_result_list: okr.key_result_list.map(kr => kr.value),
            });
        }
        const basicInfo: BasicGoalInfo = {
            from_time: editGoal.from_time,
            to_time: editGoal.to_time,
            okr_list: okrList,
        };
        if (editGoal.goal_id == "") {
            await request(create_goal({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                member_user_id: item.member.member_user_id,
                basic_info: basicInfo,
            }));
        } else {
            await request(update_goal({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                goal_id: editGoal.goal_id,
                basic_info: basicInfo,
            }))
        }
        await memberStore.updateMemberInfo(projectStore.curProjectId, item.member.member_user_id);
        setEditGoal(null);
    }

    return (
        <Card
            title={
                <div>

                    <UserPhoto logoUri={item.member.logo_uri ?? ""} width="30px" style={{
                        marginRight: '5px',
                        borderRadius: '50px',
                        border: '1px solid #ddd',
                    }} />
                    &nbsp;&nbsp;{item.member.display_name}
                </div>}
            extra={
                <>
                    {editGoal == null && userStore.userInfo.userId == item.member.member_user_id && <Button
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setEditGoal({
                                goal_id: "",
                                from_time: null,
                                to_time: null,
                                okr_list: [
                                    {
                                        id: uniqId(),
                                        objective: "",
                                        key_result_list: [{
                                            id: uniqId(),
                                            value: "",
                                        }]
                                    }
                                ],
                            });
                        }}>创建目标</Button>}
                </>}
            bordered={true}
            style={{ marginTop: "10px" }}>
            <div className={s.goal_wrap}>
                {editGoal == null && (
                    <div>
                        {item.member.last_goal_id == "" && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        {item.member.last_goal_id != "" && (
                            <div>
                                <div className={s.info_wrap}>
                                    <div className={s.info_label}>日期区间</div>
                                    <div>{moment(item.member.last_goal_info.from_time).format("YYYY-MM")}&nbsp;至&nbsp;{moment(item.member.last_goal_info.to_time).format("YYYY-MM")}</div>
                                </div>
                                {item.member.last_goal_info.okr_list.map((okr, okrIndex) => (
                                    <div className={s.info_wrap} key={okrIndex}>
                                        <div className={s.info_label}>目标{okrIndex + 1}:</div>
                                        <div>
                                            {okr.objective}&nbsp;
                                            {okr.key_result_list.map((kr, krIndex) => (
                                                <div className={s.info_wrap} key={krIndex}>
                                                    <div className={s.kr_label}>关键结果{krIndex + 1}:</div>
                                                    <div>{kr}&nbsp;</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className={s.bottom}>
                                    <div className={s.btn_wrap}>
                                        <Space>
                                            <Button type="default" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                onShowHistory(item.member.member_user_id);
                                            }}>查看历史</Button>
                                            {(projectStore.isAdmin || userStore.userInfo.userId == item.member.member_user_id) && (
                                                <Button onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    genEditGoal();
                                                }}>修改</Button>
                                            )}
                                        </Space>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {editGoal != null && (
                    <div>
                        <div className={s.info_wrap}>
                            <div className={s.info_label}>日期区间</div>
                            <div><DatePicker.RangePicker
                                picker="month"
                                value={[editGoal.from_time == null ? null : moment(editGoal.from_time), editGoal.to_time == null ? null : moment(editGoal.to_time)]}
                                onChange={values => setTime(values)} /></div>
                        </div>
                        {editGoal.okr_list.map((okr, okrIndex) => (
                            <div className={s.info_wrap} key={okr.id}>
                                <div className={s.info_label}>目标{okrIndex + 1}</div>
                                <div>
                                    <Input className={s.obj} value={okr.objective} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setObjectiveValue(okr.id, e.target.value);
                                    }} />
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        addOkr(okrIndex);
                                    }}><PlusCircleOutlined className={s.icon} /></a>
                                    {editGoal.okr_list.length > 1 && <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeOkr(okr.id);
                                    }}><MinusCircleOutlined className={s.icon} /></a>}
                                    {okr.key_result_list.map((kr, krIndex) => (
                                        <div className={s.info_wrap} key={kr.id}>
                                            <div className={s.kr_label}>关键结果{krIndex + 1}</div>
                                            <div>
                                                <Input className={s.kr} value={kr.value} onChange={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setKrValue(okr.id, kr.id, e.target.value);
                                                }} />
                                                <a onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    addKeyResult(okr.id, krIndex);
                                                }}><PlusCircleOutlined className={s.icon} /></a>
                                                {okr.key_result_list.length > 1 && <a onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    removeKeyResult(okr.id, krIndex);
                                                }}><MinusCircleOutlined className={s.icon} /></a>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className={s.bottom}>
                            <div className={s.btn_wrap}>
                                <Space>
                                    <Button type="default" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setEditGoal(null);
                                    }}>取消</Button>
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        saveGoal();
                                    }}>保存</Button>
                                </Space>
                            </div>
                        </div>
                    </div>
                )
                }
            </div >
        </Card>
    );
});

const HistoryItem: React.FC<{ item: GoalInfo }> = ({ item }) => {
    return (
        <Card extra={
            <span>{item.update_display_name}&nbsp;&nbsp;{moment(item.update_time).format("YYYY-MM-DD HH:mm:ss")}&nbsp;&nbsp;更新</span>
        }
            style={{ marginBottom: "10px" }}>
            <div className={s.goal_wrap}>
                <div className={s.info_wrap}>
                    <div className={s.info_label}>日期区间</div>
                    <div>{moment(item.basic_info.from_time).format("YYYY-MM")}&nbsp;至&nbsp;{moment(item.basic_info.to_time).format("YYYY-MM")}</div>
                </div>
                {item.basic_info.okr_list.map((okr, okrIndex) => (
                    <div className={s.info_wrap} key={okrIndex}>
                        <div className={s.info_label}>目标{okrIndex + 1}:</div>
                        <div>
                            {okr.objective}&nbsp;
                            {okr.key_result_list.map((kr, krIndex) => (
                                <div className={s.info_wrap} key={krIndex}>
                                    <div className={s.kr_label}>关键结果{krIndex + 1}:</div>
                                    <div>{kr}&nbsp;</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

const PAGE_SIZE = 5;

const GoalList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [historyMemberUserId, setHistoryMemberUserId] = useState("");
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [goalList, setGoalList] = useState<GoalInfo[]>([]);


    const loadGoalList = async () => {
        if (historyMemberUserId == "") {
            return;
        }
        const res = await request(list_goal({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            member_user_id: historyMemberUserId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,

        }));
        setTotalCount(res.total_count);
        setGoalList(res.goal_list);
    };

    useEffect(() => {
        loadGoalList();
    }, [historyMemberUserId, curPage]);

    return (
        <div className={s.goal_list_wrap}>
            <List
                itemLayout="horizontal"
                dataSource={memberStore.memberList}
                renderItem={item => <GoalItem item={item} key={item.member.member_user_id} onShowHistory={memberUserId => {
                    setCurPage(0);
                    setTotalCount(0);
                    setGoalList([]);
                    setHistoryMemberUserId(memberUserId);
                }} />}
            />
            {historyMemberUserId != "" && (
                <Modal
                    className={s.his}
                    title={`${memberStore.getMember(historyMemberUserId)?.member.display_name ?? ""}的目标历史`}
                    open
                    footer={null}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setHistoryMemberUserId("");
                    }}>
                    <div className={s.history_list_wrap}>
                        <List
                            itemLayout="horizontal"
                            dataSource={goalList}
                            renderItem={item => <HistoryItem item={item} />}
                        />
                        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                    </div>
                </Modal>
            )}
        </div>
    )
};

export default observer(GoalList);