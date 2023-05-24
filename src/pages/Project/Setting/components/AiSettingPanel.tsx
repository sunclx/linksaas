import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Form, Input, Space, Tooltip, message } from "antd";
import { useStores } from "@/hooks";
import { set_ai_gateway } from "@/api/project";
import { request } from "@/utils/request";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { PanelProps } from "./common";

const AiSettingPanel: React.FC<PanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [aiGatewayAddr, setAiGatewayAddr] = useState(projectStore.curProject?.ai_gateway_addr ?? "");
    const [aiGatewaySecret, setAiGatewaySecret] = useState("");

    const [hasChange, setHasChange] = useState(false);

    const resetConfig = () => {
        setAiGatewayAddr(projectStore.curProject?.ai_gateway_addr ?? "");
        setAiGatewaySecret("");
        setHasChange(false);
    }

    const updateConfig = async () => {
        await request(set_ai_gateway({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            addr: aiGatewayAddr,
            secret: aiGatewaySecret,
        }));
        message.info("保存成功");
        await projectStore.updateProject(projectStore.curProjectId);
        setHasChange(false);
    };

    useEffect(() => {
        props.onChange(hasChange);
    }, [hasChange]);

    return (
        <Card bordered={false} title={props.title} bodyStyle={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
            extra={
                <Space>
                    <Button disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        resetConfig();
                    }}>取消</Button>
                    <Button type="primary" disabled={!hasChange || aiGatewaySecret.trim() == ""} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateConfig();
                    }}>保存</Button>
                </Space>
            }>
            <Form labelCol={{ span: 4 }}>
                <Form.Item label="AI网关地址" help={
                    <>
                        {!(aiGatewayAddr.startsWith("http://".substring(0, aiGatewayAddr.length)) || aiGatewayAddr.startsWith("https://".substring(0, aiGatewayAddr.length))) && (
                            <span style={{ color: "red" }}>网关地址必须以http://或者https://开始</span>
                        )}
                    </>
                }>
                    <Input value={aiGatewayAddr} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAiGatewayAddr(e.target.value);
                        setHasChange(true);
                    }} />
                </Form.Item>
                <Form.Item label="共享密钥" help={
                    <>
                        {aiGatewaySecret.length == 0 && (
                            <span>为了安全，我们不能从服务端获取密钥！</span>
                        )}
                        {aiGatewaySecret.length >= 1 && aiGatewaySecret.length < 32 && (
                            <span style={{ color: "red" }}>共享密钥必须32位以上长度</span>
                        )}
                    </>
                }>
                    <Input.Password value={aiGatewaySecret}
                        placeholder="请输入共享密钥" onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setAiGatewaySecret(e.target.value);
                            setHasChange(true);
                        }} />
                </Form.Item>
            </Form>
            <div style={{ position: "relative", height: "24px" }}>
                <div style={{ position: "absolute", right: "20px" }}>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAiGatewayAddr("https://aidemo.linksaas.pro");
                        setAiGatewaySecret("use_linksaas_ai_gateway_for_great_develop_teams");
                        setHasChange(true);
                    }}>使用测试网关</a>
                    <Tooltip title={
                        <div style={{ padding: "10px 10px" }}>
                            我们开源了AI网关，大家可以参考
                            <a href="https://github.com/linksaas/ai-gateway" target="_blank" rel="noreferrer">https://github.com/linksaas/ai-gateway</a>进行私有部署。
                        </div>
                    }>
                        <QuestionCircleOutlined style={{ marginLeft: "10px" }} />
                    </Tooltip>
                </div>
            </div>
        </Card>
    );
};

export default observer(AiSettingPanel);