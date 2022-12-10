import { invoke } from '@tauri-apps/api/tauri';

export type LIST_MSG_TYPE = number;

export const LIST_MSG_TYPE_AFTER: LIST_MSG_TYPE = 0;
export const LIST_MSG_TYPE_BEFORE: LIST_MSG_TYPE = 1;

export type LIST_CHAN_SCOPE = number;
export const LIST_CHAN_SCOPE_INCLUDE_ME: LIST_CHAN_SCOPE = 0; //我加入的频道
export const LIST_CHAN_SCOPE_WITHOUT_ME: LIST_CHAN_SCOPE = 1; //我未加入频道
export const LIST_CHAN_SCOPE_ORPHAN: LIST_CHAN_SCOPE = 2; //无人频道


export type MSG_LINK_TYPE = number;
export const MSG_LINK_NONE: MSG_LINK_TYPE = 0;
export const MSG_LINK_TASK: MSG_LINK_TYPE = 1;
export const MSG_LINK_BUG: MSG_LINK_TYPE = 2;
export const MSG_LINK_CHANNEL: MSG_LINK_TYPE = 3;
// export const MSG_LINK_DOC: MSG_LINK_TYPE = 4;//移除
export const MSG_LINK_EXPERT_QA: MSG_LINK_TYPE = 5;
export const MSG_LINK_ROBOT_METRIC: MSG_LINK_TYPE = 6;

export type SENDER_TYPE = number;
export const SENDER_TYPE_MEMBER: SENDER_TYPE = 0;
export const SENDER_TYPE_ROBOT: SENDER_TYPE = 1;




export type BasicChannelInfo = {
  channel_name: string;
  pub_channel: boolean;
};

export type CreateRequest = {
  session_id: string;
  project_id: string;
  basic_info: BasicChannelInfo;
  member_user_id_list: string[];

};

export type CreateResponse = {
  code: number;
  err_msg: string;
  channel_id: string;
};

export type UpdateResponse = {
  code: number;
  err_msg: string;
};

export type OpenResponse = {
  code: number;
  err_msg: string;
};

export type CloseResponse = {
  code: number;
  err_msg: string;
};

type UserChannelPerm = {
  can_open: boolean;
  can_close: boolean;
  can_update: boolean;
  can_add_member: boolean;
  can_remove_member: boolean;
  can_leave: boolean;
  can_set_top: boolean;
  can_remove: boolean;
};

export type ChannelInfo = {
  channel_id: string;
  basic_info: BasicChannelInfo;
  project_id: string;
  create_time: number;
  update_time: number;
  top_weight: number;
  closed: boolean;
  owner_user_id: string;
  system_channel: boolean;
  last_event_id_list: string[];
  user_channel_perm: UserChannelPerm;
  readonly: boolean;
};

export type ListRequest = {
  session_id: string;
  project_id: string;
  filter_by_closed: boolean;
  closed: boolean;
};

export type ListResponse = {
  code: number;
  err_msg: string;
  info_list: ChannelInfo[];
};

export type AddMemberResponse = {
  code: number;
  err_msg: string;
};

export type RemoveMemberResponse = {
  code: number;
  err_msg: string;
};

export type ChannelMemberInfo = {
  channel_id: string;
  member_user_id: string;
  join_time: number;
  //是否是频道创建者
  channel_creater: boolean;
};

export type MsgReminderInfo = {
  reminder_all: boolean;
  extra_reminder_list: string[];
};

export type BasicMsg = {
  msg_data: string;
  ref_msg_id: string;
  remind_info: MsgReminderInfo;
  link_type: MSG_LINK_TYPE;
  link_dest_id: string;
};

export type SendMsgResponse = {
  code: number;
  err_msg: string;
  msg_id: string;
};

export type UpdateMsgResponse = {
  code: number;
  err_msg: string;
};

export type ListMsgRequest = {
  session_id: string;
  project_id: string;
  channel_id: string;
  refer_msg_id: string;
  list_msg_type: LIST_MSG_TYPE;
  limit: number;
  include_ref_msg: boolean;
};

