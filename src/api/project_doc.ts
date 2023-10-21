import { invoke } from '@tauri-apps/api/tauri';

export type BaseDocSpace = {
    title: string;
};

export type DocTag = {
    tag_id: string;
    tag_name: string;
    bg_color: string;
};

export type DocKey = {
    doc_space_id: string;
    project_id: string;
    doc_id: string;
    title: string;
    create_time: number;
    update_time: number;
    create_user_id: string;
    // tag_list: string[];
    tag_info_list: DocTag[];
    msg_count: number;
    update_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_display_name: string;
    update_logo_uri: string;
    my_watch: boolean;
    user_perm: UserPerm;
};

export type DocPerm = {
    read_for_all: boolean;
    extra_read_user_id_list: string[];
    write_for_all: boolean;
    extra_write_user_id_list: string[];
};

export type BaseDoc = {
    title: string;
    content: string;
    // tag_list: string[];
    tag_id_list: string[];
    doc_perm: DocPerm;
};

export type UserPerm = {
    can_update: boolean;
    can_remove: boolean;
};

export type Doc = {
    doc_id: string;
    base_info: BaseDoc;
    doc_space_id: string;
    project_id: string;
    create_time: number;
    update_time: number;
    create_user_id: string;
    msg_count: number;
    create_display_name: string;
    create_logo_uri: string;
    update_display_name: string;
    update_logo_uri: string;
    my_watch: boolean;
    tag_info_list: DocTag[];
    user_perm: UserPerm;
};

export type ListDocParam = {
    filter_by_watch: boolean;
    watch: boolean;
    filter_by_tag_id: boolean;
    tag_id_list: string[];

};

export type DocKeyHistory = {
    history_id: string;
    time_stamp: number;
    update_user_id: string;
    doc_key: DocKey;
};

export type DocSpace = {
    doc_space_id: string;
    base_info: BaseDocSpace;
    project_id: string;
    create_time: number;
    update_time: number;
    create_user_id: string;
    doc_count: number;
    system_doc_space: boolean;
    user_perm: UserPerm;
};

export type CreateDocSpaceRequest = {
    session_id: string;
    project_id: string;
    base_info: BaseDocSpace,
};

export type CreateDocSpaceResponse = {
    code: number;
    err_msg: string;
    doc_space_id: string;
};

export type UpdateDocSpaceRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    base_info: BaseDocSpace;
};

export type UpdateDocSpaceResponse = {
    code: number;
    err_msg: string;
};

export type ListDocSpaceRequest = {
    session_id: string;
    project_id: string;
};


export type ListDocSpaceResponse = {
    code: number;
    err_msg: string;
    doc_space_list: DocSpace[],
};

export type GetDocSpaceRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
}

export type GetDocSpaceResponse = {
    code: number;
    err_msg: string;
    doc_space: DocSpace;
};

export type RemoveDocSpaceRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
};

export type RemoveDocSpaceResponse = {
    code: number;
    err_msg: string;
};

export type CreateDocRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    base_info: BaseDoc;
};


export type CreateDocResponse = {
    code: number;
    err_msg: string;
    doc_id: string;
};


export type UpdateDocPermRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
    doc_perm: DocPerm;
};

export type UpdateDocPermResponse = {
    code: number;
    err_msg: string;
};

export type StartUpdateDocRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};

export type StartUpdateDocResponse = {
    code: number;
    err_msg: string;
};


export type KeepUpdateDocRequest = {
    session_id: string;
    doc_id: string;
};


export type KeepUpdateDocResponse = {
    code: number;
    err_msg: string;
    keep_update: boolean;
};



export type UpdateDocContentRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
    title: string;
    content: string;
};

export type UpdateDocContentResponse = {
    code: number;
    err_msg: string;
};

export type UpdateTagIdListRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
    tag_id_list: string[];
};

export type UpdateTagIdListResponse = {
    code: number;
    err_msg: string;
};

export type ListDocKeyRequest = {
    session_id: string;
    project_id: string;
    filter_by_doc_space_id: boolean;
    doc_space_id: string;
    list_param: ListDocParam;
    offset: number;
    limit: number;
};

export type ListDocKeyResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    doc_key_list: DocKey[];
};

export type GetDocKeyRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};

export type GetDocKeyResponse = {
    code: number;
    err_msg: string;
    doc_key: DocKey;
};

export type GetDocRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};

export type GetDocResponse = {
    code: number;
    err_msg: string;
    doc: Doc;
};

export type MoveDocRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
    dest_doc_space_id: string;
};

export type MoveDocResponse = {
    code: number;
    err_msg: string;
};

