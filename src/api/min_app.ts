import { invoke } from '@tauri-apps/api/tauri';

export async function start(label: string, title: string, project_id: string, path: string): Promise<void> {
    return invoke<void>("plugin:min_app|start", {
        label,
        title,
        path,
        projectId: project_id,
    });
}