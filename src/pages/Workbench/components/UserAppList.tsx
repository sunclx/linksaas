import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from "./UserAppList.module.less";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { Card, List } from "antd";
import SelectAppCate from "@/pages/Admin/AppAdmin/components/SelectAppCate";
import type { AppInfo as AppInfoInStore } from "@/api/appstore";
import { OS_SCOPE_LINUX, OS_SCOPE_MAC, OS_SCOPE_WINDOWS, APP_SCOPE_USER, list_app as list_store_app } from "@/api/appstore";
import { platform as get_platform } from '@tauri-apps/api/os';
import { request } from "@/utils/request";
import type { App as UserApp } from "@/api/user_app";
import { list as list_user_app } from "@/api/user_app";
import { useStores } from "@/hooks";
import AppStoreItem from "@/pages/Project/AppStore/components/AppStoreItem";
import Pagination from "@/components/Pagination";
import UserAppItem from "./UserAppItem";

const PAGE_SIZE = 12;

const UserAppList = () => {
    const userStore = useStores('userStore');

    const [showAppStore, setShowAppStore] = useState(false);

    const [curMajorCateId, setCurMajorCateId] = useState("");
    const [curMinorCateId, setCurMinorCateId] = useState("");
    const [curSubMinorCateId, setCurSubMinorCateId] = useState("");
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [appInStoreList, setAppInStoreList] = useState<AppInfoInStore[]>([]);

    const [userAppList, setUserAppList] = useState<UserApp[]>();

    const loadUserAppList = async () => {
        const res = await request(list_user_app({ session_id: userStore.sessionId }));
        setUserAppList(res.app_list);
        return res.app_list.length == 0;
    };

    const loadAppInStoreList = async () => {
        let scope = OS_SCOPE_LINUX;
        const platform = await get_platform();
        if (platform.includes("darwin")) {
            scope = OS_SCOPE_MAC;
        } else if (platform.includes("win32")) {
            scope = OS_SCOPE_WINDOWS;
        }
        const res = await request(list_store_app({
            list_param: {
                filter_by_major_cate_id: curMajorCateId != "",
                major_cate_id: curMajorCateId,
                filter_by_minor_cate_id: curMinorCateId != "",
                minor_cate_id: curMinorCateId,
                filter_by_sub_minor_cate_id: curSubMinorCateId != "",
                sub_minor_cate_id: curSubMinorCateId,
                filter_by_app_scope: true,
                app_scope: APP_SCOPE_USER,
                filter_by_os_scope: true,
                os_scope: scope,
            },
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setAppInStoreList(res.app_info_list);
    };

    useEffect(() => {
        if (showAppStore == true) {
            if (curMajorCateId == "" && curMinorCateId == "" && curSubMinorCateId == "" && curPage == 0) {
                loadAppInStoreList();
            } else {
                setCurMajorCateId("");
                setCurMinorCateId("");
                setCurSubMinorCateId("");
                setCurPage(0);
            }
        }
    }, [showAppStore]);

    useEffect(() => {
        loadAppInStoreList();
    }, [curMajorCateId, curMinorCateId, curSubMinorCateId, curPage]);

    useEffect(() => {
        loadUserAppList().then(empty => {
            if (empty == true) {
                setShowAppStore(true);
            }
        });
    }, []);

    return (
        <div className={s.panel_wrap}>
            <div className={s.user_app_wrap}>
                <List
                    grid={{
                        gutter: 16,
                    }}
                    dataSource={userAppList}
                    renderItem={(item) => (
                        <List.Item key={item.app_id}>
                            <UserAppItem appInfo={item} onRemove={() => loadUserAppList().then(empty => {
                                if (empty) {
                                    setShowAppStore(true);
                                }
                            })} />
                        </List.Item>
                    )}
                />
            </div>
            <div className={s.split_bar}>
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAppStore(!showAppStore);
                }}>
                    <div style={{ paddingLeft: "6px" }}>
                        {showAppStore == true && (
                            <DoubleRightOutlined />
                        )}
                        {showAppStore == false && (
                            <DoubleLeftOutlined />
                        )}
                    </div>
                    <span className={s.title}>应用市场</span>
                </a>
            </div>
            {showAppStore == true && (
                <div className={s.app_store_wrap}>
                    <Card bordered={false}
                        extra={
                            <SelectAppCate onChange={(majorCateId: string, minorCateId: string, subMinorCateId: string) => {
                                setCurMajorCateId(majorCateId);
                                setCurMinorCateId(minorCateId);
                                setCurSubMinorCateId(subMinorCateId);
                                setCurPage(0);
                            }} />
                        }>
                        <div className={s.app_list_wrap}>
                            <List
                                grid={{
                                    gutter: 16,
                                }}
                                dataSource={appInStoreList}
                                renderItem={(item) => (
                                    <List.Item key={item.app_id}>
                                        <AppStoreItem appInfo={item} onAddApp={() => loadUserAppList()} />
                                    </List.Item>
                                )}
                            />
                            <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default observer(UserAppList);