import { invoke } from '@tauri-apps/api/tauri';

export type LocalRepoInfo = {
    id: string;
    name: string;
    path: string;
};

export async function add_repo(id: string, name: string, path: string): Promise<void> {
    return invoke<void>("plugin:local_repo|add_repo", {
        id,
        name,
        path
    });
}

export async function remove_repo(id: string): Promise<void> {
    return invoke<void>("plugin:local_repo|remove_repo", {
        id,
    });
}

export async function list_repo(): Promise<LocalRepoInfo> {
    return invoke<LocalRepoInfo>("plugin:local_repo|list_repo", {});
}