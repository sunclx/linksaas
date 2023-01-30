import { invoke } from '@tauri-apps/api/tauri';


export type Signature = {
    format: string;
    blob: number[];
    rest: number[];
};

export type OrgPerm = {
    read: boolean;
    create: boolean;
    update: boolean;
    remove: boolean;
    move: boolean;
    add_user: boolean;
    remove_user: boolean;
};

export type UserPerm = {
    read: boolean;
    create: boolean;
    set_state: boolean;
    reset_password: boolean;
};

export type ProjectPerm = {
    read: boolean;
    create: boolean;
    update: boolean;
};

export type ProjectMemberPerm = {
    read: boolean;
    add: boolean;
    remove: boolean;
};

export type AdminPermInfo = {
    org_perm: OrgPerm;
    user_perm: UserPerm;
    project_perm: ProjectPerm;
    project_member_perm: ProjectMemberPerm;
};

export type PreAuthRequest = {
    user_name: string;
};

export type PreAuthResponse = {
    code: number;
    err_msg: string;
    admin_session_id: string;
    to_sign_str: string;
};


export type AuthRequest = {
    admin_session_id: string;
    sign: Signature;
};

export type AuthResponse = {
    code: number;
    err_msg: string;
    admin_perm_info: AdminPermInfo;
};

export async function pre_auth(request: PreAuthRequest): Promise<PreAuthResponse> {
    const cmd = 'plugin:admin_auth_api|pre_auth';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<PreAuthResponse>(cmd, {
        request,
    });
}

export async function auth(request: AuthRequest): Promise<AuthResponse> {
    const cmd = 'plugin:admin_auth_api|auth';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AuthResponse>(cmd, {
        request,
    });
}

//获取当前管理会话ID
export async function get_admin_session(): Promise<string> {
    const cmd = 'plugin:admin_auth_api|get_admin_session';
    return invoke<string>(cmd, {});
}

//获取当前管理会话权限
export async function get_admin_perm(): Promise<AdminPermInfo> {
    const cmd = 'plugin:admin_auth_api|get_admin_perm';
    return invoke<AdminPermInfo>(cmd, {});
}

//用私钥对内容签名
export async function sign(privateKeyFile: string, toSignStr: string): Promise<Signature> {
    const cmd = 'plugin:admin_auth_api|sign';
    const request = {
        privateKeyFile,
        toSignStr,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<Signature>(cmd, request);
}