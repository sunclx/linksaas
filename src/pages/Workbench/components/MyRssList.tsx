import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Empty, Layout, List, Popover, Image, Card } from "antd";
import { useStores } from "@/hooks";
import type { Feed } from "@/api/user_rss";
import { list_feed, unwatch } from "@/api/user_rss";
import type { FeedEntry } from "@/api/rss";
import { list_entry } from "@/api/rss";
import { request } from "@/utils/request";
import { LinkOutlined, MoreOutlined } from "@ant-design/icons";
import { open as shell_open } from '@tauri-apps/api/shell';
import moment from "moment";
import { useHistory } from "react-router-dom";
import { PUB_RES_PATH } from "@/utils/constant";
import s from "./MyRssList.module.less";
import classNames from 'classnames';

const PAGE_SIZE = 10;

const MyRssList = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const appStore = useStores('appStore');

    const [feedList, setFeedList] = useState<Feed[]>([])
    const [curFeedId, setCurFeedId] = useState("");
    const [entryList, setEntryList] = useState<FeedEntry[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadFeedList = async () => {
        const res = await request(list_feed({
            session_id: userStore.sessionId,
        }));
        res.feed_list.unshift({
            feed_id: "",
            feed_name: "全部",
            cate_id: "",
            cate_name: "",
            root_url: "",
            entry_count: 0,
            tag_list: [],
            last_time_stamp: 0,
        })
        setFeedList(res.feed_list);
    };

    const loadEntryList = async () => {
        if (feedList.length <= 1) {
            setTotalCount(0);
            setEntryList([]);
            return;
        }
        const feedIdList = curFeedId == "" ? feedList.map(item => item.feed_id) : [curFeedId];
        const res = await request(list_entry({
            session_id: userStore.sessionId,
            feed_id_list: feedIdList,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setEntryList(res.entry_list);
    }

    const unwatchFeed = async (feedId: string) => {
        await request(unwatch({
            session_id: userStore.sessionId,
            feed_id: feedId,
        }));
        const tmpList = feedList.filter(item => item.feed_id != feedId);
        setFeedList(tmpList);
        if (curFeedId == feedId) {
            setCurFeedId("");
            setCurPage(0);
        } else if (curFeedId == "") {
            if (curPage != 0) {
                setCurPage(0);
            }
        }
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
        loadFeedList();
    }, []);

    useEffect(() => {
        if (feedList.length > 0) {
            loadEntryList();
        }
    }, [curPage, curFeedId, feedList]);

    return (
        <Layout>
            <Layout.Sider width="200px" theme="light" style={{ height: "calc(100vh - 225px)", overflowY: "scroll", borderRight: "1px solid #e4e4e8" }}>
                {feedList.length <= 1 && (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            history.push(`${PUB_RES_PATH}?tab=rss`);
                        }}>前往资讯市场</a>
                    } />
                )}
                {feedList.length > 1 && (
                    <List rowKey="feed_id"
                        dataSource={feedList} renderItem={item => (
                            <List.Item extra={
                                <>
                                    {item.feed_id != "" && (
                                        <Popover trigger="click" placement="bottom" content={
                                            <div style={{ padding: "10px 10px" }}>
                                                <Button type="link" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    unwatchFeed(item.feed_id);
                                                }}>取消订阅</Button>
                                            </div>
                                        }>
                                            <MoreOutlined />
                                        </Popover>
                                    )}
                                </>
                            }>
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setCurFeedId(item.feed_id);
                                    setCurPage(0);
                                }} className={classNames(s.item, curFeedId == item.feed_id ? s.item_active : "")}
                                    style={{ width: "160px", overflow: "hidden", textAlign: "left", padding: "2px 10px" }} title={item.feed_name}>{item.feed_name}</a>
                            </List.Item>
                        )} />
                )}
            </Layout.Sider>
            <Layout.Content style={{ height: "calc(100vh - 225px)", overflowY: "scroll", background: "white", paddingLeft: "20px" }}>
                <List rowKey="entry_url" dataSource={entryList} renderItem={item => (
                    <List.Item>
                        <Card title={<a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            shell_open(item.entry_url);
                        }}><LinkOutlined />&nbsp;{item.title}</a>} bordered={false} style={{ width: "100%", marginRight: "20px" }}
                            extra={
                                <span>{item.feed_name}&nbsp;{moment(item.time_stamp).format("YYYY-MM-DD")}</span>
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
                )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
            </Layout.Content>
        </Layout>
    )
};

export default observer(MyRssList);