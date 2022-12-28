import { invoke } from '@tauri-apps/api/tauri';

export type ENTRY_TYPE = number;
export const ENTRY_TYPE_DIR: ENTRY_TYPE = 0;  //目录
export const ENTRY_TYPE_TC: ENTRY_TYPE = 1;   //测试用例


export type RESULT_TYPE = number;
export const RESULT_TYPE_SUCCESS: RESULT_TYPE = 0;  //成功
export const RESULT_TYPE_WARN: RESULT_TYPE = 1;     //警告
export const RESULT_TYPE_FAIL: RESULT_TYPE = 2;     //失败

export const RESULT_TYPE_ALL: RESULT_TYPE = 99; //全部

export type RESULT_FROM = number;
export const RESULT_FROM_UI = 0;         //通过UI界面提交结果
export const RESULT_FROM_LOCAL_API = 1;  //通过本地API提交结果



export type Entry = {
    entry_id: string;
    entry_type: ENTRY_TYPE;
    title: string;
    parent_entry_id: string;
    test_case_index: number;
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
};

export type BasicRule = {
    desc: string;
    pre_condition: string;
    expect_result: string;
};

export type Rule = {
    rule_id: string;
    entry_id: string;
    project_id: string;
    basic_rule: BasicRule;
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
};

export type BasicMetric = {
    desc: string;
    value: number;
};

export type Metric = {
    metric_id: string;
    entry_id: string;
    project_id: string;
    basic_metric: BasicMetric;
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
};

export type EntryContent = {
    entry_id: string;
    project_id: string;
    content: string;
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
};

export type BasicResultImage = {
    thumb_file_id: string;
    file_id: string;
};

export type BasicResult = {
    desc: string;
    result_type: RESULT_TYPE;
    result_from: RESULT_FROM;
    image_list: BasicResultImage[];
    extra_file_id_list: string[];
};

export type ResultImage = {
    thumb_file_id: string;
    file_id: string;
    file_name: string;
};

export type ResultFile = {
    file_id: string;
    file_name: string;
    file_size: number;
};


export type Result = {
    result_id: string;
    entry_id: string;
    project_id: string;
    desc: string;
    result_type: RESULT_TYPE;
    result_from: RESULT_FROM;
    image_list: ResultImage[];
    extra_file_list: ResultFile[];
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    entry_title: string;
};

export type ListResultParam = {
    filter_by_entry_id: boolean;
    entry_id: string;
    filter_by_member_user_id: boolean;
    member_user_id: string;
    filter_by_result_type: boolean;
    result_type: RESULT_TYPE;
};

export type PathElement = {
    entry_id: string;
    title: string;
};


export type CreateEntryRequest = {
    session_id: string;
    project_id: string;
    entry_type: ENTRY_TYPE;
    title: string;
    parent_entry_id: string;
};

export type CreateEntryResponse = {
    code: number;
    err_msg: string;
    entry_id: string;
};

export type ListEntryRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type ListEntryResponse = {
    code: number;
    err_msg: string;
    entry_list: Entry[];
}

export type GetEntryRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type GetEntryResponse = {
    code: number;
    err_msg: string;
    path_element_list: PathElement[];
    entry: Entry;
    child_count: number;
};


export type SetParentEntryRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    parent_entry_id: string;
};

export type SetParentEntryResponse = {
    code: number;
    err_msg: string;
};


export type UpdateEntryTitleRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    title: string;
};

export type UpdateEntryTitleResponse = {
    code: number;
    err_msg: string;
}


export type RemoveEntryRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type RemoveEntryResponse = {
    code: number;
    err_msg: string;
};


export type AddRuleRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    basic_rule: BasicRule;
};

export type AddRuleResponse = {
    code: number;
    err_msg: string;
    rule_id: string;
};

export type UpdateRuleRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    rule_id: string;
    basic_rule: BasicRule;
};

export type UpdateRuleResponse = {
    code: number;
    err_msg: string;
};

export type RemoveRuleRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    rule_id: string;
};

export type RemoveRuleResponse = {
    code: number;
    err_msg: string;
};

export type ListRuleRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type ListRuleResponse = {
    code: number;
    err_msg: string;
    rule_list: Rule[];
};


export type AddMetricRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    basic_metric: BasicMetric;
};

export type AddMetricResponse = {
    code: number;
    err_msg: string;
    metric_id: string;
};


export type UpdateMetricRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    metric_id: string;
    basic_metric: BasicMetric;
};

export type UpdateMetricResponse = {
    code: number;
    err_msg: string;
};


export type RemoveMetricRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    metric_id: string;
};

export type RemoveMetricResponse = {
    code: number;
    err_msg: string;
};


export type ListMetricRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type ListMetricResponse = {
    code: number;
    err_msg: string;
    metric_list: Metric[];
};

export type SetTestContentRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    content: string;
};

export type SetTestContentResponse = {
    code: number;
    err_msg: string;
};


export type GetTestContentRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
};

export type GetTestContentResponse = {
    code: number;
    err_msg: string;
    entry_content: EntryContent;
};


export type AddResultRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    basic_result: BasicResult;
};

export type AddResultResponse = {
    code: number;
    err_msg: string;
    result_id: string;
};


export type RemoveResultRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    result_id: string;
};

export type RemoveResultResponse = {
    code: number;
    err_msg: string;
};


export type ListResultRequest = {
    session_id: string;
    project_id: string;
    list_param: ListResultParam;
    offset: number;
    limit: number;
};

export type ListResultResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    result_list: Result[];
};


export type ListLangRequest = {};

export type ListLangResponse = {
    code: number;
    err_msg: string;
    lang_list: string[];
};


export type ListFrameWorkRequest = {
    lang: string;
};

