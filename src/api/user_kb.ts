import { invoke } from '@tauri-apps/api/tauri';


export type KB_SPACE_TYPE = number;

export const KB_SPACE_PRIVATE: KB_SPACE_TYPE = 0;
export const KB_SPACE_SECURE: KB_SPACE_TYPE = 1;
export const KB_SPACE_PUBLIC: KB_SPACE_TYPE = 2;


export type BasicKbSpaceInfo = {
    space_name: string;
};

export type KbSpaceInfo = {
    space_id: string;
    basic_info: BasicKbSpaceInfo;
    kb_space_type: KB_SPACE_TYPE;
    ssh_pub_key: string;
    default: boolean;
    doc_count: number;
    owner_user_id: string;
    owner_display_name: string;
    create_time: number;
    update_time: number;
};

export type BasicDocInfo = {
    space_id: string;
    title: string;
    content: string;
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

export type CreateSpaceRequest = {
    session_id: string;
    basic_info: BasicKbSpaceInfo;
    kb_space_type: KB_SPACE_TYPE;
    ssh_pub_key: string;
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

export type MoveDocRequest = {
    session_id: string;
    doc_id: string;
    from_space_id: string;
    to_space_id: string;
};

export type MoveDocResponse = {
    code: number;
    err_msg: string;
};


//创建文档空间
export async function create_space(request: CreateSpaceRequest): Promise<CreateSpaceResponse> {
    const cmd = 'plugin:user_kb_api|create_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateSpaceResponse>(cmd, {
        request: request,
    });
}

//更新文档
export async function update_space(request: UpdateSpaceRequest): Promise<UpdateSpaceResponse> {
    const cmd = 'plugin:user_kb_api|update_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateSpaceResponse>(cmd, {
        request: request,
    });
}

//列出文档空间
export async function list_space(session_id: string): Promise<ListSpaceResponse> {
    const cmd = 'plugin:user_kb_api|list_space';
    const request = {
        session_id: session_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListSpaceResponse>(cmd, {
        request,
    });
}

//获取文档空间信息
export async function get_space(session_id: string, space_id: string): Promise<GetSpaceResponse> {
    const cmd = 'plugin:user_kb_api|get_space';
    const request = {
        session_id: session_id,
        space_id: space_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetSpaceResponse>(cmd, {
        request,
    });
}

//删除文档空间
export async function remove_space(session_id: string, space_id: string): Promise<RemoveSpaceResponse> {
    const cmd = 'plugin:user_kb_api|remove_space';
    const request = {
        session_id: session_id,
        space_id: space_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveSpaceResponse>(cmd, {
        request,
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
    const cmd = 'plugin:user_kb_api|list_doc_index';
    const request = {
        session_id: session_id,
        space_id: space_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListDocIndexResponse>(cmd, {
        request,
    });
}

//获取文档内容
export async function get_doc(session_id: string, space_id: string, doc_id: string): Promise<GetDocResponse> {
    const cmd = "plugin:user_kb_api|get_doc";
    const request = {
        session_id: session_id,
        space_id: space_id,
        doc_id: doc_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetDocResponse>(cmd, {
        request,
    });
}

//删除文档
export async function remove_doc(session_id: string, space_id: string, doc_id: string): Promise<RemoveDocResponse> {
    const cmd = "plugin:user_kb_api|remove_doc";
    const request = {
        session_id: session_id,
        space_id: space_id,
        doc_id: doc_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveDocResponse>(cmd, {
        request,
    });
}

//移动文档
export async function move_doc(request: MoveDocRequest): Promise<MoveDocResponse> {
    const cmd = "plugin:user_kb_api|move_doc";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<MoveDocResponse>(cmd, {
        request,
    });
}

//验证Openssh密钥
export async function valid_ssh_key(pub_key_str: string, priv_key_file: string): Promise<void> {
    const cmd = "plugin:user_kb_api|valid_ssh_key";
    const request = {
        pubKeyStr: pub_key_str,
        privKeyFile: priv_key_file,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, request);
}

//加密
export async function encrypt(key: string, content: string): Promise<string> {
    return invoke<string>("plugin:user_kb_api|encrypt", { key, content })
}

//解密
export async function decrypt(content: string): Promise<string> {
    return invoke<string>("plugin:user_kb_api|decrypt", { content })
}