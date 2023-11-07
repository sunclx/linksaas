import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { observer } from 'mobx-react';
import type { Node as FlowNode, Edge as FlowEdge, XYPosition, OnNodesDelete, OnNodesChange, NodePositionChange, NodeDimensionChange, OnConnect, OnEdgesDelete } from 'reactflow';
import ReactFlow, { Background, BackgroundVariant, Controls, MarkerType, MiniMap, Panel, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import "./flow.css";
import { useStores } from "@/hooks";
import NodePanel, { DND_ITEM_TYPE, type NewNodeInfo } from "./NodePanel";
import { type DropTargetMonitor, useDrop } from "react-dnd";
import RefTaskNode from "./nodes/RefTaskNode";
import { BOARD_NODE_TYPE_IMAGE, type BOARD_NODE_TYPE, BOARD_NODE_TYPE_TEXT, BOARD_NODE_TYPE_REF_BUG, BOARD_NODE_TYPE_REF_REQUIRE_MENT, BOARD_NODE_TYPE_REF_PIPE_LINE, BOARD_NODE_TYPE_REF_API_COLL, BOARD_NODE_TYPE_REF_DATA_ANNO, BOARD_NODE_TYPE_REF_TASK, BOARD_NODE_TYPE_MERMAID } from "./nodes/types";
import { request } from "@/utils/request";
import { NODE_REF_TYPE_API_COLL, NODE_REF_TYPE_BUG, NODE_REF_TYPE_DATA_ANNO, NODE_REF_TYPE_PIPE_LINE, NODE_REF_TYPE_REQUIRE_MENT, NODE_REF_TYPE_TASK, NODE_TYPE_IMAGE, NODE_TYPE_MERMAID, NODE_TYPE_REF, NODE_TYPE_TEXT } from "@/api/project_board";
import { create_node, remove_node, update_node_position, update_node_size, remove_edge, create_edge } from "@/api/project_board";
import type { NodeData, EdgeKey } from "@/api/project_board";
import RefBugNode from "./nodes/RefBugNode";
import RefRequireMentNode from "./nodes/RefRequireMentNode";
import RefPipeLineNode from "./nodes/RefPipeLineNode";
import RefApiCollNode from "./nodes/RefApiCollNode";
import RefDataAnnoNode from "./nodes/RefDataAnnoNode";
import ImageNode from "./nodes/ImageNode";
import TextNode from "./nodes/TextNode";
import LabelEdge from "./LabelEdge";
import CommentEntry from "@/components/CommentEntry";
import { COMMENT_TARGET_ENTRY } from "@/api/project_comment";
import MermaidNode from "./nodes/MermaidNode";

const BoardEditor = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes] = useState<FlowNode[]>([]);
    const [edges, setEdges] = useState<FlowEdge[]>([]);

    const addNode = async (boardNodeType: BOARD_NODE_TYPE, position: XYPosition) => {
        let nodeType = NODE_TYPE_REF;
        const nodeData: NodeData = {};
        if (boardNodeType == BOARD_NODE_TYPE_IMAGE) {
            nodeType = NODE_TYPE_IMAGE;
            nodeData.NodeImageData = {
                file_id: "",
            };
        } else if (boardNodeType == BOARD_NODE_TYPE_TEXT) {
            nodeType = NODE_TYPE_TEXT;
            nodeData.NodeTextData = {
                data: "",
            };
        } else if (boardNodeType == BOARD_NODE_TYPE_MERMAID) {
            nodeType = NODE_TYPE_MERMAID;
            nodeData.NodeMermaidData = {
                data: "",
            };
        } else {
            let refType = NODE_REF_TYPE_TASK;
            if (boardNodeType == BOARD_NODE_TYPE_REF_BUG) {
                refType = NODE_REF_TYPE_BUG;
            } else if (boardNodeType == BOARD_NODE_TYPE_REF_REQUIRE_MENT) {
                refType = NODE_REF_TYPE_REQUIRE_MENT;
            } else if (boardNodeType == BOARD_NODE_TYPE_REF_PIPE_LINE) {
                refType = NODE_REF_TYPE_PIPE_LINE;
            } else if (boardNodeType == BOARD_NODE_TYPE_REF_API_COLL) {
                refType = NODE_REF_TYPE_API_COLL;
            } else if (boardNodeType == BOARD_NODE_TYPE_REF_DATA_ANNO) {
                refType = NODE_REF_TYPE_DATA_ANNO;
            }
            nodeData.NodeRefData = {
                ref_type: refType,
                ref_target_id: "",
            };
        }
        const res = await request(create_node({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_type: nodeType,
            x: Math.round(position.x),
            y: Math.round(position.y),
            w: 150,
            h: 150,
            node_data: nodeData,
        }));
        boardStore.updateNode(res.node_id);
    };

    const [_, drop] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: NewNodeInfo, monitor: DropTargetMonitor<NewNodeInfo, void>) => {
            if (reactFlowWrapper.current != null && boardStore.flowInstance != null) {
                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
                const clientOffset = monitor.getClientOffset();
                const position = boardStore.flowInstance.project({
                    x: (clientOffset?.x ?? 0) - reactFlowBounds.left,
                    y: (clientOffset?.y ?? 0) - reactFlowBounds.top,
                });
                addNode(item.nodeType, position);
            }
        },
        canDrop: () => entryStore.curEntry?.can_update ?? false,
    }));


    useEffect(() => {
        const canUpdate = entryStore.curEntry?.can_update ?? false;
        const tmpNodeList: FlowNode[] = boardStore.nodeList.map(item => {
            let boardNodeType = BOARD_NODE_TYPE_TEXT;
            if (item.node_type == NODE_TYPE_IMAGE) {
                boardNodeType = BOARD_NODE_TYPE_IMAGE;
            } else if (item.node_type == NODE_TYPE_MERMAID) {
                boardNodeType = BOARD_NODE_TYPE_MERMAID;
            } else if (item.node_type == NODE_TYPE_REF) {
                if (item.node_data.NodeRefData?.ref_type == NODE_REF_TYPE_TASK) {
                    boardNodeType = BOARD_NODE_TYPE_REF_TASK;
                } else if (item.node_data.NodeRefData?.ref_type == NODE_REF_TYPE_BUG) {
                    boardNodeType = BOARD_NODE_TYPE_REF_BUG;
                } else if (item.node_data.NodeRefData?.ref_type == NODE_REF_TYPE_REQUIRE_MENT) {
                    boardNodeType = BOARD_NODE_TYPE_REF_REQUIRE_MENT;
                } else if (item.node_data.NodeRefData?.ref_type == NODE_REF_TYPE_PIPE_LINE) {
                    boardNodeType = BOARD_NODE_TYPE_REF_PIPE_LINE;
                } else if (item.node_data.NodeRefData?.ref_type == NODE_REF_TYPE_API_COLL) {
                    boardNodeType = BOARD_NODE_TYPE_REF_API_COLL;
                } else if (item.node_data.NodeRefData?.ref_type == NODE_REF_TYPE_DATA_ANNO) {
                    boardNodeType = BOARD_NODE_TYPE_REF_DATA_ANNO;
                }
            }
            return {
                id: item.node_id,
                position: {
                    x: item.x,
                    y: item.y,
                },
                data: item,
                selectable: canUpdate,
                draggable: canUpdate,
                deletable: canUpdate,
                connectable: canUpdate,
                focusable: canUpdate,
                type: boardNodeType,
            };
        });
        setNodes(tmpNodeList);
    }, [boardStore.nodeList]);

    const removeNode = async (nodeId: string) => {
        await request(remove_node({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: nodeId,
        }));
        boardStore.removeNode(nodeId);
    };

    const onNodesDelete: OnNodesDelete = useCallback((nodeList) => {
        for (const node of nodeList) {
            removeNode(node.id);
        }
    }, [setNodes, setEdges]);

    const removeEdge = async (edgeKey: EdgeKey) => {
        await request(remove_edge({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            edge_key: edgeKey,
        }));
        boardStore.removeEdge(edgeKey);
    };

    const onEdgesDelete: OnEdgesDelete = useCallback((edgeList) => {
        for (const edge of edgeList) {
            removeEdge({
                from_node_id: edge.source,
                from_handle_id: edge.sourceHandle ?? "",
                to_node_id: edge.target,
                to_handle_id: edge.targetHandle ?? ""
            });
        }
    }, [setEdges]);

    const updateNodePosition = async (nodeId: string) => {
        const index = boardStore.nodeList.findIndex(item => item.node_id == nodeId);
        if (index == -1) {
            return;
        }
        await request(update_node_position({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: nodeId,
            x: boardStore.nodeList[index].x,
            y: boardStore.nodeList[index].y,
        }));
    };

    const updateNodeSize = async (nodeId: string) => {
        const index = boardStore.nodeList.findIndex(item => item.node_id == nodeId);
        if (index == -1) {
            return;
        }
        await request(update_node_size({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: nodeId,
            w: boardStore.nodeList[index].w,
            h: boardStore.nodeList[index].h,
        }));
    };

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            for (const change of changes) {
                if (change.type == "position") {
                    const realChange = change as NodePositionChange;
                    if (realChange.dragging) {
                        boardStore.updateNodePosition(change.id, Math.round(realChange.position?.x ?? 0), Math.round(realChange.position?.y ?? 0));
                    } else {
                        updateNodePosition(change.id);
                    }
                } else if (change.type == "dimensions") {
                    console.log(change);
                    const realChange = change as NodeDimensionChange;
                    if (realChange.resizing) {
                        boardStore.updateNodeSize(change.id, Math.round(realChange.dimensions?.width ?? 0), Math.round(realChange.dimensions?.height ?? 0));
                    } else if (realChange.resizing == false) {
                        updateNodeSize(change.id);
                    }
                }
            }
        },
        [setNodes]
    );

    const createEdge = async (edgeKey: EdgeKey) => {
        await request(create_edge({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            edge: {
                edge_key: edgeKey,
                label: "",
            },
        }));
        boardStore.updateEdge(edgeKey);
    };

    const onConnect: OnConnect = useCallback(
        (conn) => {
            if (conn.source == conn.target || conn.source == null || conn.target == null || conn.sourceHandle == null || conn.targetHandle == null) {
                return;
            }
            createEdge({
                from_node_id: conn.source,
                from_handle_id: conn.sourceHandle,
                to_node_id: conn.target,
                to_handle_id: conn.targetHandle,
            });
        },
        [setEdges]
    );

    useEffect(() => {
        const canUpdate = entryStore.curEntry?.can_update ?? false;
        const tmpEdgeList: FlowEdge[] = boardStore.edgeList.map(item => {
            return {
                id: `${item.edge_key.from_node_id}:${item.edge_key.from_handle_id}:${item.edge_key.to_node_id}:${item.edge_key.to_handle_id}`,
                source: item.edge_key.from_node_id,
                target: item.edge_key.to_node_id,
                sourceHandle: item.edge_key.from_handle_id,
                targetHandle: item.edge_key.to_handle_id,
                deletable: canUpdate,
                focusable: canUpdate,
                updatable: canUpdate,
                data: item,
                animated: true,
                type: "LabelEdge",
                markerEnd: {
                    type: MarkerType.Arrow,
                    color: 'orange',
                    strokeWidth: 3,
                },
            }
        });
        setEdges(tmpEdgeList);
    }, [boardStore.edgeList]);

    useEffect(() => {
        boardStore.loadNodeList();
        boardStore.loadEdgeList();
    }, []);

    const nodeTypes = useMemo(() => ({
        RefTaskNode: RefTaskNode,
        RefBugNode: RefBugNode,
        RefRequireMentNode: RefRequireMentNode,
        RefPipeLineNode: RefPipeLineNode,
        RefApiCollNode: RefApiCollNode,
        RefDataAnnoNode: RefDataAnnoNode,
        ImageNode: ImageNode,
        TextNode: TextNode,
        MermaidNode: MermaidNode,
    }), []);

    const edgeTypes = useMemo(() => ({
        LabelEdge: LabelEdge,
    }), []);

    return (
        <ReactFlowProvider>
            <div className="reactflow-wrapper" style={{ height: "100%", width: "100%" }} ref={reactFlowWrapper}>
                <ReactFlow
                    ref={drop}
                    nodes={nodes}
                    edges={edges}
                    onInit={(instance) => boardStore.flowInstance = instance}
                    deleteKeyCode={["Backspace", "Delete"]}
                    onNodesDelete={onNodesDelete}
                    onEdgesDelete={onEdgesDelete}
                    onNodesChange={onNodesChange}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onConnect={onConnect}
                    fitView>
                    <Background color="#aaa" variant={BackgroundVariant.Cross} style={{ backgroundColor: "#f0f0f0" }} />
                    <Controls showInteractive={false} />
                    <MiniMap nodeStrokeWidth={3} zoomable pannable />
                    <Panel position="top-left">
                        <NodePanel />
                    </Panel>
                    <Panel position="top-right">
                        <CommentEntry projectId={projectStore.curProjectId} targetType={COMMENT_TARGET_ENTRY}
                            targetId={entryStore.curEntry?.entry_id ?? ""} myUserId={userStore.userInfo.userId} myAdmin={projectStore.isAdmin} />
                    </Panel>
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default observer(BoardEditor);