import * as issueApi from '@/api/project_issue';

export const WORKBENCH_PATH = '/app/workbench';
export const PUB_RES_PATH = '/app/pubres';

export const RESET_TEXT = 'resetPassword';

export const APP_PROJECT_MANAGER_PATH = '/app/project_mgr';
export const APP_PROJECT_PATH = '/app/project';
export const APP_PROJECT_HOME_PATH = '/app/project/home';
export const APP_PROJECT_WORK_PLAN_PATH = '/app/project/work_plan';
export const APP_PROJECT_KB_PATH = '/app/project/kb';
export const APP_PROJECT_KB_DOC_PATH = '/app/project/kb/doc';
export const APP_PROJECT_KB_BOARD_PATH = '/app/project/kb/board';
export const APP_PROJECT_MY_WORK_PATH = '/app/project/my_work';
export const APP_PROJECT_OVERVIEW_PATH = '/app/project/overview';

export const APP_GROUP_PATH = '/app/group';
export const APP_GROUP_HOME_PATH = '/app/group/home';
export const APP_GROUP_POST_DETAIL_PATH = '/app/group/post_detail';
export const APP_GROUP_POST_LIST_PATH = '/app/group/post_list';
export const APP_GROUP_POST_EDIT_PATH = '/app/group/post_edit';
export const APP_GROUP_MEMBER_LIST_PATH = '/app/group/member_list';

export const TASK_DETAIL_SUFFIX = '/task/detail';
export const BUG_DETAIL_SUFFIX = '/bug/detail';

export const TASK_CREATE_SUFFIX = '/task/create';
export const BUG_CREATE_SUFFIX = '/bug/create';

export const REQUIRE_MENT_CREATE_SUFFIX = '/req/create';
export const REQUIRE_MENT_DETAIL_SUFFIX = '/req/detail';


export const ADMIN_PATH = "/admin";

export const ADMIN_PATH_USER_LIST_SUFFIX = '/admin/user/list';
export const ADMIN_PATH_USER_DETAIL_SUFFIX = '/admin/user/detail';
export const ADMIN_PATH_USER_CREATE_SUFFIX = '/admin/user/create';

export const ADMIN_PATH_PROJECT_LIST_SUFFIX = '/admin/project/list';
export const ADMIN_PATH_PROJECT_DETAIL_SUFFIX = '/admin/project/detail';
export const ADMIN_PATH_PROJECT_CREATE_SUFFIX = '/admin/project/create';

export const ADMIN_PATH_APPSTORE_CATE_SUFFIX = '/admin/appstore/cate';
export const ADMIN_PATH_APPSTORE_APP_SUFFIX = '/admin/appstore/app';

export const ADMIN_PATH_GROUP_LIST_SUFFIX = '/admin/group/list';
export const ADMIN_PATH_GROUP_AUDIT_RECOMMEND_SUFFIX = '/admin/group/audit_recommend';


export const ADMIN_PATH_CLIENT_MENU_SUFFIX = '/admin/client/menu';

export const ADMIN_PATH_DOCKER_TEMPLATE_CATE_SUFFIX = '/admin/dockertemplate/cate';
export const ADMIN_PATH_DOCKER_TEMPLATE_APP_SUFFIX = '/admin/dockertemplate/app';

export const ADMIN_PATH_DEV_CONTAINER_PKG_SUFFIX = '/admin/devcontainer/pkg';



export const statusText = {
  [issueApi.ISSUE_STATE_PLAN]: '规划中阶段', //规划中
  [issueApi.ISSUE_STATE_PROCESS]: '处理阶段', //处理
  [issueApi.ISSUE_STATE_CHECK]: '验收阶段', //验收
  [issueApi.ISSUE_STATE_CLOSE]: '关闭阶段', //关闭
};

export enum ISSUE_STATE_COLOR_ENUM {
  规划中颜色 = '72 201 118', //规划中
  处理颜色 = '83 165 255', //处理
  验收颜色 = '247 136 91', //验收
  关闭颜色 = '196 196 196', //关闭
}

