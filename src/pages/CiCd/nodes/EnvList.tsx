import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "../stores";
import { Button, Card, Form, Input, List, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";

export interface EnvListProps {
    jobId: string;
}

const EnvList = (props: EnvListProps) => {
    const store = useStores();

    return (
        <Form>
            <Form.Item label="环境变量">
                <Card bordered={false} extra={
                    <Button type="text" icon={<PlusOutlined />} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (store.pipeLineStore.pipeLine !== null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.jobId) {
                                    const tmpEnvList = tmpJob.env_list.slice();
                                    tmpEnvList.push({
                                        env_id: uniqId(),
                                        name: "",
                                        value: "",
                                    });
                                    tmpJob.env_list = tmpEnvList;
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                }>
                    <List rowKey="env_id" dataSource={store.pipeLineStore.getExecJob(props.jobId)?.env_list ?? []}
                        renderItem={item => (
                            <List.Item extra={
                                <Button type="text" danger icon={<DeleteOutlined />}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (store.pipeLineStore.pipeLine !== null) {
                                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                                            for (const tmpJob of tmpJobList) {
                                                if (tmpJob.job_id == props.jobId) {
                                                    tmpJob.env_list = tmpJob.env_list.filter(tmpItem => tmpItem.env_id != item.env_id);
                                                }
                                            }
                                            store.pipeLineStore.pipeLine = {
                                                ...(store.pipeLineStore.pipeLine),
                                                exec_job_list: tmpJobList,
                                            };
                                            store.pipeLineStore.hasChange = true;
                                        }
                                    }} />
                            }>
                                <Space size="small">
                                    <Input style={{ width: "50px" }} value={item.name} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (store.pipeLineStore.pipeLine !== null) {
                                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                                            for (const tmpJob of tmpJobList) {
                                                if (tmpJob.job_id == props.jobId) {
                                                    const tmpEnvList = tmpJob.env_list.slice();
                                                    const index = tmpEnvList.findIndex(tmpItem => tmpItem.env_id == item.env_id);
                                                    if (index != -1) {
                                                        tmpEnvList[index].name = e.target.value.trim();
                                                        tmpJob.env_list = tmpEnvList;
                                                    }
                                                }
                                            }
                                            store.pipeLineStore.pipeLine = {
                                                ...(store.pipeLineStore.pipeLine),
                                                exec_job_list: tmpJobList,
                                            };
                                            store.pipeLineStore.hasChange = true;
                                        }
                                    }} />
                                    =
                                    <Input style={{ width: "100px" }} value={item.value} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (store.pipeLineStore.pipeLine !== null) {
                                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                                            for (const tmpJob of tmpJobList) {
                                                if (tmpJob.job_id == props.jobId) {
                                                    const tmpEnvList = tmpJob.env_list.slice();
                                                    const index = tmpEnvList.findIndex(tmpItem => tmpItem.env_id == item.env_id);
                                                    if (index != -1) {
                                                        tmpEnvList[index].value = e.target.value.trim();
                                                        tmpJob.env_list = tmpEnvList;
                                                    }
                                                }
                                            }
                                            store.pipeLineStore.pipeLine = {
                                                ...(store.pipeLineStore.pipeLine),
                                                exec_job_list: tmpJobList,
                                            };
                                            store.pipeLineStore.hasChange = true;
                                        }
                                    }} />
                                </Space>
                            </List.Item>
                        )} />
                </Card>
            </Form.Item>
        </Form>
    );
};

export default observer(EnvList);