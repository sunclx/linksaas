import { invoke } from '@tauri-apps/api/tauri';

export type AdminAddSiteCateRequest = {
    admin_session_id: string;
    cate_name: string;
    order_index: number;
};


export type AdminAddSiteCateResponse = {
    code: number;
    err_msg: string;
    cate_id: string;
};

export type AdminUpdateSiteCateRequest = {
    admin_session_id: string;
    cate_id: string;
    cate_name: string;
    order_index: number;
};

export type AdminUpdateSiteCateResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemoveSiteCateRequest = {
    admin_session_id: string;
    cate_id: string;
}

export type AdminRemoveSiteCateResponse = {
    code: number;
    err_msg: string;
};


export type AdminAddSiteRequest = {
    admin_session_id: string;
    site_name: string;
    icon_file_id: string;
    search_tpl: string;
    cate_id: string;
    default_site: boolean;
    use_browser: boolean;
};

export type AdminAddSiteResponse = {
    code: number;
    err_msg: string;
    site_id: string;
};


export type AdminUpdateSiteRequest = {
    admin_session_id: string;
    site_id: string;
    site_name: string;
    icon_file_id: string;
    search_tpl: string;
    cate_id: string;
    default_site: boolean;
    use_browser: boolean;
};

export type AdminUpdateSiteResponse = {
    code: number;
    err_msg: string;
};


export type AdminRemoveSiteRequest = {
    admin_session_id: string;
    site_id: string;
};

export type AdminRemoveSiteResponse = {
    code: number;
    err_msg: string;
}

//增加站点类别
export async function add_site_cate(
    request: AdminAddSiteCateRequest,
): Promise<AdminAddSiteCateResponse> {
    const cmd = 'plugin:pub_search_admin_api|add_site_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddSiteCateResponse>(cmd, {
        request,
    });
}

//更新站点类别
export async function update_site_cate(
    request: AdminUpdateSiteCateRequest,
): Promise<AdminUpdateSiteCateResponse> {
    const cmd = 'plugin:pub_search_admin_api|update_site_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateSiteCateResponse>(cmd, {
        request,
    });
}

//删除站点类别
export async function remove_site_cate(
    request: AdminRemoveSiteCateRequest,
): Promise<AdminRemoveSiteCateResponse> {
    const cmd = 'plugin:pub_search_admin_api|remove_site_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveSiteCateResponse>(cmd, {
        request,
    });
}

//增加站点
export async function add_site(
    request: AdminAddSiteRequest,
): Promise<AdminAddSiteResponse> {
    const cmd = 'plugin:pub_search_admin_api|add_site';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddSiteResponse>(cmd, {
        request,
    });
}

//更新站点
export async function update_site(
    request: AdminUpdateSiteRequest,
): Promise<AdminUpdateSiteResponse> {
    const cmd = 'plugin:pub_search_admin_api|update_site';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateSiteResponse>(cmd, {
        request,
    });
}

//删除站点
export async function remove_site(
    request: AdminRemoveSiteRequest,
): Promise<AdminRemoveSiteResponse> {
    const cmd = 'plugin:pub_search_admin_api|remove_site';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveSiteResponse>(cmd, {
        request,
    });
}