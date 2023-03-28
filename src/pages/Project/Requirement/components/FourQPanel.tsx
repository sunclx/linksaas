import React, { useEffect, useState } from "react";
import { observer, useLocalObservable } from 'mobx-react';
import { useStores } from "@/hooks";
import type { FourQInfo } from "@/api/project_requirement";
import { get_four_q_info, set_four_q_info } from "@/api/project_requirement";
import { runInAction } from "mobx";
import { request } from "@/utils/request";
import { Card, InputNumber, Space } from "antd";
import s from "./FourQPanel.module.less";
import Button from "@/components/Button";

interface FourQPanelProps {
    requirementId: string;
    onUpdate: () => void;
}

const FourQPanel: React.FC<FourQPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [inEdit, setInEdit] = useState(false);
    const [fourQInfo, setFourInfo] = useState<FourQInfo | null>(null);

    const localStore = useLocalObservable(() => ({
        urgentAndImportant: 0,
        urgentAndNotImportant: 0,
        notUrgentAndNotImportant: 0,
        notUrgentAndImportant: 0,
        get urgentValue(): number {
            const total = this.urgentAndImportant + this.urgentAndNotImportant + this.notUrgentAndNotImportant + this.notUrgentAndImportant;
            if (total <= 0.000002) {
                return 0;
            }
            return (this.urgentAndImportant + this.urgentAndNotImportant) / total;
        },
        get importantValue(): number {
            const total = this.urgentAndImportant + this.urgentAndNotImportant + this.notUrgentAndNotImportant + this.notUrgentAndImportant;
            if (total <= 0.000002) {
                return 0;
            }
            return (this.urgentAndImportant + this.notUrgentAndImportant) / total;
        },
        initData(info: FourQInfo) {
            runInAction(() => {
                this.urgentAndImportant = info.urgent_and_important;
                this.urgentAndNotImportant = info.urgent_and_not_important;
                this.notUrgentAndNotImportant = info.not_urgent_and_not_important;
                this.notUrgentAndImportant = info.not_urgent_and_important;
            });
        },
    }));

    const loadFourQInfo = async () => {
        const res = await request(get_four_q_info({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: props.requirementId,
        }));
        localStore.initData(res.four_q_info);
        setFourInfo(res.four_q_info);
    }

    const saveFourQInfo = async () => {
        await request(set_four_q_info({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: props.requirementId,
            four_q_info: {
                requirement_id: props.requirementId,
                urgent_and_important: localStore.urgentAndImportant,
                urgent_and_not_important: localStore.urgentAndNotImportant,
                not_urgent_and_not_important: localStore.notUrgentAndNotImportant,
                not_urgent_and_important: localStore.notUrgentAndImportant,
            },
            four_q_urgency_value: localStore.urgentValue,
            four_q_important_value: localStore.importantValue,
        }));
        setInEdit(false);
        props.onUpdate();
    };

    useEffect(() => {
        loadFourQInfo();
    }, [props.requirementId]);

    return (
        <Card bordered={false} title={<h3 className={s.head}>调研结果</h3>}
            bodyStyle={{ padding: "0px 0px" }} extra={
                <>
                    {inEdit == false && (
                        <Button disabled={((!projectStore.isAdmin) || (fourQInfo == null))} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setInEdit(true);
                        }}>修改</Button>
                    )}
                    {inEdit == true && (
                        <Space>
                            <Button type="default" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setInEdit(false);
                                if (fourQInfo != null) {
                                    localStore.initData(fourQInfo);
                                }
                            }}>取消</Button>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                saveFourQInfo();
                            }}>保存</Button>
                        </Space>
                    )}
                </>
            }>
            <div>
                {fourQInfo != null && (
                    <table className={s.stat}>
                        <tr>
                            <td>
                                <Space size="large">
                                    紧急但不重要
                                    {inEdit == false && (
                                        <span>{localStore.urgentAndNotImportant}人</span>
                                    )}
                                    {inEdit == true && (
                                        <span>
                                            <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                value={localStore.urgentAndNotImportant} onChange={value => {
                                                    if (value != null && value >= 0) {
                                                        runInAction(() => {
                                                            localStore.urgentAndNotImportant = Math.floor(value);
                                                        });
                                                    }
                                                }} />人
                                        </span>
                                    )}
                                </Space>
                            </td>
                            <td>
                                <Space size="large">
                                    紧急且重要
                                    {inEdit == false && (
                                        <span>{localStore.urgentAndImportant}人</span>
                                    )}
                                    {inEdit == true && (
                                        <span>
                                            <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                value={localStore.urgentAndImportant} onChange={value => {
                                                    if (value != null && value >= 0) {
                                                        runInAction(() => {
                                                            localStore.urgentAndImportant = Math.floor(value);
                                                        });
                                                    }
                                                }} />人
                                        </span>
                                    )}
                                </Space>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Space size="large">
                                    既不紧急也不重要
                                    {inEdit == false && (
                                        <span>{localStore.notUrgentAndNotImportant}人</span>
                                    )}
                                    {inEdit == true && (
                                        <span>
                                            <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                value={localStore.notUrgentAndNotImportant} onChange={value => {
                                                    if (value != null && value >= 0) {
                                                        runInAction(() => {
                                                            localStore.notUrgentAndNotImportant = Math.floor(value);
                                                        });
                                                    }
                                                }} />人
                                        </span>
                                    )}
                                </Space>
                            </td>
                            <td>
                                <Space size="large">
                                    重要但不紧急
                                    {inEdit == false && (
                                        <span>{localStore.notUrgentAndImportant}人</span>
                                    )}
                                    {inEdit == true && (
                                        <span>
                                            <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                value={localStore.notUrgentAndImportant} onChange={value => {
                                                    if (value != null && value >= 0) {
                                                        runInAction(() => {
                                                            localStore.notUrgentAndImportant = Math.floor(value);
                                                        });
                                                    }
                                                }} />人
                                        </span>
                                    )}
                                </Space>
                            </td>
                        </tr>
                    </table>
                )}
                <div style={{ display: "flex" }}>
                    <div style={{ width: 150 }}>重要系数：{localStore.importantValue.toFixed(3)}</div>
                    <div style={{ width: 150 }}>紧急系数：{localStore.urgentValue.toFixed(3)}</div>
                </div>
            </div>
        </Card>
    );
};

export default observer(FourQPanel);
