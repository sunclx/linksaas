import { Button, Card, List, Modal, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import type { AppInfo, AppComment } from "@/api/docker_template";
import { list_comment } from "@/api/docker_template";
import { remove_comment } from "@/api/docker_template_admin";
import { request } from "@/utils/request";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';

const PAGE_SIZE = 10;

export interface CommentListModalProps {
    appInfo: AppInfo;
    onClose: () => void;
}

const CommentListModal = (props: CommentListModalProps) => {

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);

    const [commentList, setCommentList] = useState<AppComment[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadCommentList = async () => {
        const res = await request(list_comment({
            app_id: props.appInfo.app_id,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setCommentList(res.comment_list);
    };

    const removeComment = async (commentId: string) => {
        const sessionId = await get_admin_session()
        await request(remove_comment({
            admin_session_id: sessionId,
            app_id: props.appInfo.app_id,
            comment_id: commentId,
        }));
        message.info("删除评论成功");
        await loadCommentList();
    };

    useEffect(() => {
        loadCommentList();
    }, [curPage]);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Modal open title={`${props.appInfo.name} 评论列表`}
            bodyStyle={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <List rowKey="comment_id" dataSource={commentList}
                pagination={{ current: curPage + 1, total: totalCount, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
                renderItem={item => (
                    <List.Item>
                        <Card style={{ width: "100%" }} bordered={false} title={
                            <Space>
                                <UserPhoto logoUri={item.create_logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                                <span>{item.create_display_name}</span>
                                <span>{moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </Space>
                        } extra={
                            <Button type="link" danger disabled={!(permInfo?.app_store_perm.remove_comment ?? false)}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeComment(item.comment_id);
                                }}>删除</Button>
                        }>
                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{item.comment}</pre>
                        </Card>
                    </List.Item>
                )} />
        </Modal>
    );
};

export default CommentListModal;