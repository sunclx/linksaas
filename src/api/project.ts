import { invoke } from '@tauri-apps/api/tauri';

export type TAG_SCOPRE_TYPE = number;
export const TAG_SCOPRE_ALL: TAG_SCOPRE_TYPE = 0;
export const TAG_SCOPRE_DOC: TAG_SCOPRE_TYPE = 1;
export const TAG_SCOPRE_TASK: TAG_SCOPRE_TYPE = 2;
export const TAG_SCOPRE_BUG: TAG_SCOPRE_TYPE = 3;
export const TAG_SCOPRE_REQ: TAG_SCOPRE_TYPE = 4;
export const TAG_SCOPRE_IDEA: TAG_SCOPRE_TYPE = 5;
export const TAG_SCOPRE_SPRIT_SUMMARY: TAG_SCOPRE_TYPE = 6;


export type BasicProjectInfo = {
  project_name: string;
  project_desc: string;
};

export type Setting = {
  disable_member_appraise: boolean;
  disable_test_case: boolean;
  disable_server_agent: boolean;
  disable_ext_event: boolean;
  disable_app_store: boolean;
  disable_data_anno: boolean;
  disable_api_collection: boolean;

  disable_chat: boolean;
  disable_kb: boolean;
  disable_work_plan: boolean;

  min_pure_text_len_in_chat: number;
  disable_widget_in_chat: boolean;
  allow_reply_in_days: number;

  //后续删除字段
  layout_type: number;
  disable_sprit: boolean;
};

export type CreateResponse = {
  code: number;
  err_msg: string;
  project_id: string;
};

export type UpdateResponse = {
  code: number;
  err_msg: string;
};

export type UserProjectPerm = {
  can_open: boolean;
  can_close: boolean;
  can_update: boolean;
  can_add_member: boolean;
  can_remove_member: boolean;
  can_leave: boolean;
  can_remove: boolean;
  can_admin: boolean;
};

export type TagInfo = {
  tag_id: string;
  tag_name: string;
  create_time: number;
  bg_color: string;
  use_in_doc: boolean;
  use_in_task: boolean;
  use_in_bug: boolean;
  use_in_req: boolean;
  use_in_idea: boolean;
  use_in_sprit_summary: boolean;
};


export type ProjectInfo = {
  project_id: string;
  basic_info: BasicProjectInfo;
  create_time: number;
  update_time: number;
  closed: boolean;
  owner_user_id: string;
  owner_display_name: string;
  owner_logo_uri: string;
  default_channel_id: string;
  default_role_id: string;
  channel_fs_id: string;
  issue_fs_id: string;
  project_fs_id: string;
  doc_fs_id: string;
  ebook_fs_id: string;
  artifact_fs_id: string;
  test_case_fs_id: string;
  min_app_fs_id: string;
  require_ment_fs_id: string;
  idea_fs_id: string;
  bulletin_fs_id: string;
  data_anno_fs_id: string;
  api_coll_fs_id: string;
  default_doc_space_id: string;
  user_project_perm: UserProjectPerm;
  setting: Setting;
  tip_list?: string[];
};

export type ListResponse = {
  code: number;
  err_msg: string;
  info_list: ProjectInfo[];
};

export type GetResponse = {
  code: number;
  err_msg: string;
  info: ProjectInfo;
};

export type OpenResponse = {
  code: number;
  err_msg: string;
};

export type CloseResponse = {
  code: number;
  err_msg: string;
};

export type RemoveResponse = {
  code: number;
  err_msg: string;
};

export type ChangeOwnerResponse = {
  code: number;
  err_msg: string;
};

export type LocalApiPerm = {
  access_channel: boolean;
}

export type SetLocalApiPermResponse = {
  code: number;
  err_msg: string;
};

export type GetLocalApiPermResponse = {
  code: number;
  err_msg: string;
  perm: LocalApiPerm;
};

export type UpdateSettingRequest = {
  session_id: string;
  project_id: string;
  setting: Setting;
};

export type UpdateSettingResponse = {
  code: number;
  err_msg: string;
};

export type UpdateTipListRequest = {
  session_id: string;
  project_id: string;
  tip_list: string[];
};

export type UpdateTipListResponse = {
  code: number;
  err_msg: string;
};

export type AddTagRequest = {
  session_id: string;
  project_id: string;
  tag_name: string;
  bg_color: string;
  use_in_doc: boolean;
  use_in_task: boolean;
  use_in_bug: boolean;
  use_in_req: boolean;
  use_in_idea: boolean;
  use_in_sprit_summary: boolean;
};

export type AddTagResponse = {
  code: number;
  err_msg: string;
  tag_id: string;
};

export type UpdateTagRequest = {
  session_id: string;
  project_id: string;
  tag_id: string;
  tag_name: string;
  bg_color: string;
  use_in_doc: boolean;
  use_in_task: boolean;
  use_in_bug: boolean;
  use_in_req: boolean;
  use_in_idea: boolean;
  use_in_sprit_summary: boolean;
};

