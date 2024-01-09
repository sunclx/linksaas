import { observer } from 'mobx-react';
import React from 'react';
import type { IRouteConfig } from '@/routes';
import { useLocation } from 'react-router-dom';
import WorkPlan from '@/pages/WorkPlan';
import { APP_PROJECT_WORK_PLAN_PATH } from '@/utils/constant';
import style from './style.module.less';
import { renderRoutes } from 'react-router-config';
import { useStores } from '@/hooks';

const WorkPlanLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const projectStore = useStores('projectStore');
  const { pathname } = useLocation();

  return (
    <div style={{ width: projectStore.showChatAndComment ? "calc(100vw - 560px)" : "calc(100vw - 260px)" }}>
      <WorkPlan />
      {pathname != APP_PROJECT_WORK_PLAN_PATH && (
        <div className={style.toolsModel}>{renderRoutes(route.routes)}</div>
      )}
    </div>
  );
};

export default observer(WorkPlanLayout);