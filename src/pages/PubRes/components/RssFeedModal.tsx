import { Card, List, Modal, Image } from "antd";
import React, { useEffect, useState } from "react";
import type { FeedEntry } from "@/api/rss";
import { list_entry } from "@/api/rss";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import moment from "moment";
import { open as shell_open } from '@tauri-apps/api/shell';
import { LinkOutlined } from "@ant-design/icons";

const PAGE_SIZE = 10;

export interface RssFeedModalProps {
    feedId: string;
    feedName: string;
    myWatch: boolean;
    onCancel: () => void;
    onWatch: () => void;
    onUnWatch: () => void;
}

const RssFeedModal = (props: RssFeedModalProps) => {
    const userStore = useStores('userStore');
    const appStore = useStores('appStore');

    const [entryList, setEntryList] = useState<FeedEntry[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadEntryList = async () => {
        const res = await request(list_entry({
            session_id: userStore.sessionId,
            feed_id_list: [props.feedId],
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setEntryList(res.entry_list);
    };

    const getImageUrl = (fileId: string) => {
        const fsId = appStore.clientCfg?.rss_fs_id ?? "";
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${fsId}/${fileId}/image`;
        } else {
            return `fs://localhost/${fsId}/${fileId}/image`;
        }
    };

    useEffect(() => {
        loadEntryList();
    }, [props.feedId, curPage])

    return (
        <Modal open title={`${props.feedName} 文章列表`}
            width="800px"
            okText={props.myWatch ? "取消订阅" : "订阅"}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.myWatch) {
                    props.onUnWatch();
                } else {
                    props.onWatch();
                }
            }}>
            <List rowKey="entry_url" dataSource={entryList}
                style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}
                renderItem={item => (
                    <List.Item>
                        <Card title={<a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            shell_open(item.entry_url);
                        }}><LinkOutlined />&nbsp;{item.title}</a>} style={{ width: "100%", marginRight: "20px" }} bordered={false} extra={
                            <span>{moment(item.time_stamp).format("YYYY-MM-DD")}</span>
                        }>
                            <div style={{ display: "flex" }}>
                                {item.img_file_id != "" && (
                                    <div style={{ padding: "20px" }}>
                                        <Image src={getImageUrl(item.img_file_id)} preview={false} width={200} />
                                    </div>
                                )}
                                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{item.summary}</pre>
                            </div>
                        </Card>
                    </List.Item>
                )} pagination={{ hideOnSinglePage: true, total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1) }} />
        </Modal>
    )
};

export default RssFeedModal;
