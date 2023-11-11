import { invoke } from '@tauri-apps/api/tauri';

export type UserPerm = {
    can_invite: boolean;
    can_list_member: boolean;
    can_remove_member: boolean;
    can_update_member: boolean;
    can_add_post: boolean;
    can_update_group: boolean;
    can_remove_group: boolean;
};

export type GroupInfo = {
    group_id: string;
    group_name: string;
    icon_file_id: string;
    group_desc: string;
    pub_group: boolean;
    member_count: number;
    post_count: number;
    fs_id: string;
    can_add_post_for_new: boolean;
    can_add_comment_for_new: boolean;
    owner_user_id: string;
    owner_display_name: string;
    owner_logo_uri: string;
    create_time: number;
    update_time: number;
    last_post_time: number;
    my_last_view_time: number;
    user_perm: UserPerm;
};

export type CreateRequest = {
    session_id: string;
    group_name: string;
    group_desc: string;
    can_add_post_for_new: boolean;
    can_add_comment_for_new: boolean;
};

export type CreateResponse = {
    code: number;
    err_msg: string;
    group_id: string;
};

export type ListMyRequest = {
    session_id: string;
};

export type ListMyResponse = {
    code: number;
    err_msg: string;
    group_list: GroupInfo[];
};


export type ListPubRequest = {
    session_id: string;
    offset: number;
    limit: number;
};

export type ListPubResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    group_list: GroupInfo[];
};

export type GetRequest = {
    session_id: string;
    group_id: string;
};

export type GetResponse = {
    code: number;
    err_msg: string;
    group: GroupInfo;
};

export type UpdateRequest = {
    session_id: string;
    group_id: string;
    group_name: string;
    icon_file_id: string;
    group_desc: string;
    can_add_post_for_new: boolean;
    can_add_comment_for_new: boolean;
};

export type UpdateResponse = {
    code: number;
    err_msg: string;
};

export type RemoveRequest = {
    session_id: string;
    group_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};

export type ChangeOwnerRequest = {
    session_id: string;
    group_id: string;
    member_user_id: string;
};

export type ChangeOwnerResponse = {
    code: number;
    err_msg: string;
};

//创建兴趣组
export async function create(request: CreateRequest): Promise<CreateResponse> {
    const cmd = 'plugin:group_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateResponse>(cmd, {
        request,
    });
}

//列出我的兴趣组
export async function list_my(request: ListMyRequest): Promise<ListMyResponse> {
    const cmd = 'plugin:group_api|list_my';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMyResponse>(cmd, {
        request,
    });
}

//列出公开兴趣组
export async function list_pub(request: ListPubRequest): Promise<ListPubResponse> {
    const cmd = 'plugin:group_api|list_pub';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListPubResponse>(cmd, {
        request,
    });
}

//获取单个兴趣组
export async function get(request: GetRequest): Promise<GetResponse> {
    const cmd = 'plugin:group_api|get';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResponse>(cmd, {
        request,
    });
}

//更新兴趣组
export async function update(request: UpdateRequest): Promise<UpdateResponse> {
    const cmd = 'plugin:group_api|update';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateResponse>(cmd, {
        request,
    });
}

//删除兴趣组
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:group_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}

//转移超级管理员
export async function change_owner(request: ChangeOwnerRequest): Promise<ChangeOwnerResponse> {
    const cmd = 'plugin:group_api|change_owner';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ChangeOwnerResponse>(cmd, {
        request,
    });
}