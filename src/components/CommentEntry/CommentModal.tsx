import React, { useEffect, useState } from "react";
import type { COMMENT_TARGET_TYPE, Comment } from "@/api/project_comment";
import { add_comment, list_comment } from "@/api/project_comment";
import { Button, List, Modal, message } from "antd";
import { is_empty_doc, useCommonEditor } from "../Editor";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import CommentItem from "./CommentItem";
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type';

export interface CommentModalProps {
    projectId: string;
    targetType: COMMENT_TARGET_TYPE;
    targetId: string;
    myUserId: string;
    myAdmin: boolean;
    onCancel: () => void;
}

const PAGE_SIZE = 10;

const CommentModal = (props: CommentModalProps) => {

    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [dataVersion, setDataVersion] = useState(0);

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: "",
        ownerType: FILE_OWNER_TYPE_NONE,
        ownerId: props.projectId,
        projectId: props.projectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
    });

    const loadCommentList = async () => {
        const sessionId = await get_session();
        const res = await request(list_comment({
            session_id: sessionId,
            project_id: props.projectId,
            target_type: props.targetType,
            target_id: props.targetId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setCommentList(res.comment_list);
    };

    const addComment = async () => {
        const content = editorRef.current?.getContent() ?? { type: "doc" };
        if (is_empty_doc(content)) {
            message.warn("评论内容为空");
            return;
        }
        const sessionId = await get_session();
        await request(add_comment({
            session_id: sessionId,
            project_id: props.projectId,
            target_type: props.targetType,
            target_id: props.targetId,
            content: JSON.stringify(content),
        }));
        editorRef.current?.setContent("");
        //刷新评论
        if (curPage != 0) {
            setCurPage(0);
        } else {
            loadCommentList();
        }
    };

    useEffect(() => {
        loadCommentList();
    }, [curPage, props.targetId, dataVersion]);

    useEffect(() => {
        const unListenFn = listen<NoticeType.AllNotice>("notice", ev => {
            const notice = ev.payload;
            if (notice.CommentNotice?.AddCommentNotice?.target_id == props.targetId && notice.CommentNotice?.AddCommentNotice?.target_type == props.targetType) {
                setCurPage(0);
                setDataVersion(oldValue => oldValue + 1);
            }
            if (notice.CommentNotice?.UpdateCommentNotice?.target_id == props.targetId && notice.CommentNotice?.UpdateCommentNotice?.target_type == props.targetType) {
                setDataVersion(oldValue => oldValue + 1);
            }
            if (notice.CommentNotice?.RemoveCommentNotice?.target_id == props.targetId && notice.CommentNotice?.RemoveCommentNotice?.target_type == props.targetType) {
                setDataVersion(oldValue => oldValue + 1);
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, [props.targetId]);

    return (
        <Modal open title="评论" footer={null}
            width={800} bodyStyle={{ maxHeight: "calc(100vh - 250px)", overflowY: "scroll" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <div className="_commentContext">
                {editor}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" style={{ marginTop: "10px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    addComment();
                }}>新增评论</Button>
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, borderBottom: "1px solid #e4e4e8", paddingBottom: "8px", margin: "0px 0px" }}>评论列表</h1>
            <List rowKey="comment_id" dataSource={commentList}
                renderItem={item => (
                    <List.Item>
                        <CommentItem projectId={props.projectId} targetType={props.targetType}
                            targetId={props.targetId} comment={item}
                            myUserId={props.myUserId} myAdmin={props.myAdmin}
                            onUpdate={() => {
                                loadCommentList();
                            }}
                            onRemove={() => {
                                loadCommentList();
                            }} />
                    </List.Item>
                )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
        </Modal>
    );
};

export default CommentModal;