import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Form, Input, Modal } from "antd";
import { create_folder } from "@/api/project_entry";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";

export interface CreateFolderModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateFolderModal = (props: CreateFolderModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');

    const [title, setTitle] = useState("");

    const createFolder = async () => {
        await request(create_folder({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            folder_title: title,
            parent_folder_id: entryStore.curFolderId,
        }));
        props.onOk();
    };

    return (
        <Modal open title="创建目录"
            okText="创建" okButtonProps={{ disabled: title == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createFolder();
            }}>
            <Form>
                <Form.Item label="目录名称">
                    <Input value={title} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(CreateFolderModal);