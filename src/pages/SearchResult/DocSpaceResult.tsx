import type { DocResultItem } from "@/api/search";
import { search_project_doc } from "@/api/search";
import { SHORT_NOTE_DOC } from "@/api/short_note";
import { get_session } from "@/api/user";
import Pagination from "@/components/Pagination";
import { request } from "@/utils/request";
import type { ShortNoteEvent } from "@/utils/short_note";
import { WebviewWindow } from "@tauri-apps/api/window";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from 'antd/lib/table';


const PAGE_SIZE = 10;

interface DocSpaceResultProps {
    projectId: string | null;
    keyword: string | null;
    docSpaceId: string | null;
    fromTime: number | null;
    toTime: number | null;
}

const DocSpaceResult: React.FC<DocSpaceResultProps> = (props) => {
    const [resultItemList, setResultItemList] = useState<DocResultItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const doSearch = async () => {
        const sessionId = await get_session();
        const res = await request(search_project_doc({
            session_id: sessionId,
            filter_by_project_id: props.projectId != null && props.projectId != "",
            project_id: props.projectId ?? "",
            keyword: props.keyword ?? "",
            filter_by_doc_space_id: props.docSpaceId != null && props.docSpaceId != "",
            doc_space_id: props.docSpaceId ?? "",
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

    const columns: ColumnsType<DocResultItem> = [
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
            render: (_, record: DocResultItem) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const ev: ShortNoteEvent = {
                        projectId: props.projectId ?? "",
                        shortNoteType: SHORT_NOTE_DOC,
                        targetId: record.doc_id,
                        extraTargetValue: record.doc_space_id,
                    };
                    const mainWindow = WebviewWindow.getByLabel("main");
                    mainWindow?.emit("shortNote", ev);
                }}>查看文档内容</a>
            ),
        }
    ];

    useEffect(() => {
        doSearch();
    }, [curPage]);

    return (<div>
        <Table rowKey="doc_id" columns={columns} dataSource={resultItemList} pagination={false} />
        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1}
            onChange={page => setCurPage(page - 1)} />
    </div>);
};

export default DocSpaceResult;