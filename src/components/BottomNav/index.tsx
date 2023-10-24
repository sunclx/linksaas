import { Button, Popover, Space, Tooltip } from 'antd';
import React from 'react';
import s from './index.module.less';
import {
  APP_PROJECT_HOME_PATH,
  APP_PROJECT_MY_WORK_PATH,
  APP_PROJECT_OVERVIEW_PATH,
  PROJECT_SETTING_TAB
} from '@/utils/constant';
import { useStores } from '@/hooks';
import { EditOutlined, InfoCircleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import AlarmHeader from './AlarmHeader';
import { useLocation } from 'react-router-dom';
import { watch, unwatch, ENTRY_TYPE_SPRIT } from '@/api/project_entry';
import moment from 'moment';
import EntryPopover from '@/pages/Project/Home/EntryPopover';
import { request } from '@/utils/request';

const RightFloat = observer(() => {
  const projectStore = useStores('projectStore');

  return (
    <div className={s.right_float}>
      <AlarmHeader />
      <div className={s.member_wrap}>
        <Popover trigger={["hover", "click"]} placement="topLeft" destroyTooltipOnHide content={
          <div style={{ padding: "80px 80px" }}>xx</div>
        }>
          <UserOutlined />
        </Popover>
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
  const location = useLocation();

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const entryStore = useStores('entryStore');

  const genEntryTitle = (): string => {
    if (entryStore.curEntry == null) {
      return "";
    }
    if (entryStore.curEntry.entry_type == ENTRY_TYPE_SPRIT) {
      return `${entryStore.curEntry.entry_title}(${moment(entryStore.curEntry.extra_info.ExtraSpritInfo?.start_time ?? 0).format("YYYY-MM-DD")}至${moment(entryStore.curEntry.extra_info.ExtraSpritInfo?.end_time ?? 0).format("YYYY-MM-DD")})`;
    }
    return entryStore.curEntry.entry_title;
  }

  const watchEntry = async () => {
    await request(watch({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      entry_id: entryStore.curEntry?.entry_id ?? "",
    }));
    entryStore.updateEntry(entryStore.curEntry?.entry_id ?? "");
  };

  const unwatchEntry = async () => {
    await request(unwatch({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      entry_id: entryStore.curEntry?.entry_id ?? "",
    }));
    entryStore.updateEntry(entryStore.curEntry?.entry_id ?? "");
  }

  return (
    <div className={s.topnav}>
      <Space className={s.left}>
        {location.pathname.startsWith(APP_PROJECT_MY_WORK_PATH) && (
          <>
            <span>我的工作</span>
          </>
        )}
        {location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) && (
          <>
            <span>项目概览</span>
          </>
        )}
        {location.pathname.startsWith(APP_PROJECT_MY_WORK_PATH) == false && location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) == false
          && location.pathname.startsWith(APP_PROJECT_HOME_PATH) == false
          && entryStore.curEntry != null && (
            <>
              <Popover trigger={["hover", "click"]} placement='top' content={<EntryPopover entryInfo={entryStore.curEntry} />}>
                <InfoCircleOutlined />
              </Popover>
              <div className={s.title}>{genEntryTitle()}</div>
              {entryStore.curEntry.can_update && (
                <Button type="link" icon={<EditOutlined />} style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  entryStore.editEntryId = entryStore.curEntry?.entry_id ?? "";
                }} />
              )}

              <div className={s.extra}>
                <Space>
                  <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (entryStore.curEntry?.my_watch == true) {
                      unwatchEntry();
                    } else {
                      watchEntry();
                    }
                  }}>
                    <span className={(entryStore.curEntry?.my_watch ?? false) ? s.isCollect : s.noCollect} />
                  </a>
                </Space>
              </div>


            </>
          )}
      </Space>
      <div className={s.right}>
        <RightFloat />
      </div>
    </div>
  );
};

export default observer(BottomNav);
