import React, { useEffect, useState } from "react";
import type { CommentInfo } from "@/api/group_post";
import { add_comment, update_comment } from "@/api/group_post";
import { Modal, message } from "antd";
import { observer } from 'mobx-react';
import { is_empty_doc, useCommonEditor } from "@/components/Editor";
import { useStores } from "@/hooks";
import { FILE_OWNER_TYPE_GROUP_POST } from "@/api/fs";
import { request } from "@/utils/request";

export interface EditCommentModalProps {
    commentInfo?: CommentInfo;
    onCancel: () => void;
    onOk: () => void;
}

const EditCommentModal = (props: EditCommentModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const groupStore = useStores('groupStore');

    const [loaded, setLoaded] = useState(false);

    const { editor, editorRef } = useCommonEditor({
        content: '',
        fsId: groupStore.curGroup?.fs_id ?? "",
        ownerType: FILE_OWNER_TYPE_GROUP_POST,
        ownerId: groupStore.curPostKey?.post_id ?? "",
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: true,
        widgetInToolbar: false,
        showReminder: false,
    });

    const addComment = async () => {
        const content = editorRef.current?.getContent() ?? { type: "doc" };
        if (is_empty_doc(content)) {
            message.error("评论内容不能为空");
            return;
        }
        await request(add_comment({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
            content: JSON.stringify(content),
        }));
        message.info("增加评论成功");
        props.onOk();
    };

    const updateComment = async () => {
        if (props.commentInfo == undefined) {
            return;
        }
        const content = editorRef.current?.getContent() ?? { type: "doc" };
        if (is_empty_doc(content)) {
            message.error("评论内容不能为空");
            return;
        }
        await request(update_comment({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
            comment_id: props.commentInfo.comment_id,
            content: JSON.stringify(content),
        }));
        message.info("修改评论成功");
        props.onOk();
    };

    useEffect(() => {
        if (props.commentInfo !== undefined && editorRef.current !== null && loaded == false) {
            editorRef.current.setContent(props.commentInfo.content);
            setLoaded(true);
        }
    }, [props.commentInfo, editorRef.current]);

    return (
        <Modal open title={props.commentInfo == undefined ? "增加评论" : "修改评论"}
            okText={props.commentInfo == undefined ? "增加" : "修改"}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.commentInfo == undefined) {
                    addComment();
                } else {
                    updateComment();
                }
            }}>
            <div className="_projectEditContext">
                {editor}
            </div>
        </Modal>
    );
};

export default observer(EditCommentModal);