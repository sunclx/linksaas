import React from 'react';
import type { IRouteConfig } from '@/routes';
import { renderRoutes } from 'react-router-config';
import { APP_PROJECT_KB_CB_PATH, APP_PROJECT_KB_DOC_PATH } from '@/utils/constant';
import style from './style.module.less';
import { useLocation } from 'react-router-dom';
import KnowledgeBaseMenu from '@/components/KnowledgeBaseMenu';


const KnowledgeBaseLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const { pathname } = useLocation();

  let subRoutes: IRouteConfig[] = [];
  route.routes?.forEach(subRoute => {
    if (pathname.startsWith(subRoute.path)) {
      subRoutes = subRoute.routes ?? [];
    }
  });
  return (
    <>
      <div className={style.knowledgeBaseLayout}>
        {renderRoutes(route.routes)}
        <KnowledgeBaseMenu />
      </div>
      {!(pathname == APP_PROJECT_KB_DOC_PATH || pathname == APP_PROJECT_KB_CB_PATH) && (
        <div className={style.toolsModel}>{renderRoutes(subRoutes)}</div>
      )}
    </>
  );
};

export default KnowledgeBaseLayout;
