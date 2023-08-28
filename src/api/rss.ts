import { invoke } from '@tauri-apps/api/tauri';

export type FeedCate = {
    cate_id: string;
    cate_name: string;
    feed_count: number;
    order_index: number;
};

export type Feed = {
    feed_id: string;
    feed_name: string;
    cate_id: string;
    root_url: string;
    entry_count: number;
    last_time_stamp: number;
    tag_list: string[];
    my_watch: boolean;
};

export type FeedEntry = {
    entry_url: string;
    feed_id: string;
    feed_name: string;
    title: string;
    img_file_id: string;
    summary: string;
    time_stamp: number;
};

export type ListCateRequest = {
    session_id: string;
};

export type ListCateResponse = {
    code: number;
    err_msg: string;
    cate_list: FeedCate[];
};

export type ListFeedRequest = {
    session_id: string;
    cate_id: string;
    offset: number;
    limit: number;
};

export type ListFeedResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    feed_list: Feed[];
};

export type ListEntryRequest = {
    session_id: string;
    feed_id_list: string[];
    offset: number;
    limit: number;
};

export type ListEntryResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    entry_list: FeedEntry[];
};

//用户列出分类
export async function list_cate(request: ListCateRequest): Promise<ListCateResponse> {
    const cmd = 'plugin:rss_api|list_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCateResponse>(cmd, {
        request,
    });
}

//用户列出Feed
export async function list_feed(request: ListFeedRequest): Promise<ListFeedResponse> {
    const cmd = 'plugin:rss_api|list_feed';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListFeedResponse>(cmd, {
        request,
    });
}

//用户列出入口
export async function list_entry(request: ListEntryRequest): Promise<ListEntryResponse> {
    const cmd = 'plugin:rss_api|list_entry';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListEntryResponse>(cmd, {
        request,
    });
}