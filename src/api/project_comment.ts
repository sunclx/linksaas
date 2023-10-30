import { invoke } from '@tauri-apps/api/tauri';

export type COMMENT_TARGET_TYPE = number;
export const COMMENT_TARGET_ENTRY: COMMENT_TARGET_TYPE = 0;         //内容入口
export const COMMENT_TARGET_REQUIRE_MENT: COMMENT_TARGET_TYPE = 1;  //项目需求
export const COMMENT_TARGET_TASK: COMMENT_TARGET_TYPE = 2;          //任务
export const COMMENT_TARGET_BUG: COMMENT_TARGET_TYPE = 3;           //缺陷
export const COMMENT_TARGET_CI_CD: COMMENT_TARGET_TYPE = 4;         // CI/CD
export const COMMENT_TARGET_API_COLL: COMMENT_TARGET_TYPE = 5;      // API集合
export const COMMENT_TARGET_DATA_ANNO: COMMENT_TARGET_TYPE = 6;     // 数据标注

export type Comment = {
    comment_id: string;
    send_user_id: string;
    send_display_name: string;
    send_logo_uri: string;
    send_time: number;
    content: string;
};

export type UnReadInfo = {
    target_type: COMMENT_TARGET_TYPE;
    target_id: string;
    title: string;
};

export type AddCommentRequest = {
    session_id: string;
    project_id: string;
    target_type: COMMENT_TARGET_TYPE;
    target_id: string;
    content: string;
};

export type AddCommentResponse = {
    code: number;
    err_msg: string;
    comment_id: string;
};

export type ListCommentRequest = {
    session_id: string;
    project_id: string;
    target_type: COMMENT_TARGET_TYPE;
    target_id: string;
    offset: number;
    limit: number;
};

export type ListCommentResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    comment_list: Comment[];
};

export type UpdateCommentRequest = {
    session_id: string;
    project_id: string;
    target_type: COMMENT_TARGET_TYPE;
    target_id: string;
    comment_id: string;
    content: string;
};

export type UpdateCommentResponse = {
    code: number;
    err_msg: string;
};

export type RemoveCommentRequest = {
    session_id: string;
    project_id: string;
    target_type: COMMENT_TARGET_TYPE;
    target_id: string;
    comment_id: string;
};

export type RemoveCommentResponse = {
    code: number;
    err_msg: string;
};


export type GetUnReadStateRequest = {
    session_id: string;
    project_id: string;
};

export type GetUnReadStateResponse = {
    code: number;
    err_msg: string;
    un_read_count: number;
};

export type CheckUnReadRequest = {
    session_id: string;
    project_id: string;
    target_type: COMMENT_TARGET_TYPE;
    target_id: string;
};

export type CheckUnReadResponse = {
    code: number;
    err_msg: string;
    has_un_read: boolean;
};

export type ListUnReadRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListUnReadResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    un_read_info_list: UnReadInfo[];
};


export type RemoveUnReadRequest = {
    session_id: string;
    project_id: string;
    target_type: COMMENT_TARGET_TYPE;
    target_id: string;
};

export type RemoveUnReadResponse = {
    code: number;
    err_msg: string;
};

//新增评论
export async function add_comment(request: AddCommentRequest): Promise<AddCommentResponse> {
    const cmd = 'plugin:project_comment_api|add_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddCommentResponse>(cmd, {
        request,
    });
}

//列出评论
export async function list_comment(request: ListCommentRequest): Promise<ListCommentResponse> {
    const cmd = 'plugin:project_comment_api|list_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCommentResponse>(cmd, {
        request,
    });
}

//更新评论
export async function update_comment(request: UpdateCommentRequest): Promise<UpdateCommentResponse> {
    const cmd = 'plugin:project_comment_api|update_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateCommentResponse>(cmd, {
        request,
    });
}

//删除评论
export async function remove_comment(request: RemoveCommentRequest): Promise<RemoveCommentResponse> {
    const cmd = 'plugin:project_comment_api|remove_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveCommentResponse>(cmd, {
        request,
    });
}

//获取未读状态
export async function get_un_read_state(request: GetUnReadStateRequest): Promise<GetUnReadStateResponse> {
    const cmd = 'plugin:project_comment_api|get_un_read_state';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetUnReadStateResponse>(cmd, {
        request,
    });
}

//检查是否存在未读信息
export async function check_un_read(request: CheckUnReadRequest): Promise<CheckUnReadResponse> {
    const cmd = 'plugin:project_comment_api|check_un_read';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CheckUnReadResponse>(cmd, {
        request,
    });
}

//列出未读信息
export async function list_un_read(request: ListUnReadRequest): Promise<ListUnReadResponse> {
    const cmd = 'plugin:project_comment_api|list_un_read';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListUnReadResponse>(cmd, {
        request,
    });
}

//删除未读信息
export async function remove_un_read(request: RemoveUnReadRequest): Promise<RemoveUnReadResponse> {
    const cmd = 'plugin:project_comment_api|remove_un_read';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveUnReadResponse>(cmd, {
        request,
    });
}