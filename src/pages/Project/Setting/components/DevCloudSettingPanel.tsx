import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Form, Input, Popover, Space, message } from "antd";
import type { PanelProps } from "./common";
import { useStores } from "@/hooks";
import { update_setting } from "@/api/project";
import { request } from "@/utils/request";
import { QuestionCircleOutlined } from "@ant-design/icons";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { get_conn_server_addr } from "@/api/main";
import { writeText } from '@tauri-apps/api/clipboard';

const TRACE_CONFIG_TPL = `listenAddr: "0.0.0.0:6003"
linkSaasAddr: "__API_ADDR__"
maxTraceStore: 10000
project:
  - "__PROJECT_ID__"
zipkin:
  enable: true
  listenAddr: "0.0.0.0:9411"
jaeger:
  enable: true
  grpcListenAddr: "0.0.0.0:14250"
  httpListenAddr: "0.0.0.0:14268"
  thriftCompactListenAddr: "0.0.0.0:6831"
  thriftBinaryListenAddr: "0.0.0.0:6832"
skywalking:
  enable: true
  grpcListenAddr: "0.0.0.0:11800"
  httpListenAddr: "0.0.0.0:12800"
otlp:
  enable: true
  grpcListenAddr: "0.0.0.0:4317"
  httpListenAddr: "0.0.0.0:4318"
`;

