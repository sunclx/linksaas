import { invoke } from '@tauri-apps/api/tauri';


export type PathElement = {
    depart_ment_id: string;
    name: string;
};

export type DepartMentInfo = {
    depart_ment_id: string;
    name: string;
    parent_depart_ment_id: string;
    user_count: number;
    sub_depart_ment_count: number;
};

export type DepartMentUserInfo = {
    depart_ment_id: string;
    depart_ment_name: string;
    user_id: string;
    user_display_name: string;
    user_logo_uri: string;
};

export type AdminCreateDepartMentRequest = {
    admin_session_id: string;
    parent_depart_ment_id: string;
    name: string;
};

export type AdminCreateDepartMentResponse = {
    code: number;
    err_msg: string;
    depart_ment_id: string;
};


export type AdminUpdateDepartMentRequest = {
    admin_session_id: string;
    depart_ment_id: string;
    name: string;
};

export type AdminUpdateDepartMentResponse = {
    code: number;
    err_msg: string;
};


export type AdminListDepartMentRequest = {
    admin_session_id: string;
    parent_depart_ment_id: string;
};

export type AdminListDepartMentResponse = {
    code: number;
    err_msg: string;
    depart_ment_list: DepartMentInfo[];
    path_element_list: PathElement[];
};


export type AdminMoveDepartMentRequest = {
    admin_session_id: string;
    depart_ment_id: string;
    parent_depart_ment_id: string;
};

export type AdminMoveDepartMentResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemoveDepartMentRequest = {
    admin_session_id: string;
    depart_ment_id: string;
};

export type AdminRemoveDepartMentResponse = {
    code: number;
    err_msg: string;
};

export type AdminAddDepartMentUserRequest = {
    admin_session_id: string;
    depart_ment_id: string;
    user_id: string;
};

export type AdminAddDepartMentUserResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemoveDepartMentUserRequest = {
    admin_session_id: string;
    depart_ment_id: string;
    user_id: string;
};

export type AdminRemoveDepartMentUserResponse = {
    code: number;
    err_msg: string;
};


export type AdminListDepartMentUserRequest = {
    admin_session_id: string;
    depart_ment_id: string;
    offset: number;
    limit: number;
};

export type AdminListDepartMentUserResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    user_info_list: DepartMentUserInfo[];
};

//创建部门
export async function create_depart_ment(request: AdminCreateDepartMentRequest): Promise<AdminCreateDepartMentResponse> {
    const cmd = 'plugin:org_admin_api|create_depart_ment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateDepartMentResponse>(cmd, {
        request,
    });
}

//更新部门
export async function update_depart_ment(request: AdminUpdateDepartMentRequest): Promise<AdminUpdateDepartMentResponse> {
    const cmd = 'plugin:org_admin_api|update_depart_ment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateDepartMentResponse>(cmd, {
        request,
    });
}

//列出部门
export async function list_depart_ment(request: AdminListDepartMentRequest): Promise<AdminListDepartMentResponse> {
    const cmd = 'plugin:org_admin_api|list_depart_ment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListDepartMentResponse>(cmd, {
        request,
    });
}

//移动部门
export async function move_depart_ment(request: AdminMoveDepartMentRequest): Promise<AdminMoveDepartMentResponse> {
    const cmd = 'plugin:org_admin_api|move_depart_ment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminMoveDepartMentResponse>(cmd, {
        request,
    });
}

//删除部门
export async function remove_depart_ment(request: AdminRemoveDepartMentRequest): Promise<AdminRemoveDepartMentResponse> {
    const cmd = 'plugin:org_admin_api|remove_depart_ment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveDepartMentResponse>(cmd, {
        request,
    });
}

//增加用户到部门
export async function add_depart_ment_user(request: AdminAddDepartMentUserRequest): Promise<AdminAddDepartMentUserResponse> {
    const cmd = 'plugin:org_admin_api|add_depart_ment_user';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddDepartMentUserResponse>(cmd, {
        request,
    });
}

//从部门中删除用户
export async function remove_depart_ment_user(request: AdminRemoveDepartMentUserRequest): Promise<AdminRemoveDepartMentUserResponse> {
    const cmd = 'plugin:org_admin_api|remove_depart_ment_user';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveDepartMentUserResponse>(cmd, {
        request,
    });
}

//列出部门成员
export async function list_depart_ment_user(request: AdminListDepartMentUserRequest): Promise<AdminListDepartMentUserResponse> {
    const cmd = 'plugin:org_admin_api|list_depart_ment_user';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListDepartMentUserResponse>(cmd, {
        request,
    });
}