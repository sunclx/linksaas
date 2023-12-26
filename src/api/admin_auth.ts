import { invoke } from '@tauri-apps/api/tauri';


export type Signature = {
    format: string;
    blob: number[];
    rest: number[];
};

export type UserPerm = {
    read: boolean;
    create: boolean;
    set_state: boolean;
    reset_password: boolean;
    access_event: boolean;
};

export type ProjectPerm = {
    read: boolean;
    create: boolean;
    update: boolean;
    access_event: boolean;
};

export type ProjectMemberPerm = {
    read: boolean;
    add: boolean;
    remove: boolean;
};

export type MenuPerm = {
    read: boolean;
    add: boolean;
    remove: boolean;
    set_weight: boolean;
};


export type AppStorePerm = {
    read: boolean;
    add_cate: boolean;
    update_cate: boolean;
    remove_cate: boolean;
    add_app: boolean;
    update_app: boolean;
    remove_app: boolean;
    remove_comment: boolean;
};

export type DockerTemplatePerm = {
    read: boolean;
    create_cate: boolean;
    update_cate: boolean;
    remove_cate: boolean;
    create_app: boolean;
    update_app: boolean;
    remove_app: boolean;
    create_template: boolean;
    remove_template: boolean;
    remove_comment: boolean;
};

export type GroupPerm = {
    read: boolean;
    update_group: boolean;
    audit_recommend: boolean;
};

export type DevContainerPerm = {
    read: boolean;
    add_package: boolean;
    remove_package: boolean;
    add_package_version: boolean;
    remove_package_version: boolean;
};


export type AdminPermInfo = {
    user_perm: UserPerm;
    project_perm: ProjectPerm;
    project_member_perm: ProjectMemberPerm;
    menu_perm: MenuPerm;
    app_store_perm: AppStorePerm;
    docker_template_perm: DockerTemplatePerm;
    group_perm: GroupPerm;
    dev_container_perm: DevContainerPerm;
    global_server: boolean;
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
    const perm = await invoke<AdminPermInfo>(cmd, {});
    return perm
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