import React, { useEffect, useState } from "react";
import type { BookInfo, BookExtraInfo, InstallInfo } from "@/api/bookstore";
import { get_book_extra, get_install_info } from "@/api/bookstore";
import { Button, Descriptions, Form, Modal, Space } from "antd";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import * as userBookShelf from "@/api/user_book_shelf";
import * as prjBookShelf from "@/api/project_book_shelf";
import { openBook } from "@/pages/Book/utils";


interface BookInfoModalProps {
    bookInfo: BookInfo;
    onCancel: () => void;
}

const BookInfoModal: React.FC<BookInfoModalProps> = (props) => {
    const userStore = useStores("userStore");
    const appStore = useStores('appStore');

    const [extraInfo, setExtraInfo] = useState<BookExtraInfo | null>(null);
    const [installInfo, setInstallInfo] = useState<InstallInfo | null>(null);

    const loadExtraInfo = async () => {
        const res = await request(get_book_extra({
            book_id: props.bookInfo.book_id,
        }));
        setExtraInfo(res.extra_info);
    };

    const loadInstallInfo = async () => {
        const res = await request(get_install_info({
            session_id: userStore.sessionId,
            book_id: props.bookInfo.book_id,
        }));
        setInstallInfo(res.install_info);
    };

    const installUserBook = async () => {
        await request(userBookShelf.add_book({
            session_id: userStore.sessionId,
            book_title: props.bookInfo.book_title,
            file_id: props.bookInfo.file_id,
            cover_file_id: props.bookInfo.cover_file_id,
            in_store: true,
        }));
        if (installInfo != null) {
            setInstallInfo({ ...installInfo, user_install: true });
        }
    };

    const removeUserBook = async () => {
        const res = await request(userBookShelf.query_by_file_id({
            session_id: userStore.sessionId,
            file_id_in_store: props.bookInfo.file_id,
        }));
        for (const bookId of res.book_id_list) {
            await request(userBookShelf.remove_book({
                session_id: userStore.sessionId,
                book_id: bookId,
            }));
        }
        if (installInfo != null) {
            setInstallInfo({ ...installInfo, user_install: false });
        }
    }

    const installProjectBook = async (projectId: string) => {
        await request(prjBookShelf.add_book({
            session_id: userStore.sessionId,
            project_id: projectId,
            book_title: props.bookInfo.book_title,
            file_id: props.bookInfo.file_id,
            cover_file_id: props.bookInfo.cover_file_id,
            in_store: true,
        }));
        if (installInfo != null) {
            const tmpList = installInfo.project_list.slice();
            const index = tmpList.findIndex(item => item.project_id == projectId);
            if (index != -1) {
                tmpList[index].has_install = true;
                setInstallInfo({ ...installInfo, project_list: tmpList });
            }
        }
    }

    const removeProjectBook = async (projectId: string) => {
        const res = await request(prjBookShelf.query_by_file_id({
            session_id: userStore.sessionId,
            project_id: projectId,
            file_id_in_store: props.bookInfo.file_id,
        }));
        for (const bookId of res.book_id_list) {
            await request(prjBookShelf.remove_book({
                session_id: userStore.sessionId,
                project_id: projectId,
                book_id: bookId,
            }));
        }
        if (installInfo != null) {
            const tmpList = installInfo.project_list.slice();
            const index = tmpList.findIndex(item => item.project_id == projectId);
            if (index != -1) {
                tmpList[index].has_install = false;
                setInstallInfo({ ...installInfo, project_list: tmpList });
            }
        }
    }

    const openStoreBook = async (projectId: string) => {
        let bookId = "";
        if (projectId == "") {
            const res = await request(userBookShelf.query_by_file_id({
                session_id: userStore.sessionId,
                file_id_in_store: props.bookInfo.file_id,
            }));
            if (res.book_id_list.length > 0) {
                bookId = res.book_id_list[0];
            }
        } else {
            const res = await request(prjBookShelf.query_by_file_id({
                session_id: userStore.sessionId,
                project_id: projectId,
                file_id_in_store: props.bookInfo.file_id,
            }));
            if (res.book_id_list.length > 0) {
                bookId = res.book_id_list[0];
            }
        }
        if (bookId == "") {
            return;
        }
        openBook(userStore.userInfo.userId, projectId, bookId,
            "", appStore.clientCfg?.book_store_fs_id ?? "", "", projectId != "");
    }

    useEffect(() => {
        loadExtraInfo();
    }, []);

    useEffect(() => {
        loadInstallInfo();
    }, []);

    return (
        <Modal title={props.bookInfo.book_title} open footer={null}
            bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
        >
            <Descriptions bordered>
                <Descriptions.Item label="类别" span={3}>{props.bookInfo.cate_name}</Descriptions.Item>
                {extraInfo != null && (
                    <Descriptions.Item label="目录" span={3}>
                        <div style={{ maxHeight: "200px", overflowY: "scroll", overflowX: "hidden" }}>
                            {extraInfo.toc_list.map((toc, index) => (
                                <p key={index} style={{ paddingLeft: `${toc.level * 20}px` }}>{toc.value}</p>
                            ))}
                        </div>
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="操作" span={3}>
                    {installInfo != null && (
                        <Form labelCol={{ span: 6 }}>
                            <Form.Item label="工作台">
                                <Space size="large">
                                    {installInfo.user_install == true && (
                                        <>
                                            <Button type="link" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                openStoreBook("");
                                            }}>打开书籍</Button>
                                            <Button type="link" danger onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                removeUserBook();
                                            }}>删除书籍</Button>
                                        </>
                                    )}
                                    {installInfo.user_install == false && (
                                        <Button type="link" onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            installUserBook();
                                        }}>增加书籍</Button>
                                    )}
                                </Space>
                            </Form.Item>
                            {installInfo.project_list.map(prj => (
                                <Form.Item label={`${prj.project_name}`} key={prj.project_id}>
                                    <Space size="large">
                                        {prj.has_install == true && (
                                            <>
                                                <Button type="link" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    openStoreBook(prj.project_id);
                                                }}>打开书籍</Button>
                                                <Button type="link" danger disabled={!prj.can_install} onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    removeProjectBook(prj.project_id);
                                                }}>删除书籍</Button>
                                            </>
                                        )}
                                        {prj.has_install == false && (
                                            <Button type="link" disabled={!prj.can_install} onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                installProjectBook(prj.project_id);
                                            }}>增加书籍</Button>
                                        )}
                                    </Space>
                                </Form.Item>
                            ))}
                        </Form>
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};


export default BookInfoModal;