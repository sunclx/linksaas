import React, { useState } from "react";
import { Button, Card, Modal, Popover, Space } from "antd";
import { observer } from 'mobx-react';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";
import { MoreOutlined } from "@ant-design/icons";
import { ReadOnlyEditor } from "@/components/Editor";
import EditCommentModal from "./EditCommentModal";
import type { CommentInfo } from "@/api/group_post";
import { remove_comment } from "@/api/group_post";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";

export interface PostCommentProps {
    commentInfo: CommentInfo;
    onChange: () => void;
    onRemove: () => void;
}


const PostComment = (props: PostCommentProps) => {
    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const removeComment = async () => {
        await request(remove_comment({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
            comment_id: props.commentInfo.comment_id,
        }));
        props.onRemove();
        setShowRemoveModal(false);
    };

    return (
        <Card style={{ width: "100%" }} bordered={false}
            title={
                <Space>
                    <UserPhoto logoUri={props.commentInfo.create_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                    <span>{props.commentInfo.create_display_name}</span>
                    <span>{moment(props.commentInfo.create_time).format("YYYY-MM-DD HH:mm")}</span>
                </Space>
            } extra={
                <Space>
                    {props.commentInfo.update_time != props.commentInfo.create_time && (
                        <span>{moment(props.commentInfo.update_time).format("YYYY-MM-DD HH:mm")}修改</span>
                    )}
                    <Popover trigger="click" placement="bottom" content={
                        <Space direction="vertical" style={{ padding: "10px 10px" }}>
                            <Button type="link" disabled={!(props.commentInfo.user_perm.can_update_comment)} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowUpdateModal(true);
                            }}>修改</Button>
                            <Button type="link" danger disabled={!(props.commentInfo.user_perm.can_remove_comment)} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRemoveModal(true);
                            }}>删除</Button>
                        </Space>
                    }>
                        <MoreOutlined />
                    </Popover>
                </Space>
            }>
            <ReadOnlyEditor content={props.commentInfo.content} />
            {showUpdateModal == true && (
                <EditCommentModal commentInfo={props.commentInfo} onCancel={() => setShowUpdateModal(false)} onOk={() => {
                    props.onChange();
                    setShowUpdateModal(false);
                }} />
            )}
            {showRemoveModal == true && (
                <Modal open title="删除评论"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeComment();
                    }}>
                    是否删除评论?
                </Modal>
            )}
        </Card>
    );
}

export default observer(PostComment);