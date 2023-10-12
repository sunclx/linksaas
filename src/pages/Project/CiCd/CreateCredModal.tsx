import { Button, Form, Input, Modal, Radio,message } from "antd";
import React, { useState } from "react";
import { type CREDENTIAL_TYPE, CREDENTIAL_TYPE_KEY, CREDENTIAL_TYPE_PASSWORD, create_credential } from "@/api/project_cicd";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { readTextFile } from '@tauri-apps/api/fs';
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';

export interface CreateCredModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateCredModal = (props: CreateCredModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [credType, setCredType] = useState<CREDENTIAL_TYPE>(CREDENTIAL_TYPE_KEY);
    const [credName, setCredName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [keyPath, setKeyPath] = useState("");

    const valid = () => {
        if (credName == "") {
            return false;
        }
        if (credType == CREDENTIAL_TYPE_KEY) {
            if (keyPath != "") {
                return true;
            }
        } else if (credType == CREDENTIAL_TYPE_PASSWORD) {
            if (userName != "" && password != "") {
                return true;
            }
        }
        return false;
    };

    const createCred = async () => {
        let keyData = "";
        if (credType == CREDENTIAL_TYPE_KEY) {
            keyData = await readTextFile(keyPath);
        }
        await request(create_credential({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            credential_name: credName,
            credential_type: credType,
            cred: {
                KeyCred: credType == CREDENTIAL_TYPE_KEY ? {
                    private_key: keyData,
                } : undefined,
                PasswordCred: credType == CREDENTIAL_TYPE_PASSWORD ? {
                    user_name: userName,
                    password: password,
                } : undefined,
            }
        }));
        props.onOk();
        message.info("增加成功");
    };

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "选择SSH密钥",
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setKeyPath(selected);
    };

    return (
        <Modal open title="增加登录凭证"
            okText="增加" okButtonProps={{ disabled: !valid() }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createCred();
            }}>
            <Form labelCol={{ span: 3 }}>
                <Form.Item label="名称">
                    <Input value={credName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCredName(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="类型">
                    <Radio.Group value={credType} onChange={e => {
                        e.stopPropagation();
                        setCredType(e.target.value);
                    }}>
                        <Radio value={CREDENTIAL_TYPE_KEY}>SSH密钥</Radio>
                        <Radio value={CREDENTIAL_TYPE_PASSWORD}>密码</Radio>
                    </Radio.Group>
                </Form.Item>
                {credType == CREDENTIAL_TYPE_KEY && (
                    <Form.Item label="SSH密钥">
                        <Input value={keyPath} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setKeyPath(e.target.value.trim());
                        }} addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePath();
                        }} />} />
                    </Form.Item>
                )}
                {credType == CREDENTIAL_TYPE_PASSWORD && (
                    <>
                        <Form.Item label="用户名">
                            <Input value={userName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setUserName(e.target.value.trim());
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
            </Form>
        </Modal>
    );
};

export default CreateCredModal;