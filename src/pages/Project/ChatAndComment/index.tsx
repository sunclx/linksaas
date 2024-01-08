import { Badge, Space, Tabs, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import UnreadCommentList from "./UnreadCommentList";
import { useStores } from "@/hooks";
import ChatGroupList from "./ChatGroupList";
import Button from "@/components/Button";
import { PlusOutlined, UserSwitchOutlined } from "@ant-design/icons";
import SelectGroupMemberModal from "./components/SelectGroupMemberModal";
import { create_group, update_group, update_group_member } from "@/api/project_chat";
import { request } from "@/utils/request";
import ChatMsgList from "./ChatMsgList";

const ChatAndCommentPanel = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [activeKey, setActiveKey] = useState("chat");
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);

    const createChatGroup = async (newTitle: string, newUserIdList: string[]) => {
        if (newUserIdList.length < 2) {
            return;
        }
        const res = await request(create_group({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            title: newTitle,
            member_user_id_list: newUserIdList,
        }));
        projectStore.curProject?.chat_store.onUpdateMember(res.chat_group_id);
        message.info("创建成果");
    };

    const updateChatGroup = async (newTitle: string, newUserIdList: string[]) => {
        if (newTitle != projectStore.curProject?.chat_store.curGroup?.groupInfo.title) {
            await request(update_group({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                chat_group_id: projectStore.curProject?.chat_store.curGroupId ?? "",
                title: newTitle,
            }));
            projectStore.curProject?.chat_store.onUpdateGroup(projectStore.curProject?.chat_store.curGroupId ?? "");
        }
        await request(update_group_member({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            chat_group_id: projectStore.curProject?.chat_store.curGroupId ?? "",
            member_user_id_list: newUserIdList,
        }));
        projectStore.curProject?.chat_store.onUpdateMember(projectStore.curProject?.chat_store.curGroupId ?? "");
        message.info("更新成功");
    }

    return (
        <>
            <Tabs style={{ width: "100%" }} type="card"
                tabBarStyle={{ height: "45px", marginBottom: "0px" }}
                activeKey={activeKey}
                onChange={key => setActiveKey(key)}
                items={[
                    {
                        key: "chat",
                        label: (
                            <div style={{ paddingRight: "20px" }}>
                                <Badge count={projectStore.curProject?.chat_store.totalUnread ?? 0} offset={[10, 0]} style={{ padding: '0 3px', height: '16px', lineHeight: '16px' }}>
                                    沟通
                                </Badge>
                            </div>),
                        children: (
                            <div style={{ height: "calc(100vh - 136px)", overflowY: projectStore.curProject?.chat_store.curGroupId == "" ? "auto" : "hidden" }}>
                                {activeKey == "chat" && (
                                    <>
                                        {projectStore.curProjectId != "" && projectStore.curProject?.chat_store.curGroupId == "" && <ChatGroupList />}
                                        {projectStore.curProjectId != "" && projectStore.curProject?.chat_store.curGroupId != "" && <ChatMsgList />}
                                    </>
                                )}
                            </div>
                        ),
                    },
                    {
                        key: "comment",
                        label: (
                            <div style={{ paddingRight: "20px" }}>
                                <Badge count={projectStore.curProject?.project_status.unread_comment_count ?? 0} offset={[10, 0]} style={{ padding: '0 3px', height: '16px', lineHeight: '16px' }}>
                                    未读评论
                                </Badge>
                            </div>),
                        children: (
                            <div style={{ height: "calc(100vh - 136px)", overflowY: "auto" }}>
                                {activeKey == "comment" && (<UnreadCommentList />)}
                            </div>
                        ),
                    },

                ]} tabBarExtraContent={
                    <div style={{ marginRight: "10px" }}>
                        {activeKey == "chat" && (
                            <>
                                {projectStore.curProjectId != "" && projectStore.curProject?.chat_store.curGroupId == "" && (
                                    <Button type="link" icon={<PlusOutlined />} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowCreateGroupModal(true);
                                    }} style={{ minWidth: 0, padding: "0px 0px" }} />
                                )}
                                {projectStore.curProjectId != "" && projectStore.curProject?.chat_store.curGroupId != "" && (
                                    <Space>
                                        {(projectStore.curProject?.chat_store.curGroup?.groupInfo.user_perm.can_update_member ?? false) == true && (
                                            <Button type="link" icon={<UserSwitchOutlined />} style={{ minWidth: 0, padding: "0px 0px" }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setShowUpdateGroupModal(true);
                                                }} />
                                        )}
                                    </Space>

                                )}
                            </>
                        )}
                    </div>
                } />
            {showCreateGroupModal == true && (
                <SelectGroupMemberModal onCancel={() => setShowCreateGroupModal(false)} onOk={(newTitle, newUserIdList) => {
                    createChatGroup(newTitle, newUserIdList).then(() => setShowCreateGroupModal(false));
                }} />
            )}
            {showUpdateGroupModal == true && (
                <SelectGroupMemberModal onCancel={() => setShowUpdateGroupModal(false)} onOk={(newTitle, newUserIdList) => {
                    updateChatGroup(newTitle, newUserIdList).then(() => setShowUpdateGroupModal(false));
                }} />
            )}
        </>
    );
};

export default observer(ChatAndCommentPanel);