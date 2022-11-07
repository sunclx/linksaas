import React from 'react';
import { Redirect } from 'react-router-dom';

import BasicLayout from '@/layouts/BasicLayout';
import ProjectLayout from '@/layouts/ProjectLayout';
import UserLayout from '@/layouts/UserLayout';
import NoFond from '@/pages/NoFond';

import ProjectHome from '@/pages/Project/Home';
import ProjectMember from '@/pages/Project/Member';
import ProjectAppraise from '@/pages/Project/Appraise';
import ProjectAward from '@/pages/Project/Award';
import ProjectRecord from '@/pages/Project/Record/Record';
import ProjectAccess from '@/pages/Project/Access';
import ProjectAccessView from '@/pages/Project/Access/View';
import AppStore from '@/pages/Project/AppStore';
import IssueList from '@/pages/Issue/IssueList';
import IssueDetail from '@/pages/Issue/IssueDetail';

import Login from '@/pages/User/Login';
import Register from '@/pages/User/Register';
import Workbench from '@/pages/Workbench';
import ChatLayout from '@/layouts/ChatLayout';
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_CB_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_KB_PATH, BUG_CREATE_SUFFIX, BUG_DETAIL_SUFFIX, ROBOT_METRIC_SUFFIX, TASK_CREATE_SUFFIX, TASK_DETAIL_SUFFIX } from '@/utils/constant';
import KnowledgeBaseLayout from '@/layouts/KnowledgeBaseLayout';
import ProjectDoc from '@/pages/KnowledgeBase/ProjectDoc';
import ContentBlock from '@/pages/KnowledgeBase/ContentBlock';
import IssueCreate from '@/pages/Issue/IssueCreate';
import RobotList from '@/pages/Robot/RobotList';
import MetricList from '@/pages/Robot/MetricList';
import RepoList from '@/pages/Earthly/RepoList';



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
      component: IssueList,
      exact: true,
    },
    {
      path: prefix + TASK_DETAIL_SUFFIX,
      title: '任务详情',
      component: IssueDetail,
      exact: true,
    },
    {
      path: prefix + TASK_CREATE_SUFFIX,
      title: '创建任务',
      component: IssueCreate,
      exact: true,
    },
    {
      path: prefix + '/bug',
      title: '缺陷列表',
      component: IssueList,
      exact: true,
    },
    {
      path: prefix + BUG_DETAIL_SUFFIX,
      title: '缺陷详情',
      component: IssueDetail,
      exact: true,
    },
    {
      path: prefix + BUG_CREATE_SUFFIX,
      title: '创建缺陷',
      component: IssueCreate,
      exact: true,
    },
    {
      path: prefix + '/robot',
      title: '机器人列表',
      component: RobotList,
      exact: true,
    },
    {
      path: prefix + '/repo',
      title: '代码仓库列表',
      component: RepoList,
      exact: true,
    },
    {
      path: prefix + ROBOT_METRIC_SUFFIX,
      title: '监控列表',
      component: MetricList,
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
        title: '项目',
        component: ProjectLayout,
        routes: [
          {
            path: APP_PROJECT_CHAT_PATH,
            title: '沟通',
            component: ChatLayout,
            routes: getToolbarRoute(APP_PROJECT_CHAT_PATH),
          },
          {
            path: APP_PROJECT_KB_PATH,
            title: '知识库',
            component: KnowledgeBaseLayout,
            routes: [
              {
                path: APP_PROJECT_KB_DOC_PATH,
                title: "文档空间",
                component: ProjectDoc,
                routes: getToolbarRoute(APP_PROJECT_KB_DOC_PATH),
              },
              {
                path: APP_PROJECT_KB_CB_PATH,
                title: "可编辑块",
                component: ContentBlock,
                routes: getToolbarRoute(APP_PROJECT_KB_CB_PATH),
              },
            ],
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
