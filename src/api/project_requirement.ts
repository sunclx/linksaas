import { invoke } from '@tauri-apps/api/tauri';

export type REQ_SORT_TYPE = number;
export const REQ_SORT_UPDATE_TIME: REQ_SORT_TYPE = 0;  //更新时间
export const REQ_SORT_CREATE_TIME: REQ_SORT_TYPE = 1;  //创建时间
export const REQ_SORT_KANO: REQ_SORT_TYPE = 2;         //根据kano better系数和更新时间
export const REQ_SORT_URGENT: REQ_SORT_TYPE = 3;       //根据四象限紧急层度
export const REQ_SORT_IMPORTANT: REQ_SORT_TYPE = 4;    //根据四象限重要层度

export type BaseRequirementInfo = {
    title: string;
    content: string;
    tag_id_list: string[];
};

export type RequirementTag = {
    tag_id: string;
    tag_name: string;
    bg_color: string;
};

export type UserRequirementPerm = {
    can_update: boolean;
    can_remove: boolean;
    can_open: boolean;
    can_close: boolean;
}


export type RequirementInfo = {
    requirement_id: string;
    project_id: string;
    base_info: BaseRequirementInfo;
    issue_link_count: number;
    create_user_id: string;
    create_time: number;
    create_display_name: string;
    create_logo_uri: string;
    update_user_id: string;
    update_time: number;
    update_display_name: string;
    update_logo_uri: string;
    closed: boolean;
    tag_info_list: RequirementTag[];

    kano_excite_value: number;//兴奋型
    kano_expect_value: number;//期望型
    kano_basic_value: number;//基础型
    kano_nodiff_value: number;//无差异
    kano_reverse_value: number;//反向型
    kano_dubiouse_value: number;//可疑数值
    four_q_urgency_value: number;//紧急层度
    four_q_important_value: number;//重要层度

    user_requirement_perm: UserRequirementPerm;
};

export type KanoRow = {
    like: number;
    expect: number;
    neutral: number;
    tolerate: number;
    dislike: number;
};

export type KanoInfo = {
    requirement_id: string;
    like_vs_row: KanoRow;
    expect_vs_row: KanoRow;
    neutral_vs_row: KanoRow;
    tolerate_vs_row: KanoRow;
    dislike_vs_row: KanoRow;
};

export type FourQInfo = {
    requirement_id: string;
    urgent_and_important: number;//紧急且重要
    urgent_and_not_important: number;//紧急但不重要
    not_urgent_and_not_important: number;//不紧急也不重要
    not_urgent_and_important: number;//不紧急但重要
};

export type CreateRequirementRequest = {
    session_id: string;
    project_id: string;
    base_info: BaseRequirementInfo;
};

export type CreateRequirementResponse = {
    code: number;
    err_msg: string;
    requirement_id: string;
};


export type ListRequirementRequest = {
    session_id: string;
    project_id: string;
    filter_by_keyword: boolean;
    keyword: string;
    filter_by_has_link_issue: boolean;
    has_link_issue: boolean;
    filter_by_closed: boolean;
    closed: boolean;
    filter_by_tag_id_list: boolean;
    tag_id_list: string[];

    offset: number;
    limit: number;
    sort_type: REQ_SORT_TYPE;
};

export type ListRequirementResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    requirement_list: RequirementInfo[];
};

export type ListRequirementByIdRequest = {
    session_id: string;
    project_id: string;
    requirement_id_list: string[];
};

export type ListRequirementByIdResponse = {
    code: number;
    err_msg: string;
    requirement_list: RequirementInfo[];
};

export type GetRequirementRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
};

export type GetRequirementResponse = {
    code: number;
    err_msg: string;
    requirement: RequirementInfo;
};


export type UpdateRequirementRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
    base_info: BaseRequirementInfo;
};

export type UpdateRequirementResponse = {
    code: number;
    err_msg: string;
};

export type RemoveRequirementRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
};

export type RemoveRequirementResponse = {
    code: number;
    err_msg: string;
};


export type LinkIssueRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
    issue_id: string;
};

export type LinkIssueResponse = {
    code: number;
    err_msg: string;
};


export type UnlinkIssueRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
    issue_id: string;
};

export type UnlinkIssueResponse = {
    code: number;
    err_msg: string;
};

export type ListIssueLinkRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
};

export type ListIssueLinkResponse = {
    code: number;
    err_msg: string;
    issue_id_list: string[];
};

export type ListMultiIssueLinkRequest = {
    session_id: string;
    project_id: string;
    requirement_id_list: string[];
}

export type ListMultiIssueLinkResponse = {
    code: number;
    err_msg: string;
    issue_id_list: string[];
};

export type CloseRequirementRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
};

export type CloseRequirementResponse = {
    code: number;
    err_msg: string;
};

export type OpenRequirementRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
};

export type OpenRequirementResponse = {
    code: number;
    err_msg: string;
};

export type SetKanoInfoRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
    kano_info: KanoInfo;
    kano_excite_value: number; //兴奋型
    kano_expect_value: number;//期望型
    kano_basic_value: number;//基础型
    kano_nodiff_value: number;//无差异
    kano_reverse_value: number;//反向型
    kano_dubiouse_value: number;//可疑数值
};

