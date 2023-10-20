import { invoke } from '@tauri-apps/api/tauri';

export type EXEC_STATE = number;

export const EXEC_STATE_UN_START: EXEC_STATE = 0;  //未开始
export const EXEC_STATE_RUNNING: EXEC_STATE = 1;   //执行中
export const EXEC_STATE_STOP: EXEC_STATE = 2;      //已停止(结束)
export const EXEC_STATE_SKIP: EXEC_STATE = 3;      //跳过执行

export type GIT_REF_TYPE = number;

export const  GIT_REF_TYPE_BRANCH: GIT_REF_TYPE = 0;
export const  GIT_REF_TYPE_TAG: GIT_REF_TYPE = 1;

export type DownloadResult = {
    exist_in_local: boolean;
    local_path: string;
    local_dir: string;
};

export type ExecParam = {
    name: string;
    value: string;
};

export type JobExecState = {
    job_id: string;
    exec_state: EXEC_STATE,
    success: boolean;
    start_time: number;
    stop_time: number;
};

export type PipeLineExecState = {
    exec_state: EXEC_STATE,
    success: boolean;
    start_time: number;
    stop_time: number;
    job_exec_state_list: JobExecState[];
};

export type LogData = {
    time_offset: number;
    content: number[];
};

export type FsEntry = {
    name: string;
    dir: boolean;
    full_path: string;
};

export type StartExecRequest = {
    project_id: string;
    pipe_line_id: string;
    pipe_line_time: number;
    param_list: ExecParam[];
    git_ref_type: GIT_REF_TYPE;
    git_ref_name: string;
    exec_user_id: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

export type StartExecResponse = {
    code: number;
    err_msg: string;
    exec_id: string;
};


export type StopExecRequest = {
    project_id: string;
    pipe_line_id: string;
    exec_id: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

export type StopExecResponse = {
    code: number;
    err_msg: string;
};

export type GetExecStateRequest = {
    project_id: string;
    pipe_line_id: string;
    exec_id: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

export type GetExecStateResponse = {
    code: number;
    err_msg: string;
    exec_state: PipeLineExecState;
};

export type GetJobLogRequest = {
    project_id: string;
    pipe_line_id: string;
    exec_id: string;
    job_id: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

export type GetJobLogResponse = {
    code: number;
    err_msg: string;
    log_data: LogData;
};

export type ListResultFsRequest = {
    project_id: string;
    pipe_line_id: string;
    exec_id: string;
    dir_path: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

export type ListResultFsResponse = {
    code: number;
    err_msg: string;
    entry_list: FsEntry[];
};

export type StatResultFileRequest = {
    project_id: string;
    pipe_line_id: string;
    exec_id: string;
    full_path: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

export type StatResultFileResponse = {
    code: number;
    err_msg: string;
    file_size: number;
};

export type GetResultFileRequest = {
    project_id: string;
    pipe_line_id: string;
    exec_id: string;
    full_path: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

export type GetResultFileResponse = {
    code: number;
    err_msg: string;
    file_data: Uint8Array;
};

//开始运行流水线
export async function start_exec(serv_addr: string, request: StartExecRequest): Promise<StartExecResponse> {
    const cmd = 'plugin:cicd_runner_api|start_exec';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<StartExecResponse>(cmd, {
        servAddr: serv_addr,
        request,
    });
}

//停止运行流水线
export async function stop_exec(serv_addr: string, request: StopExecRequest): Promise<StopExecResponse> {
    const cmd = 'plugin:cicd_runner_api|stop_exec';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<StopExecResponse>(cmd, {
        servAddr: serv_addr,
        request,
    });
}

//获取运行状态
export async function get_exec_state(serv_addr: string, request: GetExecStateRequest): Promise<GetExecStateResponse> {
    const cmd = 'plugin:cicd_runner_api|get_exec_state';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetExecStateResponse>(cmd, {
        servAddr: serv_addr,
        request,
    });
}

//获取任务日志
export async function get_job_log(serv_addr: string, trace_id: string, request: GetJobLogRequest): Promise<void> {
    const cmd = 'plugin:cicd_runner_api|get_job_log';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<void>(cmd, {
        servAddr: serv_addr,
        traceId: trace_id,
        request,
    });
}

//列出结果文件
export async function list_result_fs(serv_addr: string, request: ListResultFsRequest): Promise<ListResultFsResponse> {
    const cmd = 'plugin:cicd_runner_api|list_result_fs';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListResultFsResponse>(cmd, {
        servAddr: serv_addr,
        request,
    });
}

//获取文件大小
export async function stat_result_file(serv_addr: string, request: StatResultFileRequest): Promise<StatResultFileResponse> {
    const cmd = 'plugin:cicd_runner_api|stat_result_file';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<StatResultFileResponse>(cmd, {
        servAddr: serv_addr,
        request,
    });
}

//获取结果文件
export async function get_result_file(serv_addr: string, trace_id: string, request: GetResultFileRequest): Promise<DownloadResult> {
    const cmd = 'plugin:cicd_runner_api|get_result_file';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<DownloadResult>(cmd, {
        servAddr: serv_addr,
        traceId: trace_id,
        request,
    });
}