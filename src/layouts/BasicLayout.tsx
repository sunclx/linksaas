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
import { PhysicalSize, appWindow } from '@tauri-apps/api/window';


import Header from '../components/Header';
import LeftMenu from '../components/LeftMenu';
import Toolbar from '../components/Toolbar';
import style from './style.module.less';

const { Content } = Layout;

const BasicLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const appStore = useStores('appStore')
  const { sessionId } = useStores('userStore');
  const userStore = useStores('userStore');
  const { curProjectId } = useStores('projectStore');
  const noticeStore = useStores('noticeStore');
  noticeStore.setHistory(history);

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

  const adjustSize = async () => {
    const winSize = await appWindow.outerSize();
    const deviceRatio = window.devicePixelRatio ?? 1;
    if (deviceRatio > 1.1) {
      appWindow.setMinSize(new PhysicalSize(200 * deviceRatio, 500 * deviceRatio));
    }
    if (appStore.simpleMode) {
      if (winSize.width > 300 * deviceRatio) {
        winSize.width = 200 * deviceRatio;
        appWindow.setSize(winSize);
      }
    } else {
      if (winSize.width < 300 * deviceRatio) {
        winSize.width = 1300 * deviceRatio;
        appWindow.setSize(winSize);
      }
    }
  };

  useEffect(() => {
    if (userStore.sessionId == "") {
      return;
    }
    adjustSize();
  }, [appStore.simpleMode]);

  if (!sessionId && !userStore.isResetPassword) return <div />;

  return (
    <>
      {appStore.simpleMode == true && (
        <div className={style.basicLayout}>
          <LeftMenu />
        </div>
      )}
      {appStore.simpleMode == false && (
        <Layout className="basicLayout">
          <LeftMenu />
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
      )}
    </>
  );
};

export default observer(BasicLayout);
