import { invoke } from '@tauri-apps/api/tauri';

export type AWARD_RELATE_TYPE = number;

export const AWARD_RELATE_TASK: AWARD_RELATE_TYPE = 0;
export const AWARD_RELATE_BUG: AWARD_RELATE_TYPE = 1;

export type AwardState = {
    member_user_id: string;
    project_id: string;
    member_display_name: string;
    member_logo_uri: string;
    cur_week_point: number;
    last_weak_point: number;
    cur_month_point: number;
    last_month_point: number;
};

export type AwardRecord = {
    relate_type: AWARD_RELATE_TYPE;
    relate_id: string;
    title: string;
    point: number;
    time_stamp: number;
};

export type ListStateRequest = {
    session_id: string;
    project_id: string;
};

export type ListStateResponse = {
    code: number;
    err_msg: string;
    state_list: AwardState[];
};


export type ListRecordRequest = {
    session_id: string;
    project_id: string;
    member_user_id: string;
    offset: number;
    limit: number;
};

export type ListRecordResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    record_list: AwardRecord[],
};


// 列出奖励状态
export async function list_state(request: ListStateRequest): Promise<ListStateResponse> {
    const cmd = 'plugin:project_award_api|list_state';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListStateResponse>(cmd, {
        request,
    });
}

//列出奖励记录
export async function list_record(request: ListRecordRequest): Promise<ListRecordResponse> {
    const cmd = 'plugin:project_award_api|list_record';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListRecordResponse>(cmd, {
        request,
    });
}