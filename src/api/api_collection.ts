import { invoke } from '@tauri-apps/api/tauri';

export type API_COLL_TYPE = number;

export const API_COLL_GRPC: API_COLL_TYPE = 0;
export const API_COLL_OPENAPI: API_COLL_TYPE = 1;
export const API_COLL_CUSTOM: API_COLL_TYPE = 2;

export type WatchUser = {
    member_user_id: string;
    display_name: string;
    logo_uri: string;
};

export type ApiCollInfo = {
    api_coll_id: string;
    name: string;
    default_addr: string;
    api_coll_type: API_COLL_TYPE;
    edit_member_user_id_list?: string[];
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    can_update: boolean,
    can_remove: boolean,
    my_watch: boolean;
    watch_user_list: WatchUser[];
};

export type GrpcExtraInfo = {
    api_coll_id: string;
    proto_file_id: string;
    secure: boolean;
};

export type OpenApiExtraInfo = {
    api_coll_id: string;
    proto_file_id: string;
    net_protocol: string;
};

export type UpdateNameRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    name: string;
};

export type UpdateNameResponse = {
    code: number;
    err_msg: string;
};


export type UpdateDefaultAddrRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    default_addr: string;
};

export type UpdateDefaultAddrResponse = {
    code: number;
    err_msg: string;
};

export type UpdateEditMemberRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    member_user_id_list: string[];
};

export type UpdateEditMemberResponse = {
    code: number;
    err_msg: string;
}

export type ListRequest = {
    session_id: string;
    project_id: string;
    filter_by_watch: boolean;
    offset: number;
    limit: number;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: ApiCollInfo[];
};


export type GetRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
};

export type GetResponse = {
    code: number;
    err_msg: string;
    info: ApiCollInfo;
};


export type RemoveRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};


export type CreateRpcRequest = {
    session_id: string;
    project_id: string;
    name: string;
    default_addr: string;
    proto_file_id: string;
    secure: boolean;
};

export type CreateRpcResponse = {
    code: number;
    err_msg: string;
    api_coll_id: string;
};


export type GetRpcRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
};

export type GetRpcResponse = {
    code: number;
    err_msg: string;
    extra_info: GrpcExtraInfo;
};


export type UpdateRpcRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    proto_file_id: string;
    secure: boolean;
};

export type UpdateRpcResponse = {
    code: number;
    err_msg: string;
};


export type CreateOpenApiRequest = {
    session_id: string;
    project_id: string;
    name: string;
    default_addr: string;
    proto_file_id: string;
    net_protocol: string;
};

export type CreateOpenApiResponse = {
    code: number;
    err_msg: string;
    api_coll_id: string;
};


export type GetOpenApiRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
};

export type GetOpenApiResponse = {
    code: number;
    err_msg: string;
    extra_info: OpenApiExtraInfo;
};


export type UpdateOpenApiRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    proto_file_id: string;
    net_protocol: string;
};

export type UpdateOpenApiResponse = {
    code: number;
    err_msg: string;
};

//更新api集合名称
export async function update_name(request: UpdateNameRequest): Promise<UpdateNameResponse> {
    const cmd = 'plugin:api_collection_api|update_name';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateNameResponse>(cmd, {
        request,
    });
}

//更新api集合默认地址
export async function update_default_addr(request: UpdateDefaultAddrRequest): Promise<UpdateDefaultAddrResponse> {
    const cmd = 'plugin:api_collection_api|update_default_addr';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateDefaultAddrResponse>(cmd, {
        request,
    });
}

//更新可编辑用户
export async function update_edit_member(request: UpdateEditMemberRequest): Promise<UpdateEditMemberResponse> {
    const cmd = 'plugin:api_collection_api|update_edit_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateEditMemberResponse>(cmd, {
        request,
    });
}

//列出api集合信息
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:api_collection_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request,
    });
}

//获取单个api集合信息
export async function get(request: GetRequest): Promise<GetResponse> {
    const cmd = 'plugin:api_collection_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResponse>(cmd, {
        request,
    });
}

//删除api集合
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:api_collection_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}

//创建grpc类型的api集合
export async function create_rpc(request: CreateRpcRequest): Promise<CreateRpcResponse> {
    const cmd = 'plugin:api_collection_api|create_rpc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateRpcResponse>(cmd, {
        request,
    });
}

//获取grpc类型的api信息
export async function get_rpc(request: GetRpcRequest): Promise<GetRpcResponse> {
    const cmd = 'plugin:api_collection_api|get_rpc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetRpcResponse>(cmd, {
        request,
    });
}

//更新grpc类型的api信息
export async function update_rpc(request: UpdateRpcRequest): Promise<UpdateRpcResponse> {
    const cmd = 'plugin:api_collection_api|update_rpc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateRpcResponse>(cmd, {
        request,
    });
}

//创建openapi类型的api集合
export async function create_open_api(request: CreateOpenApiRequest): Promise<CreateOpenApiResponse> {
    const cmd = 'plugin:api_collection_api|create_open_api';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateOpenApiResponse>(cmd, {
        request,
    });
}

//获取openapi类型的api集合
export async function get_open_api(request: GetOpenApiRequest): Promise<GetOpenApiResponse> {
    const cmd = 'plugin:api_collection_api|get_open_api';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetOpenApiResponse>(cmd, {
        request,
    });
}

//更新openapi类型的api结合
export async function update_open_api(request: UpdateOpenApiRequest): Promise<UpdateOpenApiResponse> {
    const cmd = 'plugin:api_collection_api|update_open_api';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateOpenApiResponse>(cmd, {
        request,
    });
}