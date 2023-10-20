import React, { useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { useStores } from "../stores";
import { Button, Card, Descriptions, Form, Input, InputNumber, Modal, Popover, Select, Space } from "antd";
import { EditText } from "@/components/EditCell/EditText";
import { DeleteOutlined, MoreOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Handle, Position } from 'reactflow';
import RunOnParam from "./RunOnParam";
import EnvList from "./EnvList";
import { SHELL_TYPE_CMD, SHELL_TYPE_POWER_SHELL, SHELL_TYPE_SH } from "@/api/project_cicd";
import { sourceHandleStyle, targetHandleStyle } from "./style";

const ShellNode = (props: NodeProps) => {
    const store = useStores();

    const [showScriptModal, setShowScriptModal] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [tmpScriptContent, setTmpScriptContent] = useState("");

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
            <Space>
                <Button type="text" icon={<QuestionCircleOutlined />} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowHelp(true);
                }} />
                {store.paramStore.canUpdate && (
                    <Popover trigger={["hover", "click"]} placement="bottom" mouseEnterDelay={1.5}
                        content={
                            <div>
                                <Button type="link" danger icon={<DeleteOutlined />} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    store.pipeLineStore.removeExecJob(props.id);
                                    store.pipeLineStore.hasChange = true;
                                    store.pipeLineStore.incInitVersion();
                                }} >删除</Button>
                            </div>
                        }>
                        <MoreOutlined />
                    </Popover>
                )}
            </Space>
        }>
            <Handle type="target" position={Position.Left} isConnectableStart={false} style={targetHandleStyle} />
            <Handle type="source" position={Position.Right} isConnectableEnd={false} style={sourceHandleStyle} />
            <Form>
                <Form.Item label="脚本类型">
                    <Select value={store.pipeLineStore.getExecJob(props.id)?.job.ShellJob?.shell_type ?? SHELL_TYPE_SH}
                        onChange={value => {
                            if (store.pipeLineStore.pipeLine != null) {
                                const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                                for (const tmpJob of tmpJobList) {
                                    if (tmpJob.job_id == props.id) {
                                        tmpJob.job.ShellJob!.shell_type = value;
                                    }
                                }
                                store.pipeLineStore.pipeLine = {
                                    ...(store.pipeLineStore.pipeLine),
                                    exec_job_list: tmpJobList,
                                };
                                store.pipeLineStore.hasChange = true;
                            }
                        }}
                        disabled={!store.paramStore.canUpdate} className="nodrag nopan">
                        <Select.Option value={SHELL_TYPE_SH}>/bin/sh</Select.Option>
                        <Select.Option value={SHELL_TYPE_CMD}>WINDOWS CMD</Select.Option>
                        <Select.Option value={SHELL_TYPE_POWER_SHELL}>WINDOWS POWER SHELL</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="运行脚本">
                    <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} value={store.pipeLineStore.getExecJob(props.id)?.job.ShellJob?.script_content ?? ""} readOnly />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setTmpScriptContent(store.pipeLineStore.getExecJob(props.id)?.job.ShellJob?.script_content ?? "");
                            setShowScriptModal(true);
                        }}>{store.paramStore.canUpdate ? "修改" : "查看"}脚本</Button>
                    </div>
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
                <Modal open={true} title={`${store.paramStore.canUpdate ? "修改" : "查看"}脚本`}
                    footer={store.paramStore.canUpdate ? undefined : null}
                    okText="保存" okButtonProps={{ disabled: (store.pipeLineStore.getExecJob(props.id)?.job.ShellJob?.script_content ?? "") == tmpScriptContent }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowScriptModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.job.ShellJob!.script_content = tmpScriptContent;
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                        setShowScriptModal(false);
                    }}>
                    <Input.TextArea autoSize={{ minRows: 10, maxRows: 10 }} value={tmpScriptContent} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTmpScriptContent(e.target.value);
                    }} disabled={!store.paramStore.canUpdate} />
                </Modal>
            )}
            {showHelp == true && (
                <Modal open title="脚本任务说明" footer={null}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowHelp(false);
                    }}>
                    <p>脚本任务之间在系统上执行脚本。</p>
                    <h2>脚本引擎</h2>
                    <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                        <li>/bin/sh</li>
                        <li>cmd.exe</li>
                        <li>powershell.exe</li>
                    </ul>
                    <h2>环境变量</h2>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="参数变量">
                            {`PARAM_{参数名}={参数值}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="源代码路径">
                            JOB_SOURCE_PATH
                        </Descriptions.Item>
                        <Descriptions.Item label="共享数据路径">
                            JOB_SHARE_PATH
                        </Descriptions.Item>
                        <Descriptions.Item label="结果数据路径">
                            JOB_PERSISTENT_PATH
                        </Descriptions.Item>
                    </Descriptions>
                </Modal>
            )}
        </Card>
    );
};

export default observer(ShellNode);