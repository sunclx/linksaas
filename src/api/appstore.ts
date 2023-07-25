import { invoke } from '@tauri-apps/api/tauri';


export type APP_SCOPE = number;
export const APP_SCOPE_USER: APP_SCOPE = 0;
export const APP_SCOPE_PROJECT: APP_SCOPE = 1;


export type OS_SCOPE = number;
export const OS_SCOPE_WINDOWS: OS_SCOPE = 0;
export const OS_SCOPE_MAC: OS_SCOPE = 1;
export const OS_SCOPE_LINUX: OS_SCOPE = 2;

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

export type AppMemberPerm = {
    list_member: boolean;
    list_goal_history: boolean;
};

export type AppIssuePerm = {
    list_my_task: boolean;
    list_all_task: boolean;
    list_my_bug: boolean;
    list_all_bug: boolean;
};

export type AppEventPerm = {
    list_my_event: boolean;
    list_all_event: boolean;
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
    member_perm: AppMemberPerm;
    issue_perm: AppIssuePerm;
    event_perm: AppEventPerm;
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
    project_app: boolean;
    create_time: number;
    update_time: number;
};

export type ListAppParam = {
    filter_by_major_cate_id: boolean;
    major_cate_id: string;
    filter_by_minor_cate_id: boolean;
    minor_cate_id: string;
    filter_by_sub_minor_cate_id: boolean;
    sub_minor_cate_id: string;
    filter_by_app_scope: boolean;
    app_scope: APP_SCOPE;
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

export type ProjectInstallInfo = {
    project_id: string;
    project_name: string;
    has_install: boolean;
    can_install: boolean;
};

export type InstallInfo = {
    user_install: boolean;
    project_list: ProjectInstallInfo[];
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
    offset: number;
    limit: number;
};

export type ListAppResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    app_info_list: AppInfo[];
};


export type GetAppRequest = {
    app_id: string;
};

export type GetAppResponse = {
    code: number;
    err_msg: string;
    app_info: AppInfo;
};

export type GetInstallInfoRequest = {
    session_id: string;
    app_id: string;
};

export type GetInstallInfoResponse = {
    code: number;
    err_msg: string;
    install_info: InstallInfo;
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

//获取应用的安装情况
export async function get_install_info(request: GetInstallInfoRequest): Promise<GetInstallInfoResponse> {
    const cmd = 'plugin:appstore_api|get_install_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetInstallInfoResponse>(cmd, {
        request,
    });
}