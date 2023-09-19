import { Card, Form, List, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import type { AppInfo, MajorCate, MinorCate, SubMinorCate } from "@/api/appstore";
import { list_major_cate, list_minor_cate, list_sub_minor_cate, list_app, OS_SCOPE_LINUX, OS_SCOPE_MAC, OS_SCOPE_WINDOWS, SORT_KEY_UPDATE_TIME } from "@/api/appstore";
import { request } from "@/utils/request";
import { platform } from '@tauri-apps/api/os';
import { useStores } from "@/hooks";
import AppInfoModal from "./AppInfoModal";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import AsyncImage from "@/components/AsyncImage";

const PAGE_SIZE = 20;

const AppStorePanel = () => {
    const userStore = useStores('userStore');
    const appStore = useStores('appStore');

    const [appList, setAppList] = useState<AppInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [majorCateId, setMajorCateId] = useState("");
    const [majorCateList, setMajorCateList] = useState<MajorCate[]>([]);
    const [minorCateId, setMinorCateId] = useState("");
    const [minorCateList, setMinorCateList] = useState<MinorCate[]>([]);
    const [subMinorCateId, setSubMinorCateId] = useState("");
    const [subMinorCateList, setSubMinorCateList] = useState<SubMinorCate[]>([]);
    const [keyword, setKeyword] = useState("");

    const [showAppInfo, setShowAppInfo] = useState<AppInfo | null>(null);

    const loadMajorCate = async () => {
        const res = await request(list_major_cate({}));
        setMajorCateList(res.cate_info_list);
    };

    const loadMinorCate = async () => {
        setMinorCateList([]);
        if (majorCateId != "") {
            const res = await request(list_minor_cate({ major_cate_id: majorCateId }));
            setMinorCateList(res.cate_info_list);
        }
    }

    const loadSubMinorCate = async () => {
        setSubMinorCateList([]);
        if (minorCateId != "") {
            const res = await request(list_sub_minor_cate({ minor_cate_id: minorCateId }));
            setSubMinorCateList(res.cate_info_list);
        }
    };

    const loadAppList = async () => {
        let osScope = OS_SCOPE_LINUX;
        const p = await platform();
        if ("darwin" == p) {
            osScope = OS_SCOPE_MAC;
        } else if ("win32" == p) {
            osScope = OS_SCOPE_WINDOWS;
        }
        const res = await request(list_app({
            list_param: {
                filter_by_major_cate_id: majorCateId != "",
                major_cate_id: majorCateId,
                filter_by_minor_cate_id: minorCateId != "",
                minor_cate_id: minorCateId,
                filter_by_sub_minor_cate_id: subMinorCateId != "",
                sub_minor_cate_id: subMinorCateId,
                filter_by_app_scope: false,
                app_scope: 0,
                filter_by_os_scope: true,
                os_scope: osScope,
                filter_by_keyword: keyword.trim() != "",
                keyword: keyword.trim(),
            },
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            sort_key: SORT_KEY_UPDATE_TIME,
            session_id: userStore.sessionId,
        }));
        setTotalCount(res.total_count);
        setAppList(res.app_info_list);
    };

    const adjustUrl = (fileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${fileId}/icon.png`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${fileId}/icon.png`;
        }
    }

    useEffect(() => {
        loadMajorCate();
    }, []);

    useEffect(() => {
        setMinorCateId("");
        loadMinorCate();
    }, [majorCateId]);

    useEffect(() => {
        setSubMinorCateId("");
        loadSubMinorCate();
    }, [minorCateId]);

    useEffect(() => {
        loadAppList();
    }, [curPage]);

    useEffect(() => {
        if (curPage != 0) {
            setCurPage(0);
        } else {
            loadAppList();
        }
    }, [majorCateId, minorCateId, subMinorCateId, keyword]);

    return (
        <Card bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <Form layout="inline">
                    <Form.Item label="一级分类">
                        <Select style={{ width: "100px" }} value={majorCateId} onChange={value => setMajorCateId(value)}>
                            <Select.Option value="">全部</Select.Option>
                            {majorCateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="二级分类">
                        <Select style={{ width: "100px" }} value={minorCateId} onChange={value => setMinorCateId(value)}>
                            <Select.Option value="">全部</Select.Option>
                            {minorCateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="三级分类">
                        <Select style={{ width: "100px" }} value={subMinorCateId} onChange={value => setSubMinorCateId(value)}>
                            <Select.Option value="">全部</Select.Option>
                            {subMinorCateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="关键词">
                        <Input style={{ width: 150 }} value={keyword} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setKeyword(e.target.value.trim());
                        }} />
                    </Form.Item>
                </Form>
            }>
            <List rowKey="app_id" dataSource={appList}
                grid={{ gutter: 16 }}
                renderItem={app => (
                    <Card title={<h3 title={app.base_info.app_name}>{app.base_info.app_name}</h3>} style={{ width: "100px", margin: "10px 10px" }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAppInfo(app);
                    }}>
                        <AsyncImage style={{ width: "80px", height: "80px", cursor: "pointer" }}
                            src={adjustUrl(app.base_info.icon_file_id)} fallback={defaultIcon} preview={false} useRawImg={false} />
                    </Card>
                )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: (page) => setCurPage(page - 1) }} />

            {showAppInfo != null && (
                <AppInfoModal appInfo={showAppInfo} onCancel={() => setShowAppInfo(null)} />
            )}
        </Card>
    );
};

export default AppStorePanel;