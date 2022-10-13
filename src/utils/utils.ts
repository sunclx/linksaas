import type { IssueInfo, ISSUE_TYPE } from '@/api/project_issue';
import { ISSUE_TYPE_TASK, ISSUE_TYPE_BUG } from '@/api/project_issue';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import { TASK_VIEW_SUFFIX, BUG_VIEW_SUFFIX, APP_PROJECT_PATH } from './constant';

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
  // if (pathname.includes('/task')) {
  //   return true;
  // }
  // else if (pathname.includes(APP_PROJECT_DOC_PATH + "/task")) {
  //   return true;
  // } else if (pathname.includes(APP_PROJECT_DOC_CB_PATH + "/task")) {
  //   return true;
  // }
  return pathname.includes('/task');
};

// 根据路由获取 issue_type
export const getIssue_type = (pathname: string): ISSUE_TYPE => {
  return getIsTask(pathname) ? ISSUE_TYPE_TASK : ISSUE_TYPE_BUG;
};

export const getIssueViewUrl = (pathname: string): string => {
  if (pathname.includes('/task')) return APP_PROJECT_PATH + TASK_VIEW_SUFFIX;
  return APP_PROJECT_PATH + BUG_VIEW_SUFFIX;
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

let _globalId = 0;

export const uniqId = () => {
  _globalId++;
  return _globalId.toFixed(0);
};