export const issueState = {
  [issueApi.ISSUE_STATE_PLAN]: {
    label: '规划中',
    value: issueApi.ISSUE_STATE_PLAN,
  },
  [issueApi.ISSUE_STATE_PROCESS]: {
    label: '处理',
    value: issueApi.ISSUE_STATE_PROCESS,
  },
  [issueApi.ISSUE_STATE_CHECK]: {
    label: '验收',
    value: issueApi.ISSUE_STATE_CHECK,
  },
  [issueApi.ISSUE_STATE_CLOSE]: {
    label: '关闭',
    value: issueApi.ISSUE_STATE_CLOSE,
  },
  [issueApi.ISSUE_STATE_PROCESS_OR_CHECK]: {
    label: '处理或验收',
    value: issueApi.ISSUE_STATE_PROCESS_OR_CHECK,
  }
};

export const taskPriority = {
  [issueApi.TASK_PRIORITY_LOW]: {
    label: '低',
    value: issueApi.TASK_PRIORITY_LOW,
    color: '#38CB80',
  },
  [issueApi.TASK_PRIORITY_MIDDLE]: {
    label: '中',
    value: issueApi.TASK_PRIORITY_MIDDLE,
    color: '#FF8963',
  },
  [issueApi.TASK_PRIORITY_HIGH]: {
    label: '高',
    value: issueApi.TASK_PRIORITY_HIGH,
    color: '#FF4C30',
  },
};

export const bugLevel = {
  [issueApi.BUG_LEVEL_MINOR]: {
    label: '提示',
    value: issueApi.BUG_LEVEL_MINOR,
    color: '#06C776',
  },
  [issueApi.BUG_LEVEL_MAJOR]: {
    label: '一般',
    value: issueApi.BUG_LEVEL_MAJOR,
    color: '#F99B00',
  },
  [issueApi.BUG_LEVEL_CRITICAL]: {
    label: '严重',
    value: issueApi.BUG_LEVEL_CRITICAL,
    color: '#FB6D17',
  },
  [issueApi.BUG_LEVEL_BLOCKER]: {
    label: '致命',
    value: issueApi.BUG_LEVEL_BLOCKER,
    color: '#DF0627',
  },
};

export const bugPriority = {
  [issueApi.BUG_PRIORITY_LOW]: {
    label: '低优先级',
    value: issueApi.BUG_PRIORITY_LOW,
    color: '#1D85F8',
  },
  [issueApi.BUG_PRIORITY_NORMAL]: {
    label: '正常处理',
    value: issueApi.BUG_PRIORITY_NORMAL,
    color: '#06C776',
  },
  [issueApi.BUG_PRIORITY_HIGH]: {
    label: '高度重视',
    value: issueApi.BUG_PRIORITY_HIGH,
    color: '#F99B00',
  },
  [issueApi.BUG_PRIORITY_URGENT]: {
    label: '急需解决',
    value: issueApi.BUG_PRIORITY_URGENT,
    color: '#FB6D17',
  },
  [issueApi.BUG_PRIORITY_IMMEDIATE]: {
    label: '马上解决',
    value: issueApi.BUG_PRIORITY_IMMEDIATE,
    color: '#DF0627',
  },
};

export enum FILTER_DOC_ENUM {
  ALL = 'all',
  CONCERN = 'concern',
  NOT_CONCERN = 'not_concern',
}

export const filterDocItemList = [
  {
    label: '不限',
    value: FILTER_DOC_ENUM.ALL,
  },
  {
    label: '已关注的文档',
    value: FILTER_DOC_ENUM.CONCERN,
  },
  {
    label: '未关注的文档',
    value: FILTER_DOC_ENUM.NOT_CONCERN,
  },
];

export enum PROJECT_SETTING_TAB {
  PROJECT_SETTING_LAYOUT,
  PROJECT_SETTING_ALARM,
  PROJECT_SETTING_TIPLIST,
  PROJECT_SETTING_TAGLIST,
  PROJECT_SETTING_EVENT,
  PROJECT_SETTING_DESC,
  PROJECT_SETTING_DEV_CLOUD,
}
