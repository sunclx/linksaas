import { invoke } from '@tauri-apps/api/tauri';

export type RESULT_TYPE = number;
export const RESULT_TYPE_AUDIO_ENTITY_IDENTI: RESULT_TYPE = 0;
export const RESULT_TYPE_AUDIO_TRANS: RESULT_TYPE = 1;
export const RESULT_TYPE_IMAGE_CLASSIFI: RESULT_TYPE = 2;
export const RESULT_TYPE_IMAGE_LANDMARK: RESULT_TYPE = 3;
export const RESULT_TYPE_IMAGE_PIXEL_SEG: RESULT_TYPE = 4;
export const RESULT_TYPE_IMAGE_SEG: RESULT_TYPE = 5;
export const RESULT_TYPE_TEXT_CLASSIFI: RESULT_TYPE = 6;
export const RESULT_TYPE_TEXT_ENTITY_REC: RESULT_TYPE = 7;
export const RESULT_TYPE_TEXT_ENTITY_REL: RESULT_TYPE = 8;

export type AudioEntity = {
    start: number;
    end: number;
    classification: string;
    transcription: string;
};

export type TextEntity = {
    start: number;
    end: number;
    label: string;
    text: string;
    text_id: string;
};

export type TextEntityRel = {
    from_id: string;
    to_id: string;
    label: string;
};

export type LandMark = {
    label: string;
    x: number;
    y: number;
    obscured: boolean;
};

export type ShapeRect = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type ShapePoint = {
    x: number;
    y: number;
}

export type ShapePolygon = {
    point_list: ShapePoint[];
};

export type AudioEntityIdentiResult = {
    audio_entity_list: AudioEntity[];
};

export type ImageLandmarkResult = {
    key_point_def_id: string;
    land_mark_list: LandMark[];
};

export type ImagePixelSegResult = {
    rect_list: ShapeRect[];
    point_list: ShapePoint[];
    polygon_list: ShapePolygon[]
};

export type ImageSegResult = {
    rect_list: ShapeRect[];
    point_list: ShapePoint[];
    polygon_list: ShapePolygon[];
};


export type TextEntityRecResult = {
    entity_list: TextEntity[];
}

export type TextEntityRelResult = {
    entity_list: TextEntity[];
    rel_list: TextEntityRel[];
};

export type BaseAnnoResult = {
    result_type: RESULT_TYPE;
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
    result: Result;
}

export type Result = {
    AudioEntityIdenti?: AudioEntityIdentiResult;
    AudioTrans?: string;
    ImageClassifi?: string;
    ImageLandmark?: ImageLandmarkResult;
    ImagePixelSeg?: ImagePixelSegResult;
    ImageSeg?: ImageSegResult;
    TextClassifi?: string;
    TextEntityRec?: TextEntityRecResult;
    TextEntityRel?: TextEntityRelResult;
};


export type AnnoResult = {
    base_info: BaseAnnoResult;
    done: boolean;
};

export type MemberInfo = {
    member_user_id: string;
    display_name: string;
    logo_uri: string;
    task_count: number;
    done_count: number;
};

export type TaskInfo = {
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
    content: string;
    store_as_file: boolean;
    done: boolean;
};

export type AddMemberRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
};

export type AddMemberResponse = {
    code: number;
    err_msg: string;
};


export type ListMemberRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
};

export type ListMemberResponse = {
    code: number;
    err_msg: string;
    info_list: MemberInfo[];
};


export type RemoveMemberRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
};

export type RemoveMemberResponse = {
    code: number;
    err_msg: string;
};


export type SetTaskCountRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    task_count: number;
};

export type SetTaskCountResponse = {
    code: number;
    err_msg: string;
}


export type ListTaskRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    filter_by_done: boolean;
    done: boolean;
};

export type ListTaskResponse = {
    code: number;
    err_msg: string;
    info_list: TaskInfo[];
}


export type SetResultRequest = {
    session_id: string;
    project_id: string;
    result: BaseAnnoResult;
};

export type SetResultResponse = {
    code: number;
    err_msg: string;
};


export type SetResultStateRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
    done: boolean;
};

export type SetResultStateResponse = {
    code: number;
    err_msg: string;
};


export type GetResultRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    member_user_id: string;
    resource_id: string;
};

export type GetResultResponse = {
    code: number;
    err_msg: string;
    result: AnnoResult;
};

//增加标注成员
export async function add_member(request: AddMemberRequest): Promise<AddMemberResponse> {
    const cmd = 'plugin:data_anno_task_api|add_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddMemberResponse>(cmd, {
        request,
    });
}

//列出标注成员
export async function list_member(request: ListMemberRequest): Promise<ListMemberResponse> {
    const cmd = 'plugin:data_anno_task_api|list_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMemberResponse>(cmd, {
        request,
    });
}

//删除标注成员
export async function remove_member(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    const cmd = 'plugin:data_anno_task_api|remove_member';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveMemberResponse>(cmd, {
        request,
    });
}

//设置成员标注量
export async function set_task_count(request: SetTaskCountRequest): Promise<SetTaskCountResponse> {
    const cmd = 'plugin:data_anno_task_api|set_task_count';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetTaskCountResponse>(cmd, {
        request,
    });
}

//列出标注任务
export async function list_task(request: ListTaskRequest): Promise<ListTaskResponse> {
    const cmd = 'plugin:data_anno_task_api|list_task';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListTaskResponse>(cmd, {
        request,
    });
}

//设置标注结果
export async function set_result(request: SetResultRequest): Promise<SetResultResponse> {
    const cmd = 'plugin:data_anno_task_api|set_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetResultResponse>(cmd, {
        request,
    });
}

//更新标注状态
export async function set_result_state(request: SetResultStateRequest): Promise<SetResultStateResponse> {
    const cmd = 'plugin:data_anno_task_api|set_result_state';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetResultStateResponse>(cmd, {
        request,
    });
}

//获取标注结果
export async function get_result(request: GetResultRequest): Promise<GetResultResponse> {
    const cmd = 'plugin:data_anno_task_api|get_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetResultResponse>(cmd, {
        request,
    });
}