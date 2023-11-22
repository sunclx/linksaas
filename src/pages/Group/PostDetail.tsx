import React, { useEffect, useState } from "react";
import s from "./PostEdit.module.less";
import { Card, Form, List, Modal, Popover, Select, Space } from "antd";
import { useHistory } from "react-router-dom";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import PostTocPanel from "./components/PostDocPanel";
import { ReadOnlyEditor } from "@/components/Editor";
import Button from "@/components/Button";
import { MoreOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import { APP_GROUP_POST_EDIT_PATH } from "@/utils/constant";
import EditCommentModal from "./components/EditCommentModal";
import { get_post_content, list_comment, get_comment, POST_AUDIT_NONE, POST_AUDIT_APPLY, POST_AUDIT_REFUSE, POST_AUDIT_AGREE, apply_recommend, cancel_apply_recommend, get_post_key } from "@/api/group_post";
import type { CommentInfo, POST_AUDIT_STATE } from "@/api/group_post";
import PostComment from "./components/PostComment";

const PAGE_SIZE = 10;

const PostDetail = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');
    const editStore = useStores('editorStore');

    const [content, setContent] = useState<string | null>(null);
    const [showAddComment, setShowAddComment] = useState(false);

    const [commentList, setCommentList] = useState<CommentInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showApplyModal, setShowApplyModal] = useState(false);

    const loadPostContent = async () => {
        const res = await request(get_post_content({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
        }));
        setContent(res.content);
    };

    const loadCommentList = async () => {
        const res = await request(list_comment({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setCommentList(res.comment_list);
    };

    const loadComment = async (commentId: string) => {
        const res = await request(get_comment({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
            comment_id: commentId,
        }));
        const tmpList = commentList.slice();
        const index = tmpList.findIndex(item => item.comment_id == commentId);
        if (index != -1) {
            tmpList[index] = res.comment;
            setCommentList(tmpList);
        }
    };

    const loadPostKey = async () => {
        const res = await request(get_post_key({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
        }));
        groupStore.curPostKey = res.post_key;
    };

    const applyRecommend = async () => {
        await request(apply_recommend({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
        }));
        await loadPostKey();
        setShowApplyModal(false);
    };

    const cancelApplyRecommend = async () => {
        await request(cancel_apply_recommend({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
        }));
        await loadPostKey();
        setShowApplyModal(false);
    };

    const getStateColor = (state: POST_AUDIT_STATE) => {
        if (state == POST_AUDIT_AGREE) {
            return "green";
        } else if (state == POST_AUDIT_REFUSE) {
            return "red";
        }
        return "black";
    }

    useEffect(() => {
        loadPostContent();
    }, []);

    useEffect(() => {
        loadCommentList();
    }, [curPage]);

    return (
        <Card bordered={false}
            title={<span style={{ fontSize: "18px", fontWeight: 600 }}>{groupStore.curPostKey?.title ?? ""}</span>}
            extra={
                <Space>
                    {groupStore.curGroup?.pub_group && groupStore.curGroup?.owner_user_id == userStore.userInfo.userId && (
                        <Button type="text" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowApplyModal(true);
                        }}>
                            <span style={{ color: getStateColor(groupStore.curPostKey?.audit_state ?? POST_AUDIT_NONE) }}>
                                {groupStore.curPostKey?.audit_state == POST_AUDIT_NONE && "未申请推荐"}
                                {groupStore.curPostKey?.audit_state == POST_AUDIT_APPLY && "已申请推荐"}
                                {groupStore.curPostKey?.audit_state == POST_AUDIT_REFUSE && "拒绝进入推荐"}
                                {groupStore.curPostKey?.audit_state == POST_AUDIT_AGREE && "已进入推荐"}
                            </span>
                        </Button>
                    )}
                    {groupStore.curPostKey?.user_perm.can_update_post && (
                        <Button type="default" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            history.push(APP_GROUP_POST_EDIT_PATH);
                        }}>修改</Button>
                    )}
                    <Popover>
                        <MoreOutlined />
                    </Popover>
                </Space>
            }>
            <div className={s.post_wrap}>
                <div className={s.post}>
                    {content !== null && (
                        <ReadOnlyEditor content={content} tocCallback={result => editStore.tocList = result} />
                    )}
                    <Form style={{ marginTop: "10px" }}>
                        <Form.Item label={<span style={{ fontSize: "18px", fontWeight: 600 }}>标签列表</span>}>
                            <Select mode="tags" bordered={false} open={false} style={{ borderBottom: "1px solid #e4e4e8", fontSize: "18px", fontWeight: 600, color: "orange" }}
                                value={groupStore.curPostKey?.tag_list ?? []} disabled />
                        </Form.Item>
                    </Form>
                    <Card bordered={false} title={<span style={{ fontSize: "18px", fontWeight: 600 }}>评论列表</span>} headStyle={{ paddingLeft: "0px" }}
                        extra={
                            <>
                                {groupStore.curPostKey?.user_perm.can_add_comment && (
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowAddComment(true);
                                    }}>增加评论</Button>
                                )}
                            </>
                        }>
                        <List rowKey="comment_id" dataSource={commentList} renderItem={item => (
                            <List.Item>
                                <PostComment commentInfo={item} onRemove={() => loadCommentList()} onChange={() => {
                                    loadComment(item.comment_id);
                                }} />
                            </List.Item>
                        )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
                    </Card>
                </div>
                {editStore.tocList.length > 0 && <PostTocPanel />}
            </div>
            {showAddComment == true && (
                <EditCommentModal onCancel={() => setShowAddComment(false)}
                    onOk={() => {
                        if (curPage != 0) {
                            setCurPage(0);
                        } else {
                            loadCommentList();
                        }
                        setShowAddComment(false);
                    }} />
            )}
            {showApplyModal == true && (
                <Modal open title={groupStore.curPostKey?.audit_state == POST_AUDIT_NONE ? "申请进入推荐" : "撤回申请"}
                    okText={groupStore.curPostKey?.audit_state == POST_AUDIT_NONE ? "申请" : "撤回"}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowApplyModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (groupStore.curPostKey?.audit_state == POST_AUDIT_NONE) {
                            applyRecommend();
                        } else {
                            cancelApplyRecommend();
                        }
                    }}>
                    {groupStore.curPostKey?.audit_state == POST_AUDIT_NONE && "是否申请进入推荐列表"}
                    {groupStore.curPostKey?.audit_state != POST_AUDIT_NONE && "是否撤回推荐申请"}
                </Modal>
            )}
        </Card>
    )
};

export default observer(PostDetail);