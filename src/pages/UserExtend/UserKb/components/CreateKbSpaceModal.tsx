import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Button, Checkbox, Form, Input, Modal, message } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { request } from "@/utils/request";
import { create_space, KB_SPACE_PRIVATE, KB_SPACE_SECURE } from "@/api/user_kb";
import { useStores } from "@/hooks";

interface CreateKbSpaceModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateKbSpaceModal: React.FC<CreateKbSpaceModalProps> = (props) => {
    const userStore = useStores('userStore');

    const [title, setTitle] = useState("");
    const [secure, setSecure] = useState(false);
    const [sshPubKey, setSshPubKey] = useState("");
    const [valid, setValid] = useState(false);

    const checkValid = (titleValue: string, secureValue: boolean, sshPubKeyValue: string) => {
        if (titleValue.trim().length < 2 || titleValue.trim().length > 6) {
            setValid(false);
            return;
        }
        if (secureValue && sshPubKeyValue.trim().endsWith(".pub") == false) {
            setValid(false);
            return;
        }
        setValid(true);
    }

    const selectPubKey = async () => {
        const selectd = await open_dialog({
            title: "选择Openssh公钥",
            filters: [
                {
                    name: "公钥",
                    extensions: ["pub"],
                },
            ],
        });
        if (!(Array.isArray(selectd) || selectd == null)) {
            setSshPubKey(selectd);
            checkValid(title, secure, selectd);
        }
    };

    const createKbSpace = async () => {
        const titleValue = title.trim();
        if (titleValue.length < 2 || titleValue.length > 6) {
            message.error("知识库名称只能2-6个字符");
            return;
        }
        if (secure && sshPubKey.trim().endsWith(".pub") == false) {
            message.error("Openssh公钥缺失");
            return;
        }
        await request(create_space({
            session_id: userStore.sessionId,
            basic_info: {
                space_name: titleValue,
            },
            kb_space_type: secure ? KB_SPACE_SECURE : KB_SPACE_PRIVATE,
            ssh_pub_key: sshPubKey,
        }));
        props.onOk();
    }

    return (
        <Modal open title="创建知识库空间"
            okText="创建"
            okButtonProps={{ disabled: !valid }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createKbSpace();
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="知识库名称" help={
                    <>
                        {title.trim() != "" && (title.trim().length < 2 || title.trim().length > 6) && (
                            <span style={{ color: "red" }}>知识库名称只能2-6个字符</span>
                        )}
                    </>
                }>
                    <Input value={title} placeholder="请输入知识库名称" onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                        checkValid(e.target.value, secure, sshPubKey);
                    }} />
                </Form.Item>
                <Form.Item label="加密模式">
                    <Checkbox checked={secure} onChange={e => {
                        e.stopPropagation();
                        setSecure(e.target.checked);
                        checkValid(title, e.target.checked, sshPubKey);
                    }} />
                </Form.Item>
                {secure == true && (
                    <Form.Item label="OpenSsh公钥" help={
                        <span>目前只支持rsa算法,可以使用ssh-keygen -t rsa生成密钥对。</span>
                    }>
                        <Input addonAfter={
                            <Button type="text" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                selectPubKey();
                            }} />
                        } value={sshPubKey} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSshPubKey(e.target.value);
                            checkValid(title, secure, e.target.value);
                        }} />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default observer(CreateKbSpaceModal);