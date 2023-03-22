import { invoke } from '@tauri-apps/api/tauri';

export type APPRAISE_TYPE = number;
export const APPRAISE_AGREE: APPRAISE_TYPE = 0;
export const APPRAISE_DIS_AGREE: APPRAISE_TYPE = 1;

export type IDEA_SORT_TYPE = number;
export const IDEA_SORT_UPDATE_TIME: IDEA_SORT_TYPE = 0;
export const IDEA_SORT_APPRAISE: IDEA_SORT_TYPE = 1;

export type KEYWORD_SEARCH_TYPE = number;
export const KEYWORD_SEARCH_AND: KEYWORD_SEARCH_TYPE = 0;
export const KEYWORD_SEARCH_OR: KEYWORD_SEARCH_TYPE = 1;


export type BasicIdeaTag = {
    tag_name: string;
    tag_color: string;
};

export type IdeaTag = {
    tag_id: string;
    basic_info: BasicIdeaTag;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_time: number;
};

export type BasicIdea = {
    title: string;
    content: string;
    tag_id_list: string[];
    keyword_list: string[];
};

export type UserPerm = {
    can_update: boolean;
    can_remove: boolean;
    can_change_lock: boolean;
    can_appraise: boolean;
};

export type SimpleIdeaTag = {
    tag_id: string;
    tag_name: string;
    tag_color: string;
};

export type Idea = {
    idea_id: string;
    basic_info: BasicIdea;
    tag_list: SimpleIdeaTag[];
    agree_count: number;
    disagree_count: number;
    locked: boolean;
    user_perm: UserPerm;
    has_my_appraise: boolean;
    my_appraise_type: APPRAISE_TYPE;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    create_time: number;
    update_time: number;
};

export type ListIdeaParam = {
    filter_by_tag: boolean;
    tag_id_list: string[];
    filter_by_keyword: boolean;
    keyword_list: string[];
    keyword_search_type: KEYWORD_SEARCH_TYPE;
};

export type Appraise = {
    member_user_id: string;
    member_display_name: string;
    member_logo_uri: string;
    appraise_type: APPRAISE_TYPE;
    time_stamp: number;
};

export type CreateTagRequest = {
    session_id: string;
    project_id: string;
    basic_info: BasicIdeaTag;
};

export type CreateTagResponse = {
    code: number;
    err_msg: string;
    tag_id: string;
};


export type UpdateTagRequest = {
    session_id: string;
    project_id: string;
    tag_id: string;
    basic_info: BasicIdeaTag;
};

export type UpdateTagResponse = {
    code: number;
    err_msg: string;
};

export type RemoveTagRequest = {
    session_id: string;
    project_id: string;
    tag_id: string;
};

export type RemoveTagResponse = {
    code: number;
    err_msg: string;
};

export type GetTagRequest = {
    session_id: string;
    project_id: string;
    tag_id: string;
};

export type GetTagResponse = {
    code: number;
    err_msg: string;
    tag: IdeaTag;
};

export type ListTagRequest = {
    session_id: string;
    project_id: string;
};

export type ListTagResponse = {
    code: number;
    err_msg: string;
    tag_list: IdeaTag[];
};


export type CreateIdeaRequest = {
    session_id: string;
    project_id: string;
    basic_info: BasicIdea;
};

export type CreateIdeaResponse = {
    code: number;
    err_msg: string;
    idea_id: string;
};


export type UpdateIdeaContentRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
    title: string;
    content: string;
};

export type UpdateIdeaContentResponse = {
    code: number;
    err_msg: string;
};


export type UpdateIdeaTagRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
    tag_id_list: string[];
};

export type UpdateIdeaTagResponse = {
    code: number;
    err_msg: string;
};


export type UpdateIdeaKeywordRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
    keyword_list: string[];
};

export type UpdateIdeaKeywordResponse = {
    code: number;
    err_msg: string;
};


export type GetIdeaRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
};

export type GetIdeaResponse = {
    code: number;
    err_msg: string;
    idea: Idea;
};


export type ListIdeaRequest = {
    session_id: string;
    project_id: string;
    list_param: ListIdeaParam;
    sort_type: IDEA_SORT_TYPE;
    offset: number;
    limit: number;
};

export type ListIdeaResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    idea_list: Idea[];
}


export type LockIdeaRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
};

export type LockIdeaResponse = {
    code: number;
    err_msg: string;
}


export type UnlockIdeaRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
};

export type UnlockIdeaResponse = {
    code: number;
    err_msg: string;
};


export type RemoveIdeaRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
};

export type RemoveIdeaResponse = {
    code: number;
    err_msg: string;
};


export type ListAllKeywordRequest = {
    session_id: string;
    project_id: string;
};

export type ListAllKeywordResponse = {
    code: number;
    err_msg: string;
    keyword_list: string[];
};


export type SetAppraiseRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
    appraise_type: APPRAISE_TYPE;
};

