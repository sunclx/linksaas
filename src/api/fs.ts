import { invoke } from '@tauri-apps/api/tauri';

export const GLOBAL_APPSTORE_FS_ID = "globalAppStore";
export const GLOBAL_DOCKER_TEMPLATE_FS_ID = "globalDockerTemplate";

export type FS_OWNER_TYPE = number;

export const FS_OWNER_TYPE_USER: FS_OWNER_TYPE = 0; //用户文件存储
export const FS_OWNER_TYPE_PROJECT: FS_OWNER_TYPE = 1; //项目文件存储
export const FS_OWNER_TYPE_GLOBAL: FS_OWNER_TYPE = 2; //全局文件系统
export const FS_OWNER_TYPE_GROUP: FS_OWNER_TYPE = 3; //兴趣小组文件系统

export type FILE_OWNER_TYPE = number;


export const FILE_OWNER_TYPE_NONE: FILE_OWNER_TYPE = 0;//未设置owner
export const FILE_OWNER_TYPE_USER_PHOTO: FILE_OWNER_TYPE = 1;//用户头像
// export const FILE_OWNER_TYPE_USER_DOC: FILE_OWNER_TYPE = 2; //用户知识库文档
// export const FILE_OWNER_TYPE_CHANNEL: FILE_OWNER_TYPE = 3; //频道
export const FILE_OWNER_TYPE_ISSUE: FILE_OWNER_TYPE = 4; //工单(任务，缺陷)
// export const FILE_OWNER_TYPE_WORK_SNAPSHOT: FILE_OWNER_TYPE = 5; //工作快照
export const FILE_OWNER_TYPE_PROJECT_DOC: FILE_OWNER_TYPE = 6; //文档
// export const FILE_OWNER_TYPE_PROJECT_EBOOK: FILE_OWNER_TYPE = 7; //电子书
// export const FILE_OWNER_TYPE_PROJECT_ARTIFACT: FILE_OWNER_TYPE = 8;   //自动化构建结果
// export const FILE_OWNER_TYPE_TEST_CASE: FILE_OWNER_TYPE = 9;          //测试用例
// export const FILE_OWNER_TYPE_TEST_CASE_RESULT: FILE_OWNER_TYPE = 10;  //测试用例结果
export const FILE_OWNER_TYPE_MIN_APP: FILE_OWNER_TYPE = 11; //微应用
export const FILE_OWNER_TYPE_REQUIRE_MENT: FILE_OWNER_TYPE = 12; //项目需求
export const FILE_OWNER_TYPE_APP_STORE: FILE_OWNER_TYPE = 13; //应用市场
export const FILE_OWNER_TYPE_IDEA: FILE_OWNER_TYPE = 14; //知识点
// export const FILE_OWNER_TYPE_BOOK_STORE: FILE_OWNER_TYPE = 15; //书籍市场
export const FILE_OWNER_TYPE_BULLETIN: FILE_OWNER_TYPE = 16; //公告
export const FILE_OWNER_TYPE_DATA_ANNO: FILE_OWNER_TYPE = 17; //数据标注
export const FILE_OWNER_TYPE_DOCKER_TEMPLATE: FILE_OWNER_TYPE = 18;
export const FILE_OWNER_TYPE_API_COLLECTION: FILE_OWNER_TYPE = 19;
// export const FILE_OWNER_TYPE_RSS_ENTRY: FILE_OWNER_TYPE = 20;
// export const FILE_OWNER_TYPE_SEARCH_SITE: FILE_OWNER_TYPE = 21;
// export const FILE_OWNER_TYPE_PIPE_LINE: FILE_OWNER_TYPE = 22;
export const FILE_OWNER_TYPE_PAGES: FILE_OWNER_TYPE = 23;
export const FILE_OWNER_TYPE_BOARD: FILE_OWNER_TYPE = 24;
export const FILE_OWNER_TYPE_FILE: FILE_OWNER_TYPE = 25;
export const FILE_OWNER_TYPE_CHAT_GROUP: FILE_OWNER_TYPE = 26;

export const FILE_OWNER_TYPE_PROJECT: FILE_OWNER_TYPE = 99; //项目范围 

export const FILE_OWNER_TYPE_GROUP: FILE_OWNER_TYPE = 200; //兴趣组
export const FILE_OWNER_TYPE_GROUP_POST: FILE_OWNER_TYPE = 201; //兴趣组帖子 

export type DownloadResult = {
    exist_in_local: boolean;
    local_path: string;
    local_dir: string;
};

//下载文件时会产生fsProgress事件，可以通过tauri event api listen
export type FsProgressEvent = {
    total_step: number;
    cur_step: number;
    file_id: string;
    file_size: number;
};

export type WriteFileResponse = {
    code: number;
    err_msg: string;
    file_id: string;
};

export type SetFileOwnerRequest = {
    session_id: string;
    fs_id: string;
    file_id: string;
    owner_type: FILE_OWNER_TYPE;
    owner_id: string;
};

