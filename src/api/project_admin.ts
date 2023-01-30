import { invoke } from '@tauri-apps/api/tauri';
import type { BasicProjectInfo, ProjectInfo } from './project';

export type AdminListRequest = {
    admin_session_id: string;
    filter_closed: boolean;
    closed: boolean;
    filter_by_user_id: boolean;
    user_id: string;
    filter_by_keyword: boolean;
    keyword: string;
    filter_by_remove: boolean,
    remove: boolean,

    offset: number;
    limit: number;
};

export type AdminListResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    project_info_list: ProjectInfo[];
};

export type AdminGetRequest = {
    admin_session_id: string;
    project_id: string;
};

export type AdminGetResponse = {
    code: number;
    err_msg: string;
    project_info: ProjectInfo;
};


export type AdminCreateRequest = {
    admin_session_id: string;
    basic_info: BasicProjectInfo;
    owner_user_id: string;
};

export type AdminCreateResponse = {
    code: number;
    err_msg: string;
    project_id: string;
};

export type AdminUpdateRequest = {
    admin_session_id: string;
    project_id: string;
    basic_info: BasicProjectInfo;
    owner_user_id: string;
};

export type AdminUpdateResponse = {
    code: number;
    err_msg: string;
};

//列出项目
export async function list(request: AdminListRequest): Promise<AdminListResponse> {
    const cmd = 'plugin:project_admin_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListResponse>(cmd, {
        request,
    });
}

//获取单个项目信息
export async function get(request: AdminGetRequest): Promise<AdminGetResponse> {
    const cmd = 'plugin:project_admin_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminGetResponse>(cmd, {
        request,
    });
}

//更新项目
export async function update(request: AdminUpdateRequest): Promise<AdminUpdateResponse> {
    const cmd = 'plugin:project_admin_api|update';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateResponse>(cmd, {
        request,
    });
}

//创建项目
export async function create(request: AdminCreateRequest): Promise<AdminCreateResponse> {
    const cmd = 'plugin:project_admin_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateResponse>(cmd, {
        request,
    });
}