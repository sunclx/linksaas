import React, { useEffect, useRef, useState } from "react";
import type { BookInfo, MarkInfo } from '@/api/project_book_shelf';
import { get_book, set_read_loc, get_read_loc, list_mark, add_mark, get_mark, remove_mark, remove_book } from '@/api/project_book_shelf';
import leftArrow from '@/assets/image/leftArrow.png';
import { useStores } from "@/hooks";
import { request } from '@/utils/request';
import { observer, useLocalObservable } from 'mobx-react';
import { get_cache_file } from '@/api/fs';
import DownloadBookModal from "./components/DownloadBookModal";
import { message, Modal, Popover, Select, Space, TreeSelect } from 'antd';
import Epub from 'epubjs';
import type { Rendition, Contents, Location } from 'epubjs';
import type Section from 'epubjs/types/section';
import { readBinaryFile } from '@tauri-apps/api/fs';
import type { Chapter } from "./utils";
import { getTocHref, getTocId } from "./utils";
import { convertToChapterList } from "./utils";
import { BookOutlined, FontSizeOutlined, LoadingOutlined, MoreOutlined } from "@ant-design/icons";
import s from './BookReader.module.less';
import MarkList from "./components/MarkList";

const BookReader = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const bookShelfStore = useStores('bookShelfStore');

    const renderRef = useRef<HTMLDivElement>(null);

    const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [rendition, setRendition] = useState<Rendition | null>(null);
    const [fontSize, setFontSize] = useState(16);
    const [chapterList, setChapterList] = useState<Chapter[]>([]);
    const [curChapter, setCurChapter] = useState("");
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showMarkId, setShowMarkId] = useState("");
    const localStore = useLocalObservable(() => ({
        markList: [] as MarkInfo[],
    }));

    const addMark = async (rend: Rendition, cfiRange: string) => {
        const content = rend.getRange(cfiRange).toString();
        //检查是否包含在现有标记内
        const index = localStore.markList.findIndex(mark=>mark.mark_content.includes(content));
        if(index != -1){
            return;
        }
        const addRes = await request(add_mark({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_id: bookShelfStore.curBookId,
            cfi_range: cfiRange,
            mark_content: content,
        }));

        const getRes = await request(get_mark({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_id: bookShelfStore.curBookId,
            mark_id: addRes.mark_id,
        }));
        const tmpList = localStore.markList.slice();
        tmpList.unshift(getRes.info);
        localStore.markList = tmpList;

        rend.annotations.highlight(cfiRange, {}, () => {
            setShowMarkId(addRes.mark_id);
        });
    }

    const removeMark = async () => {
        if (rendition == null) {
            return;
        }
        await request(remove_mark({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_id: bookShelfStore.curBookId,
            mark_id: showMarkId,
        }));
        const index = localStore.markList.findIndex(item => item.mark_id == showMarkId);
        if (index == -1) {
            return;
        }
        const cfiRange = localStore.markList[index].cfi_range;
        const tmpList = localStore.markList.filter(item => item.mark_id != showMarkId);
        localStore.markList = tmpList;
        rendition.annotations.remove(cfiRange, "highlight");
        setShowMarkId("");
    };

    const removeBook = async () => {
        await request(remove_book({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_id: bookShelfStore.curBookId,
        }));
        bookShelfStore.setShowBookList();
    }

    const openBook = async (filePath: string, initMarkList: MarkInfo[]) => {
        const data = await readBinaryFile(filePath);
        const book = Epub(data.buffer);
        await book.ready;
        setChapterList(convertToChapterList(book.navigation.toc));

        const rend = book.renderTo(renderRef.current!, {
            width: "100%",
            height: "100%",
            manager: "continuous",
            flow: "scrolled",
            snap: true
        });
        rend.themes.fontSize(`${fontSize}px`);
        //加载标记
        initMarkList.forEach(mark => {
            rend.annotations.highlight(mark.cfi_range, {}, () => {
                setShowMarkId(mark.mark_id);
            });
        });
        //调整阅读位置
        let displayed = false;
        if (bookShelfStore.markId != "") {
            const index = initMarkList.findIndex(mark => mark.mark_id == bookShelfStore.markId);
            if (index != -1) {
                await rend.display(initMarkList[index].cfi_range);
                displayed = true;
            }
        }
        if (displayed == false) {
            try {
                const locRes = await get_read_loc({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    book_id: bookShelfStore.curBookId,
                });
                if (locRes.code == 0 && locRes.cfi_loc != "") {
                    await rend.display(locRes.cfi_loc);
                    displayed = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        if (displayed == false) {
            await rend.display();
        }
        setRendition(rend);

        rend.on("selected", (cfiRange: string, contents: Contents) => {
            addMark(rend, cfiRange).then(() => {
                contents.window.getSelection()?.removeAllRanges();
            }).catch(() => {
                contents.window.getSelection()?.removeAllRanges();
            });

        });
        rend.on("rendered", (section: Section) => {
            setCurChapter(section.idref);
        });
        rend.on("relocated", function (location: Location) {
            const id = getTocId(location.start.href, book.navigation.toc);
            if (id != curChapter) {
                setCurChapter(id);
            }
            request(set_read_loc({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                book_id: bookShelfStore.curBookId,
                cfi_loc: location.start.cfi,
            }));
        });
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
        //下载标注信息
        const markRes = await request(list_mark({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_id: bookShelfStore.curBookId,
        }));
        if (!markRes) {
            return;
        }
        localStore.markList = markRes.info_list;
        //检查文件是否下载
        const res = await get_cache_file(projectStore.curProject?.ebook_fs_id ?? "", getRes.info.file_loc_id, "book.epub");
        if (res.exist_in_local) {
            await openBook(res.local_path, markRes.info_list);
        } else {
            setShowDownloadModal(true);
        }
    };

    useEffect(() => {
        loadBook();
    }, []);
    return (
        <div>
            <div className={s.title_wrap}>
                <h1>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        bookShelfStore.setShowBookList();
                    }}><img src={leftArrow} /></a>
                    {bookInfo?.book_title ?? ""}
                    {curChapter != "" && chapterList.length > 0 && (
                        <>
                            <span>/</span>
                            <TreeSelect
                                value={curChapter}
                                treeDefaultExpandAll
                                style={{ fontSize: 20, fontWeight: 800 }}
                                dropdownStyle={{ maxHeight: 500, minWidth: 300, overflow: 'auto' }}
                                treeData={chapterList}
                                bordered={false}
                                onChange={value => {
                                    const href = getTocHref(value, rendition?.book.navigation.toc ?? []);
                                    rendition?.display(href).then(() => {
                                        setCurChapter(value);
                                    });
                                }} />
                        </>
                    )}
                    {curChapter == "" && (<span>&nbsp;&nbsp;<LoadingOutlined />加载中...</span>)}
                </h1>
                <Space size="large">
                    <Popover content={
                        <MarkList
                            markList={localStore.markList}
                            onRemove={(markId) => setShowMarkId(markId)}
                            onClick={(markId) => {
                                const index = localStore.markList.findIndex(mark => mark.mark_id == markId)
                                if (index != -1) {
                                    rendition?.display(localStore.markList[index].cfi_range);
                                }
                            }}
                        />}
                        trigger="click"
                        placement="bottom">
                        <BookOutlined />
                    </Popover>

                    <Popover content={
                        <Select
                            defaultOpen={true}
                            value={fontSize}
                            onChange={value => {
                                rendition?.themes.fontSize(`${value}px`);
                                setFontSize(value);
                            }}>
                            {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38].map(value => (
                                <Select.Option key={value} label={value} value={value}>{value}</Select.Option>
                            ))}
                        </Select>}
                        trigger="click"
                        placement="bottom">
                        <FontSizeOutlined />
                    </Popover>
                    {projectStore.isAdmin == true && (
                        <Popover content={<div className={s.more}>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRemoveModal(true);
                            }}>删除</a>
                        </div>}
                            trigger="click"
                            placement="bottom">
                            <MoreOutlined />
                        </Popover>
                    )}
                </Space>

            </div>
            <div ref={renderRef} className={s.book_content} />
            {showDownloadModal == true && (
                <DownloadBookModal
                    title={bookInfo?.book_title ?? ""}
                    fileId={bookInfo?.file_loc_id ?? ""}
                    onOk={(localPath) => {
                        openBook(localPath, localStore.markList);
                        setShowDownloadModal(false);
                    }}
                    onErr={errMsg => {
                        message.error(errMsg);
                        setShowDownloadModal(false);
                    }}
                />
            )}
            {showMarkId != "" && (
                <Modal
                    title="标注"
                    open
                    okButtonProps={{ danger: true }}
                    okText="删除标注"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowMarkId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMark();
                    }}
                >
                    {localStore.markList.filter(mark => mark.mark_id == showMarkId).map(item => (<p key={item.mark_id}>内容：{item.mark_content}</p>))}
                </Modal>
            )
            }
            {showRemoveModal == true && (
                <Modal
                    title="删除书本"
                    open
                    okButtonProps={{ danger: true }}
                    okText="删除书本"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeBook();
                    }}>
                    <p>是否删除书本&nbsp;&nbsp;&lt;&lt;{bookInfo?.book_title ?? ""}&gt;&gt;?</p>
                    <p>删除后书本和相关标记数据将不可访问</p>
                </Modal>
            )}
        </div >
    );
}

export default observer(BookReader);