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

//打包目录
export async function pack_min_app(path: string, trace: string): Promise<string> {
    return invoke<string>("plugin:min_app|pack_min_app", {
        path,
        trace,
    });
}

//检查是否已经解包
export async function check_unpark(fs_id: string, file_id: string): Promise<boolean> {
    return invoke<boolean>("plugin:min_app|check_unpark", {
        fsId: fs_id,
        fileId: file_id,
    });
}

//获取解包路径
export async function get_min_app_path(fs_id: string, file_id: string): Promise<string> {
    return invoke<string>("plugin:min_app|get_min_app_path", {
        fsId: fs_id,
        fileId: file_id,
    });
}

//解zip包
export async function unpack_min_app(fs_id: string, file_id: string, trace: string): Promise<void> {
    return invoke<void>("plugin:min_app|unpack_min_app", {
        fsId: fs_id,
        fileId: file_id,
        trace,
    });
}