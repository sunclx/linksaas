import type { IssueResultItem } from "@/api/search";
import { search_project_issue } from "@/api/search";
import React, { useEffect, useState } from "react";
import s from "./common.module.less";
import type { ColumnsType } from 'antd/lib/table';
import { get_session } from "@/api/user";
import { request } from "@/utils/request";
import { ISSUE_TYPE_TASK } from "@/api/project_issue";
import type { ShortNoteEvent } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import { WebviewWindow } from "@tauri-apps/api/window";
import {Table} from 'antd';
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

interface IssueResultProps {
    projectId: string | null;
    keyword: string | null;
    issueType: number;
    fromTime: number | null;
    toTime: number | null;
}

const IssueResult: React.FC<IssueResultProps> = (props) => {
    const [resultItemList, setResultItemList] = useState<IssueResultItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const doSearch = async () => {
        const sessionId = await get_session();
        const res = await request(search_project_issue({
            session_id: sessionId,
            filter_by_project_id: props.projectId != null && props.projectId != "",
            project_id: props.projectId ?? "",
            keyword: props.keyword ?? "",
            issue_type: props.issueType,
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

    const columns: ColumnsType<IssueResultItem> = [
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
            render: (_, record: IssueResultItem) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const ev: ShortNoteEvent = {
                        projectId: props.projectId ?? "",
                        shortNoteType: props.issueType == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
                        targetId: record.issue_id,
                        extraTargetValue: "",
                    };
                    const mainWindow = WebviewWindow.getByLabel("main");
                    mainWindow?.emit("shortNote", ev);
                }}>查看{props.issueType == ISSUE_TYPE_TASK ? "任务" : "缺陷"}内容</a>
            ),
        }
    ];

    useEffect(() => {
        doSearch();
    }, [curPage]);

    return (<div className={s.result_wrap}>
        <Table rowKey="issue_id" columns={columns} dataSource={resultItemList} pagination={false} />
        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1}
            onChange={page => setCurPage(page - 1)} />
    </div>);
};

export default IssueResult;