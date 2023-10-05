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

export type ListRequest = {
    session_id: string;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    app_list: App[];
};

export type GetRequest = {
    session_id: string;
    app_id: string;
};

export type GetResponse = {
    code: number;
    err_msg: string;
    app: App;
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

//列出应用
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:user_app_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request: request,
    });
}

//获取单个应用
export async function get(request: GetRequest): Promise<GetResponse> {
    const cmd = 'plugin:user_app_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResponse>(cmd, {
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