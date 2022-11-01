import { invoke } from '@tauri-apps/api/tauri';

export type BasicRobotInfo = {
    name: string;
};

export type RobotInfo = {
    robot_id: string;
    project_id: string;
    basic_info: BasicRobotInfo;
    access_member_id_list: string[];
    online: boolean;
    metric_count: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
    can_metric: boolean;
};

export type CreateRequest = {
    session_id: string;
    project_id: string;
    basic_info: BasicRobotInfo;
    access_user_id_list: string[],
};

export type CreateResponse = {
    code: number;
    err_msg: string;
    robot_id: string;
};


export type UpdateBasicInfoRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
    basic_info: BasicRobotInfo;
};

export type UpdateBasicInfoResponse = {
    code: number;
    err_msg: string;
};


export type AddAccessUserRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
    member_user_id: string;
};

export type AddAccessUserResponse = {
    code: number;
    err_msg: string;
};


export type RemoveAccessUserRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
    member_user_id: string;
};

export type RemoveAccessUserResponse = {
    code: number;
    err_msg: string;
};

export type ListRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    robot_list: RobotInfo[];
};


export type GetRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
};

export type GetResponse = {
    code: number;
    err_msg: string;
    robot: RobotInfo;
};


export type GetTokenRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
};

export type GetTokenResponse = {
    code: number;
    err_msg: string;
    server_addr: string;
    token: string;
};


export type RenewTokenRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
};

export type RenewTokenResponse = {
    code: number;
    err_msg: string;
    server_addr: string;
    token: string;
};

export type RemoveRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};

//创建机器人
export async function create(request: CreateRequest): Promise<CreateResponse> {
    const cmd = 'plugin:robot_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateResponse>(cmd, {
        request,
    });
}

// 更新机器人基本信息
export async function update_basic_info(request: UpdateBasicInfoRequest): Promise<UpdateBasicInfoResponse> {
    const cmd = 'plugin:robot_api|update_basic_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateBasicInfoResponse>(cmd, {
        request,
    });
}

//新增访问用户
export async function add_access_user(request: AddAccessUserRequest): Promise<AddAccessUserResponse> {
    const cmd = 'plugin:robot_api|add_access_user';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddAccessUserResponse>(cmd, {
        request,
    });
}

//删除访问用户
export async function remove_access_user(request: RemoveAccessUserRequest): Promise<RemoveAccessUserResponse> {
    const cmd = 'plugin:robot_api|remove_access_user';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveAccessUserResponse>(cmd, {
        request,
    });
}

//列出机器人
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:robot_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request,
    });
}

//获取单个机器人
export async function get(request: GetRequest): Promise<GetResponse> {
    const cmd = 'plugin:robot_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResponse>(cmd, {
        request,
    });
}

//获取机器人令牌
export async function get_token(request: GetTokenRequest): Promise<GetTokenResponse> {
    const cmd = 'plugin:robot_api|get_token';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetTokenResponse>(cmd, {
        request,
    });
}

//更新机器人令牌
export async function renew_token(request: RenewTokenRequest): Promise<RenewTokenResponse> {
    const cmd = 'plugin:robot_api|renew_token';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RenewTokenResponse>(cmd, {
        request,
    });
}

//删除机器人
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:robot_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}