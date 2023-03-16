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

export type Okr = {
  objective: string;
  key_result_list: string[];
};

export type BasicGoalInfo = {
  from_time: number;
  to_time: number;
  okr_list: Okr[];
};

export type MemberInfo = {
  project_id: string;
  member_user_id: string;
  role_id: string;
  role_name: string;
  last_event_id: string;
  last_goal_id: string;
  last_goal_info: BasicGoalInfo;
  create_time: number;
  update_time: number;
  display_name: string;
  logo_uri: string;
  online: boolean;
  is_cur_user: boolean;
  is_project_owner: boolean;
  can_admin: boolean;
  reminder_channel_id: string;
};

export type GoalInfo = {
  goal_id: string;
  project_id: string;
  member_user_id: string;
  basic_info: BasicGoalInfo;
  create_time: number;
  update_time: number;
  member_display_name: string;
  member_logo_uri: string;
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

export type CreateGoalRequest = {
  session_id: string;
  project_id: string;
  basic_info: BasicGoalInfo;
};

export type CreateGoalResponse = {
  code: number;
  err_msg: string;
  goal_id: string;
};

export type UpdateGoalRequest = {
  session_id: string;
  project_id: string;
  goal_id: string;
  basic_info: BasicGoalInfo;
};

export type UpdateGoalResponse = {
  code: number;
  err_msg: string;
};

export type ListGoalRequest = {
  session_id: string;
  project_id: string;
  member_user_id: string;
  offset: number;
  limit: number;
};

export type ListGoalResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  goal_list: GoalInfo[];
}

export type RemoveGoalRequest = {
  session_id: string;
  project_id: string;
  goal_id: string;
};

export type RemoveGoalResponse = {
  code: number;
  err_msg: string;
}


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

//创建目标
export async function create_goal(request: CreateGoalRequest): Promise<CreateGoalResponse> {
  const cmd = 'plugin:project_member_api|create_goal';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CreateGoalResponse>(cmd, {
    request,
  });
}

//更新目标
export async function update_goal(request: UpdateGoalRequest): Promise<UpdateGoalResponse> {
  const cmd = 'plugin:project_member_api|update_goal';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<UpdateGoalResponse>(cmd, {
    request,
  });
}

//列出目标
export async function list_goal(request: ListGoalRequest): Promise<ListGoalResponse> {
  const cmd = 'plugin:project_member_api|list_goal';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListGoalResponse>(cmd, {
    request,
  });
}

//删除目标
export async function remove_goal(request: RemoveGoalRequest): Promise<RemoveGoalResponse> {
  const cmd = 'plugin:project_member_api|remove_goal';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveGoalResponse>(cmd, {
    request,
  });
}