const DevCloudSettingPanel = (props: PanelProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [k8sProxyAddr, setK8sProxyAddr] = useState(projectStore.curProject?.setting.k8s_proxy_addr ?? "");
    const [swarmProxyAddr, setSwarmProxyAddr] = useState(projectStore.curProject?.setting.swarm_proxy_addr ?? "");
    const [traceProxyAddr, setTraceProxyAddr] = useState(projectStore.curProject?.setting.trace_proxy_addr ?? "");
    const [hasChange, setHasChange] = useState(false);
    const [apiAddr, setApiAddr] = useState("");

    const resetConfig = () => {
        setK8sProxyAddr(projectStore.curProject?.setting.k8s_proxy_addr ?? "");
        setSwarmProxyAddr(projectStore.curProject?.setting.swarm_proxy_addr ?? "");
        setTraceProxyAddr(projectStore.curProject?.setting.trace_proxy_addr ?? "");
        setHasChange(false);
    }

    const updateConfig = async () => {
        if (projectStore.curProject == undefined) {
            return;
        }
        await request(update_setting({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            setting: {
                ...projectStore.curProject.setting,
                k8s_proxy_addr: k8sProxyAddr,
                swarm_proxy_addr: swarmProxyAddr,
                trace_proxy_addr: traceProxyAddr,
            },
        }));
        message.info("保存成功");
        await projectStore.updateProject(projectStore.curProjectId);
        setHasChange(false);
    };

    useEffect(() => {
        props.onChange(hasChange);
    }, [hasChange]);

    useEffect(() => {
        get_conn_server_addr().then(value => {
            if (value.includes(":")) {
                setApiAddr(value);
            } else {
                setApiAddr(value + ":5000")
            }
        });
    }, []);

    return (
        <Card bordered={false} title={props.title} bodyStyle={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
            extra={
                <Space>
                    <Button disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        resetConfig();
                    }}>取消</Button>
                    <Button type="primary" disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateConfig();
                    }}>保存</Button>
                </Space>
            }>
            <Form labelCol={{ span: 5 }} >
                <Form.Item label="k8s代理地址">
                    <Space>
                        <Input value={k8sProxyAddr} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setHasChange(true);
                            setK8sProxyAddr(e.target.value.trim());
                        }} style={{ width: "200px" }} />
                        <Popover trigger="hover" placement="right" content={
                            <div style={{ width: "300px", padding: "10px 10px" }}>
                                <p>
                                    你需要运行k8s API代理，你可以从<a rel="noreferrer" target="_blank" href="https://jihulab.com/linksaas/k8s_api_proxy">这里</a>获取源代码。
                                </p>
                                <Card title="相关配置" bordered={false} style={{ width: "100%" }} extra={
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        writeText(`kubeConfigFile: your_k8s_config.yaml\nlistenAddr: 0.0.0.0:6001\nlinkSaasAddr: ${apiAddr}`);
                                        message.info("复制成功");
                                    }}>复制</Button>
                                }>
                                    <CodeEditor
                                        value={`kubeConfigFile: your_k8s_config.yaml\nlistenAddr: 0.0.0.0:6001\nlinkSaasAddr: ${apiAddr}`}
                                        language="yaml"
                                        readOnly
                                        style={{
                                            fontSize: 14,
                                            backgroundColor: '#f5f5f5',
                                            height: 100,
                                            overflowY: "scroll",
                                        }}
                                    />
                                </Card>
                            </div>
                        }>
                            <QuestionCircleOutlined />
                        </Popover>
                    </Space>

                </Form.Item>
                <Form.Item label="swarm代理地址">
                    <Space>
                        <Input value={swarmProxyAddr} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setHasChange(true);
                            setSwarmProxyAddr(e.target.value.trim());
                        }} style={{ width: "200px" }} />
                        <Popover trigger="hover" placement="right" content={
                            <div style={{ width: "300px", padding: "10px 10px" }}>
                                <p>
                                    你需要运行swarm API代理，你可以从<a rel="noreferrer" target="_blank" href="https://jihulab.com/linksaas/swarm_api_proxy">这里</a>获取源代码。
                                </p>
                                <Card title="相关配置" bordered={false} style={{ width: "100%" }} extra={
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        writeText(`serverUrl: "tcp://your_docker_addr"\ncertPath: ""\nlistenAddr: "0.0.0.0:6002"\nlinkSaasAddr: ${apiAddr}`);
                                        message.info("复制成功");
                                    }}>复制</Button>
                                }>

                                    <CodeEditor
                                        value={`serverUrl: "tcp://your_docker_addr"\ncertPath: ""\nlistenAddr: "0.0.0.0:6002"\nlinkSaasAddr: ${apiAddr}`}
                                        language="yaml"
                                        readOnly
                                        style={{
                                            fontSize: 14,
                                            backgroundColor: '#f5f5f5',
                                            height: 100,
                                            overflowY: "scroll",
                                        }}
                                    />
                                </Card>
                                <Card title="增加项目访问权限" bordered={false} style={{ width: "100%" }} extra={
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        writeText(`./swarm_api_proxy --config ./proxy.yaml project add ${projectStore.curProjectId}`);
                                        message.info("复制成功");
                                    }}>复制</Button>
                                }>
                                    <p>你需要运行如下命令:</p>
                                    <CodeEditor
                                        value={`./swarm_api_proxy --config ./proxy.yaml project add ${projectStore.curProjectId}`}
                                        language="bash"
                                        readOnly
                                        style={{
                                            fontSize: 14,
                                            backgroundColor: '#f5f5f5',
                                            height: 100,
                                            overflowY: "scroll",
                                        }}
                                    />
                                </Card>
                            </div>
                        }>
                            <QuestionCircleOutlined />
                        </Popover>
                    </Space>
                </Form.Item>
                <Form.Item label="链路追踪地址">
                    <Space>
                        <Input value={traceProxyAddr} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setHasChange(true);
                            setTraceProxyAddr(e.target.value.trim());
                        }} style={{ width: "200px" }} />
                        <Popover trigger="hover" placement="right" content={
                            <div style={{ width: "300px", padding: "10px 10px" }}>
                                <p>
                                    你需要运行追踪收集程序，你可以从<a rel="noreferrer" target="_blank" href="https://jihulab.com/linksaas/easy_proxy">这里</a>获取源代码。
                                </p>
                                <Card title="相关配置" bordered={false} style={{ width: "100%" }} extra={
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        writeText(TRACE_CONFIG_TPL.replace("__API_ADDR__", apiAddr).replace("__PROJECT_ID__", projectStore.curProjectId));
                                        message.info("复制成功");
                                    }}>复制</Button>
                                }>
                                    <CodeEditor
                                        value={TRACE_CONFIG_TPL.replace("__API_ADDR__", apiAddr).replace("__PROJECT_ID__", projectStore.curProjectId)}
                                        language="yaml"
                                        readOnly
                                        style={{
                                            fontSize: 14,
                                            backgroundColor: '#f5f5f5',
                                            height: 200,
                                            overflowY: "scroll",
                                        }}
                                    />
                                </Card>
                            </div>
                        }>
                            <QuestionCircleOutlined />
                        </Popover>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default observer(DevCloudSettingPanel);