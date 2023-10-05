import { invoke } from '@tauri-apps/api/tauri';

export type ISSUE_TYPE = number;

export const ISSUE_TYPE_TASK: ISSUE_TYPE = 0;
export const ISSUE_TYPE_BUG: ISSUE_TYPE = 1;

export type ISSUE_STATE = number;

export const ISSUE_STATE_PLAN: ISSUE_STATE = 0; //规划
export const ISSUE_STATE_PROCESS: ISSUE_STATE = 1; //处理
export const ISSUE_STATE_CHECK: ISSUE_STATE = 2; //验收
export const ISSUE_STATE_CLOSE: ISSUE_STATE = 3; //关闭

export const ISSUE_STATE_PROCESS_OR_CHECK: ISSUE_STATE = 99;//特殊状态

export type PROCESS_STAGE = number;
export const PROCESS_STAGE_TODO: PROCESS_STAGE = 0;
export const PROCESS_STAGE_DOING: PROCESS_STAGE = 1;
export const PROCESS_STAGE_DONE: PROCESS_STAGE = 2;


export type TASK_PRIORITY = number;

export const TASK_PRIORITY_LOW: TASK_PRIORITY = 0;
export const TASK_PRIORITY_MIDDLE: TASK_PRIORITY = 1;
export const TASK_PRIORITY_HIGH: TASK_PRIORITY = 2;

export type ASSGIN_USER_TYPE = number;

export const ASSGIN_USER_ALL: ASSGIN_USER_TYPE = 0; //执行者和检查者
export const ASSGIN_USER_EXEC: ASSGIN_USER_TYPE = 1; //执行者
export const ASSGIN_USER_CHECK: ASSGIN_USER_TYPE = 2; //检查者

export type BUG_LEVEL = number;
export const BUG_LEVEL_MINOR: BUG_LEVEL = 0; //提示
export const BUG_LEVEL_MAJOR: BUG_LEVEL = 1; //一般
export const BUG_LEVEL_CRITICAL: BUG_LEVEL = 2; //严重
export const BUG_LEVEL_BLOCKER: BUG_LEVEL = 3; //致命

export type BUG_PRIORITY = number;
export const BUG_PRIORITY_LOW: BUG_PRIORITY = 0; //低优先级
export const BUG_PRIORITY_NORMAL: BUG_PRIORITY = 1; //正常处理
export const BUG_PRIORITY_HIGH: BUG_PRIORITY = 2; //高度重视
export const BUG_PRIORITY_URGENT: BUG_PRIORITY = 3; //急需解决
export const BUG_PRIORITY_IMMEDIATE: BUG_PRIORITY = 4; //马上解决

export type SORT_TYPE = number;
export const SORT_TYPE_ASC: SORT_TYPE = 0; //升序
export const SORT_TYPE_DSC: SORT_TYPE = 1; //降序

export type SORT_KEY = number;
export const SORT_KEY_UPDATE_TIME: SORT_KEY = 0;
export const SORT_KEY_CREATE_TIME: SORT_KEY = 1;
export const SORT_KEY_STATE: SORT_KEY = 2;
export const SORT_KEY_SPRIT: SORT_KEY = 3; //只显示关联工作计划的
export const SORT_KEY_START_TIME: SORT_KEY = 4; //只显示有开始时间的
export const SORT_KEY_END_TIME: SORT_KEY = 5; //只显示有结束时间的
export const SORT_KEY_ESTIMATE_MINUTES: SORT_KEY = 6; //只显示有预估工时的
export const SORT_KEY_REMAIN_MINUTES: SORT_KEY = 7; //只显示有剩余工时的
//任务相关属性
export const SORT_KEY_TASK_PRIORITY: SORT_KEY = 20;
//缺陷相关属性
export const SORT_KEY_SOFTWARE_VERSION: SORT_KEY = 40;
export const SORT_KEY_BUG_PRIORITY: SORT_KEY = 41;
export const SORT_KEY_BUG_LEVEL: SORT_KEY = 42;

