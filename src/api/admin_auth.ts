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

export type AdPerm = {
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

export type BookStorePerm = {
    read: boolean;
    add_cate: boolean;
    update_cate: boolean;
    remove_cate: boolean;
    add_book: boolean;
    update_book: boolean;
    remove_book: boolean;
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

export type RssPerm = {
    read: boolean;
    add_crawler: boolean;
    upate_crawler: boolean;
    remove_crawler: boolean;
};

export type PubSearchPerm = {
    read: boolean;
    add_cate: boolean;
    update_cate: boolean;
    remove_cate: boolean;
    add_site: boolean;
    update_site: boolean;
    remove_site: boolean;
};

export type AdminPermInfo = {
    org_perm: OrgPerm;
    user_perm: UserPerm;
    project_perm: ProjectPerm;
    project_member_perm: ProjectMemberPerm;
    menu_perm: MenuPerm;
    ad_perm: AdPerm;
    app_store_perm: AppStorePerm;
    book_store_perm: BookStorePerm;
    docker_template_perm: DockerTemplatePerm;
    rss_perm: RssPerm;
    pub_search_perm: PubSearchPerm;
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
    if (perm.rss_perm == undefined) {
        perm.rss_perm = {
            read: false,
            add_crawler: false,
            upate_crawler: false,
            remove_crawler: false,
        };
    }
    if (perm.pub_search_perm == undefined) {
        perm.pub_search_perm = {
            read: true,
            add_cate: true,
            update_cate: true,
            remove_cate: true,
            add_site: true,
            update_site: true,
            remove_site: true,
        }
    }
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