import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "./stores";
import { Button, Card, Form, Modal, Progress, Table, message } from "antd";
import { list_repo_branch, fetch_remote } from "@/api/local_repo";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import { CloudDownloadOutlined } from "@ant-design/icons";
import AuthSelect from "./components/AuthSelect";
import type { LocalRepoBranchInfo, CloneProgressInfo as FetchProgressInfo } from "@/api/local_repo";


interface FetchModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const FetchModal = observer((props: FetchModalProps) => {
    const gitProStore = useGitProStores();

    const [authType, setAuthType] = useState<"none" | "privkey" | "password">("none");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [privKey, setPrivKey] = useState("");
    const [fetchProgress, setFetchProgress] = useState<FetchProgressInfo | null>(null);

    const checkValid = () => {
        if (authType == "privkey" && privKey == "") {
            return false;
        } else if (authType == "password") {
            if (userName == "" || password == "") {
                return false;
            }
        }
        return true;
    };

    const fetchRemote = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        setFetchProgress(null);
        try {
            await fetch_remote(gitProStore.repoInfo.path, gitProStore.mainItem.menuValue, authType, userName, password, privKey, info => {
                setFetchProgress(info);
                if (info.totalObjs == info.indexObjs) {
                    message.info("下载成功");
                    setFetchProgress(null);
                    props.onOk();
                }
            });
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
            setFetchProgress(null);
        }
    };

    return (
        <Modal open title="同步远程数据"
            okText="下载数据" okButtonProps={{ disabled: !checkValid() || fetchProgress != null }}
            cancelButtonProps={{ disabled: fetchProgress != null }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                fetchRemote();
            }}>
            <AuthSelect authType={authType} userName={userName} password={password} privKey={privKey}
                onChange={(newAuthType: "none" | "password" | "privkey", newUserName: string, newPassword: string, newPrivKey: string) => {
                    if (newAuthType != authType) {
                        setAuthType(newAuthType);
                    }
                    if (newUserName != userName) {
                        setUserName(newUserName);
                    }
                    if (newPassword != password) {
                        setPassword(newPassword);
                    }
                    if (newPrivKey != privKey) {
                        setPrivKey(newPrivKey);
                    }
                }} />
            {fetchProgress != null && (
                <Form labelCol={{ span: 3 }}>
                    <Form.Item label="下载进度">
                        <Progress percent={fetchProgress.totalObjs == 0 ? 100 : Math.round(fetchProgress.recvObjs * 100 / fetchProgress.totalObjs)} />
                    </Form.Item>
                    <Form.Item label="索引进度">
                        <Progress percent={fetchProgress.totalObjs == 0 ? 100 : Math.round(fetchProgress.indexObjs * 100 / fetchProgress.totalObjs)} />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
});


const RemotePanel = () => {
    const gitProStore = useGitProStores();

    const [branchList, setBranchList] = useState<LocalRepoBranchInfo[]>([]);
    const [showFetchModal, setShowFetchModal] = useState(false);

    const loadBranchList = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const tmpBranchList = await list_repo_branch(gitProStore.repoInfo.path, true);
        const tmpList: LocalRepoBranchInfo[] = [];
        for (const branch of tmpBranchList) {
            if (branch.name.startsWith(`${gitProStore.mainItem.menuValue}/`)) {
                tmpList.push({
                    ...branch,
                    name: branch.name.substring(`${gitProStore.mainItem.menuValue}/`.length),
                });
            }
        }
        setBranchList(tmpList)
    };

    const columns: ColumnsType<LocalRepoBranchInfo> = [
        {
            title: "分支名称",
            dataIndex: "name",
        },
        {
            title: "最后提交内容",
            dataIndex: "commit_summary",
        },
        {
            title: "提交时间",
            render: (_, row: LocalRepoBranchInfo) => moment(row.commit_time).format("YYYY-MM-DD HH:mm:ss"),
        }
    ];

    useEffect(() => {
        loadBranchList();
    }, [gitProStore.mainItem.menuValue]);

    return (
        <Card title={`${gitProStore.mainItem.menuValue}(${gitProStore.mainItem.menuExtraValue})`}
            bodyStyle={{ height: "calc(100vh - 45px)", overflowY: "scroll" }}
            bordered={false} extra={
                <Button type="link" icon={<CloudDownloadOutlined style={{ fontSize: "22px" }} />}
                    title="同步远程数据"
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowFetchModal(true);
                    }} />
            }>
            <Table rowKey="name" dataSource={branchList} pagination={false} columns={columns} />
            {showFetchModal == true && (
                <FetchModal onCancel={() => setShowFetchModal(false)} onOk={() => {
                    setShowFetchModal(false);
                    loadBranchList();
                }} />
            )}
        </Card>
    )
};

export default observer(RemotePanel);