import { invoke } from '@tauri-apps/api/tauri';

export type BasicSpritInfo = {
  title: string;
  start_time: number;
  end_time: number;
  non_work_day_list: number[],
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
  link_channel_id: string;
  link_channel_title: string;
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

export type LinkChannelResponse = {
  code: number;
  err_msg: string;
};

export type CancelLinkChannelResponse = {
  code: number;
  err_msg: string;
};

//创建迭代
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

//更新迭代信息
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

//列出迭代信息
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

//获取单个迭代信息
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

//删除迭代信息
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

//关联频道
export async function link_channel(
  session_id: string,
  project_id: string,
  sprit_id: string,
  channel_id: string,
): Promise<LinkChannelResponse> {
  const cmd = 'plugin:project_sprit_api|link_channel';
  const request = {
    session_id,
    project_id,
    sprit_id,
    channel_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<LinkChannelResponse>(cmd, {
    request,
  });
}

//取消关联频道
export async function cancel_link_channel(
  session_id: string,
  project_id: string,
  sprit_id: string,
): Promise<CancelLinkChannelResponse> {
  const cmd = 'plugin:project_sprit_api|cancel_link_channel';
  const request = {
    session_id,
    project_id,
    sprit_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CancelLinkChannelResponse>(cmd, {
    request,
  });
}
