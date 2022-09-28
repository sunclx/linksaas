import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory } from 'react-router-dom';
// import { ReactComponent as Linksvg } from '@/assets/svg/link.svg';
import ChannelHeader from '@/pages/Channel/components/ChannelHeader';
import {
  APP_PROJECT_DOC_PRO_PATH,
  APP_PROJECT_DOC_CB_PATH,
  APP_PROJECT_PATH,
} from '@/utils/constant';
import { useStores } from '@/hooks';

const TopNav = () => {
  const history = useHistory();
  const pathname = history.location.pathname;
  const [activeKey, setActiveKey] = useState(pathname);
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');

  useEffect(() => {
    if (pathname.includes('/app/project/doc')) {
      setActiveKey(APP_PROJECT_DOC_PRO_PATH);
    } else {
      if (pathname === APP_PROJECT_PATH && projectStore.showChannel) {
        setActiveKey(APP_PROJECT_PATH);
      }
    }
  }, [pathname, history]);

  return (
    <div className={s.topnav}>
      <div>
        <Tabs
          className={s.tabs}
          activeKey={activeKey}
          onChange={(key) => {
            if (docStore.editing) {
              docStore.setShowleavePage(true);
              docStore.setNextLocation(key);
              return;
            }
            history.push(docStore.nextLocation || key);
            setActiveKey(key);
            projectStore.setShowChannel(key === APP_PROJECT_PATH ? true : false);
            docStore.setShowProDoc(true);
            docStore.setNextLocation('');
          }}
        >
          <Tabs.TabPane tab="沟通" key={APP_PROJECT_PATH} />
          <Tabs.TabPane tab="知识库" key={APP_PROJECT_DOC_PRO_PATH} />
        </Tabs>
      </div>
      <span />
      <div className={s.right}>
        {pathname === APP_PROJECT_PATH && <ChannelHeader />}
        {pathname.includes(APP_PROJECT_DOC_PRO_PATH) && <div className={s.doc_title}>知识库</div>}
        {pathname.includes(APP_PROJECT_DOC_CB_PATH) && (
          <div className={s.doc_title}>可变内容块管理</div>
        )}
        {/* <Linksvg /> */}
      </div>
    </div>
  );
};

export default TopNav;
