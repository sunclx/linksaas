import { useStores } from "@/hooks";
import React, { useEffect, useState } from "react";
import type { PostKeyInfo } from "@/api/group_post";
import { list_recommend_post_key, get_post_key } from "@/api/group_post";
import { request } from "@/utils/request";
import { Space, Table } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import { join_pub } from "@/api/group_member";
import { get as get_group } from "@/api/group";
import { useHistory } from "react-router-dom";
import { APP_GROUP_POST_DETAIL_PATH, APP_GROUP_POST_LIST_PATH } from "@/utils/constant";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";

const PAGE_SIZE = 20;

const RecommendPostList = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [postKeyList, setPostKeyList] = useState<PostKeyInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadPostKeyList = async () => {
        const res = await request(list_recommend_post_key({
            session_id: userStore.sessionId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setPostKeyList(res.post_key_list.sort((a, b) => b.update_time - a.update_time));
    };

    const goToPost = async (groupId: string, postId: string) => {
        await request(join_pub({
            session_id: userStore.sessionId,
            group_id: groupId,
        }));
        const grpRes = await request(get_group({
            session_id: userStore.sessionId,
            group_id: groupId,
        }));
        const postRes = await request(get_post_key({
            session_id: userStore.sessionId,
            group_id: groupId,
            post_id: postId,
        }));
        groupStore.curGroup = grpRes.group;
        groupStore.curPostKey = postRes.post_key;
        history.push(APP_GROUP_POST_DETAIL_PATH);
    };

    const goToGroup = async (groupId: string) => {
        await request(join_pub({
            session_id: userStore.sessionId,
            group_id: groupId,
        }));
        const grpRes = await request(get_group({
            session_id: userStore.sessionId,
            group_id: groupId,
        }));
        groupStore.curGroup = grpRes.group;
        groupStore.curPostKey = null;
        history.push(APP_GROUP_POST_LIST_PATH);
    };

    const columns: ColumnsType<PostKeyInfo> = [
        {
            title: "标题",
            render: (_, row: PostKeyInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToPost(row.group_id, row.post_id);
                }}>{row.title}</a>
            ),
        },
        {
            title: "兴趣组",
            width: 200,
            render: (_, row: PostKeyInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToGroup(row.group_id);
                }}>{row.group_name}</a>
            ),
        },
        {
            title: "评论数",
            width: 60,
            dataIndex: "comment_count",
        },
        {
            title: "发布人",
            width: 100,
            render: (_, row: PostKeyInfo) => (
                <Space style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100px" }}>
                    <UserPhoto logoUri={row.create_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                    <span>{row.create_display_name}</span>
                </Space>
            ),
        },
        {
            title: "发布时间",
            width: 150,
            render: (_, row: PostKeyInfo) => moment(row.create_time).format("YYYY-MM-DD HH:mm"),
        }
    ];

    useEffect(() => {
        loadPostKeyList();
    }, [curPage]);

    return (
        <Table rowKey="post_id" dataSource={postKeyList} columns={columns}
            pagination={{ pageSize: PAGE_SIZE, total: totalCount, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
    );
};

export default RecommendPostList;