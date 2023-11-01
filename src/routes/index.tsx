import React from 'react';
import { Redirect } from 'react-router-dom';

import BasicLayout from '@/layouts/BasicLayout';
import ProjectLayout from '@/layouts/ProjectLayout';
import UserLayout from '@/layouts/UserLayout';
import NoFond from '@/pages/NoFond';

import ProjectAppraise from '@/pages/Project/Appraise';
import ProjectRecord from '@/pages/Project/Record/Record';
import ProjectAccess from '@/pages/Project/Access';
import ProjectAccessView from '@/pages/Project/Access/View';
import IssueList from '@/pages/Issue/IssueList';
import IssueDetail from '@/pages/Issue/IssueDetail';

import Login from '@/pages/User/Login';
import Register from '@/pages/User/Register';
import Workbench from '@/pages/Workbench';
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
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_KB_PATH,
  BUG_CREATE_SUFFIX,
  BUG_DETAIL_SUFFIX,
  REQUIRE_MENT_CREATE_SUFFIX,
  REQUIRE_MENT_DETAIL_SUFFIX,
  TASK_CREATE_SUFFIX,
  TASK_DETAIL_SUFFIX,
  WORKBENCH_PATH,
  ADMIN_PATH_APPSTORE_CATE_SUFFIX,
  ADMIN_PATH_APPSTORE_APP_SUFFIX,
  APP_PROJECT_OVERVIEW_PATH,
  PUB_RES_PATH,
  APP_PROJECT_WORK_PLAN_PATH,
  ADMIN_PATH_DOCKER_TEMPLATE_CATE_SUFFIX,
  ADMIN_PATH_DOCKER_TEMPLATE_APP_SUFFIX,
  ADMIN_PATH_PUB_SEARCH_CATE_SUFFIX,
  ADMIN_PATH_PUB_SEARCH_SITE_SUFFIX,
  APP_PROJECT_MY_WORK_PATH,
  APP_PROJECT_HOME_PATH,
  APP_PROJECT_MANAGER_PATH,
} from '@/utils/constant';
import KnowledgeBaseLayout from '@/layouts/KnowledgeBaseLayout';
import ProjectDoc from '@/pages/KnowledgeBase/ProjectDoc';
import IssueCreate from '@/pages/Issue/IssueCreate';
import ExtraMenuPage from '@/pages/ExtraMenuPage';
import SubscribeList from '@/pages/Project/Record/SubscribeList';
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
import AppCateList from '@/pages/Admin/AppAdmin/AppCateList';
import AppList from '@/pages/Admin/AppAdmin/AppList';
import OverviewLayout from '@/layouts/OverviewLayout';
import IdeaPage from '@/pages/Idea/IdeaPage';
import PubRes from '@/pages/PubRes';
import WorkPlanLayout from '@/layouts/WorkPlanLayout';
import DataAnnoProjectList from '@/pages/DataAnno/DataAnnoProjectList';
import TemplateCateList from '@/pages/Admin/DockerTemplateAdmin/TemplateCateList';
import TemplateList from '@/pages/Admin/DockerTemplateAdmin/TemplateList';
import ApiCollectionList from '@/pages/ApiCollection/ApiCollectionList';
import ThreadList from '@/pages/Project/Code/ThreadList';
import PubSearchCateList from '@/pages/Admin/PubSearchAdmin/PubSearchCateList';
import PubSearchSiteList from '@/pages/Admin/PubSearchAdmin/PubSearchSiteList';
import MyWorkLayout from '@/layouts/MyWorkLayout';
import ProjectCiCd from "@/pages/Project/CiCd"
import HomeLayout from '@/layouts/HomeLayout';
import ProjectManager from '@/pages/ProjectManger';

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
      path: prefix + "/idea",
      title: "项目知识点",
      component: IdeaPage,
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
      path: prefix + "/dataanno",
      title: "数据标注项目列表",
      component: DataAnnoProjectList,
      exact: true,
    },
    {
      path: prefix + "/apicoll",
      title: "接口集合列表",
      component: ApiCollectionList,
      exact: true,
    },
    {
      path: prefix + "/code",
      title: "代码评论",
      component: ThreadList,
      exact: true,
    },
    {
      path: prefix + "/cicd",
      title: "",
      component: ProjectCiCd,
      exact: true,
    }
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
        path: APP_PROJECT_MANAGER_PATH,
        title: "项目管理",
        component: ProjectManager,
        exact: true,
      },
      {
        path: PUB_RES_PATH,
        title: "公共资源",
        component: PubRes,
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
            path: APP_PROJECT_HOME_PATH,
            title: "主面板入口",
            component: HomeLayout,
            routes: getToolbarRoute(APP_PROJECT_HOME_PATH),
          },
          {
            path: APP_PROJECT_WORK_PLAN_PATH,
            title: "工作计划",
            component: WorkPlanLayout,
            routes: getToolbarRoute(APP_PROJECT_WORK_PLAN_PATH),
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
            ],
          },
          {
            path: APP_PROJECT_MY_WORK_PATH,
            title: "我的工作",
            component: MyWorkLayout,
            routes: getToolbarRoute(APP_PROJECT_MY_WORK_PATH),
          },
          {
            path: APP_PROJECT_OVERVIEW_PATH,
            title: '项目概览',
            component: OverviewLayout,
            routes: getToolbarRoute(APP_PROJECT_OVERVIEW_PATH),
          }
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
      },
      {
        path: ADMIN_PATH_DOCKER_TEMPLATE_CATE_SUFFIX,
        title: "Docker模板类别管理",
        component: TemplateCateList,
        exact: true,
      },
      {
        path: ADMIN_PATH_DOCKER_TEMPLATE_APP_SUFFIX,
        title: "Docker模板管理",
        component: TemplateList,
        exact: true,
      },
      {
        path: ADMIN_PATH_PUB_SEARCH_CATE_SUFFIX,
        title: "聚合搜索类别管理",
        component: PubSearchCateList,
        exact: true,
      },
      {
        path: ADMIN_PATH_PUB_SEARCH_SITE_SUFFIX,
        title: "聚合搜索站点管理",
        component: PubSearchSiteList,
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
