import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory } from 'react-router-dom';
import ChannelHeader from '@/pages/Channel/components/ChannelHeader';
import {
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_KB_CB_PATH,
  APP_PROJECT_CHAT_PATH,
  APP_PROJECT_KB_PATH,
} from '@/utils/constant';
import { useStores } from '@/hooks';
import { CommentOutlined, FileDoneOutlined } from '@ant-design/icons';

const TopNav = () => {
  const history = useHistory();
  const pathname = history.location.pathname;
  const [activeKey, setActiveKey] = useState(pathname);
  const docSpaceStore = useStores('docSpaceStore');

  useEffect(() => {
    if (pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
      setActiveKey(APP_PROJECT_CHAT_PATH);
    } else {
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
            if (docSpaceStore.inEdit) {
              docSpaceStore.showCheckLeave(() => {
                setActiveKey(key);
                if (key == APP_PROJECT_CHAT_PATH) {
                  history.push(APP_PROJECT_CHAT_PATH);
                } else {
                  history.push(APP_PROJECT_KB_DOC_PATH);
                }
              });
              return;
            }
            setActiveKey(key);
            if (key == APP_PROJECT_CHAT_PATH) {
              history.push(APP_PROJECT_CHAT_PATH);
            } else {
              history.push(APP_PROJECT_KB_DOC_PATH);
            }
          }}
        >
          <Tabs.TabPane tab={<span className={activeKey == APP_PROJECT_CHAT_PATH ? s.tab_chat_active : s.tab_chat}><CommentOutlined />沟通</span>} key={APP_PROJECT_CHAT_PATH} />
          <Tabs.TabPane tab={<span className={activeKey == APP_PROJECT_CHAT_PATH ? s.tab_kb : s.tab_kb_active}><FileDoneOutlined />知识库</span>} key={APP_PROJECT_KB_PATH} />
        </Tabs>
      </div>
      <span />
      <div className={s.right}>
        {pathname.includes(APP_PROJECT_CHAT_PATH) && <ChannelHeader />}
        {pathname.includes(APP_PROJECT_KB_DOC_PATH) && <div className={s.doc_title}>知识库</div>}
        {pathname.includes(APP_PROJECT_KB_CB_PATH) && (
          <div className={s.doc_title}>可变内容块管理</div>
        )}
      </div>
    </div>
  );
};

export default TopNav;
