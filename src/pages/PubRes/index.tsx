import React, { useMemo, useState } from 'react';
import s from "./index.module.less";
import { Tabs } from 'antd';
import { AppstoreOutlined, GlobalOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH } from '@/utils/constant';
import AppStorePanel from './components/AppStorePanel';
import { useStores } from '@/hooks';
import { ReactComponent as DockerSvg } from '@/assets/svg/docker.svg';
import DockerTemplatePanel from './components/DockerTemplatePanel';
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
        tab = "pubSearch";
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
                <Tabs.TabPane tab={<h2><SearchOutlined />&nbsp;聚合搜索</h2>} key="pubSearch">
                    {activeKey == "pubSearch" && (
                        <div className={s.content_wrap}>
                            <PubSearchPanel />
                        </div>
                    )}
                </Tabs.TabPane>
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
                {appStore.clientCfg?.item_list.map(item => (
                    <Tabs.TabPane tab={<h2><GlobalOutlined />&nbsp;{item.name}</h2>} key={item.menu_id}>
                        {activeKey == item.menu_id && (
                            <div className={s.content_wrap}>
                                <iframe src={item.url} width="100%" height="100%" />
                            </div>
                        )}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default observer(PubRes);