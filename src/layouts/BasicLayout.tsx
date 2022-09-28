import TopNav from '@/components/TopNav';
import { useStores } from '@/hooks';
import type { IRouteConfig } from '@/routes';
import { WORKBENCH_PATH } from '@/utils/constant';
import { Layout } from 'antd';
import classNames from 'classnames';
import { when } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { useHistory, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Menu from '../components/Menu';
import Toolbar from '../components/Toolbar';
import style from './style.module.less';

const { Content } = Layout;

const BasicLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { sessionId } = useStores('userStore');
  const userStore = useStores('userStore');
  const { curProjectId } = useStores('projectStore');
  // const docStore = useStores('docStore');

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');

  useEffect(() => {
    userStore.setIsResetPassword(type === 'resetPassword');
  });

  when(
    () => !sessionId,
    () => {
      // 重置密码
      if (!userStore.isResetPassword) {
        history.push('/user/login');
      }
    },
  );

  if (!sessionId && !userStore.isResetPassword) return <div />;

  return (
    <Layout className="basicLayout">
      <Menu />
      <Layout>
        <Header />
        {curProjectId != '' && <TopNav />}
        <Content
          className={classNames(
            style.basicContent,
            pathname !== WORKBENCH_PATH && style.showtopnav,
          )}
        >
          {renderRoutes(route.routes, { sessionId, projectId: curProjectId })}
        </Content>
        {curProjectId && <Toolbar />}
      </Layout>
    </Layout>
  );
};

export default observer(BasicLayout);
