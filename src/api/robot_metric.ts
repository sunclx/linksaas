import { invoke } from '@tauri-apps/api/tauri';

export type METRIC_UNIT_TYPE = number;

export const METRIC_UNIT_BYTE_SIZE: METRIC_UNIT_TYPE = 0;
export const METRIC_UNIT_PERCENT: METRIC_UNIT_TYPE = 1;
export const METRIC_UNIT_BOOL: METRIC_UNIT_TYPE = 2;
export const METRIC_UNIT_OTHER: METRIC_UNIT_TYPE = 100;



export type MetricLabel = {
    label: string;
    name: string;
    unit_type: METRIC_UNIT_TYPE;
};
export type Metric = {
    metric_id: string;
    robot_id: string;
    name: string;
    label_list: MetricLabel[];
};

export type ListMetricRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
};

export type ListMetricResponse = {
    code: number;
    err_msg: string;
    info_list: Metric[],
};

export type ReqMetricDataRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
    metric_id: string;
    req_id: string;
    label: string;
    read_history: boolean;
    from_time: number;
    to_time: number;
    read_cur_value: boolean;
};

export type ReqMetricDataResponse = {
    code: number;
    err_msg: string;
};

export type ReadMetricDataRequest = {
    session_id: string;
    project_id: string;
    robot_id: string;
    metric_id: string;
    req_id: string;
    label: string;
};

export type MetricDataItem = {
    time_stamp: number;
    value: number;
};

export type MetricData = {
    metric_id: string;
    label: string;
    item_list: MetricDataItem[];
    has_cur_value: boolean;
    cur_value: number;
};

export type ReadMetricDataResponse = {
    code: number;
    err_msg: string;
    metric_data: MetricData;
};


//列出监控目标
export async function list_metric(request: ListMetricRequest): Promise<ListMetricResponse> {
    const cmd = 'plugin:robot_metric_api|list_metric';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMetricResponse>(cmd, {
        request,
    });
}

//请求监控目标数据
export async function req_metric_data(request: ReqMetricDataRequest): Promise<ReqMetricDataResponse> {
    const cmd = 'plugin:robot_metric_api|req_metric_data';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ReqMetricDataResponse>(cmd, {
        request,
    });
}

// 读取监控响应数据
export async function read_metric_data(request: ReadMetricDataRequest): Promise<ReadMetricDataResponse> {
    const cmd = 'plugin:robot_metric_api|read_metric_data';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ReadMetricDataResponse>(cmd, {
        request,
    });
}