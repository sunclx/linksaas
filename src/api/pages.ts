import { invoke } from '@tauri-apps/api/tauri';

//启动pages
export async function start(label: string, title: string, path: string): Promise<void> {
    const cmd = 'plugin:pages|start';
    const request = {
        label, title, path,
    }
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, request);
}