import { invoke } from '@tauri-apps/api/tauri';
import type { AppPerm, BaseAppInfo } from './appstore';

export type AdminCreateMajorCateRequest = {
    admin_session_id: string;
    cate_name: string;
};

export type AdminCreateMajorCateResponse = {
    code: number;
    err_msg: string;
    major_cate_id: string;
};

export type AdminUpdateMajorCateRequest = {
    admin_session_id: string;
    cate_id: string;
    cate_name: string;
};

export type AdminUpdateMajorCateResponse = {
    code: number;
    err_msg: string;
};


export type AdminRemoveMajorCateRequest = {
    admin_session_id: string;
    cate_id: string;
};

export type AdminRemoveMajorCateResponse = {
    code: number;
    err_msg: string;
};


export type AdminCreateMinorCateRequest = {
    admin_session_id: string;
    major_cate_id: string;
    cate_name: string;
};

export type AdminCreateMinorCateResponse = {
    code: number;
    err_msg: string;
    cate_id: string;
};


export type AdminUpdateMinorCateRequest = {
    admin_session_id: string;
    cate_id: string;
    cate_name: string;
};

export type AdminUpdateMinorCateResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemoveMinorCateRequest = {
    admin_session_id: string;
    cate_id: string;
};

export type AdminRemoveMinorCateResponse = {
    code: number;
    err_msg: string;
};


export type AdminCreateSubMinorCateRequest = {
    admin_session_id: string;
    minor_cate_id: string;
    cate_name: string;
};

export type AdminCreateSubMinorCateResponse = {
    code: number;
    err_msg: string;
    cate_id: string;
};

export type AdminUpdateSubMinorCateRequest = {
    admin_session_id: string;
    cate_id: string;
    cate_name: string;
};

export type AdminUpdateSubMinorCateResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemoveSubMinorCateRequest = {
    admin_session_id: string;
    cate_id: string;
};

export type AdminRemoveSubMinorCateResponse = {
    code: number;
    err_msg: string;
};


export type AdminAddAppRequest = {
    admin_session_id: string;
    base_info: BaseAppInfo;
    major_cate_id: string;
    minor_cate_id: string;
    sub_minor_cate_id: string;
    app_perm: AppPerm;
    file_id: string;
    os_windows: boolean;
    os_mac: boolean;
    os_linux: boolean;
    user_app: boolean;
    project_app: boolean;
};

export type AdminAddAppResponse = {
    code: number;
    err_msg: string;
    app_id: string;
};

export type AdminUpdateAppRequest = {
    admin_session_id: string;
    app_id: string;
    base_info: BaseAppInfo;
};

export type AdminUpdateAppResponse = {
    code: number;
    err_msg: string;
};


export type AdminUpdateAppFileRequest = {
    admin_session_id: string;
    app_id: string;
    file_id: string;
};

export type AdminUpdateAppFileResponse = {
    code: number;
    err_msg: string;
};


export type AdminRemoveAppRequest = {
    admin_session_id: string;
    app_id: string;
};

export type AdminRemoveAppResponse = {
    code: number;
    err_msg: string;
};


export type AdminMoveAppRequest = {
    admin_session_id: string;
    app_id: string;
    major_cate_id: string;
    minor_cate_id: string;
    sub_minor_cate_id: string;
};

export type AdminMoveAppResponse = {
    code: number;
    err_msg: string;
};


export type AdminUpdateAppPermRequest = {
    admin_session_id: string;
    app_id: string;
    app_perm: AppPerm;
};

export type AdminUpdateAppPermResponse = {
    code: number;
    err_msg: string;
};


export type AdminUpdateAppOsRequest = {
    admin_session_id: string;
    app_id: string;
    os_windows: boolean;
    os_mac: boolean;
    os_linux: boolean;
};

export type AdminUpdateAppOsResponse = {
    code: number;
    err_msg: string;
};


export type AdminUpdateAppScopeRequest = {
    admin_session_id: string;
    app_id: string;
    user_app: boolean;
    project_app: boolean;
};

export type AdminUpdateAppScopeResponse = {
    code: number;
    err_msg: string;
};


