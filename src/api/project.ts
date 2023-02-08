import { invoke } from '@tauri-apps/api/tauri';

export type BasicProjectInfo = {
  project_name: string;
  project_desc: string;
};

type CreateResponse = {
  code: number;
  err_msg: string;
  project_id: string;
};

type UpdateResponse = {
  code: number;
  err_msg: string;
};

type UserProjectPerm = {
  can_open: boolean;
  can_close: boolean;
  can_update: boolean;
  can_add_member: boolean;
  can_remove_member: boolean;
  can_leave: boolean;
  can_remove: boolean;
  can_admin: boolean;
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
  work_snap_shot_fs_id: string;
  issue_fs_id: string;
  project_fs_id: string;
  doc_fs_id: string;
  ebook_fs_id: string;
  artifact_fs_id: string;
  test_case_fs_id: string;
  min_app_fs_id: string;
  default_doc_space_id: string;
  user_project_perm: UserProjectPerm;
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

export type GetLocalApiTokenResponse = {
  code: number;
  err_msg: string;
  token: string;
};

export type RemoveLocalApiTokenResponse = {
  code: number;
  err_msg: string;
};

export type RenewLocalApiTokenResponse = {
  code: number;
  err_msg: string;
  token: string;
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

//获取本地api token
export async function get_local_api_token(session_id: string, project_id: string): Promise<GetLocalApiTokenResponse> {
  const cmd = 'plugin:project_api|get_local_api_token';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetLocalApiTokenResponse>(cmd, {
    request,
  });
}

//删除本地api token
export async function remove_local_api_token(session_id: string, project_id: string): Promise<RemoveLocalApiTokenResponse> {
  const cmd = 'plugin:project_api|remove_local_api_token';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveLocalApiTokenResponse>(cmd, {
    request,
  });
}

//更新本地api token
export async function renew_local_api_token(session_id: string, project_id: string): Promise<RenewLocalApiTokenResponse> {
  const cmd = 'plugin:project_api|renew_local_api_token';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RenewLocalApiTokenResponse>(cmd, {
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
