import React, { useState } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "./stores";
import GraphCommit from "./components/GraphCommit";
import DiffFile from "./components/DiffFile";
import { Button, Card, Checkbox, Form, Input, Modal, Space, message } from "antd";
import { BranchesOutlined, DeleteOutlined, DownloadOutlined, SwapOutlined, UploadOutlined } from "@ant-design/icons";
import { checkout_branch, create_branch, remove_branch, remove_tag } from "@/api/local_repo";

const GraphPanel = () => {
    const gitProStore = useGitProStores();

    const [srcBranchName, setSrcBranchName] = useState("");
    const [destBranchName, setDestBranchName] = useState("");
    const [removeBranchName, setRemoveBranchName] = useState("");
    const [forceRemove, setForceRemove] = useState(false);
    const [removeTagName, setRemoveTagName] = useState("");

    const checkoutBranch = async (branchName: string) => {
        if (gitProStore.repoInfo == null) {
            return;
        }

        await checkout_branch(gitProStore.repoInfo.path, branchName);
        gitProStore.incDataVersion();
        message.info("切换分支成功");
    };

    const createBranch = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        await create_branch(gitProStore.repoInfo.path, srcBranchName, destBranchName);
        await checkout_branch(gitProStore.repoInfo.path, destBranchName);
        setSrcBranchName("");
        setDestBranchName("");
        gitProStore.incDataVersion();
        message.info("创建分支成功");
    };

    const removeBranch = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        try {
            await remove_branch(gitProStore.repoInfo.path, removeBranchName, forceRemove);
        } catch (e) {
            message.error(`${e}`);
            return;
        }
        setRemoveBranchName("");
        gitProStore.incDataVersion();
        message.info("删除分支成功");
    };

    const removeTag = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        try {
            await remove_tag(gitProStore.repoInfo.path, removeTagName);
        } catch (e) {
            message.error(`${e}`);
            return;
        }
        setRemoveTagName("");
        gitProStore.incDataVersion();
        message.info("删除标记成功");
    };

    return (
        <Card title={gitProStore.mainItem.menuExtraValue ?? ""}
            bodyStyle={{ display: "flex", flexDirection: "column", padding: "0px 0px" }}
            bordered={false} extra={
                <Space size="middle">
                    {gitProStore.mainItem.menuExtraValue == "HEAD" && (
                        <>
                            <Button type="link" icon={<DownloadOutlined style={{ fontSize: "22px" }} />} title="拉取(Pull)" disabled />
                            <Button type="link" icon={<UploadOutlined style={{ fontSize: "22px" }} />} title="推送(Push)" disabled />
                        </>
                    )}
                    {gitProStore.mainItem.menuExtraValue?.startsWith("branch:") && (
                        <>
                            {(gitProStore.gitInfo?.head.branch_name ?? "") != (gitProStore.mainItem.menuExtraValue ?? "").substring("branch:".length) && (
                                <Button type="link" icon={<SwapOutlined style={{ fontSize: "22px" }} />} title="切换至分支"
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        checkoutBranch((gitProStore.mainItem.menuExtraValue ?? "").substring("branch:".length));
                                    }} />
                            )}
                            <Button type="link" icon={<BranchesOutlined style={{ fontSize: "22px" }} />} title="创建分支"
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setSrcBranchName((gitProStore.mainItem.menuExtraValue ?? "").substring("branch:".length));
                                    setDestBranchName("");
                                }} />
                            <Button type="link" icon={<DeleteOutlined style={{ fontSize: "22px" }} />} danger title="删除分支"
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setForceRemove(false);
                                    setRemoveBranchName((gitProStore.mainItem.menuExtraValue ?? "").substring("branch:".length));
                                }} />
                        </>
                    )}
                    {gitProStore.mainItem.menuExtraValue?.startsWith("tag:") && (
                        <Button type="link" icon={<DeleteOutlined style={{ fontSize: "22px" }} />} danger title="删除标记"
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setRemoveTagName((gitProStore.mainItem.menuExtraValue ?? "").substring("tag:".length))
                            }} />
                    )}
                </Space>
            }>
            <GraphCommit />
            {gitProStore.curCommit != null && gitProStore.curDiffFile != null && <DiffFile />}
            {srcBranchName != "" && gitProStore.gitInfo != null && (
                <Modal open title="创建分支"
                    okText="创建" okButtonProps={{
                        disabled: destBranchName == "" || gitProStore.gitInfo.branch_list.map(item => item.name).includes(destBranchName)
                            || gitProStore.gitInfo.tag_list.map(item => item.name).includes(destBranchName)
                    }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSrcBranchName("");
                        setDestBranchName("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        createBranch();
                    }}>
                    <Form labelCol={{ span: 3 }}>
                        <Form.Item label="引用分支">{srcBranchName}</Form.Item>
                        <Form.Item label="新分支">
                            <Input value={destBranchName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setDestBranchName(e.target.value.trim());
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeBranchName != "" && (
                <Modal open title="删除分支"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveBranchName("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeBranch();
                    }}>
                    是否删除分支{removeBranchName}?
                    <Form>
                        <Form.Item label="强制删除">
                            <Checkbox checked={forceRemove} onChange={e => {
                                e.stopPropagation();
                                setForceRemove(e.target.checked);
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeTagName != "" && (
                <Modal open title="删除标记"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveTagName("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeTag();
                    }}>
                    是否删除标记{removeTagName}?
                </Modal>
            )}
        </Card>
    );
};

export default observer(GraphPanel);