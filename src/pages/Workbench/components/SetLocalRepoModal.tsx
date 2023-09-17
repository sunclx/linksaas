import { Modal, Form, Input, Button, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import type { LocalRepoInfo, LocalRepoRemoteInfo } from "@/api/local_repo";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { get_repo_status, add_repo, update_repo, list_remote, get_host } from "@/api/local_repo";
import { uniqId } from "@/utils/utils";
import { open as shell_open } from '@tauri-apps/api/shell';

interface SetLocalRepoModalProps {
    repo?: LocalRepoInfo;
    onCancel: () => void;
    onOk: () => void;
}

const SetLocalRepoModal: React.FC<SetLocalRepoModalProps> = (props) => {
    const [name, setName] = useState(props.repo?.name ?? "");
    const [path, setPath] = useState(props.repo?.path ?? "");
    const [setting, setSetting] = useState(props.repo?.setting ?? {
        gitlab_protocol: "https",
        gitlab_token: "",
        github_token: "",
        gitee_token: "",
        atomgit_token: "",
        gitcode_token: "",
    });
    const [remoteList, setRemoteList] = useState<LocalRepoRemoteInfo[]>([]);


    const choicePath = async () => {
        const selected = await open_dialog({
            title: "项目代码目录",
            directory: true,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setPath(selected);
    };

    const checkRepo = async (): Promise<boolean> => {
        if (name.trim() == "") {
            message.error("项目代码目录名称为空");
            return false;
        }
        if (path.trim() == "") {
            message.error("项目代码目录为空");
            return false;
        }
        try {
            await get_repo_status(path);
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
            return false;
        }
        return true;
    };

    const addRepo = async () => {
        if (await checkRepo() == false) {
            return;
        }
        try {
            await add_repo(uniqId(), name.trim(), path.trim());
            props.onOk();
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    const updateRepo = async () => {
        if (await checkRepo() == false) {
            return;
        }
        try {
            await update_repo(props.repo?.id ?? "", name.trim(), path.trim(), setting);
            props.onOk();
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    const loadRemoteList = async () => {
        if (props.repo == undefined) {
            return;
        }
        const res = await list_remote(props.repo.path);
        setRemoteList(res);
    };

    useEffect(() => {
        loadRemoteList();
    }, []);

    return (
        <Modal open title={props.repo == undefined ? "新增本地仓库" : "修改本地仓库"}
            okText={props.repo == undefined ? "增加" : "修改"} okButtonProps={{ disabled: name.trim() == "" || path.trim() == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.repo == undefined) {
                    addRepo();
                } else {
                    updateRepo();
                }
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="名称">
                    <Input value={name} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setName(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="路径">
                    <Input value={path} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setPath(e.target.value);
                    }}
                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePath();
                        }} />} />
                </Form.Item>
                {remoteList.map(remoteItem => {
                    const host = get_host(remoteItem.url);
                    return (
                        <>
                            {host.includes("atomgit.com") && (
                                <Form.Item key={host} label="atomgit令牌" help={
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        shell_open('https://atomgit.com/-/profile/tokens');
                                    }}>如何获取令牌?</a>
                                }>
                                    <Input.Password value={setting.atomgit_token} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setSetting({
                                            ...setting,
                                            atomgit_token: e.target.value.trim(),
                                        });
                                    }} />
                                </Form.Item>
                            )}
                            {host.includes("github.com") && (
                                <Form.Item key={host} label="github令牌" help={
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        shell_open("https://github.com/settings/tokens/new");
                                    }}>如何获取令牌?</a>
                                }>
                                    <Input.Password value={setting.github_token} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setSetting({
                                            ...setting,
                                            github_token: e.target.value.trim(),
                                        });
                                    }} />
                                </Form.Item>
                            )}
                            {host.includes("gitcode.net") && (
                                <Form.Item key={host} label="gitcode令牌" help={
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        shell_open("https://gitcode.net/-/profile/personal_access_tokens");
                                    }}>如何获取令牌?</a>
                                }>
                                    <Input.Password value={setting.gitcode_token} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setSetting({
                                            ...setting,
                                            gitcode_token: e.target.value.trim(),
                                        });
                                    }} />
                                </Form.Item>
                            )}
                            {host.includes("gitee.com") && (
                                <Form.Item key={host} label="gitee令牌" help={
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        shell_open("https://gitee.com/profile/personal_access_tokens");
                                    }}>如何获取令牌?</a>
                                }>
                                    <Input.Password value={setting.gitee_token} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setSetting({
                                            ...setting,
                                            gitee_token: e.target.value.trim(),
                                        });
                                    }} />
                                </Form.Item>
                            )}
                            {!(host.includes("atomgit.com") || host.includes("github.com") || host.includes("gitcode.net") || host.includes("gitee.com")) && (
                                <>
                                    <Form.Item key={host + "_protocol"} label="gitlab网络协议">
                                        <Select value={setting.gitlab_protocol}>
                                            <Select.Option value="http">http</Select.Option>
                                            <Select.Option value="https">https</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item key={host} label="gitlab令牌" help={
                                        <a onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            shell_open(`${setting.gitlab_protocol}://${host}/-/profile/personal_access_tokens`);
                                        }}>如何获取令牌?</a>
                                    }>
                                        <Input.Password value={setting.gitlab_token} onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setSetting({
                                                ...setting,
                                                gitlab_token: e.target.value.trim(),
                                            });
                                        }} />
                                    </Form.Item>
                                </>
                            )}
                        </>
                    );
                })}
            </Form>
        </Modal>
    );
};

export default SetLocalRepoModal;