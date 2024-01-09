import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Button, Form, List, Modal, Select, Space, message } from "antd";
import { useStores } from "@/hooks";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { change_group_owner } from "@/api/project_chat";
import { request } from "@/utils/request";

interface ChangeOwnerModalProps {
    chatGroupId: string;
    onCancel: () => void;
    onOk: () => void;
}

const ChangeOwnerModal = observer((props: ChangeOwnerModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [newOwnerUserId, setNewOwnerUserId] = useState<string | null>(null);


    const changeOwner = async () => {
        if (newOwnerUserId == null) {
            return;
        }
        await request(change_group_owner({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            chat_group_id: props.chatGroupId,
            target_member_user_id: newOwnerUserId,
        }));
        props.onOk();
        message.info("更换群主成功");
    };

    return (
        <div onClick={e=>{
            //防止触发上级dom的onClick
            e.stopPropagation();
            e.preventDefault();
        }}>
            <Modal open title="更换群主"
                okText="更换" okButtonProps={{ danger: true, disabled: newOwnerUserId == null }}
                onCancel={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onCancel();
                }}
                onOk={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    changeOwner();
                }}>
                <Form>
                    <Form.Item label="当前群主">
                        <Space>
                            <UserPhoto logoUri={projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.groupInfo.owner_logo_uri ?? ""} style={{ width: "16px", borderRadius: "10px" }} />
                            {projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.groupInfo.owner_display_name ?? ""}
                        </Space>
                    </Form.Item>
                    <Form.Item label="新群主">
                        <Select value={newOwnerUserId} onChange={value => setNewOwnerUserId(value)}>
                            {(projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.memberList ?? [])
                                .filter(item => item.member_user_id != (projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.groupInfo.owner_user_id ?? ""))
                                .map(item => (
                                    <Select.Option key={item.member_user_id} value={item.member_user_id}>
                                        <Space>
                                            <UserPhoto logoUri={item.member_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                                            {item.member_display_name}
                                        </Space>
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
});

export interface GroupMemberListProps {
    chatGroupId: string;
}

const GroupMemberList = (props: GroupMemberListProps) => {
    const projectStore = useStores('projectStore');
    const memberStore = useStores("memberStore");

    const [showChangOwnerModal, setShowChangOwnerModal] = useState(false);

    const canChangeOwner = () => {
        const group = projectStore.curProject?.chat_store.getGroup(props.chatGroupId);
        if (group == undefined) {
            return false;
        }
        if (group.memberList.length < 2) {
            return false;
        }
        return group.groupInfo.user_perm.can_change_owner;
    };

    return (
        <div style={{ width: "300px", padding: "10px 10px" }}>
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>群主</h1>
            <Space style={{ marginBottom: "10px" }}>
                <UserPhoto logoUri={projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.groupInfo.owner_logo_uri ?? ""} style={{ width: "16px", borderRadius: "10px" }} />
                {projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.groupInfo.owner_display_name ?? ""}
                <Button type="link" disabled={!canChangeOwner()} danger onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowChangOwnerModal(true);
                }}>更换群主</Button>
            </Space>
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>在线成员</h1>
            <List grid={{ gutter: 16 }}
                dataSource={(projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.memberList ?? []).filter(member => memberStore.getMember(member.member_user_id)?.member.online == true)}
                renderItem={item => (
                    <List.Item key={item.member_user_id}>
                        <Space>
                            <UserPhoto logoUri={item.member_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                            {item.member_display_name}
                        </Space>
                    </List.Item>
                )} />
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>离线成员</h1>
            <List grid={{ gutter: 16 }}
                dataSource={(projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.memberList ?? []).filter(member => memberStore.getMember(member.member_user_id)?.member.online == false)}
                renderItem={item => (
                    <List.Item key={item.member_user_id}>
                        <Space>
                            <UserPhoto logoUri={item.member_logo_uri} style={{ width: "16px", borderRadius: "10px", filter: "grayscale(100%)" }} />
                            {item.member_display_name}
                        </Space>
                    </List.Item>
                )} />
            {showChangOwnerModal == true && (
                <ChangeOwnerModal chatGroupId={props.chatGroupId} onCancel={() => setShowChangOwnerModal(false)} onOk={() => {
                    const group = projectStore.curProject?.chat_store.getGroup(props.chatGroupId);
                    if (group == undefined) {
                        setShowChangOwnerModal(false);
                    }
                    projectStore.curProject?.chat_store.onUpdateGroup(props.chatGroupId).then(() => setShowChangOwnerModal(false));
                }} />
            )}
        </div>
    );
};

export default observer(GroupMemberList);