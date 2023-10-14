import React, { useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { Button, Card, Form, Input, InputNumber, Modal } from "antd";
import { Handle, Position } from 'reactflow';
import { EditText } from "@/components/EditCell/EditText";
import { useStores } from "../stores";
import { DeleteOutlined } from "@ant-design/icons";
import RunOnParam from "./RunOnParam";
import EnvList from "./EnvList";


const DockerNode = (props: NodeProps) => {
    const store = useStores();

    const [showScriptModal, setShowScriptModal] = useState(false);

    return (
        <Card style={{ width: "320px" }} title={
            <EditText editable={store.paramStore.canUpdate} content={store.pipeLineStore.getExecJob(props.id)?.job_name ?? ""}
                onChange={async value => {
                    if (value.trim() == "") {
                        return false;
                    }
                    if (store.pipeLineStore.pipeLine != null) {
                        const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                        for (const tmpJob of tmpJobList) {
                            if (tmpJob.job_id == props.id) {
                                tmpJob.job_name = value.trim();
                            }
                        }
                        store.pipeLineStore.pipeLine = {
                            ...(store.pipeLineStore.pipeLine),
                            exec_job_list: tmpJobList,
                        };
                        store.pipeLineStore.hasChange = true;
                    }
                    return true;
                }} showEditIcon={true} />
        } extra={
            <>
                {store.paramStore.canUpdate && (
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        store.pipeLineStore.removeExecJob(props.id);
                        store.pipeLineStore.hasChange = true;
                        store.pipeLineStore.incInitVersion();
                    }} />
                )}
            </>
        }>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <Form>
                <Form.Item label="镜像地址">
                    <Input value={store.pipeLineStore.getExecJob(props.id)?.job.DockerJob?.image_url ?? ""} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.job.DockerJob!.image_url = e.target.value.trim();
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                </Form.Item>
                <Form.Item label="入口脚本">
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowScriptModal(true);
                    }}>{store.paramStore.canUpdate ? "修改" : "查看"}脚本</Button>
                </Form.Item>
                <Form.Item label="代码路径" help="把git代码映射到容器内">
                    <Input value={store.pipeLineStore.getExecJob(props.id)?.job.DockerJob?.src_data_vol ?? ""} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.job.DockerJob!.src_data_vol = e.target.value.trim();
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                </Form.Item>
                <Form.Item label="共享路径" help="把共享数据映射到容器内">
                    <Input value={store.pipeLineStore.getExecJob(props.id)?.job.DockerJob?.shared_data_vol ?? ""} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.job.DockerJob!.shared_data_vol = e.target.value.trim();
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                </Form.Item>
                <Form.Item label="持久存储" help="持久化数据映射到容器内">
                    <Input value={store.pipeLineStore.getExecJob(props.id)?.job.DockerJob?.persistent_data_vol ?? ""} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.job.DockerJob!.persistent_data_vol = e.target.value.trim();
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                </Form.Item>
            </Form>
            <RunOnParam jobId={props.id} />
            <EnvList jobId={props.id} />
            <Form>
                <Form.Item label="运行超时" help="0表示不限制运行时间">
                    <InputNumber controls={false} value={store.pipeLineStore.getExecJob(props.id)?.timeout ?? 300} min={0} max={3600} addonAfter="秒" precision={0} onChange={value => {
                        if (value != null && store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.timeout = value;
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                </Form.Item>
            </Form>
            {showScriptModal == true && (
                <Modal open={true} title={`${store.paramStore.canUpdate ? "修改" : "查看"}脚本`} footer={null}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowScriptModal(false);
                    }}>
                    <Input.TextArea autoSize={{ minRows: 10, maxRows: 10 }} value={store.pipeLineStore.getExecJob(props.id)?.job.DockerJob?.script_content ?? ""} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.job.DockerJob!.script_content = e.target.value;
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                </Modal>
            )}
        </Card>
    );
};

export default observer(DockerNode);