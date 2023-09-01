import React, { useEffect, useState } from "react";
import { Card, Form, List, Select } from "antd";
import type { CateInfo, BookInfo } from "@/api/bookstore";
import { list_cate, list_book } from "@/api/bookstore";
import { request } from "@/utils/request";
import logoPng from '@/assets/allIcon/logo.png';
import { useStores } from "@/hooks";
import BookInfoModal from "./BookInfoModal";
import AsyncImage from "@/components/AsyncImage";

const PAGE_SIZE = 12;

const BookStorePanel = () => {
    const appStore = useStores('appStore');

    const [cateId, setCateId] = useState("");
    const [cateList, setCateList] = useState<CateInfo[]>([]);

    const [bookList, setBookList] = useState<BookInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showDetailBookInfo, setShowDetailBookInfo] = useState<BookInfo | null>(null);

    const loadCateList = async () => {
        const res = await request(list_cate({}));
        setCateList(res.cate_list);
    };

    const loadBookList = async () => {
        const res = await request(list_book({
            list_param: {
                filter_by_cate_id: cateId != "",
                cate_id: cateId,
            },
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setBookList(res.book_list);
    };

    const getCoverImage = (book: BookInfo) => {
        if (book.cover_file_id == "") {
            return "";
        }
        let retUrl = `fs://localhost/${appStore.clientCfg?.book_store_fs_id ?? ""}/${book.cover_file_id}/cover.png`;

        if (appStore.isOsWindows) {
            retUrl = retUrl.replace("fs://localhost/", "https://fs.localhost/");
        }
        return retUrl;
    }

    useEffect(() => {
        loadCateList();
    }, []);

    useEffect(() => {
        loadBookList();
    }, [curPage, cateId]);

    return (
        <Card bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <Form layout="inline">
                    <Form.Item label="书籍类别">
                        <Select value={cateId} style={{ width: "100px" }} onChange={value => {
                            setCateId(value);
                            setCurPage(0);
                        }}>
                            <Select.Option value="">全部</Select.Option>
                            {cateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            }>
            <List rowKey="book_id" grid={{ gutter: 16 }} dataSource={bookList} renderItem={book => (
                <List.Item style={{ cursor: "pointer" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowDetailBookInfo(book);
                }}>
                    <Card title={<h2 title={book.book_title} style={{ width: "180px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{book.book_title}</h2>}
                        bodyStyle={{ width: "200px", height: "300px", overflow: "hidden" }}
                    >
                        <AsyncImage width={200} src={getCoverImage(book)} fallback={logoPng} preview={false} useRawImg={false}/>
                    </Card>
                </List.Item>
            )} pagination={{ current: curPage + 1, total: totalCount, pageSize: PAGE_SIZE, onChange: (page) => setCurPage(page - 1) }} />

            {showDetailBookInfo != null && (
                <BookInfoModal bookInfo={showDetailBookInfo} onCancel={() => setShowDetailBookInfo(null)} />
            )}
        </Card>
    );
};

export default BookStorePanel;
