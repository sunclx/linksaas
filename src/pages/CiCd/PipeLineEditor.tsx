import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStores } from "./stores";
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, OnNodesDelete, OnEdgesDelete, NodePositionChange } from 'reactflow';
import ReactFlow, { Background, BackgroundVariant, Controls, MarkerType, MiniMap, Panel, ReactFlowProvider, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { observer } from 'mobx-react';
import 'reactflow/dist/style.css';
import "./flow.css";
import GitSourceNode from "./nodes/GitSourceNode";
import { uniqId } from "@/utils/utils";
import { JOB_TYPE_DOCKER, JOB_TYPE_SERVICE, JOB_TYPE_SHELL, SHELL_TYPE_SH, type Position as JobPosition } from "@/api/project_cicd";
import DockerNode from "./nodes/DockerNode";
import ShellNode from "./nodes/ShellNode";
import ServiceNode from "./nodes/ServiceNode";
import NodePanel, { DND_ITEM_TYPE, type NewNodeInfo } from "./NodePanel";
import { type DropTargetMonitor, useDrop } from "react-dnd";

const PipeLineEditor = () => {
    const store = useStores();

    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, drop] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: NewNodeInfo, monitor: DropTargetMonitor<NewNodeInfo, void>) => {
            if (reactFlowWrapper.current != null && store.paramStore.flowInstance != null && store.pipeLineStore.pipeLine != null) {
                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
                const clientOffset = monitor.getClientOffset();
                const position: JobPosition = store.paramStore.flowInstance.project({
                    x: (clientOffset?.x ?? 0) - reactFlowBounds.left,
                    y: (clientOffset?.y ?? 0) - reactFlowBounds.top,
                });

                if (item.nodeType == "ShellNode") {
                    store.pipeLineStore.pipeLine.exec_job_list.push({
                        job_id: uniqId(),
                        job_name: "脚本任务",
                        job_type: JOB_TYPE_SHELL,
                        depend_job_list: [],
                        run_on_param_list: [],
                        env_list: [],
                        job: {
                            ShellJob: {
                                shell_type: SHELL_TYPE_SH,
                                script_content: "",
                            },
                        },
                        position: position,
                        timeout: 600,
                    });
                } else if (item.nodeType == "DockerNode") {
                    store.pipeLineStore.pipeLine.exec_job_list.push({
                        job_id: uniqId(),
                        job_name: "Docker任务",
                        job_type: JOB_TYPE_DOCKER,
                        depend_job_list: [],
                        run_on_param_list: [],
                        env_list: [],
                        job: {
                            DockerJob: {
                                image_url: "",
                                script_content: "",
                                src_data_vol: "",
                                shared_data_vol: "",
                                persistent_data_vol: "",
                            }
                        },
                        position: position,
                        timeout: 600,
                    });
                } else if (item.nodeType == "ServiceNode") {
                    store.pipeLineStore.pipeLine.exec_job_list.push({
                        job_id: uniqId(),
                        job_name: "服务",
                        job_type: JOB_TYPE_SERVICE,
                        depend_job_list: [],
                        run_on_param_list: [],
                        env_list: [],
                        job: {
                            ServiceJob: {
                                docker_compose_file_id: "",
                                docker_compose_file_name: "",
                            },
                        },
                        position: position,
                        timeout: 600,
                    });
                }
                store.pipeLineStore.hasChange = true;
                store.pipeLineStore.incInitVersion();
            }
        },
        canDrop: () => store.paramStore.canUpdate,
    }));

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => {
            for (const change of changes) {
                if (store.pipeLineStore.pipeLine == null) {
                    continue;
                }
                if (change.type == "position") {
                    const realChange = change as NodePositionChange;
                    if (realChange.dragging) {
                        if (change.id == store.pipeLineStore.pipeLine.gitsource_job.job_id) {
                            store.pipeLineStore.pipeLine.gitsource_job.position = {
                                x: Math.floor(realChange.position?.x ?? 0),
                                y: Math.floor(realChange.position?.y ?? 0),
                            };
                        }
                        for (const execJob of store.pipeLineStore.pipeLine.exec_job_list) {
                            if (change.id == execJob.job_id) {
                                execJob.position = {
                                    x: Math.floor(realChange.position?.x ?? 0),
                                    y: Math.floor(realChange.position?.y ?? 0),
                                };
                            }
                        }
                        store.pipeLineStore.hasChange = true;
                    }
                }
            }

            return applyNodeChanges(changes, nds);

        }),
        [setNodes]
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => {
            const job = store.pipeLineStore.getExecJob(connection.target ?? "");
            if (job != null && connection.source != null && connection.source != connection.target) {
                job.depend_job_list.push(connection.source);
                store.pipeLineStore.hasChange = true;
                return addEdge(connection, eds);
            } else {
                return eds;
            }
        }),
        [setEdges]
    );

    const onNodesDelete: OnNodesDelete = useCallback((nodeList) => {
        for (const node of nodeList) {
            store.pipeLineStore.removeExecJob(node.id);
            store.pipeLineStore.hasChange = true;
        }
    }, [setNodes, setEdges]);

    const onEdgesDelete: OnEdgesDelete = useCallback((edgeList) => {
        for (const edge of edgeList) {
            store.pipeLineStore.removeJobDepend(edge.target, edge.source);
            store.pipeLineStore.hasChange = true;
        }
    }, [setEdges]);

    const initNodeAndEdge = async () => {
        if (store.pipeLineStore.pipeLine == null || store.pipeLineStore.initVersion == 0) {
            return;
        }
        const tmpNodes: Node[] = [];
        const tmpEdges: Edge[] = [];

        tmpNodes.push({
            id: store.pipeLineStore.pipeLine.gitsource_job.job_id,
            type: "GitSourceNode",
            position: {
                x: store.pipeLineStore.pipeLine.gitsource_job.position.x,
                y: store.pipeLineStore.pipeLine.gitsource_job.position.y,
            },
            selectable: true,
            deletable: false,
            draggable: store.paramStore.canUpdate,
            connectable: store.paramStore.canUpdate,
            data: null,
        });

        for (const job of store.pipeLineStore.pipeLine.exec_job_list) {
            let jobType = "";
            if (job.job_type == JOB_TYPE_DOCKER) {
                jobType = "DockerNode";
            } else if (job.job_type == JOB_TYPE_SHELL) {
                jobType = "ShellNode";
            } else if (job.job_type == JOB_TYPE_SERVICE) {
                jobType = "ServiceNode";
            }
            tmpNodes.push({
                id: job.job_id,
                type: jobType,
                position: job.position,
                data: null,
                selectable: true,
                deletable: store.paramStore.canUpdate,
                draggable: store.paramStore.canUpdate,
                connectable: store.paramStore.canUpdate,
                zIndex: 10,
            });
            for (const dependJobId of job.depend_job_list) {
                tmpEdges.push({
                    id: `${dependJobId}-${job.job_id}`,
                    source: dependJobId,
                    target: job.job_id,
                    deletable: store.paramStore.canUpdate,
                    markerEnd: {
                        type: MarkerType.Arrow,
                        color: 'black',
                        strokeWidth: 3,
                    },
                    zIndex: 20,
                });
            }
        }
        setNodes(tmpNodes);
        setEdges(tmpEdges);
    };

    useEffect(() => {
        initNodeAndEdge();
    }, [store.pipeLineStore.initVersion]);

    const nodeTypes = useMemo(() => ({
        GitSourceNode: GitSourceNode,
        DockerNode: DockerNode,
        ShellNode: ShellNode,
        ServiceNode: ServiceNode,
    }), []);

    return (
        <ReactFlowProvider>
            <div className="reactflow-wrapper" style={{ height: "calc(100vh - 40px)", width: "100vw" }} ref={reactFlowWrapper}>
                <ReactFlow
                    ref={drop}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodesDelete={onNodesDelete}
                    onEdgesDelete={onEdgesDelete}
                    onInit={(instance) => store.paramStore.flowInstance = instance}
                    deleteKeyCode={["Backspace", "Delete"]}
                    fitView
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={{
                        animated: true, deletable: store.paramStore.canUpdate, markerEnd: {
                            type: MarkerType.Arrow,
                            color: 'black',
                            strokeWidth: 3,
                        },
                        zIndex: 20,
                    }}
                >
                    <Background color="#aaa" variant={BackgroundVariant.Cross} style={{ backgroundColor: "#eee" }} />
                    <Controls showInteractive={false} />
                    <MiniMap nodeStrokeWidth={3} zoomable pannable />
                    {store.paramStore.canUpdate && (
                        <Panel position="top-left">
                            <NodePanel />
                        </Panel>
                    )}
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default observer(PipeLineEditor);