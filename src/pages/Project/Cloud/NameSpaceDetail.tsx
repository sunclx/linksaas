import React, { useEffect, useState } from "react";
import CardWrap from "@/components/CardWrap";
import { Button, Card, Modal, Popover, Select, Space, message } from "antd";
import { useStores } from "@/hooks";
import { observer } from 'mobx-react';
import { MoreOutlined } from "@ant-design/icons";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { writeText } from '@tauri-apps/api/clipboard';
import DeploymentListPanel from "./DeploymentListPanel";
import StatefulsetListPanel from "./StatefulsetListPanel";

const NameSpaceDetail = () => {
    const projectStore = useStores('projectStore');
    const cloudStore = useStores('cloudStore');

    const [showAddNameSpaceModal, setShowAddNameSpaceModal] = useState(false);



    useEffect(() => {
        cloudStore.loadNameSpaceList();
    }, []);

    return (
        <CardWrap title="私有云" halfContent extra={
            <Space size="middle">
                <span>命名空间</span>
                <Select value={cloudStore.curNameSpace} onChange={value => {
                    cloudStore.curNameSpace = value;
                }} style={{ width: "100px" }}>
                    {cloudStore.nameSpaceList.map(item => (
                        <Select.Option key={item} value={item}>{item}</Select.Option>
                    ))}
                </Select>
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
            </Space>
        }>
            {cloudStore.curNameSpace != "" && (
                <div style={{ height: "calc(100vh - 166px)", overflowY: "scroll" }}>
                    <DeploymentListPanel/>
                    <StatefulsetListPanel />
                </div>
            )}
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
        </CardWrap>
    );
};

export default observer(NameSpaceDetail);