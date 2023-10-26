import { Button, Card, Modal, Popover, Space, Tag, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { EntryInfo } from "@/api/project_entry";
import { watch, unwatch, update_mark_remove, ENTRY_TYPE_SPRIT, ENTRY_TYPE_DOC } from "@/api/project_entry";
import s from "./EntryCard.module.less";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { EditOutlined, InfoCircleOutlined, MoreOutlined } from "@ant-design/icons";
import EntryPopover from "./EntryPopover";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_KB_DOC_PATH, APP_PROJECT_WORK_PLAN_PATH } from "@/utils/constant";
import { getEntryTypeStr } from "./common";
import RemoveEntryModal from "./RemoveEntryModal";

export interface EntryCardPorps {
    entryInfo: EntryInfo;
    onRemove: () => void;
}

const EntryCard = (props: EntryCardPorps) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const docStore = useStores('docStore');

    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const watchEntry = async () => {
        await request(watch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryInfo.entry_id,
        }));
        entryStore.updateEntry(props.entryInfo.entry_id);
    };

    const unwatchEntry = async () => {
        await request(unwatch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryInfo.entry_id,
        }));
        entryStore.updateEntry(props.entryInfo.entry_id);
    }

    const openEntry = async () => {
        entryStore.reset();
        entryStore.curEntry = props.entryInfo;
        if (props.entryInfo.entry_type == ENTRY_TYPE_DOC) {
            await docStore.loadDoc();
            history.push(APP_PROJECT_KB_DOC_PATH);
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_SPRIT) {
            history.push(APP_PROJECT_WORK_PLAN_PATH);
        }
    };

    const getBgColor = () => {
        if (props.entryInfo.entry_type == ENTRY_TYPE_DOC) {
            return "lightyellow";
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_SPRIT) {
            return "seashell";
        }
        return "white";
    };

    const setRemoveMark = async (value: boolean) => {
        await request(update_mark_remove({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryInfo.entry_id,
            mark_remove: value,
        }));
        props.onRemove();
    };

    return (
        <Card title={
            <Space>
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.entryInfo.my_watch) {
                        unwatchEntry();
                    } else {
                        watchEntry();
                    }
                }}>
                    <span className={props.entryInfo.my_watch ? s.isCollect : s.noCollect} />
                </a>
                <span style={{ cursor: "pointer" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    openEntry();
                }}>{getEntryTypeStr(props.entryInfo.entry_type)}</span>
            </Space>
        }
            className={s.card} style={{ backgroundColor: getBgColor() }} headStyle={{ borderBottom: "none" }} bodyStyle={{ padding: "0px 10px" }} extra={
                <Space>
                    <Popover placement="top" trigger="hover" content={<EntryPopover entryInfo={props.entryInfo} />}>
                        <InfoCircleOutlined />
                    </Popover>
                    {props.entryInfo.can_update && (
                        <Button style={{ minWidth: 0, padding: "0px 0px" }} type="text" icon={<EditOutlined />}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                entryStore.editEntryId = props.entryInfo.entry_id;
                            }} />
                    )}
                    <Popover trigger="click" placement="bottom" content={
                        <Space direction="vertical" style={{ padding: "10px 10px" }}>
                            {props.entryInfo.mark_remove == false && (
                                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                    disabled={!(projectStore.isAdmin || (props.entryInfo.create_user_id == userStore.userInfo.userId))}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowCloseModal(true);
                                    }}>关闭</Button>
                            )}
                            {props.entryInfo.mark_remove == true && (
                                <>
                                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                        disabled={!(projectStore.isAdmin || (props.entryInfo.create_user_id == userStore.userInfo.userId))}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setRemoveMark(false).then(() => {
                                                message.info("打开成功");
                                            });
                                        }}>打开</Button>
                                    <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }}
                                        disabled={!(projectStore.isAdmin || (props.entryInfo.create_user_id == userStore.userInfo.userId))}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setShowRemoveModal(true);
                                        }}>删除</Button>
                                </>
                            )}
                        </Space>
                    }>
                        <MoreOutlined />
                    </Popover>
                </Space>
            }>
            <a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                openEntry();
            }} style={{ width: "180px", display: "block", height: "70px" }}>
                <h1 className={s.title}>{props.entryInfo.entry_title}</h1>
                <Space className={s.tagList}>
                    {props.entryInfo.tag_list.map(tag => (
                        <Tag key={tag.tag_id} style={{ backgroundColor: tag.bg_color }}>{tag.tag_name}</Tag>
                    ))}
                </Space>
            </a>
            {showCloseModal == true && (
                <Modal open title={`关闭内容入口`}
                    mask={false}
                    okText="关闭"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowCloseModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveMark(true).then(() => {
                            setShowCloseModal(false);
                            message.info("关闭成功");
                        });
                    }}>
                    <p>关闭内容入口&nbsp;{props.entryInfo.entry_title}</p>
                    <p>关闭后可以在关闭状态列表下找到。</p>
                </Modal>
            )}
            {showRemoveModal == true && (
                <RemoveEntryModal entryInfo={props.entryInfo} onRemove={() => {
                    props.onRemove();
                    setShowRemoveModal(false);
                }} onCancel={() => setShowRemoveModal(false)} />
            )}
        </Card>

    );
};

export default observer(EntryCard);