import { Empty, Spin } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { renderRoutes } from 'react-router-config';
import { useStores } from '@/hooks';
import type { IRouteConfig } from '@/routes';
import Channel from '@/pages/Channel/index';
// import ChannelHeader from '@/pages/Channel/components/ChannelHeader';
import style from './style.module.less';
import { useLocation } from 'react-router-dom';
import DocLayout from './DocLayout';
import { APP_PROJECT_DOC_PATH, APP_PROJECT_PATH } from '@/utils/constant';

const ChatLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const projectStore = useStores('projectStore');
  const { pathname } = useLocation();
  if (!projectStore.curProjectId)
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
  console.log(route.routes);

  return (
    <div className={style.projectLayout}>
      {projectStore.showChannel ? <Channel /> : <DocLayout />}
      {pathname !== APP_PROJECT_PATH && !pathname.includes(APP_PROJECT_DOC_PATH) && (
        <div className={style.toolsModel}>{renderRoutes(route.routes)}</div>
      )}
    </div>
  );
};

export default observer(ChatLayout);