type BasicIssueInfo = {
  title: string;
  content: string;
  tag_id_list: string[];
};

export type ExtraTaskInfo = {
  priority: TASK_PRIORITY;
};

export type ExtraBugInfo = {
  software_version: string;
  level: BUG_LEVEL;
  priority: BUG_PRIORITY;
};

export type ExtraInfo = {
  ExtraTaskInfo?: ExtraTaskInfo;
  ExtraBugInfo?: ExtraBugInfo;
};

type CreateRequest = {
  session_id: string;
  project_id: string;
  issue_type: ISSUE_TYPE;
  basic_info: BasicIssueInfo;
  extra_info: ExtraInfo;
};

type CreateResponse = {
  code: number;
  err_msg: string;
  issue_id: string;
};

export type UpdateRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  basic_info: BasicIssueInfo;
  extra_info: ExtraInfo;
};

type UpdateResponse = {
  code: number;
  err_msg: string;
};

export type UpdateTitleRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  title: string;
};

export type UpdateContentRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  content: string;
};

export type UpdateExtraInfoRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  extra_info: ExtraInfo;
};

type AssignExecUserResponse = {
  code: number;
  err_msg: string;
};

type AssignCheckUserResponse = {
  code: number;
  err_msg: string;
};

export type ChangeStateRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  state: ISSUE_STATE;
};

type ChangeStateResponse = {
  code: number;
  err_msg: string;
};

export type ListParam = {
  filter_by_issue_type: boolean;
  issue_type: ISSUE_TYPE;
  filter_by_state: boolean;
  state_list: ISSUE_STATE[];
  filter_by_create_user_id: boolean;
  create_user_id_list: string[];
  filter_by_assgin_user_id: boolean;
  assgin_user_id_list: string[];
  assgin_user_type: ASSGIN_USER_TYPE;
  filter_by_sprit_id: boolean;
  sprit_id_list: string[];
  filter_by_create_time: boolean;
  from_create_time: number;
  to_create_time: number;
  filter_by_update_time: boolean;
  from_update_time: number;
  to_update_time: number;
  filter_by_title_keyword: boolean;
  title_keyword: string;
  filter_by_tag_id_list: boolean;
  tag_id_list: string[];
  filter_by_watch: boolean;
  watch: boolean;

  ///任务相关
  filter_by_task_priority: boolean;
  task_priority_list: TASK_PRIORITY[];
  ///缺陷相关
  filter_by_software_version: boolean;
  software_version_list: string[];
  filter_by_bug_priority: boolean;
  bug_priority_list: BUG_PRIORITY[];
  filter_by_bug_level: boolean;
  bug_level_list: BUG_LEVEL[];
};

export type ListRequest = {
  session_id: string;
  project_id: string;
  list_param: ListParam;
  sort_type: SORT_TYPE;
  sort_key: SORT_KEY;
  offset: number;
  limit: number;
};

type UserIssuePerm = {
  can_assign_exec_user: boolean;
  can_assign_check_user: boolean;
  next_state_list: ISSUE_STATE[];
  can_remove: boolean;
  can_opt_dependence: boolean;
  can_opt_sub_issue: boolean;
  can_update: boolean;
};

export type IssueTag = {
  tag_id: string;
  tag_name: string;
  bg_color: string;
};

export type WatchUser = {
  member_user_id: string;
  display_name: string;
  logo_uri: string;
};


export type IssueInfo = {
  issue_id: string;
  issue_type: ISSUE_TYPE;
  issue_index: number;
  basic_info: BasicIssueInfo;
  project_id: string;
  create_time: number;
  update_time: number;
  state: ISSUE_STATE;
  process_stage: PROCESS_STAGE;
  create_user_id: string;
  exec_user_id: string;
  check_user_id: string;
  sprit_id: string;
  sprit_name: string;
  create_display_name: string; //创建人名称
  exec_display_name: string; //执行人名称
  check_display_name: string; //检查人名称
  msg_count: number;
  depend_me_count: number;
  re_open_count: number;
  tag_info_list: IssueTag[];
  watch_user_list?: WatchUser[];

  ///计划相关字段
  has_start_time: boolean;
  start_time: number;
  has_end_time: boolean;
  end_time: number;
  has_dead_line_time: boolean;
  dead_line_time: number;
  has_estimate_minutes: boolean;
  estimate_minutes: number;
  has_remain_minutes: boolean;
  remain_minutes: number;
  ///登陆用户权限相关
  user_issue_perm: UserIssuePerm;
  extra_info: ExtraInfo;
  //项目需求相关
  requirement_id: string;
  requirement_title: string;

  my_watch: boolean;
};

