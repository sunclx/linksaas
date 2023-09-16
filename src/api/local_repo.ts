import { invoke } from '@tauri-apps/api/tauri';
import { Command } from '@tauri-apps/api/shell';

export type LocalRepoInfo = {
    id: string;
    name: string;
    path: string;
};

export type LocalRepoPathStatusInfo = {
    path: string;
    status: string;
};

export type LocalRepoStatusInfo = {
    head: string;
    path_list: LocalRepoPathStatusInfo[];
};

export type LocalRepoBranchInfo = {
    name: string;
    upstream: string;
    commit_id: string;
    commit_summary: string;
    commit_time: number;
}

export type LocalRepoTagInfo = {
    name: string;
    commit_id: string;
    commit_summary: string;
    commit_time: number;
}

export type LocalRepoCommitInfo = {
    id: string;
    summary: string;
    time_stamp: number;
    commiter: string;
    email: string;
};

export type LocalRepoFileDiffInfo = {
    old_file_name: string;
    old_content: string;
    new_file_name: string;
    new_content: string;
};

export type LocalRepoAnalyseCommitInfo = {
    commit_id: string;
    summary: string;
    add_count: number;
    del_count: number;
};

export type LocalRepoStatItem = {
    commit_count: number;
    total_add_count: number;
    total_del_count: number;
    min_commit: LocalRepoAnalyseCommitInfo;
    max_commit: LocalRepoAnalyseCommitInfo;
};

export type LocalRepoDayStatItem = {
    day_str: string;
    commit_count: number;
    add_count: number;
    del_count: number;
};

export type LocalRepoCommiterStatItem = {
    commiter: string;
    stat: LocalRepoStatItem,
    day_stat_list: LocalRepoDayStatItem[];
};

export type LocalRepoAnalyseInfo = {
    global_stat: LocalRepoStatItem;
    effect_add_count: number;
    effect_del_count: number;
    commiter_stat_list: LocalRepoCommiterStatItem[];
    last_time: number;
}

export type LocalRepoRemoteInfo = {
    name: string;
    url: string;
};

export async function add_repo(id: string, name: string, path: string): Promise<void> {
    return invoke<void>("plugin:local_repo|add_repo", {
        id,
        name,
        path
    });
}

export async function update_repo(id: string, name: string, path: string): Promise<void> {
    return invoke<void>("plugin:local_repo|update_repo", {
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

export async function list_repo(): Promise<LocalRepoInfo[]> {
    return invoke<LocalRepoInfo[]>("plugin:local_repo|list_repo", {});
}

export async function get_repo_status(path: string): Promise<LocalRepoStatusInfo> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "status"]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export async function list_repo_branch(path: string): Promise<LocalRepoBranchInfo[]> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "list-branch"]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    const retList = JSON.parse(result.stdout) as LocalRepoBranchInfo[];
    retList.sort((a, b) => b.commit_time - a.commit_time);
    return retList;
}

export async function list_repo_tag(path: string): Promise<LocalRepoTagInfo[]> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "list-tag"]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    const retList = JSON.parse(result.stdout) as LocalRepoTagInfo[];
    retList.sort((a, b) => b.commit_time - a.commit_time);
    return retList;
}

export async function list_repo_commit(path: string, branch: string): Promise<LocalRepoCommitInfo[]> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "list-commit", branch]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export async function get_commit_change(path: string, commitId: string): Promise<LocalRepoFileDiffInfo[]> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "get-change", commitId]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export async function analyse(path: string, branch: string, fromTime: number, toTime: number): Promise<LocalRepoAnalyseInfo> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "analyse", branch, (fromTime / 1000).toFixed(0), (toTime / 1000).toFixed(0)]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export async function list_remote(path: string): Promise<LocalRepoRemoteInfo[]> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "list-remote"]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export function get_http_url(url: string): string {
    if (url.startsWith("http")) {
        if (url.endsWith(".git")) {
            return url.substring(0, url.length - 4);
        } else {
            return url;
        }
    } else if (url.includes("@") && url.includes(":")) {
        const pos1 = url.indexOf("@");
        const pos2 = url.indexOf(":")
        const host = url.substring(pos1 + 1, pos2);
        let uri = url.substring(pos2 + 1);
        if (uri.endsWith(".git")) {
            uri = uri.substring(0, uri.length - 4);
        }
        return `https://${host}/${uri}`;
    }
    return url;
}