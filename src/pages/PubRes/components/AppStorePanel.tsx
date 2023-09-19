import { Card, Form, List, Select, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import type { AppInfo, MajorCate, MinorCate, SubMinorCate } from "@/api/appstore";
import { list_major_cate, list_minor_cate, list_sub_minor_cate, list_app, agree_app, cancel_agree_app, OS_SCOPE_LINUX, OS_SCOPE_MAC, OS_SCOPE_WINDOWS, SORT_KEY_UPDATE_TIME, SORT_KEY_INSTALL_COUNT, SORT_KEY_AGREE_COUNT } from "@/api/appstore";
import { request } from "@/utils/request";
import { platform } from '@tauri-apps/api/os';
import { useStores } from "@/hooks";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import AsyncImage from "@/components/AsyncImage";
import { ReadOnlyEditor } from "@/components/Editor";
import { CommentOutlined, DownloadOutlined, HeartTwoTone } from "@ant-design/icons";
import { observer } from 'mobx-react';

const PAGE_SIZE = 20;

const AppStorePanel = () => {
    const userStore = useStores('userStore');
    const appStore = useStores('appStore');
    const pubResStore = useStores('pubResStore');

    const [appList, setAppList] = useState<AppInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const [majorCateList, setMajorCateList] = useState<MajorCate[]>([]);
    const [minorCateList, setMinorCateList] = useState<MinorCate[]>([]);
    const [subMinorCateList, setSubMinorCateList] = useState<SubMinorCate[]>([]);

    const loadMajorCate = async () => {
        const res = await request(list_major_cate({}));
        setMajorCateList(res.cate_info_list);
    };

    const loadMinorCate = async () => {
        setMinorCateList([]);
        if (pubResStore.appMajorCateId != "") {
            const res = await request(list_minor_cate({ major_cate_id: pubResStore.appMajorCateId }));
            setMinorCateList(res.cate_info_list);
        }
    }

    const loadSubMinorCate = async () => {
        setSubMinorCateList([]);
        if (pubResStore.appMinorCateId != "") {
            const res = await request(list_sub_minor_cate({ minor_cate_id: pubResStore.appMinorCateId }));
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
                filter_by_major_cate_id: pubResStore.appMajorCateId != "",
                major_cate_id: pubResStore.appMajorCateId,
                filter_by_minor_cate_id: pubResStore.appMinorCateId != "",
                minor_cate_id: pubResStore.appMinorCateId,
                filter_by_sub_minor_cate_id: pubResStore.appSubMinorCateId != "",
                sub_minor_cate_id: pubResStore.appSubMinorCateId,
                filter_by_app_scope: false,
                app_scope: 0,
                filter_by_os_scope: true,
                os_scope: osScope,
                filter_by_keyword: pubResStore.appKeyword.trim() != "",
                keyword: pubResStore.appKeyword.trim(),
            },
            offset: pubResStore.appCurPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            sort_key: pubResStore.appSortKey,
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

    const agreeApp = async (appId: string, newAgree: boolean) => {
        if (newAgree) {
            await request(agree_app({
                session_id: userStore.sessionId,
                app_id: appId,
            }));
        } else {
            await request(cancel_agree_app({
                session_id: userStore.sessionId,
                app_id: appId,
            }));
        }
        const tmpList = appList.slice();
        const index = tmpList.findIndex(item => item.app_id == appId);
        if (index != -1) {
            tmpList[index].my_agree = newAgree;
            if (newAgree) {
                tmpList[index].agree_count += 1;
            } else {
                if (tmpList[index].agree_count > 0) {
                    tmpList[index].agree_count -= 1;
                }
            }
            setAppList(tmpList);
        }
    };

    useEffect(() => {
        loadMajorCate();
    }, []);

    useEffect(() => {
        pubResStore.appMinorCateId = "";
        loadMinorCate();
    }, [pubResStore.appMajorCateId]);

    useEffect(() => {
        pubResStore.appSubMinorCateId = "";
        loadSubMinorCate();
    }, [pubResStore.appMinorCateId]);

    useEffect(() => {
        loadAppList();
    }, [pubResStore.appCurPage]);

    useEffect(() => {
        if (pubResStore.appCurPage != 0) {
            pubResStore.appCurPage = 0;
        } else {
            loadAppList();
        }
    }, [pubResStore.appMajorCateId, pubResStore.appMinorCateId, pubResStore.appSubMinorCateId, pubResStore.appKeyword, pubResStore.appSortKey, pubResStore.showAppId]);

    return (
        <Card bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <Form layout="inline">
                    <Form.Item label="一级分类">
                        <Select style={{ width: "100px" }} value={pubResStore.appMajorCateId} onChange={value => pubResStore.appMajorCateId = value}>
                            <Select.Option value="">全部</Select.Option>
                            {majorCateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="二级分类">
                        <Select style={{ width: "100px" }} value={pubResStore.appMinorCateId} onChange={value => pubResStore.appMinorCateId = value}>
                            <Select.Option value="">全部</Select.Option>
                            {minorCateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="三级分类">
                        <Select style={{ width: "100px" }} value={pubResStore.appSubMinorCateId} onChange={value => pubResStore.appSubMinorCateId = value}>
                            <Select.Option value="">全部</Select.Option>
                            {subMinorCateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="关键词">
                        <Input style={{ width: 150 }} value={pubResStore.appKeyword} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            pubResStore.appKeyword = e.target.value.trim();
                        }} />
                    </Form.Item>
                    <Form.Item label="排序">
                        <Select value={pubResStore.appSortKey} onChange={value => pubResStore.appSortKey = value}>
                            <Select.Option value={SORT_KEY_UPDATE_TIME}>更新时间</Select.Option>
                            <Select.Option value={SORT_KEY_INSTALL_COUNT}>安装数量</Select.Option>
                            <Select.Option vaule={SORT_KEY_AGREE_COUNT}>点赞数量</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            }>
            <List rowKey="app_id" dataSource={appList}
                grid={{ gutter: 16, column: 3 }}
                renderItem={app => (
                    <List.Item>
                        <Card style={{ flex: 1 }} bordered={false} title={
                            <a style={{ fontSize: "16px", fontWeight: 600 }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                pubResStore.showAppId = app.app_id;
                            }}>{app.base_info.app_name}</a>
                        }
                            bodyStyle={{ display: "flex" }} extra={
                                <Space style={{ fontSize: "18px" }} size="middle">
                                    <div><DownloadOutlined />&nbsp;{app.install_count}</div>
                                    <div><CommentOutlined />&nbsp;{app.comment_count}</div>
                                    <div style={{ width: "20px" }} />
                                    <div onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        agreeApp(app.app_id, !app.my_agree);
                                    }}>
                                        <a>
                                            <HeartTwoTone twoToneColor={app.my_agree ? ["red", "red"] : ["#e4e4e8", "#e4e4e8"]} />
                                        </a>
                                        &nbsp;{app.agree_count}
                                    </div>
                                </Space>
                            }>
                            <AsyncImage style={{ width: "80px", height: "80px", cursor: "pointer" }}
                                src={adjustUrl(app.base_info.icon_file_id)} fallback={defaultIcon} preview={false} useRawImg={false}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    pubResStore.showAppId = app.app_id;
                                }} />
                            <div style={{ marginLeft: "20px", height: "120px", overflowY: "scroll", width: "100%" }}>
                                <ReadOnlyEditor content={app.base_info.app_desc} />
                            </div>
                        </Card>
                    </List.Item>
                )} pagination={{ total: totalCount, current: pubResStore.appCurPage + 1, pageSize: PAGE_SIZE, onChange: (page) => pubResStore.appCurPage = (page - 1) }} />

        </Card>
    );
};

export default observer(AppStorePanel);