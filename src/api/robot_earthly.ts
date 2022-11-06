import { invoke } from '@tauri-apps/api/tauri';

export type BasicRepoInfo ={  
    repo_url: string;
};

export type RobotInfo = {
    robot_id: string;
    robot_name: string;
    can_access: boolean;
};

export type RepoInfo = {
    repo_id: string;
    project_id: string;
    basic_info: BasicRepoInfo;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    robot_list: RobotInfo[];
    action_count: number;
};

export type ParamDef = {
    name: string;
    desc: string;
    default_value: string;
};

export type BasicActionInfo = {
    action_name: string;
    earthly_file: string;
    target: string;
    param_def_list: ParamDef[];
};

export type ActionInfo = {
    action_id: string;
    repo_id: string;
    project_id: string;
    basic_info: BasicActionInfo;
    exec_count: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
};

export type Param = {
    name: string;  
    value: string;
};

export type AddRepoRequest = {
    session_id: string;
    project_id: string;
    basic_info: BasicRepoInfo;
    robot_id_list: string[];
};

export type AddRepoResponse = {
    code: number;
    err_msg: string;
    repo_id: string;
};

export type ListRepoRequest = {  
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListRepoResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: RepoInfo[];
};


export type GetRepoRequest = {
    session_id: string;
    project_id: string;  
    repo_id: string;
};

export type GetRepoResponse = {
    code: number;
    err_msg: string;
    info: RepoInfo;
}


export type RemoveRepoRequest = {
    session_id: string;
    project_id: string;  
    repo_id: string;
};

export type RemoveRepoResponse = {
    code: number;
    err_msg: string;
};


export type LinkRobotRequest ={
    session_id: string;
    project_id: string;
    repo_id: string;
    robot_id: string;
};

export type LinkRobotResponse ={
    code: number;
    err_msg: string;
};


export type UnlinkRobotRequest = {
    
    session_id: string;
    
    project_id: string;
    
    repo_id: string;
    
    robot_id: string;
};

export type UnlinkRobotResponse = {
    code: number;
    err_msg: string;
};


export type CreateActionRequest = {
    session_id: string;
    project_id: string;
    repo_id: string;
    basic_info: BasicActionInfo;
};

export type CreateActionResponse ={
    code: number;
    err_msg: string;  
    action_id: string;
};


export type ListActionRequest = {
    session_id: string;
    project_id: string;  
    repo_id: string;
};

export type ListActionResponse = {
    code: number;
    err_msg: string;
    info_list: ActionInfo[];
};


export type GetActionRequest = {
    session_id: string;
    project_id: string; 
    repo_id: string;    
    action_id: string;
};

export type GetActionResponse = {
    code: number;
    err_msg: string;
    info: ActionInfo;
};


export type UpdateActionRequest ={
    session_id: string;
    project_id: string;
    repo_id: string;
    action_id: string;
    basic_info: BasicActionInfo;
};

export type UpdateActionResponse = {
    code: number;
    err_msg: string;
};


export type RemoveActionRequest = {
    
    session_id: string;
    project_id: string;
    repo_id: string;  
    action_id: string;
};

export type RemoveActionResponse = {
    code: number;
    err_msg: string;
};

//增加仓库
export async function add_repo(request: AddRepoRequest): Promise<AddRepoResponse> {
    const cmd = 'plugin:robot_earthly_api|add_repo';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddRepoResponse>(cmd, {
        request,
    });
}

//列出仓库
export async function list_repo(request: ListRepoRequest): Promise<ListRepoResponse> {
    const cmd = 'plugin:robot_earthly_api|list_repo';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListRepoResponse>(cmd, {
        request,
    });
}

//获取单个仓库
export async function get_repo(request: GetRepoRequest): Promise<GetRepoResponse> {
    const cmd = 'plugin:robot_earthly_api|get_repo';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetRepoResponse>(cmd, {
        request,
    });
}

//删除仓库
export async function remove_repo(request: RemoveRepoRequest): Promise<RemoveRepoResponse> {
    const cmd = 'plugin:robot_earthly_api|remove_repo';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveRepoResponse>(cmd, {
        request,
    });
}

//关联到机器人
export async function link_robot(request: LinkRobotRequest): Promise<LinkRobotResponse> {
    const cmd = 'plugin:robot_earthly_api|link_robot';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<LinkRobotResponse>(cmd, {
        request,
    });
}

//取消到机器人的关联
export async function unlink_robot(request: UnlinkRobotRequest): Promise<UnlinkRobotResponse> {
    const cmd = 'plugin:robot_earthly_api|unlink_robot';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UnlinkRobotResponse>(cmd, {
        request,
    });
}

//创建仓库action
export async function create_action(request: CreateActionRequest): Promise<CreateActionResponse> {
    const cmd = 'plugin:robot_earthly_api|create_action';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateActionResponse>(cmd, {
        request,
    });
}

//列出仓库action
export async function list_action(request: ListActionRequest): Promise<ListActionResponse> {
    const cmd = 'plugin:robot_earthly_api|list_action';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListActionResponse>(cmd, {
        request,
    });
}

//获取单个仓库action
export async function get_action(request: GetActionRequest): Promise<GetActionResponse> {
    const cmd = 'plugin:robot_earthly_api|get_action';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetActionResponse>(cmd, {
        request,
    });
}

//更新仓库action
export async function update_action(request: UpdateActionRequest): Promise<UpdateActionResponse> {
    const cmd = 'plugin:robot_earthly_api|update_action';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateActionResponse>(cmd, {
        request,
    });
}

//删除仓库action
export async function remove_action(request: RemoveActionRequest): Promise<RemoveActionResponse> {
    const cmd = 'plugin:robot_earthly_api|remove_action';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveActionResponse>(cmd, {
        request,
    });
}
                