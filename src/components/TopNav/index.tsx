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
  APP_PROJECT_WORK_PLAN_PATH,
} from '@/utils/constant';
import { useStores } from '@/hooks';
import { CommentOutlined, FileDoneOutlined, FlagOutlined, FundProjectionScreenOutlined, SettingOutlined } from '@ant-design/icons';
import SearchBar from '../SearchBar';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import AlarmHeader from './AlarmHeader';
import ProjectQuickAccess from './ProjectQuickAccess';

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
  const spritStore = useStores('spritStore');



  const chatTabPanel = (
    <Tabs.TabPane tab={
      <Tooltip title="主界面: 沟通面板" open={projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT}
        placement="left" color="orange" overlayInnerStyle={{ color: 'black' }}>
        <span className={activeKey == APP_PROJECT_CHAT_PATH ? s.tab_chat_active : s.tab_chat}><CommentOutlined />沟通</span>
      </Tooltip>
    } key={APP_PROJECT_CHAT_PATH} />);

  const workPanlTabPanel = (<Tabs.TabPane tab={
    <Tooltip title="主界面: 工作计划面板" open={projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT}
      placement="top" color="orange" overlayInnerStyle={{ color: 'black' }}>
      <span className={activeKey == APP_PROJECT_WORK_PLAN_PATH ? s.tab_work_plan_active : s.tab_work_plan}><FlagOutlined />工作计划</span>
    </Tooltip>
  } key={APP_PROJECT_WORK_PLAN_PATH} />);

  const kbTabPanel = (
    <Tabs.TabPane tab={
      <Tooltip title="主界面: 知识库面板" open={projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT}
        placement="right" color="orange" overlayInnerStyle={{ color: 'black' }}>
        <span className={activeKey == APP_PROJECT_KB_PATH ? s.tab_kb_active : s.tab_kb}><FileDoneOutlined />知识库</span>
      </Tooltip>
    } key={APP_PROJECT_KB_PATH} />);


  useEffect(() => {
    if (location.pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
      setActiveKey(APP_PROJECT_WORK_PLAN_PATH);
    } else if (location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
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
          className={classNames(s.tabs)}
          activeKey={activeKey}
          onChange={(key) => {
            if (docSpaceStore.inEdit) {
              docSpaceStore.showCheckLeave(() => {
                setActiveKey(key);
                if (key == APP_PROJECT_WORK_PLAN_PATH) {
                  spritStore.setCurSpritId("");
                  history.push(APP_PROJECT_WORK_PLAN_PATH);
                } else if (key == APP_PROJECT_CHAT_PATH) {
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
            if (key == APP_PROJECT_WORK_PLAN_PATH) {
              spritStore.setCurSpritId("");
              history.push(APP_PROJECT_WORK_PLAN_PATH);
            } else if (key == APP_PROJECT_CHAT_PATH) {
              history.push(APP_PROJECT_CHAT_PATH);
            } else if (key == APP_PROJECT_KB_PATH) {
              docSpaceStore.showDocList("", false);
              history.push(APP_PROJECT_KB_DOC_PATH);
            } else if (key == APP_PROJECT_OVERVIEW_PATH) {
              history.push(APP_PROJECT_OVERVIEW_PATH);
            }
          }}
        >

          {!projectStore.curProject?.setting.disable_chat && (
            <>{chatTabPanel}</>
          )}

          {!projectStore.curProject?.setting.disable_work_plan && (
            <>{workPanlTabPanel}</>
          )}

          {!projectStore.curProject?.setting.disable_kb && (
            <>{kbTabPanel}</>
          )}


          <Tabs.TabPane tab={
            <span className={activeKey == APP_PROJECT_OVERVIEW_PATH ? s.tab_overview_active : s.tab_overview}><FundProjectionScreenOutlined />项目概览</span>
          } key={APP_PROJECT_OVERVIEW_PATH} />);
        </Tabs>
      </div>
      <ProjectQuickAccess/>
      {(location.pathname.includes(APP_PROJECT_CHAT_PATH) || location.pathname.includes(APP_PROJECT_KB_DOC_PATH)) && (<span />)}
      <div className={s.right}>
        {location.pathname.includes(APP_PROJECT_CHAT_PATH) && (<><ChannelHeader /><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_WORK_PLAN_PATH) && (<RightFloat />)}
        {location.pathname.includes(APP_PROJECT_KB_DOC_PATH) && (<><div className={s.doc_title}>知识库</div><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_KB_BOOK_SHELF_PATH) && (<><div className={s.doc_title}>项目书籍</div><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_KB_BOOK_MARK_PATH) && (<><div className={s.doc_title}>项目书签</div><SearchBar /><RightFloat /></>)}
        {location.pathname.includes(APP_PROJECT_OVERVIEW_PATH) && (<RightFloat />)}
      </div>
    </div>
  );
};

export default observer(TopNav);
