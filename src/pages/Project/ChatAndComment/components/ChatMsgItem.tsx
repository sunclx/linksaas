import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { ChatMsgInfo } from "@/api/project_chat";
import { update_msg_content } from "@/api/project_chat";
import { useStores } from "@/hooks";
import { ReadOnlyEditor, get_content_text, useCommonEditor } from "@/components/Editor";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";
import { Button, Card, Modal, Popover, Space, message } from "antd";
import { BulbTwoTone, EditOutlined } from "@ant-design/icons";
import { LinkIdeaPageInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";
import { request } from "@/utils/request";

interface EditMsgModalProps {
    msg: ChatMsgInfo;
    onClose: () => void;
}

const EditMsgModal = observer((props: EditMsgModalProps) => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const [hasContent, setHasContent] = useState(false);
    const [hasChange, setHasChange] = useState(false);

    const { editor, editorRef } = useCommonEditor({
        content: props.msg.content,
        fsId: "",
        enableLink: true,
        ownerType: FILE_OWNER_TYPE_NONE,
        ownerId: "",
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
        eventsOption: {
            keydown: () => setHasChange(true),
        },
    });

    const updateMsg = async () => {
        if (editorRef.current == null) {
            return;
        }
        const content = editorRef.current.getContent();
        await request(update_msg_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            chat_group_id: props.msg.chat_group_id,
            chat_msg_id: props.msg.chat_msg_id,
            content: JSON.stringify(content),
        }));
        props.onClose();
        await projectStore.curProject?.chat_store.onUpdateMsg(props.msg.chat_group_id, props.msg.chat_msg_id);
        message.info("修改成功");
    };

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

    return (
        <Modal open title="修改沟通内容" width="300px"
            okText="修改" okButtonProps={{ disabled: hasContent == false || hasChange == false }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateMsg();
            }}>
            <div className="_chatContext">
                {editor}
            </div>
        </Modal>
    );
});

export interface ChatMsgItemProps {
    msg: ChatMsgInfo;
}

const ChatMsgItem = (props: ChatMsgItemProps) => {
    const history = useHistory();

    const appStore = useStores("appStore");
    const userStore = useStores("userStore");
    const ideaStore = useStores("ideaStore");
    const projectStore = useStores("projectStore");
    const linkAuxStore = useStores('linkAuxStore');

    const [ideaKwList, setIdeaKwList] = useState<string[]>([]);
    const [hover, setHover] = useState(false);
    const [curTime, setCurTime] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <Card title={
            <Space size="small">
                <UserPhoto logoUri={props.msg.send_logo_uri} style={{ width: "20px", borderRadius: "10px", margin: "0px 0px", }} />
                {props.msg.send_display_name}
                {moment(props.msg.send_time).format("YYYY-MM-DD HH:mm")}
            </Space>
        } style={{ width: "100%" }} bordered={false} headStyle={{ border: "none", padding: "0px 10px" }}
            bodyStyle={{ padding: "0px 10px" }}
            extra={
                <>
                    {ideaKwList.length > 0 && (
                        <Popover trigger="hover" placement="left" content={
                            <div style={{ padding: "10px 10px", width: "100px", display: "flex", flexWrap: "wrap" }}>
                                {ideaKwList.map(item => (
                                    <a key={item} style={{ marginRight: "10px" }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", [item]), history);
                                        }}>{item}</a>
                                ))}
                            </div>
                        }>
                            <BulbTwoTone style={{ fontSize: "16px", marginRight: "10px" }} twoToneColor={["orange", "orange"]} />
                        </Popover>
                    )}
                </>
            }>
            <div style={{ marginLeft: "26px", marginRight: "0px", padding: "10px", paddingRight: "20px", backgroundColor: "#f8f8f8", borderRadius: "4px", position: "relative" }}
                onMouseEnter={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (appStore.clientCfg != undefined) {
                        setCurTime(moment().valueOf() - appStore.clientCfg.client_time + appStore.clientCfg.server_time);
                    }
                    setHover(true);
                }}
                onMouseLeave={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setHover(false);
                }}>
                {hover && props.msg.send_user_id == userStore.userInfo.userId && (
                    <Button type="text" icon={<EditOutlined />} style={{ position: "absolute", right: "0px", top: "0px" }} title="修改内容"
                        disabled={props.msg.change_dead_line_time < curTime}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowEditModal(true);
                        }} />
                )}
                <ReadOnlyEditor content={props.msg.content} keywordList={ideaStore.keywordList} keywordCallback={kwList => setIdeaKwList(kwList)} />
                {props.msg.has_changed && (
                    <div style={{ position: "absolute", right: "4px", bottom: "4px", color: "blue" }}>(内容经过修改)</div>
                )}
            </div>
            {showEditModal == true && (
                <EditMsgModal msg={props.msg} onClose={() => setShowEditModal(false)} />
            )}
        </Card>
    );
};

export default observer(ChatMsgItem);