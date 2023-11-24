import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import { Button, Card, Modal, Popover, Segmented, Select, Space, message } from "antd";
import { useStores } from "@/hooks";
import { MoreOutlined } from "@ant-design/icons";
import { writeText } from "@tauri-apps/api/clipboard";
import CodeEditor from '@uiw/react-textarea-code-editor';
import K8sPage from "./k8s/index";
import SwarmPage from "./swarm/index";
import type { SegmentedLabeledOption } from 'rc-segmented';
import NameSpacePermModal from "./swarm/components/NameSpacePermModal";

const CloudIndex = () => {
    const projectStore = useStores('projectStore');
    const cloudStore = useStores('cloudStore');

    const [activeKey, setActiveKey] = useState("");
    const [showAddNameSpaceModal, setShowAddNameSpaceModal] = useState(false);
    const [showSwarmPermModal, setShowSwarmPermModal] = useState(false);

    const calcSegOptionList = (): SegmentedLabeledOption[] => {
        const retList = [];
        if (projectStore.curProject?.setting.k8s_proxy_addr != "") {
            retList.push({
                label: "k8s",
                value: "k8s",
            });
        }
        if (projectStore.curProject?.setting.swarm_proxy_addr != "") {
            retList.push({
                label: "swarm",
                value: "swarm",
            });
        }
        return retList;
    };

    useEffect(() => {
        if (projectStore.curProject?.setting.k8s_proxy_addr != "") {
            setActiveKey("k8s");
        } else if (projectStore.curProject?.setting.swarm_proxy_addr != "") {
            setActiveKey("swarm");
        }
    }, []);

    useEffect(() => {
        if (activeKey == "k8s") {
            cloudStore.loadK8sNameSpaceList();
        } else if (activeKey == "swarm") {
            cloudStore.loadSwarmNameSpaceList();
        }
    }, [activeKey]);

    return (
        <CardWrap title="私有云" halfContent extra={
            <Space size="middle">
                <Segmented options={calcSegOptionList()} value={activeKey} onChange={value => setActiveKey(value.valueOf() as string)} />
                <span>命名空间</span>
                <Select value={cloudStore.curNameSpace} onChange={value => {
                    cloudStore.curNameSpace = value;
                }} style={{ width: "100px" }}>
                    {cloudStore.nameSpaceList.map(item => (
                        <Select.Option key={item} value={item}>{item}</Select.Option>
                    ))}
                </Select>
                {activeKey == "k8s" && (
                    <Popover trigger="click" placement="bottom" content={
                        <div style={{ padding: "10px 10px" }}>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowAddNameSpaceModal(true);
                            }}>添加命名空间</Button>
                        </div>
                    }>
                        <MoreOutlined />
                    </Popover>
                )}
                {activeKey == "swarm" && (
                    <Popover trigger="click" placement="bottom" content={
                        <Space direction="vertical" style={{ padding: "10px 10px" }}>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                cloudStore.loadSwarmService().then(() => cloudStore.loadSwarmTask());
                            }}>刷新</Button>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowSwarmPermModal(true);
                            }}>{`${projectStore.isAdmin ? "修改" : "查看"}权限`}</Button>
                        </Space>
                    }>
                        <MoreOutlined />
                    </Popover>
                )}
            </Space>
        }>
            {activeKey == "k8s" && <K8sPage />}
            {activeKey == "swarm" && <SwarmPage />}
            {showAddNameSpaceModal == true && (
                <Modal open title="添加命令空间" footer={null}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddNameSpaceModal(false);
                    }}>
                    <Card bordered={false} title="在k8s集群上运行如下命令" extra={
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            writeText(`kubectl label ns <NAME_SPACE> linksaas.pro/project=${projectStore.curProjectId}`);
                            message.info("复制成功");
                        }}>复制</Button>
                    }>
                        <CodeEditor lang="bash" value={`kubectl label ns <NAME_SPACE> linksaas.pro/project=${projectStore.curProjectId}`} />
                    </Card>
                </Modal>
            )}
            {showSwarmPermModal == true && (
                <NameSpacePermModal onClose={() => setShowSwarmPermModal(false)} />
            )}
        </CardWrap>
    );
};

export default observer(CloudIndex);