import React from "react";
import { observer } from 'mobx-react';
import { Handle, Position } from 'reactflow';
import { Card, Form, Input, InputNumber, Select } from "antd";
import { useStores } from "../stores";
import { CREDENTIAL_TYPE_KEY } from "@/api/project_cicd";

const GitSourceNode = () => {
    const store = useStores();

    return (
        <Card title="Git Clone" style={{ width: "320px" }}>
            <Handle type="source" position={Position.Right} />
            {store.pipeLineStore.pipeLine != null && (
                <Form labelCol={{ span: 6 }}>
                    <Form.Item label="Git地址">
                        <Input value={store.pipeLineStore.pipeLine.gitsource_job.git_url} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (store.pipeLineStore.pipeLine != null) {
                                store.pipeLineStore.pipeLine.gitsource_job.git_url = e.target.value.trim();
                                store.pipeLineStore.hasChange = true;
                            }
                        }} disabled={!store.paramStore.canUpdate} />
                    </Form.Item>
                    <Form.Item label="登录凭证">
                        <Select value={store.pipeLineStore.pipeLine.gitsource_job.credential_id} onChange={value => {
                            if (store.pipeLineStore.pipeLine != null) {
                                store.pipeLineStore.pipeLine.gitsource_job.credential_id = value;
                                store.pipeLineStore.hasChange = true;
                            }
                        }} disabled={!store.paramStore.canUpdate} className="nodrag nopan">
                            <Select.Option value="">无需验证</Select.Option>
                            {store.pipeLineStore.credList.map(item => (
                                <Select.Option key={item.credential_id} value={item.credential_id}>{item.credential_type == CREDENTIAL_TYPE_KEY ? "SSH密钥" : "密码"}&nbsp;{item.credential_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="运行超时" help="0表示不限制运行时间">
                        <InputNumber controls={false} value={store.pipeLineStore.pipeLine.gitsource_job.timeout} min={0} max={3600} addonAfter="秒" precision={0} onChange={value => {
                            if (value != null && store.pipeLineStore.pipeLine != null) {
                                store.pipeLineStore.pipeLine.gitsource_job.timeout = value;
                                store.pipeLineStore.hasChange = true;
                            }
                        }} disabled={!store.paramStore.canUpdate} />
                    </Form.Item>
                </Form>
            )}
        </Card>
    );
};

export default observer(GitSourceNode);