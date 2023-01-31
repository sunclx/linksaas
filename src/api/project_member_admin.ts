import { invoke } from '@tauri-apps/api/tauri';
import type { RoleInfo, MemberInfo } from './project_member';

export type AdminListRoleRequest = {
    admin_session_id: string;
    project_id: string;
};

export type AdminListRoleResponse = {
    code: number;
    err_msg: string;
    role_info_list: RoleInfo[];
};


export type AdminListRequest = {
    admin_session_id: string;
    project_id: string;
};

export type AdminListResponse = {
    code: number;
    err_msg: string;
    member_info_list: MemberInfo[];
};


export type AdminAddRequest = {
    admin_session_id: string;
    project_id: string;
    user_id: string;
    role_id: string;
};

export type AdminAddResponse = {
    code: number;
    err_msg: string;
};


export type AdminRemoveRequest = {
    admin_session_id: string;
    project_id: string;
    user_id: string;
};

export type AdminRemoveResponse = {
    code: number;
    err_msg: string;
};

//列出项目角色
export async function list_role(request: AdminListRoleRequest): Promise<AdminListRoleResponse> {
    const cmd = 'plugin:project_member_admin_api|list_role';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListRoleResponse>(cmd, {
        request,
    });
}

//列出项目成员
export async function list(request: AdminListRequest): Promise<AdminListResponse> {
    const cmd = 'plugin:project_member_admin_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListResponse>(cmd, {
        request,
    });
}

//增加项目成员
export async function add(request: AdminAddRequest): Promise<AdminAddResponse> {
    const cmd = 'plugin:project_member_admin_api|add';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddResponse>(cmd, {
        request,
    });
}

//删除项目成员
export async function remove(request: AdminRemoveRequest): Promise<AdminRemoveResponse> {
    const cmd = 'plugin:project_member_admin_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveResponse>(cmd, {
        request,
    });
}