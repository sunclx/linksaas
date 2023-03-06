import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkSpritState } from "@/stores/linkAux";
import { LinkChannelInfo } from "@/stores/linkAux";
import { get as get_sprit, remove as remove_sprit, link_channel, cancel_link_channel } from "@/api/project_sprit";
import type { SpritInfo } from "@/api/project_sprit";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import Button from "@/components/Button";
import { DeleteOutlined } from "@ant-design/icons";
import { message, Modal, Tabs, Tag } from 'antd';
import s from './SpritDetail.module.less';
import moment from "moment";
import IssuePanel from "./components/IssuePanel";
import StatPanel from "./components/StatPanel";
import GanttPanel from "./components/GanttPanel";
import LinkDocPanel from "./components/LinkDocPanel";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { LAYOUT_TYPE_KB } from "@/api/project";
import KanbanPanel from "./components/KanbanPanel";

const SpritDetail = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const spritStore = useStores('spritStore');
    const channelStore = useStores('channelStore');

    const location = useLocation();
    const state = location.state as LinkSpritState;
    const tabStr = new URLSearchParams(location.search).get('tab');
    const activeKey = tabStr == null || tabStr == "" ? "issue" : tabStr;

    const history = useHistory();

    const [spritInfo, setSpritInfo] = useState<SpritInfo | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const loadSpritInfo = async () => {
        const res = await request(get_sprit(userStore.sessionId, projectStore.curProjectId, state.spritId));
        setSpritInfo(res.info);
        await spritStore.setcurSpritId(state.spritId);
    };

    const removeSprit = async () => {
        await request(remove_sprit(userStore.sessionId, projectStore.curProjectId, state.spritId));
        message.info("删除迭代成功");
        setShowRemoveModal(false);
        linkAuxStore.goToSpritList(history);
    };

    useEffect(() => {
        loadSpritInfo();
    }, [activeKey]);

    return (
        <CardWrap>
            <DetailsNav title={`迭代 ${spritInfo?.basic_info.title ?? ""}`} >
                {projectStore.isAdmin && <Button type="default" danger onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowRemoveModal(true);
                }}><DeleteOutlined />删除迭代</Button>}
            </DetailsNav>
            <div className={s.sprit_wrap}>
                <div className={s.info_wrap}>
                    <div className={s.label}>时间区间：</div>
                    {spritInfo != null && (
                        <div>
                            {moment(spritInfo.basic_info.start_time).format("YYYY-MM-DD")}
                            &nbsp;至&nbsp;
                            {moment(spritInfo.basic_info.end_time).format("YYYY-MM-DD")}
                        </div>
                    )}
                </div>
                {(spritInfo?.basic_info.non_work_day_list.length ?? 0) > 0 && (
                    <div className={s.info_wrap}>
                        <div className={s.label}>非工作日：</div>
                        <div>
                            {spritInfo?.basic_info.non_work_day_list.map(item => (
                                <Tag key={item}>{moment(item).format("YYYY-MM-DD")}</Tag>
                            ))}
                        </div>
                    </div>
                )}
                <div className={s.info_wrap}>
                    <div className={s.label}>关联频道：</div>
                    {spritInfo !== null && (<div>
                        <EditSelect
                            width="150px"
                            editable={projectStore.isAdmin && projectStore.curProject?.setting.layout_type != LAYOUT_TYPE_KB}
                            curValue={spritInfo?.link_channel_id ?? ""}
                            itemList={[
                                { value: "", label: "-", color: "black" },
                                ...(channelStore.channelList.filter(ch => ch.channelInfo.system_channel == false).map(ch => {
                                    return { value: ch.channelInfo.channel_id, label: ch.channelInfo.basic_info.channel_name, color: "black" };
                                })),
                            ]}
                            onChange={async (value) => {
                                if (value == undefined) {
                                    return false;
                                }
                                try {
                                    if (value == "") {
                                        const res = await cancel_link_channel(userStore.sessionId, projectStore.curProjectId, spritInfo?.sprit_id ?? "");
                                        if (res.code != 0) {
                                            return false;
                                        }
                                        if (spritInfo !== null) {
                                            setSpritInfo({
                                                ...spritInfo,
                                                link_channel_id: "",
                                                link_channel_title: "",
                                            });
                                        }
                                    } else {
                                        const res = await link_channel(userStore.sessionId, projectStore.curProjectId, spritInfo?.sprit_id ?? "", value as string);
                                        if (res.code != 0) {
                                            return false;
                                        }
                                        if (spritInfo !== null) {
                                            setSpritInfo({
                                                ...spritInfo,
                                                link_channel_id: value as string,
                                                link_channel_title: channelStore.getChannel(value as string)?.channelInfo.basic_info.channel_name ?? "",
                                            });
                                        }
                                    }
                                    return true;
                                } catch (e) {
                                    console.log(e);
                                }
                                return false;
                            }} showEditIcon={projectStore.curProject?.setting.layout_type != LAYOUT_TYPE_KB} allowClear={false} />
                        {((spritInfo?.link_channel_id.length ?? 0) > 0) && (
                            <Button type="link" style={{ marginLeft: "20px" }} 
                            disabled={projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_KB}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, spritInfo.link_channel_id ?? ""), history);
                            }}>进入沟通频道</Button>
                        )}
                    </div>
                    )}
                </div>
            </div>
            <div className={s.content_wrap}>
                <Tabs
                    activeKey={activeKey}
                    type="card"
                    onChange={value => {
                        history.push(`${location.pathname}?tab=${value}`, state);
                    }}>
                    <Tabs.TabPane tab="任务/缺陷" key="issue">
                        {activeKey == "issue" && spritInfo != null && <IssuePanel spritId={state.spritId} startTime={spritInfo.basic_info.start_time} endTime={spritInfo.basic_info.end_time} />}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="看板" key="kanban">
                        {activeKey == "kanban" && <KanbanPanel/>}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="相关文档" key="linkDoc">
                        {activeKey == "linkDoc" && <LinkDocPanel />}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="甘特图" key="gantt" disabled={!spritStore.allTimeReady}>
                        {activeKey == "gantt" && spritInfo != null && <GanttPanel spritName={spritInfo.basic_info.title} startTime={spritInfo.basic_info.start_time} endTime={spritInfo.basic_info.end_time} />}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="统计信息" key="statistics" disabled={!spritStore.allTimeReady}>
                        {activeKey == "statistics" && <StatPanel />}
                    </Tabs.TabPane>
                </Tabs>
            </div>
            {showRemoveModal == true && (
                <Modal
                    title="删除迭代"
                    open
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeSprit();
                    }}>
                    删除迭代后，相关任务和缺陷会被设置成未关联迭代状态。
                </Modal>
            )}
        </CardWrap>
    );
};

export default observer(SpritDetail);