export type Msg = {
  msg_id: string;
  project_id: string;
  channel_id: string;
  basic_msg: BasicMsg;
  sender_user_id: string;
  send_time: number;
  has_update_time: boolean;
  update_time: number;
  sender_type: SENDER_TYPE; 
  sender_logo_uri: string;
  sender_display_name: string;
  link_dest_title: string;
  ///引用的消息
  ref_msg_data: string;
  ref_user_logo_uri: string;
  ref_user_display_name: string;
};

export type GetMsgResponse = {
  code: number;
  err_msg: string;
  msg: Msg;
};

export type ListMsgResponse = {
  code: number;
  err_msg: string;
  msg_list: Msg[];
  last_msg_id: string;
};

export type ClearUnReadCountResponse = {
  code: number;
  err_msg: string;
};

export type ReadMsgStat = {
  channel_id: string;
  unread_msg_count: number;
};

export type ListReadMsgStatResponse = {
  code: number;
  err_msg: string;
  stat_list: ReadMsgStat[];
};

export type GetReadMsgStatResponse = {
  code: number;
  err_msg: string;
  stat?: ReadMsgStat;
};

export type ListChannelMemberResponse = {
  code: number;
  err_msg: string;
  info_list: ChannelMemberInfo[];
};


export type SetTopResponse = {
  code: number;
  err_msg: string;
};

export type UnsetTopResponse = {
  code: number;
  err_msg: string;
};

export type ListByAdminRequest = {
  session_id: string;
  project_id: string;
  filter_by_closed: boolean;
  closed: boolean;
  filter_by_scope: boolean;
  scope_list: LIST_CHAN_SCOPE[];
};

export type ListByAdminResponse = {
  code: number;
  err_msg: string;
  info_list: ChannelInfo[];
};

export type JoinByAdminResponse = {
  code: number;
  err_msg: string;
};

export type GetResponse = {
  code: number;
  err_msg: string;
  info: ChannelInfo;
};

export type RemoveByAdminResponse = {
  code: number;
  err_msg: string;
};


//创建频道
export async function create(request: CreateRequest): Promise<CreateResponse> {
  return invoke<CreateResponse>('plugin:project_channel_api|create', {
    request: request,
  });
}

export type LeaveResponse = {
  code: number;
  err_msg: string;
};

