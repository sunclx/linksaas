import { Modal, Form, Input, Button, message } from "antd";
import React, { useState } from "react";
import type { LocalRepoInfo } from "@/api/local_repo";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { get_repo_status, add_repo, update_repo } from "@/api/local_repo";
import { uniqId } from "@/utils/utils";

interface SetLocalRepoModalProps {
    repo?: LocalRepoInfo;
    onCancel: () => void;
    onOk: () => void;
}

const SetLocalRepoModal: React.FC<SetLocalRepoModalProps> = (props) => {
    const [name, setName] = useState(props.repo?.name ?? "");
    const [path, setPath] = useState(props.repo?.path ?? "");

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
            await update_repo(props.repo?.id ?? "", name.trim(), path.trim());
            props.onOk();
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

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
            <Form>
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
            </Form>
        </Modal>
    );
};

export default SetLocalRepoModal;