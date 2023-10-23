import { Button, Space, Tooltip } from 'antd';
import React from 'react';
import s from './index.module.less';
import {
  APP_PROJECT_HOME_PATH,
  APP_PROJECT_MY_WORK_PATH,
  APP_PROJECT_OVERVIEW_PATH,
  PROJECT_SETTING_TAB
} from '@/utils/constant';
import { useStores } from '@/hooks';
import { HomeTwoTone, SettingOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import AlarmHeader from './AlarmHeader';
import { useHistory, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const history = useHistory();

  return (
    <div className={s.topnav}>
      <Space className={s.left}>
        <Button type="text" icon={<HomeTwoTone style={{ fontSize: "20px" }} twoToneColor={["orange", "white"]} />} onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          history.push(APP_PROJECT_HOME_PATH);
        }} />
        {location.pathname.startsWith(APP_PROJECT_MY_WORK_PATH) && (
          <>
            <span>/</span>
            <span>我的工作</span>
          </>
        )}
        {location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) && (
          <>
            <span>/</span>
            <span>项目概览</span>
          </>
        )}
      </Space>
      <div className={s.right}>
        <RightFloat />
      </div>
    </div>
  );
};

export default observer(TopNav);
