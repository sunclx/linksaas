import type { IssueInfo, ISSUE_TYPE } from '@/api/project_issue';
import { ISSUE_TYPE_TASK, ISSUE_TYPE_BUG } from '@/api/project_issue';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import { BUG_DETAIL_SUFFIX, APP_PROJECT_KB_DOC_PATH, TASK_DETAIL_SUFFIX, TASK_CREATE_SUFFIX, BUG_CREATE_SUFFIX, APP_PROJECT_OVERVIEW_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_WORK_PLAN_PATH, APP_PROJECT_HOME_PATH } from './constant';
import { nanoid } from 'nanoid';

export const goBack = (/*history: { goBack: () => void }*/) => {
  createBrowserHistory().goBack();
};

export const goLogin = (/*history: { goBack: () => void }*/) => {
  createBrowserHistory().push('/user/login');
};

export const timeToDateString = (date: number, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date).format(format);
};

export const getTime = (date: moment.MomentInput): number => {
  return moment(date).valueOf();
};

// 判断是任务还是bug
export const getIsTask = (pathname: string) => {
  return pathname.includes('/task');
};

// 根据路由获取 issue_type
export const getIssue_type = (pathname: string): ISSUE_TYPE => {
  return getIsTask(pathname) ? ISSUE_TYPE_TASK : ISSUE_TYPE_BUG;
};



export const getIssueDetailUrl = (pathname: string): string => {
  if (pathname.startsWith(APP_PROJECT_HOME_PATH)){
    return getIsTask(pathname) ? APP_PROJECT_HOME_PATH + TASK_DETAIL_SUFFIX : APP_PROJECT_HOME_PATH + BUG_DETAIL_SUFFIX;
  }else if (pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
    return getIsTask(pathname) ? APP_PROJECT_WORK_PLAN_PATH + TASK_DETAIL_SUFFIX : APP_PROJECT_WORK_PLAN_PATH + BUG_DETAIL_SUFFIX;
  }else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
    return getIsTask(pathname) ? APP_PROJECT_KB_DOC_PATH + TASK_DETAIL_SUFFIX : APP_PROJECT_KB_DOC_PATH + BUG_DETAIL_SUFFIX;
  }else if (pathname.startsWith(APP_PROJECT_MY_WORK_PATH)){
    return getIsTask(pathname) ? APP_PROJECT_MY_WORK_PATH + TASK_DETAIL_SUFFIX : APP_PROJECT_MY_WORK_PATH + BUG_DETAIL_SUFFIX;
  }
  return getIsTask(pathname) ? APP_PROJECT_OVERVIEW_PATH + TASK_DETAIL_SUFFIX : APP_PROJECT_OVERVIEW_PATH + BUG_DETAIL_SUFFIX;
};

export const getIssueCreateUrl = (pathname: string): string => {
  if (pathname.startsWith(APP_PROJECT_HOME_PATH)) {
    return getIsTask(pathname) ? APP_PROJECT_HOME_PATH + TASK_CREATE_SUFFIX : APP_PROJECT_HOME_PATH + BUG_CREATE_SUFFIX;
  }else if (pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
    return getIsTask(pathname) ? APP_PROJECT_WORK_PLAN_PATH + TASK_CREATE_SUFFIX : APP_PROJECT_WORK_PLAN_PATH + BUG_CREATE_SUFFIX;
  }else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
    return getIsTask(pathname) ? APP_PROJECT_KB_DOC_PATH + TASK_CREATE_SUFFIX : APP_PROJECT_KB_DOC_PATH + BUG_CREATE_SUFFIX;
  }else if (pathname.startsWith(APP_PROJECT_MY_WORK_PATH)){
    return getIsTask(pathname) ? APP_PROJECT_MY_WORK_PATH + TASK_CREATE_SUFFIX : APP_PROJECT_MY_WORK_PATH + BUG_CREATE_SUFFIX;
  }
  return getIsTask(pathname) ? APP_PROJECT_OVERVIEW_PATH + TASK_CREATE_SUFFIX : APP_PROJECT_OVERVIEW_PATH + BUG_CREATE_SUFFIX;
};

// 根据数据 issue_type 字段获取 type
export const issueTypeIsTask = (row: IssueInfo) => {
  const { issue_type } = row;
  return issue_type === ISSUE_TYPE_TASK;
};

// 获取 任务还是缺陷 文字
export const getIssueText = (pathname: string): string => {
  return getIsTask(pathname) ? '任务' : '缺陷';
};

// 分钟转小时
export const minuteToHour = (num: number) => {
  return num / 60;
};

export const getExtraInfoText = (pathname: string) => {
  return getIsTask(pathname) ? 'ExtraTaskInfo' : 'ExtraBugInfo';
};

// 表单专用工具
// ------------------------

type ConditionType = (value: unknown) => boolean;

export const validator = (condition: ConditionType, msg: string = '格式错误') => {
  return (_: unknown, value: string) => {
    if (!value) {
      return Promise.resolve();
    }
    if (!condition(value)) {
      return Promise.reject(new Error(msg));
    }
    return Promise.resolve();
  };
};

export const regexValidator = (regex: RegExp, msg?: string) => {
  return validator((value) => regex.test(value as string), msg);
};

export const arrayToObject = (
  arr: Record<string, unknown>[],
  options: { key: string; labelKey: string } = {
    key: 'value',
    labelKey: 'label',
  },
) => {
  const obj = {};
  const { key, labelKey } = options;
  arr.forEach((item) => {
    const itemKey = item[key] as string;
    obj[itemKey] = labelKey ? item[labelKey] : item;
  });
  return obj;
};


export const uniqId = () => {
  return nanoid();
};
