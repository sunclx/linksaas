import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, DatePicker, Input, List, Modal, Space, message } from "antd";
import type { BasicGoalInfo, Okr, GoalInfo } from '@/api/project_member';
import { create_goal, update_goal, list_goal, remove_goal } from '@/api/project_member';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import Pagination from "@/components/Pagination";
import type { Moment } from 'moment';
import moment from 'moment';
import { uniqId } from "@/utils/utils";
import s from "./GoalList.module.less";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Button from "@/components/Button";

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

interface GoalItemProps {
    goal?: GoalInfo;
    onChange: () => void;
    onCancel?: () => void;
}

const GoalItem: React.FC<GoalItemProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [editGoal, setEditGoal] = useState<EditGoal | null>(null);
    const [showRemoveGoal, setShowRemoveGoal] = useState(false);

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
        await memberStore.updateMemberInfo(projectStore.curProjectId, props.goal?.member_user_id ?? userStore.userInfo.userId);
        props.onChange();
        setEditGoal(null);
    }

    const genEditGoal = () => {
        const okrList: OkrWrap[] = [];
        if (props.goal != undefined) {
            props.goal.basic_info.okr_list.forEach(okr => {
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
                goal_id: props.goal.goal_id,
                from_time: props.goal.basic_info.from_time,
                to_time: props.goal.basic_info.to_time,
                okr_list: okrList,
            });
        }
    };
    const removeGoal = async () => {
        if (props.goal == undefined) {
            return;
        }
        await request(remove_goal({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            goal_id: props.goal.goal_id,
        }));
        props.onChange();
    }

    const editItem = (
        <>
            {editGoal != null && (
                <div>
                    <div className={s.info_wrap}>
                        <div className={s.info_label}>日期区间</div>
                        <div><DatePicker.RangePicker
                            picker="month"
                            popupStyle={{ zIndex: 9999 }}
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
                </div>
            )}
        </>
    );

    useEffect(() => {
        if (props.goal == undefined) {
            setEditGoal({
                goal_id: "",
                from_time: null,
                to_time: null,
                okr_list: [{
                    id: uniqId(),
                    objective: "",
                    key_result_list: [
                        {
                            id: uniqId(),
                            value: "",
                        },
                    ],
                }],
            });
        }
    }, [props.goal]);

    if (props.goal == undefined) {
        return (
            <Modal open width={400}
                title="新增目标(OKR)"
                okText="创建"
                onCancel={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.onCancel != undefined) {
                        props.onCancel();
                    }
                }}
                onOk={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    saveGoal();
                }}>
                <div className={s.goal_wrap}>
                    {editItem}
                </div>
            </Modal>
        );
    } else {
        return (
            <Card className={s.goal_wrap} extra={
                (props.goal != undefined && (userStore.userInfo.userId != props.goal.member_user_id || moment().diff(props.goal.create_time, "days") > 3)) ? null : (
                    <>
                        {editGoal == null && props.goal != undefined && userStore.userInfo.userId == props.goal.member_user_id && props.goal.goal_id == memberStore.getMember(props.goal.member_user_id)?.member.last_goal_id && (
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                genEditGoal();
                            }}>修改</Button>
                        )}
                        {editGoal == null && props.goal != undefined && userStore.userInfo.userId == props.goal.member_user_id &&
                            props.goal.goal_id != memberStore.getMember(props.goal.member_user_id)?.member.last_goal_id &&
                            moment().diff(props.goal.create_time, "days") <= 3 && (
                                <Button danger onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowRemoveGoal(true);
                                }}>删除</Button>
                            )}
                        {editGoal != null && (
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
                                }}>更新</Button>
                            </Space>
                        )}
                    </>
                )
            }>
                {editGoal == null && props.goal != undefined && (
                    <div>
                        <div>
                            <div className={s.info_wrap}>
                                <div className={s.info_label}>日期区间</div>
                                <div>{moment(props.goal.basic_info.from_time).format("YYYY-MM")}&nbsp;至&nbsp;{moment(props.goal.basic_info.to_time).format("YYYY-MM")}</div>
                            </div>
                            {props.goal.basic_info.okr_list.map((okr, okrIndex) => (
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
                    </div>
                )
                }
                {editItem}
                {showRemoveGoal == true && (
                    <Modal open title="删除目标(OKR)"
                        okText="删除"
                        okButtonProps={{ danger: true }}
                        onCancel={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowRemoveGoal(false);
                        }}
                        onOk={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeGoal();
                        }}
                    >
                        是否删除目标？
                    </Modal>
                )}
            </Card >
        );
    }
};

const PAGE_SIZE = 3;

interface GoalListProps {
    memberUserId: string;
}

const GoalList: React.FC<GoalListProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [goalList, setGoalList] = useState<GoalInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [showCreate, setShowCreate] = useState(false);

    const loadGoalList = async () => {
        const res = await request(list_goal({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            member_user_id: props.memberUserId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setGoalList(res.goal_list);
    };

    useEffect(() => {
        loadGoalList();
    }, [props.memberUserId, projectStore.curProjectId, curPage])

    return (
        <Card bordered={false} extra={
            props.memberUserId == userStore.userInfo.userId ? (
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowCreate(true);
                }}>新建目标(OKR)</Button>
            ) : null
        }>
            <List dataSource={goalList} renderItem={item => (
                <List.Item key={item.goal_id} style={{ border: "none" }}>
                    <GoalItem goal={item} onChange={() => loadGoalList()} />
                </List.Item>
            )} />
            <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
            {showCreate == true && (
                <GoalItem
                    onChange={() => {
                        setShowCreate(false);
                        loadGoalList();
                    }}
                    onCancel={() => setShowCreate(false)}
                />
            )}
        </Card>
    );
}

export default observer(GoalList);