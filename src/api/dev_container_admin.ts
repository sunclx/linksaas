import { invoke } from '@tauri-apps/api/tauri';

export type AdminAddPackageRequest = {
    admin_session_id: string;
    package_name: string;
};

export type AdminAddPackageResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemovePackageRequest = {
    admin_session_id: string;
    package_name: string;
};

export type AdminRemovePackageResponse = {
    code: number;
    err_msg: string;
};

export type AdminAddPackageVersionRequest = {
    admin_session_id: string;
    package_name: string;
    version: string;
};

export type AdminAddPackageVersionResponse = {
    code: number;
    err_msg: string;
};

export type AdminRemovePackageVersionRequest = {
    admin_session_id: string;
    package_name: string;
    version: string;
};

export type AdminRemovePackageVersionResponse = {
    code: number;
    err_msg: string;
};

//增加软件包
export async function add_package(request: AdminAddPackageRequest): Promise<AdminAddPackageResponse> {
    const cmd = 'plugin:dev_container_admin_api|add_package';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddPackageResponse>(cmd, {
        request,
    });
}

//删除软件包
export async function remove_package(request: AdminRemovePackageRequest): Promise<AdminRemovePackageResponse> {
    const cmd = 'plugin:dev_container_admin_api|remove_package';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemovePackageResponse>(cmd, {
        request,
    });
}

//增加软件包版本
export async function add_package_version(request: AdminAddPackageVersionRequest): Promise<AdminAddPackageVersionResponse> {
    const cmd = 'plugin:dev_container_admin_api|add_package_version';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddPackageVersionResponse>(cmd, {
        request,
    });
}

//删除软件包版本
export async function remove_package_version(request: AdminRemovePackageVersionRequest): Promise<AdminRemovePackageVersionResponse> {
    const cmd = 'plugin:dev_container_admin_api|remove_package_version';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemovePackageVersionResponse>(cmd, {
        request,
    });
}