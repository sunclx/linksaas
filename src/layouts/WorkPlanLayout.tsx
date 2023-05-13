import { observer } from 'mobx-react';
import React from 'react';
import type { IRouteConfig } from '@/routes';
import { useLocation } from 'react-router-dom';
import WorkPlan from '@/pages/WorkPlan';
import { APP_PROJECT_WORK_PLAN_PATH } from '@/utils/constant';
import style from './style.module.less';
import { renderRoutes } from 'react-router-config';

const WorkPlanLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    const { pathname } = useLocation();

    return (<>
        <WorkPlan />
        {pathname != APP_PROJECT_WORK_PLAN_PATH && (
      <div className={style.toolsModel}>{renderRoutes(route.routes)}</div>
    )}
    </>);
};

export default observer(WorkPlanLayout);