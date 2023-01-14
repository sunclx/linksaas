import { invoke } from '@tauri-apps/api/tauri';

export type EXEC_STATE = number;

export const EXEC_STATE_INIT: EXEC_STATE = 0;     //初始化
export const EXEC_STATE_RUN: EXEC_STATE = 1;      //执行中
export const EXEC_STATE_SUCCESS: EXEC_STATE = 2;  //执行成功
export const EXEC_STATE_FAIL: EXEC_STATE = 3;     //执行失败

export type EnvPermission = {
    allow_all: boolean;
    env_list: string[];
};

export type SysPermission = {
    allow_hostname: boolean;
    allow_network_interfaces: boolean;
    allow_loadavg: boolean;
    allow_get_uid: boolean;
    allow_get_gid: boolean;
    allow_os_release: boolean;
    allow_system_memory_info: boolean;
};

export type NetPermission = {
    allow_all: boolean;
    addr_list: string[];
    allow_vc_update: boolean;
};

export type ReadPermission = {
    allow_all: boolean;
    path_list: string[];
};

export type WritePermission = {
    allow_all: boolean;
    path_list: string[];
};

export type RunPermission = {
    allow_all: boolean;
    file_list: string[];
};

export type Permission = {
    env_perm: EnvPermission;
    sys_perm: SysPermission;
    net_perm: NetPermission;
    read_perm: ReadPermission;
    write_perm: WritePermission;
    run_perm: RunPermission;
};

export type EnvParamDef = {
    env_name: string;
    desc: string;
    default_value: string;
};

export type ArgParamDef = {
    desc: string;
    default_value: string;
};

export type ExecParamDef = {
    env_param_def_list: EnvParamDef[];
    arg_param_def_list: ArgParamDef[];
};

export type EnvParam = {
    env_name: string;
    env_value: string;
};

export type ExecParam = {
    env_param_list: EnvParam[];
    arg_param_list: string[];
};

export type ScriptSuiteKey = {
    script_suite_id: string;
    script_suite_name: string;
    exec_user: string;
    exec_count: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
};

export type ScriptSuiteInfo = {
    script_suite_id: string;
    script_suite_name: string;
    exec_user: string;
    permission: Permission;
    exec_param_def: ExecParamDef;
    script_content: string;
    script_time: number;
    script_user_id: string;
    script_display_name: string;
    script_logo_uri: string;
    exec_count: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
};

export type ScriptHistoryKey = {
    script_suite_id: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
};


export type ExecInfo = {
    exec_id: string;
    project_id: string;
    script_suite_id: string;
    script_time: number;
    exec_user_id: string;
    exec_display_name: string;
    exec_time: number;
    exec_state: EXEC_STATE;
    exec_param: ExecParam;
};

export type ExecData = {
    time_offset: number;
    data_index: number;
    data: number[],
};

export type CreateScriptSuiteRequest = {
    session_id: string;
    project_id: string;
    script_suite_name: string;
    exec_user: string;
    permission: Permission;
    exec_param_def: ExecParamDef;
    script_content: string;
};

export type CreateScriptSuiteResponse = {
    code: number;
    err_msg: string;
    script_suite_id: string;
};

export type ListScriptSuiteKeyRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListScriptSuiteKeyResponse = {

    code: number;

    err_msg: string;

    total_count: number;

    script_suite_key_list: ScriptSuiteKey[];
};

export type GetScriptSuiteKeyRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
};
export type GetScriptSuiteKeyResponse = {
    code: number;
    err_msg: string;
    script_suite_key: ScriptSuiteKey;
};

export type GetScriptSuiteRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    use_history_script: boolean;
    script_time: number;
};

export type GetScriptSuiteResponse = {
    code: number;
    err_msg: string;
    script_suite_info: ScriptSuiteInfo;
};

export type RemoveScriptSuiteRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
};

export type RemoveScriptSuiteResponse = {
    code: number;
    err_msg: string;
};

export type UpdateScriptSuiteNameRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    name: string;
};

export type UpdateScriptSuiteNameResponse = {
    code: number;
    err_msg: string;
};

export type UpdateEnvPermRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    env_perm: EnvPermission;
};

export type UpdateEnvPermResponse = {
    code: number;
    err_msg: string;
};

export type UpdateSysPermRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    sys_perm: SysPermission;
};

export type UpdateSysPermResponse = {
    code: number;
    err_msg: string;
};

export type UpdateNetPermRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    net_perm: NetPermission;
};

export type UpdateNetPermResponse = {
    code: number;
    err_msg: string;
};

export type UpdateReadPermRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    read_perm: ReadPermission;
};

export type UpdateReadPermResponse = {
    code: number;
    err_msg: string;
};

