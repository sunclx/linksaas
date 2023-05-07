import Button from "@/components/Button";
import { Card, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import type { CateInfo, BookInfo } from "@/api/bookstore";
import { list_cate, list_book } from "@/api/bookstore";
import { request } from "@/utils/request";
import AddBookModal from "./components/AddBookModal";
import type { ColumnsType } from 'antd/es/table';
import { remove_book, update_book } from "@/api/bookstore_admin";
import { EditText } from "@/components/EditCell/EditText";


const PAGE_SIZE = 10;

const BookList = () => {
    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [cateList, setCateList] = useState<CateInfo[]>([]);
    const [curCateId, setCurCateId] = useState("");

    const [bookList, setBookList] = useState<BookInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showAddModal, setShowAddModal] = useState(false);
    const [removeBookInfo, setRemoveBookInfo] = useState<BookInfo | null>(null);

    const loadCateList = async () => {
        const res = await request(list_cate({}));
        setCateList(res.cate_list);
    };

    const loadBookList = async () => {
        const res = await request(list_book({
            list_param: {
                filter_by_cate_id: curCateId != "",
                cate_id: curCateId,
            },
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setBookList(res.book_list);
    };

    const changeBookCate = async (bookId: string, newCateId: string) => {
        const tmpList = bookList.slice();
        const index = bookList.findIndex(book => book.book_id == bookId);
        if (index == -1) {
            return;
        }
        const sessionId = await get_admin_session();
        await request(update_book({
            admin_session_id: sessionId,
            book_id: bookId,
            book_title: tmpList[index].book_title,
            cate_id: newCateId,
        }));
        tmpList[index].cate_id = newCateId;
        setBookList(tmpList);
    }

    const removeBook = async () => {
        if (removeBookInfo == null) {
            return;
        }
        const sessionId = await get_admin_session();
        await request(remove_book({
            admin_session_id: sessionId,
            book_id: removeBookInfo.book_id,
        }));
        setRemoveBookInfo(null);
        loadBookList();
    };

    const columns: ColumnsType<BookInfo> = [
        {
            title: "标题",
            render: (_, row) => (
                <EditText editable={permInfo?.book_store_perm.update_book ?? false} content={row.book_title} onChange={async (value) => {
                    if (value.trim() == "") {
                        return false;
                    }
                    try {
                        const sessionId = await get_admin_session();
                        await request(update_book({
                            admin_session_id: sessionId,
                            book_id: row.book_id,
                            book_title: value.trim(),
                            cate_id: row.cate_id,
                        }));
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                    return true;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "封面",
            render: (_, row) => row.cover_file_id == "" ? "无" : "有",
        },
        {
            title: "类别",
            render: (_, row) => (
                <Select value={row.cate_id} style={{ width: "100px" }}
                    disabled={!(permInfo?.book_store_perm.update_book ?? false)}
                    onChange={value => changeBookCate(row.book_id, value)}>
                    {cateList.map(cate => (
                        <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "操作",
            render: (_, row) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }}
                    disabled={!(permInfo?.book_store_perm.remove_book ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveBookInfo(row);
                    }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadCateList();
    }, []);

    useEffect(() => {
        loadBookList();
    }, [curPage, curCateId]);

    return (
        <Card title="书籍列表"
            style={{ height: "calc(100vh - 40px)", overflowY: "hidden" }}
            extra={
                <Space size="large">
                    <span>
                        书籍类别：
                        <Select style={{ width: "100px" }} value={curCateId} onChange={value => {
                            setCurPage(0);
                            setCurCateId(value);
                        }}>
                            <Select.Option value="">全部</Select.Option>
                            {cateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </span>
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }} disabled={!((permInfo?.book_store_perm.add_book ?? false) && cateList.length > 0)}>增加书籍</Button>
                </Space>
            }
        >
            <Table rowKey="book_id" dataSource={bookList} columns={columns} pagination={{
                total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE,
                onChange: (page) => setCurPage(page - 1), showTitle: true
            }} />
            {showAddModal == true && (
                <AddBookModal cateList={cateList} permInfo={permInfo} onCancel={() => setShowAddModal(false)}
                    onAdd={(cateId) => {
                        setShowAddModal(false);
                        if (curCateId == cateId && curPage == 0) {
                            loadBookList();
                        } else {
                            setCurCateId(cateId);
                            setCurPage(0);
                        }
                    }} />
            )}
            {removeBookInfo != null && (
                <Modal title="删除书本" open
                    okText="删除"
                    okButtonProps={{ disabled: !(permInfo?.book_store_perm.remove_book), danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveBookInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeBook();
                    }}
                >
                    是否删除书本 {removeBookInfo.book_title} ?
                </Modal>
            )}
        </Card>
    );
};

export default BookList;