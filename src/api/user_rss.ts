import { invoke } from '@tauri-apps/api/tauri';

export type Feed = {
    feed_id: string;
    feed_name: string;
    cate_id: string;
    cate_name: string;
    root_url: string;
    entry_count: number;
    last_time_stamp: number;
};

export type WatchRequest = {
    session_id: string;
    feed_id: string;
};

export type WatchResponse = {
    code: number;
    err_msg: string;
};

export type UnwatchRequest = {
    session_id: string;
    feed_id: string;
};

export type UnwatchResponse = {
    code: number;
    err_msg: string;
};

export type ListFeedRequest = {
    session_id: string;
};

export type ListFeedResponse = {
    code: number;
    err_msg: string;
    feed_list: Feed[];
};

//关注
export async function watch(request: WatchRequest): Promise<WatchResponse> {
    const cmd = 'plugin:user_rss_api|watch';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<WatchResponse>(cmd, {
        request: request,
    });
}

//取消关注
export async function unwatch(request: UnwatchRequest): Promise<UnwatchResponse> {
    const cmd = 'plugin:user_rss_api|unwatch';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UnwatchResponse>(cmd, {
        request: request,
    });
}

//列出关注Feed
export async function list_feed(request: ListFeedRequest): Promise<ListFeedResponse> {
    const cmd = 'plugin:user_rss_api|list_feed';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListFeedResponse>(cmd, {
        request: request,
    });
}