//创建一级分类
export async function create_major_cate(request: AdminCreateMajorCateRequest): Promise<AdminCreateMajorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|create_major_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateMajorCateResponse>(cmd, {
        request,
    });
}

//更新一级分类
export async function update_major_cate(request: AdminUpdateMajorCateRequest): Promise<AdminUpdateMajorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|update_major_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateMajorCateResponse>(cmd, {
        request,
    });
}

//删除一级分类
export async function remove_major_cate(request: AdminRemoveMajorCateRequest): Promise<AdminRemoveMajorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|remove_major_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveMajorCateResponse>(cmd, {
        request,
    });
}

//创建二级分类
export async function create_minor_cate(request: AdminCreateMinorCateRequest): Promise<AdminCreateMinorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|create_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateMinorCateResponse>(cmd, {
        request,
    });
}

//更新二级分类
export async function update_minor_cate(request: AdminUpdateMinorCateRequest): Promise<AdminUpdateMinorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|update_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateMinorCateResponse>(cmd, {
        request,
    });
}

//删除二级分类
export async function remove_minor_cate(request: AdminRemoveMinorCateRequest): Promise<AdminRemoveMinorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|remove_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveMinorCateResponse>(cmd, {
        request,
    });
}

//创建三级分类
export async function create_sub_minor_cate(request: AdminCreateSubMinorCateRequest): Promise<AdminCreateSubMinorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|create_sub_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateSubMinorCateResponse>(cmd, {
        request,
    });
}

//更新三级分类
export async function update_sub_minor_cate(request: AdminUpdateSubMinorCateRequest): Promise<AdminUpdateSubMinorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|update_sub_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateSubMinorCateResponse>(cmd, {
        request,
    });
}

//删除三级分类
export async function remove_sub_minor_cate(request: AdminRemoveSubMinorCateRequest): Promise<AdminRemoveSubMinorCateResponse> {
    const cmd = 'plugin:appstore_admin_api|remove_sub_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveSubMinorCateResponse>(cmd, {
        request,
    });
}

//上传应用
export async function add_app(request: AdminAddAppRequest): Promise<AdminAddAppResponse> {
    const cmd = 'plugin:appstore_admin_api|add_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddAppResponse>(cmd, {
        request,
    });
}

//更新应用信息
export async function update_app(request: AdminUpdateAppRequest): Promise<AdminUpdateAppResponse> {
    const cmd = 'plugin:appstore_admin_api|update_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateAppResponse>(cmd, {
        request,
    });
}

//更新应用文件
export async function update_app_file(request: AdminUpdateAppFileRequest): Promise<AdminUpdateAppFileResponse> {
    const cmd = 'plugin:appstore_admin_api|update_app_file';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateAppFileResponse>(cmd, {
        request,
    });
}

//删除应用
export async function remove_app(request: AdminRemoveAppRequest): Promise<AdminRemoveAppResponse> {
    const cmd = 'plugin:appstore_admin_api|remove_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveAppResponse>(cmd, {
        request,
    });
}

//移动应用
export async function move_app(request: AdminMoveAppRequest): Promise<AdminMoveAppResponse> {
    const cmd = 'plugin:appstore_admin_api|move_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminMoveAppResponse>(cmd, {
        request,
    });
}

//更新应用权限
export async function update_app_perm(request: AdminUpdateAppPermRequest): Promise<AdminUpdateAppPermResponse> {
    const cmd = 'plugin:appstore_admin_api|update_app_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateAppPermResponse>(cmd, {
        request,
    });
}

//更新分发系统
export async function update_app_os(request: AdminUpdateAppOsRequest): Promise<AdminUpdateAppOsResponse> {
    const cmd = 'plugin:appstore_admin_api|update_app_os';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateAppOsResponse>(cmd, {
        request,
    });
}

//更新应用范围
export async function update_app_scope(request: AdminUpdateAppScopeRequest): Promise<AdminUpdateAppScopeResponse> {
    const cmd = 'plugin:appstore_admin_api|update_app_scope';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateAppScopeResponse>(cmd, {
        request,
    });
}