import type { ChannelResultItem } from "@/api/search";
import { search_project_channel } from "@/api/search";
import { get_session } from "@/api/user";
import Pagination from "@/components/Pagination";
import { request } from "@/utils/request";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from 'antd/lib/table';
import type { ShortNoteEvent } from "@/utils/short_note";
import { WebviewWindow } from "@tauri-apps/api/window";
import { SHORT_NOTE_CHANNEL, SHORT_NOTE_MODE_DETAIL } from "@/api/short_note";


const PAGE_SIZE = 10;

interface ChannelResultProps {
    projectId: string | null;
    keyword: string | null;
    channelId: string | null;
    fromTime: number | null;
    toTime: number | null;
};

const ChannelResult: React.FC<ChannelResultProps> = (props) => {
    const [resultItemList, setResultItemList] = useState<ChannelResultItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const doSearch = async () => {
        const sessionId = await get_session();
        const res = await request(search_project_channel({
            session_id: sessionId,
            filter_by_project_id: props.projectId != null && props.projectId != "",
            project_id: props.projectId ?? "",
            keyword: props.keyword ?? "",
            filter_by_channel_id: props.channelId != null && props.channelId != "",
            channel_id: props.channelId ?? "",
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

    const columns: ColumnsType<ChannelResultItem> = [
        {
            title: "内容(文本部分)",
            dataIndex: "content",
            render: (content) => (
                <div style={{ maxWidth: "500px" }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />),
        },
        {
            title: "",
            width: 150,
            render: (_, record: ChannelResultItem) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const ev: ShortNoteEvent = {
                        projectId: props.projectId ?? "",
                        shortNoteModeType: SHORT_NOTE_MODE_DETAIL,
                        shortNoteType: SHORT_NOTE_CHANNEL,
                        targetId: record.msg_id,
                        extraTargetValue: record.channel_id,
                    };
                    const mainWindow = WebviewWindow.getByLabel("main");
                    mainWindow?.emit("shortNote", ev);
                }}>查看聊天内容</a>
            ),
        }
    ];
    useEffect(() => {
        doSearch();
    }, [curPage]);

    return (<div>
        <Table rowKey="msg_id" columns={columns} dataSource={resultItemList} pagination={false} />
        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1}
            onChange={page => setCurPage(page - 1)} />
    </div>);
};


export default ChannelResult;