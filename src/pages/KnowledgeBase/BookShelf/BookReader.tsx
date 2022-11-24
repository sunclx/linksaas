import React, { useEffect, useRef, useState } from "react";
import type { BookInfo } from '@/api/project_book_shelf';
import { get_book } from '@/api/project_book_shelf';
import leftArrow from '@/assets/image/leftArrow.png';
import { useStores } from "@/hooks";
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import { get_cache_file } from '@/api/fs';
import DownloadBookModal from "./components/DownloadBookModal";
import { Button, message } from 'antd';
import Epub from 'epubjs';
import type { Rendition } from 'epubjs';
import { readBinaryFile } from '@tauri-apps/api/fs';


const BookReader = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const bookShelfStore = useStores('bookShelfStore');

    const renderRef = useRef<HTMLDivElement>(null);

    const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [rendition, setRendition] = useState<Rendition | null>(null);

    const openBook = async (filePath: string) => {
        const data = await readBinaryFile(filePath);
        const book = Epub(data.buffer);
        await book.ready;
        const rend = book.renderTo(renderRef.current!, {
            width: "100%",
            height: "100%",
            manager: "continuous",
            flow: "scrolled-doc",
            snap: true
        });
        rend.display();
        setRendition(rend);
        rend.on("selected", (cfiRange: any, contents: any) => {
            console.log(rend.getRange(cfiRange).toString());
            rend.annotations.highlight(cfiRange, {}, (e) => {
                console.log("highlight clicked", e.target);
            }, undefined, {
                color: "red",
            });
            contents.window.getSelection().removeAllRanges();
        })
    };

    const loadBook = async () => {
        const getRes = await request(get_book({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_id: bookShelfStore.curBookId,
        }));
        if (!getRes) {
            return;
        }
        setBookInfo(getRes.info);
        //检查文件是否下载
        const res = await get_cache_file(projectStore.curProject?.ebook_fs_id ?? "", getRes.info.file_loc_id, "book.epub");
        if (res.exist_in_local) {
            await openBook(res.local_path);
        } else {
            setShowDownloadModal(true);
        }
    };

    useEffect(() => {
        loadBook();
    }, []);
    return (
        <div>
            <div>
                <h1>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        bookShelfStore.setShowBookList();
                    }}><img src={leftArrow} /></a>
                    {bookInfo?.book_title ?? ""}
                </h1>
            </div>
            <div ref={renderRef} style={{ border: "1px solid black", width: "100%", height: "calc(100vh - 200px)" }} />
            {rendition != null && (
                <div>
                    <Button onClick={() => rendition.prev()}>上一页</Button>
                    <Button onClick={() => rendition.next()}>下一页</Button>
                </div>
            )}
            {showDownloadModal == true && (
                <DownloadBookModal
                    title={bookInfo?.book_title ?? ""}
                    fileId={bookInfo?.file_loc_id ?? ""}
                    onOk={() => {
                        //TODO 加载epub reader
                        setShowDownloadModal(false);
                    }}
                    onErr={errMsg => {
                        message.error(errMsg);
                        setShowDownloadModal(false);
                    }}
                />
            )}
        </div>
    );
}

export default observer(BookReader);