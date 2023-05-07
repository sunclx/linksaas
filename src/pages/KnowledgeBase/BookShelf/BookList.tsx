import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, message, Modal, Space, Image, Input, List, Popover } from "antd";
import s from './BookList.module.less';
import { BookOutlined, DoubleRightOutlined, MoreOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { list_book, update_book, remove_book } from '@/api/project_book_shelf';
import UploadBookModal from "./components/UploadBookModal";
import { useStores } from "@/hooks";
import type { BookInfo } from '@/api/project_book_shelf';
import { request } from '@/utils/request';
import { openBook } from "@/pages/Book/utils";
import { LAYOUT_TYPE_CHAT, LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT } from "@/api/project";
import Epub from 'epubjs';
import { readBinaryFile } from '@tauri-apps/api/fs';
import logoPng from '@/assets/allIcon/logo.png';
import { PUB_RES_PATH } from "@/utils/constant";
import { useHistory } from "react-router-dom";

const PAGE_SIZE = 12;

interface UploadBookInfo {
    filePath: string;
    title: string;
    coverDataBase64: string;
}

const BookList = () => {
    const history = useHistory();

    const appStore = useStores('appStore');
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [uploadInfo, setUploadInfo] = useState<UploadBookInfo | null>(null);
    const [curPage, setCurPage] = useState(0);
    const [bookCount, setBookCount] = useState(0);
    const [bookList, setBookList] = useState<BookInfo[]>([]);
    const [updateBookId, setUpdateBookId] = useState("");
    const [updateTitle, setUpdateTitle] = useState("");
    const [removeBookInfo, setRemoveBookInfo] = useState<BookInfo | null>(null);

    const showUploadFile = async () => {
        const bookFile = await open_dialog({
            directory: false,
            filters: [{
                name: "电子书",
                extensions: ["epub"],
            }],
            multiple: false,
            title: "上传电子书(只支持epub)",
        });
        if (Array.isArray(bookFile) || bookFile == null) {
            message.warn("没有选择电子书文件");
            return;
        }
        try {
            const data = await readBinaryFile(bookFile as string);
            const book = Epub(data.buffer);
            await book.ready;
            const meta = await book.loaded.metadata;
            const coverUrl = await book.loaded.cover;
            const title = meta.title == "" ? "未知名称" : meta.title;
            let coverFileBase64 = "";
            if ((coverUrl ?? "") != "") {
                let base64Data = await book.archive.getBase64(coverUrl);
                const index = base64Data.indexOf("base64,");
                if (index != -1) {
                    base64Data = base64Data.substring(index + "base64,".length);
                }
                coverFileBase64 = base64Data;
            }
            setUploadInfo({ filePath: bookFile as string, title: title, coverDataBase64: coverFileBase64 });
        } catch (e: unknown) {
            console.log(e);
            message.error(e as string);
        }
    };

    const loadBook = async () => {
        const res = await request(list_book({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        if (res) {
            setBookCount(res.total_count);
            setBookList(res.info_list);
        }
    };

    const updateBookTitle = async () => {
        if (updateTitle == "") {
            message.error("书名不能为空");
            return;
        }
        const res = await request(update_book({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_id: updateBookId,
            book_title: updateTitle,
        }));
        if (res) {
            const tmpList = bookList.slice();
            const index = tmpList.findIndex(book => book.book_id == updateBookId);
            if (index != -1) {
                tmpList[index].book_title = updateTitle;
                setBookList(tmpList);
            }
            setUpdateTitle("");
            setUpdateBookId("");
        }
    }

    const getCoverImage = (book: BookInfo) => {
        if (book.cover_file_id == "") {
            return "";
        }
        let retUrl = "";
        if (book.in_store) {
            retUrl = `fs://localhost/${appStore.clientCfg?.book_store_fs_id ?? ""}/${book.cover_file_id}/cover.png`;
        } else {
            retUrl = `fs://localhost/${projectStore.curProject?.ebook_fs_id ?? ""}/${book.cover_file_id}/cover.png`;
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
            project_id: projectStore.curProjectId,
            book_id: removeBookInfo.book_id,
        }));
        setRemoveBookInfo(null);
        await loadBook();
    };

    useEffect(() => {
        loadBook();
    }, [projectStore.curProjectId, curPage]);

    return (
        <Card
            title={<h1 className={s.header}><BookOutlined /> 项目书籍</h1>}
            bordered={false}
            extra={
                <Space>
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        projectStore.setCurProjectId("");
                        history.push(`${PUB_RES_PATH}?tab=bookStore`);
                    }}>前往书籍市场<DoubleRightOutlined /></Button>
                    <Popover trigger="click" placement="right" content={
                        <div style={{ padding: "10px 10px" }}>
                            <Button
                                type="link"
                                disabled={!projectStore.isAdmin}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    showUploadFile();
                                }}>上传书籍</Button>
                        </div>
                    }>
                        <MoreOutlined />
                    </Popover>
                    {/* <Button
                        type="primary"
                        style={{ height: "30px" }}
                        disabled={!projectStore.isAdmin}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            showUploadFile();
                        }}>上传电子书</Button> */}
                </Space>
            }>
            <div className={s.contentWrap}>
                <List rowKey="book_id" dataSource={bookList} grid={{ gutter: 16 }} renderItem={book => (
                    <List.Item>
                        <Card
                            title={<h2 title={book.book_title} style={{ width: "140px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{book.book_title}</h2>}
                            bodyStyle={{ width: "200px", height: "300px", overflow: "hidden" }}
                            extra={
                                <>
                                    {projectStore.isAdmin && (
                                        <Popover trigger="click" placement="right" content={
                                            <Space direction="vertical" style={{ padding: "10px 10px" }}>
                                                {book.in_store == false && (
                                                    <Button type="link" onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        setUpdateTitle(book.book_title);
                                                        setUpdateBookId(book.book_id);
                                                    }}>修改书名</Button>
                                                )}
                                                <Button type="link" danger onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setRemoveBookInfo(book);
                                                }}>删除书籍</Button>
                                            </Space>
                                        }>
                                            <MoreOutlined />
                                        </Popover>
                                    )}
                                </>
                            }
                        >
                            <a style={{ height: "300px", display: "block" }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                let canShare = false;
                                const layout = projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB;
                                if ([LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_CHAT].includes(layout)) {
                                    canShare = true;
                                }
                                openBook(userStore.userInfo.userId, projectStore.curProjectId, book.book_id, "",
                                    appStore.clientCfg?.book_store_fs_id ?? "", projectStore.curProject?.ebook_fs_id ?? "", canShare);
                            }}>
                                <Image width={200} src={getCoverImage(book)} fallback={logoPng} preview={false} />
                            </a>
                        </Card>
                    </List.Item>
                )} pagination={{ pageSize: PAGE_SIZE, current: curPage + 1, total: bookCount, onChange: (page) => setCurPage(page - 1) }} />
            </div>

            {uploadInfo != null && (<UploadBookModal
                filePath={uploadInfo.filePath}
                title={uploadInfo.title}
                coverDataBase64={uploadInfo.coverDataBase64}
                onErr={errMsg => {
                    message.error(errMsg);
                    setUploadInfo(null);
                }}
                onOk={() => {
                    message.info("上传电子书成功");
                    setUploadInfo(null);
                    if (curPage != 0) {
                        setCurPage(0);
                    } else {
                        loadBook();
                    }
                }} />)}
            {updateBookId != "" && (
                <Modal
                    title="修改书名"
                    open
                    okText="修改"
                    mask={false}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUpdateBookId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateBookTitle();
                    }}>
                    <Input addonBefore="书名" value={updateTitle} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUpdateTitle(e.target.value);
                    }} />
                </Modal>
            )}
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
                    是否删除项目书籍 {removeBookInfo.book_title} ?
                </Modal>
            )}
        </Card>
    );
};

export default observer(BookList);