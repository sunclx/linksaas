import { invoke } from '@tauri-apps/api/tauri';


export type ALARM_TYPE = number;
export const ALARM_TYPE_ISSUE_DEPEND_HIT: ALARM_TYPE = 0;
export const ALARM_TYPE_ISSUE_DEPEND_ALERT: ALARM_TYPE = 1;
export const ALARM_TYPE_ISSUE_DELAY_HIT: ALARM_TYPE = 2;
export const ALARM_TYPE_ISSUE_DELAY_ALERT: ALARM_TYPE = 3;
export const ALARM_TYPE_ISSUE_REOPEN_HIT: ALARM_TYPE = 4;
export const ALARM_TYPE_ISSUE_REOPEN_ALERT: ALARM_TYPE = 5;
export const ALARM_TYPE_SCRIPT_ERROR_HIT: ALARM_TYPE = 6;
export const ALARM_TYPE_EARTHLY_ERROR_HIT: ALARM_TYPE = 7;

export type Config = {
    enable_issue_depend_check: boolean;//进行工单依赖检查
    issue_depend_hit_value: number;//工单依赖数量触发提示的边界值
    issue_depend_alert_value: number;//工单依赖触发触发警告的边界值
    enable_issue_delay_check: boolean;//进行工单延期检查
    issue_delay_hit_value: number;//工单延期触发提示的边界值
    issue_delay_alert_value: number;//工单延期触发警告的边界值
    enable_issue_re_open_check: boolean;//进行工单重新打开检查
    issue_re_open_hit_value: number;//工单重新打开触发提示的边界值
    issue_re_open_alert_value: number;//工单重新打开触发警告的边界值
    enable_script_error_check: boolean;//服务端脚本运行出错检查
    enable_earthly_error_check: boolean;// earthly运行出错检查
};

export type IssueDependHitInfo = {
    issue_id: string;
};

export type IssueDependAlertInfo = {
    issue_id: string;
};

export type IssueDelayHitInfo = {
    issue_id: string;
};

export type IssueDelayAlertInfo = {
    issue_id: string;
};

export type IssueReOpenHitInfo = {
    issue_id: string;
};

export type IssueReOpenAlertInfo = {
    issue_id: string;
};

export type ScriptErrorHitInfo = {
    script_suite_id: string;
    exec_id: string;
};

export type EarthlyErrorHitInfo = {
    repo_id: string;
    action_id: string;
    exec_id: string;
};

export type Content = {
    IssueDependHitInfo?: IssueDependHitInfo;
    IssueDependAlertInfo?: IssueDependAlertInfo;
    IssueDelayHitInfo?: IssueDelayHitInfo;
    IssueDelayAlertInfo?: IssueDelayAlertInfo;
    IssueReOpenHitInfo?: IssueReOpenHitInfo;
    IssueReOpenAlertInfo?: IssueReOpenAlertInfo;
    ScriptErrorHitInfo?: ScriptErrorHitInfo;
    EarthlyErrorHitInfo?: EarthlyErrorHitInfo;

};

export type Alarm = {
    alarm_id: string;
    project_id: string;
    time_stamp: number;
    alarm_type: ALARM_TYPE;
    title: string;
    content: Content;
};


export type SetConfigRequest = {
    session_id: string;
    project_id: string;
    config: Config;
};

export type SetConfigResponse = {
    code: number;
    err_msg: string;
};


export type GetConfigRequest = {
    session_id: string;
    project_id: string;
};

export type GetConfigResponse = {
    code: number;
    err_msg: string;
    config: Config;
}


export type GetAlarmStateRequest = {
    session_id: string;
    project_id: string;
};

export type GetAlarmStateResponse = {
    code: number;
    err_msg: string;
    hit_count: number;
    alert_count: number;
};


export type ListAlarmRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListAlarmResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    alarm_list: Alarm[];
};


export type RemoveAlarmRequest = {
    session_id: string;
    project_id: string;
    alarm_id: string;
};

export type RemoveAlarmResponse = {
    code: number;
    err_msg: string;
};

//设置预警配置
export async function set_config(request: SetConfigRequest): Promise<SetConfigResponse> {
    const cmd = 'plugin:project_alarm_api|set_config';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetConfigResponse>(cmd, {
        request,
    });
}

//获取预警配置
export async function get_config(request: GetConfigRequest): Promise<GetConfigResponse> {
    const cmd = 'plugin:project_alarm_api|get_config';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetConfigResponse>(cmd, {
        request,
    });
}

//获取警告状态
export async function get_alarm_state(request: GetAlarmStateRequest): Promise<GetAlarmStateResponse> {
    const cmd = 'plugin:project_alarm_api|get_alarm_state';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetAlarmStateResponse>(cmd, {
        request,
    });
}

//查看报警
export async function list_alarm(request: ListAlarmRequest): Promise<ListAlarmResponse> {
    const cmd = 'plugin:project_alarm_api|list_alarm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAlarmResponse>(cmd, {
        request,
    });
}

//删除告警
export async function remove_alarm(request: RemoveAlarmRequest): Promise<RemoveAlarmResponse> {
    const cmd = 'plugin:project_alarm_api|remove_alarm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveAlarmResponse>(cmd, {
        request,
    });
}