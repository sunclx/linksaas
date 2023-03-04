import { invoke } from '@tauri-apps/api/tauri';

export type CONTENT_TYPE = number;
export const CONTENT_TYPE_MARKDOWN: CONTENT_TYPE = 0;
export const CONTENT_TYPE_TEXT: CONTENT_TYPE = 1;


export type Comment = {
    comment_id: string;
    thread_id: string;
    content_type: CONTENT_TYPE;
    content: string;
    user_id: string;
    user_display_name: string;
    user_logo_uri: string;
    create_time: number;
    update_time: number;
    can_update: boolean;
    can_remove: boolean;
};

export type AddCommentRequest = {
    session_id: string;
    project_id: string;
    thread_id: string;
    content_type: CONTENT_TYPE;
    content: string;
};

export type AddCommentResponse = {
    code: number;
    err_msg: string;
    comment_id: string;
};


export type UpdateCommentRequest = {
    session_id: string;
    project_id: string;
    comment_id: string;
    content_type: CONTENT_TYPE;
    content: string;
};

export type UpdateCommentResponse = {
    code: number;
    err_msg: string;
};


export type ListCommentRequest = {
    session_id: string;
    project_id: string;
    thread_id: string;
};

export type ListCommentResponse = {
    code: number;
    err_msg: string;
    comment_list: Comment[];
};


export type GetCommentRequest = {
    session_id: string;
    project_id: string;
    comment_id: string;
};

export type GetCommentResponse = {
    code: number;
    err_msg: string;
    comment: Comment;
};


export type RemoveCommentRequest = {
    session_id: string;
    project_id: string;
    comment_id: string;
};

export type RemoveCommentResponse = {
    code: number;
    err_msg: string;
};

//创建代码评论
export async function add_comment(request: AddCommentRequest): Promise<AddCommentResponse> {
    const cmd = 'plugin:project_code_api|add_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddCommentResponse>(cmd, {
        request,
    });
}

//更新代码评论
export async function update_comment(request: UpdateCommentRequest): Promise<UpdateCommentResponse> {
    const cmd = 'plugin:project_code_api|update_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateCommentResponse>(cmd, {
        request,
    });
}

//列出代码评论
export async function list_comment(request: ListCommentRequest): Promise<ListCommentResponse> {
    const cmd = 'plugin:project_code_api|list_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCommentResponse>(cmd, {
        request,
    });
}

//获取单个代码评论
export async function get_comment(request: GetCommentRequest): Promise<GetCommentResponse> {
    const cmd = 'plugin:project_code_api|get_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetCommentResponse>(cmd, {
        request,
    });
}

//删除代码评论
export async function remove_comment(request: RemoveCommentRequest): Promise<RemoveCommentResponse> {
    const cmd = 'plugin:project_code_api|remove_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveCommentResponse>(cmd, {
        request,
    });
}