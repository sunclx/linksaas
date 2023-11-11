import React, { useEffect, useState } from "react";
import s from "./PostEdit.module.less";
import { Card, Form, List, Popover, Select, Space } from "antd";
import { useHistory } from "react-router-dom";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import classNames from "classnames";
import type { TocInfo } from '@/components/Editor/extensions/index';
import PostTocPanel from "./components/PostDocPanel";
import { ReadOnlyEditor } from "@/components/Editor";
import Button from "@/components/Button";
import { MoreOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import { APP_GROUP_POST_EDIT_PATH } from "@/utils/constant";
import EditCommentModal from "./components/EditCommentModal";
import { get_post_content, list_comment, get_comment } from "@/api/group_post";
import type { CommentInfo } from "@/api/group_post";
import PostComment from "./components/PostComment";

const PAGE_SIZE = 10;

const PostDetail = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [content, setContent] = useState<string | null>(null);
    const [tocList, setTocList] = useState<TocInfo[]>([]);
    const [showAddComment, setShowAddComment] = useState(false);

    const [commentList, setCommentList] = useState<CommentInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

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
                <div className={classNames(s.post, "_postContext")}>
                    {content !== null && (
                        <ReadOnlyEditor content={content} tocCallback={result => setTocList(result)} />
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
                {tocList.length > 0 && (
                    <PostTocPanel tocList={tocList} />
                )}
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
        </Card>
    )
};

export default observer(PostDetail);