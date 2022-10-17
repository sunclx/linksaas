import { invoke } from '@tauri-apps/api/tauri';


export type SHORT_NOTE_TYPE = number;

export const SHORT_NOTE_TASK: SHORT_NOTE_TYPE = 0;
export const SHORT_NOTE_BUG: SHORT_NOTE_TYPE = 1;
export const SHORT_NOTE_DOC: SHORT_NOTE_TYPE = 2;


export type ShortNote = {
    project_id: string;
    short_note_type: SHORT_NOTE_TYPE;
    target_id: string;
    title: string;
    time_stamp: number;
    project_name: string;
    member_user_id: string;
};

export type AddRequest = {
    session_id: string;
    project_id: string;
    short_note_type: SHORT_NOTE_TYPE;
    target_id: string;
};

export type AddResponse = {
    code: number;
    err_msg: string;
};


export type RemoveRequest = {
    session_id: string;
    project_id: string;
    short_note_type: SHORT_NOTE_TYPE;
    target_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};


export type ListMyRequest = {
    session_id: string;
};

export type ListMyResponse = {
    code: number;
    err_msg: string;
    short_note_list: ShortNote[];
};


export type ListByMemberRequest = {
    session_id: string;
    project_id: string;
    member_user_id: string;
};

export type ListByMemberResponse = {
    code: number;
    err_msg: string;
    short_note_list: ShortNote[];
}

export type ListByProjectRequest = {
    session_id: string;
    project_id: string;
};

export type ListByProjectResponse = {
    code: number;
    err_msg: string;
    short_note_list: ShortNote[],
};

//增加便签
export async function add(request: AddRequest): Promise<AddResponse> {
    const cmd = 'plugin:short_note_api|add';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddResponse>(cmd, {
        request,
    });
}

//删除便签
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:short_note_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}

//列出我的便签
export async function list_my(request: ListMyRequest): Promise<ListMyResponse> {
    const cmd = 'plugin:short_note_api|list_my';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMyResponse>(cmd, {
        request,
    });
}

//列出项目成员的便签
export async function list_by_member(request: ListByMemberRequest): Promise<ListByMemberResponse> {
    const cmd = 'plugin:short_note_api|list_by_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListByMemberResponse>(cmd, {
        request,
    });
}

//列出项目内所有便签
export async function list_by_project(request: ListByProjectRequest): Promise<ListByProjectResponse> {
    const cmd = 'plugin:short_note_api|list_by_project';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListByProjectResponse>(cmd, {
        request,
    });
}
