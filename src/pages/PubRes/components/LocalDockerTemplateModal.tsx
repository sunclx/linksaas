import React, { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { useStores } from "@/hooks";
import { exists } from '@tauri-apps/api/fs';

export interface LocalDockerTemplateModalProps {
    onCancel: () => void;
    onOk: (path: string) => void;
}

const LocalDockerTemplateModal = (props: LocalDockerTemplateModalProps) => {
    const appStore = useStores('appStore');
    const [localPath, setLocalPath] = useState("");

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "本地模板路径",
            directory: true,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        let configFile = `${selected}/config.json`;
        if (appStore.isOsWindows) {
            configFile = `${selected}\\config.json`;
        }
        const existCfg = await exists(configFile);
        if (!existCfg) {
            message.error("目录中不存在config.json");
            return;
        }
        setLocalPath(selected);
    };

    return (
        <Modal open title="选择Docker Compose 模板"
            okButtonProps={{ disabled: localPath == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(localPath);
            }}>
            <Form>
                <Form.Item label="本地路径">
                    <Input value={localPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLocalPath(e.target.value);
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

export default LocalDockerTemplateModal;