export type GetResponse = {
  code: number;
  err_msg: string;
  info: IssueInfo;
};

export type RemoveResponse = {
  code: number;
  err_msg: string;
};

export type ListResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  info_list: IssueInfo[];
};

export type ListIdRequest = {
  session_id: string;
  project_id: string;
  list_param: ListParam;
  sort_type: SORT_TYPE;
  sort_key: SORT_KEY;
  max_count: number;
};

export type ListIdResponse = {
  code: number;
  err_msg: string;
  issue_id_list: string[];
};

export type ListByIdRequest = {
  session_id: string;
  project_id: string;
  issue_id_list: string[];
};

export type ListByIdResponse = {
  code: number;
  err_msg: string;
  info_list: IssueInfo[];
};

type ListAttrValueResponse = {
  code: number;
  err_msg: string;
  value_list: string[];
};

export type ListMyTodoRequest = {
  session_id: string;
  sort_type: SORT_TYPE;
  sort_key: SORT_KEY;
  offset: number;
  limit: number;
};

export type ListMyTodoResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  info_list: IssueInfo[];
};

type LinkSpritResponse = {
  code: number;
  err_msg: string;
};

type CancelLinkSpritResponse = {
  code: number;
  err_msg: string;
}

type SetStartTimeResponse = {
  code: number;
  err_msg: string;
};

type CancelStartTimeResponse = {
  code: number;
  err_msg: string;
};

type SetEndTimeResponse = {
  code: number;
  err_msg: string;
};

type CancelEndTimeResponse = {
  code: number;
  err_msg: string;
};

type SetEstimateMinutesResponse = {
  code: number;
  err_msg: string;
};

type CancelEstimateMinutesResponse = {
  code: number;
  err_msg: string;
};

type SetRemainMinutesRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  remain_minutes: number;
  has_spend_minutes: boolean;
  spend_minutes: number;
};

type SetRemainMinutesResponse = {
  code: number;
  err_msg: string;
};

type CancelRemainMinutesResponse = {
  code: number;
  err_msg: string;
};

export type MemberState = {
  project_id: string;
  member_user_id: string;
  task_create_count: number;
  task_un_exec_count: number;
  task_un_check_count: number;
  task_exec_done_count: number;
  task_check_done_count: number;
  bug_create_count: number;
  bug_un_exec_count: number;
  bug_un_check_count: number;
  bug_exec_done_count: number;
  bug_check_done_count: number;
};

export type GetMemberStateResponse = {
  code: number;
  err_msg: string;
  member_state: MemberState;
};

export type ListMemberStateResponse = {
  code: number;
  err_msg: string;
  member_state_list: MemberState[];
};

export type BasicComment = {
  comment_data: string;
  ref_comment_id: string;
};

export type Comment = {
  comment_id: string;
  project_id: string;
  basic_comment: BasicComment;
  sender_user_id: string;
  send_time: number;
  sender_logo_uri: string;
  sender_display_name: string;
  ///引用的消息
  ref_comment_data: string;
  ref_user_logo_uri: string;
  ref_user_display_name: string;
};

export type AddCommentRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  comment: BasicComment;
};

export type AddCommentResponse = {
  code: number;
  err_msg: string;
  comment_id: string;
};

export type ListCommentRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  offset: number;
  limit: number;
};

export type ListCommentResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  comment_list: Comment[];
};

export type RemoveCommentRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  comment_id: string;
};

