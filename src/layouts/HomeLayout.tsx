import { observer } from 'mobx-react';
import React from 'react';
import type { IRouteConfig } from '@/routes';
import { useLocation } from 'react-router-dom';
import { APP_PROJECT_HOME_PATH } from '@/utils/constant';
import style from './style.module.less';
import { renderRoutes } from 'react-router-config';
import ProjectHome from '@/pages/Project/Home';

const HomeLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    const { pathname } = useLocation();

    return (<>
        <ProjectHome />
        {pathname != APP_PROJECT_HOME_PATH && (
      <div className={style.toolsModel}>{renderRoutes(route.routes)}</div>
    )}
    </>);
};

export default observer(HomeLayout);