export type ListFrameWorkResponse = {
    code: number;
    err_msg: string;
    frame_work_list: string[];
};


export type GenTestCodeRequest = {
    session_id: string;
    project_id: string;
    entry_id: string;
    lang: string;
    frame_work: string;
};

export type GenTestCodeResponse = {
    code: number;
    err_msg: string;
    gen_code: string;
};

// 创建目录或测试用例
export async function create_entry(request: CreateEntryRequest): Promise<CreateEntryResponse> {
    const cmd = 'plugin:project_test_case_api|create_entry';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateEntryResponse>(cmd, {
        request,
    });
}

// 列出目录内容
export async function list_entry(request: ListEntryRequest): Promise<ListEntryResponse> {
    const cmd = 'plugin:project_test_case_api|list_entry';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListEntryResponse>(cmd, {
        request,
    });
}

//获取单个节点信息
export async function get_entry(request: GetEntryRequest): Promise<GetEntryResponse> {
    const cmd = 'plugin:project_test_case_api|get_entry';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetEntryResponse>(cmd, {
        request,
    });
}

//调整父目录
export async function set_parent_entry(request: SetParentEntryRequest): Promise<SetParentEntryResponse> {
    const cmd = 'plugin:project_test_case_api|set_parent_entry';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetParentEntryResponse>(cmd, {
        request,
    });
}

//更新目录或测试用例标题
export async function update_entry_title(request: UpdateEntryTitleRequest): Promise<UpdateEntryTitleResponse> {
    const cmd = 'plugin:project_test_case_api|update_entry_title';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateEntryTitleResponse>(cmd, {
        request,
    });
}

//删除目录或测试用例
export async function remove_entry(request: RemoveEntryRequest): Promise<RemoveEntryResponse> {
    const cmd = 'plugin:project_test_case_api|remove_entry';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveEntryResponse>(cmd, {
        request,
    });
}

//增加用例规则描述
export async function add_rule(request: AddRuleRequest): Promise<AddRuleResponse> {
    const cmd = 'plugin:project_test_case_api|add_rule';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddRuleResponse>(cmd, {
        request,
    });
}

//更新规则描述
export async function update_rule(request: UpdateRuleRequest): Promise<UpdateRuleResponse> {
    const cmd = 'plugin:project_test_case_api|update_rule';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateRuleResponse>(cmd, {
        request,
    });
}

//删除规则描述
export async function remove_rule(request: RemoveRuleRequest): Promise<RemoveRuleResponse> {
    const cmd = 'plugin:project_test_case_api|remove_rule';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveRuleResponse>(cmd, {
        request,
    });
}

//列出规则
export async function list_rule(request: ListRuleRequest): Promise<ListRuleResponse> {
    const cmd = 'plugin:project_test_case_api|list_rule';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListRuleResponse>(cmd, {
        request,
    });
}

//增加指标
export async function add_metric(request: AddMetricRequest): Promise<AddMetricResponse> {
    const cmd = 'plugin:project_test_case_api|add_metric';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddMetricResponse>(cmd, {
        request,
    });
}

//更新指标
export async function update_metric(request: UpdateMetricRequest): Promise<UpdateMetricResponse> {
    const cmd = 'plugin:project_test_case_api|update_metric';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateMetricResponse>(cmd, {
        request,
    });
}

//删除指标
export async function remove_metric(request: RemoveMetricRequest): Promise<RemoveMetricResponse> {
    const cmd = 'plugin:project_test_case_api|remove_metric';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveMetricResponse>(cmd, {
        request,
    });
}

//列出指标
export async function list_metric(request: ListMetricRequest): Promise<ListMetricResponse> {
    const cmd = 'plugin:project_test_case_api|list_metric';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMetricResponse>(cmd, {
        request,
    });
}

//设置测试步骤
export async function set_test_content(request: SetTestContentRequest): Promise<SetTestContentResponse> {
    const cmd = 'plugin:project_test_case_api|set_test_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetTestContentResponse>(cmd, {
        request,
    });
}

//获取测试步骤
export async function get_test_content(request: GetTestContentRequest): Promise<GetTestContentResponse> {
    const cmd = 'plugin:project_test_case_api|get_test_content';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetTestContentResponse>(cmd, {
        request,
    });
}

//添加测试结果
export async function add_result(request: AddResultRequest): Promise<AddResultResponse> {
    const cmd = 'plugin:project_test_case_api|add_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddResultResponse>(cmd, {
        request,
    });
}

//删除测试结果
export async function remove_result(request: RemoveResultRequest): Promise<RemoveResultResponse> {
    const cmd = 'plugin:project_test_case_api|remove_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResultResponse>(cmd, {
        request,
    });
}

//列出测试结果
export async function list_result(request: ListResultRequest): Promise<ListResultResponse> {
    const cmd = 'plugin:project_test_case_api|list_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResultResponse>(cmd, {
        request,
    });
}

//列出语言支持
export async function list_lang(request: ListLangRequest): Promise<ListLangResponse> {
    const cmd = 'plugin:project_test_case_api|list_lang';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListLangResponse>(cmd, {
        request,
    });
}

//列出测试框架支持
export async function list_frame_work(request: ListFrameWorkRequest): Promise<ListFrameWorkResponse> {
    const cmd = 'plugin:project_test_case_api|list_frame_work';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListFrameWorkResponse>(cmd, {
        request,
    });
}

//生成代码
export async function gen_test_code(request: GenTestCodeRequest): Promise<GenTestCodeResponse> {
    const cmd = 'plugin:project_test_case_api|gen_test_code';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GenTestCodeResponse>(cmd, {
        request,
    });
}