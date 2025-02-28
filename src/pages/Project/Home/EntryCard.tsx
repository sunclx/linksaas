import { Button, Card, Modal, Popover, Space, Tag, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { EntryInfo } from "@/api/project_entry";
import { update_mark_remove, update_mark_sys, ENTRY_TYPE_SPRIT, ENTRY_TYPE_DOC, ENTRY_TYPE_PAGES, ENTRY_TYPE_BOARD, ENTRY_TYPE_FILE, set_parent_folder } from "@/api/project_entry";
import s from "./Card.module.less";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { EditOutlined, InfoCircleOutlined, MoreOutlined } from "@ant-design/icons";
import EntryPopover from "./components/EntryPopover";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_KB_BOARD_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_WORK_PLAN_PATH } from "@/utils/constant";
import { getEntryTypeStr } from "./components/common";
import RemoveEntryModal from "./components/RemoveEntryModal";
import { watch, unwatch, WATCH_TARGET_ENTRY } from "@/api/project_watch";
import spritIcon from '@/assets/allIcon/icon-sprit.png';
import htmlIcon from '@/assets/allIcon/icon-html.png';
import boardIcon from '@/assets/allIcon/icon-board.png';
import docIcon from '@/assets/channel/doc@2x.png';
import PagesModal from "./components/PagesModal";
import FileModal from "./components/FileModal";
import MoveToFolderModal from "./components/MoveToFolderModal";

export interface EntryCardPorps {
    entryInfo: EntryInfo;
    canMove: boolean;
    onRemove: () => void;
    onMarkSys: () => void;
}

