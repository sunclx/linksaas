import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Checkbox, Form, Input, Modal, Tabs, message } from "antd";
import { create as create_group } from "@/api/group";
import { join as join_group } from "@/api/group_member";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";

export interface CreateGroupModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateOrJoinGroupModal = (props: CreateGroupModalProps) => {
    const userStore = useStores('userStore');

    const [activeKey, setActiveKey] = useState("join");

    const [inviteCode, setInviteCode] = useState("");

    const [groupName, setGroupName] = useState("");
    const [canAddPost, setCanAddPost] = useState(true);
    const [canAddComment, setCanAddComment] = useState(true);

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

    const checkValid = (): boolean => {
        if (activeKey == "join" && inviteCode != "") {
            return true;
        } else if (activeKey == "create" && groupName != "") {
            return true;
        }
        return false;
    }

    const createGroup = async () => {
        const content = editorRef.current?.getContent() ?? { type: "doc" };
        await request(create_group({
            session_id: userStore.sessionId,
            group_name: groupName,
            group_desc: JSON.stringify(content),
            can_add_post_for_new: canAddPost,
            can_add_comment_for_new: canAddComment,
        }));
        message.info("创建成功");
        props.onOk();
    };

    const joinGroup = async () => {
        await request(join_group({
            session_id: userStore.sessionId,
            invite_code: inviteCode,
        }));
        message.info("加入成功");
        props.onOk();
    };

    return (
        <Modal open title="创建兴趣组"
            okText={activeKey == "join" ? "加入" : "创建"} okButtonProps={{ disabled: !checkValid() }}
            width={800}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (activeKey == "create") {
                    createGroup();
                } else if (activeKey == "join") {
                    joinGroup();
                }
            }}>
            <Tabs activeKey={activeKey} type="card" onChange={value => setActiveKey(value)}
                items={[
                    {
                        key: "join",
                        label: "加入兴趣组",
                        children: (
                            <div>
                                {activeKey == "join" && (
                                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 3 }} value={inviteCode} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setInviteCode(e.target.value.trim());
                                    }} />
                                )}
                            </div>
                        )
                    },
                    {
                        key: "create",
                        label: "创建兴趣组",
                        children: (
                            <div>
                                {activeKey == "create" && (
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
                                )}
                            </div>
                        ),
                    }
                ]} />
        </Modal>
    );
};

export default observer(CreateOrJoinGroupModal);