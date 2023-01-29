import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
// import Header from '../components/Header';

export interface IRouteConfig {
  // 路由路径
  path: string;
  // 路由组件
  component?: any;
  // 302 跳转
  redirect?: string;
  exact?: boolean;
  // 路由信息
  title: string;
  icon?: string;
  // 是否校验权限, false 为不校验, 不存在该属性或者为true 为校验, 子路由会继承父路由的 auth 属性
  auth?: boolean;
  routes?: IRouteConfig[];
}

const { Content } = Layout;

const UserLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const setWidonwSizes = async (width: number, height: number) => {
    await appWindow.setSize(new LogicalSize(width, height));
    await appWindow.center();
  };

  useEffect(() => {
    setWidonwSizes(1000, 640);
    return () => {
      setWidonwSizes(1300, 750);
    };
  }, []);

  return (
    <Layout className="_bg">
      {/* <Header type='login' /> */}
      <Content style={{ height: 'calc(100vh - 60px)'}}>{renderRoutes(route.routes)}</Content>
    </Layout>
  );
};
export default UserLayout;
