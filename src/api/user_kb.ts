import { invoke } from '@tauri-apps/api/tauri';

export type BasicKbSpaceInfo = {
    space_name: string;
};

export type CreateSpaceRequest = {
    session_id: string;
    basic_info: BasicKbSpaceInfo,
};

export type CreateSpaceResponse = {
    code: number;
    err_msg: string;
    space_id: string;
};

export type UpdateSpaceRequest = {
    session_id: string;
    space_id: string;
    basic_info: BasicKbSpaceInfo,
};

export type UpdateSpaceResponse = {
    code: number;
    err_msg: string;
};

export type KbSpaceInfo = {
    space_id: string;
    basic_info: BasicKbSpaceInfo;
    create_time: number;
    update_time: number;
    default: boolean;
    owner_user_id: string;
    owner_display_name: string;
};

export type ListSpaceResponse = {
    code: number;
    err_msg: string;
    info_list: KbSpaceInfo[];
};

export type GetSpaceResponse = {
    code: number;
    err_msg: string;
    info: KbSpaceInfo;
};

export type RemoveSpaceResponse = {
    code: number;
    err_msg: string;
};

export type BasicDocInfo = {
    space_id: string;
    title: string;
    content: string;
};

export type CreateDocRequest = {
    session_id: string;
    basic_info: BasicDocInfo,
};

export type CreateDocResponse = {
    code: number;
    err_msg: string;
    doc_id: string;
};

export type UpdateDocRequest = {
    session_id: string;
    doc_id: string;
    basic_info: BasicDocInfo,
};

export type UpdateDocResponse = {
    code: number;
    err_msg: string;
};

export type DocIndexInfo = {
    doc_id: string;
    title: string;
    create_time: number;
    update_time: number;
    owner_user_id: string;
    owner_display_name: string;
};

export type DocInfo = {
    doc_id: string;
    basic_info: BasicDocInfo;
    create_time: number;
    update_time: number;
    owner_user_id: string;
    owner_display_name: string;
}

export type ListDocIndexResponse = {
    code: number;
    err_msg: string;
    info_list: DocIndexInfo[];
};

export type GetDocResponse = {
    code: number;
    err_msg: string;
    info: DocInfo;
};

export type RemoveDocResponse = {
    code: number;
    err_msg: string;
};

//创建文档空间
export async function create_space(request: CreateSpaceRequest): Promise<CreateSpaceResponse> {
    return invoke<CreateSpaceResponse>("plugin:user_kb_api|create_space", {
        request: request,
    });
}

//更新文档
export async function update_space(request: UpdateSpaceRequest): Promise<UpdateSpaceResponse> {
    return invoke<UpdateSpaceResponse>("plugin:user_kb_api|update_space", {
        request: request,
    });
}

//列出文档空间
export async function list_space(session_id: string): Promise<ListSpaceResponse> {
    return invoke<ListSpaceResponse>("plugin:user_kb_api|list_space", {
        request: {
            session_id: session_id,
        },
    });
}

//获取文档空间信息
export async function get_space(session_id: string, space_id: string): Promise<GetSpaceResponse> {
    return invoke<GetSpaceResponse>("plugin:user_kb_api|get_space", {
        requst: {
            session_id: session_id,
            space_id: space_id,
        },
    });
}

//删除文档空间
export async function remove_space(session_id: string, space_id: string): Promise<RemoveSpaceResponse> {
    return invoke<RemoveSpaceResponse>("plugin:user_kb_api|remove_space", {
        requst: {
            session_id: session_id,
            space_id: space_id,
        },
    });
}

//创建文档
export async function create_doc(request: CreateDocRequest): Promise<CreateDocResponse> {
    return invoke<CreateDocResponse>("plugin:user_kb_api|create_doc", {
        request: request,
    });
}

//更新文档
export async function update_doc(request: UpdateDocRequest): Promise<UpdateDocResponse> {
    return invoke<UpdateDocResponse>("plugin:user_kb_api|update_doc", {
        request: request,
    });
}

//列出文档
export async function list_doc_index(session_id: string, space_id: string): Promise<ListDocIndexResponse> {
    return invoke<ListDocIndexResponse>("plugin:user_kb_api|list_doc_index", {
        request: {
            session_id: session_id,
            space_id: space_id,
        },
    });
}

//获取文档内容
export async function get_doc(session_id: string, space_id: string, doc_id: string): Promise<GetDocResponse> {
    return invoke<GetDocResponse>("plugin:user_kb_api|get_doc", {
        request: {
            session_id: session_id,
            space_id: space_id,
            doc_id: doc_id,
        },
    });
}

//删除文档
export async function remove_doc(session_id: string, space_id: string, doc_id: string): Promise<RemoveDocResponse> {
    return invoke<RemoveDocResponse>("plugin:user_kb_api|remove_doc", {
        request: {
            session_id: session_id,
            space_id: space_id,
            doc_id: doc_id,
        },
    });
}