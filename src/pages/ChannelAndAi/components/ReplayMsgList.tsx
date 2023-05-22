import { useStores } from "@/hooks";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from "./ReplayMsgList.module.less";
import { Card, Input, List, message } from "antd";
import Button from "@/components/Button";
import type { ReplyMsg } from "@/api/project_channel";
import { list_reply_msg, add_reply_msg, remove_reply_msg } from "@/api/project_channel";
import { request } from "@/utils/request";
import moment from "moment";
import UserPhoto from "@/components/Portrait/UserPhoto";

const PAGE_SIZE = 10;

const ReplayMsgList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const channelStore = useStores('channelStore');
    const chatMsgStore = useStores('chatMsgStore');

    const [replyContent, setReplyContent] = useState("");
    const [replyMsgList, setReplyMsgList] = useState<ReplyMsg[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [canReply, setCanReply] = useState(false);

    const loadReplyMsgList = async () => {
        const res = await request(list_reply_msg({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            channel_id: channelStore.curChannelId,
            msg_id: chatMsgStore.replayTargetMsgId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setReplyMsgList(res.reply_msg_list);
    };

    const addReplyMsg = async () => {
        if (replyContent.trim() == "") {
            return;
        }
        await request(add_reply_msg({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            channel_id: channelStore.curChannelId,
            msg_id: chatMsgStore.replayTargetMsgId,
            content: replyContent,
        }));
        setReplyContent("");
        if (curPage != 0) {
            setCurPage(0);
        } else {
            await loadReplyMsgList();
        }
    };

    const checkCanReply = () => {
        if ((projectStore.curProject?.setting.allow_reply_in_days ?? 0) == 0) {
            setCanReply(true);
            return;
        }
        const targetMsg = chatMsgStore.msgList.find(msg => msg.msg.msg_id == chatMsgStore.replayTargetMsgId);
        if (targetMsg == undefined) {
            setCanReply(false);
            return;
        }
        if ((moment().valueOf() - targetMsg.msg.send_time) > (projectStore.curProject?.setting.allow_reply_in_days ?? 0) * 24 * 3600 * 1000) {
            setCanReply(false);
            return;
        } else {
            setCanReply(true);
            return;
        }
    };

    const removeReplyMsg = async (replayMsgId: string) => {
        await request(remove_reply_msg({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            channel_id: channelStore.curChannelId,
            msg_id: chatMsgStore.replayTargetMsgId,
            reply_msg_id: replayMsgId,
        }));
        message.info("删除成功");
        loadReplyMsgList();
    };

    useEffect(() => {
        if (chatMsgStore.replayTargetMsgId != "") {
            loadReplyMsgList();
        }
        checkCanReply();
    }, [chatMsgStore.replayTargetMsgId, curPage]);

    useEffect(() => {
        if (chatMsgStore.replayTargetMsgId != "" && curPage == 0) {
            loadReplyMsgList();
        }
    }, [chatMsgStore.replayMsgCount]);

    return (
        <div className={s.wrap} style={{ height: chatMsgStore.replayTargetMsgId != "" ? "calc(100vh - 202px)" : "calc(100vh - 170px)" }}>
            {canReply == true && (
                <>
                    <Input.TextArea draggable={false} autoSize={{ minRows: 2 }} placeholder="请输入回复内容" value={replyContent} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setReplyContent(e.target.value);
                    }} />
                    <div className={s.btns}>
                        <Button style={{ minWidth: "0px" }} disabled={replyContent.trim() == ""} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            addReplyMsg();
                        }}>发送</Button>
                    </div>
                </>
            )}

            <h3 style={{ fontSize: "20px", marginTop: "10px" }}>会话列表</h3>
            <List rowKey="reply_msg_id" dataSource={replyMsgList} renderItem={replyMsg => (
                <Card style={{ width: "100%", marginBottom: "10px" }}
                    title={<div>
                        <UserPhoto logoUri={replyMsg.sender_logo_uri} style={{ width: "20px", borderRadius: "10px", marginRight: "10px" }} />
                        {replyMsg.sender_display_name}
                        <div style={{ paddingLeft: "30px" }}>{moment(replyMsg.time_stamp).format("YYYY-MM-DD HH:mm")}</div>
                    </div>}>
                    {replyMsg.content}
                    {(projectStore.isAdmin || replyMsg.sender_user_id == userStore.userInfo.userId) && (
                        <div className={s.btns}>
                            <Button type="link" danger style={{ padding: "0px 0px", minWidth: "0px" }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeReplyMsg(replyMsg.reply_msg_id);
                            }}>删除</Button>
                        </div>
                    )}
                </Card>
            )} pagination={totalCount == 0 ? false : { current: curPage + 1, total: totalCount, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1) }} />
        </div>
    );
};

export default observer(ReplayMsgList);