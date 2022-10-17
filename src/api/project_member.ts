import { invoke } from '@tauri-apps/api/tauri';

type GenInviteResponse = {
  code: number;
  err_msg: string;
  invite_code: string;
};

type JoinResponse = {
  code: number;
  err_msg: string;
  project_id: string;
};

type LeaveResponse = {
  code: number;
  err_msg: string;
};

export type BasicRoleInfo = {
  role_name: string;
  ///具有所有权限
  admin: boolean;
};

type CreateRoleResponse = {
  code: number;
  err_msg: string;
  role_id: string;
};

type UpdateRoleResponse = {
  code: number;
  err_msg: string;
};

type RemoveRoleResponse = {
  code: number;
  err_msg: string;
};

export type RoleInfo = {
  role_id: string;
  project_id: string;
  basic_info: BasicRoleInfo;
  create_time: number;
  update_time: number;
  default_role: boolean;
};

type ListRoleResponse = {
  code: number;
  err_msg: string;
  role_list: RoleInfo[];
};

type RemoveMemberResponse = {
  code: number;
  err_msg: string;
};

type SetMemberRoleResponse = {
  code: number;
  err_msg: string;
};

export type WorkSnapShotInfo = {
  enable: boolean;
  interval: number; //单位秒
};

export type MemberInfo = {
  project_id: string;
  member_user_id: string;
  role_id: string;
  role_name: string;
  work_snap_shot_info: WorkSnapShotInfo;
  last_event_id: string;
  create_time: number;
  update_time: number;
  display_name: string;
  logo_uri: string;
  online: boolean;
  is_cur_user: boolean;
  is_project_owner: boolean;
  can_admin: boolean;
  reminder_channel_id: string;
  float_notice_per_day: number;
};

type SetWorkSnapShotRequest = {
  session_id: string;
  project_id: string;
  member_user_id: string;
  info: WorkSnapShotInfo;
};

type SetWorkSnapShotResponse = {
  code: number;
  err_msg: string;
};

export type ListMemberResponse = {
  code: number;
  err_msg: string;
  member_list: MemberInfo[];
};

type GetMemberResponse = {
  code: number;
  err_msg: string;
  member: MemberInfo;
};

export type GetWorkSnapShotStatusResponse = {
  code: number;
  err_msg: string;
  fs_id: string;
  last_time_stamp: number;
  work_snap_shot_info: WorkSnapShotInfo;
};

export type SetFloatNoticePerDayRequest = {
  session_id: string;
  project_id: string;
  member_user_id: string;
  float_notice_per_day: number;
};

export type SetFloatNoticePerDayResponse = {
  code: number;
  err_msg: string;
};

export type GetFloatNoticePerDayRequest = {
  session_id: string;
  project_id: string;
};

export type GetFloatNoticePerDayResponse = {
  code: number;
  err_msg: string;
  float_notice_per_day: number;
  remain_count: number;
};


