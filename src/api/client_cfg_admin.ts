import { invoke } from '@tauri-apps/api/tauri';
import type { ExtraMenuItem } from "./client_cfg";

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