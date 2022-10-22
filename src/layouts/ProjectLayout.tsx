import React from 'react';
import { renderRoutes } from 'react-router-config';
import type { IRouteConfig } from '@/routes';
import style from './style.module.less';


const ProjectLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    return (
        <div className={style.projectLayout}>
            {renderRoutes(route.routes)}
        </div>
    );
};

export default ProjectLayout;
