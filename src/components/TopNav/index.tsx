import { Button, Tabs, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import ChannelHeader from '@/pages/Channel/components/ChannelHeader';
import {
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_CHAT_PATH,
  APP_PROJECT_KB_PATH,
  APP_PROJECT_KB_BOOK_SHELF_PATH,
} from '@/utils/constant';
import { useStores } from '@/hooks';
import { CommentOutlined, FileDoneOutlined, SettingOutlined } from '@ant-design/icons';
import SearchBar from '../SearchBar';
import { LAYOUT_TYPE_CHAT, LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB, LAYOUT_TYPE_KB_AND_CHAT } from '@/api/project';
import { observer } from 'mobx-react';
import classNames from 'classnames';

const SettingBtn = observer(() => {
  const appStore = useStores('appStore');
  const projectStore = useStores('projectStore');

  return (
    <div className={s.setting_btn_wrap}>
      {projectStore.isAdmin && (
        <Tooltip title="项目设置" placement='left' color='orange' overlayInnerStyle={{ color: 'black', marginTop: "10px" }} open={appStore.showProjectSetting}>
          <Button type="link" className={s.setting_btn} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            appStore.showProjectSetting = true;
          }}><SettingOutlined /></Button>
        </Tooltip>
      )}
    </div>
  );
});

const TopNav = () => {
  const history = useHistory();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);

  const appStore = useStores('appStore');
  const docSpaceStore = useStores('docSpaceStore');
  const projectStore = useStores('projectStore');

  const chatTabPanel = (
    <Tabs.TabPane tab={
      <Tooltip title="主界面: 沟通面板" open={appStore.showProjectSetting}
        placement={projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_KB_AND_CHAT ? "right" : "left"} color="orange" overlayInnerStyle={{ color: 'black' }}>
        <span className={activeKey == APP_PROJECT_CHAT_PATH ? s.tab_chat_active : s.tab_chat}><CommentOutlined />沟通</span>
      </Tooltip>
    } key={APP_PROJECT_CHAT_PATH} />);

  const kbTabPanel = (
    <Tabs.TabPane tab={
      <Tooltip title="主界面: 知识库面板" open={appStore.showProjectSetting}
        placement={projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_CHAT_AND_KB ? "right" : "left"} color="orange" overlayInnerStyle={{ color: 'black' }}>
        <span className={activeKey == APP_PROJECT_CHAT_PATH ? s.tab_kb : s.tab_kb_active}><FileDoneOutlined />知识库</span>
      </Tooltip>
    } key={APP_PROJECT_KB_PATH} />);

  useEffect(() => {
    if (location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
      setActiveKey(APP_PROJECT_CHAT_PATH);
    } else {
      setActiveKey(APP_PROJECT_KB_PATH);
    }
  }, [location.pathname, history]);

  return (
    <div className={s.topnav}>
      <div>
        <Tabs
          className={classNames(s.tabs, [LAYOUT_TYPE_CHAT, LAYOUT_TYPE_KB].includes(projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB) ? s.single : s.multi)}
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
          {projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_CHAT_AND_KB && (
            <>
              {chatTabPanel}
              {kbTabPanel}
            </>
          )}
          {projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_KB_AND_CHAT && (
            <>
              {kbTabPanel}
              {chatTabPanel}
            </>
          )}
          {projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_CHAT && (
            <>
              {chatTabPanel}
            </>
          )}
          {projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_KB && (
            <>
              {kbTabPanel}
            </>
          )}
        </Tabs>
      </div>
      <span />
      <div className={s.right}>
        {location.pathname.includes(APP_PROJECT_CHAT_PATH) && (<><ChannelHeader /><SearchBar /><SettingBtn /></>)}
        {location.pathname.includes(APP_PROJECT_KB_DOC_PATH) && (<><div className={s.doc_title}>知识库</div><SearchBar /><SettingBtn /></>)}
        {location.pathname.includes(APP_PROJECT_KB_BOOK_SHELF_PATH) && (<><div className={s.doc_title}>电子书库</div><SearchBar /><SettingBtn /></>)}
      </div>
    </div>
  );
};

export default observer(TopNav);
