import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Button, Modal, Popover, Table, message } from "antd";
import s from "./BookMarkPanel.module.less";
import type { CateInfo, BookMarkInfo } from "@/api/project_bookmark";
import { list_cate, list_book_mark, remove_book_mark, set_book_mark_cate, get_book_mark } from "@/api/project_bookmark";
import { request } from "@/utils/request";
import type { LinkBookMarkCateState } from "@/stores/linkAux";
import { useLocation } from "react-router-dom";
import type { ColumnsType } from 'antd/lib/table';
import { EditSelect } from "@/components/EditCell/EditSelect";


interface BookMarkContentProps {
    bookMarkId: string;
}

const BookMarkContent: React.FC<BookMarkContentProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [content, setContent] = useState("");

    const loadContent = async () => {
        const res = await request(get_book_mark({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_mark_id: props.bookMarkId,
        }));
        setContent(res.content);
    };

    useEffect(() => {
        loadContent();
    }, [props.bookMarkId]);
    return (
        <div style={{ padding: "10px 10px", width: "400px", maxHeight: "calc(100vh - 400px)", overflow: "scroll" }}>
            <pre style={{ margin: "10px 10px", whiteSpace: "pre-line" }}>
                {content}
            </pre>
        </div>
    );
}

const PAGE_SIZE = 10;

const BookMarkPanel = () => {
    const location = useLocation();
    const state: LinkBookMarkCateState = location.state as (LinkBookMarkCateState | undefined) ?? { cateId: "" };

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [cateInfoList, setCateInfoList] = useState<CateInfo[]>([]);

    const [bookMarkInfoList, setBookMarkInfoList] = useState<BookMarkInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [removeBookMarkInfo, setRemoveBookMarkInfo] = useState<BookMarkInfo | null>(null);

    const loadCateList = async () => {
        const res = await request(list_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setCateInfoList([{
            cate_id: "",
            cate_name: "未分类书签",
            book_mark_count: 0,
            create_user_id: "",
            create_display_name: "",
            create_logo_uri: "",
            create_time: 0,
            update_user_id: "",
            update_display_name: "",
            update_logo_uri: "",
            update_time: 0,
        }, ...res.cate_info_list]);
    };

    const loadBookMarkList = async () => {
        const res = await request(list_book_mark({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_cate_id: true,
            cate_id: state.cateId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setBookMarkInfoList(res.book_mark_info_list);
    };

    const removeBookMark = async () => {
        await request(remove_book_mark({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            book_mark_id: removeBookMarkInfo?.book_mark_id ?? "",
        }));
        projectStore.addBookMarkCateVersion();
        await loadBookMarkList();
        setRemoveBookMarkInfo(null);
        message.info("删除书签成功");
    }

    const columns: ColumnsType<BookMarkInfo> = [
        {
            title: "标题",
            width: 300,
            render: (_, row: BookMarkInfo) => (
                <Popover placement="right" trigger="hover" destroyTooltipOnHide content={<BookMarkContent bookMarkId={row.book_mark_id} />}>
                    <a href={row.url} target="_blank" rel="noreferrer">{row.title}</a>
                </Popover>
            ),
        },
        {
            title: "分类",
            width: 100,
            render: (_, row: BookMarkInfo) => (
                <EditSelect editable={projectStore.isAdmin} curValue={row.cate_id}
                    itemList={cateInfoList.map(item => ({
                        value: item.cate_id,
                        label: item.cate_name,
                        color: "balck",
                    }))} onChange={async (value) => {
                        try {
                            await request(set_book_mark_cate({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                book_mark_id: row.book_mark_id,
                                cate_id: value as string,
                            }));
                            await loadBookMarkList();
                            projectStore.addBookMarkCateVersion();
                            return true;
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                    }} showEditIcon={true} allowClear={false} />
            )
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: BookMarkInfo) => (
                <Button type="link" danger disabled={!projectStore.isAdmin} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveBookMarkInfo(row);
                }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        loadCateList();
    }, [projectStore.bookMarkCateVersion]);

    useEffect(() => {
        if (curPage != 0) {
            setCurPage(0);
        }
    }, [state.cateId]);

    useEffect(() => {
        loadBookMarkList();
    }, [curPage, state.cateId]);

    return (
        <div className={s.content_wrap}>
            <Table rowKey="book_mark_id" bordered={false} dataSource={bookMarkInfoList} columns={columns}
                pagination={{ pageSize: PAGE_SIZE, total: totalCount, current: curPage + 1, onChange: page => setCurPage(page - 1) }} />
            {removeBookMarkInfo != null && (
                <Modal open title="删除书签"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveBookMarkInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeBookMark();
                    }}>
                    是否删除书签&nbsp;{removeBookMarkInfo.title}?
                </Modal>
            )}
        </div>
    );
};

export default observer(BookMarkPanel);