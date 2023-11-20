import React, { useEffect, useState } from "react";
import type { IIoK8sApiAppsV1Deployment } from "kubernetes-models/apps/v1";
import { RESOURCE_TYPE_DEPLOYMENT } from "@/api/k8s_proxy";
import { Button, Card, Descriptions, Popover, Space, } from "antd";
import ResourcePermModal from "./ResourcePermModal";
import { useStores } from "@/hooks";
import { MoreOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import ImageAndPodList from "./ImageAndPodList";
import { type ResourceUserPerm } from "@/api/k8s_proxy";

export interface DeploymentCardProps {
    deployment: IIoK8sApiAppsV1Deployment;
}

const DeploymentCard = (props: DeploymentCardProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const cloudStore = useStores('cloudStore');

    const [myPerm, setMyPerm] = useState<ResourceUserPerm>({
        user_id: userStore.userInfo.userId,
        update_scale: false,
        update_image: false,
        logs: false,
        exec: false,
    });

    const [showPermModal, setShowPermModal] = useState(false);

    useEffect(() => {
        if (projectStore.isAdmin) {
            setMyPerm({
                user_id: userStore.userInfo.userId,
                update_scale: true,
                update_image: true,
                logs: true,
                exec: true,
            });
            return;
        }
        const index = cloudStore.deploymentPermList.findIndex(item => item.name == props.deployment.metadata?.name ?? "");
        if (index == -1) {
            setMyPerm({
                user_id: userStore.userInfo.userId,
                update_scale: false,
                update_image: false,
                logs: false,
                exec: false,
            });
        } else {
            const userIndex = cloudStore.deploymentPermList[index].user_perm_list.findIndex(item => item.user_id == userStore.userInfo.userId);
            if (userIndex == -1) {
                setMyPerm({
                    user_id: userStore.userInfo.userId,
                    update_scale: false,
                    update_image: false,
                    logs: false,
                    exec: false,
                });
            } else {
                setMyPerm(cloudStore.deploymentPermList[index].user_perm_list[userIndex]);
            }
        }
    }, [projectStore.isAdmin, cloudStore.deploymentPermList]);

    return (
        <Card title={`Deployment ${props.deployment.metadata?.name ?? ""}`}
            style={{ width: "100%", marginBottom: "10px" }}
            bodyStyle={{ padding: "0px 0px" }}
            bordered={false} extra={
                <Popover trigger="click" placement="bottom" content={
                    <Space direction="vertical" style={{ padding: "10px 10px" }}>
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowPermModal(true);
                        }}>{projectStore.isAdmin ? "修改权限" : "查看权限"}</Button>
                    </Space>
                }>
                    <MoreOutlined />
                </Popover>

            }>
            <Descriptions column={1} bordered={true} labelStyle={{ width: "100px" }}>
                <Descriptions.Item label="Pod数量">{props.deployment.status?.replicas ?? 0}/{props.deployment.spec?.replicas ?? 0}</Descriptions.Item>
                {(props.deployment.metadata?.creationTimestamp ?? "") != "" && (
                    <Descriptions.Item label="创建时间">{props.deployment.metadata?.creationTimestamp}</Descriptions.Item>
                )}
                <Descriptions.Item label="镜像列表" contentStyle={{ padding: "0px 10px" }} style={{ verticalAlign: "middle" }}>
                    <ImageAndPodList resourceType={RESOURCE_TYPE_DEPLOYMENT} resourceName={props.deployment.metadata?.name ?? ""}
                        containerList={props.deployment.spec?.template.spec?.containers ?? []}
                        labelSelector={props.deployment.spec?.selector.matchLabels ?? {}}
                        myPerm={myPerm} />
                </Descriptions.Item>
            </Descriptions>
            {showPermModal == true && (
                <ResourcePermModal
                    perm={cloudStore.deploymentPermList.find(item => item.name == props.deployment.metadata?.name) ?? { name: props.deployment.metadata?.name ?? "", resource_type: RESOURCE_TYPE_DEPLOYMENT, user_perm_list: [] }}
                    onCancel={() => setShowPermModal(false)} onOk={() => {
                        setShowPermModal(false);
                        cloudStore.loadDeploymentPermList();
                    }} />
            )}
        </Card>
    );
};

export default observer(DeploymentCard);