export type RemoveDocRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};


export type RemoveDocResponse = {
    code: number;
    err_msg: string;
};


export type ListDocKeyHistoryRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};


export type ListDocKeyHistoryResponse = {
    code: number;
    err_msg: string;
    history_list: DocKeyHistory[];
};

export type GetDocInHistoryRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
    history_id: string;
};


export type GetDocInHistoryResponse = {
    code: number;
    err_msg: string;
    doc: Doc;
};

export type RecoverDocInHistoryRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
    history_id: string;
};

export type RecoverDocInHistoryResponse = {
    code: number;
    err_msg: string;
};


export type ListDocKeyInRecycleRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListDocKeyInRecycleResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    doc_key_list: DocKey[];
};

export type GetDocKeyInRecycleRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};

export type GetDocKeyInRecycleResponse = {
    code: number;
    err_msg: string;
    doc_key: DocKey;
};

export type GetDocInRecycleRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};


export type GetDocInRecycleResponse = {
    code: number;
    err_msg: string;
    doc: Doc;
};

export type RemoveDocInRecycleRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};


export type RemoveDocInRecycleResponse = {
    code: number;
    err_msg: string;
};


export type RecoverDocInRecycleRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};


export type RecoverDocInRecycleResponse = {
    code: number;
    err_msg: string;
};


export type WatchDocRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};

export type WatchDocResponse = {
    code: number;
    err_msg: string;
};


export type UnWatchDocRequest = {
    session_id: string;
    project_id: string;
    doc_space_id: string;
    doc_id: string;
};


export type UnWatchDocResponse = {
    code: number;
    err_msg: string;
};

export type GetLastViewDocRequest = {
    session_id: string;
    project_id: string;
};

export type GetLastViewDocResponse = {
    code: number;
    err_msg: string;
    has_last_view: boolean;
    doc_space_id: string;
    doc_id: string;
};

//创建文档空间
export async function create_doc_space(request: CreateDocSpaceRequest): Promise<CreateDocSpaceResponse> {
    const cmd = 'plugin:project_doc_api|create_doc_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateDocSpaceResponse>(cmd, {
        request,
    });
}

//更新文档空间
export async function update_doc_space(request: UpdateDocSpaceRequest): Promise<UpdateDocSpaceResponse> {
    const cmd = 'plugin:project_doc_api|update_doc_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateDocSpaceResponse>(cmd, {
        request,
    });
}

//列出文档空间
export async function list_doc_space(request: ListDocSpaceRequest): Promise<ListDocSpaceResponse> {
    const cmd = 'plugin:project_doc_api|list_doc_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListDocSpaceResponse>(cmd, {
        request,
    });
}

//获取单个文档空间
export async function get_doc_space(request: GetDocSpaceRequest): Promise<GetDocSpaceResponse> {
    const cmd = 'plugin:project_doc_api|get_doc_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocSpaceResponse>(cmd, {
        request,
    });
}

//删除文档空间
export async function remove_doc_space(request: RemoveDocSpaceRequest): Promise<RemoveDocSpaceResponse> {
    const cmd = 'plugin:project_doc_api|remove_doc_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveDocSpaceResponse>(cmd, {
        request,
    });
}

//创建文档
export async function create_doc(request: CreateDocRequest): Promise<CreateDocResponse> {
    const cmd = 'plugin:project_doc_api|create_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateDocResponse>(cmd, {
        request,
    });
}

//更新文档权限
export async function update_doc_perm(request: UpdateDocPermRequest): Promise<UpdateDocPermResponse> {
    const cmd = 'plugin:project_doc_api|update_doc_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateDocPermResponse>(cmd, {
        request,
    });
}

//开始更新文档内容
export async function start_update_doc(request: StartUpdateDocRequest): Promise<StartUpdateDocResponse> {
    const cmd = 'plugin:project_doc_api|start_update_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<StartUpdateDocResponse>(cmd, {
        request,
    });
}

//持续保持更新文档状态(心跳)
export async function keep_update_doc(request: KeepUpdateDocRequest): Promise<KeepUpdateDocResponse> {
    const cmd = 'plugin:project_doc_api|keep_update_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<KeepUpdateDocResponse>(cmd, {
        request,
    });
}

//更新文档内容
export async function update_doc_content(request: UpdateDocContentRequest): Promise<UpdateDocContentResponse> {
    const cmd = 'plugin:project_doc_api|update_doc_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateDocContentResponse>(cmd, {
        request,
    });
}

