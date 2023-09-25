import { invoke } from '@tauri-apps/api/tauri';

export type CateInfo = {
    cate_id: string;
    cate_name: string;
    app_count: number;
};

export type AppImage = {
    thumb_file_id: string;
    raw_file_id: string;
    weight: number;
};

export type AppInfo = {
    app_id: string;
    name: string;
    desc: string;
    icon_file_id: string;
    cate_id: string;
    cate_name: string;
    official_url: string;
    doc_url: string;
    template_count: number;
    create_time: number;
    update_time: number;
    image_list?: AppImage[];
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

export type AppComment = {
    comment_id: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    comment: string;
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
    filter_by_keyword: boolean;
    keyword: string;
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

export type AddCommentRequest = {
    session_id: string;
    app_id: string;
    comment: string;
};

export type AddCommentResponse = {
    code: number;
    err_msg: string;
    comment_id: string;
};

export type RemoveCommentRequest = {
    session_id: string;
    app_id: string;
    comment_id: string;
};

export type RemoveCommentResponse = {
    code: number;
    err_msg: string;
};

export type ListCommentRequest = {
    app_id: string;
    offset: number;
    limit: number;
};

export type ListCommentResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    comment_list: AppComment[];
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

//增加评论
export async function add_comment(request: AddCommentRequest): Promise<AddCommentResponse> {
    const cmd = 'plugin:docker_template_api|add_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddCommentResponse>(cmd, {
        request,
    });
}

//删除评论
export async function remove_comment(request: RemoveCommentRequest): Promise<RemoveCommentResponse> {
    const cmd = 'plugin:docker_template_api|remove_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveCommentResponse>(cmd, {
        request,
    });
}

//列出评论
export async function list_comment(request: ListCommentRequest): Promise<ListCommentResponse> {
    const cmd = 'plugin:docker_template_api|list_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCommentResponse>(cmd, {
        request,
    });
}