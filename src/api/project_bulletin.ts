import { invoke } from '@tauri-apps/api/tauri';

export type BulletinInfoKey = {
    bulletin_id: string;
    title: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
};

export type CreateRequest = {
    session_id: string;
    project_id: string;
    title: string;
    content: string;
};

export type CreateResponse = {
    code: number;
    err_msg: string;
    bulletin_id: string;
};

export type UpdateRequest = {
    session_id: string;
    project_id: string;
    bulletin_id: string;
    title: string;
    content: string;
};

export type UpdateResponse = {
    code: number;
    err_msg: string;
};

export type RemoveRequest = {
    session_id: string;
    project_id: string;
    bulletin_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};

export type ListKeyRequest = {
    session_id: string;
    project_id: string;
    list_un_read: boolean;
    offset: number;
    limit: number;
};

export type ListKeyResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    key_list: BulletinInfoKey[];
};


export type GetRequest = {
    session_id: string;
    project_id: string;
    bulletin_id: string;
};

export type GetResponse = {

    code: number;
    err_msg: string;
    key_info: BulletinInfoKey,
    content: string;
};


export type MarkReadRequest = {
    session_id: string;
    project_id: string;
    bulletin_id: string;
};

export type MarkReadResponse = {
    code: number;
    err_msg: string;
};

//创建公告
export async function create(request: CreateRequest): Promise<CreateResponse> {
    const cmd = 'plugin:project_bulletin_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateResponse>(cmd, {
        request,
    });
}

//更新公告
export async function update(request: UpdateRequest): Promise<UpdateResponse> {
    const cmd = 'plugin:project_bulletin_api|update';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateResponse>(cmd, {
        request,
    });
}

//删除公告
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:project_bulletin_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}

//列出公告标题
export async function list_key(request: ListKeyRequest): Promise<ListKeyResponse> {
    const cmd = 'plugin:project_bulletin_api|list_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListKeyResponse>(cmd, {
        request,
    });
}

//获取公告内容
export async function get(request: GetRequest): Promise<GetResponse> {
    const cmd = 'plugin:project_bulletin_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResponse>(cmd, {
        request,
    });
}

//标记已读
export async function mark_read(request: MarkReadRequest): Promise<MarkReadResponse> {
    const cmd = 'plugin:project_bulletin_api|mark_read';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<MarkReadResponse>(cmd, {
        request,
    });
}