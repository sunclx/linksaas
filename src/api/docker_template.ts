import { invoke } from '@tauri-apps/api/tauri';

export type CateInfo = {
    cate_id: string;
    cate_name: string;
    app_count: number;
};

export type AppInfo = {
    app_id: string;
    name: string;
    desc: string;
    icon_file_id: string;
    cate_id: string;
    cate_name: string;
    template_count: number;
    create_time: number;
    update_time: number;
};

export type TemplateInfo = {
    app_id: string;
    version: string;
    file_id: string;
};

export type AppWithTemplateInfo = {
    app_info: AppInfo;
    template_info_list: TemplateInfo[],
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ListCateRequest = {};

export type ListCateResponse = {
    code: number;
    err_msg: string;
    cate_info_list: CateInfo[];
};


export type ListAppWithTemplateRequest = {
    filter_by_cate_id: boolean;
    cate_id: string;
    offset: number;
    limit: number;
};

export type ListAppWithTemplateResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: AppWithTemplateInfo[];
};


export type GetAppWithTemplateRequest = {
    app_id: string;
};

export type GetAppWithTemplateResponse = {
    code: number;
    err_msg: string;
    info: AppWithTemplateInfo;
};

// 列出分类
export async function list_cate(request: ListCateRequest): Promise<ListCateResponse> {
    const cmd = 'plugin:docker_template_api|list_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCateResponse>(cmd, {
        request,
    });
}

// 列出应用和模板
export async function list_app_with_template(request: ListAppWithTemplateRequest): Promise<ListAppWithTemplateResponse> {
    const cmd = 'plugin:docker_template_api|list_app_with_template';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAppWithTemplateResponse>(cmd, {
        request,
    });
}

// 获取单个应用和模板
export async function get_app_with_template(request: GetAppWithTemplateRequest): Promise<GetAppWithTemplateResponse> {
    const cmd = 'plugin:docker_template_api|get_app_with_template';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetAppWithTemplateResponse>(cmd, {
        request,
    });
}

// 打包模板
export async function pack_template(path: string): Promise<string> {
    const cmd = 'plugin:docker_template_api|pack_template';
    const request = { path };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<string>(cmd, request);
}

// 检查是否解压模板
export async function check_unpark(fsId: string, fileId: string): Promise<boolean> {
    const cmd = 'plugin:docker_template_api|check_unpark';
    const request = { fsId, fileId };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<boolean>(cmd, request);
}

//解压模板
export async function unpack_template(fsId: string, fileId: string): Promise<void> {
    const cmd = 'plugin:docker_template_api|unpack_template';
    const request = { fsId, fileId };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, request);
}