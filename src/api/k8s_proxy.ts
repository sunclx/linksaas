import { invoke } from '@tauri-apps/api/tauri';

export type RESOURCE_TYPE = number;
export const RESOURCE_TYPE_NAMESPACE: RESOURCE_TYPE = 0;
export const RESOURCE_TYPE_POD: RESOURCE_TYPE = 1;
export const RESOURCE_TYPE_DEPLOYMENT: RESOURCE_TYPE = 2;
export const RESOURCE_TYPE_STATEFULSET: RESOURCE_TYPE = 3;
export const RESOURCE_TYPE_SERVICE: RESOURCE_TYPE = 4;
export const RESOURCE_TYPE_CONFIG_MAP: RESOURCE_TYPE = 5;
export const RESOURCE_TYPE_STORAGE_CLASS: RESOURCE_TYPE = 6;

export type ResourcePerm = {
    name: string;
    update_user_list: string[];
};

export type GetResourceRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    resource_name: string;
};

export type GetResourceResponse = {
    code: number;
    err_msg: string;
    payload: string;
};

export type ListResourceRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    label_selector: string;
    field_selector: string;
};

export type ListResourceResponse = {
    code: number;
    err_msg: string;
    payload: string;
};


export type WatchResourceRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    label_selector: string;
    field_selector: string;
    resource_version: string;
};

export type WatchResourceResponse = {
    code: number;
    err_msg: string;
};


export type CreateResourceRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    payload: string;
};

export type CreateResourceResponse = {
    code: number;
    err_msg: string;
};


export type UpdateResourceRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    payload: string;
};

export type UpdateResourceResponse = {
    code: number;
    err_msg: string;
};


export type RemoveResourceRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    name: string;
};

export type RemoveResourceResponse = {
    code: number;
    err_msg: string;
};


export type ListResourcePermRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    name_list: string[];
};

export type ListResourcePermResponse = {
    code: number;
    err_msg: string;
    perm_list: ResourcePerm[];
};

export type SetResourcePermRequest = {
    token: string;
    namespace: string;
    resource_type: RESOURCE_TYPE;
    name: string;
    perm: ResourcePerm;
};

export type SetResourcePermResponse = {
    code: number;
    err_msg: string;
};

export type OpenLogRequest = {
    token: string;
    namespace: string;
    pod_name: string;
};

export type OpenLogResponse = {
    code: number;
    err_msg: string;
    log_id: string;
};

export type ReadLogRequest = {
    log_id: string;
};

export type ReadLogResponse = {
    code: number;
    err_msg: string;
    data: string;
};


export type OpenTermRequest = {
    token: string;
    namespace: string;
    pod_name: string;
    shell_cmd: string;
    term_width: number;
    term_height: number;
};

export type OpenTermResponse = {
    code: number;
    err_msg: string;
    term_id: string;
};

export type WriteTermRequest = {
    term_id: string;
    data: number[];
};

export type WriteTermResponse = {
    code: number;
    err_msg: string;
};

export type ReadTermRequest = {
    term_id: string;
};

export type ReadTermResponse = {
    code: number;
    err_msg: string;
    data: number[];
};


export type SetTermSizeRequest = {
    term_id: string;
    term_width: number;
    term_height: number;
};

export type SetTermSizeResponse = {
    code: number;
    err_msg: string;
};

//获取单个资源
export async function get_resource(servAddr: string,request: GetResourceRequest): Promise<GetResourceResponse> {
    const cmd = 'plugin:k8s_proxy_api|get_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<GetResourceResponse>(cmd, {
        servAddr,
        request,
    });
}

//列出资源
export async function list_resource(servAddr: string,request: ListResourceRequest): Promise<ListResourceResponse> {
    const cmd = 'plugin:k8s_proxy_api|list_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListResourceResponse>(cmd, {
        servAddr,
        request,
    });
}

//关注资源
export async function watch_resource(servAddr: string,request: WatchResourceRequest): Promise<WatchResourceResponse> {
    const cmd = 'plugin:k8s_proxy_api|watch_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<WatchResourceResponse>(cmd, {
        servAddr,
        request,
    });
}

//创建资源
export async function create_resource(servAddr: string,request: CreateResourceRequest): Promise<CreateResourceResponse> {
    const cmd = 'plugin:k8s_proxy_api|create_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<CreateResourceResponse>(cmd, {
        servAddr,
        request,
    });
}

//更新资源
export async function update_resource(servAddr: string,request: UpdateResourceRequest): Promise<UpdateResourceResponse> {
    const cmd = 'plugin:k8s_proxy_api|update_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<UpdateResourceResponse>(cmd, {
        servAddr,
        request,
    });
}

//删除资源
export async function remove_resource(servAddr: string,request: RemoveResourceRequest): Promise<RemoveResourceResponse> {
    const cmd = 'plugin:k8s_proxy_api|remove_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<RemoveResourceResponse>(cmd, {
        servAddr,
        request,
    });
}

//列出资源权限
export async function list_resource_perm(servAddr: string,request: ListResourcePermRequest): Promise<ListResourcePermResponse> {
    const cmd = 'plugin:k8s_proxy_api|list_resource_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListResourcePermResponse>(cmd, {
        servAddr,
        request,
    });
}

//设置资源权限
export async function set_resource_perm(servAddr: string,request: SetResourcePermRequest): Promise<SetResourcePermResponse> {
    const cmd = 'plugin:k8s_proxy_api|set_resource_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<SetResourcePermResponse>(cmd, {
        servAddr,
        request,
    });
}

//开始查看日志
export async function open_log(servAddr: string,request: OpenLogRequest): Promise<OpenLogResponse> {
    const cmd = 'plugin:k8s_proxy_api|open_log';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<OpenLogResponse>(cmd, {
        servAddr,
        request,
    });
}

//查看日志
export async function read_log(servAddr: string,request: ReadLogRequest): Promise<ReadLogResponse> {
    const cmd = 'plugin:k8s_proxy_api|read_log';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ReadLogResponse>(cmd, {
        servAddr,
        request,
    });
}

//打开终端
export async function open_term(servAddr: string,request: OpenTermRequest): Promise<OpenTermResponse> {
    const cmd = 'plugin:k8s_proxy_api|open_term';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<OpenTermResponse>(cmd, {
        servAddr,
        request,
    });
}

//写入终端
export async function write_term(servAddr: string,request: WriteTermRequest): Promise<WriteTermResponse> {
    const cmd = 'plugin:k8s_proxy_api|write_term';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<WriteTermResponse>(cmd, {
        servAddr,
        request,
    });
}

//读取终端
export async function read_term(servAddr: string,request: ReadTermRequest): Promise<ReadTermResponse> {
    const cmd = 'plugin:k8s_proxy_api|read_term';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ReadTermResponse>(cmd, {
        servAddr,
        request,
    });
}

//调整终端大小
export async function set_term_size(servAddr: string,request: SetTermSizeRequest): Promise<SetTermSizeResponse> {
    const cmd = 'plugin:k8s_proxy_api|set_term_size';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<SetTermSizeResponse>(cmd, {
        servAddr,
        request,
    });
}