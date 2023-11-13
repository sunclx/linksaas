import { invoke } from '@tauri-apps/api/tauri';
import type { POST_AUDIT_STATE, PostKeyInfo } from './group_post';

export type AdminListAuditRequest = {
    admin_session_id: string;
    audit_state: POST_AUDIT_STATE;
    offset: number;
    limit: number;
};

export type AdminListAuditResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    post_key_list: PostKeyInfo[];
};

export type AdminAgreeRecommendRequest = {
    admin_session_id: string;
    group_id: string;
    post_id: string;
};

export type AdminAgreeRecommendResponse = {
    code: number;
    err_msg: string;
};

export type AdminRefuseRecommendRequest = {
    admin_session_id: string;
    group_id: string;
    post_id: string;
};

export type AdminRefuseRecommendResponse = {
    code: number;
    err_msg: string;
};

//列出审计记录
export async function list_audit(request: AdminListAuditRequest): Promise<AdminListAuditResponse> {
    const cmd = 'plugin:group_post_admin_api|list_audit';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListAuditResponse>(cmd, {
        request,
    });
}

//同意进入推荐
export async function agree_recommend(request: AdminAgreeRecommendRequest): Promise<AdminAgreeRecommendResponse> {
    const cmd = 'plugin:group_post_admin_api|agree_recommend';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAgreeRecommendResponse>(cmd, {
        request,
    });
}

//拒绝进入推荐
export async function refuse_recommend(request: AdminRefuseRecommendRequest): Promise<AdminRefuseRecommendResponse> {
    const cmd = 'plugin:group_post_admin_api|refuse_recommend';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRefuseRecommendResponse>(cmd, {
        request,
    });
}