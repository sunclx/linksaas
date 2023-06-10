import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Badge, Divider, Tooltip } from 'antd';

import style from './index.module.less';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_BOOK_SHELF_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_OVERVIEW_PATH, APP_PROJECT_WORK_PLAN_PATH, PROJECT_SETTING_TAB } from '@/utils/constant';


const Item: React.FC<{ id: string; pathname: string; title: string; badge?: number }> = observer((props) => {
  const history = useHistory();
  const projectStore = useStores('projectStore');

  const [showTip, setShowTip] = useState<boolean | undefined>(undefined);

  const current = props.pathname.includes(props.id);
  const gotoPage = (id: string) => {
    if (props.pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
      history.push(APP_PROJECT_WORK_PLAN_PATH + '/' + id);
    } else if (props.pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
      history.push(APP_PROJECT_KB_DOC_PATH + '/' + id);
    } else if (props.pathname.startsWith(APP_PROJECT_KB_BOOK_SHELF_PATH)) {
      history.push(APP_PROJECT_KB_BOOK_SHELF_PATH + '/' + id);
    } else if (props.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
      history.push(APP_PROJECT_CHAT_PATH + '/' + id);
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
          count={props.badge}
          offset={[15, -18]}
          style={{ padding: ' 0   3px', height: '16px', lineHeight: '16px' }}
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
      {(!projectStore.curProject?.setting.disable_chat || !projectStore.curProject?.setting.disable_kb) && (
        <>
          <Item
            id="idea"
            pathname={pathname}
            title="知识点"
          />
          <Divider />
        </>
      )}

      {projectStore.curProject?.setting.disable_member_appraise != true && (
        <>
          <Item
            id="appraise"
            pathname={pathname}
            title="项目成员互评"
            badge={projectStore.curProject?.project_status.undone_appraise_count || 0}
          />
          <Divider />
        </>
      )}

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
      {projectStore.curProject?.setting.disable_test_case != true && (
        <Item
          id="testcase"
          pathname={pathname}
          title="测试用例"
        />
      )}

      {projectStore.curProject?.setting.disable_server_agent != true && (
        <>
          <Divider />
          <Item
            id="robot"
            pathname={pathname}
            title="服务器列表"
          />
          <Item
            id="script"
            pathname={pathname}
            title="服务端脚本"
          />
          <Item
            id="repo"
            pathname={pathname}
            title="CI/CD"
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

      {projectStore.curProject?.setting.disable_ext_event != true && (
        <>
          {projectStore.curProject?.user_project_perm?.can_admin && <Divider />}
          {projectStore.curProject?.user_project_perm?.can_admin && (
            <Item id="access" pathname={pathname} title="第三方接入" />
          )}
        </>
      )}

      {projectStore.curProject?.setting.disable_app_store != true && (
        <>
          <Divider />
          <Item id="appstore" pathname={pathname} title="更多应用" />
        </>
      )}

    </div>
  );
});
export default Toolbar;
