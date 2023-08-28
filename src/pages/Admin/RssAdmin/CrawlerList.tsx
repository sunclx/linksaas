import { Card, Space, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import type { AdminPermInfo } from '@/api/admin_auth';
import type { Crawler } from '@/api/rss_admin';
import { list_crawler, remove_crawler, renew_crawler_token } from '@/api/rss_admin';
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import Button from "@/components/Button";
import AddCrawlerModal from "./components/AddCrawlerModal";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";
import UpdateCrawlerTimeModal from "./components/UpdateCrawlerTimeModal";

const CrawlerList = () => {

    const [crawlerList, setCrawlerList] = useState<Crawler[]>([]);
    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [updateTimeCrawler, setUpdateTimeCrawler] = useState<Crawler | null>(null);

    const loadCrawlerList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_crawler({
            admin_session_id: sessionId,
        }));
        setCrawlerList(res.crawler_list);
    };

    const updateToken = async (crawlerId: string) => {
        const sessionId = await get_admin_session();
        const token = uniqId();
        await request(renew_crawler_token({
            admin_session_id: sessionId,
            crawler_id: crawlerId,
            token: token,
        }));
        const tmpList = crawlerList.slice();
        const index = tmpList.findIndex(item => item.crawler_id == crawlerId);
        if (index != -1) {
            tmpList[index].token = token;
            setCrawlerList(tmpList);
        }
        message.info("更新密钥成功");
    }

    const removeCrawler = async (crawlerId: string) => {
        const sessionId = await get_admin_session();
        await request(remove_crawler({
            admin_session_id: sessionId,
            crawler_id: crawlerId,
        }));
        await loadCrawlerList();
        message.info("删除爬虫成功");
    };

    const columns: ColumnsType<Crawler> = [
        {
            title: "爬虫ID",
            width: 180,
            dataIndex: "crawler_id",
        },
        {
            title: "爬虫密钥",
            width: 200,
            render: (_, row: Crawler) => (
                <Space>
                    <span>{row.token}</span>
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!(permInfo?.rss_perm.upate_crawler ?? false)}
                        title="更新密钥"
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            updateToken(row.crawler_id);
                        }}><SyncOutlined /></Button>
                </Space>
            ),
        },
        {
            title: "执行时间点",
            render: (_, row: Crawler) => (
                <Space>
                    {row.run_time_of_day_list.map(hour => (
                        <Tag key={hour}>每天{hour}点</Tag>
                    ))}
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!(permInfo?.rss_perm.upate_crawler ?? false)}
                        title="修改执行时间点"
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setUpdateTimeCrawler(row);
                        }}><EditOutlined /></Button>
                </Space>
            )
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: Crawler) => (
                <Button type="link" disabled={!(permInfo?.rss_perm.remove_crawler ?? false)} danger
                    style={{ minWidth: 0, padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeCrawler(row.crawler_id);
                    }}>删除</Button>
            ),
        }
    ];
    useEffect(() => {
        loadCrawlerList();
    }, []);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card title="资讯爬虫列表" extra={
            <Button disabled={!(permInfo?.rss_perm.add_crawler ?? false)} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setShowAdd(true);
            }}>新增爬虫</Button>
        }>
            <Table rowKey="crawler_id" columns={columns} dataSource={crawlerList} pagination={false}
                scroll={{ y: "calc(100vh - 110px)" }} style={{ height: "calc(100vh - 104px)" }} />
            {showAdd == true && (
                <AddCrawlerModal onCancel={() => setShowAdd(false)} onOk={() => {
                    loadCrawlerList();
                    setShowAdd(false);
                }} />
            )}
            {updateTimeCrawler != null && (
                <UpdateCrawlerTimeModal crawlerId={updateTimeCrawler.crawler_id} hourList={updateTimeCrawler.run_time_of_day_list}
                    onCancel={() => setUpdateTimeCrawler(null)} onOk={() => {
                        loadCrawlerList();
                        setUpdateTimeCrawler(null);
                    }} />
            )}
        </Card>
    )
};

export default CrawlerList;