import React, { useMemo, useState } from 'react';
import s from "./index.module.less";
import { Tabs } from 'antd';
import { AppstoreOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH } from '@/utils/constant';
import AppStorePanel from './components/AppStorePanel';
import { useStores } from '@/hooks';
import { ReactComponent as DockerSvg } from '@/assets/svg/docker.svg';
import DockerTemplatePanel from './components/DockerTemplatePanel';
import RssPanel from './components/RssPanel';
import PubSearchPanel from './components/PubSearchPanel';
import { observer } from 'mobx-react';
import AppStoreDetail from './components/AppStoreDetail';
import DockerTemplateDetail from './components/DockerTemplateDetail';


const PubRes = () => {
    const location = useLocation();
    const history = useHistory();

    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const pubResStore = useStores('pubResStore');

    const urlParams = new URLSearchParams(location.search);
    let tab = urlParams.get('tab') ?? "";
    if (tab == "") {
        if (appStore.clientCfg?.enable_pub_search == true) {
            tab = "pubSearch"
        } else if (appStore.clientCfg?.enable_rss == true) {
            tab = "rss"
        } else if (appStore.clientCfg?.enable_pub_app_store == true) {
            tab = "appStore"
        } else if (appStore.clientCfg?.enable_pub_docker_template == true) {
            tab = "dockerTemplate"
        }
    }

    const [activeKey, setActiveKey] = useState(tab);

    useMemo(() => {
        projectStore.setCurProjectId('');
    }, []);

    return (
        <div className={s.tabs_wrap}>
            <Tabs activeKey={activeKey}
                type='card'
                onChange={key => {
                    setActiveKey(key);
                    history.push(`${PUB_RES_PATH}?tab=${key}`);
                }}>
                {appStore.clientCfg?.enable_pub_search == true && (
                    <Tabs.TabPane tab={<h2><SearchOutlined />&nbsp;聚合搜索</h2>} key="pubSearch">
                        {activeKey == "pubSearch" && (
                            <div className={s.content_wrap}>
                                <PubSearchPanel />
                            </div>
                        )}
                    </Tabs.TabPane>
                )}
                {appStore.clientCfg?.enable_rss == true && (
                    <Tabs.TabPane tab={<h2><InfoCircleOutlined />&nbsp;资讯订阅</h2>} key="rss">
                        {activeKey == "rss" && (
                            <div className={s.content_wrap}>
                                <RssPanel />
                            </div>
                        )}
                    </Tabs.TabPane>
                )}
                {appStore.clientCfg?.enable_pub_app_store == true && (
                    <Tabs.TabPane tab={<h2><AppstoreOutlined />&nbsp;应用市场</h2>} key="appStore">
                        {activeKey == "appStore" && (
                            <div className={s.content_wrap}>
                                {pubResStore.showAppId == "" && <AppStorePanel />}
                                {pubResStore.showAppId != "" && <AppStoreDetail />}
                            </div>
                        )}
                    </Tabs.TabPane>
                )}
                {appStore.clientCfg?.enable_pub_docker_template == true && (
                    <Tabs.TabPane tab={<h2><span style={{ display: "inline-block", verticalAlign: "-3px" }}><DockerSvg style={{ width: "16px", height: "16px" }} /></span>&nbsp;Docker模板</h2>} key="dockerTemplate">
                        {activeKey == "dockerTemplate" && (
                            <div className={s.content_wrap}>
                                {pubResStore.dockerAppId == "" && <DockerTemplatePanel />}
                                {pubResStore.dockerAppId != "" && <DockerTemplateDetail />}
                            </div>
                        )}
                    </Tabs.TabPane>
                )}
            </Tabs>
        </div>
    );
};

export default observer(PubRes);