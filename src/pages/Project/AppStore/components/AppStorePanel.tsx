import SelectAppCate from "@/pages/Admin/AppAdmin/components/SelectAppCate";
import { Card, List } from "antd";
import React, { useEffect, useState } from "react";
import type { AppInfo } from "@/api/appstore";
import { APP_SCOPE_PROJECT, OS_SCOPE_LINUX, OS_SCOPE_MAC, OS_SCOPE_WINDOWS } from "@/api/appstore";
import { list_app } from "@/api/appstore";
import { request } from "@/utils/request";
import { platform as get_platform } from '@tauri-apps/api/os';
import Pagination from "@/components/Pagination";
import AppStoreItem from "./AppStoreItem";

const PAGE_SIZE = 12;

interface AppStorePanelProps {
    onAddApp: () => void;
}

const AppStorePanel: React.FC<AppStorePanelProps> = (props) => {
    const [curMajorCateId, setCurMajorCateId] = useState("");
    const [curMinorCateId, setCurMinorCateId] = useState("");
    const [curSubMinorCateId, setCurSubMinorCateId] = useState("");
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [appList, setAppList] = useState<AppInfo[]>([]);

    const loadAppList = async () => {
        let scope = OS_SCOPE_LINUX;
        const platform = await get_platform();
        if (platform.includes("darwin")) {
            scope = OS_SCOPE_MAC;
        } else if (platform.includes("win32")) {
            scope = OS_SCOPE_WINDOWS;
        }
        const res = await request(list_app({
            list_param: {
                filter_by_major_cate_id: curMajorCateId != "",
                major_cate_id: curMajorCateId,
                filter_by_minor_cate_id: curMinorCateId != "",
                minor_cate_id: curMinorCateId,
                filter_by_sub_minor_cate_id: curSubMinorCateId != "",
                sub_minor_cate_id: curSubMinorCateId,
                filter_by_app_scope: true,
                app_scope: APP_SCOPE_PROJECT,
                filter_by_os_scope: true,
                os_scope: scope,
            },
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setAppList(res.app_info_list);
    };

    useEffect(() => {
        loadAppList();
    }, [curMajorCateId, curMinorCateId, curPage]);

    return (
        <Card title={<h2>应用市场</h2>} bordered={false}
            style={{ borderTop: "1px solid #e4e4e8", marginTop: "10px" }}
            extra={
                <SelectAppCate onChange={(majorCateId: string, minorCateId: string, subMinorCateId: string) => {
                    setCurMajorCateId(majorCateId);
                    setCurMinorCateId(minorCateId);
                    setCurSubMinorCateId(subMinorCateId);
                    setCurPage(0);
                }} />
            }>
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                }}
                dataSource={appList}
                renderItem={(item) => (
                    <List.Item key={item.app_id}>
                        <AppStoreItem appInfo={item} onAddApp={() => props.onAddApp()} />
                    </List.Item>
                )}
            />
            <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
        </Card>
    );
};

export default AppStorePanel;