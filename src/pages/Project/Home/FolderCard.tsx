import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { FolderInfo } from "@/api/project_entry";
import { remove_folder, set_parent_folder } from "@/api/project_entry";
import { Button, Card, Modal, Popover, Space, message } from "antd";
import { useStores } from "@/hooks";
import s from "./Card.module.less";
import folderIcon from '@/assets/allIcon/icon-folder.png';
import { EditOutlined, InfoCircleOutlined, MoreOutlined } from "@ant-design/icons";
import UpdateFolderModal from "./components/UpdateFolderModal";
import { request } from "@/utils/request";
import FolderPopover from "./components/FolderPopover";
import MoveToFolderModal from "./components/MoveToFolderModal";


export interface FolderCardProps {
    folderInfo: FolderInfo;
    canMove: boolean;
    onRemove: () => void;
    onMove: () => void;
}

const FolderCard = (props: FolderCardProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');

    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);

    const removeFolder = async () => {
        await request(remove_folder({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            folder_id: props.folderInfo.folder_id,
        }));
        message.info("删除成功");
        props.onRemove();
    };

    const moveToFolder = async (parentFolderId: string) => {
        await request(set_parent_folder({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            folder_or_entry_id: props.folderInfo.folder_id,
            is_folder: true,
            parent_folder_id: parentFolderId,
        }));
        setShowMoveModal(false);
        props.onMove();
        message.info("移动成功");
    };

    return (
        <Card title={
            <span style={{ cursor: "pointer", fontWeight: 600 }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                entryStore.curFolderId = props.folderInfo.folder_id;
            }}>目录</span>
        } className={s.card} style={{ backgroundColor: "burlywood", backgroundImage: `url(${folderIcon})`, backgroundRepeat: "no-repeat", backgroundPosition: "95% 95%" }}
            headStyle={{ borderBottom: "none" }} bodyStyle={{ padding: "0px 10px" }}
            extra={
                <Space>
                    <Popover placement="top" trigger="hover" content={<FolderPopover folderInfo={props.folderInfo} />}>
                        <InfoCircleOutlined />
                    </Popover>
                    {props.folderInfo.can_update && (
                        <Button style={{ minWidth: 0, padding: "0px 0px" }} type="text" icon={<EditOutlined />}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowEditModal(true);
                            }} />
                    )}
                    <Popover trigger="click" placement="bottom" content={
                        <Space direction="vertical" style={{ padding: "10px 10px" }}>
                            {props.canMove && (
                                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowMoveModal(true);
                                }}>移动到目录</Button>
                            )}
                            <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                disabled={!props.folderInfo.can_remove} danger
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowRemoveModal(true);
                                }}>删除目录</Button>
                        </Space>
                    }>
                        <MoreOutlined />
                    </Popover>
                </Space>
            }>
            <a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                entryStore.curFolderId = props.folderInfo.folder_id;
            }} style={{ width: "180px", display: "block", height: "90px" }}>
                <h1 className={s.title}>
                    {props.folderInfo.folder_title}
                </h1>
                <div style={{ color: "black" }}>
                    <div>子目录:&nbsp;{props.folderInfo.sub_folder_count}</div>
                    <div>子内容:&nbsp;{props.folderInfo.sub_entry_count}</div>
                </div>
            </a>
            {showEditModal == true && (
                <UpdateFolderModal folderInfo={props.folderInfo} onCancel={() => setShowEditModal(false)}
                    onOk={() => {
                        setShowEditModal(false);
                        entryStore.incDataVersion();
                    }} />
            )}
            {showRemoveModal == true && (
                <Modal open title="删除目录"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeFolder();
                    }}>
                    是否删除目录&nbsp;{props.folderInfo.folder_title}?
                </Modal>
            )}
            {showMoveModal == true && (
                <MoveToFolderModal skipFolderId={props.folderInfo.folder_id} onCancel={() => setShowMoveModal(false)} onOk={folderId => moveToFolder(folderId)} />
            )}
        </Card>
    );
};

export default observer(FolderCard);