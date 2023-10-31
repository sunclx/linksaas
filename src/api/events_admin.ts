import { invoke } from '@tauri-apps/api/tauri';
import type { PluginEvent } from './events';

export type AdminListProjectEvRequest = {
    admin_session_id: string;
    project_id: string;
    filter_by_time: boolean;
    from_time: number;
    to_time: number;
    filter_by_member_user_id: boolean;
    member_user_id: string;
    offset: number;
    limit: number;
};

export type PluginListEvResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    event_list: PluginEvent[];
};

//列出项目维度事件
export async function list_project_ev(
    request: AdminListProjectEvRequest,
): Promise<PluginListEvResponse> {
    const cmd = 'plugin:events_admin_api|list_project_ev';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<PluginListEvResponse>(cmd, {
        request,
    });
}