import React, { useEffect, useState } from "react";
import type { COMMENT_TARGET_TYPE, Comment } from "@/api/project_comment";
import { update_comment, remove_comment } from "@/api/project_comment";
import { Button, Card, Popover, Space, message } from "antd";
import UserPhoto from "../Portrait/UserPhoto";
import moment from "moment";
import { ReadOnlyEditor, is_empty_doc, useCommonEditor } from "../Editor";
import { MoreOutlined } from "@ant-design/icons";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";

export interface CommentItemProps {
    projectId: string;
    targetType: COMMENT_TARGET_TYPE;
    targetId: string;
    comment: Comment;
    myUserId: string;
    myAdmin: boolean;
    onUpdate: () => void;
    onRemove: () => void;
}

const CommentItem = (props: CommentItemProps) => {
    const [inEdit, setInEdit] = useState(false);

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

    const updateComment = async () => {
        const content = editorRef.current?.getContent() ?? { type: "doc" };
        if (is_empty_doc(content)) {
            message.warn("评论内容为空");
            return;
        }
        const sessionId = await get_session();
        await request(update_comment({
            session_id: sessionId,
            project_id: props.projectId,
            target_type: props.targetType,
            target_id: props.targetId,
            comment_id: props.comment.comment_id,
            content: JSON.stringify(content),
        }));
        props.onUpdate();
    };

    const removeComment = async () => {
        const sessionId = await get_session();
        await request(remove_comment({
            session_id: sessionId,
            project_id: props.projectId,
            target_type: props.targetType,
            target_id: props.targetId,
            comment_id: props.comment.comment_id,
        }));
        props.onRemove();
    };

    useEffect(() => {
        if (inEdit) {
            setInEdit(false);
        }
    }, [props.comment]);

    useEffect(() => {
        if (!inEdit) {
            return;
        }
        const timer = setInterval(() => {
            if (editorRef != null) {
                clearInterval(timer);
                editorRef.current?.setContent(props.comment.content);
            }
        }, 50);
        return () => {
            clearInterval(timer);
        };
    }, [inEdit]);

    return (
        <Card style={{ width: "100%" }} bordered={false}
            title={
                <Space>
                    <UserPhoto logoUri={props.comment.send_logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                    <span>{props.comment.send_display_name}</span>
                    <span>{moment(props.comment.send_time).format("YYYY-MM-DD HH:mm:ss")}</span>
                </Space>
            }
            extra={
                <Space>
                    {props.myUserId == props.comment.send_user_id && (
                        <>
                            {inEdit == false && (moment().valueOf() - props.comment.send_time) < (3600 * 1000) && (
                                <Button onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setInEdit(true);
                                }}>修改</Button>
                            )}
                            {inEdit == true && (
                                <>
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        editorRef.current?.setContent("");
                                        setInEdit(false);
                                    }}>取消</Button>
                                    <Button type="primary" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        updateComment();
                                    }}>保存</Button>
                                </>
                            )}
                        </>
                    )}
                    {(props.myUserId == props.comment.send_user_id || props.myAdmin) && (
                        <Popover trigger="click" placement="bottom" content={
                            <div style={{ padding: "10px 10px" }}>
                                <Button type="link" danger onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeComment();
                                }}>删除评论</Button>
                            </div>
                        }>
                            <MoreOutlined />
                        </Popover>
                    )}
                </Space>
            }>
            {inEdit == false && (
                <ReadOnlyEditor content={props.comment.content} />
            )}
            {inEdit == true && (
                <div className="_commentContext">
                    {editor}
                </div>
            )}
        </Card>
    );
};

export default CommentItem;