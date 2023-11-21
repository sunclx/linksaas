import React, { useEffect, useState } from "react";
import type { IIoK8sApiAppsV1StatefulSet } from "kubernetes-models/apps/v1";
import { RESOURCE_TYPE_STATEFULSET } from "@/api/k8s_proxy";
import { Button, Card, Descriptions, Popover, Space, } from "antd";
import ResourcePermModal from "./ResourcePermModal";
import { useStores } from "@/hooks";
import { MoreOutlined, ReloadOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import ImageAndPodList from "./ImageAndPodList";
import { type ResourceUserPerm } from "@/api/k8s_proxy";

export interface StatefulsetCardProps {
    statefulset: IIoK8sApiAppsV1StatefulSet;
}

const StatefulsetCard = (props: StatefulsetCardProps) => {
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
        const index = cloudStore.statefulsetPermList.findIndex(item => item.name == props.statefulset.metadata?.name ?? "");
        if (index == -1) {
            setMyPerm({
                user_id: userStore.userInfo.userId,
                update_scale: false,
                update_image: false,
                logs: false,
                exec: false,
            });
        } else {
            const userIndex = cloudStore.statefulsetPermList[index].user_perm_list.findIndex(item => item.user_id == userStore.userInfo.userId);
            if (userIndex == -1) {
                setMyPerm({
                    user_id: userStore.userInfo.userId,
                    update_scale: false,
                    update_image: false,
                    logs: false,
                    exec: false,
                });
            } else {
                setMyPerm(cloudStore.statefulsetPermList[index].user_perm_list[userIndex]);
            }
        }
    }, [projectStore.isAdmin, cloudStore.statefulsetPermList]);

    return (
        <Card title={`Statefulset ${props.statefulset.metadata?.name ?? ""}`}
            style={{ width: "100%", marginBottom: "10px" }}
            bodyStyle={{ padding: "0px 0px" }}
            bordered={false} extra={
                <Space>
                    <Button type="text" icon={<ReloadOutlined />} title="刷新" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        cloudStore.loadResource(RESOURCE_TYPE_STATEFULSET, props.statefulset.metadata?.name ?? "");
                    }} />
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
                </Space>
            }>
            <Descriptions column={1} bordered={true} labelStyle={{ width: "100px" }}>
                <Descriptions.Item label="Pod数量">{props.statefulset.status?.replicas ?? 0}/{props.statefulset.spec?.replicas ?? 0}</Descriptions.Item>
                {(props.statefulset.metadata?.creationTimestamp ?? "") != "" && (
                    <Descriptions.Item label="创建时间">{props.statefulset.metadata?.creationTimestamp}</Descriptions.Item>
                )}
                <Descriptions.Item label="镜像列表" contentStyle={{ padding: "0px 10px" }} style={{ verticalAlign: "middle" }}>
                    <ImageAndPodList resourceType={RESOURCE_TYPE_STATEFULSET} resourceName={props.statefulset.metadata?.name ?? ""}
                        containerList={props.statefulset.spec?.template.spec?.containers ?? []}
                        labelSelector={props.statefulset.spec?.selector.matchLabels ?? {}}
                        myPerm={myPerm} resourceVersion={props.statefulset.metadata?.resourceVersion ?? ""} />
                </Descriptions.Item>
            </Descriptions>
            {showPermModal == true && (
                <ResourcePermModal
                    perm={cloudStore.statefulsetPermList.find(item => item.name == props.statefulset.metadata?.name) ?? { name: props.statefulset.metadata?.name ?? "", resource_type: RESOURCE_TYPE_STATEFULSET, user_perm_list: [] }}
                    onCancel={() => setShowPermModal(false)} onOk={() => {
                        setShowPermModal(false);
                        cloudStore.loadStatefulsetPermList();
                    }} />
            )}
        </Card>
    );
}

export default observer(StatefulsetCard);