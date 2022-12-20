import { invoke } from '@tauri-apps/api/tauri';

import type { AllEvent } from './event_type';

type EVENT_TYPE = number;

export const EVENT_TYPE_USER: EVENT_TYPE = 0; //用户相关事件
export const EVENT_TYPE_PROJECT: EVENT_TYPE = 1; //除任务，缺陷，项目计划，文档，网盘外的项目事件
export const EVENT_TYPE_TASK: EVENT_TYPE = 2; //任务事件
export const EVENT_TYPE_BUG: EVENT_TYPE = 3; //缺陷事件
export const EVENT_TYPE_SPRIT: EVENT_TYPE = 4; //项目计划事件
export const EVENT_TYPE_DOC: EVENT_TYPE = 5; //文档事件
export const EVENT_TYPE_DISK: EVENT_TYPE = 6; //网盘事件
export const EVENT_TYPE_WORK_SNAPSHOT: EVENT_TYPE = 7; //快照
export const EVENT_TYPE_APP: EVENT_TYPE = 8; //项目应用
export const EVENT_TYPE_BOOK_SHELF: EVENT_TYPE = 9; //电子书
export const EVENT_TYPE_ROBOT: EVENT_TYPE = 10;         //机器人
export const EVENT_TYPE_EARTHLY: EVENT_TYPE = 11;       // ci/cd
export const EVENT_TYPE_TEST_CASE: EVENT_TYPE = 12;     //测试用例
export const EVENT_TYPE_GITLAB: EVENT_TYPE = 100; //gitlab事件
export const EVENT_TYPE_GITHUB: EVENT_TYPE = 101; //github事件
export const EVENT_TYPE_GITEA: EVENT_TYPE = 102; //gitea事件
export const EVENT_TYPE_GITEE: EVENT_TYPE = 103; //gitee事件
export const EVENT_TYPE_GOGS: EVENT_TYPE = 104; //gogs事件
export const EVENT_TYPE_JIRA: EVENT_TYPE = 105; //jira事件
export const EVENT_TYPE_CONFLUENCE: EVENT_TYPE = 106; //confluence事件
export const EVENT_TYPE_JENKINS: EVENT_TYPE = 107; //jenkins事件

type EVENT_REF_TYPE = number;

export const EVENT_REF_TYPE_NONE: EVENT_REF_TYPE = 0; //没有相关事件引用
export const EVENT_REF_TYPE_USER: EVENT_REF_TYPE = 1; //用户事件引用
export const EVENT_REF_TYPE_PROJECT: EVENT_REF_TYPE = 2; //项目事件引用
export const EVENT_REF_TYPE_CHANNEL: EVENT_REF_TYPE = 3; //频道事件引用
export const EVENT_REF_TYPE_SPRIT: EVENT_REF_TYPE = 4; //迭代事件引用
export const EVENT_REF_TYPE_TASK: EVENT_REF_TYPE = 5; //任务事件引用
export const EVENT_REF_TYPE_BUG: EVENT_REF_TYPE = 6; //缺陷事件引用
export const EVENT_REF_TYPE_DOC: EVENT_REF_TYPE = 7;
export const EVENT_REF_TYPE_BOOK: EVENT_REF_TYPE = 8;
export const EVENT_REF_TYPE_ROBOT: EVENT_REF_TYPE = 9;
export const EVENT_REF_TYPE_REPO: EVENT_REF_TYPE = 10;
export const EVENT_REF_TYPE_TEST_CASE: EVENT_REF_TYPE = 11;

export type DayEventStatusItem = {
  day: number;
  event_type: EVENT_TYPE;
  count: number;
};

export type ListUserDayStatusResponse = {
  code: number;
  err_msg: string;
  status_item_list: DayEventStatusItem[];
};

export type PluginEvent = {
  event_id: string;
  user_id: string;
  user_display_name: string;
  project_id: string;
  project_name: string;
  event_type: EVENT_TYPE;
  event_time: number;
  ref_type: EVENT_REF_TYPE;
  ref_id: string;
  event_data: AllEvent;
  cur_user_display_name: string;
  cur_logo_uri: string;
};

export type DayAddonInfo = {
  project_id: string;
  user_id: string;
  day: number;
  content: string;
  user_display_name: string;
  user_logo_uri: string;
};

export type PluginListUserEventResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  event_list: PluginEvent[];
};

export type ListProjectDayStatusRequest = {
  session_id: string;
  project_id: string;
  filter_by_member_user_id: boolean;
  member_user_id: string;
  from_day: number;
  to_day: number;
};

