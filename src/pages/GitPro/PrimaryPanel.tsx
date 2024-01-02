import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Form, Input, Menu, Modal, Popover, Space, message } from "antd";
import { useGitProStores } from "./stores";
import type { GitInfo } from "@/api/local_repo";
import { get_git_info, get_repo_status, list_stash, checkout_branch, create_branch, remove_branch } from "@/api/local_repo";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { MoreOutlined, ReloadOutlined } from "@ant-design/icons";


const PrimaryPanel = () => {
    const gitProStore = useGitProStores();

    const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);
    const [infoItemList, setInfoItemList] = useState<ItemType[]>([]);
    const [activeKey, setActiveKey] = useState("head");
    const [srcBranchName, setSrcBranchName] = useState("");
    const [destBranchName, setDestBranchName] = useState("");
    const [removeBranchName, setRemoveBranchName] = useState("");

    const checkoutBranch = async (branchName: string) => {
        if (gitProStore.repoInfo == null) {
            return;
        }

        await checkout_branch(gitProStore.repoInfo.path, branchName);
        gitProStore.incDataVersion();
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
            await remove_branch(gitProStore.repoInfo.path, removeBranchName);
        } catch (e) {
            message.error(`${e}`);
        }
        setRemoveBranchName("");
        gitProStore.incDataVersion();
        message.info("删除分支成功");
    };

    const initInfoTreeData = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const statusRes = await get_repo_status(gitProStore.repoInfo.path);
        const stashRes = await list_stash(gitProStore.repoInfo.path);

        setActiveKey("head");
        const tmpGitInfo = await get_git_info(gitProStore.repoInfo.path);
        setGitInfo(tmpGitInfo);

        gitProStore.mainItem = {
            menuType: "gitGraph",
            menuValue: tmpGitInfo.head.commit_id,
        };

        const workDirItemData: ItemType = {
            label: "工作目录",
            key: "workDir",
            type: "group",
            children: [
                {
                    label: `HEAD(${tmpGitInfo.head.branch_name})`,
                    key: "head",
                    onClick: () => {
                        gitProStore.mainItem = {
                            menuType: "gitGraph",
                            menuValue: tmpGitInfo.head.commit_id,
                        };
                        gitProStore.curCommit = null;
                        gitProStore.curDiffFile = null;
                    },
                },
                {
                    label: "未提交文件",
                    key: "uncommit",
                    disabled: statusRes.path_list.length == 0,
                    onClick: () => {
                        gitProStore.mainItem = {
                            menuType: "commitProcess",
                            menuValue: "",
                        };
                        gitProStore.curCommit = null;
                        gitProStore.curDiffFile = null;
                    },
                },
                {
                    label: "暂存记录",
                    key: "stash",
                    disabled: stashRes.length == 0,
                    onClick: () => {
                        gitProStore.mainItem = {
                            menuType: "stashList",
                            menuValue: "",
                        };
                        gitProStore.curCommit = null;
                        gitProStore.curDiffFile = null;
                    },
                },
            ],
        }

        const branchAndTagItemData: ItemType = {
            label: "分支/标记",
            key: "branchAndTag",
            type: "group",
            children: [
                {
                    label: "分支",
                    key: "branch",
                    children: tmpGitInfo.branch_list.map(item => ({
                        label: (
                            <div style={{ position: "relative" }}>
                                <div style={{ width: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.name}>{item.name}</div>
                                <div style={{ position: "absolute", right: "0px", top: "0px", zIndex: 100 }} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}>
                                    <Popover trigger="click" placement="bottom" content={
                                        <Space style={{ padding: "10px 10px" }} direction="vertical">
                                            <Button type="link" disabled={item.name == tmpGitInfo.head.branch_name || statusRes.path_list.length > 0}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    checkoutBranch(item.name);
                                                }}>切换至分支</Button>
                                            <Button type="link" disabled={statusRes.path_list.length > 0}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setSrcBranchName(item.name);
                                                    setDestBranchName("");
                                                }}>创建分支</Button>
                                            <Button type="link" disabled={item.name == tmpGitInfo.head.branch_name} danger
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setRemoveBranchName(item.name);
                                                }}>
                                                删除分支
                                            </Button>
                                        </Space>
                                    }>
                                        <MoreOutlined style={{ padding: "6px 6px" }} />
                                    </Popover>
                                </div>
                            </div>
                        ),
                        key: `branch:${item.name}`,
                        style: { backgroundColor: "white" },
                        onClick: () => {
                            gitProStore.mainItem = {
                                menuType: "gitGraph",
                                menuValue: item.commit_id,
                            };
                            gitProStore.curCommit = null;
                            gitProStore.curDiffFile = null;
                        },
                    })),
                },
                {
                    label: "标记",
                    key: "tag",
                    children: tmpGitInfo.tag_list.map(item => ({
                        label: item.name,
                        key: `tag:${item.name}`,
                        style: { backgroundColor: "white" },
                        onClick: () => {
                            gitProStore.mainItem = {
                                menuType: "gitGraph",
                                menuValue: item.commit_id,
                            };
                            gitProStore.curCommit = null;
                            gitProStore.curDiffFile = null;
                        },
                    })),
                }
            ],
        };

        const remoteItemData: ItemType = {
            label: "远程仓库",
            key: "remote",
            type: "group",
            children: tmpGitInfo.remote_list.map(item => ({
                label: <span title={`${item.url}`}>{item.name}</span>,
                key: `remote:${item.name}`,
            })),
        };

        const treeData: ItemType[] = [
            workDirItemData,
            branchAndTagItemData,
            remoteItemData,
        ];
        setInfoItemList(treeData);
    };

    useEffect(() => {
        initInfoTreeData();
    }, [gitProStore.repoInfo, gitProStore.dataVersion]);

    return (
        <div>
            <Card title="仓库信息" bodyStyle={{ overflowY: "scroll", height: "calc(100vh - 40px)" }} extra={
                <Button type="link" icon={<ReloadOutlined />} title="刷新仓库信息" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    initInfoTreeData().then(() => message.info("已刷新仓库信息"));
                }} />
            }>
                <Menu items={infoItemList} mode="inline" defaultOpenKeys={["branch"]} selectedKeys={[activeKey]}
                    onSelect={(info) => {
                        if (!(info.key == "remote" || info.key.startsWith("remote:"))) {
                            setActiveKey(info.key);
                        }
                    }} />
            </Card>
            {srcBranchName != "" && gitInfo != null && (
                <Modal open title="创建分支"
                    okText="创建" okButtonProps={{
                        disabled: destBranchName == "" || gitInfo.branch_list.map(item => item.name).includes(destBranchName)
                            || gitInfo.tag_list.map(item => item.name).includes(destBranchName)
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
                </Modal>
            )}
        </div>
    );
};

export default observer(PrimaryPanel);