export type UpdateWritePermRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    write_perm: WritePermission;
};

export type UpdateWritePermResponse = {
    code: number;
    err_msg: string;
};


export type UpdateRunPermRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    run_perm: RunPermission;
};


export type UpdateRunPermResponse = {
    code: number;
    err_msg: string;
};

export type UpdateScriptRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    script_content: string;
};

export type UpdateScriptResponse = {
    code: number;
    err_msg: string;
};

export type UpdateExecUserRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    exec_user: string;
};

export type UpdateExecUserResponse = {
    code: number;
    err_msg: string;
};

export type UpdateEnvParamDefRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    env_param_def_list: EnvParamDef[];
};

export type UpdateEnvParamDefResponse = {
    code: number;
    err_msg: string;
};

export type UpdateArgParamDefRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    arg_param_def_list: ArgParamDef[];
};

export type UpdateArgParamDefResponse = {
    code: number;
    err_msg: string;
};

export type ListScriptHistoryKeyRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    offset: number;
    limit: number;
};

export type ListScriptHistoryKeyResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    history_key_list: ScriptHistoryKey[];
};

export type GetScriptFromHistoryRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    create_time: number;
};

export type GetScriptFromHistoryResponse = {
    code: number;
    err_msg: string;
    history_key: ScriptHistoryKey;
    script_content: string;
};

export type RecoverScriptFromHistoryRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    create_time: number;
};

export type RecoverScriptFromHistoryResponse = {
    code: number;
    err_msg: string;
};

export type ExecScriptSuitRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    exec_param: ExecParam;
    robot_id: string;
};

export type ExecScriptSuitResponse = {
    code: number;
    err_msg: string;
    exec_id: string;
};

export type ListExecRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    offset: number;
    limit: number;
};

export type ListExecResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    exec_info_list: ExecInfo[];
};

export type GetExecRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    exec_id: string;
};

export type GetExecResponse = {
    code: number;
    err_msg: string;
    exec_info: ExecInfo;
};

export type WatchExecRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    exec_id: string;
};

export type WatchExecResponse = {
    code: number;
    err_msg: string;
};

export type ListExecDataRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
    exec_id: string;
    from_data_index: number;
    to_data_index: number;
};

export type ListExecDataResponse = {
    code: number;
    err_msg: string;
    data_list: ExecData[],
};

export type GetLastExecParamRequest = {
    session_id: string;
    project_id: string;
    script_suite_id: string;
};
export type GetLastExecParamResponse = {
    code: number;
    err_msg: string;
    exec_param: ExecParam;
};

//创建脚本套件
export async function create_script_suite(request: CreateScriptSuiteRequest): Promise<CreateScriptSuiteResponse> {
    const cmd = 'plugin:robot_script_api|create_script_suite';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateScriptSuiteResponse>(cmd, {
        request,
    });
}

//列出脚本套件
export async function list_script_suite_key(request: ListScriptSuiteKeyRequest): Promise<ListScriptSuiteKeyResponse> {
    const cmd = 'plugin:robot_script_api|list_script_suite_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListScriptSuiteKeyResponse>(cmd, {
        request,
    });
}

//获取单个脚本套件简单信息
export async function get_script_suite_key(request: GetScriptSuiteKeyRequest): Promise<GetScriptSuiteKeyResponse> {
    const cmd = 'plugin:robot_script_api|get_script_suite_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetScriptSuiteKeyResponse>(cmd, {
        request,
    });
}

//获取单个脚本套件
export async function get_script_suite(request: GetScriptSuiteRequest): Promise<GetScriptSuiteResponse> {
    const cmd = 'plugin:robot_script_api|get_script_suite';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetScriptSuiteResponse>(cmd, {
        request,
    });
}

//删除脚本套件
export async function remove_script_suite(request: RemoveScriptSuiteRequest): Promise<RemoveScriptSuiteResponse> {
    const cmd = 'plugin:robot_script_api|remove_script_suite';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveScriptSuiteResponse>(cmd, {
        request,
    });
}

//更新脚本套件名称
export async function update_script_suite_name(request: UpdateScriptSuiteNameRequest): Promise<UpdateScriptSuiteNameResponse> {
    const cmd = 'plugin:robot_script_api|update_script_suite_name';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateScriptSuiteNameResponse>(cmd, {
        request,
    });
}

//更新环境权限
export async function update_env_perm(request: UpdateEnvPermRequest): Promise<UpdateEnvPermResponse> {
    const cmd = 'plugin:robot_script_api|update_env_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateEnvPermResponse>(cmd, {
        request,
    });
}

