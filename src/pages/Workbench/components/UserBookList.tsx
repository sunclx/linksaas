import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, List, Popover, Button, Modal } from "antd";
import type { BookInfo } from "@/api/user_book_shelf";
import { list_book, remove_book } from "@/api/user_book_shelf";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { openBook } from "@/pages/Book/utils";
import logoPng from '@/assets/allIcon/logo.png';
import { MoreOutlined } from "@ant-design/icons";
import AsyncImage from "@/components/AsyncImage";

const PAGE_SIZE = 12;

const UserBookList = () => {
    const userStore = useStores('userStore');
    const appStore = useStores('appStore');

    const [bookList, setBookList] = useState<BookInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [removeBookInfo, setRemoveBookInfo] = useState<BookInfo | null>(null);

    const loadBookList = async () => {
        const res = await request(list_book({
            session_id: userStore.sessionId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setBookList(res.info_list);
    };

    const getCoverImage = (book: BookInfo) => {
        if (book.cover_file_id == "") {
            return "";
        }
        let retUrl = "";
        if (book.in_store) {
            retUrl = `fs://localhost/${appStore.clientCfg?.book_store_fs_id ?? ""}/${book.cover_file_id}/cover.png`;
        }
        if (appStore.isOsWindows) {
            retUrl = retUrl.replace("fs://localhost/", "https://fs.localhost/");
        }
        return retUrl;
    }

    const removeBook = async () => {
        if (removeBookInfo == null) {
            return;
        }
        await request(remove_book({
            session_id: userStore.sessionId,
            book_id: removeBookInfo.book_id,
        }));
        setRemoveBookInfo(null);
        await loadBookList();
    };

    useEffect(() => {
        loadBookList();
    }, [curPage]);
    return (
        <div style={{ height: "calc(100vh - 225px)", overflow: "hidden" }}>
            <List rowKey="book_id" grid={{ gutter: 16 }} dataSource={bookList} renderItem={book => (
                <List.Item>
                    <Card
                        title={<h2 title={book.book_title} style={{ width: "140px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{book.book_title}</h2>}
                        bodyStyle={{ width: "200px", height: "300px", overflow: "hidden" }}
                        extra={
                            <Popover trigger="click" placement="right" content={
                                <div style={{padding:"10px 10px"}}>
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setRemoveBookInfo(book);
                                    }}>删除书籍</Button>
                                </div>
                            }>
                                <MoreOutlined />
                            </Popover>
                        }>
                        <a style={{ height: "300px", display: "block" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            openBook(userStore.userInfo.userId, "", book.book_id, "",
                                appStore.clientCfg?.book_store_fs_id ?? "", "", false);
                        }}>
                            <AsyncImage width={200} src={getCoverImage(book)} fallback={logoPng} preview={false} useRawImg={false}/>
                        </a>
                    </Card>
                </List.Item>
            )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: (page) => setCurPage(page - 1) }} />
            {removeBookInfo != null && (
                <Modal title="删除书籍" open mask={false}
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveBookInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeBook();
                    }}>
                    是否删除书籍 {removeBookInfo.book_title} ?
                </Modal>
            )}
        </div>
    );
};

export default observer(UserBookList);