import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { FolderInfo } from "@/api/project_entry";
import { update_folder_title } from "@/api/project_entry";
import { Form, Input, Modal, message } from "antd";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";

export interface UpdateFolderModalProps {
    folderInfo: FolderInfo;
    onCancel: () => void;
    onOk: () => void;
}

const UpdateFolderModal = (props: UpdateFolderModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [title, setTitle] = useState(props.folderInfo.folder_title);

    const updateFolderTitle = async () => {
        await request(update_folder_title({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            folder_id: props.folderInfo.folder_id,
            folder_title: title,
        }));
        message.info("修改成功");
        props.onOk();
    };

    return (
        <Modal open title="修改目录"
            okText="修改" okButtonProps={{ disabled: title == props.folderInfo.folder_title || title == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateFolderTitle();
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

export default observer(UpdateFolderModal);