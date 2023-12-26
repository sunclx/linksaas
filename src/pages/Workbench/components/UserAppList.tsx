import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from "./UserAppList.module.less";
import { List } from "antd";
import { request } from "@/utils/request";
import type { AppInfo } from "@/api/appstore";
import { list_app_by_id } from "@/api/appstore";
import { list as list_user_app } from "@/api/user_app";
import { useStores } from "@/hooks";
import UserAppItem from "./UserAppItem";

const UserAppList = () => {
    const userStore = useStores('userStore');

    const [userAppList, setUserAppList] = useState<AppInfo[]>();

    const loadUserAppList = async () => {
        const appIdList = await list_user_app();
        const res = await request(list_app_by_id({
            app_id_list:appIdList,
            session_id: userStore.sessionId,
        }));
        setUserAppList(res.app_info_list);
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