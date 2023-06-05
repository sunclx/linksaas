import React, { useEffect, useRef, useState } from "react";
import * as prjBookShelf from '@/api/project_book_shelf';
import * as userBookShelf from '@/api/user_book_shelf';
import { request } from '@/utils/request';
import { observer, useLocalObservable } from 'mobx-react';
import { get_cache_file } from '@/api/fs';
import DownloadBookModal from "./components/DownloadBookModal";
import { message, Modal, Select, Space, TreeSelect } from 'antd';
import Epub from 'epubjs';
import type { Rendition, Contents, Location } from 'epubjs';
import type Section from 'epubjs/types/section';
import { readBinaryFile } from '@tauri-apps/api/fs';
import type { Chapter } from "./utils";
import { getTocHref } from "./utils";
import { convertToChapterList } from "./utils";
import { BookOutlined, FontSizeOutlined, LoadingOutlined } from "@ant-design/icons";
import s from './BookReader.module.less';
import MarkList from "./components/MarkList";
import { get_session } from "@/api/user";
import { useLocation } from "react-router-dom";
import ShareModal from "./components/ShareModal";

const BookReader = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") ?? "";
    const bookId = urlParams.get("bookId") ?? "";
    const markId = urlParams.get("markId") ?? "";
    const fsId = urlParams.get("fsId") ?? "";
    const fileLocId = urlParams.get("fileLocId") ?? "";
    const bookTitle = urlParams.get("bookTitle") ?? "";
    const canShareStr = urlParams.get("canShare") ?? "";
    const userId = urlParams.get("userId") ?? "";

    const renderRef = useRef<HTMLDivElement>(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [rendition, setRendition] = useState<Rendition | null>(null);
    const [fontSize, setFontSize] = useState(16);
    const [chapterList, setChapterList] = useState<Chapter[]>([]);
    const [curChapter, setCurChapter] = useState("");
    const [showMarkId, setShowMarkId] = useState("");
    const [showMarkList, setShowMarkList] = useState(false);
    const [sendMarkId, setSendMarkId] = useState("");
    const localStore = useLocalObservable(() => ({
        markList: [] as prjBookShelf.MarkInfo[] | userBookShelf.MarkInfo[],
    }));

    const addMark = async (rend: Rendition, cfiRange: string) => {
        const content = rend.getRange(cfiRange).toString();
        //检查是否包含在现有标记内
        const index = localStore.markList.findIndex(mark => mark.mark_content.includes(content));
        if (index != -1) {
            return;
        }
        const sessionId = await get_session();
        if (projectId == "") {
            const addRes = await request(userBookShelf.add_mark({
                session_id: sessionId,
                book_id: bookId,
                cfi_range: cfiRange,
                mark_content: content,
            }));
            const getRes = await request(userBookShelf.get_mark({
                session_id: sessionId,
                book_id: bookId,
                mark_id: addRes.mark_id,
            }));
            const tmpList = localStore.markList.slice();
            tmpList.unshift(getRes.info);
            localStore.markList = tmpList;

            rend.annotations.highlight(cfiRange, {}, () => {
                setShowMarkId(addRes.mark_id);
            });
        } else {
            const addRes = await request(prjBookShelf.add_mark({
                session_id: sessionId,
                project_id: projectId,
                book_id: bookId,
                cfi_range: cfiRange,
                mark_content: content,
            }));
            const getRes = await request(prjBookShelf.get_mark({
                session_id: sessionId,
                project_id: projectId,
                book_id: bookId,
                mark_id: addRes.mark_id,
            }));
            const tmpList = localStore.markList.slice();
            tmpList.unshift(getRes.info);
            localStore.markList = tmpList;

            rend.annotations.highlight(cfiRange, {}, () => {
                setShowMarkId(addRes.mark_id);
            });
        }
    }

    const removeMark = async () => {
        if (rendition == null) {
            return;
        }
        const sessionId = await get_session();
        if (projectId == "") {
            await request(userBookShelf.remove_mark({
                session_id: sessionId,
                book_id: bookId,
                mark_id: showMarkId,
            }));
        } else {
            await request(prjBookShelf.remove_mark({
                session_id: sessionId,
                project_id: projectId,
                book_id: bookId,
                mark_id: showMarkId,
            }));
        }

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


    const openBook = async (filePath: string, initMarkList: prjBookShelf.MarkInfo[] | userBookShelf.MarkInfo[]) => {
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
        const sessionId = await get_session();
        if (markId != "") {
            const index = initMarkList.findIndex(mark => mark.mark_id == markId);
            if (index != -1) {
                await rend.display(initMarkList[index].cfi_range);
                displayed = true;
            }
        }
        if (displayed == false) {
            try {
                if (projectId == "") {
                    const locRes = await userBookShelf.get_read_loc({
                        session_id: sessionId,
                        book_id: bookId,
                    });
                    if (locRes.code == 0 && locRes.cfi_loc != "") {
                        await rend.display(locRes.cfi_loc);
                        displayed = true;
                    }
                } else {
                    const locRes = await prjBookShelf.get_read_loc({
                        session_id: sessionId,
                        project_id: projectId,
                        book_id: bookId,
                    });
                    if (locRes.code == 0 && locRes.cfi_loc != "") {
                        await rend.display(locRes.cfi_loc);
                        displayed = true;
                    }
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
            const newChapter = section.idref.replace(/[a-zA-Z_]*/, "");
            if (curChapter != newChapter) {
                setCurChapter(newChapter);
            }
        });
        rend.on("relocated", function (loc: Location) {
            //TODO 改进性能
            if (projectId == "") {
                request(userBookShelf.set_read_loc({
                    session_id: sessionId,
                    book_id: bookId,
                    cfi_loc: loc.start.cfi,
                }));
            } else {
                request(prjBookShelf.set_read_loc({
                    session_id: sessionId,
                    project_id: projectId,
                    book_id: bookId,
                    cfi_loc: loc.start.cfi,
                }));
            }
        });
    };

    const loadBook = async () => {
        const sessionId = await get_session();

        //下载标注信息
        let markList: prjBookShelf.MarkInfo[] | userBookShelf.MarkInfo[] = [];
        if (projectId == "") {
            const markRes = await request(userBookShelf.list_mark({
                session_id: sessionId,
                book_id: bookId,
            }));
            if (!markRes) {
                return;
            }
            localStore.markList = markRes.info_list;
            markList = markRes.info_list;
        } else {
            const markRes = await request(prjBookShelf.list_mark({
                session_id: sessionId,
                project_id: projectId,
                book_id: bookId,
            }));
            if (!markRes) {
                return;
            }
            localStore.markList = markRes.info_list;
            markList = markRes.info_list;
        }

        //检查文件是否下载
        const res = await get_cache_file(fsId, fileLocId, "book.epub");
        if (res.exist_in_local) {
            await openBook(res.local_path, markList);
        } else {
            setShowDownloadModal(true);
        }
    };

    const goToTarget = async (target: string) => {
        if (rendition == null) {
            return;
        }
        for (let i = 0; i < 99; i++) {
            if (target == rendition.location.start.cfi) {
                break;
            }
            await rendition.display(target);
        }

    };

    useEffect(() => {
        loadBook();
    }, []);

    return (
        <div className={s.book_wrap}>
            <div className={s.title_wrap}>
                <Space size="large">
                    <div>
                        {chapterList.length > 0 && (
                            <TreeSelect
                                value={curChapter}
                                treeDefaultExpandAll
                                style={{ fontSize: 20, fontWeight: 800 }}
                                dropdownStyle={{ maxHeight: 500, minWidth: 400, overflow: 'auto' }}
                                treeData={chapterList}
                                bordered={false}
                                placement="topRight"
                                onChange={value => {
                                    const href = getTocHref(value, rendition?.book.navigation.toc ?? []);
                                    rendition?.display(href).then(() => {
                                        setCurChapter(value);
                                    });
                                }} />
                        )}
                        {chapterList.length == 0 && (<span>&nbsp;&nbsp;<LoadingOutlined />加载中...</span>)}
                    </div>
                    {rendition != null && (
                        <>
                            <BookOutlined style={{ cursor: "pointer" }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowMarkList(true);
                            }} />
                            <div>
                                <FontSizeOutlined />
                                <Select
                                    value={fontSize}
                                    bordered={false}
                                    onChange={value => {
                                        rendition?.themes.fontSize(`${value}px`);
                                        setFontSize(value);
                                    }}>
                                    {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38].map(value => (
                                        <Select.Option key={value} label={value} value={value}>{value}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </>
                    )}
                </Space>

            </div>
            <div ref={renderRef} className={s.book_content} />
            {showDownloadModal == true && (
                <DownloadBookModal
                    title={bookTitle}
                    fsId={fsId}
                    fileId={fileLocId}
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
                    {localStore.markList.filter(mark => mark.mark_id == showMarkId).map(item => (
                        <div key={item.mark_id}>
                            内容：{item.mark_content}
                            {canShareStr.trim() != "" && (
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setSendMarkId(showMarkId);
                                }}>分享给同事</a>
                            )}
                        </div>
                    ))}
                </Modal>
            )
            }
            {showMarkList == true && rendition != null && (
                <Modal open title="标注列表" footer={null} width="370px"
                    bodyStyle={{ height: "calc(100vh - 200px)", overflowY: "scroll" }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowMarkList(false);
                    }}>
                    <MarkList
                        markList={localStore.markList}
                        onRemove={(tmpMarkId) => setShowMarkId(tmpMarkId)}
                        onClick={(tmpMarkId) => {
                            const index = localStore.markList.findIndex(mark => mark.mark_id == tmpMarkId);
                            if (index != -1) {
                                const parts = localStore.markList[index].cfi_range.split(",")
                                if (parts.length == 3) {
                                    parts.pop();
                                }
                                let target = parts.join("");
                                if (!target.endsWith(")")) {
                                    target += ")";
                                }
                                goToTarget(target);
                            }
                        }}
                        projectId={projectId}
                        userId={userId}
                        canShare={canShareStr.trim() != ""} />
                </Modal>
            )}
            {sendMarkId != "" && (
                <ShareModal mark={localStore.markList.find(item => item.mark_id = sendMarkId) as prjBookShelf.MarkInfo | undefined}
                    onClose={() => setSendMarkId("")} projectId={projectId} />
            )}

        </div >
    );
}

export default observer(BookReader);