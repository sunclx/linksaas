import { invoke } from '@tauri-apps/api/tauri';


export type ANNO_TYPE = number;
export const ANNO_TYPE_AUDIO_ENTITY_IDENTI: ANNO_TYPE = 0;
export const ANNO_TYPE_AUDIO_TRANS: ANNO_TYPE = 1;
export const ANNO_TYPE_IMAGE_CLASSIFI: ANNO_TYPE = 2;
export const ANNO_TYPE_IMAGE_LANDMARK: ANNO_TYPE = 3;
export const ANNO_TYPE_IMAGE_PIXEL_SEG: ANNO_TYPE = 4;
export const ANNO_TYPE_IMAGE_SEG: ANNO_TYPE = 5;
export const ANNO_TYPE_TEXT_CLASSIFI: ANNO_TYPE = 6;
export const ANNO_TYPE_TEXT_ENTITY_REC: ANNO_TYPE = 7;
export const ANNO_TYPE_TEXT_ENTITY_REL: ANNO_TYPE = 8;


export type AnnoLabel = {
    id: string;
    display_name: string;
    desc: string;
};

export type LandMark = {
    label: string;
    display_name: string;
    color: string;
};

export type LandMarkConn = {
    from_label: string;
    to_label: string;
};

export type KeyPointDef = {
    name: string;
    land_mark_list: LandMark[];
    conn_list: LandMarkConn[];
};

export type AudioEntityIdentiConfig = {
    label_list: AnnoLabel[];
    transcribe: boolean;
    only_use_words_in_phrase_bank: boolean;
    transcription_type: string;
};

export type AudioTransConfig = {
    only_use_words_in_phrase_bank: boolean;
    transcription_type: string;
};

export type ImageClassifiConfig = {
    label_list: AnnoLabel[];
};

export type ImageLandmarkConfig = {
    key_point_def_list: KeyPointDef[];
};

export type ImagePixelSegConfig = {
    label_list: AnnoLabel[];
};

export type ImageSegConfig = {
    label_list: AnnoLabel[];
    region_types_allowed: string[];
    region_description: string;
    multiple_region_labels: boolean;
    multiple_regions: boolean;
    minimum_region_size: number;
    overlapping_regions: boolean;
    region_min_acceptable_difference: number;
};

export type TextClassifiConfig = {
    label_list: AnnoLabel[];
    multiple: boolean;
};

export type TextEntityRecConfig = {
    label_list: AnnoLabel[];
    overlap_allowed: boolean;
};

export type TextEntityRelConfig = {
    entity_label_list: AnnoLabel[];
    rel_label_list: AnnoLabel[];
};

export type AnnoConfig = {
    anno_type: ANNO_TYPE;
    desc: string;
    config: Config;
};

export type Config = {
    AudioEntityIdenti?: AudioEntityIdentiConfig;
    AudioTrans?: AudioTransConfig;
    ImageClassifi?: ImageClassifiConfig;
    ImageLandmark?: ImageLandmarkConfig;
    ImagePixelSeg?: ImagePixelSegConfig;
    ImageSeg?: ImageSegConfig;
    TextClassifi?: TextClassifiConfig;
    TextEntityRec?: TextEntityRecConfig;
    TextEntityRel?: TextEntityRelConfig;
};

export type BaseAnnoProjectInfo = {
    name: string;
    config: AnnoConfig;
};

export type AnnoProjectInfo = {
    anno_project_id: string;
    base_info: BaseAnnoProjectInfo;
    resource_count: number;
    all_task_count: number;
    done_task_count: number;
    member_count: number;
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
};

export type ResourceInfo = {
    resource_id: string;
    anno_project_id: string;
    content: string;
    store_as_file: boolean;
    task_count: number;
};

export type CreateRequest = {
    session_id: string;
    project_id: string;
    base_info: BaseAnnoProjectInfo;
};

export type CreateResponse = {
    code: number;
    err_msg: string;
    anno_project_id: string;
};


export type UpdateRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    base_info: BaseAnnoProjectInfo;
};

export type UpdateResponse = {
    code: number;
    err_msg: string;
};


export type RemoveRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
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
    info_list: AnnoProjectInfo[];
};


export type AddResourceRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    content: string;
    store_as_file: boolean;
};

export type AddResourceResponse = {
    code: number;
    err_msg: string;
    resource_id: string;
};

export type RemoveResourceRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    resource_id: string;
};

export type RemoveResourceResponse = {
    code: number;
    err_msg: string;
};


export type ListResourceRequest = {
    session_id: string;
    project_id: string;
    anno_project_id: string;
    offset: number;
    limit: number;
};

export type ListResourceResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: ResourceInfo[];
};

//创建标注项目
export async function create(request: CreateRequest): Promise<CreateResponse> {
    const cmd = 'plugin:data_anno_project_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateResponse>(cmd, {
        request,
    });
}

//修改标注项目
export async function update(request: UpdateRequest): Promise<UpdateResponse> {
    const cmd = 'plugin:data_anno_project_api|update';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateResponse>(cmd, {
        request,
    });
}

//删除标注项目
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:data_anno_project_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}

//列出标注项目
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:data_anno_project_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResponse>(cmd, {
        request,
    });
}

//增加资源
export async function add_resource(request: AddResourceRequest): Promise<AddResourceResponse> {
    const cmd = 'plugin:data_anno_project_api|add_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddResourceResponse>(cmd, {
        request,
    });
}

//删除资源
export async function remove_resource(request: RemoveResourceRequest): Promise<RemoveResourceResponse> {
    const cmd = 'plugin:data_anno_project_api|remove_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResourceResponse>(cmd, {
        request,
    });
}

//列出资源
export async function list_resource(request: ListResourceRequest): Promise<ListResourceResponse> {
    const cmd = 'plugin:data_anno_project_api|list_resource';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResourceResponse>(cmd, {
        request,
    });
}