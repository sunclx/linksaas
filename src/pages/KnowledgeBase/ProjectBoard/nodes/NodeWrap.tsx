import React, { useState } from "react";
import { Handle, Position, NodeResizeControl } from 'reactflow';
import { observer } from 'mobx-react';
import { Button, Card, Modal, Popover, Space } from "antd";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { remove_node } from "@/api/project_board";

export interface NodeWrapProps {
    nodeId: string;
    title: string;
    canEdit: boolean;
    minWidth: number;
    minHeight: number;
    children: React.ReactNode;
    width: number;
    height: number;
    onEdit: () => void;
}


const NodeWrap = (props: NodeWrapProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const [showRemoveModal, setShowRemoveModal] = useState(false);


    const removeNode = async () => {
        await request(remove_node({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
        }));
        boardStore.removeNode(props.nodeId);
        setShowRemoveModal(false);
    };

    return (
        <Card title={props.title} style={{ width: props.width, height: props.height}}
            bodyStyle={{ overflow: "scroll", height: props.height - 40 }}
            extra={
                <>
                    {props.canEdit && (
                        <Space className="nodrag nopan">
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onEdit();
                            }}><EditOutlined /></Button>
                            <Popover trigger="click" placement="bottom" content={
                                <div style={{ padding: "10px 10px" }}>
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowRemoveModal(true);
                                    }}>删除</Button>
                                </div>
                            }>
                                <MoreOutlined />
                            </Popover>
                        </Space>
                    )}
                </>
            }>
            <NodeResizeControl minWidth={props.minWidth} minHeight={props.minHeight}
                shouldResize={() => props.canEdit} />
            <Handle type="source" position={Position.Left} id="1" style={{ top: "40%", width: "6px", height: "6px" }} />
            <Handle type="source" position={Position.Top} id="2" style={{ left: "40%", width: "6px", height: "6px" }} />
            <Handle type="source" position={Position.Right} id="3" style={{ top: "40%", width: "6px", height: "6px" }} />
            <Handle type="source" position={Position.Bottom} id="4" style={{ left: "40%", width: "6px", height: "6px" }} />
            <Handle type="target" position={Position.Left} id="5" style={{ top: "60%", backgroundColor: "white", border: "1px solid black", width: "6px", height: "6px" }} />
            <Handle type="target" position={Position.Top} id="6" style={{ left: "60%", backgroundColor: "white", border: "1px solid black", width: "6px", height: "6px" }} />
            <Handle type="target" position={Position.Right} id="7" style={{ top: "60%", backgroundColor: "white", border: "1px solid black", width: "6px", height: "6px" }} />
            <Handle type="target" position={Position.Bottom} id="8" style={{ left: "60%", backgroundColor: "white", border: "1px solid black", width: "6px", height: "6px" }} />
            {props.children}
            {showRemoveModal == true && (
                <Modal open title={`删除节点 ${props.title}`}
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeNode();
                    }}>
                    是否删除节点&nbsp;{props.title}&nbsp;?
                </Modal>
            )}
        </Card>
    );
}

export default observer(NodeWrap);