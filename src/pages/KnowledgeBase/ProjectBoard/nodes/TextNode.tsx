import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { start_update_content, type Node as BoardNode, keep_update_content, end_update_content, update_content } from "@/api/project_board";
import NodeWrap from "./NodeWrap";
import { useStores } from "@/hooks";
import { ReadOnlyEditor, useCommonEditor } from "@/components/Editor";
import { Modal } from "antd";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";
import { request } from "@/utils/request";

interface EditTextModalProps {
    nodeId: string;
    onClose: () => void;
}

const EditTextModal = (props: EditTextModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: "",
        ownerType: FILE_OWNER_TYPE_NONE,
        ownerId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
    });

    const saveContent = async ()=>{
        await request(update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id??"",
            node_id: props.nodeId,
            node_data: {
                NodeTextData:{
                    data: JSON.stringify(editorRef.current?.getContent() ?? {"type":"doc"}),
                }
            },
        }));
        boardStore.updateNode(props.nodeId);
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

    return (
        <Modal open title="编辑文档"
            okText="保存" width="calc(100vw - 400px)"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }} 
            onOk={e=>{
                e.stopPropagation();
                e.preventDefault();
                saveContent();
            }}>
            <div className="_commentContext">
                {editor}
            </div>
        </Modal>
    );
};

const TextNode = (props: NodeProps<BoardNode>) => {
    const entryStore = useStores('entryStore');

    const [showModal, setShowModal] = useState(false);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="文档" onEdit={() => setShowModal(true)}>
            <ReadOnlyEditor content={props.data.node_data.NodeTextData?.data ?? ""} />
            {showModal == true && (
                <EditTextModal nodeId={props.data.node_id} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(TextNode);