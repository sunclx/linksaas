import { invoke } from '@tauri-apps/api/tauri';


export type BaseDoc = {
    content: string;
};

export type Doc = {
    doc_id: string;
    base_info: BaseDoc;
};

export type DocKeyHistory = {
    history_id: string;
    time_stamp: number;
    update_user_id: string;
};

export type CreateDocRequest = {
    session_id: string;
    project_id: string;
    base_info: BaseDoc;
};

export type CreateDocResponse = {
    code: number;
    err_msg: string;
    doc_id: string;
};

export type StartUpdateDocRequest = {
    session_id: string;
    project_id: string;
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
    doc_id: string;
    content: string;
};

export type UpdateDocContentResponse = {
    code: number;
    err_msg: string;
};

export type GetDocRequest = {
    session_id: string;
    project_id: string;
    doc_id: string;
};

export type GetDocResponse = {
    code: number;
    err_msg: string;
    doc: Doc;
};

export type RemoveDocRequest = {
    session_id: string;
    project_id: string;
    doc_id: string;
};

export type RemoveDocResponse = {
    code: number;
    err_msg: string;
};

export type ListDocKeyHistoryRequest = {
    session_id: string;
    project_id: string;
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
    doc_id: string;
    history_id: string;
};

export type RecoverDocInHistoryResponse = {
    code: number;
    err_msg: string;
};



//创建文档
export async function create_doc(request: CreateDocRequest): Promise<CreateDocResponse> {
    const cmd = 'plugin:project_doc_api|create_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateDocResponse>(cmd, {
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

//获取文档
export async function get_doc(request: GetDocRequest): Promise<GetDocResponse> {
    const cmd = 'plugin:project_doc_api|get_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocResponse>(cmd, {
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