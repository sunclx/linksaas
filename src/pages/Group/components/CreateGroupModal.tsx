import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Checkbox, Form, Input, Modal, message } from "antd";
import { create as create_group } from "@/api/group";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";

export interface CreateGroupModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateGroupModal = (props: CreateGroupModalProps) => {
    const userStore = useStores('userStore');

    const [groupName, setGroupName] = useState("");
    const [readOnlyForNewMember, setReadOnlyForNewMember] = useState(true);

    const { editor, editorRef } = useCommonEditor({
        placeholder: "请输入兴趣组简介",
        content: "",
        fsId: "",
        ownerType: FILE_OWNER_TYPE_NONE,
        ownerId: "",
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
    });

    const createGroup = async () => {
        const content = editorRef.current?.getContent() ?? { type: "doc" };
        await request(create_group({
            session_id: userStore.sessionId,
            group_name: groupName,
            group_desc: JSON.stringify(content),
            read_only_for_new_member: readOnlyForNewMember,
        }));
        message.info("创建成功");
        props.onOk();
    };

    return (
        <Modal open title="创建兴趣组"
            okText="创建" okButtonProps={{ disabled: groupName == "" }}
            width={800}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e=>{
                e.stopPropagation();
                e.preventDefault();
                createGroup();
            }}>
            <Form labelCol={{ span: 3 }}>
                <Form.Item label="名称">
                    <Input value={groupName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGroupName(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="新成员可发帖">
                    <Checkbox checked={!readOnlyForNewMember} onChange={e => {
                        e.stopPropagation();
                        setReadOnlyForNewMember(!e.target.checked);
                    }} />
                </Form.Item>
                <Form.Item label="简介">
                    <div className="_projectEditContext">
                        {editor}
                    </div>
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default observer(CreateGroupModal);