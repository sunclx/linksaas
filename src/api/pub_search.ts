import { invoke } from '@tauri-apps/api/tauri';

export type SiteCate = {
    cate_id: string;
    cate_name: string;
    order_index: number;
    site_count: number;
};

export type Site = {
    site_id: string;
    site_name: string;
    icon_file_id: string;
    search_tpl: string;
    cate_id: string;
    cate_name: string;
    default_site: boolean;
};

export type ListSiteCateRequest = {};

export type ListSiteCateResponse = {
    code: number;
    err_msg: string;
    cate_list: SiteCate[];
};

export type ListSiteRequest = {
    filter_by_cate_id: boolean;
    cate_id: string;
};

export type ListSiteResponse = {
    code: number;
    err_msg: string;
    site_list: Site[];
};


export type GetSiteRequest = {
    site_id: string;
};

export type GetSiteResponse = {
    code: number;
    err_msg: string;
    site: Site;
};


export type ListMySiteRequest = {
    session_id: string;
};

export type ListMySiteResponse = {
    code: number;
    err_msg: string;
    site_list: Site[];
};


export type SetMySiteRequest = {
    session_id: string;
    site_id_list: string[];
};

export type SetMySiteResponse = {
    code: number;
    err_msg: string;
};

export type AddSearchHistoryRequest = {
    session_id: string;
    search_str: string;
};

export type AddSearchHistoryResponse = {
    code: number;
    err_msg: string;
};

export type GetSearchHistoryRequest = {
    session_id: string;
};

export type GetSearchHistoryResponse = {
    code: number;
    err_msg: string;
    search_str_list: string[];
};

//列出站点类别
export async function list_site_cate(
    request: ListSiteCateRequest,
): Promise<ListSiteCateResponse> {
    const cmd = 'plugin:pub_search_api|list_site_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListSiteCateResponse>(cmd, {
        request,
    });
}

//列出站点
export async function list_site(
    request: ListSiteRequest,
): Promise<ListSiteResponse> {
    const cmd = 'plugin:pub_search_api|list_site';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListSiteResponse>(cmd, {
        request,
    });
}

//获取单个站点
export async function get_site(
    request: GetSiteRequest,
): Promise<GetSiteResponse> {
    const cmd = 'plugin:pub_search_api|get_site';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetSiteResponse>(cmd, {
        request,
    });
}

//获取我的站点
export async function list_my_site(
    request: ListMySiteRequest,
): Promise<ListMySiteResponse> {
    const cmd = 'plugin:pub_search_api|list_my_site';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMySiteResponse>(cmd, {
        request,
    });
}

//设置我的站点
export async function set_my_site(
    request: SetMySiteRequest,
): Promise<SetMySiteResponse> {
    const cmd = 'plugin:pub_search_api|set_my_site';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetMySiteResponse>(cmd, {
        request,
    });
}

//增加搜索历史
export async function add_search_history(
    request: AddSearchHistoryRequest,
): Promise<AddSearchHistoryResponse> {
    const cmd = 'plugin:pub_search_api|add_search_history';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddSearchHistoryResponse>(cmd, {
        request,
    });
}

//获取搜索历史
export async function get_search_history(
    request: GetSearchHistoryRequest,
): Promise<GetSearchHistoryResponse> {
    const cmd = 'plugin:pub_search_api|get_search_history';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetSearchHistoryResponse>(cmd, {
        request,
    });
}