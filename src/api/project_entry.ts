import { invoke } from '@tauri-apps/api/tauri';

export type ENTRY_TYPE = number;
export const ENTRY_TYPE_SPRIT: ENTRY_TYPE = 0;
export const ENTRY_TYPE_DOC: ENTRY_TYPE = 1;
export const ENTRY_TYPE_PAGES: ENTRY_TYPE = 2;
export const ENTRY_TYPE_BOARD: ENTRY_TYPE = 3;
export const ENTRY_TYPE_FILE: ENTRY_TYPE = 4;
export const ENTRY_TYPE_NULL: ENTRY_TYPE = 999;

export type ISSUE_LIST_TYPE = number;
export const ISSUE_LIST_ALL: ISSUE_LIST_TYPE = 0;
export const ISSUE_LIST_LIST: ISSUE_LIST_TYPE = 1;
export const ISSUE_LIST_KANBAN: ISSUE_LIST_TYPE = 2;

export type EntryTag = {
    tag_id: string;
    tag_name: string;
    bg_color: string;
};

export type EntryPerm = {
    update_for_all: boolean;
    extra_update_user_id_list: string[];
};

export type ExtraSpritInfo = {
    start_time: number;
    end_time: number;
    non_work_day_list: number[];
    issue_list_type: ISSUE_LIST_TYPE;
    hide_gantt_panel: boolean;
    hide_burndown_panel: boolean;
    hide_stat_panel: boolean;
    hide_summary_panel: boolean;
};

export type ExtraPagesInfo = {
    file_id: string;
};

export type ExtraFileInfo = {
    file_id: string;
    file_name: string;
};


export type ExtraInfo = {
    ExtraSpritInfo?: ExtraSpritInfo;
    ExtraPagesInfo?: ExtraPagesInfo;
    ExtraFileInfo?: ExtraFileInfo;
};

export type WatchUser = {
    member_user_id: string;
    display_name: string;
    logo_uri: string;
};

export type EntryInfo = {
    entry_id: string;
    entry_type: ENTRY_TYPE;
    entry_title: string;
    my_watch: boolean;
    watch_user_list: WatchUser[];
    tag_list: EntryTag[];
    entry_perm: EntryPerm;
    mark_remove: boolean;
    mark_sys: boolean;
    parent_folder_id: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
    can_update: boolean;
    extra_info: ExtraInfo;
};

export type ListParam = {
    filter_by_watch: boolean;
    filter_by_tag_id: boolean;
    tag_id_list: string[];
    filter_by_keyword: boolean;
    keyword: string;
    filter_by_mark_remove: boolean;
    mark_remove: boolean;
    filter_by_entry_type: boolean;
    entry_type_list: ENTRY_TYPE[];
};

export type FolderInfo = {
    folder_id: string;
    folder_title: string;
    parent_folder_id: string;
    sub_entry_count: number;
    sub_folder_count: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
    can_update: boolean;
    can_remove: boolean;
};

export type EntryOrFolderInfo = {
    id: string;
    is_folder: boolean;
    value: EntryInfo | FolderInfo;
};

export type FolderPathItem = {
    folder_id: string;
    folder_title: string;
    parent_folder_id: string;
};

export type CreateRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    entry_type: ENTRY_TYPE;
    entry_title: string;
    tag_id_list: string[];
    entry_perm: EntryPerm;
    parent_folder_id: string;
    extra_info?: ExtraInfo;
};

export type CreateResponse = {
    code: number;
    err_msg: string;
};

export type ListRequest = {
    session_id: string;
    project_id: string;
    list_param: ListParam;
    offset: number;
    limit: number;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    entry_list: EntryInfo[];
};


export type GetRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type GetResponse = {
    code: number;
    err_msg: string;
    entry: EntryInfo;
};

export type UpdateTagRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    tag_id_list: string[];
};

export type UpdateTagResponse = {
    code: number;
    err_msg: string;
};

export type UpdateTitleRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    title: string;
};

export type UpdateTitleResponse = {
    code: number;
    err_msg: string;
};

export type UpdatePermRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    entry_perm: EntryPerm;
};

export type UpdatePermResponse = {
    code: number;
    err_msg: string;
};

export type UpdateMarkRemoveRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    mark_remove: boolean;
};

export type UpdateMarkRemoveResponse = {
    code: number;
    err_msg: string;
};

export type UpdateExtraInfoRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    extra_info: ExtraInfo;
};

export type UpdateExtraInfoResponse = {
    code: number;
    err_msg: string;
};

export type ListSysRequest = {
    session_id: string;
    project_id: string;
};

export type ListSysResponse = {
    code: number;
    err_msg: string;
    entry_list: EntryInfo[];
};

export type UpdateMarkSysRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    mark_sys: boolean;
};

export type UpdateMarkSysResponse = {
    code: number;
    err_msg: string;
};

export type RemovePagesRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type RemovePagesResponse = {
    code: number;
    err_msg: string;
};

export type RemoveFileRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type RemoveFileResponse = {
    code: number;
    err_msg: string;
};

export type CreateFolderRequest = {
    session_id: string;
    project_id: string;
    folder_title: string;
    parent_folder_id: string;
};

export type CreateFolderResponse = {
    code: number;
    err_msg: string;
    folder_id: string;
};


export type UpdateFolderTitleRequest = {
    session_id: string;
    project_id: string;
    folder_id: string;
    folder_title: string;
};

export type UpdateFolderTitleResponse = {
    code: number;
    err_msg: string;
};

export type SetParentFolderRequest = {
    session_id: string;
    project_id: string;
    folder_or_entry_id: string;
    is_folder: boolean;
    parent_folder_id: string;
};

export type SetParentFolderResponse = {
    code: number;
    err_msg: string;
};


