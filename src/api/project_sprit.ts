import { invoke } from '@tauri-apps/api/tauri';

type BasicSpritInfo = {
  title: string;
  start_time: number;
  end_time: number;
  non_work_day_list: number[],
};

type CreateResponse = {
  code: number;
  err_msg: string;
  sprit_id: string;
};

type UpdateResponse = {
  code: number;
  err_msg: string;
};

type SpritInfo = {
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
};

type ListResponse = {
  code: number;
  err_msg: string;
  total_count: number;
  info_list: SpritInfo[];
};

type GetResponse = {
  code: number;
  err_msg: string;
  info: SpritInfo;
};

type RemoveResponse = {
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