import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { GroupInfo } from "@/api/group";
import { update as update_group } from "@/api/group";
import { Checkbox, Form, Input, Modal, message } from "antd";
import { useStores } from "@/hooks";
import { useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_GROUP } from "@/api/fs";
import { request } from "@/utils/request";

export interface EditGroupModalProps {
    groupInfo: GroupInfo;
    onCancel: () => void;
    onOk: () => void;
}

const EditGroupModal = (props: EditGroupModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [groupName, setGroupName] = useState(props.groupInfo.group_name);
    const [canAddPost, setCanAddPost] = useState(props.groupInfo.can_add_post_for_new);
    const [canAddComment, setCanAddComment] = useState(props.groupInfo.can_add_comment_for_new);

    const { editor, editorRef } = useCommonEditor({
        placeholder: "请输入兴趣组简介",
        content: props.groupInfo.group_desc,
        fsId: props.groupInfo.fs_id,
        ownerType: FILE_OWNER_TYPE_GROUP,
        ownerId: props.groupInfo.group_id,
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
    });

    const updateGroup = async () => {
        const content = editorRef.current?.getContent() ?? { type: "doc" };
        await request(update_group({
            session_id: userStore.sessionId,
            group_id: props.groupInfo.group_id,
            group_name: groupName,
            icon_file_id: props.groupInfo.icon_file_id,
            group_desc: JSON.stringify(content),
            can_add_post_for_new: canAddPost,
            can_add_comment_for_new: canAddComment,
        }));
        message.info("修改成功");
        props.onOk();
    };

    return (
        <Modal open title="修改兴趣组简介"
            width={800}
            okText="修改" okButtonProps={{ disabled: groupName == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateGroup();
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
                    <Checkbox checked={canAddComment} onChange={e => {
                        e.stopPropagation();
                        setCanAddComment(e.target.checked);
                    }} />
                </Form.Item>
                <Form.Item label="新成员可评论">
                    <Checkbox checked={canAddPost} onChange={e => {
                        e.stopPropagation();
                        setCanAddPost(e.target.checked);
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

export default observer(EditGroupModal);