export type ListProjectDayStatusResponse = {
  code: number;
  err_msg: string;
  status_item_list: DayEventStatusItem[];
};

export type ListProjectEventRequest = {
  session_id: string;
  project_id: string;
  filter_by_member_user_id: boolean;
  member_user_id: string;
  from_time: number;
  to_time: number;
  offset: number;
  limit: number;
};

export type PluginListProjectEventResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  event_list: PluginEvent[];
  day_addon_list: DayAddonInfo[];
};

export type ListEventByRefRequest = {
  session_id: string;
  project_id: string;
  event_type: EVENT_TYPE;
  ref_type: EVENT_REF_TYPE;
  ref_id: string;
};

export type PluginListEventByRefResponse = {
  code: number;
  err_msg: string;
  event_list: PluginEvent[];
};

export type PluginListEventByGetResponse = {
  code: number;
  err_msg: string;
  event: PluginEvent;
};

export type PluginListEventByIdResponse = {
  code: number;
  err_msg: string;
  event_list: PluginEvent[];
};

export type SetDayAddonInfoRequest = {
  session_id: string;
  project_id: string;
  day: number;
  content: string;
};

export type SetDayAddonInfoResponse = {
  code: number;
  err_msg: string;
};

export type GetDayAddonInfoRequest = {
  session_id: string;
  project_id: string;
  day: number;
};

export type GetDayAddonInfoResponse = {
  code: number;
  err_msg: string;
  info: DayAddonInfo;
};

//列出用户维度的每天事件数量
export async function list_user_day_status(
  session_id: string,
  from_day: number,
  to_day: number,
): Promise<ListUserDayStatusResponse> {
  const cmd = 'plugin:events_api|list_user_day_status';
  const request = {
    session_id,
    from_day,
    to_day,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListUserDayStatusResponse>(cmd, {
    request,
  });
}

//列出用户维度的事件
export async function list_user_event(
  session_id: string,
  from_time: number,
  to_time: number,
  offset: number,
  limit: number,
): Promise<PluginListUserEventResponse> {
  const cmd = 'plugin:events_api|list_user_event';
  const request = {
    session_id,
    from_time,
    to_time,
    offset,
    limit,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<PluginListUserEventResponse>(cmd, {
    request,
  });
}

//列出项目维度的每天事件数量
export async function list_project_day_status(
  request: ListProjectDayStatusRequest,
): Promise<ListProjectDayStatusResponse> {
  const cmd = 'plugin:events_api|list_project_day_status';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListProjectDayStatusResponse>(cmd, {
    request,
  });
}

//列出项目维度额事件
export async function list_project_event(
  request: ListProjectEventRequest,
): Promise<PluginListProjectEventResponse> {
  const cmd = 'plugin:events_api|list_project_event';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<PluginListProjectEventResponse>(cmd, {
    request,
  });
}

//按引用维度列出事件，目前只有任务和缺陷维度会用到
export async function list_event_by_ref(
  request: ListEventByRefRequest,
): Promise<PluginListEventByRefResponse> {
  const cmd = 'plugin:events_api|list_event_by_ref';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<PluginListEventByRefResponse>(cmd, { request });
}

//获取单个事件信息
export async function get_event(
  session_id: string,
  project_id: string,
  event_id: string,
): Promise<PluginListEventByGetResponse> {
  const cmd = 'plugin:events_api|get_event';
  const request = {
    session_id,
    project_id,
    event_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<PluginListEventByGetResponse>(cmd, {
    request,
  });
}

//按id批量获取事件信息
export async function list_event_by_id(
  session_id: string,
  project_id: string,
  event_id_list: string[],
): Promise<PluginListEventByIdResponse> {
  const cmd = 'plugin:events_api|list_event_by_id';
  const request = {
    session_id,
    project_id,
    event_id_list,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<PluginListEventByIdResponse>(cmd, {
    request,
  });
}

//设置附加信息
export async function set_day_addon_info(request: SetDayAddonInfoRequest): Promise<SetDayAddonInfoResponse> {
  const cmd = 'plugin:events_api|set_day_addon_info';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<SetDayAddonInfoResponse>(cmd, {
    request,
  });
}

//获取附加信息
export async function get_day_addon_info(request: GetDayAddonInfoRequest): Promise<GetDayAddonInfoResponse> {
  const cmd = 'plugin:events_api|get_day_addon_info';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GetDayAddonInfoResponse>(cmd, {
    request,
  });
}