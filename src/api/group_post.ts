import { invoke } from '@tauri-apps/api/tauri';

export type PostKeyInfo = {
    post_id: string;
    title: string;
    tag_list: string[];
    essence: boolean;///精华帖
    comment_count: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
};

export type CommentInfo = {
    comment_id: string;
    content: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
};

export type AddPostRequest = {
    session_id: string;
    group_id: string;
    title: string;
    content: string;
    tag_list: string[];
};

export type AddPostResponse = {
    code: number;
    err_msg: string;
    post_id: string;
};

export type UpdatePostContentRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
    title: string;
    content: string;
};

export type UpdatePostContentResponse = {
    code: number;
    err_msg: string;
};


export type UpdatePostTagRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
    tag_list: string[];
};

export type UpdatePostTagResponse = {
    code: number;
    err_msg: string;
};


export type UpdatePostEssenceRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
    essence: boolean;
};

export type UpdatePostEssenceResponse = {
    code: number;
    err_msg: string;
};


export type RemovePostRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
};

export type RemovePostResponse = {
    code: number;
    err_msg: string;
};

export type ListPostKeyRequest = {
    session_id: string;
    group_id: string;
    filter_essence: boolean;
    filter_by_tag: boolean;
    tag: string;
    offset: number;
    limit: number;
};

export type ListPostKeyResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    post_key_list: PostKeyInfo[];
};

export type GetPostRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
};

export type GetPostResponse = {
    code: number;
    err_msg: string;
    post_key: PostKeyInfo;
    content: string;
};

export type AddCommentRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
    content: string;
};

export type AddCommentResponse = {
    code: number;
    err_msg: string;
    comment_id: string;
};

export type ListCommentRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
    offset: number;
    limit: number;
};

export type ListCommentResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    comment_list: CommentInfo[];
};

export type UpdateCommentRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
    comment_id: string;
    content: string;
};

export type UpdateCommentResponse = {
    code: number;
    err_msg: string;
};


export type RemoveCommentRequest = {
    session_id: string;
    group_id: string;
    post_id: string;
    comment_id: string;
};

export type RemoveCommentResponse = {
    code: number;
    err_msg: string;
};

//发帖
export async function add_post(request: AddPostRequest): Promise<AddPostResponse> {
    const cmd = 'plugin:group_post_api|add_post';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddPostResponse>(cmd, {
        request,
    });
}

//更新帖子内容
export async function update_post_content(request: UpdatePostContentRequest): Promise<UpdatePostContentResponse> {
    const cmd = 'plugin:group_post_api|update_post_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePostContentResponse>(cmd, {
        request,
    });
}

//更新帖子标签
export async function update_post_tag(request: UpdatePostTagRequest): Promise<UpdatePostTagResponse> {
    const cmd = 'plugin:group_post_api|update_post_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePostTagResponse>(cmd, {
        request,
    });
}

//标记精华
export async function update_post_essence(request: UpdatePostEssenceRequest): Promise<UpdatePostEssenceResponse> {
    const cmd = 'plugin:group_post_api|update_post_essence';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePostEssenceResponse>(cmd, {
        request,
    });
}

//删除帖子
export async function remove_post(request: RemovePostRequest): Promise<RemovePostResponse> {
    const cmd = 'plugin:group_post_api|remove_post';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemovePostResponse>(cmd, {
        request,
    });
}

//列出帖子
export async function list_post_key(request: ListPostKeyRequest): Promise<ListPostKeyResponse> {
    const cmd = 'plugin:group_post_api|list_post_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListPostKeyResponse>(cmd, {
        request,
    });
}

//获取帖子详情
export async function get_post(request: GetPostRequest): Promise<GetPostResponse> {
    const cmd = 'plugin:group_post_api|get_post';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetPostResponse>(cmd, {
        request,
    });
}

//新增评论
export async function add_comment(request: AddCommentRequest): Promise<AddCommentResponse> {
    const cmd = 'plugin:group_post_api|add_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddCommentResponse>(cmd, {
        request,
    });
}

//列出评论
export async function list_comment(request: ListCommentRequest): Promise<ListCommentResponse> {
    const cmd = 'plugin:group_post_api|list_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCommentResponse>(cmd, {
        request,
    });
}

//更新评论
export async function update_comment(request: UpdateCommentRequest): Promise<UpdateCommentResponse> {
    const cmd = 'plugin:group_post_api|update_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateCommentResponse>(cmd, {
        request,
    });
}

//删除评论
export async function remove_comment(request: RemoveCommentRequest): Promise<RemoveCommentResponse> {
    const cmd = 'plugin:group_post_api|remove_comment';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveCommentResponse>(cmd, {
        request,
    });
}