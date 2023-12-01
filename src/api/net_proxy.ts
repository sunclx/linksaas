import { invoke } from '@tauri-apps/api/tauri';

export type ProxyInfo = {
    project_id: string;
    endpoint_name: string;
    port: number;
};

export type EndPoint = {
    end_point_id: string;
    end_point_name: string;
};

export type ListEndPointRequest = {
    token: string;
};

export type ListEndPointResponse = {
    code: number;
    err_msg: string;
    end_point_list: EndPoint[];
}


export type CreateTunnelRequest = {
    token: string;
    end_point_id: string;
    password: string;
};

export type CreateTunnelResponse = {
    code: number;
    err_msg: string;
    tunnel_id: string;
};

//列出目标端点
export async function list_end_point(servAddr: string, request: ListEndPointRequest): Promise<ListEndPointResponse> {
    const cmd = 'plugin:net_proxy_api|list_end_point';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListEndPointResponse>(cmd, {
        servAddr,
        request,
    });
}

//创建通道
export async function create_tunnel(servAddr: string, request: CreateTunnelRequest): Promise<CreateTunnelResponse> {
    const cmd = 'plugin:net_proxy_api|create_tunnel';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<CreateTunnelResponse>(cmd, {
        servAddr,
        request,
    });
}

//开始本地监听
export async function start_listen(proxy_addr: string, tunnel_id: string, project_id: string, endpoint_name: string, port: number): Promise<void> {
    const cmd = 'plugin:net_proxy_api|start_listen';
    const request = {
        proxyAddr: proxy_addr,
        tunnelId: tunnel_id,
        projectId: project_id,
        endpointName: endpoint_name,
        port,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, request);
}

//停止本地监听
export async function stop_listen(port: number): Promise<void> {
    const cmd = 'plugin:net_proxy_api|stop_listen';
    const request = {
        port,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, request);
}

//列出所有本地监听                
export async function list_all_listen(): Promise<ProxyInfo[]> {
    const cmd = 'plugin:net_proxy_api|list_all_listen';
    return invoke<ProxyInfo[]>(cmd, {});
}