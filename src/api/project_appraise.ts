import { invoke } from '@tauri-apps/api/tauri';

export type MY_VOTE_STATE = number;
export const MY_VOTE_STATE_DONE: MY_VOTE_STATE = 0; //已完成投票
export const MY_VOTE_STATE_UNDONE: MY_VOTE_STATE = 1; //未完成

export type MemberInfo = {
    member_user_id: string;
    member_display_name: string;
    member_logo_uri: string;
};

export type BasicAppraiseInfo = {
    title: string;
    project_id: string;
};
export type AppraiseInfo = {
    appraise_id: string;
    basic_info: BasicAppraiseInfo;
    member_list: MemberInfo[];
    create_time: number;
    update_time: number;
    un_vote_member_count: number;
    ///创建人相关信息
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    ///当前用户投票状态
    has_my_vote_state: boolean;
    my_vote_state: MY_VOTE_STATE;
};

export type VoteItem = {
    target_user_id: string;
    score: number;
    target_display_name: string;
    target_logo_uri: string;
};

export type VoteInfo = {
    user_id: string;
    appraise_id: string;
    item_list: VoteItem[],
};

export type CreateRequest = {
    session_id: string;
    basic_info: BasicAppraiseInfo;
    member_user_id_list: string[];
};

export type CreateResponse = {
    code: number;
    err_msg: string;
    appraise_id: string;
};

export type UpdateRequest = {
    session_id: string;
    appraise_id: string;
    basic_info: BasicAppraiseInfo;
};

export type UpdateResponse = {
    code: number;
    err_msg: string;
};


export type GetResponse = {
    code: number;
    err_msg: string;
    info: AppraiseInfo;
};

export type ListRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: AppraiseInfo[];
};



export type RemoveResponse = {
    code: number;
    err_msg: string;
};

export type BasicVoteItem = {
    target_user_id: string;
    score: number;
};

export type SetVoteDraftRequest = {
    session_id: string;
    project_id: string;
    appraise_id: string;
    vote_item_list: BasicVoteItem[];
};

export type SetVoteDraftResponse = {
    code: number;
    err_msg: string;
};

export type GetVoteDraftResponse = {
    code: number;
    err_msg: string;
    vote_info: VoteInfo;
};

export type VoteRequest = {
    session_id: string;
    project_id: string;
    appraise_id: string;
    vote_item_list: BasicVoteItem[];
};

export type VoteResponse = {
    code: number;
    err_msg: string;
};

export type RevokeVoteRequest = {
    session_id: string;
    project_id: string;
    appraise_id: string;
};

export type RevokeVoteResponse = {
    code: number;
    err_msg: string;
};


export type GetMyVoteResponse = {
    code: number;
    err_msg: string;
    vote_info: VoteInfo;
};


export type UserScoreInfo = {
    user_id: string;
    display_name: string;
    logo_uri: string;
    total_score: number;
    vote_count: number;
    has_min_score: boolean;
    min_score: number;
    has_max_score: boolean;
    max_score: number;
};

export type ListScoreRequest = {
    session_id: string;
    project_id: string;
    use_appraise_id: boolean;
    appraise_id: string;
}

export type ListScoreResponse = {
    code: number;
    err_msg: string;
    score_info_list: UserScoreInfo[];
};

export type ListByVoteStateRequest = {
    session_id: string;
    project_id: string;
    my_vote_state_list: MY_VOTE_STATE[];
    offset: number;
    limit: number;
};

export type ListByVoteStateResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: AppraiseInfo[];
};

export type GetMemberStateResponse = {
    code: number;
    err_msg: string;
    done_count: number;
    un_done_count: number;
};

//创建评估
export async function create(request: CreateRequest): Promise<CreateResponse> {
    const cmd = "plugin:project_appraise_api|create";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateResponse>(cmd, {
        request: request,
    });
}

//更新评估
export async function update(request: UpdateRequest): Promise<UpdateResponse> {
    const cmd = "plugin:project_appraise_api|update";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateResponse>(cmd, {
        request: request,
    });
}
//获取评估
export async function get(
    session_id: string,
    project_id: string,
    appraise_id: string): Promise<GetResponse> {
    const cmd = "plugin:project_appraise_api|get";
    const request = {
        session_id: session_id,
        project_id: project_id,
        appraise_id: appraise_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResponse>(cmd, {
        request: request,
    });
}

//列出评估
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = "plugin:project_appraise_api|list";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request: request,
    });
}

//根据我的投票状态列出评估
export async function list_by_vote_state(request: ListByVoteStateRequest): Promise<ListByVoteStateResponse> {
    const cmd = "plugin:project_appraise_api|list_by_vote_state";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListByVoteStateResponse>(cmd, {
        request: request,
    });
}

//删除评估
export async function remove(
    session_id: string,
    project_id: string,
    appraise_id: string): Promise<RemoveResponse> {
    const request = {
        session_id: session_id,
        project_id: project_id,
        appraise_id: appraise_id,
    };
    const cmd = "plugin:project_appraise_api|remove";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request: request,
    });
}

//保存投票草稿
export async function set_vote_draft(request: SetVoteDraftRequest): Promise<SetVoteDraftResponse> {
    const cmd = "plugin:project_appraise_api|set_vote_draft";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetVoteDraftResponse>(cmd, {
        request: request,
    });
}

//读取投票草稿
export async function get_vote_draft(
    session_id: string,
    project_id: string,
    appraise_id: string): Promise<GetVoteDraftResponse> {
    const request = {
        session_id: session_id,
        project_id: project_id,
        appraise_id: appraise_id,
    };
    const cmd = "plugin:project_appraise_api|get_vote_draft";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetVoteDraftResponse>(cmd, {
        request: request,
    });
}

//投票
export async function vote(request: VoteRequest): Promise<VoteResponse> {
    const cmd = "plugin:project_appraise_api|vote";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<VoteResponse>(cmd, {
        request: request,
    });
}

//撤回投票
export async function revoke_vote(request: RevokeVoteRequest): Promise<RevokeVoteResponse> {
    const cmd = "plugin:project_appraise_api|revoke_vote";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RevokeVoteResponse>(cmd, {
        request: request,
    });
}



//查看我的投票
export async function get_my_vote(
    session_id: string,
    project_id: string,
    appraise_id: string): Promise<GetMyVoteResponse> {
    const cmd = "plugin:project_appraise_api|get_my_vote";
    const request = {
        session_id: session_id,
        project_id: project_id,
        appraise_id: appraise_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetMyVoteResponse>(cmd, {
        request: request,
    });
}

//查看项目成员或评估得分
export async function list_score(request: ListScoreRequest): Promise<ListScoreResponse> {
    const cmd = "plugin:project_appraise_api|list_score";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListScoreResponse>(cmd, {
        request: request,
    });
}

//获取成员状态
export async function get_member_state(session_id: string, project_id: string): Promise<GetMemberStateResponse> {
    const request = {
        session_id: session_id,
        project_id: project_id,
    };
    const cmd = "plugin:project_appraise_api|get_member_state";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetMemberStateResponse>(cmd, {
        request: request,
    });
}