export type UpdateTagResponse = {
  code: number;
  err_msg: string;
};

export type RemoveTagRequest = {
  session_id: string;
  project_id: string;
  tag_id: string;
};

export type RemoveTagResponse = {
  code: number;
  err_msg: string;
};


export type ListTagRequest = {
  session_id: string;
  project_id: string;
  tag_scope_type: TAG_SCOPRE_TYPE;
};

export type ListTagResponse = {
  code: number;
  err_msg: string;
  tag_info_list: TagInfo[];
};

//创建项目
export async function create(
  session_id: string,
  basic_info: BasicProjectInfo,
): Promise<CreateResponse> {
  const request = {
    session_id,
    basic_info,
  };
  const cmd = 'plugin:project_api|create';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CreateResponse>(cmd, {
    request,
  });
}

//更新项目信息
export async function update(
  session_id: string,
  project_id: string,
  basic_info: BasicProjectInfo,
): Promise<UpdateResponse> {
  const request = {
    session_id,
    project_id,
    basic_info,
  };
  const cmd = 'plugin:project_api|update';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<UpdateResponse>('plugin:project_api|update', {
    request,
  });
}

//列出项目
export async function list(
  session_id: string,
  filter_closed: boolean,
  closed: boolean,
): Promise<ListResponse> {
  const request = {
    session_id,
    filter_closed,
    closed,
  };
  const cmd = 'plugin:project_api|list';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListResponse>(cmd, {
    request,
  });
}

//获取单个项目信息
export async function get_project(session_id: string, project_id: string): Promise<GetResponse> {
  const cmd = 'plugin:project_api|get';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GetResponse>(cmd, {
    request,
  });
}

//打开项目，只有关闭状态下的项目才能打开
export async function open(session_id: string, project_id: string): Promise<OpenResponse> {
  const cmd = 'plugin:project_api|open';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<OpenResponse>(cmd, {
    request,
  });
}

//关闭项目，项目关闭后，所有设置项目数据变更的操作都被禁止，包括频道，工单等
export async function close(session_id: string, project_id: string): Promise<CloseResponse> {
  const cmd = 'plugin:project_api|close';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CloseResponse>(cmd, {
    request,
  });
}

//删除项目
export async function remove(session_id: string, project_id: string): Promise<RemoveResponse> {
  const cmd = 'plugin:project_api|remove';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveResponse>(cmd, {
    request,
  });
}

//转移超级管理员权限
export async function change_owner(session_id: string, project_id: string, member_user_id: string): Promise<ChangeOwnerResponse> {
  const cmd = 'plugin:project_api|change_owner';
  const request = {
    session_id,
    project_id,
    member_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ChangeOwnerResponse>(cmd, {
    request,
  });
}

//设置本地api 权限
export async function set_local_api_perm(session_id: string, project_id: string, perm: LocalApiPerm): Promise<SetLocalApiPermResponse> {
  const cmd = 'plugin:project_api|set_local_api_perm';
  const request = {
    session_id,
    project_id,
    perm,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<SetLocalApiPermResponse>(cmd, {
    request,
  });
}

//获取本地api 权限
export async function get_local_api_perm(session_id: string, project_id: string): Promise<GetLocalApiPermResponse> {
  const cmd = 'plugin:project_api|get_local_api_perm';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetLocalApiPermResponse>(cmd, {
    request,
  });
}

// 设置项目配置
export async function update_setting(request: UpdateSettingRequest): Promise<UpdateSettingResponse> {
  const cmd = 'plugin:project_api|update_setting';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateSettingResponse>(cmd, {
    request,
  });
}

//更新技巧集合
export async function update_tip_list(request: UpdateTipListRequest): Promise<UpdateTipListResponse> {
  const cmd = 'plugin:project_api|update_tip_list';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateTipListResponse>(cmd, {
    request,
  });
}

//增加标签
export async function add_tag(request: AddTagRequest): Promise<AddTagResponse> {
  const cmd = 'plugin:project_api|add_tag';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<AddTagResponse>(cmd, {
    request,
  });
}

//更新标签
export async function update_tag(request: UpdateTagRequest): Promise<UpdateTagResponse> {
  const cmd = 'plugin:project_api|update_tag';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateTagResponse>(cmd, {
    request,
  });
}

//删除标签
export async function remove_tag(request: RemoveTagRequest): Promise<RemoveTagResponse> {
  const cmd = 'plugin:project_api|remove_tag';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<RemoveTagResponse>(cmd, {
    request,
  });
}

//列出标签
export async function list_tag(request: ListTagRequest): Promise<ListTagResponse> {
  const cmd = 'plugin:project_api|list_tag';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListTagResponse>(cmd, {
    request,
  });
}