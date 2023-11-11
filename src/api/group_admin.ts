import { invoke } from '@tauri-apps/api/tauri';
import type { GroupInfo } from './group';

export type AdminListRequest = {
    admin_session_id: string;
    filter_pub: boolean;
    filter_by_keyword: boolean;
    keyword: string;
    offset: number;
    limit: number;
};

export type AdminListResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    group_list: GroupInfo[];
};


export type AdminUpdatePubRequest = {
    admin_session_id: string;
    group_id: string;
    pub_group: boolean;
};

export type AdminUpdatePubResponse = {
    code: number;
    err_msg: string;
};

//列出兴趣组
export async function list(request: AdminListRequest): Promise<AdminListResponse> {
    const cmd = 'plugin:group_admin_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListResponse>(cmd, {
        request,
    });
}

//更新兴趣组
export async function update_pub(request: AdminUpdatePubRequest): Promise<AdminUpdatePubResponse> {
    const cmd = 'plugin:group_admin_api|update_pub';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdatePubResponse>(cmd, {
        request,
    });
}