import { invoke } from '@tauri-apps/api/tauri';

//列出应用
export async function list(): Promise<string[]> {
    const cmd = 'plugin:user_app_api|list';
    return invoke<string[]>(cmd, {});
}

//增加应用
export async function add(appId: string): Promise<void> {
    const cmd = 'plugin:user_app_api|add';
    return invoke<void>(cmd, { appId: appId });
}

//删除应用
export async function remove(appId: string): Promise<void> {
    const cmd = 'plugin:user_app_api|remove';
    return invoke<void>(cmd, { appId: appId });
}