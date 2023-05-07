import { Button, Tabs, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import ChannelHeader from '@/pages/ChannelAndAi/components/ChannelHeader';
import {
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_CHAT_PATH,
  APP_PROJECT_KB_PATH,
  APP_PROJECT_KB_BOOK_SHELF_PATH,
  PROJECT_SETTING_TAB,
  APP_PROJECT_OVERVIEW_PATH,
  APP_PROJECT_KB_BOOK_MARK_PATH,
} from '@/utils/constant';
import { useStores } from '@/hooks';
import { CommentOutlined, FileDoneOutlined, FundProjectionScreenOutlined, SettingOutlined } from '@ant-design/icons';
import SearchBar from '../SearchBar';
import { LAYOUT_TYPE_CHAT, LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB, LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_NONE } from '@/api/project';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import AlarmHeader from './AlarmHeader';

const RightFloat = observer(() => {
  const projectStore = useStores('projectStore');

  return (
    <div className={s.right_float}>
      <AlarmHeader />
      {projectStore.isAdmin && (
        <Tooltip title="项目设置" placement='left' color='orange' overlayInnerStyle={{ color: 'black', marginTop: "10px" }} open={projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT}>
          <Button type="link" className={s.setting_btn} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT;
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

  const docSpaceStore = useStores('docSpaceStore');
  const projectStore = useStores('projectStore');

  const chatTabPanel = (
    <Tabs.TabPane tab={
      <Tooltip title="主界面: 沟通面板" open={projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT}
        placement={projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_KB_AND_CHAT ? "right" : "left"} color="orange" overlayInnerStyle={{ color: 'black' }}>
        <span className={activeKey == APP_PROJECT_CHAT_PATH ? s.tab_chat_active : s.tab_chat}><CommentOutlined />沟通</span>
      </Tooltip>
    } key={APP_PROJECT_CHAT_PATH} />);

  const kbTabPanel = (
    <Tabs.TabPane tab={
      <Tooltip title="主界面: 知识库面板" open={projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT}
        placement={projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_CHAT_AND_KB ? "right" : "left"} color="orange" overlayInnerStyle={{ color: 'black' }}>
        <span className={activeKey == APP_PROJECT_KB_PATH ? s.tab_kb_active : s.tab_kb}><FileDoneOutlined />知识库</span>
      </Tooltip>
    } key={APP_PROJECT_KB_PATH} />);

  const getTabCls = (): string => {
    if (projectStore.curProject?.setting.layout_type == LAYOUT_TYPE_NONE) {
      return s.none;
    } else if ([LAYOUT_TYPE_CHAT, LAYOUT_TYPE_KB].includes(projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB)) {
      return s.single;
    } else {
      return s.multi;
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
      setActiveKey(APP_PROJECT_CHAT_PATH);
    } else if (location.pathname.startsWith(APP_PROJECT_KB_PATH)) {
      setActiveKey(APP_PROJECT_KB_PATH);
    } else if (location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
      setActiveKey(APP_PROJECT_OVERVIEW_PATH);
    }
  }, [location.pathname, history]);

  return (
    <div className={s.topnav}>
      <div>
        <Tabs
          className={classNames(s.tabs, getTabCls())}
          activeKey={activeKey}
          onChange={(key) => {
            if (docSpaceStore.inEdit) {
              docSpaceStore.showCheckLeave(() => {
                setActiveKey(key);
                if (key == APP_PROJECT_CHAT_PATH) {
                  history.push(APP_PROJECT_CHAT_PATH);
                } else if (key == APP_PROJECT_KB_PATH) {
                  docSpaceStore.showDocList("", false);
                  history.push(APP_PROJECT_KB_DOC_PATH);
                } else if (key == APP_PROJECT_OVERVIEW_PATH) {
                  history.push(APP_PROJECT_OVERVIEW_PATH);
                }
              });
              return;
            }
            setActiveKey(key);
            if (key == APP_PROJECT_CHAT_PATH) {
              history.push(APP_PROJECT_CHAT_PATH);
            } else if (key == APP_PROJECT_KB_PATH) {
              docSpaceStore.showDocList("", false);
              history.push(APP_PROJECT_KB_DOC_PATH);
            } else if (key == APP_PROJECT_OVERVIEW_PATH) {
              history.push(APP_PROJECT_OVERVIEW_PATH);
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
          <Tabs.TabPane tab={
            <span className={activeKey == APP_PROJECT_OVERVIEW_PATH ? s.tab_overview_active : s.tab_overview}><FundProjectionScreenOutlined />项目概览</span>
          } key={APP_PROJECT_OVERVIEW_PATH} />);
        </Tabs>
      </div>
      <span />
      <div className={s.right}>
        {location.pathname.includes(APP_PROJECT_CHAT_PATH) && (<><ChannelHeader /><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_KB_DOC_PATH) && (<><div className={s.doc_title}>知识库</div><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_KB_BOOK_SHELF_PATH) && (<><div className={s.doc_title}>项目书籍</div><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_KB_BOOK_MARK_PATH) && (<><div className={s.doc_title}>项目书签</div><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_OVERVIEW_PATH) && (<>
          {projectStore.curProject?.setting.layout_type != LAYOUT_TYPE_NONE && <SearchBar />}
          <RightFloat />
        </>)}

      </div>
    </div>
  );
};

export default observer(TopNav);
