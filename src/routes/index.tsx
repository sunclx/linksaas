import React from 'react';
import { Redirect } from 'react-router-dom';

import BasicLayout from '@/layouts/BasicLayout';
import ProjectLayout from '@/layouts/ProjectLayout';
import UserLayout from '@/layouts/UserLayout';
import NoFond from '@/pages/NoFond';

import ProjectHome from '@/pages/Project/Home';
import ProjectMember from '@/pages/Project/Member';
import ProjectAppraise from '@/pages/Project/Appraise';
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
import {
  ADMIN_PATH,
  ADMIN_PATH_CLIENT_AD_SUFFIX,
  ADMIN_PATH_CLIENT_MENU_SUFFIX,
  ADMIN_PATH_ORG_LIST_SUFFIX,
  ADMIN_PATH_PROJECT_CREATE_SUFFIX,
  ADMIN_PATH_PROJECT_DETAIL_SUFFIX,
  ADMIN_PATH_PROJECT_LIST_SUFFIX,
  ADMIN_PATH_USER_CREATE_SUFFIX,
  ADMIN_PATH_USER_DETAIL_SUFFIX,
  ADMIN_PATH_USER_LIST_SUFFIX,
  APP_PROJECT_CHAT_PATH,
  APP_PROJECT_KB_BOOK_SHELF_PATH,
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_KB_PATH,
  WORKBENCH_KB_DOC_SUFFIX,
  BUG_CREATE_SUFFIX,
  BUG_DETAIL_SUFFIX,
  REPO_ACTION_ACTION_DETAIL_SUFFIX,
  REPO_ACTION_EXEC_RESULT_SUFFIX,
  REQUIRE_MENT_CREATE_SUFFIX,
  REQUIRE_MENT_DETAIL_SUFFIX,
  ROBOT_METRIC_SUFFIX,
  SCRIPT_CREATE_SUFFIX,
  SCRIPT_EXEC_RESULT_SUFFIX,
  SPRIT_DETAIL_SUFFIX,
  TASK_CREATE_SUFFIX,
  TASK_DETAIL_SUFFIX,
  WORKBENCH_PATH,
  ADMIN_PATH_APPSTORE_CATE_SUFFIX,
  ADMIN_PATH_APPSTORE_APP_SUFFIX,
} from '@/utils/constant';
import KnowledgeBaseLayout from '@/layouts/KnowledgeBaseLayout';
import ProjectDoc from '@/pages/KnowledgeBase/ProjectDoc';
import IssueCreate from '@/pages/Issue/IssueCreate';
import RobotList from '@/pages/Robot/RobotList';
import MetricList from '@/pages/Robot/MetricList';
import RepoList from '@/pages/Earthly/RepoList';
import EarthlyExecResult from '@/pages/Earthly/ExecResult';
import ScriptExecResult from '@/pages/Script/ExecResult';
import ActionDetail from '@/pages/Earthly/ActionDetail';
import LocalApi from '@/pages/Project/LocalApi';
import BookShelf from '@/pages/KnowledgeBase/BookShelf';
import SpritList from '@/pages/Project/Sprit/SpritList';
import SpritDetail from '@/pages/Project/Sprit/SpritDetail';
import ExtraMenuPage from '@/pages/ExtraMenuPage';
import EntryList from '@/pages/TestCase/EntryList';
import ResultList from '@/pages/TestCase/ResultList';
import SubscribeList from '@/pages/Project/Record/SubscribeList';
import ScriptList from '@/pages/Script/ScriptList';
import CreateScript from '@/pages/Script/CreateScript';
import ScriptDetail from '@/pages/Script/ScriptDetail';
import AdminLayout from '@/layouts/AdminLayout';
import UserList from '@/pages/Admin/UserAdmin/UserList';
import UserDetail from '@/pages/Admin/UserAdmin/UserDetail';
import CreateUser from '@/pages/Admin/UserAdmin/CreateUser';
import ProjectList from '@/pages/Admin/ProjectAdmin/ProjectList';
import ProjectDetail from '@/pages/Admin/ProjectAdmin/ProjectDetail';
import DepartMentList from '@/pages/Admin/OrgAdmin/DepartMentList';
import CreateProject from '@/pages/Admin/ProjectAdmin/CrateProject';
import MenuAdmin from '@/pages/Admin/ClientAdmin/MenuAdmin';
import AdAdmin from '@/pages/Admin/ClientAdmin/AdAdmin';
import RequirementList from '@/pages/Project/Requirement/RequirementList';
import RequirementCreate from '@/pages/Project/Requirement/RequirementCreate';
import RequirementDetail from '@/pages/Project/Requirement/RequirementDetail';
import UserDoc from '@/pages/UserExtend/UserKb/UserDoc';
import AppCateList from '@/pages/Admin/AppAdmin/AppCateList';
import AppList from '@/pages/Admin/AppAdmin/AppList';



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
      title: '项目成员互评',
      component: ProjectAppraise,
    },
    {
      path: prefix + "/req",
      title: "需求列表",
      component: RequirementList,
      exact: true,
    },
    {
      path: prefix + REQUIRE_MENT_CREATE_SUFFIX,
      title: "创建需求",
      component: RequirementCreate,
      exact: true,
    },
    {
      path: prefix + REQUIRE_MENT_DETAIL_SUFFIX,
      title: "需求详情",
      component: RequirementDetail,
      exact: true,
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
      path: prefix + "/testcase",
      title: "测试用例",
      component: EntryList,
      exact: true,
    },
    {
      path: prefix + "/testcase/result",
      title: "测试用例结果列表",
      component: ResultList,
      exact: true,
    },
    {
      path: prefix + "/sprit",
      title: "迭代列表",
      component: SpritList,
      exact: true,
    },
    {
      path: prefix + SPRIT_DETAIL_SUFFIX,
      title: "迭代详情",
      component: SpritDetail,
      exact: true,
    },
    {
      path: prefix + '/robot',
      title: '服务器代理列表',
      component: RobotList,
      exact: true,
    },
    {
      path: prefix + ROBOT_METRIC_SUFFIX,
      title: '监控列表',
      component: MetricList,
      exact: true,
    },
    {
      path: prefix + "/script",
      title: "服务端脚本",
      component: ScriptList,
      exact: true,
    },
    {
      path: prefix + SCRIPT_CREATE_SUFFIX,
      title: "创建服务端脚本",
      component: CreateScript,
      exact: true,
    },
    {
      path: prefix + "/script/detail",
      title: "服务端脚本详情",
      component: ScriptDetail,
      exact: true,
    },
    {
      path: prefix + SCRIPT_EXEC_RESULT_SUFFIX,
      title: "服务端脚本执行结果",
      component: ScriptExecResult,
      exact: true,
    },
    {
      path: prefix + '/repo',
      title: '代码仓库列表',
      component: RepoList,
      exact: true,
    },
    {
      path: prefix + REPO_ACTION_ACTION_DETAIL_SUFFIX,
      title: '命令详情',
      component: ActionDetail,
      exact: true,
    },
    {
      path: prefix + REPO_ACTION_EXEC_RESULT_SUFFIX,
      title: '命令执行结果',
      component: EarthlyExecResult,
      exact: true,
    },
    {
      path: prefix + '/record',
      title: '工作记录',
      component: ProjectRecord,
      exact: true,
    },
    {
      path: prefix + "/record/subscribe",
      title: "工作记录订阅",
      component: SubscribeList,
      exact: true,
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
    {
      path: prefix + "/localapi",
      title: "项目接口",
      component: LocalApi,
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
      return <Redirect to={WORKBENCH_PATH} />;
    },
  },
  {
    path: '/app',
    component: BasicLayout,
    title: '系统路由',
    // exact: true,
    routes: [
      {
        path: WORKBENCH_PATH,
        title: '工作台',
        component: Workbench,
        exact: true,
      },
      {
        path: WORKBENCH_KB_DOC_SUFFIX,
        title: "知识库文档",
        component: UserDoc,
        exact: true,
      },
      {
        path: '/app/extra_menu',
        title: '额外菜单内容',
        component: ExtraMenuPage,
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
                path: APP_PROJECT_KB_BOOK_SHELF_PATH,
                title: "电子书库",
                component: BookShelf,
                routes: getToolbarRoute(APP_PROJECT_KB_BOOK_SHELF_PATH),
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
    path: ADMIN_PATH,
    title: "管理界面",
    component: AdminLayout,
    routes: [
      {
        path: ADMIN_PATH_USER_LIST_SUFFIX,
        title: "用户列表",
        component: UserList,
        exact: true,
      },
      {
        path: ADMIN_PATH_USER_DETAIL_SUFFIX,
        title: "用户详情",
        component: UserDetail,
        exact: true,
      },
      {
        path: ADMIN_PATH_USER_CREATE_SUFFIX,
        title: "创建用户",
        component: CreateUser,
        exact: true,
      },
      {
        path: ADMIN_PATH_PROJECT_LIST_SUFFIX,
        title: "项目列表",
        component: ProjectList,
        exact: true,
      },
      {
        path: ADMIN_PATH_PROJECT_DETAIL_SUFFIX,
        title: "项目详情",
        component: ProjectDetail,
        exact: true,
      },
      {
        path: ADMIN_PATH_PROJECT_CREATE_SUFFIX,
        title: "创建项目",
        component: CreateProject,
        exact: true,
      },
      {
        path: ADMIN_PATH_ORG_LIST_SUFFIX,
        title: "部门列表",
        component: DepartMentList,
        exact: true,
      },
      {
        path: ADMIN_PATH_CLIENT_MENU_SUFFIX,
        title: "额外菜单管理",
        component: MenuAdmin,
        exact: true,
      },
      {
        path: ADMIN_PATH_CLIENT_AD_SUFFIX,
        title: "广告管理",
        component: AdAdmin,
        exact: true,
      },
      {
        path: ADMIN_PATH_APPSTORE_CATE_SUFFIX,
        title: "应用类别管理",
        component: AppCateList,
        exact: true,
      },
      {
        path: ADMIN_PATH_APPSTORE_APP_SUFFIX,
        title: "应用管理",
        component: AppList,
        exact: true,
      }
    ]
  },

  {
    path: '*',
    title: '错误页面',
    component: NoFond,
  },
];

export default routesConfig;
