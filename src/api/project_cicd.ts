import { invoke } from '@tauri-apps/api/tauri';

export type PLATFORM_TYPE = number;
export const PLATFORM_TYPE_LINUX: PLATFORM_TYPE = 0;
export const PLATFORM_TYPE_DARWIN: PLATFORM_TYPE = 1;
export const PLATFORM_TYPE_WINDOWS: PLATFORM_TYPE = 2;


export type CREDENTIAL_TYPE = number;
export const CREDENTIAL_TYPE_KEY: CREDENTIAL_TYPE = 0;
export const CREDENTIAL_TYPE_PASSWORD: CREDENTIAL_TYPE = 1;


export type SHELL_TYPE = number;
export const SHELL_TYPE_SH: SHELL_TYPE = 0;
export const SHELL_TYPE_CMD: SHELL_TYPE = 1;
export const SHELL_TYPE_POWER_SHELL: SHELL_TYPE = 2;


export type JOB_TYPE = number;
export const JOB_TYPE_DOCKER: JOB_TYPE = 0;
export const JOB_TYPE_SHELL: JOB_TYPE = 1;
export const JOB_TYPE_SERVICE: JOB_TYPE = 2;



export type ExecRunner = {
    runner_id: string;
    serv_addr: string;
    plat_form_type: PLATFORM_TYPE;
    online: boolean;
};

export type KeyCredential = {
    private_key: string;
};

export type PasswordCredential = {
    user_name: string;
    password: string;
};

export type SimpleCredential = {
    credential_id: string;
    credential_name: string;
    credential_type: CREDENTIAL_TYPE;
};

export type Cred = {
    KeyCred?: KeyCredential
    PasswordCred?: PasswordCredential;
};

export type Credential = {
    credential_id: string;
    credential_name: string;
    credential_type: CREDENTIAL_TYPE;
    cred: Cred;
};

export type Position = {
    x: number;
    y: number;
};

export type GitsourceJob = {
    job_id: string;
    credential_id: string;
    git_url: string;
    position: Position;
    timeout: number;
};

export type ExecEnv = {
    env_id: string;
    name: string;
    value: string;
};

export type DockerJob = {
    image_url: string;
    script_content: string;
    src_data_vol: string;
    shared_data_vol: string;
    persistent_data_vol: string;
};

export type ShellJob = {
    shell_type: SHELL_TYPE;
    script_content: string;
};

export type ServiceJob = {
    docker_compose_file_id: string;
    docker_compose_file_name: string;
};

export type Job = {
    DockerJob?: DockerJob;
    ShellJob?: ShellJob;
    ServiceJob?: ServiceJob;
};

export type ExecJob = {
    job_id: string;
    job_name: string;
    job_type: JOB_TYPE;
    depend_job_list: string[];
    run_on_param_list: string[];
    env_list: ExecEnv[];
    job: Job;
    position: Position;
    timeout: number;
};


export type PipeLinePerm = {
    update_for_all: boolean;
    extra_update_user_id_list: string[];
    exec_for_all: boolean;
    extra_exec_user_id_list: string[];
};

export type PipeLine = {
    pipe_line_id: string;
    pipe_line_name: string;
    plat_form: PLATFORM_TYPE;
    gitsource_job: GitsourceJob;
    exec_job_list: ExecJob[];
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
    pipe_line_perm: PipeLinePerm;
    exec_count: number;
};

export type ExecResult = {
    exec_id: string;
    pipe_line_id: string;
    pipe_line_time: number;
    pipe_line_name: string;
    runner_id: string;
    runner_serv_addr: string;
    runner_plat_form: PLATFORM_TYPE;
    success: boolean;
    exec_user_id: string;
    exec_display_name: string;
    exec_logo_uri: string;
    exec_start_time: number;
    exec_end_time: number;
};

export type GetRunnerTokenRequest = {
    session_id: string;
    project_id: string;
};

export type GetRunnerTokenResponse = {
    code: number;
    err_msg: string;
    token: string;
};