const EntryCard = (props: EntryCardPorps) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const docStore = useStores('docStore');
    const boardStore = useStores('boardStore');

    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);

    const watchEntry = async () => {
        await request(watch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_ENTRY,
            target_id: props.entryInfo.entry_id,
        }));
        entryStore.updateEntry(props.entryInfo.entry_id);
    };

    const unwatchEntry = async () => {
        await request(unwatch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_ENTRY,
            target_id: props.entryInfo.entry_id,
        }));
        entryStore.updateEntry(props.entryInfo.entry_id);
    }

    const openEntry = async () => {
        entryStore.reset();
        if (props.entryInfo.entry_type == ENTRY_TYPE_DOC) {
            entryStore.curEntry = props.entryInfo;
            await docStore.loadDoc();
            history.push(APP_PROJECT_KB_DOC_PATH);
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_SPRIT) {
            entryStore.curEntry = props.entryInfo;
            history.push(APP_PROJECT_WORK_PLAN_PATH);
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_PAGES) {
            setShowPagesModal(true);
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_BOARD) {
            entryStore.curEntry = props.entryInfo;
            boardStore.reset();
            history.push(APP_PROJECT_KB_BOARD_PATH);
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_FILE) {
            setShowFileModal(true);
        }
    };

    const getBgColor = () => {
        if (props.entryInfo.entry_type == ENTRY_TYPE_DOC) {
            return "lightyellow";
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_SPRIT) {
            return "seashell";
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_PAGES) {
            return "bisque";
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_BOARD) {
            return "gainsboro";
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_FILE) {
            return "honeydew";
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

    const setSysMark = async (value: boolean) => {
        await request(update_mark_sys({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryInfo.entry_id,
            mark_sys: value,
        }));
        message.info("修改成功");
        props.onMarkSys();
    };

    const getBgImage = () => {
        if (props.entryInfo.entry_type == ENTRY_TYPE_DOC || props.entryInfo.entry_type == ENTRY_TYPE_FILE) {
            return docIcon;
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_SPRIT) {
            return spritIcon;
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_PAGES) {
            return htmlIcon;
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_BOARD) {
            return boardIcon;
        }
        return "";
    };

    const moveToFolder = async (parentFolderId: string) => {
        await request(set_parent_folder({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            folder_or_entry_id: props.entryInfo.entry_id,
            is_folder: false,
            parent_folder_id: parentFolderId,
        }));
        setShowMoveModal(false);
        entryStore.incDataVersion();
        message.info("移动成功");
    };

    return (
        <Card title={
            <Space size="small">
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
                <span style={{ cursor: "pointer", fontWeight: 600 }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    openEntry();
                }}>{getEntryTypeStr(props.entryInfo.entry_type)}</span>
            </Space>
        }
            className={s.card} style={{ backgroundColor: getBgColor(), backgroundImage: `url(${getBgImage()})`, backgroundRepeat: "no-repeat", backgroundPosition: "95% 95%" }}
            headStyle={{ borderBottom: "none" }} bodyStyle={{ padding: "0px 10px" }} extra={
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
                                <>
                                    {props.canMove && (
                                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setShowMoveModal(true);
                                        }}>移动到目录</Button>
                                    )}
                                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                        disabled={!(projectStore.isAdmin || (props.entryInfo.create_user_id == userStore.userInfo.userId))}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setShowCloseModal(true);
                                        }}>移至回收站</Button>
                                    {props.entryInfo.mark_sys == false && (
                                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                            disabled={!(projectStore.isAdmin || (props.entryInfo.create_user_id == userStore.userInfo.userId))}
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setSysMark(true);
                                            }}>标记为系统面板</Button>
                                    )}
                                    {props.entryInfo.mark_sys == true && (
                                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                            disabled={!(projectStore.isAdmin || (props.entryInfo.create_user_id == userStore.userInfo.userId))}
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setSysMark(false);
                                            }}>取消系统面板标记</Button>
                                    )}
                                </>
                            )}
                            {props.entryInfo.mark_remove == true && (
                                <>
                                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                        disabled={!(projectStore.isAdmin || (props.entryInfo.create_user_id == userStore.userInfo.userId))}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setRemoveMark(false).then(() => {
                                                message.info("恢复成功");
                                            });
                                        }}>恢复</Button>
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
            }} style={{ width: "180px", display: "block", height: "90px" }}>
                <h1 className={s.title}>
                    {props.entryInfo.entry_title}
                </h1>
                <div className={s.tagList}>
                    {props.entryInfo.mark_sys && (
                        <Tag key="sys" style={{ backgroundColor: "yellow" }}>系统面板</Tag>
                    )}
                    {props.entryInfo.tag_list.map(tag => (
                        <Tag key={tag.tag_id} style={{ backgroundColor: tag.bg_color }}>{tag.tag_name}</Tag>
                    ))}
                </div>
            </a>
            {showCloseModal == true && (
                <Modal open title={`移至回收站`}
                    mask={false}
                    okText="移动"
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
                            message.info("移至回收站成功");
                        });
                    }}>
                    <p>移动内容入口&nbsp;{props.entryInfo.entry_title}&nbsp;至回收站。</p>
                    <p>移至回收站后可以在回收站列表下找到。</p>
                </Modal>
            )}
            {showRemoveModal == true && (
                <RemoveEntryModal entryInfo={props.entryInfo} onRemove={() => {
                    props.onRemove();
                    setShowRemoveModal(false);
                }} onCancel={() => setShowRemoveModal(false)} />
            )}
            {showPagesModal == true && (
                <PagesModal fileId={props.entryInfo.extra_info.ExtraPagesInfo?.file_id ?? ""}
                    entryId={props.entryInfo.entry_id} entryTitle={props.entryInfo.entry_title}
                    onClose={() => setShowPagesModal(false)} />
            )}
            {showFileModal == true && (
                <FileModal fileId={props.entryInfo.extra_info.ExtraFileInfo?.file_id ?? ""} fileName={props.entryInfo.extra_info.ExtraFileInfo?.file_name ?? ""}
                    onClose={() => setShowFileModal(false)} />
            )}
            {showMoveModal == true && (
                <MoveToFolderModal onCancel={() => setShowMoveModal(false)} onOk={folderId => moveToFolder(folderId)} />
            )}
        </Card>

    );
};

export default observer(EntryCard);