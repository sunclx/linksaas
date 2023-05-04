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
import UserAppItem from "./UserAppItem";

const UserAppList = () => {
    const userStore = useStores('userStore');

    const [userAppList, setUserAppList] = useState<UserApp[]>();

    const loadUserAppList = async () => {
        const res = await request(list_user_app({ session_id: userStore.sessionId }));
        setUserAppList(res.app_list);
        return res.app_list.length == 0;
    };

    useEffect(() => {
        loadUserAppList();
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
                            <UserAppItem appInfo={item} onRemove={() => loadUserAppList()} />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}

export default observer(UserAppList);