import { invoke } from '@tauri-apps/api/tauri';

export type BLOCK_CONTENT_TYPE = number;

export const BLOCK_CONTENT_TEXT: BLOCK_CONTENT_TYPE = 0;
export const BLOCK_CONTENT_HTML: BLOCK_CONTENT_TYPE = 1;
export const BLOCK_CONTENT_MARKDOWN: BLOCK_CONTENT_TYPE = 2;

export type BaseBlockColl = {
    title: string;
};

export type BlockColl = {
    block_coll_id: string;
    base_info: BaseBlockColl,
    project_id: string;
    access_token: string;
    create_time: number;
    update_time: number;
    create_user_id: string;
    block_count: number;
    create_display_name: string;
};

export type BaseBlock = {
    title: string;
};

export type Block = {
    block_id: string;
    base_info: BaseBlock,
    block_coll_id: string;
    project_id: string;
    create_time: number;
    update_time: number;
    create_user_id: string;
    update_url: string;
    access_token: string;
    recv_content_count: number;
    create_display_name: string;
};

export type BlockContent = {
    block_id: string;
    time_stamp: number;
    content_type: BLOCK_CONTENT_TYPE;
    content: string;
};

export type CreateBlockCollRequest = {
    session_id: string;
    project_id: string;
    base_info: BaseBlockColl,
};

export type CreateBlockCollResponse = {
    code: number;
    err_msg: string;
    block_coll_id: string;
};

export type UpdateBlockCollRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
    base_info: BaseBlockColl,
};

export type UpdateBlockCollResponse = {
    code: number;
    err_msg: string;
};

export type RenewBlockCollTokenRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
};

export type RenewBlockCollTokenResponse = {
    code: number;
    err_msg: string;
    access_token: string;
};

export type ListBlockCollRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListBlockCollResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    block_coll_list: BlockColl[],
};


export type RemoveBlockCollRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
};

export type RemoveBlockCollResponse = {
    code: number;
    err_msg: string;
};

export type CreateBlockRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
    base_info: BaseBlock,
};

export type CreateBlockResponse = {
    code: number;
    err_msg: string;
    block_id: string;
};

export type UpdateBlockRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
    block_id: string;
    base_info: BaseBlock,
};

export type UpdateBlockResponse = {
    code: number;
    err_msg: string;
};

export type ListBlockRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
    offset: number;
    limit: number;
};


export type ListBlockResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    block_list: Block[],
};

export type RemoveBlockRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
    block_id: string;
};

export type RemoveBlockResponse = {
    code: number;
    err_msg: string;
};

export type UpdateBlockContentRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
    block_id: string;
    content_type: number;
    content: string;
};


export type UpdateBlockContentResponse = {
    code: number;
    err_msg: string;
};

export type GetBlockContentRequest = {
    session_id: string;
    project_id: string;
    block_coll_id: string;
    block_id: string;
    max_history_count: number;
};


export type GetBlockContentResponse = {
    code: number;
    err_msg: string;
    block_id: string;
    base_info: BaseBlock;
    block_coll_id: string;
    project_id: string;
    create_time: number;
    update_time: number;
    create_user_id: string;
    create_display_name: string;
    content_list: BlockContent[];
};

export type ListAllRequest = {
    session_id: string;
    project_id: string;
};

export type SimpleBlock = {
    block_id: string;
    title: string;
};

export type SimpleBlockColl = {
    block_coll_id: string;
    title: string;
    block_list: SimpleBlock[];
};

export type ListAllResponse = {
    code: number;
    err_msg: string;
    coll_list: SimpleBlockColl[];
};

//创建块集合
export async function create_block_coll(request: CreateBlockCollRequest): Promise<CreateBlockCollResponse> {
    const cmd = 'plugin:project_vc_api|create_block_coll';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateBlockCollResponse>(cmd, {
        request,
    });
}

//更新块集合
export async function update_block_coll(request: UpdateBlockCollRequest): Promise<UpdateBlockCollResponse> {
    const cmd = 'plugin:project_vc_api|update_block_coll';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateBlockCollResponse>(cmd, {
        request,
    });
}

//更新访问令牌
export async function renew_block_coll_token(request: RenewBlockCollTokenRequest): Promise<RenewBlockCollTokenResponse> {
    const cmd = 'plugin:project_vc_api|renew_block_coll_token';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RenewBlockCollTokenResponse>(cmd, {
        request,
    });
}

//列出块集合
export async function list_block_coll(request: ListBlockCollRequest): Promise<ListBlockCollResponse> {
    const cmd = 'plugin:project_vc_api|list_block_coll';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListBlockCollResponse>(cmd, {
        request,
    });
}

//删除块集合
export async function remove_block_coll(request: RemoveBlockCollRequest): Promise<RemoveBlockCollResponse> {
    const cmd = 'plugin:project_vc_api|remove_block_coll';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveBlockCollResponse>(cmd, {
        request,
    });
}

//创建块
export async function create_block(request: CreateBlockRequest): Promise<CreateBlockResponse> {
    const cmd = 'plugin:project_vc_api|create_block';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateBlockResponse>(cmd, {
        request,
    });
}

//更新块
export async function update_block(request: UpdateBlockRequest): Promise<UpdateBlockResponse> {
    const cmd = 'plugin:project_vc_api|update_block';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateBlockResponse>(cmd, {
        request,
    });
}

//列出块
export async function list_block(request: ListBlockRequest): Promise<ListBlockResponse> {
    const cmd = 'plugin:project_vc_api|list_block';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListBlockResponse>(cmd, {
        request,
    });
}

//删除块
export async function remove_block(request: RemoveBlockRequest): Promise<RemoveBlockResponse> {
    const cmd = 'plugin:project_vc_api|remove_block';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveBlockResponse>(cmd, {
        request,
    });
}

//设置块内容
export async function update_block_content(request: UpdateBlockContentRequest): Promise<UpdateBlockContentResponse> {
    const cmd = 'plugin:project_vc_api|update_block_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateBlockContentResponse>(cmd, {
        request,
    });
}

//更新块内容
export async function get_block_content(request: GetBlockContentRequest): Promise<GetBlockContentResponse> {
    const cmd = 'plugin:project_vc_api|get_block_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetBlockContentResponse>(cmd, {
        request,
    });
}
//列出所有块信息
export async function list_all(request: ListAllRequest): Promise<ListAllResponse> {
    const cmd = 'plugin:project_vc_api|list_all';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAllResponse>(cmd, {
        request,
    });
}