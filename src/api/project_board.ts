import { invoke } from '@tauri-apps/api/tauri';

export type NODE_TYPE = number;
export const NODE_TYPE_REF: NODE_TYPE = 0;
export const NODE_TYPE_IMAGE: NODE_TYPE = 1;
export const NODE_TYPE_TEXT: NODE_TYPE = 2;
export const NODE_TYPE_MERMAID: NODE_TYPE = 3;


export type NODE_REF_TYPE = number;
export const NODE_REF_TYPE_TASK: NODE_REF_TYPE = 0;
export const NODE_REF_TYPE_BUG: NODE_REF_TYPE = 1;
export const NODE_REF_TYPE_REQUIRE_MENT: NODE_REF_TYPE = 2;
// export const NODE_REF_TYPE_PIPE_LINE: NODE_REF_TYPE = 3;  // CI/CD
export const NODE_REF_TYPE_API_COLL: NODE_REF_TYPE = 4;
export const NODE_REF_TYPE_DATA_ANNO: NODE_REF_TYPE = 5;

export type NodeRefData = {
    ref_type: NODE_REF_TYPE;
    ref_target_id: string;
};

export type NodeTextData = {
    data: string;
}

export type NodeImageData = {
    file_id: string;
};

export type NodeMermaidData = {
    data: string;
}

export type NodeData = {
    NodeRefData?: NodeRefData;
    NodeTextData?: NodeTextData;
    NodeImageData?: NodeImageData;
    NodeMermaidData?: NodeMermaidData;
};

export type Node = {
    node_id: string;
    node_type: NODE_TYPE;
    x: number;
    y: number;
    w: number;
    h: number;
    bg_color: string;
    in_edit: boolean;
    node_data: NodeData;
};

export type EdgeKey = {
    from_node_id: string;
    from_handle_id: string;
    to_node_id: string;
    to_handle_id: string;
};

export type Edge = {
    edge_key: EdgeKey;
    label: string;
};

export type CreateNodeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_type: NODE_TYPE;
    x: number;
    y: number;
    w: number;
    h: number;
    node_data: NodeData;
};


export type CreateNodeResponse = {
    code: number;
    err_msg: string;
    node_id: string;
};

export type UpdateNodePositionRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
    x: number;
    y: number;
};

export type UpdateNodePositionResponse = {
    code: number;
    err_msg: string;
};

export type UpdateNodeSizeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
    w: number;
    h: number;
};

export type UpdateNodeSizeResponse = {
    code: number;
    err_msg: string;
};

export type UpdateNodeBgColorRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
    bg_color: string;
};

export type UpdateNodeBgColorResponse = {
    code: number;
    err_msg: string;
};

export type StartUpdateContentRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
};

export type StartUpdateContentResponse = {
    code: number;
    err_msg: string;
};

export type KeepUpdateContentRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
};

export type KeepUpdateContentResponse = {
    code: number;
    err_msg: string;
};

export type EndUpdateContentRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
};

export type EndUpdateContentResponse = {
    code: number;
    err_msg: string;
};

export type UpdateContentRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
    node_data: NodeData;
};

export type UpdateContentResponse = {
    code: number;
    err_msg: string;
};

export type RemoveNodeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
};

export type RemoveNodeResponse = {
    code: number;
    err_msg: string;
};

export type ListNodeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
};

export type ListNodeResponse = {
    code: number;
    err_msg: string;
    node_list: Node[];
};

export type GetNodeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    node_id: string;
};

export type GetNodeResponse = {
    code: number;
    err_msg: string;
    node: Node;
};

export type CreateEdgeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    edge: Edge;
};

export type CreateEdgeResponse = {
    code: number;
    err_msg: string;
};

export type RemoveEdgeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    edge_key: EdgeKey;
};

export type RemoveEdgeResponse = {
    code: number;
    err_msg: string;
};

export type UpdateEdgeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    edge: Edge;
};

export type UpdateEdgeResponse = {
    code: number,
    err_msg: string;
};

export type ListEdgeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
};

export type ListEdgeResponse = {
    code: number;
    err_msg: string;
    edge_list: Edge[];
};

