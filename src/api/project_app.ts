import { invoke } from '@tauri-apps/api/tauri';

export type APP_OPEN_TYPE = number;

export const OPEN_TYPE_BROWSER: APP_OPEN_TYPE = 0;
export const OPEN_TYPE_MIN_APP: APP_OPEN_TYPE = 1;
export const OPEN_TYPE_MIN_APP_IN_STORE: APP_OPEN_TYPE = 2;


export type BasicApp = {
    project_id: string;
    app_name: string;
    app_icon_url: string;
    app_url: string;
    app_open_type: APP_OPEN_TYPE;
};

export type App = {
    app_id: string;
    basic_info: BasicApp,
    create_time: number;
    create_user_id: string;
};

export type MinAppNetPerm = {
    cross_domain_http: boolean;
    proxy_redis: boolean;
    proxy_mysql: boolean;
    proxy_post_gres: boolean;
    proxy_mongo: boolean;
    proxy_ssh: boolean;
    net_util: boolean;
};

export type MinAppMemberPerm = {
    list_member: boolean;
    list_goal_history: boolean;
};

export type MinAppIssuePerm = {
    list_my_task: boolean;
    list_all_task: boolean;
    list_my_bug: boolean;
    list_all_bug: boolean;
};

export type MinAppEventPerm = {
    list_my_event: boolean;
    list_all_event: boolean;
};

export type MinAppFsPerm = {
    read_file: boolean;
    write_file: boolean;
};

export type MinAppExtraPerm = {
    cross_origin_isolated: boolean;
    open_browser: boolean;
};


export type MinAppPerm = {
    net_perm: MinAppNetPerm;
    member_perm: MinAppMemberPerm;
    issue_perm: MinAppIssuePerm;
    event_perm: MinAppEventPerm;
    fs_perm: MinAppFsPerm;
    extra_perm: MinAppExtraPerm;
};

export type ListRequest = {
    session_id: string;
    project_id: string;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    app_list: App[];
};

export type QueryInStoreRequest = {
    session_id: string;
    project_id: string;
    app_id_in_store: string;
};

export type QueryInStoreResponse = {
    code: number;
    err_msg: string;
    app_id_list: string[];
};

export type AddRequest = {
    session_id: string;
    basic_info: BasicApp;
};

export type AddResponse = {
    code: number;
    err_msg: string;
    app_id: string;
};

export type RemoveRequest = {
    session_id: string;
    project_id: string;
    app_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};

export type GetTokenUrlRequest = {
    session_id: string;
    project_id: string;
    app_id: string;
};

export type GetTokenUrlResponse = {
    code: number;
    err_msg: string;
    url: string;
};

export type SetMinAppPermRequest = {
    session_id: string;
    project_id: string;
    app_id: string;
    perm: MinAppPerm;
};

export type SetMinAppPermResponse = {
    code: number;
    err_msg: string;
};

export type GetMinAppPermRequest = {
    session_id: string;
    project_id: string;
    app_id: string;
};

export type GetMinAppPermResponse = {
    code: number;
    err_msg: string;
    perm: MinAppPerm;
};

//列出应用
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:project_app_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request,
    });
}

//通过应用市场ID查询应用ID
export async function query_in_store(request: QueryInStoreRequest): Promise<QueryInStoreResponse> {
    const cmd = 'plugin:project_app_api|query_in_store';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<QueryInStoreResponse>(cmd, {
        request,
    });
}

//增加应用
export async function add(request: AddRequest): Promise<AddResponse> {
    const cmd = 'plugin:project_app_api|add';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddResponse>(cmd, {
        request,
    });
}

//删除应用
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:project_app_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}

//获取应用token
export async function get_token_url(request: GetTokenUrlRequest): Promise<GetTokenUrlResponse> {
    const cmd = 'plugin:project_app_api|get_token_url';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetTokenUrlResponse>(cmd, {
        request,
    });
}

//设置权限
export async function set_min_app_perm(request: SetMinAppPermRequest): Promise<SetMinAppPermResponse> {
    const cmd = 'plugin:project_app_api|set_min_app_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetMinAppPermResponse>(cmd, {
        request,
    });
}

//读取权限
export async function get_min_app_perm(request: GetMinAppPermRequest): Promise<GetMinAppPermResponse> {
    const cmd = 'plugin:project_app_api|get_min_app_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetMinAppPermResponse>(cmd, {
        request,
    });
}