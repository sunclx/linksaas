import { Modal, Form, Input, Button, message, Radio, Progress } from "antd";
import React, { useState } from "react";
import type { CloneProgressInfo } from "@/api/local_repo";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog, save as save_dialog } from '@tauri-apps/api/dialog';
import { get_repo_status, add_repo, clone as clone_repo } from "@/api/local_repo";
import { uniqId } from "@/utils/utils";

interface AddRepoModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const AddRepoModal: React.FC<AddRepoModalProps> = (props) => {
    const [name, setName] = useState("");
    const [repoType, setRepoType] = useState<"local" | "remote">("local");
    const [remoteUrl, setRemoteUrl] = useState("");
    const [localPath, setLocalPath] = useState("");
    const [authType, setAuthType] = useState<"none" | "privkey" | "password">("none");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [privKey, setPrivKey] = useState("");
    const [cloneProgress, setCloneProgress] = useState<CloneProgressInfo | null>(null);

    const choiceLocalPath = async () => {
        if (repoType == "local") {
            const selected = await open_dialog({
                title: "项目代码路径",
                directory: true,
            });
            if (selected == null || Array.isArray(selected)) {
                return;
            }
            setLocalPath(selected);
        } else {
            const selected = await save_dialog({
                title: "保存路径",
            });
            if (selected == null) {
                return;
            }
            setLocalPath(selected);
        }
    };

    const choicePrivKey = async () => {
        const selected = await open_dialog({
            title: "选择ssh私钥",
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setPrivKey(selected);
    };

    const checkValid = () => {
        if (name == "") {
            return false;
        }
        if (localPath == "") {
            return false;
        }
        if (repoType == "remote") {
            if (remoteUrl == "") {
                return false;
            }
            if (authType == "privkey" && privKey == "") {
                return false;
            } else if (authType == "password") {
                if (username == "" || password == "") {
                    return false;
                }
            }
        }
        return true;
    };

    const addRepo = async () => {
        try {
            await get_repo_status(localPath);
            await add_repo(uniqId(), name.trim(), localPath.trim());
            props.onOk();
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    const cloneRepo = async () => {
        setCloneProgress(null)
        try {
            await clone_repo(localPath, remoteUrl, authType, username, password, privKey, info => {
                setCloneProgress(info);
                if (info.totalObjs == info.indexObjs) {
                    add_repo(uniqId(), name.trim(), localPath.trim()).then(() => {
                        props.onOk();
                    }).catch(e => {
                        console.log(e);
                        message.error(`${e}`);
                    });
                    setCloneProgress(null);
                }
            });
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    return (
        <Modal open title="添加代码仓库"
            okText="添加" okButtonProps={{ disabled: !checkValid() || cloneProgress != null }}
            cancelButtonProps={{ disabled: cloneProgress != null }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (repoType == "local") {
                    addRepo();
                } else {
                    cloneRepo();
                }
            }}
        >
            <Form labelCol={{ span: 3 }} disabled={cloneProgress != null}>
                <Form.Item label="名称">
                    <Input value={name} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setName(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="仓库类型">
                    <Radio.Group value={repoType} onChange={e => {
                        e.stopPropagation();
                        setRepoType(e.target.value);
                    }}>
                        <Radio value="local">本地仓库</Radio>
                        <Radio value="remote">远程仓库</Radio>
                    </Radio.Group>
                </Form.Item>
                {repoType == "remote" && (
                    <Form.Item label="远程地址">
                        <Input value={remoteUrl} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoteUrl(e.target.value.trim());
                        }} />
                    </Form.Item>
                )}
                <Form.Item label="本地路径">
                    <Input value={localPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLocalPath(e.target.value);
                    }}
                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choiceLocalPath();
                        }} />} />
                </Form.Item>
                {repoType == "remote" && (
                    <>
                        <Form.Item label="验证方式">
                            <Radio.Group value={authType} onChange={e => {
                                e.stopPropagation();
                                setAuthType(e.target.value);
                            }}>
                                <Radio value="none">无需验证</Radio>
                                <Radio value="password">账号密码</Radio>
                                <Radio value="privkey">SSH公钥</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {authType == "password" && (
                            <>
                                <Form.Item label="账号">
                                    <Input value={username} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setUsername(e.target.value.trim());
                                    }} />
                                </Form.Item>
                                <Form.Item label="密码">
                                    <Input.Password value={password} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setPassword(e.target.value.trim());
                                    }} />
                                </Form.Item>
                            </>
                        )}
                        {authType == "privkey" && (
                            <Form.Item label="SSH密钥">
                                <Input value={privKey} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setPrivKey(e.target.value);
                                }}
                                    addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        choicePrivKey();
                                    }} />} />
                            </Form.Item>
                        )}
                        {cloneProgress != null && (
                            <>
                                <Form.Item label="下载进度">
                                    <Progress percent={Math.round(cloneProgress.recvObjs * 100 / cloneProgress.totalObjs)} />
                                </Form.Item>
                                <Form.Item label="索引进度">
                                    <Progress percent={Math.round(cloneProgress.indexObjs * 100 / cloneProgress.totalObjs)} />
                                </Form.Item>
                            </>
                        )}
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default AddRepoModal;