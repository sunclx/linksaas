import React, { useState } from 'react';
import s from "./index.module.less";
import { Tabs } from 'antd';
import { AppstoreOutlined, BookOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH } from '@/utils/constant';
import AppStorePanel from './components/AppStorePanel';
import BookStorePanel from './components/BookStorePanel';

import { useStores } from '@/hooks';
import { ReactComponent as DockerSvg } from '@/assets/svg/docker.svg';
import DockerTemplatePanel from './components/DockerTemplatePanel';

const PubRes = () => {
    const location = useLocation();
    const history = useHistory();
    const appStore = useStores('appStore');

    const urlParams = new URLSearchParams(location.search);
    let tab = urlParams.get('tab') ?? "";
    if (tab == "") {
        if (appStore.clientCfg?.enable_pub_app_store == true) {
            tab = "appStore"
        } else if (appStore.clientCfg?.enable_pub_book_store == true) {
            tab = "bookStore"
        } else if (appStore.clientCfg?.enable_pub_docker_template == true) {
            tab = "dockerTemplate"
        }
    }

    const [activeKey, setActiveKey] = useState(tab);

    return (
        <div className={s.tabs_wrap}>
            <Tabs activeKey={activeKey}
                type='card'
                onChange={key => {
                    setActiveKey(key);
                    history.push(`${PUB_RES_PATH}?tab=${key}`);
                }}>
                {appStore.clientCfg?.enable_pub_app_store == true && (
                    <Tabs.TabPane tab={<h2><AppstoreOutlined />&nbsp;应用</h2>} key="appStore">
                        {activeKey == "appStore" && (
                            <div className={s.content_wrap}>
                                <AppStorePanel />
                            </div>
                        )}
                    </Tabs.TabPane>
                )}
                {appStore.clientCfg?.enable_pub_book_store == true && (
                    <Tabs.TabPane tab={<h2><BookOutlined />&nbsp;书籍</h2>} key="bookStore">
                        {activeKey == "bookStore" && (
                            <div className={s.content_wrap}>
                                <BookStorePanel />
                            </div>
                        )}
                    </Tabs.TabPane>
                )}
                {appStore.clientCfg?.enable_pub_docker_template == true && (
                    <Tabs.TabPane tab={<h2><DockerSvg style={{ width: "14px", height: "14px" }} />&nbsp;Docker模板</h2>} key="dockerTemplate">
                        {activeKey == "dockerTemplate" && (
                            <div className={s.content_wrap}>
                                <DockerTemplatePanel />
                            </div>
                        )}
                    </Tabs.TabPane>
                )}
            </Tabs>
        </div>
    );
};

export default PubRes;