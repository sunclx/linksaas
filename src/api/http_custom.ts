import { invoke } from '@tauri-apps/api/tauri';

export type HTTP_BODY_TYPE = number;

export const HTTP_BODY_NONE: HTTP_BODY_TYPE = 0;
export const HTTP_BODY_TEXT: HTTP_BODY_TYPE = 1;
export const HTTP_BODY_URL_ENCODE: HTTP_BODY_TYPE = 2;
export const HTTP_BODY_MULTI_PART: HTTP_BODY_TYPE = 3;

export type CustomExtraInfo = {
    api_coll_id: string;
    net_protocol: string;
}

export type ApiGroupInfo = {
    group_id: string;
    group_name: string;
    item_count: number;
};

export type HttpKeyValue = {
    id: string;
    key: string;
    value: string;
};

export type UrlEncodeBody = {
    param_list: HttpKeyValue[];
};

export type MultiPart = {
    id: string;
    key: string;
    value: string;
    is_file: boolean;
};

export type MultiPartBody = {
    part_list: MultiPart[];
};

export type Body = {
    NodyBody?: string;
    TextBody?: string;
    UrlEncodeBody?: UrlEncodeBody;
    MultiPartBody?: MultiPartBody;
};

export type ApiItemInfo = {
    api_item_id: string;
    api_item_name: string;
    group_id: string;
    method: string;
    url: string;
    param_list: HttpKeyValue[];
    header_list: HttpKeyValue[];
    content_type: string;
    body_type: HTTP_BODY_TYPE;
    body: Body;
};


export type CreateCustomRequest = {
    session_id: string;
    project_id: string;
    name: string;
    default_addr: string;
    net_protocol: string;
};

export type CreateCustomResponse = {
    code: number;
    err_msg: string;
    api_coll_id: string;
};


export type GetCustomRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
};

export type GetCustomResponse = {
    code: number;
    err_msg: string;
    extra_info: CustomExtraInfo;
};


export type UpdateCustomRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    net_protocol: string;
};

export type UpdateCustomResponse = {
    code: number;
    err_msg: string;
};


export type CreateGroupRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    group_name: string;
};

export type CreateGroupResponse = {
    code: number;
    err_msg: string;
    group_id: string;
};


export type UpdateGroupRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    group_id: string;
    group_name: string;
};

export type UpdateGroupResponse = {
    code: number;
    err_msg: string;
};


export type ListGroupRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
};

export type ListGroupResponse = {
    code: number;
    err_msg: string;
    group_list: ApiGroupInfo[];
};


export type RemoveGroupRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    group_id: string;
};

export type RemoveGroupResponse = {
    code: number;
    err_msg: string;
};


export type CreateApiItemRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    group_id: string;
    api_item_name: string;
    method: string;
    url: string;
    param_list: HttpKeyValue[];
    header_list: HttpKeyValue[];
    content_type: string;
    body_type: HTTP_BODY_TYPE;
    body: Body;
};


export type CreateApiItemResponse = {
    code: number;
    err_msg: string;
    api_item_id: string;
};


export type UpdateApiItemRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    group_id: string;
    api_item_id: string;
    api_item_name: string;
    method: string;
    url: string;
    param_list: HttpKeyValue[];
    header_list: HttpKeyValue[];
    content_type: string;
    body_type: HTTP_BODY_TYPE;
    body: Body;
};


export type UpdateApiItemResponse = {
    code: number;
    err_msg: string;
};


export type ListApiItemRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    filter_by_group_id: boolean;
    group_id: string;
};

export type ListApiItemResponse = {
    code: number;
    err_msg: string;
    item_list: ApiItemInfo[];
};

export type GetApiItemRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    api_item_id: string;
};

export type GetApiItemResponse = {
    code: number;
    err_msg: string;
    item_info: ApiItemInfo;
};

export type RemoveApiItemRequest = {
    session_id: string;
    project_id: string;
    api_coll_id: string;
    api_item_id: string;
};

export type RemoveApiItemResponse = {
    code: number;
    err_msg: string;
};

//创建自定义API
export async function create_custom(request: CreateCustomRequest): Promise<CreateCustomResponse> {
    const cmd = 'plugin:http_custom_api|create_custom';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<CreateCustomResponse>(cmd, {
        request,
    });
}

//获取自定义API
export async function get_custom(request: GetCustomRequest): Promise<GetCustomResponse> {
    const cmd = 'plugin:http_custom_api|get_custom';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<GetCustomResponse>(cmd, {
        request,
    });
}

//更新自定义API
export async function update_custom(request: UpdateCustomRequest): Promise<UpdateCustomResponse> {
    const cmd = 'plugin:http_custom_api|update_custom';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<UpdateCustomResponse>(cmd, {
        request,
    });
}

//创建分组
export async function create_group(request: CreateGroupRequest): Promise<CreateGroupResponse> {
    const cmd = 'plugin:http_custom_api|create_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<CreateGroupResponse>(cmd, {
        request,
    });
}

//更新分组
export async function update_group(request: UpdateGroupRequest): Promise<UpdateGroupResponse> {
    const cmd = 'plugin:http_custom_api|update_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<UpdateGroupResponse>(cmd, {
        request,
    });
}

//列出分组
export async function list_group(request: ListGroupRequest): Promise<ListGroupResponse> {
    const cmd = 'plugin:http_custom_api|list_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListGroupResponse>(cmd, {
        request,
    });
}

//删除分组
export async function remove_group(request: RemoveGroupRequest): Promise<RemoveGroupResponse> {
    const cmd = 'plugin:http_custom_api|remove_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<RemoveGroupResponse>(cmd, {
        request,
    });
}

//创建接口
export async function create_api_item(request: CreateApiItemRequest): Promise<CreateApiItemResponse> {
    const cmd = 'plugin:http_custom_api|create_api_item';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<CreateApiItemResponse>(cmd, {
        request,
    });
}

//更新接口
export async function update_api_item(request: UpdateApiItemRequest): Promise<UpdateApiItemResponse> {
    const cmd = 'plugin:http_custom_api|update_api_item';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<UpdateApiItemResponse>(cmd, {
        request,
    });
}

//列出接口
export async function list_api_item(request: ListApiItemRequest): Promise<ListApiItemResponse> {
    const cmd = 'plugin:http_custom_api|list_api_item';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListApiItemResponse>(cmd, {
        request,
    });
}

//获取接口
export async function get_api_item(request: GetApiItemRequest): Promise<GetApiItemResponse> {
    const cmd = 'plugin:http_custom_api|get_api_item';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<GetApiItemResponse>(cmd, {
        request,
    });
}

//删除接口
export async function remove_api_item(request: RemoveApiItemRequest): Promise<RemoveApiItemResponse> {
    const cmd = 'plugin:http_custom_api|remove_api_item';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<RemoveApiItemResponse>(cmd, {
        request,
    });
}