export type RemoveFolderRequest = {
    session_id: string;
    project_id: string;
    folder_id: string;
};

export type RemoveFolderResponse = {
    code: number;
    err_msg: string;
};


export type ListSubFolderRequest = {
    session_id: string;
    project_id: string;
    parent_folder_id: string;
};

export type ListSubFolderResponse = {
    code: number;
    err_msg: string;
    folder_list: FolderInfo[];
};


export type ListSubEntryRequest = {
    session_id: string;
    project_id: string;
    parent_folder_id: string;
};

export type ListSubEntryResponse = {
    code: number;
    err_msg: string;
    entry_list: EntryInfo[];
};


export type ListAllFolderRequest = {
    session_id: string;
    project_id: string;
};

export type ListAllFolderResponse = {
    code: number;
    err_msg: string;
    item_list: FolderPathItem[];
};


export type GetFolderPathRequest = {
    session_id: string;
    project_id: string;
    folder_id: string;
};

export type GetFolderPathResponse = {
    code: number;
    err_msg: string;
    path_list: FolderPathItem[];
};


//创建入口
export async function create(request: CreateRequest): Promise<CreateResponse> {
    const cmd = 'plugin:project_entry_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateResponse>(cmd, {
        request,
    });
}

//列出入口
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:project_entry_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request,
    });
}

//列出系统入口
export async function list_sys(request: ListSysRequest): Promise<ListSysResponse> {
    const cmd = 'plugin:project_entry_api|list_sys';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListSysResponse>(cmd, {
        request,
    });
}

//获取入口
export async function get(request: GetRequest): Promise<GetResponse> {
    const cmd = 'plugin:project_entry_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResponse>(cmd, {
        request,
    });
}

//更新标签
export async function update_tag(request: UpdateTagRequest): Promise<UpdateTagResponse> {
    const cmd = 'plugin:project_entry_api|update_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateTagResponse>(cmd, {
        request,
    });
}

//更新标题
export async function update_title(request: UpdateTitleRequest): Promise<UpdateTitleResponse> {
    const cmd = 'plugin:project_entry_api|update_title';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateTitleResponse>(cmd, {
        request,
    });
}

//更新权限
export async function update_perm(request: UpdatePermRequest): Promise<UpdatePermResponse> {
    const cmd = 'plugin:project_entry_api|update_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePermResponse>(cmd, {
        request,
    });
}

//更新删除标记
export async function update_mark_remove(request: UpdateMarkRemoveRequest): Promise<UpdateMarkRemoveResponse> {
    const cmd = 'plugin:project_entry_api|update_mark_remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateMarkRemoveResponse>(cmd, {
        request,
    });
}

//更新系统面板标记
export async function update_mark_sys(request: UpdateMarkSysRequest): Promise<UpdateMarkSysResponse> {
    const cmd = 'plugin:project_entry_api|update_mark_sys';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateMarkSysResponse>(cmd, {
        request,
    });
}

//更新额外信息
export async function update_extra_info(request: UpdateExtraInfoRequest): Promise<UpdateExtraInfoResponse> {
    const cmd = 'plugin:project_entry_api|update_extra_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateExtraInfoResponse>(cmd, {
        request,
    });
}

//删除静态网页
export async function remove_pages(request: RemovePagesRequest): Promise<RemovePagesResponse> {
    const cmd = 'plugin:project_entry_api|remove_pages';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemovePagesResponse>(cmd, {
        request,
    });
}

//删除文件
export async function remove_file(request: RemoveFileRequest): Promise<RemoveFileResponse> {
    const cmd = 'plugin:project_entry_api|remove_file';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveFileResponse>(cmd, {
        request,
    });
}

//创建目录
export async function create_folder(request: CreateFolderRequest): Promise<CreateFolderResponse> {
    const cmd = 'plugin:project_entry_api|create_folder';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateFolderResponse>(cmd, {
        request,
    });
}

//修改目录标题
export async function update_folder_title(request: UpdateFolderTitleRequest): Promise<UpdateFolderTitleResponse> {
    const cmd = 'plugin:project_entry_api|update_folder_title';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateFolderTitleResponse>(cmd, {
        request,
    });
}

//设置父目录
export async function set_parent_folder(request: SetParentFolderRequest): Promise<SetParentFolderResponse> {
    const cmd = 'plugin:project_entry_api|set_parent_folder';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetParentFolderResponse>(cmd, {
        request,
    });
}

//删除目录
export async function remove_folder(request: RemoveFolderRequest): Promise<RemoveFolderResponse> {
    const cmd = 'plugin:project_entry_api|remove_folder';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveFolderResponse>(cmd, {
        request,
    });
}

//列出子目录
export async function list_sub_folder(request: ListSubFolderRequest): Promise<ListSubFolderResponse> {
    const cmd = 'plugin:project_entry_api|list_sub_folder';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListSubFolderResponse>(cmd, {
        request,
    });
}

//列出子项目
export async function list_sub_entry(request: ListSubEntryRequest): Promise<ListSubEntryResponse> {
    const cmd = 'plugin:project_entry_api|list_sub_entry';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListSubEntryResponse>(cmd, {
        request,
    });
}

//列出所有目录
export async function list_all_folder(request: ListAllFolderRequest): Promise<ListAllFolderResponse> {
    const cmd = 'plugin:project_entry_api|list_all_folder';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAllFolderResponse>(cmd, {
        request,
    });
}

//获取目录路径
export async function get_folder_path(request: GetFolderPathRequest): Promise<GetFolderPathResponse> {
    const cmd = 'plugin:project_entry_api|get_folder_path';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetFolderPathResponse>(cmd, {
        request,
    });
}