import { invoke } from '@tauri-apps/api/tauri';
import type { MinAppPerm } from '@/api/project_app';

export type StartRequest = {
    project_id: string;
    project_name: string;
    member_user_id: string;
    member_display_name: string;
    token_url: string;
    label: string;
    title: string;
    path: string;
};

//启动微应用
export async function start(request: StartRequest, perm: MinAppPerm): Promise<void> {
    return invoke<void>("plugin:min_app|start", {
        request,
        perm,
    });
}

//调试微应用
export async function start_debug(request: StartRequest, perm: MinAppPerm): Promise<void> {
    return invoke<void>("plugin:min_app|start_debug", {
        request,
        perm,
    });
}