export type RemoveCommentResponse = {
  code: number;
  err_msg: string;
};

export type BasicSubIssueInfo = {
  title: string;
};

export type SubIssueInfo = {
  sub_issue_id: string;
  project_id: string;
  issue_id: string;
  basic_info: BasicSubIssueInfo;
  create_user_id: string;
  create_display_name: string;
  create_time: number;
  update_time: number;
  done: boolean;
}

export type CreateSubIssueRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  basic_info: BasicSubIssueInfo;
};

export type CreateSubIssueResponse = {
  code: number;
  err_msg: string;
  sub_issue_id: string;
};


export type UpdateSubIssueRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  sub_issue_id: string;
  basic_info: BasicSubIssueInfo;
};

export type UpdateSubIssueResponse = {
  code: number;
  err_msg: string;
};

export type UpdateSubIssueStateRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  sub_issue_id: string;
  done: boolean;
};

export type UpdateSubIssueStateResponse = {
  code: number;
  err_msg: string;
};

export type ListSubIssueRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
};

export type ListSubIssueResponse = {
  code: number;
  err_msg: string;
  sub_issue_list: SubIssueInfo[];
}


export type RemoveSubIssueRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  sub_issue_id: string;
};

export type RemoveSubIssueResponse = {
  code: number;
  err_msg: string;
};


export type AddDependenceRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  depend_issue_id: string;
};

export type AddDependenceResponse = {
  code: number;
  err_msg: string;
};

export type RemoveDependenceRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  depend_issue_id: string;
};

export type RemoveDependenceResponse = {
  code: number;
  err_msg: string;
};

export type ListMyDependRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
};

export type ListMyDependResponse = {
  code: number;
  err_msg: string;
  issue_list: IssueInfo[];
};

export type ListDependMeRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
};

export type ListDependMeResponse = {
  code: number;
  err_msg: string;
  issue_list: IssueInfo[];
};

export type SetDeadLineTimeRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  dead_line_time: number;
};

export type SetDeadLineTimeResponse = {
  code: number;
  err_msg: string;
};

export type CancelDeadLineTimeRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
};

export type CancelDeadLineTimeResponse = {
  code: number;
  err_msg: string;
};

export type UpdateTagIdListRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  tag_id_list: string[];
}


export type WatchRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
};

export type WatchResponse = {
  code: number;
  err_msg: string;
};

export type UnwatchRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
};

export type UnwatchResponse = {
  code: number;
  err_msg: string;
}

export type UpdateProcessStageRequest = {
  session_id: string;
  project_id: string;
  issue_id: string;
  process_stage: PROCESS_STAGE;
};
export type UpdateProcessStageResponse = {
  code: number;
  err_msg: string;
}


//创建工单，根据类型区分是任务还是缺陷
export async function create(request: CreateRequest): Promise<CreateResponse> {
  const cmd = 'plugin:project_issue_api|create';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CreateResponse>(cmd, {
    request,
  });
}

