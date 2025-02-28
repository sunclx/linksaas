import { invoke } from '@tauri-apps/api/tauri';

export type SUMMARY_STATE = number;
export const SUMMARY_COLLECT: SUMMARY_STATE = 0;  //收集反馈
export const SUMMARY_SHOW: SUMMARY_STATE = 1;     //展示反馈


export type CreateResponse = {
  code: number;
  err_msg: string;
  sprit_id: string;
};

export type SpritInfo = {
  sprit_id: string;
  project_id: string;
  task_count: number;
  bug_count: number;
  summary_state: SUMMARY_STATE;
};

export type BurnDownInfo = {
  sprit_id: string;
  day: number;
  member_user_id: string;
  remain_minutes: number;
};

export type SummaryTag = {
  tag_id: string;
  tag_name: string;
  bg_color: string;
};


export type SummaryItemInfo = {
  summary_item_id: string;
  content: string;
  create_user_id: string;
  create_display_name: string;
  create_logo_uri: string;
  create_time: number;
  group_id: string;
  tag_info: SummaryTag;
};

export type GetResponse = {
  code: number;
  err_msg: string;
  info: SpritInfo;
};

export type RemoveResponse = {
  code: number;
  err_msg: string;
};


export type UpdateBurnDownRequest = {
  session_id: string;
  project_id: string;
  sprit_id: string;
  day: number;
  member_user_id: string;
  remain_minutes: number;
};

export type UpdateBurnDownResponse = {
  code: number;
  err_msg: string;
};

export type ListBurnDownRequest = {
  session_id: string;
  project_id: string;
  sprit_id: string;
};

export type ListBurnDownResponse = {
  code: number;
  err_msg: string;
  info_list: BurnDownInfo[];
};

export type SetSummaryStateRequest = {
  session_id: string;
  project_id: string;
  sprit_id: string;
  summary_state: SUMMARY_STATE;
};
export type SetSummaryStateResponse = {
  code: number;
  err_msg: string;
};

export type AddSummaryItemRequest = {
  session_id: string;
  project_id: string;
  sprit_id: string;
  tag_id: string;
  content: string;
}

export type AddSummaryItemResponse = {
  code: number;
  err_msg: string;
  summary_item_id: string;
};

export type UpdateSummaryItemRequest = {
  session_id: string;
  project_id: string;
  summary_item_id: string;
  sprit_id: string;
  tag_id: string;
  content: string;
};

export type UpdateSummaryItemResponse = {
  code: number;
  err_msg: string;
};

export type ListSummaryItemRequest = {
  session_id: string;
  project_id: string;
  sprit_id: string;
  filter_by_tag_id: boolean;
  tag_id: string;
};

export type ListSummaryItemResponse = {
  code: number;
  err_msg: string;
  item_list: SummaryItemInfo[];
};

export type RemoveSummaryItemRequest = {
  session_id: string;
  project_id: string;
  summary_item_id: string;
  sprit_id: string;
};

export type RemoveSummaryItemResponse = {
  code: number;
  err_msg: string;
};

export type GroupSummaryItemRequest = {
  session_id: string;
  project_id: string;
  sprit_id: string;
  summary_item_id_list: string[];
};

export type GroupSummaryItemResponse = {
  code: number;
  err_msg: string;
};

//创建工作计划
export async function create(
  session_id: string,
  project_id: string,
): Promise<CreateResponse> {
  const cmd = 'plugin:project_sprit_api|create';
  const request = {
    session_id,
    project_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CreateResponse>(cmd, {
    request,
  });
}

//获取单个工作计划信息
export async function get(
  session_id: string,
  project_id: string,
  sprit_id: string,
): Promise<GetResponse> {
  const cmd = 'plugin:project_sprit_api|get';
  const request = {
    session_id,
    project_id,
    sprit_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetResponse>(cmd, {
    request,
  });
}

//删除工作计划信息
export async function remove(
  session_id: string,
  project_id: string,
  sprit_id: string,
): Promise<RemoveResponse> {
  const cmd = 'plugin:project_sprit_api|remove';
  const request = {
    session_id,
    project_id,
    sprit_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<RemoveResponse>(cmd, {
    request,
  });
}

//更新燃尽图信息
export async function update_burn_down(request: UpdateBurnDownRequest): Promise<UpdateBurnDownResponse> {
  const cmd = 'plugin:project_sprit_api|update_burn_down';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateBurnDownResponse>(cmd, {
    request,
  });
}

//列出燃尽图信息
export async function list_burn_down(request: ListBurnDownRequest): Promise<ListBurnDownResponse> {
  const cmd = 'plugin:project_sprit_api|list_burn_down';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListBurnDownResponse>(cmd, {
    request,
  });
}

//设置总结状态
export async function set_summary_state(request: SetSummaryStateRequest): Promise<SetSummaryStateResponse> {
  const cmd = 'plugin:project_sprit_api|set_summary_state';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<SetSummaryStateResponse>(cmd, {
    request,
  });
}

//新增总结
export async function add_summary_item(request: AddSummaryItemRequest): Promise<AddSummaryItemResponse> {
  const cmd = 'plugin:project_sprit_api|add_summary_item';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<AddSummaryItemResponse>(cmd, {
    request,
  });
}

//更新总结
export async function update_summary_item(request: UpdateSummaryItemRequest): Promise<UpdateSummaryItemResponse> {
  const cmd = 'plugin:project_sprit_api|update_summary_item';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateSummaryItemResponse>(cmd, {
    request,
  });
}

//列出总结
export async function list_summary_item(request: ListSummaryItemRequest): Promise<ListSummaryItemResponse> {
  const cmd = 'plugin:project_sprit_api|list_summary_item';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ListSummaryItemResponse>(cmd, {
    request,
  });
}

//删除总结
export async function remove_summary_item(request: RemoveSummaryItemRequest): Promise<RemoveSummaryItemResponse> {
  const cmd = 'plugin:project_sprit_api|remove_summary_item';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<RemoveSummaryItemResponse>(cmd, {
    request,
  });
}

//对总结分组
export async function group_summary_item(request: GroupSummaryItemRequest): Promise<GroupSummaryItemResponse> {
  const cmd = 'plugin:project_sprit_api|group_summary_item';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<GroupSummaryItemResponse>(cmd, {
    request,
  });
}