export type RenewRunnerTokenRequest = {
    session_id: string;
    project_id: string;
};

export type RenewRunnerTokenResponse = {
    code: number;
    err_msg: string;
    token: string;
};

export type ListRunnerRequest = {
    session_id: string;
    project_id: string;
};

export type ListRunnerResponse = {
    code: number;
    err_msg: string;
    runner_list: ExecRunner[];
};

export type CreateCredentialRequest = {
    session_id: string;
    project_id: string;
    credential_name: string;
    credential_type: CREDENTIAL_TYPE;
    cred: Cred;
};

export type CreateCredentialResponse = {
    code: number;
    err_msg: string;
    credential_id: string;
};


export type ListCredentialRequest = {
    session_id: string;
    project_id: string;
};

export type ListCredentialResponse = {
    code: number;
    err_msg: string;
    credential_list: SimpleCredential[];
};

export type RemoveCredentialRequest = {
    session_id: string;
    project_id: string;
    credential_id: string;
};

export type RemoveCredentialResponse = {
    code: number;
    err_msg: string;
};

export type CreatePipeLineRequest = {
    session_id: string;
    project_id: string;
    pipe_line_name: string;
    plat_form: PLATFORM_TYPE;
    gitsource_job: GitsourceJob;
    exec_job_list: ExecJob[],
};

export type CreatePipeLineResponse = {
    code: number;
    err_msg: string;
    pipe_line_id: string;
};

export type UpdatePipeLineJobRequest = {
    session_id: string;
    project_id: string;
    pipe_line_id: string;

    gitsource_job: GitsourceJob;
    exec_job_list: ExecJob[];
};

export type UpdatePipeLineJobResponse = {
    code: number;
    err_msg: string;
};

export type UpdatePipeLineNameRequest = {
    session_id: string;
    project_id: string;
    pipe_line_id: string;
    pipe_line_name: string;
};

export type UpdatePipeLineNameResponse = {
    code: number;
    err_msg: string;
};

export type UpdatePipeLinePlatFormRequest = {
    session_id: string;
    project_id: string;
    pipe_line_id: string;
    plat_form_type: PLATFORM_TYPE;
};

export type UpdatePipeLinePlatFormResponse = {
    code: number;
    err_msg: string;
};

export type UpdatePipeLinePermRequest = {
    session_id: string;
    project_id: string;
    pipe_line_id: string;
    pipe_line_perm: PipeLinePerm;
};

export type UpdatePipeLinePermResponse = {
    code: number;
    err_msg: string;
};

export type ListPipeLineRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListPipeLineResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    pipe_line_list: PipeLine[];
};

export type GetPipeLineRequest = {
    session_id: string;
    project_id: string;
    pipe_line_id: string;
    with_update_time: boolean;
    update_time: number;
};

export type GetPipeLineResponse = {
    code: number;
    err_msg: string;
    pipe_line: PipeLine;
};

export type RemovePipeLineRequest = {
    session_id: string;
    project_id: string;
    pipe_line_id: string;
};

export type RemovePipeLineResponse = {
    code: number;
    err_msg: string;
};

export type ListExecResultRequest = {
    session_id: string;
    project_id: string;
    filter_by_pipe_line_id: boolean;
    pipe_line_id: string;
    offset: number;
    limit: number;
};

export type ListExecResultResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    result_list: ExecResult[];
};

export type CalcReqSignRequest = {
    session_id: string;
    project_id: string;
};

export type CalcReqSignResponse = {
    code: number;
    err_msg: string;
    random_str: string;
    time_stamp: number;
    sign: string;
};

//获取Runner令牌
export async function get_runner_token(request: GetRunnerTokenRequest): Promise<GetRunnerTokenResponse> {
    const cmd = 'plugin:project_cicd_api|get_runner_token';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetRunnerTokenResponse>(cmd, {
        request,
    });
}

//更新Runner令牌
export async function renew_runner_token(request: RenewRunnerTokenRequest): Promise<RenewRunnerTokenResponse> {
    const cmd = 'plugin:project_cicd_api|renew_runner_token';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RenewRunnerTokenResponse>(cmd, {
        request,
    });
}

