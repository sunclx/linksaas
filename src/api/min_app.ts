import { invoke } from '@tauri-apps/api/tauri';

export async function start(label: string, title: string, path: string): Promise<void> {
    return invoke<void>("plugin:min_app|start", {
        label,
        title,
        path,
    });
}