import { invoke } from '@tauri-apps/api/tauri';

export type FsRestrict = {
    fs_id: string;
    has_ttl: boolean;
    ttl: number;
    max_file_size: number;
    total_size: number;
    has_restrict: boolean;
};


export type ProjectRestrict = {
    project_id: string;
    max_open_channel: number;
    max_member_count: number;
    max_doc_space_count: number;
    max_doc_count: number;
    has_restrict: boolean;
};


export type GetProjectRestrictRequest = {
    session_id: string;
    project_id: string;
};


export type GetProjectRestrictResponse = {
    code: number;
    err_msg: string;
    project_restrict: ProjectRestrict;
    project_fs_restrict: FsRestrict;
    channel_fs_restrict: FsRestrict;
    issue_fs_restrict: FsRestrict;
    doc_fs_restrict: FsRestrict;
};

export async function get_project_restrict(request: GetProjectRestrictRequest): Promise<GetProjectRestrictResponse> {
    const cmd = 'plugin:restrict_api|get_project_restrict';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetProjectRestrictResponse>(cmd, {
        request,
    });
}