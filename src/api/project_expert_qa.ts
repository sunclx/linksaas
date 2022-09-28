import { invoke } from '@tauri-apps/api/tauri';


export type BasicExpertInfo ={
    expert_user_id: string;
    title: string;
    intro: string;
    expert_domain_list: string[];
};

export type ExpertInfo ={
    project_id: string;
    basic_info: BasicExpertInfo;
    create_time: number;
    update_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    expert_display_name: string;
    expert_logo_uri: string;
};

export type BasicQuestionInfo ={
    title: string;
    content: string;
    expert_user_id: string;
};

export type QuestionKeyInfo ={
     question_id: string;
     project_id: string;
     title: string;
     expert_user_id: string;
     expert_display_name: string;
     expert_logo_uri: string;
     create_user_id: string;
     create_display_name: string;
     create_logo_uri: string;
     create_time: number;
     update_time: number;
};

export type QuestionInfo ={
     question_id: string;
     project_id: string;
     basic_info: BasicQuestionInfo;
     expert_display_name: string;
     expert_logo_uri: string;
     create_user_id: string;
     create_display_name: string;
     create_logo_uri: string;
     create_time: number;
     update_time: number;
};

export type BasicReplyInfo ={
    question_id: string;
    content: string;
};

export type ReplyInfo = { 
    reply_id: string;
    project_id: string;
    basic_info: BasicReplyInfo;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_time: number;
};

export type UpsertExpertRequest = {
     session_id: string;
     project_id: string;
     basic_info: BasicExpertInfo;
};

export type UpsertExpertResponse = {
     code: number;
     err_msg: string;
};

export type ListExpertRequest ={
    session_id: string;
    project_id: string;
};

export type ListExpertResponse = {
    code: number;
    err_msg: string;
    expert_list: ExpertInfo[];
};

export type RemoveExpertRequest = {
    session_id: string;
    project_id: string;
    expert_user_id: string;
};

export type RemoveExpertResponse ={
    code: number;
    err_msg: string;
};

export type CreateQuestionRequest ={
    session_id: string;
    project_id: string;
    basic_info: BasicQuestionInfo;
};

export type CreateQuestionResponse ={
    code: number;
    err_msg: string;
    question_id: string;
};


export type UpdateQuestionRequest ={
    session_id: string;
    project_id: string;
    question_id: string;
    basic_info: BasicQuestionInfo;
};

export type UpdateQuestionResponse ={
    code: number;
    err_msg: string;
};

export type ListQuestionKeyRequest ={
    session_id: string;
    project_id: string;
    filter_by_expert_user_id: boolean;
    expert_user_id: string;
    offset: number;
    limit: number;
};

export type ListQuestionKeyResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: QuestionKeyInfo[];
};

export type GetQuestionRequest = {
    session_id: string;
    project_id: string;
    question_id: string;
};

export type GetQuestionResponse = {
    code: number;
    err_msg: string;
    question_info: QuestionInfo;
};

export type RemoveQuestionRequest = {
    session_id: string;
    project_id: string;
    question_id: string;
};

export type RemoveQuestionResponse = {
    code: number;
    err_msg: string;
};
export type CreateReplyRequest = {
    session_id: string;
    project_id: string;
    basic_info: BasicReplyInfo;
};

export type CreateReplyResponse = {
    code: number;
    err_msg: string;
    reply_id: string;
};

export type UpdateReplyRequest = {
    session_id: string;
    project_id: string;
    reply_id: string;
    basic_info: BasicReplyInfo;
};

export type UpdateReplyResponse = {
    code: number;
    err_msg: string;
};

export type ListReplyRequest = {
    session_id: string;
    project_id: string;
    question_id: string;
    offset: number;
    limit: number;
};

export type ListReplyResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: ReplyInfo[];
};

export type RemoveReplyRequest = {
    session_id: string;
    project_id: string;
    reply_id: string;
};

export type RemoveReplyResponse = {
    code: number;
    err_msg: string;
};

export type GetMyStatusRequest = {
    session_id: string;
    project_id: string;
};

export type GetMyStatusResponse = {   
    code: number; 
    err_msg: string; 
    need_answer_count: number;
};

export type ClearNeedAnswerCountRequest = { 
    session_id: string; 
    project_id: string;
};

export type ClearNeedAnswerCountResponse = {
    code: number;
    err_msg: string;
};

//增加/更新专家
export async function upsert_expert(request: UpsertExpertRequest): Promise<UpsertExpertResponse> {
    const cmd = 'plugin:project_expert_qa|upsert_expert';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpsertExpertResponse>(cmd, {
        request,
    });
}

//列出专家
export async function list_expert(request: ListExpertRequest): Promise<ListExpertResponse> {
    const cmd = 'plugin:project_expert_qa|list_expert';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListExpertResponse>(cmd, {
        request,
    });
}

//删除专家
export async function remove_expert(request: RemoveExpertRequest): Promise<RemoveExpertResponse> {
    const cmd = 'plugin:project_expert_qa|remove_expert';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveExpertResponse
    >(cmd, {
        request,
    });
}

//增加提问
export async function create_question(request: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const cmd = 'plugin:project_expert_qa|create_question';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateQuestionResponse>(cmd, {
        request,
    });
}

//更新提问
export async function update_question(request: UpdateQuestionRequest): Promise<UpdateQuestionResponse> {
    const cmd = 'plugin:project_expert_qa|update_question';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateQuestionResponse>(cmd, {
        request,
    });
}

//列出提问(标题)
export async function list_question_key(request: ListQuestionKeyRequest): Promise<ListQuestionKeyResponse> {
    const cmd = 'plugin:project_expert_qa|list_question_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListQuestionKeyResponse>(cmd, {
        request,
    });
}

//获取提问
export async function get_question(request: GetQuestionRequest): Promise<GetQuestionResponse> {
    const cmd = 'plugin:project_expert_qa|get_question';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetQuestionResponse>(cmd, {
        request,
    });
}

//删除提问
export async function remove_question(request: RemoveQuestionRequest): Promise<RemoveQuestionResponse> {
    const cmd = 'plugin:project_expert_qa|remove_question';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveQuestionResponse>(cmd, {
        request,
    });
}

//增加回复
export async function create_reply(request: CreateReplyRequest): Promise<CreateReplyResponse> {
    const cmd = 'plugin:project_expert_qa|create_reply';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateReplyResponse>(cmd, {
        request,
    });
}

//更新回复
export async function update_reply(request: UpdateReplyRequest): Promise<UpdateReplyResponse> {
    const cmd = 'plugin:project_expert_qa|update_reply';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateReplyResponse>(cmd, {
        request,
    });
}

//列出回复
export async function list_reply(request: ListReplyRequest): Promise<ListReplyResponse> {
    const cmd = 'plugin:project_expert_qa|list_reply';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListReplyResponse>(cmd, {
        request,
    });
}

//删除回复
export async function remove_reply(request: RemoveReplyRequest): Promise<RemoveReplyResponse> {
    const cmd = 'plugin:project_expert_qa|remove_reply';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveReplyResponse>(cmd, {
        request,
    });
}

//获取待答状态
export async function get_my_status(request: GetMyStatusRequest): Promise<GetMyStatusResponse> {
    const cmd = 'plugin:project_expert_qa|get_my_status';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetMyStatusResponse>(cmd, {
        request,
    });
}

//清除待答状态
export async function clear_need_answer_count(request: ClearNeedAnswerCountRequest): Promise<ClearNeedAnswerCountResponse> {
    const cmd = 'plugin:project_expert_qa|clear_need_answer_count';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ClearNeedAnswerCountResponse>(cmd, {
        request,
    });
}