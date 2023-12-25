import BottomNav from '@/components/BottomNav';
import { useStores } from '@/hooks';
import type { IRouteConfig } from '@/routes';
import { WORKBENCH_PATH } from '@/utils/constant';
import { Layout } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { useHistory, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import LeftMenu from '../components/LeftMenu';
import Toolbar from '../components/Toolbar';
import style from './style.module.less';
import LoginModal from '@/pages/User/LoginModal';
import { AdminLoginModal } from '@/pages/User/AdminLoginModal';
import GlobalServerModal from '@/components/GlobalSetting/GlobalServerModal';

const { Content } = Layout;

const BasicLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const userStore = useStores('userStore');
  const { curProjectId } = useStores('projectStore');
  const noticeStore = useStores('noticeStore');
  const appStore = useStores('appStore');

  noticeStore.setHistory(history);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');


  useEffect(() => {
    userStore.isResetPassword = (type === 'resetPassword');
  });

  return (
    <Layout className={style.basicLayout}>
      {appStore.focusMode == false && <LeftMenu />}
      <Layout>
        <Header />
        <Content
          className={classNames(
            style.basicContent,
            pathname !== WORKBENCH_PATH && style.showbottomnav,
          )}
        >
          {renderRoutes(route.routes, { sessionId: userStore.sessionId, projectId: curProjectId })}
        </Content>
        {curProjectId && <Toolbar />}
        {curProjectId != '' && <BottomNav />}
      </Layout>
      {userStore.showUserLogin && <LoginModal />}
      {userStore.showAdminUserLogin && <AdminLoginModal onClose={() => {
        userStore.showAdminUserLogin = false;
      }} />}
      {appStore.showGlobalServerModal && <GlobalServerModal />}
    </Layout>
  );
};

export default observer(BasicLayout);
