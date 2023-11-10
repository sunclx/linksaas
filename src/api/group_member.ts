import { invoke } from '@tauri-apps/api/tauri';

export type GroupMemberPerm = {
    can_invite: boolean;///邀请成员
    can_list_member: boolean;///列出成员
    can_remove_member: boolean;///移除成员
    can_update_member: boolean;///更新成员信息
    can_add_post: boolean;///发帖
    can_update_post: boolean;///更新帖子(所有用户)
    can_remove_post: boolean;///删除帖子(所有用户)
    can_mark_essence: boolean;///标记精华帖
    can_add_comment: boolean;///发布评论
    can_remove_comment: boolean;///删除帖子评论(所有用户)
    can_update_comment: boolean; ///更新帖子评论(所有用户)
};

export type GroupMemberInfo = {
    member_user_id: string;
    member_display_name: string;
    member_logo_uri: string;
    perm: GroupMemberPerm;
    join_time: number;
};

export type InviteInfo = {
    invite_code: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    expire_time: number;
};

export type GenInviteRequest = {
    session_id: string;
    group_id: string;
    ttl: number; //单位小时
};

export type GenInviteResponse = {
    code: number;
    err_msg: string;
    invite_code: string;
};


export type ListInviteRequest = {
    session_id: string;
    group_id: string;
    offset: number;
    limit: number;
};

export type ListInviteResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    invite_list: InviteInfo[];
};

export type RemoveInviteRequest = {
    session_id: string;
    group_id: string;
    invite_code: string;
};

export type RemoveInviteResponse = {
    code: number;
    err_msg: string;
};


export type JoinRequest = {
    session_id: string;
    invite_code: string;
};

export type JoinResponse = {
    code: number;
    err_msg: string;
};


export type JoinPubRequest = {
    session_id: string;
    group_id: string;
};

export type JoinPubResponse = {
    code: number;
    err_msg: string;
};

export type LeaveRequest = {
    session_id: string;
    group_id: string;
};

export type LeaveResponse = {
    code: number;
    err_msg: string;
};


export type RemoveMemberRequest = {
    session_id: string;
    group_id: string;
    member_user_id: string;
};

export type RemoveMemberResponse = {
    code: number;
    err_msg: string;
};


export type ListMemberRequest = {
    session_id: string;
    group_id: string;
    offset: number;
    limit: number;
};

export type ListMemberResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    member_list: GroupMemberInfo[];
};

export type GetMemberRequest = {
    session_id: string;
    group_id: string;
    member_user_id: string;
};

export type GetMemberResponse = {
    code: number;
    err_msg: string;
    member: GroupMemberInfo;
};

export type UpdateMemberRequest = {
    session_id: string;
    group_id: string;
    member_user_id: string;
    perm: GroupMemberPerm;
};

export type UpdateMemberResponse = {
    code: number;
    err_msg: string;
};

//生成邀请码
export async function gen_invite(request: GenInviteRequest): Promise<GenInviteResponse> {
    const cmd = 'plugin:group_member_api|gen_invite';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GenInviteResponse>(cmd, {
        request,
    });
}

//列出邀请码
export async function list_invite(request: ListInviteRequest): Promise<ListInviteResponse> {
    const cmd = 'plugin:group_member_api|list_invite';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListInviteResponse>(cmd, {
        request,
    });
}

//删除邀请码
export async function remove_invite(request: RemoveInviteRequest): Promise<RemoveInviteResponse> {
    const cmd = 'plugin:group_member_api|remove_invite';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveInviteResponse>(cmd, {
        request,
    });
}

//加入
export async function join(request: JoinRequest): Promise<JoinResponse> {
    const cmd = 'plugin:group_member_api|join';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<JoinResponse>(cmd, {
        request,
    });
}

//加入公开兴趣组
export async function join_pub(request: JoinPubRequest): Promise<JoinPubResponse> {
    const cmd = 'plugin:group_member_api|join_pub';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<JoinPubResponse>(cmd, {
        request,
    });
}

//离开
export async function leave(request: LeaveRequest): Promise<LeaveResponse> {
    const cmd = 'plugin:group_member_api|leave';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<LeaveResponse>(cmd, {
        request,
    });
}

//删除成员
export async function remove_member(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    const cmd = 'plugin:group_member_api|remove_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveMemberResponse>(cmd, {
        request,
    });
}

//列出成员
export async function list_member(request: ListMemberRequest): Promise<ListMemberResponse> {
    const cmd = 'plugin:group_member_api|list_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMemberResponse>(cmd, {
        request,
    });
}

//获取单个成员信息
export async function get_member(request: GetMemberRequest): Promise<GetMemberResponse> {
    const cmd = 'plugin:group_member_api|gt_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetMemberResponse>(cmd, {
        request,
    });
}

//更新成员
export async function update_member(request: UpdateMemberRequest): Promise<UpdateMemberResponse> {
    const cmd = 'plugin:group_member_api|update_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateMemberResponse>(cmd, {
        request,
    });
}