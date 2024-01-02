import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "./stores";
import DiffFile from "./components/DiffFile";
import CommitAndFileList from "./components/CommitAndFileList";
import { Button, List, Modal, Space, message } from "antd";
import type { LocalRepoStashInfo } from "@/api/local_repo";
import { list_stash, apply_stash, drop_stash } from "@/api/local_repo";
import { DeleteOutlined, RollbackOutlined } from "@ant-design/icons";


const StashPanel = () => {
    const gitProStore = useGitProStores();

    const [stashList, setStashList] = useState<LocalRepoStashInfo[]>([]);
    const [applyStashInfo, setApplyStashInfo] = useState<LocalRepoStashInfo | null>(null);
    const [dropStashInfo, setDropStashInfo] = useState<LocalRepoStashInfo | null>(null);

    const loadStashList = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const res = await list_stash(gitProStore.repoInfo.path);
        if (res.length == 0) {
            gitProStore.incDataVersion();
        } else {
            setStashList(res);
        }
    };

    const applyStash = async () => {
        if (gitProStore.repoInfo == null || applyStashInfo == null) {
            return;
        }
        await apply_stash(gitProStore.repoInfo.path, applyStashInfo.commit_id);
        setApplyStashInfo(null);
        gitProStore.curCommit = null;
        gitProStore.curDiffFile = null;
        message.info("提前暂存文件成功");
        await loadStashList();
    };

    const dropStash = async () => {
        if (gitProStore.repoInfo == null || dropStashInfo == null) {
            return;
        }
        await drop_stash(gitProStore.repoInfo.path, dropStashInfo.commit_id);
        setDropStashInfo(null);
        gitProStore.curCommit = null;
        gitProStore.curDiffFile = null;
        message.info("移除暂存文件成功");
        await loadStashList();
    };

    useEffect(() => {
        loadStashList();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flex: 1 }}>
                <div style={{ flex: 1, borderRight: "1px solid #e4e4e8" }}>
                    <List key="commit_id" dataSource={stashList} renderItem={item => (
                        <List.Item extra={
                            <Space>
                                <Button type="link" icon={<RollbackOutlined />} title="提取暂存文件" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    gitProStore.curCommit = item.commit_id;
                                    gitProStore.curDiffFile = null;
                                    setApplyStashInfo(item);
                                }} />
                                <Button type="link" icon={<DeleteOutlined />} title="移除暂存文件" danger onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    gitProStore.curCommit = item.commit_id;
                                    gitProStore.curDiffFile = null;
                                    setDropStashInfo(item);
                                }} />
                            </Space>
                        }>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                gitProStore.curCommit = item.commit_id;
                                gitProStore.curDiffFile = null;
                            }}>{item.commit_summary}</a>
                        </List.Item>
                    )} style={{ padding: "10px 10px" }} />
                </div>
                {gitProStore.curCommit != null && (
                    <div style={{ width: "300px" }}>
                        <CommitAndFileList />
                    </div>
                )}
            </div>
            {gitProStore.curCommit != null && gitProStore.curDiffFile != null && <DiffFile />}
            {applyStashInfo != null && (
                <Modal open title="提前暂存文件"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        gitProStore.curCommit = null;
                        gitProStore.curDiffFile = null;
                        setApplyStashInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        applyStash();
                    }}>
                    <p>是否提取暂存文件?</p>
                    <p>{applyStashInfo.commit_summary}</p>
                </Modal>
            )}
            {dropStashInfo != null && (
                <Modal open title="移除暂存文件"
                    okButtonProps={{ danger: true }} okText="移除"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        gitProStore.curCommit = null;
                        gitProStore.curDiffFile = null;
                        setDropStashInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        dropStash();
                    }}>
                    <p>是否移除暂存文件?</p>
                    <p>{dropStashInfo.commit_summary}</p>
                </Modal>
            )}
        </div>
    );
};

export default observer(StashPanel);