export type SetKanoInfoResponse = {
    code: number;
    err_msg: string;
};

export type GetKanoInfoRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
};

export type GetKanoInfoResponse = {
    code: number;
    err_msg: string;
    kano_info: KanoInfo;
};

export type SetFourQInfoRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
    four_q_info: FourQInfo;
    four_q_urgency_value: number;
    four_q_important_value: number;
};

export type SetFourQInfoResponse = {
    code: number;
    err_msg: string;
};

export type GetFourQInfoRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
};

export type GetFourQInfoResponse = {
    code: number;
    err_msg: string;
    four_q_info: FourQInfo;
};

export type UpdateTagIdListRequest = {
    session_id: string;
    project_id: string;
    requirement_id: string;
    tag_id_list: string[];
};

export type UpdateTagIdListResponse = {
    code: number;
    err_msg: string;
};

//创建需求
export async function create_requirement(request: CreateRequirementRequest): Promise<CreateRequirementResponse> {
    const cmd = 'plugin:project_requirement_api|create_requirement';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateRequirementResponse>(cmd, {
        request,
    });
}

//列出需求
export async function list_requirement(request: ListRequirementRequest): Promise<ListRequirementResponse> {
    const cmd = 'plugin:project_requirement_api|list_requirement';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListRequirementResponse>(cmd, {
        request,
    });
}

//按ID列出需求
export async function list_requirement_by_id(request: ListRequirementByIdRequest): Promise<ListRequirementByIdResponse> {
    const cmd = 'plugin:project_requirement_api|list_requirement_by_id';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListRequirementByIdResponse>(cmd, {
        request,
    });
}

//获取单个需求
export async function get_requirement(request: GetRequirementRequest): Promise<GetRequirementResponse> {
    const cmd = 'plugin:project_requirement_api|get_requirement';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetRequirementResponse>(cmd, {
        request,
    });
}

//更新需求
export async function update_requirement(request: UpdateRequirementRequest): Promise<UpdateRequirementResponse> {
    const cmd = 'plugin:project_requirement_api|update_requirement';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateRequirementResponse>(cmd, {
        request,
    });
}

//更新标签
export async function update_tag_id_list(request: UpdateTagIdListRequest): Promise<UpdateTagIdListResponse> {
    const cmd = 'plugin:project_requirement_api|update_tag_id_list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateTagIdListResponse>(cmd, {
        request,
    });
}

//删除需求
export async function remove_requirement(request: RemoveRequirementRequest): Promise<RemoveRequirementResponse> {
    const cmd = 'plugin:project_requirement_api|remove_requirement';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveRequirementResponse>(cmd, {
        request,
    });
}

//关联工单
export async function link_issue(request: LinkIssueRequest): Promise<LinkIssueResponse> {
    const cmd = 'plugin:project_requirement_api|link_issue';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<LinkIssueResponse>(cmd, {
        request,
    });
}

//取消关联工单
export async function unlink_issue(request: UnlinkIssueRequest): Promise<UnlinkIssueResponse> {
    const cmd = 'plugin:project_requirement_api|unlink_issue';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UnlinkIssueResponse>(cmd, {
        request,
    });
}

//列出工单关联
export async function list_issue_link(request: ListIssueLinkRequest): Promise<ListIssueLinkResponse> {
    const cmd = 'plugin:project_requirement_api|list_issue_link';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListIssueLinkResponse>(cmd, {
        request,
    });
}

//列出多个需求的工单关联
export async function list_multi_issue_link(request: ListMultiIssueLinkRequest): Promise<ListMultiIssueLinkResponse> {
    const cmd = 'plugin:project_requirement_api|list_multi_issue_link';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMultiIssueLinkResponse>(cmd, {
        request,
    });
}

//关闭需求
export async function close_requirement(request: CloseRequirementRequest): Promise<CloseRequirementResponse> {
    const cmd = 'plugin:project_requirement_api|close_requirement';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CloseRequirementResponse>(cmd, {
        request,
    });
}

//打开需求
export async function open_requirement(request: OpenRequirementRequest): Promise<OpenRequirementResponse> {
    const cmd = 'plugin:project_requirement_api|open_requirement';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<OpenRequirementResponse>(cmd, {
        request,
    });
}

//设置kano数值
export async function set_kano_info(request: SetKanoInfoRequest): Promise<SetKanoInfoResponse> {
    const cmd = 'plugin:project_requirement_api|set_kano_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetKanoInfoResponse>(cmd, {
        request,
    });
}

//获取kano数值
export async function get_kano_info(request: GetKanoInfoRequest): Promise<GetKanoInfoResponse> {
    const cmd = 'plugin:project_requirement_api|get_kano_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetKanoInfoResponse>(cmd, {
        request,
    });
}

//设置fourQ数值
export async function set_four_q_info(request: SetFourQInfoRequest): Promise<SetFourQInfoResponse> {
    const cmd = 'plugin:project_requirement_api|set_four_q_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetFourQInfoResponse>(cmd, {
        request,
    });
}

//获取fourQ数值
export async function get_four_q_info(request: GetFourQInfoRequest): Promise<GetFourQInfoResponse> {
    const cmd = 'plugin:project_requirement_api|get_four_q_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetFourQInfoResponse>(cmd, {
        request,
    });
}