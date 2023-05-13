import { observer } from 'mobx-react';
import React from 'react';
import type { IRouteConfig } from '@/routes';
import ChannelAndAi from '@/pages/ChannelAndAi/index';
import style from './style.module.less';
import { renderRoutes } from 'react-router-config';
import { useLocation } from 'react-router-dom';
import { APP_PROJECT_CHAT_PATH } from '@/utils/constant';



const ChatLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const { pathname } = useLocation();

  return (<>
    <ChannelAndAi />
    {pathname != APP_PROJECT_CHAT_PATH && (
      <div className={style.toolsModel}>{renderRoutes(route.routes)}</div>
    )}
  </>
  );
};

export default observer(ChatLayout);
