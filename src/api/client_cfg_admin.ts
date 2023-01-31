import { invoke } from '@tauri-apps/api/tauri';
import type { ExtraMenuItem, AdItem } from "./client_cfg";

export type AdminListExtraMenuRequest = {
    admin_session_id: string;
};

export type AdminListExtraMenuResponse = {
    code: number;
    err_msg: string;
    menu_list: ExtraMenuItem[];
};

export type AdminSetExtraMenuWeightRequest = {
    admin_session_id: string;
    menu_id: string;
    weight: number;
};

export type AdminSetExtraMenuWeightResponse = {
    code: number;
    err_msg: string;
};

export type AdminAddExtraMenuRequest = {
    admin_session_id: string;
    name: string;
    url: string;
    weight: number;
};

export type AdminAddExtraMenuResponse = {
    code: number;
    err_msg: string;
    menu_id: string;
};

export type AdminRemoveExtraMenuRequest = {
    admin_session_id: string;
    menu_id: string;
};

export type AdminRemoveExtraMenuResponse = {
    code: number;
    err_msg: string;
};

export type AdminListAdRequest = {
    admin_session_id: string;
};

export type AdminListAdResponse = {
    code: number;
    err_msg: string;
    ad_list: AdItem[];
};

export type AdminSetAdWeightRequest = {
    admin_session_id: string;
    ad_id: string;
    weight: number;
};

export type AdminSetAdWeightResponse = {
    code: number;
    err_msg: string;
};

export type AdminAddAdRequest = {
    admin_session_id: string;
    url: string;
    img_url: string;
    weight: number;
};

export type AdminAddAdResponse = {
    code: number;
    err_msg: string;
    ad_id: string;
};

export type AdminRemoveAdRequest = {
    admin_session_id: string;
    ad_id: string;
};

export type AdminRemoveAdResponse = {
    code: number;
    err_msg: string;
};

//列出额外菜单
export async function list_extra_menu(request: AdminListExtraMenuRequest): Promise<AdminListExtraMenuResponse> {
    const cmd = 'plugin:client_cfg_admin_api|list_extra_menu';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListExtraMenuResponse>(cmd, {
        request,
    });
}

//设置菜单权重
export async function set_extra_menu_weight(request: AdminSetExtraMenuWeightRequest): Promise<AdminSetExtraMenuWeightResponse> {
    const cmd = 'plugin:client_cfg_admin_api|set_extra_menu_weight';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminSetExtraMenuWeightResponse>(cmd, {
        request,
    });
}

//增加额外菜单
export async function add_extra_menu(request: AdminAddExtraMenuRequest): Promise<AdminAddExtraMenuResponse> {
    const cmd = 'plugin:client_cfg_admin_api|add_extra_menu';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddExtraMenuResponse>(cmd, {
        request,
    });
}

//删除额外菜单
export async function remove_extra_menu(request: AdminRemoveExtraMenuRequest): Promise<AdminRemoveExtraMenuResponse> {
    const cmd = 'plugin:client_cfg_admin_api|remove_extra_menu';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveExtraMenuResponse>(cmd, {
        request,
    });
}

//列出广告
export async function list_ad(request: AdminListAdRequest): Promise<AdminListAdResponse> {
    const cmd = 'plugin:client_cfg_admin_api|list_ad';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListAdResponse>(cmd, {
        request,
    });
}

//设置广告权重
export async function set_ad_weight(request: AdminSetAdWeightRequest): Promise<AdminSetAdWeightResponse> {
    const cmd = 'plugin:client_cfg_admin_api|set_ad_weight';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminSetAdWeightResponse>(cmd, {
        request,
    });
}

//增加广告
export async function add_ad(request: AdminAddAdRequest): Promise<AdminAddAdResponse> {
    const cmd = 'plugin:client_cfg_admin_api|add_ad';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddAdResponse>(cmd, {
        request,
    });
}

//删除广告
export async function remove_ad(request: AdminRemoveAdRequest): Promise<AdminRemoveAdResponse> {
    const cmd = 'plugin:client_cfg_admin_api|remove_ad';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveAdResponse>(cmd, {
        request,
    });
}