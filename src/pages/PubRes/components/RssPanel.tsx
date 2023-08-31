import { Button, Card, Form, Input, Layout, List, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import type { FeedCate, Feed } from "@/api/rss";
import { list_cate, list_feed } from "@/api/rss";
import { watch, unwatch } from "@/api/user_rss";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import s from "./RssPanel.module.less";
import classNames from 'classnames';
import { open as shell_open } from '@tauri-apps/api/shell';
import moment from 'moment';
import RssFeedModal from "./RssFeedModal";
import { LinkOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const PAGE_SIZE = 12;

const RssPanel = () => {
    const userStore = useStores('userStore');

    const [cateList, setCateList] = useState<FeedCate[]>([]);
    const [curCateId, setCurCateId] = useState("");
    const [feedList, setFeedList] = useState<Feed[]>([]);
    const [totalFeedCount, setTotalFeedCount] = useState(0);
    const [curFeedPage, setCurFeedPage] = useState(0);

    const [showFeedItem, setShowFeedItem] = useState<Feed | null>(null);

    const [keyword, setKeyword] = useState("");

    const loadCateList = async () => {
        const res = await request(list_cate({
            session_id: userStore.sessionId,
        }));
        setCateList(res.cate_list);
        if (res.cate_list.length > 0) {
            const index = res.cate_list.findIndex(item => item.cate_id == curCateId);
            if (index == -1) {
                setCurCateId(res.cate_list[0].cate_id);
                setCurFeedPage(0);
            }
        }
    };

    const loadFeedList = async () => {
        const res = await request(list_feed({
            session_id: userStore.sessionId,
            cate_id: curCateId,
            filter_by_keyword: keyword != "",
            keyword: keyword,
            offset: PAGE_SIZE * curFeedPage,
            limit: PAGE_SIZE,
        }));
        setTotalFeedCount(res.total_count);
        setFeedList(res.feed_list);
    };

    const unwatchFeed = async (feedId: string) => {
        await request(unwatch({
            session_id: userStore.sessionId,
            feed_id: feedId,
        }));
        message.info("取消订阅成功");
        const tmpList = feedList.slice();
        const index = tmpList.findIndex(item => item.feed_id == feedId);
        if (index != -1) {
            tmpList[index].my_watch = false;
            setFeedList(tmpList);
        }
        if (showFeedItem != null && showFeedItem.feed_id == feedId) {
            setShowFeedItem({ ...showFeedItem, my_watch: false })
        }
    };

    const watchFeed = async (feedId: string) => {
        await request(watch({
            session_id: userStore.sessionId,
            feed_id: feedId,
        }));
        message.info("订阅成功");
        const tmpList = feedList.slice();
        const index = tmpList.findIndex(item => item.feed_id == feedId);
        if (index != -1) {
            tmpList[index].my_watch = true;
            setFeedList(tmpList);
        }
        if (showFeedItem != null && showFeedItem.feed_id == feedId) {
            setShowFeedItem({ ...showFeedItem, my_watch: true })
        }
    };

    useEffect(() => {
        loadCateList();
    }, []);

    useEffect(() => {
        if (curCateId != "") {
            loadFeedList();
        }
    }, [curCateId, curFeedPage, keyword]);

    return (
        <Layout>
            <Layout.Sider width="200px" theme="light">
                <List rowKey="cate_id" dataSource={cateList}
                    style={{ height: "calc(100vh - 130px)", overflowY: "scroll", overflowX: "hidden", borderRight: "1px solid #e4e4e8", marginRight: "10px" }}
                    renderItem={item => (
                        <List.Item className={classNames(s.item, curCateId == item.cate_id ? s.item_active : "")}>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setCurCateId(item.cate_id);
                                setCurFeedPage(0);
                            }}>{item.cate_name}({item.feed_count})</Button>
                        </List.Item>
                    )} />
            </Layout.Sider>
            <Layout.Content style={{ background: "white" }}>
                <Card extra={
                    <Form layout="inline">
                        <Form.Item label="关键词">
                            <Input value={keyword} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setKeyword(e.target.value.trim());
                                setCurFeedPage(0);
                            }} allowClear />
                        </Form.Item>
                        <Form.Item>
                            <Link to={"/app/workbench?tab=myRss&userAction=true"}>查看我的订阅</Link>
                        </Form.Item>
                    </Form>
                }>
                    <List rowKey="feed_id" dataSource={feedList} grid={{ gutter: 16 }}
                        style={{ height: "calc(100vh - 200px)", overflowY: "scroll", overflowX: "hidden" }}
                        renderItem={item => (
                            <List.Item>
                                <Card title={<a title={item.feed_name} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowFeedItem(item);
                                }}>{item.feed_name}</a>} style={{ width: "250px", height: "280px" }}
                                    extra={
                                        <Button type={item.my_watch ? "link" : "primary"} onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (item.my_watch) {
                                                unwatchFeed(item.feed_id);
                                            } else {
                                                watchFeed(item.feed_id);
                                            }
                                        }}>{item.my_watch ? "取消订阅" : "订阅"}</Button>
                                    }>
                                    <Form labelCol={{ span: 7 }}>
                                        <Form.Item label="网站地址" style={{ overflow: "hidden" }}>
                                            <a onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                shell_open(item.root_url);
                                            }} title={item.root_url} style={{ whiteSpace: "nowrap" }}><LinkOutlined />&nbsp;{item.root_url}</a>
                                        </Form.Item>
                                        <Form.Item label="文章数量">
                                            <a onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setShowFeedItem(item);
                                            }}>{item.entry_count}</a>
                                        </Form.Item>
                                        {item.entry_count > 0 && (
                                            <>
                                                <Form.Item label="最新文章" style={{ overflow: "hidden", height: "28px" }}>
                                                    <a onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        shell_open(item.last_entry_url);
                                                    }} title={item.last_title} style={{ whiteSpace: "nowrap" }}><LinkOutlined />&nbsp;{item.last_title}</a>
                                                </Form.Item>
                                                <Form.Item label="更新时间">
                                                    {moment(item.last_time_stamp).format("YYYY-MM-DD")}
                                                </Form.Item>
                                            </>
                                        )}
                                        {item.tag_list.length > 0 && (
                                            <Form.Item label="标签">
                                                <Space>
                                                    {item.tag_list.map(tag => (
                                                        <div key={tag}>{tag}</div>
                                                    ))}
                                                </Space>
                                            </Form.Item>
                                        )}
                                    </Form>
                                </Card>
                            </List.Item>
                        )} pagination={{ pageSize: PAGE_SIZE, total: totalFeedCount, current: curFeedPage + 1, onChange: page => setCurFeedPage(page - 1), hideOnSinglePage: true, showSizeChanger: false }} />
                </Card>
            </Layout.Content>
            {showFeedItem != null && (
                <RssFeedModal feedId={showFeedItem.feed_id} feedName={showFeedItem.feed_name} myWatch={showFeedItem.my_watch}
                    onCancel={() => setShowFeedItem(null)} onUnWatch={() => unwatchFeed(showFeedItem.feed_id)} onWatch={() => watchFeed(showFeedItem.feed_id)} />
            )}
        </Layout>
    );
};

export default RssPanel;