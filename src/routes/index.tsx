import React from 'react';
import { Redirect } from 'react-router-dom';

import BasicLayout from '@/layouts/BasicLayout';
import ChatLayout from '@/layouts/ChatLayout';
import UserLayout from '@/layouts/UserLayout';
import NoFond from '@/pages/NoFond';

import ProjectHome from '@/pages/Project/Home';
import ProjectMember from '@/pages/Project/Member';
import ProjectAppraise from '@/pages/Project/Appraise';
import ProjectAward from '@/pages/Project/Award';
import ProjectRecord from '@/pages/Project/Record/Record';
import ProjectTask from '@/pages/Project/Task';
import CreateTask from '@/pages/Project/Task/CreateTask';
import ProjectAccess from '@/pages/Project/Access';
import ProjectAccessView from '@/pages/Project/Access/View';
import AppStore from '@/pages/Project/AppStore';

import Login from '@/pages/User/Login';
import Register from '@/pages/User/Register';
import Workbench from '@/pages/Workbench';


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
  render?: any;
}

const getToolbarRoute = (prefix: string): IRouteConfig[] => {
  const routeList: IRouteConfig[] = [
    {
      path: prefix + '/home',
      title: '项目详情',
      component: ProjectHome,
    },
    {
      path: prefix + '/member',
      title: '项目成员',
      component: ProjectMember,
    },
    {
      path: prefix + '/appraise',
      title: '项目互评',
      component: ProjectAppraise,
    },
    {
      path: prefix + '/award',
      title: '项目贡献',
      component: ProjectAward,
    },
    {
      path: prefix + '/task',
      title: '任务列表',
      component: ProjectTask,
      exact: true,
    },
    {
      path: prefix + '/task/view',
      title: '创建任务',
      component: CreateTask,
      exact: true,
    },
    {
      path: prefix + '/bug',
      title: '缺陷列表',
      component: ProjectTask,
      exact: true,
    },
    {
      path: prefix + '/bug/view',
      title: '创建缺陷',
      component: CreateTask,
      exact: true,
    },
    {
      path: prefix + '/record',
      title: '工作记录',
      component: ProjectRecord,
    },
    {
      path: prefix + '/access',
      title: '第三方接入',
      component: ProjectAccess,
      exact: true,
    },
    {
      path: prefix + '/access/view',
      title: '第三方接入详情',
      component: ProjectAccessView,
      exact: true,
    },
    {
      path: prefix + "/appstore",
      title: "更多应用",
      component: AppStore,
      exact: true,
    },
  ];
  return routeList;
};

const routesConfig: IRouteConfig[] = [
  {
    path: '/',
    title: '',
    exact: true,
    render: () => {
      return <Redirect to="/app/workbench" />;
    },
  },
  {
    path: '/app',
    component: BasicLayout,
    title: '系统路由',
    // exact: true,
    routes: [
      {
        path: '/app/workbench',
        title: '工作台',
        component: Workbench,
      },
      {
        path: '/app/project',
        title: '项目沟通',
        component: ChatLayout,
        routes: [
          ...getToolbarRoute('/app/project'),
          {
            path: '/app/project/doc/pro_doc',
            title: '文档',
          },
          {
            path: '/app/project/doc/content_block',
            title: '可变内容块管理',
          },
        ],
      },
    ],
  },
  {
    path: '/user',
    component: UserLayout,
    title: '用户路由',
    redirect: '/user/login',
    routes: [
      {
        path: '/user/login',
        component: Login,
        title: '登录',
      },
      {
        path: '/user/register',
        component: Register,
        title: '注册',
      },
    ],
  },

  {
    path: '*',
    title: '错误页面',
    component: NoFond,
  },
];

export default routesConfig;
