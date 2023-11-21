import React, { useEffect, useState } from "react";
import { type RESOURCE_TYPE, type ResourceUserPerm, list_resource, RESOURCE_TYPE_POD, update_image } from "@/api/k8s_proxy";
import type { IIoK8sApiCoreV1Container, IIoK8sApiCoreV1PodList, IIoK8sApiCoreV1Pod } from "kubernetes-models/v1";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";
import { Button, Card, Form, Space } from "antd";
import { EditText } from "@/components/EditCell/EditText";
import LogModal from "./LogModal";


export interface ImageAndPodListProps {
    resourceType: RESOURCE_TYPE;
    resourceName: string;
    labelSelector: Record<string, string>;
    containerList: IIoK8sApiCoreV1Container[];
    resourceVersion: string;
    myPerm: ResourceUserPerm;
}

interface ShowLogInfo {
    podName: string;
    containerName: string;
}

const ImageAndPodList = (props: ImageAndPodListProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const cloudStore = useStores('cloudStore');

    const [podList, setPodList] = useState<IIoK8sApiCoreV1Pod[]>([]);
    const [showLogInfo, setShowLogInfo] = useState<ShowLogInfo | null>(null);

    const loadPodList = async () => {
        const servAddr = projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        if (cloudStore.curNameSpace == "") {
            return;
        }
        const tmpList = [];
        for (const [k, v] of Object.entries(props.labelSelector)) {
            tmpList.push(`${k}=${v}`);
        }
        const res = await request(list_resource(servAddr, {
            token: tokenRes.token,
            namespace: cloudStore.curNameSpace,
            resource_type: RESOURCE_TYPE_POD,
            label_selector: tmpList.join(","),
        }));
        const pods = JSON.parse(res.payload) as IIoK8sApiCoreV1PodList;
        setPodList(pods.items);
        console.log(pods.items);
    };


    useEffect(() => {
        loadPodList();
    }, [cloudStore.curNameSpace, props.resourceType, props.resourceName, props.labelSelector, props.resourceVersion]);

    return (
        <div>
            {props.containerList.map(container => (
                <Card key={container.name} title={
                    <Space style={{ lineHeight: "32px" }}>
                        {container.name}
                        <div style={{ width: "360px" }}>
                            <EditText editable={props.myPerm.update_image} content={container.image ?? ""} showEditIcon
                                onChange={async value => {
                                    if (value.trim() == "") {
                                        return false;
                                    }
                                    try {
                                        const servAddr = projectStore.curProject?.setting.k8s_proxy_addr ?? "";
                                        const tokenRes = await request(gen_one_time_token({
                                            session_id: userStore.sessionId,
                                            project_id: projectStore.curProjectId,
                                        }));

                                        await request(update_image(servAddr, {
                                            token: tokenRes.token,
                                            namespace: cloudStore.curNameSpace,
                                            resource_type: props.resourceType,
                                            resource_name: props.resourceName,
                                            container_name: container.name,
                                            image: value,
                                        }));
                                        setTimeout(() => {
                                            cloudStore.loadResource(props.resourceType, props.resourceName);
                                        }, 500);

                                        return true;
                                    } catch (e) {
                                        console.log(e);
                                        return false;
                                    }
                                }} />
                        </div>
                    </Space>
                } bordered={false}>
                    {podList.filter(pod => pod.spec?.containers[0].name == container.name).map(pod => (
                        <Form key={pod.metadata?.name ?? ""} labelCol={{ span: 5 }}>
                            <Form.Item label="Pod名称" >
                                {pod.metadata?.name ?? ""}
                            </Form.Item>
                            <Form.Item label="阶段">
                                {pod.status?.phase ?? ""}
                            </Form.Item>
                            <Form.Item label="Pod Ip">
                                {pod.status?.podIP ?? ""}
                            </Form.Item>
                            <Form.Item label="Host Ip">
                                {pod.status?.hostIP ?? ""}
                            </Form.Item>
                            <Form.Item label="操作">
                                <Space>
                                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!props.myPerm.logs || (pod.status?.phase ?? "") != "Running"} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowLogInfo({
                                            podName: pod.metadata?.name ?? "",
                                            containerName: container.name,
                                        });
                                    }}>查看日志</Button>
                                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!props.myPerm.exec || (pod.status?.phase ?? "") != "Running"} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        //TODO
                                    }}>打开终端</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    ))}
                </Card>
            ))}

            {showLogInfo !== null && (
                <LogModal nameSpace={cloudStore.curNameSpace} resourceType={props.resourceType} resourceName={props.resourceName}
                    podName={showLogInfo.podName} containerName={showLogInfo.containerName}
                    onCancel={() => setShowLogInfo(null)} />
            )}
        </div>
    );
};

export default observer(ImageAndPodList);