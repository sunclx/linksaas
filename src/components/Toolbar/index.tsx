import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Badge, Divider, Tooltip } from 'antd';

import style from './index.module.less';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import { APP_PROJECT_HOME_PATH, APP_PROJECT_KB_BOARD_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH, APP_PROJECT_WORK_PLAN_PATH, PROJECT_SETTING_TAB } from '@/utils/constant';


const Item: React.FC<{ id: string; pathname: string; title: string; badge?: number }> = observer((props) => {
  const history = useHistory();

  const appStore = useStores('appStore');
  const projectStore = useStores('projectStore');

  const [showTip, setShowTip] = useState<boolean | undefined>(undefined);

  const current = props.pathname.includes(props.id);
  const gotoPage = (id: string) => {
    if (props.pathname.startsWith(APP_PROJECT_HOME_PATH)) {
      history.push(APP_PROJECT_HOME_PATH + "/" + id);
    } else if (props.pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
      history.push(APP_PROJECT_WORK_PLAN_PATH + '/' + id);
    } else if (props.pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
      history.push(APP_PROJECT_KB_DOC_PATH + '/' + id);
    } else if (props.pathname.startsWith(APP_PROJECT_KB_BOARD_PATH)) {
      history.push(APP_PROJECT_KB_BOARD_PATH + '/' + id);
    } else if (props.pathname.startsWith(APP_PROJECT_MY_WORK_PATH)) {
      history.push(APP_PROJECT_MY_WORK_PATH + "/" + id);
    } else if (props.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
      history.push(APP_PROJECT_OVERVIEW_PATH + '/' + id);
    }
  };

  useEffect(() => {
    if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT) {
      setShowTip(true);
    } else {
      setShowTip(false);
      setTimeout(() => setShowTip(undefined), 100);
    }
  }, [projectStore.showProjectSetting]);

  return (
    <Tooltip
      title={<span>{props.title}</span>}
      placement="left"
      color="orange"
      overlayInnerStyle={{ color: 'black' }}
      open={showTip}
    >
      <div
        data-menu-id={props.id}
        className={current ? style.menuCurrent : style.menu}
        onClick={() => gotoPage(props.id)}
      >
        <Badge
          count={props.badge ?? 0}
          offset={appStore.focusMode ? [18, -12] : [15, -18]}
          style={appStore.focusMode ? undefined : { padding: ' 0   3px', height: '16px', lineHeight: '16px' }}
          dot={appStore.focusMode}
        />
      </div>
    </Tooltip>
  );
});

const Toolbar: React.FC = observer(() => {
  const location = useLocation();
  const pathname = location.pathname;
  const projectStore = useStores('projectStore');

  return (
    <div className={style.toolbar}>

      <Item
        id="idea"
        pathname={pathname}
        title="知识点"
      />
      <Divider />

      <Item
        id="req"
        pathname={pathname}
        title="需求列表"
      />
      <Item
        id="task"
        pathname={pathname}
        title="任务列表"
        badge={projectStore.curProject?.project_status.undone_task_count || 0}
      />

      <Item
        id="bug"
        pathname={pathname}
        title="缺陷列表"
        badge={projectStore.curProject?.project_status.undone_bug_count || 0}
      />

      {projectStore.curProject?.setting.disable_api_collection != true && (
        <>
          <Divider />
          <Item
            id="apicoll"
            pathname={pathname}
            title="接口集合"
          />
        </>
      )}

      {projectStore.curProject?.setting.disable_data_anno != true && (
        <>
          <Divider />
          <Item
            id="dataanno"
            pathname={pathname}
            title="数据标注"
          />
        </>
      )}

      <Divider />
      <Item
        id="record"
        pathname={pathname}
        title="工作记录"
        badge={projectStore.curProject?.project_status.new_event_count || 0}
      />

      {projectStore.curProject?.setting.disable_ext_event != true && projectStore.curProject?.user_project_perm?.can_admin && (
        <>
          <Divider />
          <Item id="access" pathname={pathname} title="第三方接入" />
        </>
      )}

      {projectStore.curProject?.setting.k8s_proxy_addr != "" && (
        <>
          <Divider />
          <Item id="cloud" pathname={pathname} title="私有云" />
        </>
      )}
    </div>
  );
});
export default Toolbar;
