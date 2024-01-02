import { invoke } from '@tauri-apps/api/tauri';
import { Command } from '@tauri-apps/api/shell';
import { message } from 'antd';

export type LocalRepoSettingInfo = {
    gitlab_protocol: string;
    gitlab_token: string;
    github_token: string;
    gitee_token: string;
    atomgit_token: string;
    gitcode_token: string;
};

export type LocalRepoInfo = {
    id: string;
    name: string;
    path: string;
    //本地仓库相关设置
    setting: LocalRepoSettingInfo | null;
};

export type LocalRepoPathStatusInfo = {
    path: string;
    status: string[];
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

export type LocalRepoStashInfo = {
    commit_id: string;
    commit_summary: string;
};

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
    delta_type: string;
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

export type CloneProgressInfo = {
    totalObjs: number;
    recvObjs: number;
    indexObjs: number;
};

//git pro相关属性

export type HeadInfo = {
    commit_id: string;
    branch_name: string;
};

export type BranchInfo = {
    name: string;
    upstream: string;
    commit_id: string;
}

export type TagInfo = {
    name: string;
    commit_id: string;
}

export type RemoteInfo = {
    name: string;
    url: string;
}

export type GitInfo = {
    head: HeadInfo,
    branch_list: BranchInfo[];
    tag_list: TagInfo[];
    remote_list: RemoteInfo[];
};

export type GitUserInfo = {
    name: string;
    email: string;
    timestamp: number;
};

export type CommitGraphInfo = {
    refs: string[];
    hash: string;
    hash_abbrev: string;
    tree: string;
    tree_abbrev: string;
    parents: string[];
    parents_abbrev: string[];
    author: GitUserInfo,
    committer: GitUserInfo,
    subject: string;
    body: string;
    notes: string;
    stats: unknown; //特殊处理，不计算，太消耗计算时间
};

export async function add_repo(id: string, name: string, path: string): Promise<void> {
    return invoke<void>("plugin:local_repo|add_repo", {
        id,
        name,
        path
    });
}

export async function update_repo(id: string, name: string, path: string, setting: LocalRepoSettingInfo): Promise<void> {
    return invoke<void>("plugin:local_repo|update_repo", {
        id,
        name,
        path,
        setting,
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

export async function list_stash(path: string): Promise<LocalRepoStashInfo[]> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "list-stash"]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export async function apply_stash(path: string, commitId: string): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "apply-stash", commitId]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
}

export async function drop_stash(path: string, commitId: string): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "drop-stash", commitId]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
}

export async function save_stash(path: string, msg: string): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "save-stash", msg]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
}

export async function checkout_branch(path: string, branch: string): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "checkout-branch", branch]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
}

export async function create_branch(path: string, srcBranch: string, destBranch: string): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "create-branch", srcBranch, destBranch]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
}

export async function remove_branch(path: string, branch: string): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "remove-branch", branch]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
}


export async function clone(path: string, url: string, authType: string, username: string, password: string, privKey: string, callback: (info: CloneProgressInfo) => void): Promise<void> {
    const args = ["--git-path", path, "clone", "--auth-type", authType];
    if (authType == "privkey") {
        args.push(...["--priv-key", privKey]);
    } else if (authType == "password") {
        args.push(...["--username", username, "--password", password]);
    }
    args.push(url);
    const command = Command.sidecar('bin/gitspy', args);
    command.stdout.on("data", (line: string) => {
        const parts = line.split(":");
        if (parts.length == 3) {
            callback({
                totalObjs: Math.max(parseInt(parts[0]), 1),
                recvObjs: parseInt(parts[1]),
                indexObjs: parseInt(parts[2]),
            });
        }
    });
    command.stderr.on("data", line => message.error(line));
    await command.spawn();
}

export async function get_git_info(path: string): Promise<GitInfo> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "info"]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export async function list_commit_graph(path: string, commitId: string): Promise<CommitGraphInfo[]> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "commit-graph", commitId]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return JSON.parse(result.stdout);
}

export async function add_to_index(path: string, filePathList: string[]): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "add-to-index", ...filePathList]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return;
}

export async function remove_from_index(path: string, filePathList: string[]): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "remove-from-index", ...filePathList]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return;
}

export async function run_commit(path: string, msg: string): Promise<void> {
    const command = Command.sidecar('bin/gitspy', ["--git-path", path, "commit", msg]);
    const result = await command.execute();
    if (result.code != 0) {
        throw new Error(result.stderr);
    }
    return;
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

export function get_host(url: string): string {
    const l = new URL(get_http_url(url));
    return l.host
}