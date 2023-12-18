import { invoke } from '@tauri-apps/api/tauri';

export type ListPackageRequest = {};

export type ListPackageResponse = {
    code: number;
    err_msg: string;
    package_name_list: string[];
};


export type ListPackageVersionRequest = {
    package_name: string;
};

export type ListPackageVersionResponse = {
    code: number;
    err_msg: string;
    version_list: string[];
};

//列出软件包
export async function list_package(request: ListPackageRequest): Promise<ListPackageResponse> {
    const cmd = 'plugin:dev_container_api|list_package';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListPackageResponse>(cmd, {
        request,
    });
}

//列出软件包版本
export async function list_package_version(request: ListPackageVersionRequest): Promise<ListPackageVersionResponse> {
    const cmd = 'plugin:dev_container_api|list_package_version';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListPackageVersionResponse>(cmd, {
        request,
    });
}