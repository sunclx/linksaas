import { invoke } from '@tauri-apps/api/tauri';

export type OS_SCOPE = number;
export const OS_SCOPE_WINDOWS: OS_SCOPE = 0;
export const OS_SCOPE_MAC: OS_SCOPE = 1;
export const OS_SCOPE_LINUX: OS_SCOPE = 2;

export type SORT_KEY = number;
export const SORT_KEY_UPDATE_TIME: SORT_KEY = 0;
export const SORT_KEY_INSTALL_COUNT: SORT_KEY = 1;
export const SORT_KEY_AGREE_COUNT: SORT_KEY = 2;

export type MajorCate = {
    cate_id: string;
    cate_name: string;
    minor_cate_count: number;
};

export type MinorCate = {
    cate_id: string;
    cate_name: string;
    sub_minor_cate_count: number;
};

export type SubMinorCate = {
    cate_id: string;
    cate_name: string;
};

export type BaseAppInfo = {
    app_name: string;
    app_desc: string;
    icon_file_id: string;
    src_url: string;
};

export type AppNetPerm = {
    cross_domain_http: boolean;
    proxy_redis: boolean;
    proxy_mysql: boolean;
    proxy_post_gres: boolean;
    proxy_mongo: boolean;
    proxy_ssh: boolean;
    net_util: boolean;
};

export type AppFsPerm = {
    read_file: boolean;
    write_file: boolean;
};

export type AppExtraPerm = {
    cross_origin_isolated: boolean;
    open_browser: boolean;
};

export type AppPerm = {
    net_perm: AppNetPerm;
    fs_perm: AppFsPerm;
    extra_perm: AppExtraPerm;
};

export type AppInfo = {
    app_id: string;
    base_info: BaseAppInfo;
    major_cate: MajorCate;
    minor_cate: MinorCate;
    sub_minor_cate: SubMinorCate;
    app_perm: AppPerm;
    file_id: string;
    os_windows: boolean;
    os_mac: boolean;
    os_linux: boolean;
    user_app: boolean;
    create_time: number;
    update_time: number;
    install_count: number;
    agree_count: number;
    comment_count: number;
    my_agree: boolean;
    my_install: boolean;
};

export type ListAppParam = {
    filter_by_major_cate_id: boolean;
    major_cate_id: string;
    filter_by_minor_cate_id: boolean;
    minor_cate_id: string;
    filter_by_sub_minor_cate_id: boolean;
    sub_minor_cate_id: string;
    filter_by_os_scope: boolean;
    os_scope: OS_SCOPE;
    filter_by_keyword: boolean;
    keyword: string;

};

export type CatePath = {
    major_cate_id: string;
    minor_cate_id: string;
    sub_minor_cate_id: string;
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
export type ListMajorCateRequest = {};

export type ListMajorCateResponse = {
    code: number;
    err_msg: string;
    cate_info_list: MajorCate[];
};


export type ListMinorCateRequest = {
    major_cate_id: string;
};

export type ListMinorCateResponse = {
    code: number;
    err_msg: string;
    cate_info_list: MinorCate[];
}


export type ListSubMinorCateRequest = {
    minor_cate_id: string;
};

export type ListSubMinorCateResponse = {
    code: number;
    err_msg: string;
    cate_info_list: SubMinorCate[];
};

export type GetCatePathRequest = {
    cate_id: string;
};

export type GetCatePathResponse = {
    code: number;
    err_msg: string;
    cate_path: CatePath;
};

export type ListAppRequest = {
    list_param: ListAppParam;
    session_id: string;
    offset: number;
    limit: number;
    sort_key: SORT_KEY;
};

export type ListAppResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    app_info_list: AppInfo[];
};


export type GetAppRequest = {
    app_id: string;
    session_id: string;
};

export type GetAppResponse = {
    code: number;
    err_msg: string;
    app_info: AppInfo;
};

export type QueryPermRequest = {
    app_id: string;
};
export type QueryPermResponse = {
    code: number;
    err_msg: string;
    app_perm: AppPerm;
};

export type AgreeAppRequest = {
    session_id: string;
    app_id: string;
};

export type AgreeAppResponse = {
    code: number;
    err_msg: string;
};

export type CancelAgreeAppRequest = {
    session_id: string;
    app_id: string;
};

export type CancelAgreeAppResponse = {
    code: number;
    err_msg: string;
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


//列出一级分类
export async function list_major_cate(request: ListMajorCateRequest): Promise<ListMajorCateResponse> {
    const cmd = 'plugin:appstore_api|list_major_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMajorCateResponse>(cmd, {
        request,
    });
}


//列出二级分类
export async function list_minor_cate(request: ListMinorCateRequest): Promise<ListMinorCateResponse> {
    const cmd = 'plugin:appstore_api|list_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMinorCateResponse>(cmd, {
        request,
    });
}


//列出三级分类
export async function list_sub_minor_cate(request: ListSubMinorCateRequest): Promise<ListSubMinorCateResponse> {
    const cmd = 'plugin:appstore_api|list_sub_minor_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListSubMinorCateResponse>(cmd, {
        request,
    });
}

//列出分类路径
export async function get_cate_path(request: GetCatePathRequest): Promise<GetCatePathResponse> {
    const cmd = 'plugin:appstore_api|get_cate_path';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetCatePathResponse>(cmd, {
        request,
    });
}


//列出应用
export async function list_app(request: ListAppRequest): Promise<ListAppResponse> {
    const cmd = 'plugin:appstore_api|list_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAppResponse>(cmd, {
        request,
    });
}


//获取单个应用
export async function get_app(request: GetAppRequest): Promise<GetAppResponse> {
    const cmd = 'plugin:appstore_api|get_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetAppResponse>(cmd, {
        request,
    });
}

//获取权限
export async function query_perm(request: QueryPermRequest): Promise<QueryPermResponse> {
    const cmd = 'plugin:appstore_api|query_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<QueryPermResponse>(cmd, {
        request,
    });
}

//赞同应用
export async function agree_app(request: AgreeAppRequest): Promise<AgreeAppResponse> {
    const cmd = 'plugin:appstore_api|agree_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AgreeAppResponse>(cmd, {
        request,
    });
}

//取消赞同应用
export async function cancel_agree_app(request: CancelAgreeAppRequest): Promise<CancelAgreeAppResponse> {
    const cmd = 'plugin:appstore_api|cancel_agree_app';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CancelAgreeAppResponse>(cmd, {
        request,
    });
}

//增加评论
export async function add_comment(request: AddCommentRequest): Promise<AddCommentResponse> {
    const cmd = 'plugin:appstore_api|add_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddCommentResponse>(cmd, {
        request,
    });
}

//删除评论
export async function remove_comment(request: RemoveCommentRequest): Promise<RemoveCommentResponse> {
    const cmd = 'plugin:appstore_api|remove_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveCommentResponse>(cmd, {
        request,
    });
}

//列出评论
export async function list_comment(request: ListCommentRequest): Promise<ListCommentResponse> {
    const cmd = 'plugin:appstore_api|list_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCommentResponse>(cmd, {
        request,
    });
}