export type SetAppraiseResponse = {
    code: number;
    err_msg: string;
};

export type CancelAppraiseRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
};

export type CancelAppraiseResponse = {
    code: number;
    err_msg: string;
};


export type ListAppraiseRequest = {
    session_id: string;
    project_id: string;
    idea_id: string;
};

export type ListAppraiseResponse = {
    code: number;
    err_msg: string;
    appraise_list: Appraise[];
}

//创建标签
export async function create_tag(request: CreateTagRequest): Promise<CreateTagResponse> {
    const cmd = 'plugin:project_idea_api|create_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateTagResponse>(cmd, {
        request,
    });
}

//修改标签
export async function update_tag(request: UpdateTagRequest): Promise<UpdateTagResponse> {
    const cmd = 'plugin:project_idea_api|update_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateTagResponse>(cmd, {
        request,
    });
}

//删除标签
export async function remove_tag(request: RemoveTagRequest): Promise<RemoveTagResponse> {
    const cmd = 'plugin:project_idea_api|remove_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveTagResponse>(cmd, {
        request,
    });
}

//获取单个标签
export async function get_tag(request: GetTagRequest): Promise<GetTagResponse> {
    const cmd = 'plugin:project_idea_api|get_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetTagResponse>(cmd, {
        request,
    });
}
//列出标签
export async function list_tag(request: ListTagRequest): Promise<ListTagResponse> {
    const cmd = 'plugin:project_idea_api|list_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListTagResponse>(cmd, {
        request,
    });
}

//创建点子
export async function create_idea(request: CreateIdeaRequest): Promise<CreateIdeaResponse> {
    const cmd = 'plugin:project_idea_api|create_idea';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateIdeaResponse>(cmd, {
        request,
    });
}

//更新点子内容
export async function update_idea_content(request: UpdateIdeaContentRequest): Promise<UpdateIdeaContentResponse> {
    const cmd = 'plugin:project_idea_api|update_idea_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateIdeaContentResponse>(cmd, {
        request,
    });
}

//更新点子标签
export async function update_idea_tag(request: UpdateIdeaTagRequest): Promise<UpdateIdeaTagResponse> {
    const cmd = 'plugin:project_idea_api|update_idea_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateIdeaTagResponse>(cmd, {
        request,
    });
}

//更新点子关键词
export async function update_idea_keyword(request: UpdateIdeaKeywordRequest): Promise<UpdateIdeaKeywordResponse> {
    const cmd = 'plugin:project_idea_api|update_idea_keyword';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateIdeaKeywordResponse>(cmd, {
        request,
    });
}

//获取点子
export async function get_idea(request: GetIdeaRequest): Promise<GetIdeaResponse> {
    const cmd = 'plugin:project_idea_api|get_idea';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetIdeaResponse>(cmd, {
        request,
    });
}

//列出点子
export async function list_idea(request: ListIdeaRequest): Promise<ListIdeaResponse> {
    const cmd = 'plugin:project_idea_api|list_idea';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListIdeaResponse>(cmd, {
        request,
    });
}

//锁定点子
export async function lock_idea(request: LockIdeaRequest): Promise<LockIdeaResponse> {
    const cmd = 'plugin:project_idea_api|lock_idea';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<LockIdeaResponse>(cmd, {
        request,
    });
}

//解锁点子
export async function unlock_idea(request: UnlockIdeaRequest): Promise<UnlockIdeaResponse> {
    const cmd = 'plugin:project_idea_api|unlock_idea';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UnlockIdeaResponse>(cmd, {
        request,
    });
}

//删除点子
export async function remove_idea(request: RemoveIdeaRequest): Promise<RemoveIdeaResponse> {
    const cmd = 'plugin:project_idea_api|remove_idea';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveIdeaResponse>(cmd, {
        request,
    });
}

//获取所有关键词
export async function list_all_keyword(request: ListAllKeywordRequest): Promise<ListAllKeywordResponse> {
    const cmd = 'plugin:project_idea_api|list_all_keyword';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAllKeywordResponse>(cmd, {
        request,
    });
}

//设置评价
export async function set_appraise(request: SetAppraiseRequest): Promise<SetAppraiseResponse> {
    const cmd = 'plugin:project_idea_api|set_appraise';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetAppraiseResponse>(cmd, {
        request,
    });
}

//取消评价
export async function cancel_appraise(request: CancelAppraiseRequest): Promise<CancelAppraiseResponse> {
    const cmd = 'plugin:project_idea_api|cancel_appraise';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CancelAppraiseResponse>(cmd, {
        request,
    });
}

//列出评价
export async function list_appraise(request: ListAppraiseRequest): Promise<ListAppraiseResponse> {
    const cmd = 'plugin:project_idea_api|list_appraise';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAppraiseResponse>(cmd, {
        request,
    });
}