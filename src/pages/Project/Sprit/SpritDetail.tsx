import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkSpritState } from "@/stores/linkAux";
import { get as get_sprit, remove as remove_sprit } from "@/api/project_sprit";
import type { SpritInfo } from "@/api/project_sprit";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import Button from "@/components/Button";
import { DeleteOutlined } from "@ant-design/icons";
import { message, Modal, Tabs, Tag } from 'antd';
import s from './SpritDetail.module.less';
import moment from "moment";
import IssuePanel from "./components/IssuePanel";

const SpritDetail = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const spritStore = useStores('spritStore');

    const location = useLocation();
    const state = location.state as LinkSpritState;
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
    }, []);

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
            </div>
            <div className={s.content_wrap}>
                <Tabs
                    defaultActiveKey="issue"
                    type="card">
                    <Tabs.TabPane tab="任务/缺陷" key="issue">
                        {spritInfo != null && <IssuePanel spritId={state.spritId} startTime={spritInfo.basic_info.start_time} endTime={spritInfo.basic_info.end_time} />}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="甘特图" key="gantt" disabled={!spritStore.allTimeReady}>
                        Content of Tab Pane 2
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="燃尽图" key="burnDown" disabled={!spritStore.allTimeReady}>
                        Content of Tab Pane 2
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