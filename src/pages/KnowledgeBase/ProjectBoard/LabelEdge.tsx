import React, { useState } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import type { Edge as BoardEdge, EdgeKey } from "@/api/project_board";
import { update_edge } from "@/api/project_board";
import { Input, Modal, Space } from "antd";
import { observer } from 'mobx-react';
import { EditOutlined } from "@ant-design/icons";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";

interface EditLabelModalProps {
    label: string;
    edgeKey: EdgeKey;
    onClose: () => void;
}

const EditLabelModal = observer((props: EditLabelModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const [label, setLabel] = useState(props.label);

    const updateLabel = async () => {
        await request(update_edge({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            edge: {
                edge_key: props.edgeKey,
                label: label,
            },
        }));
        boardStore.updateEdge(props.edgeKey);
        props.onClose();
    };

    return (
        <Modal open title="修改连接标签" okText="修改" okButtonProps={{ disabled: label == props.label }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateLabel();
            }}>
            <Input value={label} onChange={e => {
                e.stopPropagation();
                e.preventDefault();
                setLabel(e.target.value.trim());
            }} />
        </Modal>
    );
});

const LabelEdge = (props: EdgeProps<BoardEdge>) => {
    const entryStore = useStores('entryStore');

    const [showEditModal, setShowEditModal] = useState(false);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition,
    });

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={props.markerEnd}/>
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 14,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <Space>
                        <span>{props.data?.label ?? ""}</span>
                        {(entryStore.curEntry?.can_update ?? false) == true && (
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowEditModal(true);
                            }}><EditOutlined /></a>
                        )}
                    </Space>
                </div>
            </EdgeLabelRenderer>
            {showEditModal == true && props.data !== undefined && (
                <EditLabelModal label={props.data.label} edgeKey={props.data.edge_key} onClose={() => setShowEditModal(false)} />
            )}
        </>
    );
};

export default observer(LabelEdge);