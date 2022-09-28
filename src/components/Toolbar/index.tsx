import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Badge, Divider, Tooltip } from 'antd';

import style from './index.module.less';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import { APP_PROJECT_PATH } from '@/utils/constant';

const Item: React.FC<{ id: string; pathname: string; title: string; badge?: number }> = (props) => {
  const history = useHistory();
  const current = props.pathname.includes(props.id);
  const gotoPage = (id: string) => {
    history.push(APP_PROJECT_PATH + '/' + id);
  };

  return (
    <Tooltip
      title={<span>{props.title}</span>}
      placement="left"
      color="#fff"
      overlayInnerStyle={{ color: '#777' }}
      mouseEnterDelay={2}
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
};

const Toolbar: React.FC = observer(() => {
  const location = useLocation();
  const pathname = location.pathname;
  const projectStore = useStores('projectStore');

  return (
    <div className={style.toolbar}>
      <Item id="home" pathname={pathname} title="项目详情" />
      {/* <Item id="setting" pathname={pathname} title="项目设置" /> */}
      <Divider />
      <Item id="member" pathname={pathname} title="项目成员列表" />
      <Item
        id="appraise"
        pathname={pathname}
        title="项目互评"
        badge={projectStore.curProject?.project_status.undone_appraise_count || 0}
      />
      <Divider />
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
      <Divider />
      <Item
        id="record"
        pathname={pathname}
        title="工作记录"
        badge={projectStore.curProject?.project_status.new_event_count || 0}
      />
      {projectStore.curProject?.user_project_perm?.can_admin && <Divider />}
      {projectStore.curProject?.user_project_perm?.can_admin && (
        <Item id="access" pathname={pathname} title="第三方接入" />
      )}
      <Divider />
      <Item id="appstore" pathname={pathname} title="更多应用" />
    </div>
  );
});
export default Toolbar;
