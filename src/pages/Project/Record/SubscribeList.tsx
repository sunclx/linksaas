import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import Button from "@/components/Button";
import CreateSubscribeModal from "./components/CreateSubscribeModal";
import { useStores } from "@/hooks";
import type { SubscribeInfo } from '@/api/events_subscribe';
import { list as list_subscribe, adjust_event_cfg, remove as remove_subscribe } from '@/api/events_subscribe';
import { request } from "@/utils/request";
import s from './SubscribeList.module.less';
import moment from 'moment';
import { Card, Checkbox, Form, Modal, message } from "antd";
import {
    codeEvOptionList, extEvOptionList,
    genCodeEvCfgValues, genExtEvCfgValues, genGiteeEvCfgValues, genGitlabEvCfgValues,
    genIssueEvCfgValues, genProjectEvCfgValues, genRequirementEvCfgValues,
    giteeEvOptionList, gitlabEvOptionList, issueEvOptionList, projectEvOptionList,
    requirementEvOptionList, ideaEvOptionList, genIdeaEvCfgValues, dataAnnoEvOptionList, genDataAnnoEvCfgValues,
    apiCollectionEvOptionList, genApiCollectionEvCfgValues, atomgitEvOptionList, genAtomgitEvCfgValues, genEntryEvCfgValues, entryEvOptionList, genHarborEvCfgValues, harborEvOptionList
} from "./components/constants";
import UpdateSubscribeModal from "./components/UpdateSubscribeModal";
import Dropdown from "antd/lib/dropdown";

const SubscribeList = () => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const [showAddModal, setShowAddModal] = useState(false);
    const [subscribeList, setSubscribeList] = useState<SubscribeInfo[]>([]);
    const [curSubscribeId, setCurSubscribeId] = useState("");
    const [updateSubscribe, setUpdateSubscribe] = useState<SubscribeInfo | null>(null);
    const [removeSubscribe, setRemoveSubscribe] = useState<SubscribeInfo | null>(null);

    const loadSubscribe = async () => {
        const res = await request(list_subscribe({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setSubscribeList(res.info_list.map(item => {
            return {
                ...item,
                event_cfg: adjust_event_cfg(item.event_cfg),
            };
        }));
    };

    const removeEventSub = async () => {
        if (removeSubscribe == null) {
            return;
        }
        await request(remove_subscribe({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            subscribe_id: removeSubscribe.subscribe_id,
        }));
        message.info(`删除订阅${removeSubscribe.chat_bot_name}成功`);
        setRemoveSubscribe(null);
        await loadSubscribe();
    }

    useEffect(() => {
        loadSubscribe();
    }, [projectStore.curProjectId])
    return (
        <CardWrap>
            <DetailsNav title="研发事件订阅" >
                <Button
                    disabled={projectStore.isClosed || (!projectStore.isAdmin)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }}>新增订阅</Button>
            </DetailsNav>
            <div className={s.list}>
                <div className={s.list_cont}>
                    {subscribeList.map(item => (
                        <div className={s.list_item} key={item.subscribe_id}>
                            <div className={s.list_hd}>
                                <div className={s.list_title}>{item.chat_bot_name}</div>
                                <div className={s.list_info}>
                                    <div className={s.list_info_item}>
                                        创建人：{item.create_display_name}
                                    </div>
                                    <div className={s.list_info_item}>
                                        创建日期: {moment(item.create_time).format("YYYY-MM-DD")}
                                    </div>
                                    <div className={s.list_info_item}>
                                        更新人：{item.update_display_name}
                                    </div>
                                    <div className={s.list_info_item}>
                                        更新日期: {moment(item.update_time).format("YYYY-MM-DD")}
                                    </div>
                                    <a className={s.list_expand} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (curSubscribeId == item.subscribe_id) {
                                            setCurSubscribeId("");
                                        } else {
                                            setCurSubscribeId(item.subscribe_id);
                                        }
                                    }}>
                                        {curSubscribeId == item.subscribe_id ? "收起" : "展开"}
                                    </a>
                                </div>
                            </div>
                            {curSubscribeId == item.subscribe_id && (
                                <Card bordered={false} extra={
                                    <Dropdown.Button
                                        disabled={projectStore.isClosed || (!projectStore.isAdmin)}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setUpdateSubscribe(item);
                                        }}
                                        menu={{
                                            items: [
                                                {
                                                    label: "删除订阅",
                                                    key: "remove",
                                                    danger: true,
                                                    disabled: projectStore.isAdmin == false,
                                                }
                                            ],
                                            onClick: e => {
                                                if (e.key == "remove") {
                                                    setRemoveSubscribe(item);
                                                }
                                            },
                                        }}
                                    >
                                        修改订阅
                                    </Dropdown.Button>
                                }>
                                    <Form labelCol={{ span: 3 }}>
                                        <Form.Item label="项目事件">
                                            <Checkbox.Group options={projectEvOptionList} value={genProjectEvCfgValues(item.event_cfg.project_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="内容事件">
                                            <Checkbox.Group options={entryEvOptionList} value={genEntryEvCfgValues(item.event_cfg.entry_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="第三方接入事件">
                                            <Checkbox.Group options={extEvOptionList} value={genExtEvCfgValues(item.event_cfg.ext_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="atomgit事件">
                                            <Checkbox.Group options={atomgitEvOptionList} value={genAtomgitEvCfgValues(item.event_cfg.atomgit_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="gitee事件">
                                            <Checkbox.Group options={giteeEvOptionList} value={genGiteeEvCfgValues(item.event_cfg.gitee_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="gitlab事件">
                                            <Checkbox.Group options={gitlabEvOptionList} value={genGitlabEvCfgValues(item.event_cfg.gitlab_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="harbor事件">
                                            <Checkbox.Group options={harborEvOptionList} value={genHarborEvCfgValues(item.event_cfg.harbor_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="需求事件">
                                            <Checkbox.Group options={requirementEvOptionList} value={genRequirementEvCfgValues(item.event_cfg.requirement_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="工单事件">
                                            <Checkbox.Group options={issueEvOptionList} value={genIssueEvCfgValues(item.event_cfg.issue_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="代码事件">
                                            <Checkbox.Group options={codeEvOptionList} value={genCodeEvCfgValues(item.event_cfg.code_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="知识点事件">
                                            <Checkbox.Group options={ideaEvOptionList} value={genIdeaEvCfgValues(item.event_cfg.idea_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="数据标注事件">
                                            <Checkbox.Group options={dataAnnoEvOptionList} value={genDataAnnoEvCfgValues(item.event_cfg.data_anno_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                        <Form.Item label="接口集合事件">
                                            <Checkbox.Group options={apiCollectionEvOptionList} value={genApiCollectionEvCfgValues(item.event_cfg.api_collection_ev_cfg)} disabled={true} />
                                        </Form.Item>
                                    </Form>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {showAddModal == true && <CreateSubscribeModal onCancel={() => setShowAddModal(false)} onOk={() => {
                loadSubscribe();
                setShowAddModal(false);
            }} />}
            {updateSubscribe != null && <UpdateSubscribeModal subscribe={updateSubscribe} onCancel={() => setUpdateSubscribe(null)} onOk={() => {
                loadSubscribe();
                setUpdateSubscribe(null);
            }} />}
            {removeSubscribe != null && (
                <Modal title="删除订阅" open
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveSubscribe(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeEventSub();
                    }}>
                    是否删除事件订阅&nbsp;{removeSubscribe.chat_bot_name}&nbsp;?
                </Modal>
            )}
        </CardWrap>
    );
}

export default observer(SubscribeList);