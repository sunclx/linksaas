import { invoke } from '@tauri-apps/api/tauri';

export type WATCH_TARGET_TYPE = number;
export const WATCH_TARGET_ENTRY: WATCH_TARGET_TYPE = 0;         //内容入口
export const WATCH_TARGET_REQUIRE_MENT: WATCH_TARGET_TYPE = 1;  //项目需求
export const WATCH_TARGET_TASK: WATCH_TARGET_TYPE = 2;          //任务
export const WATCH_TARGET_BUG: WATCH_TARGET_TYPE = 3;           //缺陷
// export const WATCH_TARGET_CI_CD: WATCH_TARGET_TYPE = 4;         // CI/CD
export const WATCH_TARGET_API_COLL: WATCH_TARGET_TYPE = 5;      // API集合
export const WATCH_TARGET_DATA_ANNO: WATCH_TARGET_TYPE = 6;     // 数据标注
  

  
export type MyWatchInfo = {
    target_id: string;
    target_type: WATCH_TARGET_TYPE;
    title: string; 
    watch_time: number;
};

export type WatchRequest = {
    session_id: string;
    project_id: string;
    target_type: WATCH_TARGET_TYPE;
    target_id: string;
};

export type WatchResponse = {
    code: number;
    err_msg: string;
};

export type UnwatchRequest = {
    session_id: string;
    project_id: string;
    target_type: WATCH_TARGET_TYPE;
    target_id: string;
};

export type UnwatchResponse = {
    code: number;
    err_msg: string;
};

export type ListMyWatchRequest = {
    session_id: string;
    project_id: string;
    filter_by_target_type: boolean;
    target_type: WATCH_TARGET_TYPE;
    offset: number;
    limit: number;
};

export type ListMyWatchResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: MyWatchInfo[];
};

//关注
export async function watch(request: WatchRequest): Promise<WatchResponse> {
    const cmd = 'plugin:project_watch_api|watch';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<WatchResponse>(cmd, {
        request,
    });
}

//取消关注
export async function unwatch(request: UnwatchRequest): Promise<UnwatchResponse> {
    const cmd = 'plugin:project_watch_api|unwatch';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UnwatchResponse>(cmd, {
        request,
    });
}

//列出我的关注
export async function list_my_watch(request: ListMyWatchRequest): Promise<ListMyWatchResponse> {
    const cmd = 'plugin:project_watch_api|list_my_watch';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMyWatchResponse>(cmd, {
        request,
    });
}