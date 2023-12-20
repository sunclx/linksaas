import { invoke } from '@tauri-apps/api/tauri';
import { exists, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { uniqId } from '@/utils/utils';


export const DEV_FILE = ".simple_dev.json";

export type DevPkgVersion = {
    id?: string;
    package: string;
    version: string;
};

export type DevForwardPort = {
    id?: string;
    container_port: number;
    host_port: number;
    public: boolean; //是否监听0.0.0.0
}

export type DevEnv = {
    id?: string;
    key: string;
    value: string;
};

export type DevExtension = {
    id: string;
    display_name: string;
    desc: string;
    logo_url: string;
};

export type SimpleDevInfo = {
    pkg_version_list: DevPkgVersion[];
    forward_port_list: DevForwardPort[];
    env_list: DevEnv[];
    extension_list: DevExtension[];
};

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

//获取SimpleDevInfo
export async function load_simple_dev_info(repoPath: string): Promise<SimpleDevInfo> {
    const path = `${repoPath}/${DEV_FILE}`;
    const devExist = await exists(path);
    if (!devExist) {
        return {
            pkg_version_list: [],
            forward_port_list: [],
            env_list: [],
            extension_list: [],
        };
    }
    const data = await readTextFile(path);
    try {
        const retInfo = JSON.parse(data) as SimpleDevInfo;
        if (retInfo.pkg_version_list == undefined || retInfo.pkg_version_list == null) {
            retInfo.pkg_version_list = [];
        }
        for (const part of retInfo.pkg_version_list) {
            part.id = uniqId();
        }
        if (retInfo.forward_port_list == undefined || retInfo.forward_port_list == null) {
            retInfo.forward_port_list = [];
        }
        for (const part of retInfo.forward_port_list) {
            part.id = uniqId();
        }
        if (retInfo.env_list == undefined || retInfo.env_list == null) {
            retInfo.env_list = [];
        }
        for (const part of retInfo.env_list) {
            part.id = uniqId();
        }
        if (retInfo.extension_list == undefined || retInfo.extension_list == null) {
            retInfo.extension_list = [];
        }
        return retInfo;
    } catch (e) {
        console.log(e);
        return {
            pkg_version_list: [],
            forward_port_list: [],
            env_list: [],
            extension_list: [],
        };
    }
}

//保存simpleInfo
export async function save_simple_dev_info(repoPath: string, simpleDevInfo: SimpleDevInfo): Promise<void> {
    const tmpInfo: SimpleDevInfo = {
        pkg_version_list: [],
        forward_port_list: [],
        env_list: [],
        extension_list: [],
    };
    for (const srcInfo of simpleDevInfo.pkg_version_list) {
        if (srcInfo.package == "" || srcInfo.version == "") {
            continue;
        }
        const destInfo: DevPkgVersion = {
            package: srcInfo.package,
            version: srcInfo.version,
        };
        tmpInfo.pkg_version_list.push(destInfo);
    }
    for (const srcInfo of simpleDevInfo.forward_port_list) {
        if (srcInfo.container_port == 0 || srcInfo.host_port == 0) {
            continue;
        }
        const destInfo: DevForwardPort = {
            container_port: srcInfo.container_port,
            host_port: srcInfo.host_port,
            public: srcInfo.public,
        }
        tmpInfo.forward_port_list.push(destInfo);
    }
    for (const srcInfo of simpleDevInfo.env_list) {
        if (srcInfo.key == "" || srcInfo.value == "") {
            continue;
        }
        const destInfo: DevEnv = {
            key: srcInfo.key,
            value: srcInfo.value,
        };
        tmpInfo.env_list.push(destInfo);
    }
    tmpInfo.extension_list = simpleDevInfo.extension_list ?? [];
    const path = `${repoPath}/${DEV_FILE}`;
    await writeTextFile(path, JSON.stringify(tmpInfo));
}