import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { start_update_content, type Node as BoardNode, keep_update_content, end_update_content, update_content } from "@/api/project_board";
import NodeWrap from "./NodeWrap";
import { useStores } from "@/hooks";
import { Button, Empty, Form, Input, Modal, Progress } from "antd";
import AsyncImage from "@/components/AsyncImage";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { request } from "@/utils/request";
import { write_file, type FsProgressEvent, set_file_owner, FILE_OWNER_TYPE_BOARD } from "@/api/fs";
import { listen } from '@tauri-apps/api/event';
import { uniqId } from "@/utils/utils";

interface SelectImageModalProps {
    nodeId: string;
    onClose: () => void;
}

const SelectImageModal = (props: SelectImageModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const [localPath, setLocalPath] = useState("");
    const [inUpload, setInUpload] = useState(false);
    const [uploadRatio, setUploadRatio] = useState(0);

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "选择图片",
            filters: [{
                name: "图片",
                extensions: ["png", "ico", "jpeg", "jpg"]
            }],
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalPath(selected);
    };

    const uploadImage = async (uploadId: string) => {
        const res = await request(write_file(userStore.sessionId, projectStore.curProject?.board_fs_id ?? "", localPath, uploadId));
        await request(set_file_owner({
            session_id: userStore.sessionId,
            fs_id: projectStore.curProject?.board_fs_id ?? "",
            file_id: res.file_id,
            owner_type: FILE_OWNER_TYPE_BOARD,
            owner_id: entryStore.curEntry?.entry_id ?? "",
        }));
        await request(update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
            node_data: {
                NodeImageData: {
                    file_id: res.file_id,
                },
            },
        }));
        await boardStore.updateNode(props.nodeId);
        props.onClose();
    };

    useEffect(() => {
        request(start_update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
        }));
        const timer = setInterval(() => {
            request(keep_update_content({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                board_id: entryStore.curEntry?.entry_id ?? "",
                node_id: props.nodeId,
            }));
        }, 30 * 1000);
        return () => {
            clearInterval(timer);
            request(end_update_content({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                board_id: entryStore.curEntry?.entry_id ?? "",
                node_id: props.nodeId,
            }));
        };
    }, []);

    useEffect(() => {
        if (!inUpload) {
            return;
        }
        const uploadId = uniqId();
        const unListenFn = listen('uploadFile_' + uploadId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
            }
            if (payload.cur_step >= payload.total_step) {
                setUploadRatio(100);
            } else {
                setUploadRatio(Math.floor((payload.cur_step * 100) / payload.total_step));
            }
        });
        uploadImage(uploadId);
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, [inUpload]);

    return (
        <Modal open title="选择图片"
            okText="上传" okButtonProps={{ disabled: localPath == "" || inUpload }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }} onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                setInUpload(true);
            }}>
            <Form>
                <Form.Item>
                    <Input value={localPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLocalPath(e.target.value);
                    }}
                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePath();
                        }} />} />
                </Form.Item>
                {uploadRatio > 0 && (
                    <Form.Item>
                        <Progress percent={uploadRatio} />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

const ImageNode = (props: NodeProps<BoardNode>) => {
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');

    const [imageUrl, setImageUrl] = useState("");
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        if (props.data.node_data.NodeImageData?.file_id == "") {
            setImageUrl("");
        } else {
            if (navigator.userAgent.indexOf('Win') != -1) {
                setImageUrl(`https://fs.localhost/${projectStore.curProject?.board_fs_id ?? ""}/${props.data.node_data.NodeImageData?.file_id}/x.png`);
            } else {
                setImageUrl(`fs://localhost/${projectStore.curProject?.board_fs_id ?? ""}/${props.data.node_data.NodeImageData?.file_id}/x.png`);
            }
        }
    }, [props.data.node_data.NodeImageData?.file_id]);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="图片" onEdit={() => setShowModal(true)}>
            {imageUrl == "" && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: "0px 0px" }} />
            )}
            {imageUrl != "" && (
                <AsyncImage src={imageUrl} useRawImg={false} width={props.data.w} />
            )}
            {showModal == true && (
                <SelectImageModal nodeId={props.data.node_id} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(ImageNode);