//列出Runner
export async function list_runner(request: ListRunnerRequest): Promise<ListRunnerResponse> {
    const cmd = 'plugin:project_cicd_api|list_runner';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListRunnerResponse>(cmd, {
        request,
    });
}

//创建登录凭证
export async function create_credential(request: CreateCredentialRequest): Promise<CreateCredentialResponse> {
    const cmd = 'plugin:project_cicd_api|create_credential';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateCredentialResponse>(cmd, {
        request,
    });
}

//列出登录凭证
export async function list_credential(request: ListCredentialRequest): Promise<ListCredentialResponse> {
    const cmd = 'plugin:project_cicd_api|list_credential';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCredentialResponse>(cmd, {
        request,
    });
}

//删除登录凭证
export async function remove_credential(request: RemoveCredentialRequest): Promise<RemoveCredentialResponse> {
    const cmd = 'plugin:project_cicd_api|remove_credential';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveCredentialResponse>(cmd, {
        request,
    });
}

//创建流程
export async function create_pipe_line(request: CreatePipeLineRequest): Promise<CreatePipeLineResponse> {
    const cmd = 'plugin:project_cicd_api|create_pipe_line';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreatePipeLineResponse>(cmd, {
        request,
    });
}

//更新流程任务
export async function update_pipe_line_job(request: UpdatePipeLineJobRequest): Promise<UpdatePipeLineJobResponse> {
    const cmd = 'plugin:project_cicd_api|update_pipe_line_job';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePipeLineJobResponse>(cmd, {
        request,
    });
}

export async function update_pipe_line_name(request: UpdatePipeLineNameRequest): Promise<UpdatePipeLineNameResponse> {
    const cmd = 'plugin:project_cicd_api|update_pipe_line_name';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePipeLineNameResponse>(cmd, {
        request,
    });
}

export async function update_pipe_line_plat_form(request: UpdatePipeLinePlatFormRequest): Promise<UpdatePipeLinePlatFormResponse> {
    const cmd = 'plugin:project_cicd_api|update_pipe_line_plat_form';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePipeLinePlatFormResponse>(cmd, {
        request,
    });
}

//更新流程权限
export async function update_pipe_line_perm(request: UpdatePipeLinePermRequest): Promise<UpdatePipeLinePermResponse> {
    const cmd = 'plugin:project_cicd_api|update_pipe_line_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdatePipeLinePermResponse>(cmd, {
        request,
    });
}

//列出流程
export async function list_pipe_line(request: ListPipeLineRequest): Promise<ListPipeLineResponse> {
    const cmd = 'plugin:project_cicd_api|list_pipe_line';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListPipeLineResponse>(cmd, {
        request,
    });
}

//获取流程
export async function get_pipe_line(request: GetPipeLineRequest): Promise<GetPipeLineResponse> {
    const cmd = 'plugin:project_cicd_api|get_pipe_line';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetPipeLineResponse>(cmd, {
        request,
    });
}

//删除流程
export async function remove_pipe_line(request: RemovePipeLineRequest): Promise<RemovePipeLineResponse> {
    const cmd = 'plugin:project_cicd_api|remove_pipe_line';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemovePipeLineResponse>(cmd, {
        request,
    });
}

//列出运行结果
export async function list_exec_result(request: ListExecResultRequest): Promise<ListExecResultResponse> {
    const cmd = 'plugin:project_cicd_api|list_exec_result';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListExecResultResponse>(cmd, {
        request,
    });
}

//获取调用签名
export async function calc_req_sign(request: CalcReqSignRequest): Promise<CalcReqSignResponse> {
    const cmd = 'plugin:project_cicd_api|calc_req_sign';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CalcReqSignResponse>(cmd, {
        request,
    });
}

//打包目录
export async function pack_docker_compose(path: string, trace: string): Promise<string> {
    return invoke<string>("plugin:project_cicd_api|pack_docker_compose", {
        path,
        trace,
    });
}