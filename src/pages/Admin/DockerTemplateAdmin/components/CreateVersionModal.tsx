import { FolderOpenOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { useStores } from "@/hooks";
import { exists } from '@tauri-apps/api/fs';
import { pack_template } from "@/api/docker_template";
import { create_template } from "@/api/docker_template_admin";
import { write_file, set_file_owner, FILE_OWNER_TYPE_DOCKER_TEMPLATE } from "@/api/fs";
import { get_admin_session } from "@/api/admin_auth";
import { request } from "@/utils/request";


export interface CreateVersionModalProps {
    appId: string;
    onCancel: () => void;
    onOk: () => void;
}

const CreateVersionModal = (props: CreateVersionModalProps) => {
    const appStore = useStores('appStore');
    const [localPath, setLocalPath] = useState("");
    const [version, setVersion] = useState("");
    const [inCreate, setInCreate] = useState(false);

    const choicePath = async () => {
        const selected = await open_dialog({
            directory: true
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalPath(selected);
    };

    const createVersion = async () => {
        let configFile = `${localPath}/config.json`;
        if (appStore.isOsWindows) {
            configFile = `${localPath}\\config.json`;
        }
        const configExist = await exists(configFile);
        if (!configExist) {
            message.error(`不存在文件${configFile}`);
            return;
        }

        setInCreate(true);
        const sessionId = await get_admin_session();
        try {
            const fileName = await pack_template(localPath);
            const uploadRes = await write_file(sessionId, appStore.clientCfg?.docker_template_fs_id ?? "", fileName, "");
            if (uploadRes.code != 0) {
                message.error(uploadRes.err_msg);
                throw new Error(uploadRes.err_msg);
            }
            await request(create_template({
                admin_session_id: sessionId,
                app_id: props.appId,
                version: version,
                file_id: uploadRes.file_id,
            }));
            await set_file_owner({
                session_id: sessionId,
                fs_id: appStore.clientCfg?.docker_template_fs_id ?? "",
                file_id: uploadRes.file_id,
                owner_type: FILE_OWNER_TYPE_DOCKER_TEMPLATE,
                owner_id: props.appId,
            });
            props.onOk();
        } catch (e) {
            console.log(e);
        }
        setInCreate(false);
    };

    return (
        <Modal open title="上传模板" okText="上传" okButtonProps={{ disabled: version.trim() == "" || localPath == "" || inCreate }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createVersion();
            }}>
            <Form>
                <Form.Item label="模板版本">
                    <Input value={version} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setVersion(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="模板目录">
                    <Input addonAfter={
                        <Button type="text" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePath();
                        }} />
                    } value={localPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLocalPath(e.target.value);
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateVersionModal;