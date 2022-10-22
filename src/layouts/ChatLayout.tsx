import { Empty, Spin } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { useStores } from '@/hooks';
import type { IRouteConfig } from '@/routes';
import Channel from '@/pages/Channel/index';
import style from './style.module.less';
import { renderRoutes } from 'react-router-config';
import { useLocation } from 'react-router-dom';
import { APP_PROJECT_CHAT_PATH } from '@/utils/constant';



const ChatLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
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
    <Channel />
    {pathname != APP_PROJECT_CHAT_PATH && (
      <div className={style.toolsModel}>{renderRoutes(route.routes)}</div>
    )}
  </>
  );
};

export default observer(ChatLayout);
