import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory } from 'react-router-dom';
// import { ReactComponent as Linksvg } from '@/assets/svg/link.svg';
import ChannelHeader from '@/pages/Channel/components/ChannelHeader';
import {
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_KB_CB_PATH,
  APP_PROJECT_CHAT_PATH,
  APP_PROJECT_KB_PATH,
} from '@/utils/constant';
import { useStores } from '@/hooks';

const TopNav = () => {
  const history = useHistory();
  const pathname = history.location.pathname;
  const [activeKey, setActiveKey] = useState(pathname);
  // const docStore = useStores('docStore');

  useEffect(() => {
    if(pathname.startsWith(APP_PROJECT_CHAT_PATH)){
      setActiveKey(APP_PROJECT_CHAT_PATH);
    }else{
      setActiveKey(APP_PROJECT_KB_PATH);
    }
  }, [pathname, history]);

  return (
    <div className={s.topnav}>
      <div>
        <Tabs
          className={s.tabs}
          activeKey={activeKey}
          onChange={(key) => {
            // if (docStore.editing) {
            //   docStore.setShowleavePage(true);
            //   docStore.setNextLocation(key);
            //   return;
            // }
            setActiveKey(key);
            if(key == APP_PROJECT_CHAT_PATH){
              history.push(APP_PROJECT_CHAT_PATH);
            }else{
              history.push(APP_PROJECT_KB_DOC_PATH);
            }
          }}
        >
          <Tabs.TabPane tab="沟通" key={APP_PROJECT_CHAT_PATH} />
          <Tabs.TabPane tab="知识库" key={APP_PROJECT_KB_PATH} />
        </Tabs>
      </div>
      <span />
      <div className={s.right}>
        {pathname === APP_PROJECT_CHAT_PATH && <ChannelHeader />}
        {pathname.includes(APP_PROJECT_KB_DOC_PATH) && <div className={s.doc_title}>知识库</div>}
        {pathname.includes(APP_PROJECT_KB_CB_PATH) && (
          <div className={s.doc_title}>可变内容块管理</div>
        )}
        {/* <Linksvg /> */}
      </div>
    </div>
  );
};

export default TopNav;