//获取单个工单
export async function get(
  session_id: string,
  project_id: string,
  issue_id: string,
): Promise<GetResponse> {
  const cmd = 'plugin:project_issue_api|get';
  const request = {
    session_id,
    project_id,
    issue_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetResponse>(cmd, {
    request,
  });
}

//删除单个工单
export async function remove(
  session_id: string,
  project_id: string,
  issue_id: string,
): Promise<RemoveResponse> {
  const cmd = 'plugin:project_issue_api|remove';
  const request = {
    session_id,
    project_id,
    issue_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveResponse>(cmd, {
    request,
  });
}

//更新工单
export async function update(request: UpdateRequest): Promise<UpdateResponse> {
  const cmd = 'plugin:project_issue_api|update';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateResponse>(cmd, {
    request,
  });
}

//更新标签
export async function update_tag_id_list(request: UpdateTagIdListRequest): Promise<UpdateResponse> {
  const cmd = 'plugin:project_issue_api|update_tag_id_list';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateResponse>(cmd, {
    request,
  });
}

//更新工单标题
export async function update_title(request: UpdateTitleRequest): Promise<UpdateResponse> {
  const cmd = 'plugin:project_issue_api|update_title';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateResponse>(cmd, {
    request,
  });
}

//更新工单内容
export async function update_content(request: UpdateContentRequest): Promise<UpdateResponse> {
  const cmd = 'plugin:project_issue_api|update_content';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateResponse>(cmd, {
    request,
  });
}

//更新工单额外信息
export async function update_extra_info(request: UpdateExtraInfoRequest): Promise<UpdateResponse> {
  const cmd = 'plugin:project_issue_api|update_extra_info';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateResponse>(cmd, {
    request,
  });
}


//指派执行人
export async function assign_exec_user(
  session_id: string,
  project_id: string,
  issue_id: string,
  exec_user_id: string,
): Promise<AssignExecUserResponse> {
  const cmd = 'plugin:project_issue_api|assign_exec_user';
  const request = {
    session_id,
    project_id,
    issue_id,
    exec_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<AssignExecUserResponse>(cmd, {
    request,
  });
}

//指派检查人
export async function assign_check_user(
  session_id: string,
  project_id: string,
  issue_id: string,
  check_user_id: string,
): Promise<AssignCheckUserResponse> {
  const cmd = 'plugin:project_issue_api|assign_check_user';
  const request = {
    session_id,
    project_id,
    issue_id,
    check_user_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<AssignCheckUserResponse>(cmd, {
    request,
  });
}

//更新工单状态
export async function change_state(request: ChangeStateRequest): Promise<ChangeStateResponse> {
  const cmd = 'plugin:project_issue_api|change_state';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ChangeStateResponse>(cmd, {
    request,
  });
}

//更新执行阶段
export async function update_process_stage(request: UpdateProcessStageRequest): Promise<UpdateProcessStageResponse> {
  const cmd = 'plugin:project_issue_api|update_process_stage';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<UpdateProcessStageResponse>(cmd, {
    request,
  });
}

//按条件列出工单
export async function list(request: ListRequest): Promise<ListResponse> {
  const cmd = 'plugin:project_issue_api|list';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListResponse>(cmd, {
    request,
  });
}

//只列出工单ID
export async function list_id(request: ListIdRequest): Promise<ListIdResponse> {
  const cmd = 'plugin:project_issue_api|list_id';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListIdResponse>(cmd, {
    request,
  });
}

//按Id列出工单
export async function list_by_id(request: ListByIdRequest): Promise<ListByIdResponse> {
  const cmd = 'plugin:project_issue_api|list_by_id';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListByIdResponse>(cmd, {
    request,
  });
}

//列出需要我处理的工单
export async function list_my_todo(request: ListMyTodoRequest): Promise<ListMyTodoResponse> {
  const cmd = 'plugin:project_issue_api|list_my_todo';
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListResponse>(cmd, {
    request,
  });
}

//列出某个属性的所有值
export async function list_attr_value(
  session_id: string,
  project_id: string,
  attr_key: string,
): Promise<ListAttrValueResponse> {
  const cmd = 'plugin:project_issue_api|list_attr_value';
  const request = {
    session_id,
    project_id,
    attr_key,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListAttrValueResponse>(cmd, {
    request,
  });
}

//关联工单到某个工作计划
export async function link_sprit(
  session_id: string,
  project_id: string,
  issue_id: string,
  sprit_id: string,
): Promise<LinkSpritResponse> {
  const cmd = 'plugin:project_issue_api|link_sprit';
  const request = {
    session_id,
    project_id,
    issue_id,
    sprit_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<LinkSpritResponse>(cmd, {
    request,
  });
}

//取消关联工单到某个工作计划
export async function cancel_link_sprit(
  session_id: string,
  project_id: string,
  issue_id: string,
): Promise<CancelLinkSpritResponse> {
  const cmd = 'plugin:project_issue_api|cancel_link_sprit';
  const request = {
    session_id,
    project_id,
    issue_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CancelLinkSpritResponse>(cmd, {
    request,
  });
}


//设置开始时间
export async function set_start_time(
  session_id: string,
  project_id: string,
  issue_id: string,
  start_time: number,
): Promise<SetStartTimeResponse> {
  const cmd = 'plugin:project_issue_api|set_start_time';
  const request = {
    session_id,
    project_id,
    issue_id,
    start_time,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<SetStartTimeResponse>(cmd, {
    request,
  });
}

//取消开始时间
export async function cancel_start_time(
  session_id: string,
  project_id: string,
  issue_id: string,
): Promise<CancelStartTimeResponse> {
  const cmd = 'plugin:project_issue_api|cancel_start_time';
  const request = {
    session_id,
    project_id,
    issue_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CancelStartTimeResponse>(cmd, {
    request,
  });
}

//设置结束时间
export async function set_end_time(
  session_id: string,
  project_id: string,
  issue_id: string,
  end_time: number,
): Promise<SetEndTimeResponse> {
  const cmd = 'plugin:project_issue_api|set_end_time';
  const request = {
    session_id,
    project_id,
    issue_id,
    end_time,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<SetEndTimeResponse>(cmd, {
    request,
  });
}

//取消结束时间
export async function cancel_end_time(
  session_id: string,
  project_id: string,
  issue_id: string,
): Promise<CancelEndTimeResponse> {
  const cmd = 'plugin:project_issue_api|cancel_end_time';
  const request = {
    session_id,
    project_id,
    issue_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CancelEndTimeResponse>(cmd, {
    request,
  });
}

//设置预估时间
export async function set_estimate_minutes(
  session_id: string,
  project_id: string,
  issue_id: string,
  estimate_minutes: number,
): Promise<SetEstimateMinutesResponse> {
  const cmd = 'plugin:project_issue_api|set_estimate_minutes';
  const request = {
    session_id,
    project_id,
    issue_id,
    estimate_minutes,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<SetEstimateMinutesResponse>(cmd, {
    request,
  });
}

//取消预估时间
export async function cancel_estimate_minutes(
  session_id: string,
  project_id: string,
  issue_id: string,
): Promise<CancelEstimateMinutesResponse> {
  const cmd = 'plugin:project_issue_api|cancel_estimate_minutes';
  const request = {
    session_id,
    project_id,
    issue_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CancelEstimateMinutesResponse>(cmd, {
    request,
  });
}

//设置剩余时间
export async function set_remain_minutes(
  request: SetRemainMinutesRequest,
): Promise<SetRemainMinutesResponse> {
  const cmd = 'plugin:project_issue_api|set_remain_minutes';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<SetRemainMinutesResponse>(cmd, {
    request: request,
  });
}

//取消剩余时间
export async function cancel_remain_minutes(
  session_id: string,
  project_id: string,
  issue_id: string,
): Promise<CancelRemainMinutesResponse> {
  const cmd = 'plugin:project_issue_api|cancel_remain_minutes';
  const request = {
    session_id,
    project_id,
    issue_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CancelRemainMinutesResponse>(cmd, {
    request: request,
  });
}

//获取单个用户工单统计信息
export async function get_member_state(
  session_id: string,
  project_id: string,
): Promise<GetMemberStateResponse> {
  const request = {
    session_id,
    project_id,
  };
  const cmd = 'plugin:project_issue_api|get_member_state';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GetMemberStateResponse>(cmd, {
    request,
  });
}

//列出所有用户工单统计信息
export async function list_member_state(
  session_id: string,
  project_id: string,
  filter_by_member_user_id: boolean,
  member_user_id_list: string[],
): Promise<ListMemberStateResponse> {
  const request = {
    session_id,
    project_id,
    filter_by_member_user_id,
    member_user_id_list,
  };
  const cmd = 'plugin:project_issue_api|list_member_state';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListMemberStateResponse>(cmd, {
    request,
  });
}

//增加评论
export async function add_comment(request: AddCommentRequest): Promise<AddCommentResponse> {
  const cmd = 'plugin:project_issue_api|add_comment';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<AddCommentResponse>(cmd, {
    request,
  });
}

//列出评论
export async function list_comment(request: ListCommentRequest): Promise<ListCommentResponse> {
  const cmd = 'plugin:project_issue_api|list_comment';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListCommentResponse>(cmd, {
    request,
  });
}

//删除评论
export async function remove_comment(request: RemoveCommentRequest): Promise<RemoveCommentResponse> {
  const cmd = 'plugin:project_issue_api|remove_comment';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<RemoveCommentResponse>(cmd, {
    request,
  });
}

//增加子工单
export async function create_sub_issue(request: CreateSubIssueRequest): Promise<CreateSubIssueResponse> {
  const cmd = 'plugin:project_issue_api|create_sub_issue';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CreateSubIssueResponse>(cmd, {
    request,
  });
}

//更新子工单
export async function update_sub_issue(request: UpdateSubIssueRequest): Promise<UpdateSubIssueResponse> {
  const cmd = 'plugin:project_issue_api|update_sub_issue';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateSubIssueResponse>(cmd, {
    request,
  });
}

//更新子工单状态
export async function update_sub_issue_state(request: UpdateSubIssueStateRequest): Promise<UpdateSubIssueStateResponse> {
  const cmd = 'plugin:project_issue_api|update_sub_issue_state';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateSubIssueStateResponse>(cmd, {
    request,
  });
}

//列出子工单
export async function list_sub_issue(request: ListSubIssueRequest): Promise<ListSubIssueResponse> {
  const cmd = 'plugin:project_issue_api|list_sub_issue';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListSubIssueResponse>(cmd, {
    request,
  });
}

//删除子工单
export async function remove_sub_issue(request: RemoveSubIssueRequest): Promise<RemoveSubIssueResponse> {
  const cmd = 'plugin:project_issue_api|remove_sub_issue';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<RemoveSubIssueResponse>(cmd, {
    request,
  });
}

//增加依赖
export async function add_dependence(request: AddDependenceRequest): Promise<AddDependenceResponse> {
  const cmd = 'plugin:project_issue_api|add_dependence';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<AddDependenceResponse>(cmd, {
    request,
  });
}

//删除依赖
export async function remove_dependence(request: RemoveDependenceRequest): Promise<RemoveDependenceResponse> {
  const cmd = 'plugin:project_issue_api|remove_dependence';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<RemoveDependenceResponse>(cmd, {
    request,
  });
}

//列出我的依赖
export async function list_my_depend(request: ListMyDependRequest): Promise<ListMyDependResponse> {
  const cmd = 'plugin:project_issue_api|list_my_depend';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListMyDependResponse>(cmd, {
    request,
  });
}

//列出依赖我的
export async function list_depend_me(request: ListDependMeRequest): Promise<ListDependMeResponse> {
  const cmd = 'plugin:project_issue_api|list_depend_me';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListDependMeResponse>(cmd, {
    request,
  });
}

//设置截至时间
export async function set_dead_line_time(request: SetDeadLineTimeRequest): Promise<SetDeadLineTimeResponse> {
  const cmd = 'plugin:project_issue_api|set_dead_line_time';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<SetDeadLineTimeResponse>(cmd, {
    request,
  });
}

//取消截至时间
export async function cancel_dead_line_time(request: CancelDeadLineTimeRequest): Promise<CancelDeadLineTimeResponse> {
  const cmd = 'plugin:project_issue_api|cancel_dead_line_time';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CancelDeadLineTimeResponse>(cmd, {
    request,
  });
}

//关注工单
export async function watch(request: WatchRequest): Promise<WatchResponse> {
  const cmd = 'plugin:project_issue_api|watch';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<WatchResponse>(cmd, {
    request,
  });
}

//取消关注工单
export async function unwatch(request: UnwatchRequest): Promise<UnwatchResponse> {
  const cmd = 'plugin:project_issue_api|unwatch';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UnwatchResponse>(cmd, {
    request,
  });
}