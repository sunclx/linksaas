import { invoke } from '@tauri-apps/api/tauri';

export type AnnoResult = {
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
    result: string;
}

export type MemberInfo = {
    member_user_id: string;
    display_name: string;
    logo_uri: string;
    task_count: number;
    done_count: number;
    is_member?: boolean;
};

export type TaskInfo = {
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
    content: string;
    store_as_file: boolean;
    file_ext: string;
    done: boolean;
};

export type AddMemberRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
};

export type AddMemberResponse = {
    code: number;
    err_msg: string;
};


export type ListMemberRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
};

export type ListMemberResponse = {
    code: number;
    err_msg: string;
    info_list: MemberInfo[];
};


export type RemoveMemberRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
};

export type RemoveMemberResponse = {
    code: number;
    err_msg: string;
};


export type SetTaskCountRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    task_count: number;
};

export type SetTaskCountResponse = {
    code: number;
    err_msg: string;
}


export type ListTaskRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    filter_by_done: boolean;
    done: boolean;
};

export type ListTaskResponse = {
    code: number;
    err_msg: string;
    info_list: TaskInfo[];
}


export type SetResultRequest = {
    session_id: string;
    project_id: string;
    result: AnnoResult;
};

export type SetResultResponse = {
    code: number;
    err_msg: string;
};


export type SetResultStateRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
    done: boolean;
};

export type SetResultStateResponse = {
    code: number;
    err_msg: string;
};


export type GetResultRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
};

export type GetResultResponse = {
    code: number;
    err_msg: string;
    result: AnnoResult;
};

//增加标注成员
export async function add_member(request: AddMemberRequest): Promise<AddMemberResponse> {
    const cmd = 'plugin:data_anno_task_api|add_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddMemberResponse>(cmd, {
        request,
    });
}

//列出标注成员
export async function list_member(request: ListMemberRequest): Promise<ListMemberResponse> {
    const cmd = 'plugin:data_anno_task_api|list_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMemberResponse>(cmd, {
        request,
    });
}

//删除标注成员
export async function remove_member(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    const cmd = 'plugin:data_anno_task_api|remove_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveMemberResponse>(cmd, {
        request,
    });
}

//设置成员标注量
export async function set_task_count(request: SetTaskCountRequest): Promise<SetTaskCountResponse> {
    const cmd = 'plugin:data_anno_task_api|set_task_count';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetTaskCountResponse>(cmd, {
        request,
    });
}

//列出标注任务
export async function list_task(request: ListTaskRequest): Promise<ListTaskResponse> {
    const cmd = 'plugin:data_anno_task_api|list_task';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListTaskResponse>(cmd, {
        request,
    });
}

//设置标注结果
export async function set_result(request: SetResultRequest): Promise<SetResultResponse> {
    const cmd = 'plugin:data_anno_task_api|set_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetResultResponse>(cmd, {
        request,
    });
}

//更新标注状态
export async function set_result_state(request: SetResultStateRequest): Promise<SetResultStateResponse> {
    const cmd = 'plugin:data_anno_task_api|set_result_state';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetResultStateResponse>(cmd, {
        request,
    });
}

//获取标注结果
export async function get_result(request: GetResultRequest): Promise<GetResultResponse> {
    const cmd = 'plugin:data_anno_task_api|get_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResultResponse>(cmd, {
        request,
    });
}

//导出结果
export async function export_result(result: AnnoResult, destPath: string): Promise<void> {
    const cmd = 'plugin:data_anno_task_api|export_result';
    const request = {
        result,
        destPath,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, request);
}