//列出文档key
export async function list_doc_key(request: ListDocKeyRequest): Promise<ListDocKeyResponse> {
    const cmd = 'plugin:project_doc_api|list_doc_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListDocKeyResponse>(cmd, {
        request,
    });
}

//更新标签
export async function update_tag_id_list(request: UpdateTagIdListRequest): Promise<UpdateTagIdListResponse> {
    const cmd = 'plugin:project_doc_api|update_tag_id_list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateTagIdListResponse>(cmd, {
        request,
    });
}

//获取文档key
export async function get_doc_key(request: GetDocKeyRequest): Promise<GetDocKeyResponse> {
    const cmd = 'plugin:project_doc_api|get_doc_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocKeyResponse>(cmd, {
        request,
    });
}

//获取文档
export async function get_doc(request: GetDocRequest): Promise<GetDocResponse> {
    const cmd = 'plugin:project_doc_api|get_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocResponse>(cmd, {
        request,
    });
}

//移动文档
export async function move_doc(request: MoveDocRequest): Promise<MoveDocResponse> {
    const cmd = 'plugin:project_doc_api|move_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<MoveDocResponse>(cmd, {
        request,
    });
}

//删除文档
export async function remove_doc(request: RemoveDocRequest): Promise<RemoveDocResponse> {
    const cmd = 'plugin:project_doc_api|remove_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveDocResponse>(cmd, {
        request,
    });
}

//列出文档历史版本
export async function list_doc_key_history(request: ListDocKeyHistoryRequest): Promise<ListDocKeyHistoryResponse> {
    const cmd = 'plugin:project_doc_api|list_doc_key_history';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListDocKeyHistoryResponse>(cmd, {
        request,
    });
}

//获取历史版本文档
export async function get_doc_in_history(request: GetDocInHistoryRequest): Promise<GetDocInHistoryResponse> {
    const cmd = 'plugin:project_doc_api|get_doc_in_history';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocInHistoryResponse>(cmd, {
        request,
    });
}

//从历史恢复文档
export async function recover_doc_in_history(request: RecoverDocInHistoryRequest): Promise<RecoverDocInHistoryResponse> {
    const cmd = 'plugin:project_doc_api|recover_doc_in_history';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RecoverDocInHistoryResponse>(cmd, {
        request,
    });
}

//列出回收站文件key
export async function list_doc_key_in_recycle(request: ListDocKeyInRecycleRequest): Promise<ListDocKeyInRecycleResponse> {
    const cmd = 'plugin:project_doc_api|list_doc_key_in_recycle';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListDocKeyInRecycleResponse>(cmd, {
        request,
    });
}

//获取回收站文件key
export async function get_doc_key_in_recycle(request: GetDocKeyInRecycleRequest): Promise<GetDocKeyInRecycleResponse> {
    const cmd = 'plugin:project_doc_api|get_doc_key_in_recycle';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocKeyInRecycleResponse>(cmd, {
        request,
    });
}

//从回收站读取文件
export async function get_doc_in_recycle(request: GetDocInRecycleRequest): Promise<GetDocInRecycleResponse> {
    const cmd = 'plugin:project_doc_api|get_doc_in_recycle';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocInRecycleResponse>(cmd, {
        request,
    });
}

//从回收站删除文件
export async function remove_doc_in_recycle(request: RemoveDocInRecycleRequest): Promise<RemoveDocInRecycleResponse> {
    const cmd = 'plugin:project_doc_api|remove_doc_in_recycle';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveDocInRecycleResponse>(cmd, {
        request,
    });
}

//从回收站恢复文件
export async function recover_doc_in_recycle(request: RecoverDocInRecycleRequest): Promise<RecoverDocInRecycleResponse> {
    const cmd = 'plugin:project_doc_api|recover_doc_in_recycle';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RecoverDocInRecycleResponse>(cmd, {
        request,
    });
}

//关注文档
export async function watch_doc(request: WatchDocRequest): Promise<WatchDocResponse> {
    const cmd = 'plugin:project_doc_api|watch_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<WatchDocResponse>(cmd, {
        request,
    });
}

//取消关注文档
export async function un_watch_doc(request: UnWatchDocRequest): Promise<UnWatchDocResponse> {
    const cmd = 'plugin:project_doc_api|un_watch_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UnWatchDocResponse>(cmd, {
        request,
    });
}

//获取最后访问的文档
export async function get_last_view_doc(request: GetLastViewDocRequest): Promise<GetLastViewDocResponse> {
    const cmd = 'plugin:project_doc_api|get_last_view_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetLastViewDocResponse>(cmd, {
        request,
    });
}