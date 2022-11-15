import { invoke } from '@tauri-apps/api/tauri';

//移除端口信息文件
export async function remove_info_file(): Promise<void> {
    const cmd = 'plugin:local_api|remove_info_file';
    return invoke<void>(cmd, {});
}

//获取端口
export async function get_port(): Promise<number> {
    const cmd = 'plugin:local_api|get_port';
    return invoke<number>(cmd, {});
}

