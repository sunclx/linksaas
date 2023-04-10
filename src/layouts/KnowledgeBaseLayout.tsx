import React from 'react';
import type { IRouteConfig } from '@/routes';
import { renderRoutes } from 'react-router-config';
import { APP_PROJECT_KB_BOOK_MARK_PATH, APP_PROJECT_KB_BOOK_SHELF_PATH, APP_PROJECT_KB_DOC_PATH } from '@/utils/constant';
import style from './style.module.less';
import { useLocation } from 'react-router-dom';
import KnowledgeBaseMenu from '@/components/KnowledgeBaseMenu';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import { PAGE_TYPE as BOOK_PAGE_TYPE } from '@/stores/bookShelf';
import { PAGE_TYPE as DOC_PAGE_TYPE } from '@/stores/docSpace';


const KnowledgeBaseLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const { pathname } = useLocation();

  const bookShelfStore = useStores('bookShelfStore');
  const docSpaceStore = useStores('docSpaceStore');

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
        {!(bookShelfStore.pageType == BOOK_PAGE_TYPE.PAGE_BOOK || docSpaceStore.pageType == DOC_PAGE_TYPE.PAGE_DOC) && <KnowledgeBaseMenu />}
      </div>
      {!(pathname == APP_PROJECT_KB_DOC_PATH || pathname == APP_PROJECT_KB_BOOK_SHELF_PATH || pathname == APP_PROJECT_KB_BOOK_MARK_PATH) && (
        <div className={style.toolsModel}>{renderRoutes(subRoutes)}</div>
      )}
    </>
  );
};

export default observer(KnowledgeBaseLayout);
