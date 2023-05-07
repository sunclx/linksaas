import React, { useState } from 'react';
import s from "./index.module.less";
import { Tabs } from 'antd';
import { AppstoreOutlined, BookOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH } from '@/utils/constant';
import AppStorePanel from './components/AppStorePanel';
import BookStorePanel from './components/BookStorePanel';

const PubRes = () => {
    const location = useLocation();
    const history = useHistory();

    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab') ?? "appStore";

    const [activeKey, setActiveKey] = useState(tab);

    return (
        <div className={s.tabs_wrap}>
            <Tabs activeKey={activeKey}
                type='card'
                onChange={key => {
                    setActiveKey(key);
                    history.push(`${PUB_RES_PATH}?tab=${key}`);
                }}>
                <Tabs.TabPane tab={<h2><AppstoreOutlined />&nbsp;应用</h2>} key="appStore">
                    {activeKey == "appStore" && (
                        <div className={s.content_wrap}>
                            <AppStorePanel />
                        </div>
                    )}
                </Tabs.TabPane>
                <Tabs.TabPane tab={<h2><BookOutlined />&nbsp;书籍</h2>} key="bookStore">
                    {activeKey == "bookStore" && (
                        <div className={s.content_wrap}>
                            <BookStorePanel/>
                        </div>
                    )}
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default PubRes;