//更新系统信息权限
export async function update_sys_perm(request: UpdateSysPermRequest): Promise<UpdateSysPermResponse> {
    const cmd = 'plugin:robot_script_api|update_sys_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateSysPermResponse>(cmd, {
        request,
    });
}

//更新网络访问权限
export async function update_net_perm(request: UpdateNetPermRequest): Promise<UpdateNetPermResponse> {
    const cmd = 'plugin:robot_script_api|update_net_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateNetPermResponse>(cmd, {
        request,
    });
}

//更新文件读取权限
export async function update_read_perm(request: UpdateReadPermRequest): Promise<UpdateReadPermResponse> {
    const cmd = 'plugin:robot_script_api|update_read_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateReadPermResponse>(cmd, {
        request,
    });
}

//更新文件写权限
export async function update_write_perm(request: UpdateWritePermRequest): Promise<UpdateWritePermResponse> {
    const cmd = 'plugin:robot_script_api|update_write_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateWritePermResponse>(cmd, {
        request,
    });
}

//更新子进程运行权限
export async function update_run_perm(request: UpdateRunPermRequest): Promise<UpdateRunPermResponse> {
    const cmd = 'plugin:robot_script_api|update_run_perm';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateRunPermResponse>(cmd, {
        request,
    });
}

//更新脚本
export async function update_script(request: UpdateScriptRequest): Promise<UpdateScriptResponse> {
    const cmd = 'plugin:robot_script_api|update_script';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateScriptResponse>(cmd, {
        request,
    });
}

//更新执行用户
export async function update_exec_user(request: UpdateExecUserRequest): Promise<UpdateExecUserResponse> {
    const cmd = 'plugin:robot_script_api|update_exec_user';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateExecUserResponse>(cmd, {
        request,
    });
}

//更新环境参数定义
export async function update_env_param_def(request: UpdateEnvParamDefRequest): Promise<UpdateEnvParamDefResponse> {
    const cmd = 'plugin:robot_script_api|update_env_param_def';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateEnvParamDefResponse>(cmd, {
        request,
    });
}

//更新脚本参数定义
export async function update_arg_param_def(request: UpdateArgParamDefRequest): Promise<UpdateArgParamDefResponse> {
    const cmd = 'plugin:robot_script_api|update_arg_param_def';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateArgParamDefResponse>(cmd, {
        request,
    });
}

//列出脚本历史
export async function list_script_history_key(request: ListScriptHistoryKeyRequest): Promise<ListScriptHistoryKeyResponse> {
    const cmd = 'plugin:robot_script_api|list_script_history_key';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListScriptHistoryKeyResponse>(cmd, {
        request,
    });
}

//获取历史脚本
export async function get_script_from_history(request: GetScriptFromHistoryRequest): Promise<GetScriptFromHistoryResponse> {
    const cmd = 'plugin:robot_script_api|get_script_from_history';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetScriptFromHistoryResponse>(cmd, {
        request,
    });
}

//恢复到历史脚本
export async function recover_script_from_history(request: RecoverScriptFromHistoryRequest): Promise<RecoverScriptFromHistoryResponse> {
    const cmd = 'plugin:robot_script_api|recover_script_from_history';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RecoverScriptFromHistoryResponse>(cmd, {
        request,
    });
}

//执行脚本套件
export async function exec_script_suit(request: ExecScriptSuitRequest): Promise<ExecScriptSuitResponse> {
    const cmd = 'plugin:robot_script_api|exec_script_suit';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ExecScriptSuitResponse>(cmd, {
        request,
    });
}

//列出执行记录
export async function list_exec(request: ListExecRequest): Promise<ListExecResponse> {
    const cmd = 'plugin:robot_script_api|list_exec';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListExecResponse>(cmd, {
        request,
    });
}

//获取单个执行记录
export async function get_exec(request: GetExecRequest): Promise<GetExecResponse> {
    const cmd = 'plugin:robot_script_api|get_exec';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetExecResponse>(cmd, {
        request,
    });
}

//watch执行
export async function watch_exec(request: WatchExecRequest): Promise<WatchExecResponse> {
    const cmd = 'plugin:robot_script_api|watch_exec';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<WatchExecResponse>(cmd, {
        request,
    });
}

//列出执行数据
export async function list_exec_data(request: ListExecDataRequest): Promise<ListExecDataResponse> {
    const cmd = 'plugin:robot_script_api|list_exec_data';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListExecDataResponse>(cmd, {
        request,
    });
}

//
export async function get_last_exec_param(request: GetLastExecParamRequest): Promise<GetLastExecParamResponse> {
    const cmd = 'plugin:robot_script_api|get_last_exec_param';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetLastExecParamResponse>(cmd, {
        request,
    });
}