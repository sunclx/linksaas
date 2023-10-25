import { Button, Popover, Tooltip } from 'antd';
import React from 'react';
import s from './index.module.less';
import {
  APP_PROJECT_OVERVIEW_PATH,
  PROJECT_SETTING_TAB
} from '@/utils/constant';
import { useStores } from '@/hooks';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import AlarmHeader from './AlarmHeader';
import ProjectTipList from '../Header/ProjectTipList';
import MemberList from './MemberList';
import { useLocation } from 'react-router-dom';

const RightFloat = observer(() => {
  const location = useLocation();
  const projectStore = useStores('projectStore');

  return (
    <div className={s.right_float}>
      <AlarmHeader />
      <div className={s.member_wrap}>
        {location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) && (
          <UserOutlined />
        )}
        {location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) == false && (
          <Popover
            trigger={["hover", "click"]} placement="topLeft" destroyTooltipOnHide
            content={
              <MemberList />
            }>
            <UserOutlined />
          </Popover>
        )}
      </div>
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

const BottomNav = () => {
  return (
    <div className={s.topnav}>
      <div className={s.left}>
        <ProjectTipList />
      </div>
      <div className={s.right}>
        <RightFloat />
      </div>
    </div>
  );
};

export default BottomNav;