export type GetEdgeRequest = {
    session_id: string;
    project_id: string;
    board_id: string;
    edge_key: EdgeKey;
};

export type GetEdgeResponse = {
    code: number;
    err_msg: string;
    edge: Edge;
};

//创建节点
export async function create_node(request: CreateNodeRequest): Promise<CreateNodeResponse> {
    const cmd = 'plugin:project_board_api|create_node';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateNodeResponse>(cmd, {
        request,
    });
}

//更新节点位置
export async function update_node_position(request: UpdateNodePositionRequest): Promise<UpdateNodePositionResponse> {
    const cmd = 'plugin:project_board_api|update_node_position';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateNodePositionResponse>(cmd, {
        request,
    });
}

//更新节点大小
export async function update_node_size(request: UpdateNodeSizeRequest): Promise<UpdateNodeSizeResponse> {
    const cmd = 'plugin:project_board_api|update_node_size';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateNodeSizeResponse>(cmd, {
        request,
    });
}

//更新节点背景色
export async function update_node_bg_color(request: UpdateNodeBgColorRequest): Promise<UpdateNodeBgColorResponse> {
    const cmd = 'plugin:project_board_api|update_node_bg_color';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateNodeBgColorResponse>(cmd, {
        request,
    });
}

//开始更新内容
export async function start_update_content(request: StartUpdateContentRequest): Promise<StartUpdateContentResponse> {
    const cmd = 'plugin:project_board_api|start_update_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<StartUpdateContentResponse>(cmd, {
        request,
    });
}

//维持更新心跳
export async function keep_update_content(request: KeepUpdateContentRequest): Promise<KeepUpdateContentResponse> {
    const cmd = 'plugin:project_board_api|keep_update_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<KeepUpdateContentResponse>(cmd, {
        request,
    });
}

//结束更新内容
export async function end_update_content(request: EndUpdateContentRequest): Promise<EndUpdateContentResponse> {
    const cmd = 'plugin:project_board_api|end_update_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<EndUpdateContentResponse>(cmd, {
        request,
    });
}

//更新节点内容
export async function update_content(request: UpdateContentRequest): Promise<UpdateContentResponse> {
    const cmd = 'plugin:project_board_api|update_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateContentResponse>(cmd, {
        request,
    });
}

//删除节点
export async function remove_node(request: RemoveNodeRequest): Promise<RemoveNodeResponse> {
    const cmd = 'plugin:project_board_api|remove_node';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveNodeResponse>(cmd, {
        request,
    });
}

//列出节点
export async function list_node(request: ListNodeRequest): Promise<ListNodeResponse> {
    const cmd = 'plugin:project_board_api|list_node';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListNodeResponse>(cmd, {
        request,
    });
}

//获取单个节点
export async function get_node(request: GetNodeRequest): Promise<GetNodeResponse> {
    const cmd = 'plugin:project_board_api|get_node';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetNodeResponse>(cmd, {
        request,
    });
}

//创建连接
export async function create_edge(request: CreateEdgeRequest): Promise<CreateEdgeResponse> {
    const cmd = 'plugin:project_board_api|create_edge';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateEdgeResponse>(cmd, {
        request,
    });
}

//删除连接
export async function remove_edge(request: RemoveEdgeRequest): Promise<RemoveEdgeResponse> {
    const cmd = 'plugin:project_board_api|remove_edge';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveEdgeResponse>(cmd, {
        request,
    });
}

//更新连接
export async function update_edge(request: UpdateEdgeRequest): Promise<UpdateEdgeResponse> {
    const cmd = 'plugin:project_board_api|update_edge';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateEdgeResponse>(cmd, {
        request,
    });
}

//列出连接 列出连接
export async function list_edge(request: ListEdgeRequest): Promise<ListEdgeResponse> {
    const cmd = 'plugin:project_board_api|list_edge';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListEdgeResponse>(cmd, {
        request,
    });
}

//获取单个连接
export async function get_edge(request: GetEdgeRequest): Promise<GetEdgeResponse> {
    const cmd = 'plugin:project_board_api|get_edge';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetEdgeResponse>(cmd, {
        request,
    });
}