import { invoke } from '@tauri-apps/api/tauri';
import type { USER_STATE, BasicUserInfo, UserInfo } from './user';

export type AdminListRequest = {
    admin_session_id: string;
    filter_by_keyword: boolean;
    keyword: string;
    filter_by_user_state: boolean;
    user_state: USER_STATE,
    offset: number;
    limit: number;
};

export type AdminListResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    user_info_list: UserInfo[];
};

export type AdminExistRequest = {
    admin_session_id: string;
    user_name: string;
};

export type AdminExistResponse = {
    code: number;
    err_msg: string;
    exist: boolean;
};

export type AdminGetRequest = {
    admin_session_id: string;
    user_id: string;
};

export type AdminGetResponse = {
    code: number;
    err_msg: string;
    user_info: UserInfo;
};


export type AdminSetStateRequest = {
    admin_session_id: string;
    user_id: string;
    user_state: USER_STATE,
};

export type AdminSetStateResponse = {
    code: number;
    err_msg: string;
};


export type AdminCreateRequest = {
    admin_session_id: string;
    user_name: string;
    basic_info: BasicUserInfo;
    user_state: USER_STATE;
    password: string;
};

export type AdminCreateResponse = {
    code: number;
    err_msg: string;
    user_id: string;
};


export type AdminResetPasswordRequest = {
    admin_session_id: string;
    user_id: string;
    password: string;
};

export type AdminResetPasswordResponse = {
    code: number;
    err_msg: string;
}

//列出用户
export async function list(request: AdminListRequest): Promise<AdminListResponse> {
    const cmd = 'plugin:user_admin_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListResponse>(cmd, {
        request,
    });
}

//检查用户是否存在
export async function exist(request: AdminExistRequest): Promise<AdminExistResponse> {
    const cmd = 'plugin:user_admin_api|exist';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminExistResponse>(cmd, {
        request,
    });
}

//获取单个用户信息
export async function get(request: AdminGetRequest): Promise<AdminGetResponse> {
    const cmd = 'plugin:user_admin_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminGetResponse>(cmd, {
        request,
    });
}

//设置用户状态
export async function set_state(request: AdminSetStateRequest): Promise<AdminSetStateResponse> {
    const cmd = 'plugin:user_admin_api|set_state';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminSetStateResponse>(cmd, {
        request,
    });
}

//创建用户
export async function create(request: AdminCreateRequest): Promise<AdminCreateResponse> {
    const cmd = 'plugin:user_admin_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateResponse>(cmd, {
        request,
    });
}

//重设密码
export async function reset_password(request: AdminResetPasswordRequest): Promise<AdminResetPasswordResponse> {
    const cmd = 'plugin:user_admin_api|reset_password';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminResetPasswordResponse>(cmd, {
        request,
    });
}