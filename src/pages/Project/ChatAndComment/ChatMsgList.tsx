import React, { useEffect, useRef, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, List, Popover, Space } from "antd";
import { useStores } from "@/hooks";
import { InfoCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { get_content_text, useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";
import { LIST_MSG_AFTER, LIST_MSG_BEFORE, send_msg, clear_unread } from "@/api/project_chat";
import { request } from "@/utils/request";
import ChatMsgItem from "./components/ChatMsgItem";

const ChatMsgList = () => {
    const userStore = useStores("userStore");
    const projectStore = useStores('projectStore');
    const memberStore = useStores("memberStore");

    const msgListDiv = useRef<HTMLDivElement>(null);
    const [hasContent, setHasContent] = useState(false);
    const [hover, setHover] = useState(false);

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: "",
        ownerType: FILE_OWNER_TYPE_NONE,
        ownerId: "",
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
        placeholder: "请输入...",
    });

    const sendMsg = async () => {
        if (editorRef.current == null) {
            return;
        }
        const content = editorRef.current.getContent();
        await request(send_msg({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            chat_group_id: projectStore.curProject?.chat_store.curGroupId ?? "",
            content: JSON.stringify(content),
        }));
        editorRef.current.setContent("");
        setHasContent(false);
    };

    const processScroll = () => {
        if (msgListDiv.current == null) {
            return;
        }
        if (!hover) {
            return;
        }
        if (msgListDiv.current.clientHeight >= msgListDiv.current.scrollHeight) {
            return;
        }
        if (projectStore.curProject?.chat_store.curRefMsgId != "") {
            return;
        }
        if (msgListDiv.current.scrollTop < 10) {
            projectStore.curProject?.chat_store.loadMoreMsg(LIST_MSG_BEFORE);
        } else if ((msgListDiv.current.scrollHeight - msgListDiv.current.clientHeight - msgListDiv.current.scrollTop) < 10) {
            projectStore.curProject?.chat_store.loadMoreMsg(LIST_MSG_AFTER);
        }
    };

    const clearUnreadCount = async () => {
        await request(clear_unread({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            chat_group_id: projectStore.curProject?.chat_store.curGroupId ?? "",
        }));
        await projectStore.curProject?.chat_store.onUpdateGroup(projectStore.curProject?.chat_store.curGroupId ?? "");
    };

    useEffect(() => {
        if (msgListDiv.current == null) {
            return;
        }
        if (msgListDiv.current.clientHeight >= msgListDiv.current.scrollHeight) {
            return;
        }
        if ((msgListDiv.current.scrollHeight - msgListDiv.current.clientHeight - msgListDiv.current.scrollTop) < 200
            && (projectStore.curProject?.chat_store.hasLastMsg() ?? false) == true) {
            setTimeout(() => {
                const lstMsgId = projectStore.curProject?.chat_store.curGroup?.lastMsg?.chat_msg_id ?? "";
                const el = document.getElementById(lstMsgId);
                if (el != null) {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "nearest",
                    });
                }
            }, 200);
        }
    }, [projectStore.curProject?.chat_store.curGroupMsgList]);

    useEffect(() => {
        if (projectStore.curProject?.chat_store.curRefMsgId != "" && msgListDiv.current != null) {
            setTimeout(() => {
                const el = document.getElementById(projectStore.curProject?.chat_store.curRefMsgId ?? "");
                if (el != null) {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "nearest",
                    });
                }
                projectStore.curProject?.chat_store.resetCurRefMsgId();
            }, 200);
        }
    }, [projectStore.curProject?.chat_store.curRefMsgId]);

    useEffect(() => {
        if (editorRef.current == null) {
            return;
        }
        const timer = setInterval(() => {
            if (editorRef.current != null) {
                const content = editorRef.current.getContent();
                setHasContent(get_content_text(content).trim() != "");
            }
        }, 200);

        return () => {
            clearInterval(timer);
        };
    }, [editorRef]);

    useEffect(() => {
        clearUnreadCount();
    }, [projectStore.curProject?.chat_store.curGroupMsgList]);

    return (
        <Card title={
            <Space>
                <Button type="link" icon={<RollbackOutlined />} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (projectStore.curProject !== undefined) {
                        projectStore.curProject.chat_store.curGroupId = "";
                    }
                }} style={{ minWidth: 0, padding: "0px 0px" }} />
                {projectStore.curProject?.chat_store.curGroup?.groupInfo.title ?? ""}
            </Space>
        }
            headStyle={{ padding: "0px 0px" }} bordered={false}
            bodyStyle={{ height: "calc(100vh - 181px)", padding: "0px 0px", display: "flex", flexDirection: "column" }}
            extra={
                <Popover trigger="hover" placement="bottomLeft" content={
                    <div style={{ width: "300px", padding: "10px 10px" }}>
                        <h1 style={{ fontSize: "18px", fontWeight: 600 }}>在线成员</h1>
                        <List grid={{ gutter: 16 }}
                            dataSource={(projectStore.curProject?.chat_store.curGroup?.memberList ?? []).filter(member => memberStore.getMember(member.member_user_id)?.member.online == true)}
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
                            dataSource={(projectStore.curProject?.chat_store.curGroup?.memberList ?? []).filter(member => memberStore.getMember(member.member_user_id)?.member.online == false)}
                            renderItem={item => (
                                <List.Item key={item.member_user_id}>
                                    <Space>
                                        <UserPhoto logoUri={item.member_logo_uri} style={{ width: "16px", borderRadius: "10px", filter: "grayscale(100%)" }} />
                                        {item.member_display_name}
                                    </Space>
                                </List.Item>
                            )} />
                    </div>
                }>
                    <span style={{ cursor: "default" }}><InfoCircleOutlined />&nbsp;{projectStore.curProject?.chat_store.curGroup?.memberList.length ?? 0}人&nbsp;&nbsp;</span>
                </Popover>
            }>
            <div style={{ flex: 1, overflowY: "auto" }} ref={msgListDiv} onScroll={() => processScroll()}
                onMouseEnter={e => {
                    e.stopPropagation();
                    setHover(true);
                }}
                onMouseLeave={e => {
                    e.stopPropagation();
                    setHover(false);
                }}>
                {(projectStore.curProject?.chat_store.curGroupMsgList ?? []).map(item => (
                    <div id={item.chat_msg_id} key={item.chat_msg_id}>
                        <ChatMsgItem msg={item} />
                    </div>
                ))}
            </div>
            <div style={{ position: "relative" }}>
                <div className="_chatContext">
                    {editor}
                </div>
                <Button style={{ position: "absolute", right: "20px", bottom: "10px" }} type="primary"
                    disabled={!hasContent}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        sendMsg();
                    }}>发送</Button>
            </div>
        </Card>
    );
};

export default observer(ChatMsgList);