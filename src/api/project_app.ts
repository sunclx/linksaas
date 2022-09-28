import { invoke } from '@tauri-apps/api/tauri';

export type APP_OPEN_TYPE = number;

export const OPEN_TYPE_BROWSER: APP_OPEN_TYPE = 0;
export const OPEN_TYPE_INNER: APP_OPEN_TYPE = 1;

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

export type ListRequest = {
    session_id: string;
    project_id: string;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    app_list: App[];
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

//列出应用
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:project_app_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
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