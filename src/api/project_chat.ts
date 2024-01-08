import { invoke } from '@tauri-apps/api/tauri';

export type LIST_MSG_TYPE = number;
export const LIST_MSG_BEFORE: LIST_MSG_TYPE = 0;
export const LIST_MSG_AFTER: LIST_MSG_TYPE = 1;


export type ChatMsgInfo = {
    chat_msg_id: string;
    chat_group_id: string;
    content: string;
    send_user_id: string;
    send_display_name: string;
    send_logo_uri: string;
    send_time: number;
};

export type UserPerm = {
    can_change_owner: boolean;
    can_leave: boolean;
    can_update: boolean;
    can_remove: boolean;
};

export type ChatGroupInfo = {
    chat_group_id: string;
    title: string;
    system: boolean;
    owner_user_id: string;
    owner_display_name: string;
    owner_logo_uri: string;
    user_perm: UserPerm;
    unread_count: number;
    sort_value: number;
};

export type ChatGroupMemberInfo = {
    member_user_id: string;
    member_display_name: string;
    member_logo_uri: string;
    chat_group_id: string;
};

export type CreateGroupRequest = {
    session_id: string;
    project_id: string;
    title: string;
    member_user_id_list: string[];
};

export type CreateGroupResponse = {
    code: number;
    err_msg: string;
    chat_group_id: string;
};

export type UpdateGroupRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
    title: string;
};

export type UpdateGroupResponse = {
    code: number;
    err_msg: string;
};

export type RemoveGroupRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
};

export type RemoveGroupResponse = {
    code: number;
    err_msg: string;
};

export type GetGroupRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
};

export type GetGroupResponse = {
    code: number;
    err_msg: string;
    chat_group: ChatGroupInfo;
};

export type ListGroupRequest = {
    session_id: string;
    project_id: string;
    skip_system_group: boolean;
};

export type ListGroupResponse = {
    code: number;
    err_msg: string;
    chat_group_list: ChatGroupInfo[];
};

export type UpdateGroupMemberRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
    member_user_id_list: string[];
};

export type UpdateGroupMemberResponse = {
    code: number;
    err_msg: string;
};

export type LeaveGroupRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
};

export type LeaveGroupResponse = {
    code: number;
    err_msg: string;
};

export type ChangeGroupOwnerRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
    target_member_user_id: string;
};

export type ChangeGroupOwnerResponse = {
    code: number;
    err_msg: string;
};

export type ListGroupMemberRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
};

export type ListGroupMemberResponse = {
    code: number;
    err_msg: string;
    member_list: ChatGroupMemberInfo[];
};

export type ListAllGroupMemberRequest = {
    session_id: string;
    project_id: string;
};

export type ListAllGroupMemberResponse = {
    code: number;
    err_msg: string;
    member_list: ChatGroupMemberInfo[];
};

export type SendMsgRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
    content: string;
};

export type SendMsgResponse = {
    code: number;
    err_msg: string;
    chat_msg_id: string;
};

export type ListMsgRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
    list_msg_type: LIST_MSG_TYPE;
    ref_chat_msg_id: string;
    limit: number;
}

export type ListMsgResponse = {
    code: number;
    err_msg: string;
    msg_list: ChatMsgInfo[];
};

export type ListAllLastMsgRequest = {
    session_id: string;
    project_id: string;
};

export type ListAllLastMsgResponse = {
    code: number;
    err_msg: string;
    msg_list: ChatMsgInfo[];
};

export type GetMsgRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
    chat_msg_id: string;
};

export type GetMsgResponse = {
    code: number;
    err_msg: string;
    msg: ChatMsgInfo;
};

export type ClearUnreadRequest = {
    session_id: string;
    project_id: string;
    chat_group_id: string;
};

export type ClearUnreadResponse = {
    code: number;
    err_msg: string;
};

//创建聊天组
export async function create_group(request: CreateGroupRequest): Promise<CreateGroupResponse> {
    const cmd = 'plugin:project_chat_api|create_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateGroupResponse>(cmd, {
        request,
    });
}

//更新聊天组
export async function update_group(request: UpdateGroupRequest): Promise<UpdateGroupResponse> {
    const cmd = 'plugin:project_chat_api|update_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateGroupResponse>(cmd, {
        request,
    });
}

//删除聊天组
export async function remove_group(request: RemoveGroupRequest): Promise<RemoveGroupResponse> {
    const cmd = 'plugin:project_chat_api|remove_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveGroupResponse>(cmd, {
        request,
    });
}

//获取聊天组信息
export async function get_group(request: GetGroupRequest): Promise<GetGroupResponse> {
    const cmd = 'plugin:project_chat_api|get_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetGroupResponse>(cmd, {
        request,
    });
}

//列出聊天组
export async function list_group(request: ListGroupRequest): Promise<ListGroupResponse> {
    const cmd = 'plugin:project_chat_api|list_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListGroupResponse>(cmd, {
        request,
    });
}

//更新聊天组成员
export async function update_group_member(request: UpdateGroupMemberRequest): Promise<UpdateGroupMemberResponse> {
    const cmd = 'plugin:project_chat_api|update_group_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateGroupMemberResponse>(cmd, {
        request,
    });
}

//退出聊天组
export async function leave_group(request: LeaveGroupRequest): Promise<LeaveGroupResponse> {
    const cmd = 'plugin:project_chat_api|leave_group';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<LeaveGroupResponse>(cmd, {
        request,
    });
}

//转移项目Owner
export async function change_group_owner(request: ChangeGroupOwnerRequest): Promise<ChangeGroupOwnerResponse> {
    const cmd = 'plugin:project_chat_api|change_group_owner';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ChangeGroupOwnerResponse>(cmd, {
        request,
    });
}

//列出聊天组成员
export async function list_group_member(request: ListGroupMemberRequest): Promise<ListGroupMemberResponse> {
    const cmd = 'plugin:project_chat_api|list_group_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListGroupMemberResponse>(cmd, {
        request,
    });
}

//列出所有聊天组成员
export async function list_all_group_member(request: ListAllGroupMemberRequest): Promise<ListAllGroupMemberResponse> {
    const cmd = 'plugin:project_chat_api|list_all_group_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAllGroupMemberResponse>(cmd, {
        request,
    });
}

//发送消息
export async function send_msg(request: SendMsgRequest): Promise<SendMsgResponse> {
    const cmd = 'plugin:project_chat_api|send_msg';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SendMsgResponse>(cmd, {
        request,
    });
}

//列出消息
export async function list_msg(request: ListMsgRequest): Promise<ListMsgResponse> {
    const cmd = 'plugin:project_chat_api|list_msg';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMsgResponse>(cmd, {
        request,
    });
}

//列出所有最后消息
export async function list_all_last_msg(request: ListAllLastMsgRequest): Promise<ListAllLastMsgResponse> {
    const cmd = 'plugin:project_chat_api|list_all_last_msg';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAllLastMsgResponse>(cmd, {
        request,
    });
}

//获取消息
export async function get_msg(request: GetMsgRequest): Promise<GetMsgResponse> {
    const cmd = 'plugin:project_chat_api|get_msg';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetMsgResponse>(cmd, {
        request,
    });
}
//清除未读状态
export async function clear_unread(request: ClearUnreadRequest): Promise<ClearUnreadResponse> {
    const cmd = 'plugin:project_chat_api|clear_unread';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ClearUnreadResponse>(cmd, {
        request,
    });
}