import { invoke } from '@tauri-apps/api/tauri';

export type Label = {
    key: string;
    value: string;
};

export type ServiceInfo = {
    service_id: string;
    name: string;
    label_list: Label[];
    image: string;
    create_time: number;
    update_time: number;
    running_tasks: number;
    desired_tasks: number;
};

export type PortInfo = {
    name: string;
    protocol: string;
    target_port: number;
    publish_port: number;
    publish_mode: string;
}

export type TaskInfo = {
    task_id: string;
    name: string;
    label_list: Label[];
    service_id: string;
    node_name: string;
    status: string;
    container_id: string;
    port_list: PortInfo[];
    create_time: number;
    update_time: number;
};

export type NameSpaceUserPerm = {
    user_id: string;
    update_scale: boolean;
    update_image: boolean;
    logs: boolean;
    exec: boolean;
};

export type NameSpacePerm = {
    name_space: string;
    user_perm_list: NameSpaceUserPerm[];
};

export type ListNameSpaceRequest = {
    token: string;
};

export type ListNameSpaceResponse = {
    code: number;
    err_msg: string;
    name_space_list: string[];
};


export type ListServiceRequest = {
    token: string;
    name_space: string;
};

export type ListServiceResponse = {
    code: number;
    err_msg: string;
    service_list: ServiceInfo[];
};


export type ListTaskRequest = {
    token: string;
    service_id_list: string[];
};

export type ListTaskResponse = {
    code: number;
    err_msg: string;
    task_list: TaskInfo[];
};


export type UpdateImageRequest = {
    token: string;
    name_space: string;
    service_id: string;
    image: string;
};

export type UpdateImageResponse = {
    code: number;
    err_msg: string;
};


export type UpdateScaleRequest = {
    token: string;
    name_space: string;
    service_id: string;
    scale: number;
};

export type UpdateScaleResponse = {
    code: number;
    err_msg: string;
};


export type GetNameSpacePermRequest = {
    token: string;
    name_space: string;
};

export type GetNameSpacePermResponse = {
    code: number;
    err_msg: string;
    perm: NameSpacePerm;
};


export type SetNameSpacePermRequest = {
    token: string;
    name_space: string;
    perm: NameSpacePerm;
};

export type SetNameSpacePermResponse = {
    code: number;
    err_msg: string;
};


export type OpenLogRequest = {
    token: string;
    name_space: string;
    container_id: string;
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
    name_space: string;
    container_id: string;
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

//列出所有命名空间
export async function list_name_space(servAddr: string, request: ListNameSpaceRequest): Promise<ListNameSpaceResponse> {
    const cmd = 'plugin:swarm_proxy_api|list_name_space';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListNameSpaceResponse>(cmd, {
        servAddr,
        request,
    });
}

//列出所有service
export async function list_service(servAddr: string, request: ListServiceRequest): Promise<ListServiceResponse> {
    const cmd = 'plugin:swarm_proxy_api|list_service';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListServiceResponse>(cmd, {
        servAddr,
        request,
    });
}

//列出所有task
export async function list_task(servAddr: string, request: ListTaskRequest): Promise<ListTaskResponse> {
    const cmd = 'plugin:swarm_proxy_api|list_task';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListTaskResponse>(cmd, {
        servAddr,
        request,
    });
}

//更新镜像
export async function update_image(servAddr: string, request: UpdateImageRequest): Promise<UpdateImageResponse> {
    const cmd = 'plugin:swarm_proxy_api|update_image';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<UpdateImageResponse>(cmd, {
        servAddr,
        request,
    });
}

//更新scale
export async function update_scale(servAddr: string, request: UpdateScaleRequest): Promise<UpdateScaleResponse> {
    const cmd = 'plugin:swarm_proxy_api|update_scale';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<UpdateScaleResponse>(cmd, {
        servAddr,
        request,
    });
}

//获取命名空间权限
export async function get_name_space_perm(servAddr: string, request: GetNameSpacePermRequest): Promise<GetNameSpacePermResponse> {
    const cmd = 'plugin:swarm_proxy_api|get_name_space_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<GetNameSpacePermResponse>(cmd, {
        servAddr,
        request,
    });
}

//设置命名空间权限
export async function set_name_space_perm(servAddr: string, request: SetNameSpacePermRequest): Promise<SetNameSpacePermResponse> {
    const cmd = 'plugin:swarm_proxy_api|set_name_space_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<SetNameSpacePermResponse>(cmd, {
        servAddr,
        request,
    });
}

//开始查看日志
export async function open_log(servAddr: string, request: OpenLogRequest): Promise<OpenLogResponse> {
    const cmd = 'plugin:swarm_proxy_api|open_log';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<OpenLogResponse>(cmd, {
        servAddr,
        request,
    });
}

//查看日志
export async function read_log(servAddr: string, request: ReadLogRequest): Promise<ReadLogResponse> {
    const cmd = 'plugin:swarm_proxy_api|read_log';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ReadLogResponse>(cmd, {
        servAddr,
        request,
    });
}

//打开终端
export async function open_term(servAddr: string, request: OpenTermRequest): Promise<OpenTermResponse> {
    const cmd = 'plugin:swarm_proxy_api|open_term';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<OpenTermResponse>(cmd, {
        servAddr,
        request,
    });
}

//写入终端
export async function write_term(servAddr: string, request: WriteTermRequest): Promise<WriteTermResponse> {
    const cmd = 'plugin:swarm_proxy_api|write_term';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<WriteTermResponse>(cmd, {
        servAddr,
        request,
    });
}

//读取终端
export async function read_term(servAddr: string, request: ReadTermRequest): Promise<ReadTermResponse> {
    const cmd = 'plugin:swarm_proxy_api|read_term';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ReadTermResponse>(cmd, {
        servAddr,
        request,
    });
}

//调整终端大小
export async function set_term_size(servAddr: string, request: SetTermSizeRequest): Promise<SetTermSizeResponse> {
    const cmd = 'plugin:swarm_proxy_api|set_term_size';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<SetTermSizeResponse>(cmd, {
        servAddr,
        request,
    });
}