export type SetFileOwnerResponse = {
    code: number;
    err_msg: string;
};

export type CopyFileRequest = {
    session_id: string;
    from_fs_id: string;
    from_file_id: string;
    to_fs_id: string;
};

export type CopyFileResponse = {
    code: number;
    err_msg: string;
    to_file_id: string;
};

export type GetFsStatusRequest = {
    session_id: string;
    fs_id: string;
};

export type FsStatus = {
    fs_id: string;
    owner_type: FS_OWNER_TYPE;
    owner_id: string;
    file_count: number;
    total_file_size: number;
    max_filecount: number;
    max_total_size: number;
    last_gc_time: number;
};

export type GetFsStatusResponse = {
    code: number;
    err_msg: string;
    fs_status: FsStatus;
};

export type ListProjectFsStatusRequest = {
    session_id: string;
    project_id: string;
};

export type ListProjectFsStatusResponse = {
    code: number;
    err_msg: string;
    fs_status_list: FsStatus[];
};

export type GcProjectFsRequest = {
    session_id: string;
    project_id: string;
    fs_id: string;
};

export type GcProjectFsResponse = {
    code: number;
    err_msg: string;
    gc_file_count: number;
    gc_total_size: number;
};


export async function stat_local_file(file_path: string): Promise<number> {
    return invoke<number>('plugin:fs_api|stat_local_file', { filePath: file_path });
}

export async function get_cache_file(fs_id: string, file_id: string, file_name: string): Promise<DownloadResult> {
    return invoke<DownloadResult>('plugin:fs_api|get_cache_file', {
        fsId: fs_id,
        fileId: file_id,
        fileName: file_name,
    });
}

export async function download_file(
    session_id: string,
    fs_id: string,
    file_id: string,
    track_id: string,
    as_name: string = ""): Promise<DownloadResult> {
    return invoke<DownloadResult>('plugin:fs_api|download_file', {
        sessionId: session_id,
        fsId: fs_id,
        fileId: file_id,
        trackId: track_id,
        asName: as_name,
    });
}

export async function get_file_name(file_path: string): Promise<string> {
    return invoke<string>('plugin:fs_api|get_file_name', { filePath: file_path });
}

export async function write_file_base64(
    session_id: string,
    fs_id: string,
    file_name: string,
    data: string,
    track_id: string): Promise<WriteFileResponse> {
    return invoke<WriteFileResponse>('plugin:fs_api|write_file_base64', {
        sessionId: session_id,
        fsId: fs_id,
        fileName: file_name,
        data: data,
        trackId: track_id,
    });
}

export async function write_file(
    session_id: string,
    fs_id: string,
    file_name: string,
    track_id: string): Promise<WriteFileResponse> {
    return invoke<WriteFileResponse>('plugin:fs_api|write_file', {
        sessionId: session_id,
        fsId: fs_id,
        fileName: file_name,
        trackId: track_id,
    })
}

export async function set_file_owner(request: SetFileOwnerRequest): Promise<SetFileOwnerResponse> {
    const cmd = "plugin:fs_api|set_file_owner";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetFileOwnerResponse>(cmd, {
        request: request,
    })
}
export async function copy_file(request: CopyFileRequest): Promise<CopyFileResponse> {
    const cmd = "plugin:fs_api|copy_file";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CopyFileResponse>(cmd, {
        request: request,
    })
}

//获取单个文件系统信息
export async function get_fs_status(request: GetFsStatusRequest): Promise<GetFsStatusResponse> {
    const cmd = "plugin:fs_api|get_fs_status";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetFsStatusResponse>(cmd, {
        request: request,
    })
}

//列出项目中所有文件系统信息
export async function list_project_fs_status(request: ListProjectFsStatusRequest): Promise<ListProjectFsStatusResponse> {
    const cmd = "plugin:fs_api|list_project_fs_status";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListProjectFsStatusResponse>(cmd, {
        request: request,
    })
}

//清理项目文件系统
export async function gc_project_fs(request: GcProjectFsRequest): Promise<GcProjectFsResponse> {
    const cmd = "plugin:fs_api|gc_project_fs";
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GcProjectFsResponse>(cmd, {
        request: request,
    })
}

export async function write_thumb_image_file(
    session_id: string,
    fs_id: string,
    file_path: string,
    track_id: string,
    width: number,
    height: number): Promise<WriteFileResponse> {
    return invoke<WriteFileResponse>('plugin:fs_api|write_thumb_image_file', {
        sessionId: session_id,
        fsId: fs_id,
        filePath: file_path,
        trackId: track_id,
        width: width,
        height: height,
    })
}

export async function save_tmp_file_base64(file_name: string, data: string): Promise<string> {
    return invoke<string>('plugin:fs_api|save_tmp_file_base64', {
        fileName: file_name,
        data: data,
    });
}

export async function make_tmp_dir(): Promise<string> {
    return invoke<string>("plugin:fs_api|make_tmp_dir", {});
}