import { invoke } from '@tauri-apps/api/tauri';
import type { AppImage } from './docker_template';

export type AdminCreateCateRequest = {
    admin_session_id: string;
    cate_name: string;
};

export type AdminCreateCateResponse = {
    code: number;
    err_msg: string;
    cate_id: string;
};


export type AdminUpdateCateRequest = {
    admin_session_id: string;
    cate_id: string;
    cate_name: string;
};

export type AdminUpdateCateResponse = {

    code: number;

    err_msg: string;
};


export type AdminRemoveCateRequest = {
    admin_session_id: string;
    cate_id: string;
};

export type AdminRemoveCateResponse = {

    code: number;
    err_msg: string;
};


export type AdminCreateAppRequest = {
    admin_session_id: string;
    name: string;
    desc: string;
    icon_file_id: string;
    cate_id: string;
    official_url: string;
    doc_url: string;
};

export type AdminCreateAppResponse = {
    code: number;
    err_msg: string;
    app_id: string;
};


export type AdminUpdateAppRequest = {
    admin_session_id: string;
    app_id: string;
    name: string;
    desc: string;
    icon_file_id: string;
    cate_id: string;
    official_url: string;
    doc_url: string;
};

export type AdminUpdateAppResponse = {
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


export type AdminCreateTemplateRequest = {
    admin_session_id: string;
    app_id: string;
    version: string;
    file_id: string;
};

export type AdminCreateTemplateResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemoveTemplateRequest = {
    admin_session_id: string;
    app_id: string;
    version: string;
};

export type AdminRemoveTemplateResponse = {
    code: number;
    err_msg: string;
};

export type AdminAddImageRequest = {
    admin_session_id: string;
    app_id: string;
    app_image: AppImage;
};

export type AdminAddImageResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemoveImageRequest = {
    admin_session_id: string;
    app_id: string;
    thumb_file_id: string;
    raw_file_id: string;
};

export type AdminRemoveImageResponse = {
    code: number;
    err_msg: string;
};

export type AdminSetImageWeightRequest = {
    admin_session_id: string;
    app_id: string;
    app_image: AppImage;
};

export type AdminSetImageWeightResponse = {
    code: number;
    err_msg: string;
};


// 创建分类
export async function create_cate(request: AdminCreateCateRequest): Promise<AdminCreateCateResponse> {
    const cmd = 'plugin:docker_template_admin_api|create_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateCateResponse>(cmd, {
        request,
    });
}

// 更新分类
export async function update_cate(request: AdminUpdateCateRequest): Promise<AdminUpdateCateResponse> {
    const cmd = 'plugin:docker_template_admin_api|update_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateCateResponse>(cmd, {
        request,
    });
}

// 删除分类
export async function remove_cate(request: AdminRemoveCateRequest): Promise<AdminRemoveCateResponse> {
    const cmd = 'plugin:docker_template_admin_api|remove_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveCateResponse>(cmd, {
        request,
    });
}

// 创建应用
export async function create_app(request: AdminCreateAppRequest): Promise<AdminCreateAppResponse> {
    const cmd = 'plugin:docker_template_admin_api|create_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateAppResponse>(cmd, {
        request,
    });
}

// 更新应用
export async function update_app(request: AdminUpdateAppRequest): Promise<AdminUpdateAppResponse> {
    const cmd = 'plugin:docker_template_admin_api|update_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateAppResponse>(cmd, {
        request,
    });
}

// 删除应用
export async function remove_app(request: AdminRemoveAppRequest): Promise<AdminRemoveAppResponse> {
    const cmd = 'plugin:docker_template_admin_api|remove_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveAppResponse>(cmd, {
        request,
    });
}

// 创建模板
export async function create_template(request: AdminCreateTemplateRequest): Promise<AdminCreateTemplateResponse> {
    const cmd = 'plugin:docker_template_admin_api|create_template';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminCreateTemplateResponse>(cmd, {
        request,
    });
}

// 删除模板
export async function remove_template(request: AdminRemoveTemplateRequest): Promise<AdminRemoveTemplateResponse> {
    const cmd = 'plugin:docker_template_admin_api|remove_template';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveTemplateResponse>(cmd, {
        request,
    });
}

// 增加图片
export async function add_image(request: AdminAddImageRequest): Promise<AdminAddImageResponse> {
    const cmd = 'plugin:docker_template_admin_api|add_image';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddImageResponse>(cmd, {
        request,
    });
}

// 删除图片
export async function remove_image(request: AdminRemoveImageRequest): Promise<AdminRemoveImageResponse> {
    const cmd = 'plugin:docker_template_admin_api|remove_image';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveImageResponse>(cmd, {
        request,
    });
}

// 设置图片权重
export async function set_image_weight(request: AdminSetImageWeightRequest): Promise<AdminSetImageWeightResponse> {
    const cmd = 'plugin:docker_template_admin_api|set_image_weight';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminSetImageWeightResponse>(cmd, {
        request,
    });
}