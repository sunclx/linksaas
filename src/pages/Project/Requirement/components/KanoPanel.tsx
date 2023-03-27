import React, { useEffect, useState } from "react";
import { useLocalObservable, observer } from 'mobx-react';
import { Card, InputNumber, List, Modal, Space } from "antd";
import { useStores } from "@/hooks";
import Button from "@/components/Button";
import type { KanoInfo } from "@/api/project_requirement";
import { get_kano_info, set_kano_info } from "@/api/project_requirement";
import { runInAction } from "mobx";
import { request } from "@/utils/request";
import s from "./KanoPanel.module.less";

interface KanoPanelProps {
    requirementId: string;
    onUpdate: () => void;
}

//颜色用到了逻辑里面，颜色不能相同
const ITEM_A_COLOR = "#DC9C64";
const ITEM_O_COLOR = "#53B27D";
const ITEM_M_COLOR = "#F59183";
const ITEM_I_COLOR = "#6786A4"
const ITEM_R_COLOR = "#03F3FF";
const ITEM_Q_COLOR = "#C2C2C2";

const KanoPanel: React.FC<KanoPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [inEdit, setInEdit] = useState(false);
    const [kanoInfo, setKanoInfo] = useState<KanoInfo | null>(null);

    const [showSurvey, setShowSurvey] = useState(false);

    const localStore = useLocalObservable(() => ({
        likeVsLike: 0,
        likeVsExpect: 0,
        likeVsNeutral: 0,
        likeVsTolerate: 0,
        likeVsDislike: 0,

        expectVsLike: 0,
        expectVsExpect: 0,
        expectVsNeutral: 0,
        expectVsTolerate: 0,
        expectVsDislike: 0,

        neutralVsLike: 0,
        neutralVsExpect: 0,
        neutralVsNeutral: 0,
        neutralVsTolerate: 0,
        neutralVsDislike: 0,

        tolerateVsLike: 0,
        tolerateVsExpect: 0,
        tolerateVsNeutral: 0,
        tolerateVsTolerate: 0,
        tolerateVsDislike: 0,

        dislikeVsLike: 0,
        dislikeVsExpect: 0,
        dislikeVsNeutral: 0,
        dislikeVsTolerate: 0,
        dislikeVsDislike: 0,

        getTotal(): number {
            return (this.likeVsLike + this.likeVsExpect + this.likeVsNeutral + this.likeVsTolerate + this.likeVsDislike) +
                (this.expectVsLike + this.expectVsExpect + this.expectVsNeutral + this.expectVsTolerate + this.expectVsDislike) +
                (this.neutralVsLike + this.neutralVsExpect + this.neutralVsNeutral + this.neutralVsTolerate + this.neutralVsDislike) +
                (this.tolerateVsLike + this.tolerateVsExpect + this.tolerateVsNeutral + this.tolerateVsTolerate + this.tolerateVsDislike) +
                (this.dislikeVsLike + this.dislikeVsExpect + this.dislikeVsNeutral + this.dislikeVsTolerate + this.dislikeVsDislike);
        },

        get statA(): number {
            const total = this.getTotal();
            if (total < 0.0002) {
                return 0;
            }
            return (this.likeVsExpect + this.likeVsNeutral + this.likeVsTolerate) / total;
        },

        get statO(): number {
            const total = this.getTotal();
            if (total < 0.0002) {
                return 0;
            }
            return this.likeVsDislike / total;
        },

        get statM(): number {
            const total = this.getTotal();
            if (total < 0.0002) {
                return 0;
            }
            return (this.expectVsDislike + this.neutralVsDislike + this.tolerateVsDislike) / total;
        },

        get statI(): number {
            const total = this.getTotal();
            if (total < 0.0002) {
                return 0;
            }
            return (this.expectVsExpect + this.expectVsNeutral + this.expectVsTolerate +
                this.neutralVsExpect + this.neutralVsNeutral + this.neutralVsTolerate +
                this.tolerateVsExpect + this.tolerateVsNeutral + this.tolerateVsTolerate
            ) / total;
        },

        get statR(): number {
            const total = this.getTotal();
            if (total < 0.0002) {
                return 0;
            }
            return (this.expectVsLike + this.neutralVsLike + this.tolerateVsLike +
                this.dislikeVsLike + this.dislikeVsExpect + this.dislikeVsNeutral + this.dislikeVsTolerate) / total;
        },

        get statQ(): number {
            const total = this.getTotal();
            if (total < 0.0002) {
                return 0;
            }
            return (this.likeVsLike + this.dislikeVsDislike) / total;
        },

        initData(info: KanoInfo) {
            runInAction(() => {
                this.likeVsLike = info.like_vs_row.like;
                this.likeVsExpect = info.like_vs_row.expect;
                this.likeVsNeutral = info.like_vs_row.neutral;
                this.likeVsTolerate = info.like_vs_row.tolerate;
                this.likeVsDislike = info.like_vs_row.dislike;

                this.expectVsLike = info.expect_vs_row.like;
                this.expectVsExpect = info.expect_vs_row.expect;
                this.expectVsNeutral = info.expect_vs_row.neutral;
                this.expectVsTolerate = info.expect_vs_row.tolerate;
                this.expectVsDislike = info.expect_vs_row.dislike;

                this.neutralVsLike = info.neutral_vs_row.like;
                this.neutralVsExpect = info.neutral_vs_row.expect;
                this.neutralVsNeutral = info.neutral_vs_row.neutral;
                this.neutralVsTolerate = info.neutral_vs_row.tolerate;
                this.neutralVsDislike = info.neutral_vs_row.dislike;

                this.tolerateVsLike = info.tolerate_vs_row.like;
                this.tolerateVsExpect = info.tolerate_vs_row.expect;
                this.tolerateVsNeutral = info.tolerate_vs_row.neutral;
                this.tolerateVsTolerate = info.tolerate_vs_row.tolerate;
                this.tolerateVsDislike = info.tolerate_vs_row.dislike;

                this.dislikeVsLike = info.dislike_vs_row.like;
                this.dislikeVsExpect = info.dislike_vs_row.expect;
                this.dislikeVsNeutral = info.dislike_vs_row.neutral;
                this.dislikeVsTolerate = info.dislike_vs_row.tolerate;
                this.dislikeVsDislike = info.dislike_vs_row.dislike;
            });

        }


    }));

    const loadKanoInfo = async () => {
        const res = await request(get_kano_info({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: props.requirementId,
        }));
        localStore.initData(res.kano_info);
        setKanoInfo(res.kano_info);
    };

    useEffect(() => {
        loadKanoInfo();
    }, [props.requirementId]);

    return (
        <Card bordered={false} title={<Space>
            <h3 className={s.head}>调研结果</h3>
            <a style={{ fontSize: "12px" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setShowSurvey(true);
            }}>调研问卷</a>
        </Space>}
            bodyStyle={{ padding: "0px 0px" }}
            extra={
                <>
                    {inEdit == false && (
                        <Button disabled={((!projectStore.isAdmin) || (kanoInfo == null))} onClick={e => {
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
                                if (kanoInfo != null) {
                                    localStore.initData(kanoInfo);
                                }
                            }}>取消</Button>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                //TODO
                            }}>保存</Button>
                        </Space>
                    )}
                </>
            }>
            <div>
                {kanoInfo != null && (
                    <>
                        <table className={s.stat}>
                            <tbody>
                                <tr>
                                    <td colSpan={2} rowSpan={2} style={{ fontSize: "20px", fontWeight: 800 }}>调研结果</td>
                                    <td colSpan={5} style={{ fontWeight: 700 }}>不实现此需求</td>
                                </tr>
                                <tr>
                                    <td>非常喜欢</td>
                                    <td>理应如此</td>
                                    <td>无所谓</td>
                                    <td>勉强接受</td>
                                    <td>不喜欢</td>
                                </tr>
                                <tr>
                                    <td rowSpan={5} style={{ writingMode: "vertical-rl", width: "10px", fontWeight: 700 }}>实现此需求</td>
                                    <td>非常喜欢</td>
                                    <td style={{ backgroundColor: ITEM_Q_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.likeVsLike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.likeVsLike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.likeVsLike = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_A_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.likeVsExpect}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.likeVsExpect} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.likeVsExpect = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_A_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.likeVsNeutral}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.likeVsNeutral} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.likeVsNeutral = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_A_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.likeVsTolerate}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.likeVsTolerate} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.likeVsTolerate = Math.floor(value);
                                                            })
                                                        }
                                                    }} />人
                                            </span>
                                        )}                                      </td>
                                    <td style={{ backgroundColor: ITEM_O_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.likeVsDislike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.likeVsDislike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.likeVsDislike = Math.floor(value);
                                                            })
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>理应如此</td>
                                    <td style={{ backgroundColor: ITEM_R_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.expectVsLike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.expectVsLike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.expectVsLike = Math.floor(value);
                                                            })
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.expectVsExpect}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.expectVsExpect} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.expectVsExpect = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.expectVsNeutral}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.expectVsNeutral} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.expectVsNeutral = Math.floor(value);
                                                            })
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.expectVsTolerate}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.expectVsTolerate} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.expectVsTolerate = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_M_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.expectVsDislike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.expectVsDislike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.expectVsDislike = Math.floor(value);
                                                            })
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>无所谓</td>
                                    <td style={{ backgroundColor: ITEM_R_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.neutralVsLike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.neutralVsLike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.neutralVsLike = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.neutralVsExpect}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.neutralVsExpect} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.neutralVsExpect = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.neutralVsNeutral}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.neutralVsNeutral} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.neutralVsNeutral = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.neutralVsTolerate}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.neutralVsTolerate} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.neutralVsTolerate = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_M_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.neutralVsDislike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.neutralVsDislike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.neutralVsDislike = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>勉强接受</td>
                                    <td style={{ backgroundColor: ITEM_R_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.tolerateVsLike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.tolerateVsLike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.tolerateVsLike = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.tolerateVsExpect}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.tolerateVsExpect} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.tolerateVsExpect = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.tolerateVsNeutral}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.tolerateVsNeutral} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.tolerateVsNeutral = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_I_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.tolerateVsTolerate}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.tolerateVsTolerate} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.tolerateVsTolerate = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_M_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.tolerateVsDislike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.tolerateVsDislike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.tolerateVsDislike = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>不喜欢</td>
                                    <td style={{ backgroundColor: ITEM_R_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.dislikeVsLike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.dislikeVsLike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.dislikeVsLike = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_R_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.dislikeVsExpect}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.dislikeVsExpect} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.dislikeVsExpect = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_R_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.dislikeVsNeutral}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.dislikeVsNeutral} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.dislikeVsNeutral = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_R_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.dislikeVsTolerate}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.dislikeVsTolerate} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.dislikeVsTolerate = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: ITEM_Q_COLOR }}>
                                        {inEdit == false && (
                                            <span>{localStore.dislikeVsDislike}人</span>
                                        )}
                                        {inEdit == true && (
                                            <span>
                                                <InputNumber className={s.input} controls={false} bordered={false} precision={0}
                                                    value={localStore.dislikeVsDislike} onChange={value => {
                                                        if (value != null && value >= 0) {
                                                            runInAction(() => {
                                                                localStore.dislikeVsDislike = Math.floor(value);
                                                            });
                                                        }
                                                    }} />人
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <List grid={{ gutter: 16, column: 3 }} dataSource={[
                            {
                                label: "A：兴奋型",
                                color: ITEM_A_COLOR,
                            },
                            {
                                label: "O：期望型",
                                color: ITEM_O_COLOR,
                            },
                            {
                                label: "M：基础型",
                                color: ITEM_M_COLOR,
                            },
                            {
                                label: "I：无差异",
                                color: ITEM_I_COLOR,
                            },
                            {
                                label: "R：反向型",
                                color: ITEM_R_COLOR,
                            },
                            {
                                label: "Q：可疑结果",
                                color: ITEM_Q_COLOR,
                            },
                        ]} renderItem={(item) => (
                            <List.Item>
                                <Space style={{ backgroundColor: item.color, padding: "2px 10px" }}>
                                    {item.label}
                                    {item.color == ITEM_A_COLOR && localStore.statA.toFixed(3)}
                                    {item.color == ITEM_O_COLOR && localStore.statO.toFixed(3)}
                                    {item.color == ITEM_M_COLOR && localStore.statM.toFixed(3)}
                                    {item.color == ITEM_I_COLOR && localStore.statI.toFixed(3)}
                                    {item.color == ITEM_R_COLOR && localStore.statR.toFixed(3)}
                                    {item.color == ITEM_Q_COLOR && localStore.statQ.toFixed(3)}
                                </Space>
                            </List.Item>
                        )} />

                    </>
                )}
            </div>
            {showSurvey == true && (
                <Modal title="调研问卷" open width="calc(100vw - 400px)"
                    footer={null} onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowSurvey(false);
                    }}>
                    <table className={s.survey}>
                        <thead>
                            <td />
                            <td>非常喜欢</td>
                            <td>理应如此</td>
                            <td>无所谓</td>
                            <td>勉强接受</td>
                            <td>很不喜欢</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td>实现该需求后，您的感受是?</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr>
                            <tr>
                                <td>不实现该需求，您的感受是?</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </Modal>
            )}
        </Card>
    );
};

export default observer(KanoPanel);
