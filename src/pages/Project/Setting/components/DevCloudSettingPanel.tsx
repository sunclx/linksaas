import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Form, Input, Space, message } from "antd";
import type { PanelProps } from "./common";
import { useStores } from "@/hooks";
import { update_setting } from "@/api/project";
import { request } from "@/utils/request";

const DevCloudSettingPanel = (props: PanelProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [k8sProxyAddr, setK8sProxyAddr] = useState(projectStore.curProject?.setting.k8s_proxy_addr ?? "");
    const [hasChange, setHasChange] = useState(false);

    const resetConfig = () => {
        setK8sProxyAddr(projectStore.curProject?.setting.k8s_proxy_addr ?? "");
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
            },
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
                    <Button type="primary" disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateConfig();
                    }}>保存</Button>
                </Space>
            }>
            <Form labelCol={{ span: 4 }}>
                <Form.Item label="k8s代理地址">
                    <Input value={k8sProxyAddr} onChange={e=>{
                        e.stopPropagation();
                        e.preventDefault();
                        setHasChange(true);
                        setK8sProxyAddr(e.target.value.trim());
                    }}/>
                </Form.Item>
                <Form.Item>
                    <p>需要安装配置k8s代理服务。代理服务程序我们开放了代码,你可以查看<a target="_blank" rel="noreferrer" href="https://jihulab.com/linksaas/k8s_api_proxy">相关代码</a>。</p>
                    <Card bordered={false} title="下载k8s代理程序" headStyle={{ padding: "0px 0px", fontSize: "16px", fontWeight: 600 }}>
                        TODO
                    </Card>
                    <Card bordered={false} title="配置k8s代理" headStyle={{ padding: "0px 0px", fontSize: "16px", fontWeight: 600 }}>
                        TODO
                    </Card>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default observer(DevCloudSettingPanel);