import React from 'react';
import { renderRoutes } from 'react-router-config';
import type { IRouteConfig } from '@/routes';
import style from './style.module.less';


const GroupLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    return (
        <div className={style.groupLayout}>
            {renderRoutes(route.routes)}
        </div>
    );
};

export default GroupLayout;