//更新频道
export async function update(
  session_id: string,
  project_id: string,
  channel_id: string,
  basic_info: BasicChannelInfo,
): Promise<UpdateResponse> {
  const cmd = 'plugin:project_channel_api|update';
  const request = {
    session_id,
    project_id,
    channel_id,
    basic_info,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateResponse>(cmd, {
    request,
  });
}

//重新打开频道，只有关闭状态下的频道才能被重新打开
export async function open(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<OpenResponse> {
  const cmd = 'plugin:project_channel_api|open';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<OpenResponse>(cmd, {
    request,
  });
}

//关闭频道，频道关闭后，不能进行消息发送
export async function close(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<CloseResponse> {
  const cmd = 'plugin:project_channel_api|close';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CloseResponse>(cmd, {
    request,
  });
}

//列出项目内的频道
export async function list(request: ListRequest): Promise<ListResponse> {
  const cmd = 'plugin:project_channel_api|list';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListResponse>(cmd, {
    request,
  });
}

//获取单个频道信息
export async function get_channel(session_id: string,
  project_id: string,
  channel_id: string,): Promise<GetResponse> {
  const cmd = 'plugin:project_channel_api|get';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GetResponse>(cmd, {
    request,
  });
}

//清楚未读消息
export async function clear_un_read_count(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<ClearUnReadCountResponse> {
  const cmd = 'plugin:project_channel_api|clear_un_read_count';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ClearUnReadCountResponse>(cmd, {
    request,
  });
}

//增加频道成员，只有私有频道可以调用
export async function add_member(
  session_id: string,
  project_id: string,
  channel_id: string,
  member_user_id: string,
): Promise<AddMemberResponse> {
  const cmd = 'plugin:project_channel_api|add_member';
  const request = {
    session_id,
    project_id,
    channel_id,
    member_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<AddMemberResponse>(cmd, {
    request,
  });
}

//移除频道成员，只有私有频道可以调用
export async function remove_member(
  session_id: string,
  project_id: string,
  channel_id: string,
  member_user_id: string,
): Promise<RemoveMemberResponse> {
  const cmd = 'plugin:project_channel_api|remove_member';
  const request = {
    session_id,
    project_id,
    channel_id,
    member_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<RemoveMemberResponse>(cmd, {
    request,
  });
}

//列出频道成员
export async function list_channel_member(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<ListChannelMemberResponse> {
  const cmd = 'plugin:project_channel_api|list_member';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListChannelMemberResponse>('plugin:project_channel_api|list_member', {
    request,
  });
}

//发送消息
export async function send_msg(
  session_id: string,
  project_id: string,
  channel_id: string,
  msg: BasicMsg,
): Promise<SendMsgResponse> {
  const cmd = 'plugin:project_channel_api|send_msg';
  const request = {
    session_id,
    project_id,
    channel_id,
    msg,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<SendMsgResponse>(cmd, {
    request,
  });
}

//更新消息
export async function update_msg(
  session_id: string,
  project_id: string,
  channel_id: string,
  msg_id: string,
  msg: BasicMsg,
): Promise<UpdateMsgResponse> {
  const cmd = 'plugin:project_channel_api|update_msg';
  const request = {
    session_id,
    project_id,
    channel_id,
    msg_id,
    msg,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateMsgResponse>(cmd, {
    request,
  });
}

//获取单挑消息内容
export async function get_msg(
  session_id: string,
  project_id: string,
  channel_id: string,
  msg_id: string,
): Promise<GetMsgResponse> {
  const cmd = 'plugin:project_channel_api|get_msg';
  const request = {
    session_id,
    project_id,
    channel_id,
    msg_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GetMsgResponse>(cmd, {
    request,
  });
}

//列出频道内的消息
export async function list_msg(request: ListMsgRequest): Promise<ListMsgResponse> {
  const cmd = 'plugin:project_channel_api|list_msg';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListMsgResponse>(cmd, {
    request,
  });
}

//列出项目内所有频道信息读取状态
export async function list_read_msg_stat(
  session_id: string,
  project_id: string,
): Promise<ListReadMsgStatResponse> {
  const cmd = 'plugin:project_channel_api|list_read_msg_stat';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListReadMsgStatResponse>(cmd, {
    request,
  });
}

//获取单个频道信息读取状态
export async function get_read_msg_stat(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<GetReadMsgStatResponse> {
  const cmd = 'plugin:project_channel_api|get_read_msg_stat';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GetReadMsgStatResponse>(cmd, {
    request,
  });
}

//离开频道
export async function leave(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<LeaveResponse> {
  const cmd = 'plugin:project_channel_api|leave';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  return invoke<LeaveResponse>(cmd, {
    request,
  });
}

//频道置顶
export async function set_top(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<SetTopResponse> {
  const cmd = 'plugin:project_channel_api|set_top';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  return invoke<SetTopResponse>(cmd, {
    request,
  });
}
//频道取消置顶
export async function unset_top(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<UnsetTopResponse> {
  const cmd = 'plugin:project_channel_api|unset_top';
  const request = {
    session_id,
    project_id,
    channel_id,
  };
  return invoke<UnsetTopResponse>(cmd, {
    request,
  });
}

//列出频道(管理模式)
export async function list_by_admin(request: ListByAdminRequest): Promise<ListByAdminResponse> {
  return invoke<ListByAdminResponse>('plugin:project_channel_api|list_by_admin', {
    request: request,
  });
}

//加入频道(管理模式)
export async function join_by_admin(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<JoinByAdminResponse> {
  return invoke<JoinByAdminResponse>('plugin:project_channel_api|join_by_admin', {
    request: {
      session_id: session_id,
      project_id: project_id,
      channel_id: channel_id,
    },
  });
}

//删除频道(管理模式)
export async function remove_by_admin(
  session_id: string,
  project_id: string,
  channel_id: string,
): Promise<RemoveByAdminResponse> {
  return invoke<RemoveByAdminResponse>('plugin:project_channel_api|remove_by_admin', {
    request: {
      session_id: session_id,
      project_id: project_id,
      channel_id: channel_id,
    },
  });
}
