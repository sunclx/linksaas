import React, { useEffect, useState } from "react";
import type { ServiceInfo, TaskInfo } from "@/api/swarm_proxy";
import { Button, Card, Descriptions, Form, Space } from "antd";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import moment from "moment";

export interface ServiceCardProps {
    service: ServiceInfo;
}

const ServiceCard = (props: ServiceCardProps) => {
    const cloudStore = useStores('cloudStore');

    const [taskList, setTaskList] = useState<TaskInfo[]>([]);

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
                <Descriptions.Item label="任务数量">
                    <Space>
                        {props.service.running_tasks}
                        /
                        {props.service.desired_tasks}
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
                        <Card key={task.task_id} title={
                            <Space style={{ lineHeight: "32px" }}>
                                {task.name}
                                {task.image}
                            </Space>
                        } bordered={false}>
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
                                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={task.status != "running"} onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            // openK8sWin("log", pod.metadata?.name ?? "", container.name);
                                        }}>查看日志</Button>
                                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={task.status != "running"} onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            // openK8sWin("term", pod.metadata?.name ?? "", container.name);
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