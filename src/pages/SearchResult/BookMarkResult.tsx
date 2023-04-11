import { search_project_book_mark, type BookMarkResultItem } from "@/api/search";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import type { ColumnsType } from 'antd/lib/table';
import { get_session } from "@/api/user";
import { request } from "@/utils/request";
import { get_book_mark } from "@/api/project_bookmark";
import { open as open_url } from '@tauri-apps/api/shell';

const PAGE_SIZE = 10;

interface BookMarkResultProps {
    projectId: string | null;
    keyword: string | null;
    cateId: string | null;
    fromTime: number | null;
    toTime: number | null;
}

const BookMarkResult: React.FC<BookMarkResultProps> = (props) => {
    const [resultItemList, setResultItemList] = useState<BookMarkResultItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const doSearch = async () => {
        const sessionId = await get_session();
        const res = await request(search_project_book_mark({
            session_id: sessionId,
            filter_by_project_id: props.projectId != null && props.projectId != "",
            project_id: props.projectId ?? "",
            keyword: props.keyword ?? "",
            filter_by_cate_id: props.cateId != null,
            cate_id: props.cateId ?? "",
            filter_by_time_range: props.fromTime != null && props.toTime != null,
            from_time_stamp: props.fromTime ?? 0,
            to_time_stamp: props.toTime ?? 0,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        if (res) {
            setResultItemList(res.item_list);
            setTotalCount(res.total_count);
        }
    };

    const goToLink = async (projectId: string, bookMarkId: string) => {
        const sessionId = await get_session();
        const res = await request(get_book_mark({
            session_id: sessionId,
            project_id: projectId,
            book_mark_id: bookMarkId,
        }));
        await open_url(res.book_mark_info.url);
    };

    const columns: ColumnsType<BookMarkResultItem> = [
        {
            title: "标题",
            dataIndex: "title",
            width: 200,
            render: (title) => (
                <div style={{ maxWidth: "200px" }}
                    dangerouslySetInnerHTML={{ __html: title }}
                />),
        },
        {
            title: "内容(文本部分)",
            dataIndex: "content",
            width: 500,
            render: (content) => (
                <div style={{ maxWidth: "500px" }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />),
        },
        {
            title: "",
            width: 150,
            render: (_, record: BookMarkResultItem) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToLink(record.project_id, record.book_mark_id);
                }}>查看地址</a>
            ),
        }
    ];

    useEffect(() => {
        doSearch();
    }, [curPage]);

    return (<div>
        <Table rowKey="book_mark_id" columns={columns} dataSource={resultItemList} pagination={false} />
        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1}
            onChange={page => setCurPage(page - 1)} />
    </div>);
}

export default BookMarkResult;