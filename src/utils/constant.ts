import * as issueApi from '@/api/project_issue';

export const USER_LOGIN_PATH = '/user/login';
export const WORKBENCH_PATH = '/app/workbench';
export const RESET_TEXT = 'resetPassword';
export const APP_PROJECT_CHAT_PATH = '/app/project/chat';
export const APP_PROJECT_KB_PATH = '/app/project/kb';
export const APP_PROJECT_KB_DOC_PATH = '/app/project/kb/doc';
export const APP_PROJECT_KB_CB_PATH = '/app/project/kb/content_block';

export const TASK_DETAIL_SUFFIX = '/task/detail';
export const BUG_DETAIL_SUFFIX = '/bug/detail';

export const TASK_CREATE_SUFFIX = '/task/create';
export const BUG_CREATE_SUFFIX = '/bug/create';

export const ROBOT_METRIC_SUFFIX = '/robot/metric';

export const REPO_ACTION_EXEC_RESULT_SUFFIX = '/repo/exec_result';

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

export enum FILTER_PROJECT_ENUM {
  ALL = 'all',
  UNDERWAY = 'underway',
  CLOSE = 'close',
}

export const filterProjectItemList = [
  {
    label: '全部项目',
    value: FILTER_PROJECT_ENUM.ALL,
  },
  {
    label: '进行中项目',
    value: FILTER_PROJECT_ENUM.UNDERWAY,
  },
  {
    label: '已结束项目',
    value: FILTER_PROJECT_ENUM.CLOSE,
  },
];

export enum PROJECT_STATE_OPT_ENUM {
  FINISH = 'finish',
  ACTIVATE = 'activate',
  QUIT = 'quit',
  REMOVE = 'remove',
}

export const snapShotOpt = [
  {
    label: '开启',
    value: true,
  },
  {
    label: '不开启',
    value: false,
  },
];

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
