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
      if (appStore.simpleModeExpand != null) {
        winSize.width = 500 * deviceRatio;
        appWindow.setSize(winSize);
      } else {
        winSize.width = 200 * deviceRatio;
        setTimeout(() => {
          appWindow.setSize(winSize);
        }, 100);
      }
    } else {
      winSize.width = 1300 * deviceRatio;
      appWindow.setSize(winSize);
    }
  };

  useEffect(() => {
    if (userStore.sessionId == "") {
      return;
    }
    adjustSize();
  }, [appStore.simpleMode, appStore.simpleModeExpand]);

  if (!sessionId && !userStore.isResetPassword) return <div />;

  return (
    <>
      {appStore.simpleMode == true && (
        <div className={style.basicLayout} style={{ display: "flex", background: "transparent" }}>
          <LeftMenu />
          <div style={{ background: "transparent", width: "300px" }} />
        </div>
      )}
      {appStore.simpleMode == false && (
        <Layout className={style.basicLayout}>
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
