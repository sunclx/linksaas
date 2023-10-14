import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useStores } from "./stores";
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, OnNodesDelete, OnEdgesDelete, NodePositionChange } from 'reactflow';
import ReactFlow, { Background, BackgroundVariant, Controls, MarkerType, MiniMap, Panel, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { observer } from 'mobx-react';
import 'reactflow/dist/style.css';
import GitSourceNode from "./nodes/GitSourceNode";
import { Button, Space, message } from "antd";
import { PlusCircleOutlined, PlusOutlined, PlusSquareOutlined, SaveOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";
import { JOB_TYPE_DOCKER, JOB_TYPE_SERVICE, JOB_TYPE_SHELL, SHELL_TYPE_SH, type Position as JobPosition, update_pipe_line } from "@/api/project_cicd";
import DockerNode from "./nodes/DockerNode";
import ShellNode from "./nodes/ShellNode";
import ServiceNode from "./nodes/ServiceNode";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";

const PipeLineEditor = () => {
    const store = useStores();

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

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
                    zIndex: 10,
                });
            }
        }
        setNodes(tmpNodes);
        setEdges(tmpEdges);
    };

    const genJobPositon = (): JobPosition => {
        if (store.pipeLineStore.pipeLine == null) {
            return { x: 0, y: 0 };
        }
        const retPos = { x: store.pipeLineStore.pipeLine.gitsource_job.position.x, y: 0 };
        for (const job of store.pipeLineStore.pipeLine.exec_job_list) {
            if (job.position.x > retPos.x) {
                retPos.x = job.position.x;
            }
        }
        retPos.x += 400;
        return retPos;
    }

    const addDockerJob = async () => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
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
            position: genJobPositon(),
            timeout: 600,
        });
        store.pipeLineStore.hasChange = true;
        store.pipeLineStore.incInitVersion();
    };

    const addShellJob = async () => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
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
            position: genJobPositon(),
            timeout: 600,
        });
        store.pipeLineStore.hasChange = true;
        store.pipeLineStore.incInitVersion();
    };

    const addServiceJob = async () => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
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
            position: genJobPositon(),
            timeout: 600,
        });
        store.pipeLineStore.hasChange = true;
        store.pipeLineStore.incInitVersion();
    };

    const updatePipeLine = async () => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
        const sessionId = await get_session();
        await request(update_pipe_line({
            session_id: sessionId,
            project_id: store.paramStore.projectId,
            pipe_line_id: store.pipeLineStore.pipeLine.pipe_line_id,
            pipe_line_name: store.pipeLineStore.pipeLine.pipe_line_name,
            plat_form: store.pipeLineStore.pipeLine.plat_form,
            gitsource_job: store.pipeLineStore.pipeLine.gitsource_job,
            exec_job_list: store.pipeLineStore.pipeLine.exec_job_list,
        }));
        store.pipeLineStore.hasChange = false;
        store.pipeLineStore.loadPipeLine(store.paramStore.projectId, store.pipeLineStore.pipeLine.pipe_line_id);
        message.info("保存成功");
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
        <div style={{ height: "calc(100vh - 40px)", width: "100vw" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                deleteKeyCode={["Backspace", "Delete"]}
                fitView
                nodeTypes={nodeTypes}
                defaultEdgeOptions={{
                    animated: true, deletable: store.paramStore.canUpdate, markerEnd: {
                        type: MarkerType.Arrow,
                        color: 'black',
                        strokeWidth: 3,
                    },
                    zIndex: 10,
                }}
            >
                <Background color="#ccc" variant={BackgroundVariant.Cross} />
                <Controls />
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
                {store.paramStore.canUpdate && (
                    <Panel position="top-left">
                        <Space style={{ background: "white", padding: "0px 10px" }} size="large">
                            <Button type="text" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                addDockerJob();
                            }} title="增加Docker任务" icon={<PlusOutlined style={{ fontSize: "40px" }} />} />
                            <Button type="text" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                addShellJob();
                            }} title="增加脚本任务" icon={<PlusCircleOutlined style={{ fontSize: "40px" }} />} />
                            <Button type="text" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                addServiceJob();
                            }} title="增加服务任务" icon={<PlusSquareOutlined style={{ fontSize: "40px" }} />} />
                        </Space>
                    </Panel>
                )}
                <Panel position="top-right">
                    <Space style={{ background: "white", padding: "0px 10px" }} size="large">
                        {store.paramStore.canUpdate && (
                            <Button type="text" title="保存" icon={<SaveOutlined style={{ fontSize: "40px" }} />} disabled={!store.pipeLineStore.hasChange}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    updatePipeLine();
                                }} />
                        )}
                    </Space>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default observer(PipeLineEditor);