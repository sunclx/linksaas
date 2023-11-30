import { invoke } from '@tauri-apps/api/tauri';

export type SPAN_KIND = number;
export const SPAN_KIND_UNSPECIFIED: SPAN_KIND = 0;
export const SPAN_KIND_INTERNAL: SPAN_KIND = 1;
export const SPAN_KIND_SERVER: SPAN_KIND = 2;
export const SPAN_KIND_CLIENT: SPAN_KIND = 3;
export const SPAN_KIND_PRODUCER: SPAN_KIND = 4;
export const SPAN_KIND_CONSUMER: SPAN_KIND = 5;


export type SORT_BY = number;
export const SORT_BY_START_TIME: SORT_BY = 0;
export const SORT_BY_CONSUME_TIME: SORT_BY = 1;

export type AttrInfo = {
    key: string;
    value: string;
};

export type EventInfo = {
    name: string;
    time_stamp: number;
    attr_list: AttrInfo[];
};

export type SpanInfo = {
    span_id: string;
    parent_span_id: string;
    trace_id: string;
    service_name: string;
    service_version: string;
    span_name: string;
    start_time_stamp: number;
    end_time_stamp: number;
    span_kind: SPAN_KIND;
    attr_list: AttrInfo[];
    event_list: EventInfo[];
};

export type TraceInfo = {
    trace_id: string;
    root_span: SpanInfo;
};

export type ListServiceNameRequest = {
    token: string;
};

export type ListServiceNameResponse = {
    code: number;
    err_msg: string;
    service_name_list: string[];
};

export type  ListRootSpanNameRequest = {
    token: string;
    filter_by_service_name: boolean;
    service_name: string;
};

export type  ListRootSpanNameResponse = {
    code: number;
    err_msg: string;
    root_span_name_list: string[];
};

export type ListTraceRequest = {
    token: string;
    filter_by_service_name: boolean;
    service_name: string;
    filter_by_root_span_name: boolean;
    root_span_name: string;
    filter_by_attr: boolean;
    attr: AttrInfo;
    limit: number;
    sort_by: SORT_BY;
};

export type ListTraceResponse = {
    code: number;
    err_msg: string;
    trace_list: TraceInfo[];
}


export type GetTraceRequest = {
    token: string;
    trace_id: string;
}

export type GetTraceResponse = {
    code: number;
    err_msg: string;
    trace: TraceInfo;
};


export type ListSpanRequest = {
    token: string;
    trace_id: string;
};

export type ListSpanResponse = {
    code: number;
    err_msg: string;
    span_list: SpanInfo[];
};

//列出所有服务名称
export async function list_service_name(servAddr: string, request: ListServiceNameRequest): Promise<ListServiceNameResponse> {
    const cmd = 'plugin:trace_proxy_api|list_service_name';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListServiceNameResponse>(cmd, {
        servAddr,
        request,
    });
}

//列出入口名称
export async function list_root_span_name(servAddr: string, request: ListRootSpanNameRequest): Promise<ListRootSpanNameResponse> {
    const cmd = 'plugin:trace_proxy_api|list_root_span_name';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListRootSpanNameResponse>(cmd, {
        servAddr,
        request,
    });
}

//列出Trace
export async function list_trace(servAddr: string, request: ListTraceRequest): Promise<ListTraceResponse> {
    const cmd = 'plugin:trace_proxy_api|list_trace';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListTraceResponse>(cmd, {
        servAddr,
        request,
    });
}

//获取单个trace
export async function get_trace(servAddr: string, request: GetTraceRequest): Promise<GetTraceResponse> {
    const cmd = 'plugin:trace_proxy_api|get_trace';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<GetTraceResponse>(cmd, {
        servAddr,
        request,
    });
}

//列出Span
export async function list_span(servAddr: string, request: ListSpanRequest): Promise<ListSpanResponse> {
    const cmd = 'plugin:trace_proxy_api|list_span';
    console.log(`%c${cmd}`, 'color:#0f0;', request);

    return invoke<ListSpanResponse>(cmd, {
        servAddr,
        request,
    });
}