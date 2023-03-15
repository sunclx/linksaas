import { Empty, Spin } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { useStores } from '@/hooks';
import type { IRouteConfig } from '@/routes';
import style from './style.module.less';
import { renderRoutes } from 'react-router-config';
import { useLocation } from 'react-router-dom';
import { APP_PROJECT_OVERVIEW_PATH } from '@/utils/constant';
import ProjectOverview from '@/pages/ProjectOverview';



const OverviewLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const projectStore = useStores('projectStore');
  const { pathname } = useLocation();

  if (!projectStore.curProjectId) {
    return (
      <>
        {!projectStore.filterProjectList.length ? (
          <Empty style={{ marginTop: '10%' }} />
        ) : (
          <div>
            <Spin />
            加载中...
          </div>
        )}
      </>
    );
  }

  return (<>
    <ProjectOverview/>
    {pathname != APP_PROJECT_OVERVIEW_PATH && (
      <div className={style.toolsModel}>{renderRoutes(route.routes)}</div>
    )}
  </>
  );
};

export default observer(OverviewLayout);
