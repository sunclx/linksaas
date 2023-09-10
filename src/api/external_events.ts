import { invoke } from '@tauri-apps/api/tauri';

export type EVENT_SOURCE = number;

export const EVENT_SOURCE_GITLAB: EVENT_SOURCE = 0;
export const EVENT_SOURCE_GITHUB: EVENT_SOURCE = 1;
export const EVENT_SOURCE_GITEA: EVENT_SOURCE = 2;
export const EVENT_SOURCE_GITEE: EVENT_SOURCE = 3;
export const EVENT_SOURCE_GOGS: EVENT_SOURCE = 4;
export const EVENT_SOURCE_JIRA: EVENT_SOURCE = 5;
export const EVENT_SOURCE_CONFLUENCE: EVENT_SOURCE = 6;
export const EVENT_SOURCE_JENKINS: EVENT_SOURCE = 7;
export const EVENT_SOURCE_ATOMGIT: EVENT_SOURCE = 8;

type SOURCE_USER_POLICY = number;

export const SOURCE_USER_POLICY_NONE: SOURCE_USER_POLICY = 0; //未设置策略
export const SOURCE_USER_POLICY_DISCARD: SOURCE_USER_POLICY = 1; //丢弃事件
export const SOURCE_USER_POLICY_MAPPING: SOURCE_USER_POLICY = 2; //映射用户
export const SOURCE_USER_POLICY_SKIP_MAPPING: SOURCE_USER_POLICY = 3; //跳过用户映射环节

type GenIdAndSecretResponse = {
  code: number;
  err_msg: string;
  event_source_id: string;
  secret: string;
  event_source_url: string;
};

type CreateRequest = {
  session_id: string;
  project_id: string;
  event_source: EVENT_SOURCE;
  title: string;
  event_source_id: string;
  secret: string;
};

type CreateResponse = {
  code: number;
  err_msg: string;
};

type UpdateResponse = {
  code: number;
  err_msg: string;
};

export type EventSourceInfo = {
  event_source_id: string;
  event_source: EVENT_SOURCE;
  title: string;
  project_id: string;
  project_name: string;
  create_time: number;
  update_time: number;
  create_user_id: string;
  event_source_url: string;
  source_user_count: number; //第三方用户数量，按接收到的事件中的用户来计算
  map_user_count: number; //做了关联用户的数量
  total_event_count: number; //收到的总事件数
};

export type ListResponse = {
  code: number;
  err_msg: string;
  info_list: EventSourceInfo[];
};

type GetSecretResponse = {
  code: number;
  err_msg: string;
  secret: string;
};

type RemoveResponse = {
  code: number;
  err_msg: string;
};

export type SourceUserInfo = {
  source_user_name: string;
  source_display_name: string;
  event_source_id: string;
  user_policy: SOURCE_USER_POLICY;
  map_user_id: string;
  total_event_count: number; //收到的总事件数
  map_user_display_name: string;
};

type ListSourceUserResponse = {
  code: number;
  err_msg: string;
  info_list: SourceUserInfo[];
};

type GetResponse = {
  code: number;
  err_msg: string;
  info?: EventSourceInfo;
};

export type SetSourceUserPolicyRequest = {
  session_id: string;
  project_id: string;
  event_source_id: string;
  source_user_name: string;
  user_policy: SOURCE_USER_POLICY;
  map_user_id: string;
};

type SetSourceUserPolicyResponse = {
  code: number;
  err_msg: string;
};

//生成ID和secret
export async function gen_id_and_secret(
  session_id: string,
  project_id: string,
): Promise<GenIdAndSecretResponse> {
  const cmd = 'plugin:external_events_api|gen_id_and_secret';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GenIdAndSecretResponse>(cmd, {
    request,
  });
}

//创建第三方接入
export async function create(request: CreateRequest): Promise<CreateResponse> {
  const cmd = 'plugin:external_events_api|create';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CreateResponse>(cmd, {
    request,
  });
}

//更新第三方接入信息，目前只能改名
export async function update(
  session_id: string,
  project_id: string,
  event_source_id: string,
  title: string,
): Promise<UpdateResponse> {
  const cmd = 'plugin:external_events_api|update';
  const request = {
    session_id,
    project_id,
    event_source_id,
    title,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<UpdateResponse>(cmd, {
    request,
  });
}

//列出所有的第三方接入
export async function list(session_id: string, project_id: string): Promise<ListResponse> {
  const cmd = 'plugin:external_events_api|list';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListResponse>(cmd, {
    request,
  });
}

//获取单个数据源信息
export async function get(
  session_id: string,
  project_id: string,
  event_source_id: string,
): Promise<GetResponse> {
  const cmd = 'plugin:external_events_api|get';
  const request = {
    session_id,
    project_id,
    event_source_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetResponse>(cmd, {
    request,
  });
}

//获取第三方接入的密钥
export async function get_secret(
  session_id: string,
  project_id: string,
  event_source_id: string,
): Promise<GetSecretResponse> {
  const cmd = 'plugin:external_events_api|get_secret';
  const request = {
    session_id,
    project_id,
    event_source_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GetSecretResponse>(cmd, {
    request,
  });
}

//移除第三方接入
export async function remove(
  session_id: string,
  project_id: string,
  event_source_id: string,
): Promise<RemoveResponse> {
  const cmd = 'plugin:external_events_api|remove';
  const request = {
    session_id,
    project_id,
    event_source_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveResponse>(cmd, {
    request,
  });
}

//列出单个第三方数据源的原始用户
export async function list_source_user(
  session_id: string,
  project_id: string,
  event_source_id: string,
): Promise<ListSourceUserResponse> {
  const cmd = 'plugin:external_events_api|list_source_user';
  const request = {
    session_id,
    project_id,
    event_source_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListSourceUserResponse>(cmd, {
    request,
  });
}

//设置第三方数据源用户的关联策略
export async function set_source_user_policy(
  request: SetSourceUserPolicyRequest,
): Promise<SetSourceUserPolicyResponse> {
  const cmd = 'plugin:external_events_api|set_source_user_policy';

  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<SetSourceUserPolicyResponse>(cmd, {
    request,
  });
}
