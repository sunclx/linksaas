import { FolderOpenOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal,message } from "antd";
import React, { useState } from "react";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { valid_ssh_key} from '@/api/user_kb';

interface ValidSshKeyModalProps {
    sshPubKey: string;
    onCancel: () => void;
    onOk: () => void;
};

const ValidSshKeyModal: React.FC<ValidSshKeyModalProps> = (props) => {
    const [sshPrivKeyFile, setSshPrivKeyFile] = useState("");

    const selectPrivSshKey = async () => {
        const selectd = await open_dialog({
            title: "选择Openssh密钥",
        });
        if (!(Array.isArray(selectd) || selectd == null)) {
            setSshPrivKeyFile(selectd);
        }
    };

    const validSshKey = async () => {
        try{
            await valid_ssh_key(props.sshPubKey,sshPrivKeyFile);
            props.onOk();
        }catch(e){
            message.error(`${e}`);
        }
    };


    return (
        <Modal open title="解锁知识库空间"
            okText="解锁"
            okButtonProps={{ disabled: sshPrivKeyFile.trim() == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                validSshKey();
            }}>
            <Form>
                <Form.Item label="Openssh密钥">
                    <Input addonAfter={
                        <Button type="text" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            selectPrivSshKey();
                        }} />
                    } value={sshPrivKeyFile} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSshPrivKeyFile(e.target.value);
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default (ValidSshKeyModal);