//生成加入项目邀请码
export async function gen_invite(
  session_id: string,
  project_id: string,
  ttl: number,
): Promise<GenInviteResponse> {
  const cmd = 'plugin:project_member_api|gen_invite';
  const request = {
    session_id,
    project_id,
    ttl,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GenInviteResponse>(cmd, {
    request,
  });
}

//通过邀请码加入项目
export async function join(session_id: string, invite_code: string): Promise<JoinResponse> {
  const cmd = 'plugin:project_member_api|join';
  const request = {
    session_id,
    invite_code,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<JoinResponse>(cmd, {
    request,
  });
}

//离开项目
export async function leave(session_id: string, project_id: string): Promise<LeaveResponse> {
  const cmd = 'plugin:project_member_api|leave';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<LeaveResponse>(cmd, {
    request,
  });
}

//创建项目角色
export async function create_role(
  session_id: string,
  project_id: string,
  basic_info: BasicRoleInfo,
): Promise<CreateRoleResponse> {
  const cmd = 'plugin:project_member_api|create_role';
  const request = {
    session_id,
    project_id,
    basic_info,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CreateRoleResponse>(cmd, {
    request,
  });
}

//更新项目角色
export async function update_role(
  session_id: string,
  project_id: string,
  role_id: string,
  basic_info: BasicRoleInfo,
): Promise<UpdateRoleResponse> {
  const cmd = 'plugin:project_member_api|update_role';
  const request = {
    session_id,
    project_id,
    role_id,
    basic_info,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<UpdateRoleResponse>(cmd, {
    request,
  });
}

//移除项目角色
export async function remove_role(
  session_id: string,
  project_id: string,
  role_id: string,
): Promise<RemoveRoleResponse> {
  const cmd = 'plugin:project_member_api|remove_role';
  const request = {
    session_id,
    project_id,
    role_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveRoleResponse>(cmd, {
    request,
  });
}

//列出项目角色
export async function list_role(session_id: string, project_id: string): Promise<ListRoleResponse> {
  const cmd = 'plugin:project_member_api|list_role';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListRoleResponse>(cmd, {
    request,
  });
}

//移除项目成员
export async function remove_member(
  session_id: string,
  project_id: string,
  member_user_id: string,
): Promise<RemoveMemberResponse> {
  const cmd = 'plugin:project_member_api|remove_member';
  const request = {
    session_id,
    project_id,
    member_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveMemberResponse>(cmd, {
    request,
  });
}

//设置项目成员角色
export async function set_member_role(
  session_id: string,
  project_id: string,
  role_id: string,
  member_user_id: string,
): Promise<SetMemberRoleResponse> {
  const cmd = 'plugin:project_member_api|set_member_role';
  const request = {
    session_id,
    project_id,
    role_id,
    member_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<SetMemberRoleResponse>(cmd, {
    request,
  });
}

//列出项目成员
export async function list_member(
  session_id: string,
  project_id: string,
  filter_by_member_user_id: boolean,
  member_user_id_list: string[],
): Promise<ListMemberResponse> {
  const cmd = 'plugin:project_member_api|list_member';
  const request = {
    session_id,
    project_id,
    filter_by_member_user_id,
    member_user_id_list,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListMemberResponse>(cmd, {
    request,
  });
}

//获取单个成员
export async function get_member(
  session_id: string,
  project_id: string,
  member_user_id: string,
): Promise<GetMemberResponse> {
  const cmd = 'plugin:project_member_api|get_member';
  const request = {
    session_id,
    project_id,
    member_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetMemberResponse>(cmd, {
    request,
  });
}

//工作快照设置
export async function set_work_snap_shot(
  request: SetWorkSnapShotRequest,
): Promise<SetWorkSnapShotResponse> {
  const cmd = 'plugin:project_member_api|set_work_snap_shot';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<SetWorkSnapShotResponse>(cmd, {
    request,
  });
}

//获取快照状态
export async function get_work_snap_shot_status(session_id: string, project_id: string): Promise<GetWorkSnapShotStatusResponse> {
  const cmd = 'plugin:project_member_api|get_work_snap_shot_status';
  console.log(`%c${cmd}`, 'color:#0f0;', session_id, project_id);

  return invoke<GetWorkSnapShotStatusResponse>(cmd, {
    request: {
      session_id,
      project_id,
    },
  });
}

//设置浮动提示数量
export async function set_float_notice_per_day(request: SetFloatNoticePerDayRequest): Promise<SetFloatNoticePerDayResponse> {
  const cmd = 'plugin:project_member_api|set_float_notice_per_day';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<SetFloatNoticePerDayResponse>(cmd, {
    request,
  });
}
//获取浮动提示剩余数量
export async function get_float_notice_per_day(request: GetFloatNoticePerDayRequest): Promise<GetFloatNoticePerDayResponse> {
  const cmd = 'plugin:project_member_api|get_float_notice_per_day';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetFloatNoticePerDayResponse>(cmd, {
    request,
  });
}