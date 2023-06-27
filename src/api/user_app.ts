import { invoke } from '@tauri-apps/api/tauri';

export type BasicApp = {
    app_name: string;
    icon_file_id: string;
    app_id_in_store: string;
};

export type App = {
    app_id: string;
    basic_info: BasicApp;
    create_time: number;
};

export type UserAppNetPerm = {
    cross_domain_http: boolean;
    proxy_redis: boolean;
    proxy_mysql: boolean;
    proxy_mongo: boolean;
    proxy_ssh: boolean;
};

export type UserAppFsPerm = {
    read_file: boolean;
    write_file: boolean;
};

export type UserAppExtraPerm = {
    cross_origin_isolated: boolean;
    open_browser: boolean;
};


export type UserAppPerm = {
    net_perm: UserAppNetPerm;
    fs_perm: UserAppFsPerm;
    extra_perm: UserAppExtraPerm;
};

export type ListRequest = {
    session_id: string;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    app_list: App[];
};

export type QueryInStoreRequest = {
    session_id: string;
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
    app_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};


export type SetUserAppPermRequest = {
    session_id: string;
    app_id: string;
    perm: UserAppPerm;
};

export type SetUserAppPermResponse = {
    code: number;
    err_msg: string;
};


export type GetUserAppPermRequest = {
    session_id: string;
    app_id: string;
};

export type GetUserAppPermResponse = {
    code: number;
    err_msg: string;
    perm: UserAppPerm;
};

//列出应用
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:user_app_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request: request,
    });
}

//根据应用市场ID查询应用ID
export async function query_in_store(request: QueryInStoreRequest): Promise<QueryInStoreResponse> {
    const cmd = 'plugin:user_app_api|query_in_store';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<QueryInStoreResponse>(cmd, {
        request: request,
    });
}

//增加应用
export async function add(request: AddRequest): Promise<AddResponse> {
    const cmd = 'plugin:user_app_api|add';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddResponse>(cmd, {
        request: request,
    });
}

//删除应用
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:user_app_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request: request,
    });
}

//设置权限
export async function set_user_app_perm(request: SetUserAppPermRequest): Promise<SetUserAppPermResponse> {
    const cmd = 'plugin:user_app_api|set_user_app_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetUserAppPermResponse>(cmd, {
        request: request,
    });
}

//读取权限
export async function get_user_app_perm(request: GetUserAppPermRequest): Promise<GetUserAppPermResponse> {
    const cmd = 'plugin:user_app_api|get_user_app_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetUserAppPermResponse>(cmd, {
        request: request,
    });
}