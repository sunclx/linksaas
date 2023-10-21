import { invoke } from '@tauri-apps/api/tauri';

export type SUMMARY_STATE = number;
export const SUMMARY_COLLECT: SUMMARY_STATE = 0;  //收集反馈
export const SUMMARY_SHOW: SUMMARY_STATE = 1;     //展示反馈

export type ISSUE_LIST_TYPE = number;
export const ISSUE_LIST_ALL: ISSUE_LIST_TYPE = 0;
export const ISSUE_LIST_LIST: ISSUE_LIST_TYPE = 1;
export const ISSUE_LIST_KANBAN: ISSUE_LIST_TYPE = 2;

export type BasicSpritInfo = {
  title: string;
  start_time: number;
  end_time: number;
  non_work_day_list: number[];
  issue_list_type: ISSUE_LIST_TYPE;
  hide_doc_panel: boolean;
  hide_gantt_panel: boolean;
  hide_burndown_panel: boolean;
  hide_stat_panel: boolean;
  hide_summary_panel: boolean;
  // hide_channel: boolean;
};

export type CreateResponse = {
  code: number;
  err_msg: string;
  sprit_id: string;
};

export type UpdateResponse = {
  code: number;
  err_msg: string;
};

export type SpritInfo = {
  sprit_id: string;
  basic_info: BasicSpritInfo;
  project_id: string;
  create_time: number;
  update_time: number;
  task_count: number;
  bug_count: number;
  create_user_id: string;
  create_display_name: string;
  create_logo_uri: string;
  update_user_id: string;
  update_display_name: string;
  update_logo_uri: string;
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

export type ListResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  info_list: SpritInfo[];
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

export type LinkDocResponse = {
  code: number;
  err_msg: string;
};

export type CancelLinkDocResponse = {
  code: number;
  err_msg: string;
};

//对应grpc生成代码的LinkDocInfo，为了和linuxAuxStore里面定义的类型区分开发
export type SpritDocInfo = {
  doc_id: string;
  project_id: string;
  title: string;
  link_user_id: string;
  link_display_name: string;
  link_logo_uri: string;
  link_time: number;
};

export type ListLinkDocResponse = {
  code: number;
  err_msg: string;
  info_list: SpritDocInfo[]
};

export type GetLinkDocResponse = {
  code: number;
  err_msg: string;
  info: SpritDocInfo;
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
  basic_info: BasicSpritInfo,
): Promise<CreateResponse> {
  const cmd = 'plugin:project_sprit_api|create';
  const request = {
    session_id,
    project_id,
    basic_info,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<CreateResponse>(cmd, {
    request,
  });
}

//更新工作计划信息
export async function update(
  session_id: string,
  project_id: string,
  sprit_id: string,
  basic_info: BasicSpritInfo,
): Promise<UpdateResponse> {
  const cmd = 'plugin:project_sprit_api|update';
  const request = {
    session_id,
    project_id,
    sprit_id,
    basic_info,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<UpdateResponse>(cmd, {
    request,
  });
}

//列出工作计划信息
export async function list(
  session_id: string,
  project_id: string,
  offset: number,
  limit: number,
): Promise<ListResponse> {
  const cmd = 'plugin:project_sprit_api|list';
  const request = {
    session_id,
    project_id,
    offset,
    limit,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListResponse>(cmd, {
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

//关联文档
export async function link_doc(
  session_id: string,
  project_id: string,
  sprit_id: string,
  doc_id: string,
): Promise<LinkDocResponse> {
  const cmd = 'plugin:project_sprit_api|link_doc';
  const request = {
    session_id,
    project_id,
    sprit_id,
    doc_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<LinkDocResponse>(cmd, {
    request,
  });
}

//取消关联文档
export async function cancel_link_doc(
  session_id: string,
  project_id: string,
  sprit_id: string,
  doc_id: string,
): Promise<CancelLinkDocResponse> {
  const cmd = 'plugin:project_sprit_api|cancel_link_doc';
  const request = {
    session_id,
    project_id,
    sprit_id,
    doc_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CancelLinkDocResponse>(cmd, {
    request,
  });
}

//列出相关文档
export async function list_link_doc(
  session_id: string,
  project_id: string,
  sprit_id: string,
): Promise<ListLinkDocResponse> {
  const cmd = 'plugin:project_sprit_api|list_link_doc';
  const request = {
    session_id,
    project_id,
    sprit_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<ListLinkDocResponse>(cmd, {
    request,
  });
}

//获取单个相关文档
export async function get_link_doc(
  session_id: string,
  project_id: string,
  sprit_id: string,
  doc_id: string,
): Promise<GetLinkDocResponse> {
  const cmd = 'plugin:project_sprit_api|get_link_doc';
  const request = {
    session_id,
    project_id,
    sprit_id,
    doc_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<GetLinkDocResponse>(cmd, {
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