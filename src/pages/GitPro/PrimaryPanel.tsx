import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Menu, message } from "antd";
import { useGitProStores } from "./stores";
import { get_git_info, get_repo_status, list_stash } from "@/api/local_repo";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { ReloadOutlined } from "@ant-design/icons";


const PrimaryPanel = () => {
    const gitProStore = useGitProStores();

    const [infoItemList, setInfoItemList] = useState<ItemType[]>([]);
    const [activeKey, setActiveKey] = useState("head");


    const initInfoTreeData = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const statusRes = await get_repo_status(gitProStore.repoInfo.path);
        const stashRes = await list_stash(gitProStore.repoInfo.path);

        setActiveKey("head");
        const tmpGitInfo = await get_git_info(gitProStore.repoInfo.path);
        gitProStore.gitInfo = tmpGitInfo;

        gitProStore.mainItem = {
            menuType: "gitGraph",
            menuValue: tmpGitInfo.head.commit_id,
            menuExtraValue: "HEAD",
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
                            menuExtraValue: "HEAD",
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
                        label: item.name,
                        key: `branch:${item.name}`,
                        style: { backgroundColor: "white"},
                        onClick: () => {
                            gitProStore.mainItem = {
                                menuType: "gitGraph",
                                menuValue: item.commit_id,
                                menuExtraValue: `branch:${item.name}`,
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
                                menuExtraValue: `tag:${item.name}`,
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
                label: item.name,
                key: `remote:${item.name}`,
                onClick: () => {
                    gitProStore.mainItem = {
                        menuType: "remote",
                        menuValue: item.name,
                        menuExtraValue: item.url,
                    };
                    gitProStore.curCommit = null;
                    gitProStore.curDiffFile = null;
                },
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
            <Card title="仓库信息" bodyStyle={{ overflowY: "auto", height: "calc(100vh - 40px)", padding: "0px 0px"}}
                extra={
                    <Button type="link" icon={<ReloadOutlined />} title="刷新仓库信息" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        initInfoTreeData().then(() => message.info("已刷新仓库信息"));
                    }} />
                }>
                <Menu items={infoItemList} mode="inline" defaultOpenKeys={["branch"]} selectedKeys={[activeKey]}
                    onSelect={(info) => setActiveKey(info.key)} 
                    style={{border:"none"}}/>
            </Card>
        </div>
    );
};

export default observer(PrimaryPanel);