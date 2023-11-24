import React, { useEffect, useState } from "react";
import type { ServiceInfo, TaskInfo } from "@/api/swarm_proxy";
import { Button, Card, Descriptions, Form, Space } from "antd";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import moment from "moment";
import { EditText } from "@/components/EditCell/EditText";
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";
import { update_image, update_scale } from "@/api/swarm_proxy";
import { EditNumber } from "@/components/EditCell/EditNumber";
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";

export interface ServiceCardProps {
    service: ServiceInfo;
}

const ServiceCard = (props: ServiceCardProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const cloudStore = useStores('cloudStore');

    const [taskList, setTaskList] = useState<TaskInfo[]>([]);

    const openSwarmWin = async (winType: string, containerId: string,name: string) => {
        const label = `k8swin:${winType}-${containerId}`;
        const view = WebviewWindow.getByLabel(label);
        if (view != null) {
            await view.close();
        }
        const pos = await appWindow.innerPosition();
        new WebviewWindow(label, {
            url: `swarmwin.html?winType=${winType}&servAddr=${projectStore.curProject?.setting.swarm_proxy_addr ?? ""}&projectId=${projectStore.curProjectId}&nameSpace=${cloudStore.curNameSpace}&containerId=${containerId}`,
            width: 800,
            minWidth: 800,
            height: 600,
            minHeight: 600,
            center: true,
            title: `${winType == "log" ? "日志" : "终端"}(${name})`,
            resizable: true,
            x: pos.x + Math.floor(Math.random() * 200),
            y: pos.y + Math.floor(Math.random() * 200),
        });
    }

    useEffect(() => {
        const tmpList = cloudStore.swarmTaskList.filter(item => item.service_id == props.service.service_id);
        setTaskList(tmpList);
    }, [cloudStore.swarmTaskList, props.service.service_id]);

    return (
        <Card title={`Service ${props.service.name}`}
            style={{ width: "100%", marginBottom: "10px" }}
            bodyStyle={{ padding: "0px 0px" }} bordered={false}
        >
            <Descriptions column={1} bordered={true} labelStyle={{ width: "100px" }}>
                <Descriptions.Item label="镜像地址">
                    <EditText editable={cloudStore.swarmMyPerm.update_image} content={props.service.image}
                        onChange={async value => {
                            if (value.trim() == "") {
                                return false;
                            }
                            try {
                                const servAddr = projectStore.curProject?.setting.swarm_proxy_addr ?? "";
                                const tokenRes = await request(gen_one_time_token({
                                    session_id: userStore.sessionId,
                                    project_id: projectStore.curProjectId,
                                }));
                                await request(update_image(servAddr, {
                                    token: tokenRes.token,
                                    name_space: cloudStore.curNameSpace,
                                    service_id: props.service.service_id,
                                    image: value.trim(),
                                }));
                                await cloudStore.loadSwarmService()
                                await cloudStore.loadSwarmTask();
                                return true;
                            } catch (e) {
                                console.log(e);
                                return false;
                            }
                        }} showEditIcon />
                </Descriptions.Item>
                <Descriptions.Item label="任务数量">
                    <Space>
                        {props.service.running_tasks}
                        /
                        <EditNumber editable={cloudStore.swarmMyPerm.update_scale} value={props.service.desired_tasks} showEditIcon min={1} max={99} fixedLen={0}
                            onChange={async value => {
                                try {
                                    const servAddr = projectStore.curProject?.setting.swarm_proxy_addr ?? "";
                                    const tokenRes = await request(gen_one_time_token({
                                        session_id: userStore.sessionId,
                                        project_id: projectStore.curProjectId,
                                    }));
                                    await request(update_scale(servAddr, {
                                        token: tokenRes.token,
                                        name_space: cloudStore.curNameSpace,
                                        service_id: props.service.service_id,
                                        scale: value,
                                    }));
                                    await cloudStore.loadSwarmService()
                                    await cloudStore.loadSwarmTask();
                                    return true;
                                } catch (e) {
                                    console.log(e);
                                    return false;
                                }
                            }} />
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                    {moment(props.service.create_time).format("YYYY-MM-DD HH:mm:ss")}
                </Descriptions.Item>
                {Math.ceil(props.service.create_time / 1000) != Math.ceil(props.service.update_time / 1000) && (
                    <Descriptions.Item label="更新时间">
                        {moment(props.service.update_time).format("YYYY-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="标签列表" contentStyle={{ padding: "0px 10px" }} style={{ verticalAlign: "middle" }}>
                    {props.service.label_list.map(label => (
                        <div key={label.key}>{label.key}={label.value}</div>
                    ))}
                </Descriptions.Item>
                <Descriptions.Item label="任务列表" contentStyle={{ padding: "0px 10px" }} style={{ verticalAlign: "middle" }}>
                    {taskList.map(task => (
                        <Card key={task.task_id} title={`${props.service.name}.${task.name}`} bordered={false}>
                            <Form labelCol={{ span: 4 }}>
                                <Form.Item label="节点名称">
                                    {task.node_name}
                                </Form.Item>
                                <Form.Item label="创建时间">
                                    {moment(task.create_time).format("YYYY-MM-DD HH:mm:ss")}
                                </Form.Item>
                                <Form.Item label="状态">
                                    {task.status}
                                </Form.Item>
                                <Form.Item label="操作">
                                    <Space>
                                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={task.status != "running" || !cloudStore.swarmMyPerm.logs} onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            openSwarmWin("log", task.container_id, `${props.service.name}.${task.name}`);
                                        }}>查看日志</Button>
                                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={task.status != "running" || !cloudStore.swarmMyPerm.exec} onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            openSwarmWin("term", task.container_id, `${props.service.name}.${task.name}`);
                                        }}>打开终端</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                    ))}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default observer(ServiceCard);