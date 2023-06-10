import { invoke } from '@tauri-apps/api/tauri';


export type ProjectLinkInfo = {
    yaml_content: string;
    post_commit_hook: boolean;
};
//读取git hooks
export async function get_git_hook(git_path: string): Promise<ProjectLinkInfo> {
    const request = {
        gitPath: git_path,
    }
    const cmd = 'plugin:project_tool_api|get_git_hook';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ProjectLinkInfo>(cmd, request);
}

//设置git hooks
export async function set_git_hook(
    git_path: string,
    project_id: string,
    post_commit_hook: boolean,
): Promise<void> {
    const request = {
        gitPath: git_path,
        projectId: project_id,
        postCommitHook: post_commit_hook,
    };
    const cmd = 'plugin:project_tool_api|set_git_hook';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, request);
}