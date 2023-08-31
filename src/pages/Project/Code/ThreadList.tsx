import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import { useStores } from "@/hooks";
import type { ThreadInfo } from "@/api/project_code";
import { list_thread } from "@/api/project_code";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import { Button, List, Table } from "antd";
import moment from "moment";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { useHistory } from "react-router-dom";
import { LinkCodeCommentInfo } from "@/stores/linkAux";

const PAGE_SIZE = 10;

const ThreadList = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores("projectStore");
    const linkAuxStore = useStores("linkAuxStore");

    const [threadInfoLiset, setThreadInfoLiset] = useState<ThreadInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const listThread = async () => {
        const res = await request(list_thread({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setThreadInfoLiset(res.thread_list);
        setTotalCount(res.total_count);
    };

    const columns: ColumnsType<ThreadInfo> = [
        {
            title: "会话ID",
            width: 120,
            render: (_, row: ThreadInfo) => (
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkCodeCommentInfo("", projectStore.curProjectId, row.thread_id, ""), history);
                }}>{row.thread_id}</Button>
            ),
        },
        {
            title: "创建时间",
            width: 120,
            render: (_, row: ThreadInfo) => moment(row.create_time).format("YYYY-MM-DD"),
        },
        {
            title: "更新时间",
            width: 120,
            render: (_, row: ThreadInfo) => moment(row.update_time).format("YYYY-MM-DD"),
        },
        {
            title: "评论数量",
            width: 80,
            dataIndex: "comment_count",
        },
        {
            title: "评论成员",
            render: (_, row: ThreadInfo) => (
                <List rowKey="comment_user_id" dataSource={row.comment_user_list} pagination={false}
                    grid={{ gutter: 4 }} renderItem={commentUser => (
                        <List.Item title={commentUser.comment_display_name}>
                            <UserPhoto logoUri={commentUser.comment_logo_uri} style={{ width: "24px", borderRadius: "12px" }} />
                        </List.Item>
                    )} />
            ),
        }
    ];

    useEffect(() => {
        listThread();
    }, [projectStore.curProjectId, curPage]);

    return (
        <CardWrap title="代码评论">
            <Table rowKey="thread_id" columns={columns} dataSource={threadInfoLiset}
                style={{ margin: "0px 20px", height: "calc(100vh - 190px)", overflowY: "scroll" }}
                pagination={{
                    total: totalCount,
                    current: curPage + 1,
                    pageSize: PAGE_SIZE,
                    onChange: page => setCurPage(page - 1),
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }} />
        </CardWrap>
    );
};

export default observer(ThreadList);