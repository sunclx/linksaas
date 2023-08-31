import { invoke } from '@tauri-apps/api/tauri';

export type Crawler = {
    crawler_id: string;
    token: string;
    run_time_of_day_list: number[];
}

export type AdminAddCrawlerRequest = {
    admin_session_id: string;
    crawler: Crawler;
}

export type AdminAddCrawlerResponse = {
    code: number;
    err_msg: string;
}


export type AdminRenewCrawlerTokenRequest = {
    admin_session_id: string;
    crawler_id: string;
    token: string;
}

export type AdminRenewCrawlerTokenResponse = {
    code: number;
    err_msg: string;
}

export type AdminSetCrawlerRunTimeRequest = {
    admin_session_id: string;
    crawler_id: string;
    run_time_of_day_list: number[];
}

export type AdminSetCrawlerRunTimeResponse = {
    code: number;
    err_msg: string;
}

export type AdminListCrawlerRequest = {
    admin_session_id: string;
}

export type AdminListCrawlerResponse = {
    code: number;
    err_msg: string;
    crawler_list: Crawler[];
}

export type AdminRemoveCrawlerRequest = {
    admin_session_id: string;
    crawler_id: string;
}


export type AdminRemoveCrawlerResponse = {
    code: number;
    err_msg: string;
}

//创建爬虫
export async function add_crawler(request: AdminAddCrawlerRequest): Promise<AdminAddCrawlerResponse> {
    const cmd = 'plugin:rss_admin_api|add_crawler';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddCrawlerResponse>(cmd, {
        request,
    });
}

//更新爬虫令牌
export async function renew_crawler_token(request: AdminRenewCrawlerTokenRequest): Promise<AdminRenewCrawlerTokenResponse> {
    const cmd = 'plugin:rss_admin_api|renew_crawler_token';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRenewCrawlerTokenResponse>(cmd, {
        request,
    });
}

//设置爬虫运行时间
export async function set_crawler_run_time(request: AdminSetCrawlerRunTimeRequest): Promise<AdminSetCrawlerRunTimeResponse> {
    const cmd = 'plugin:rss_admin_api|set_crawler_run_time';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminSetCrawlerRunTimeResponse>(cmd, {
        request,
    });
}

//列出爬虫
export async function list_crawler(request: AdminListCrawlerRequest): Promise<AdminListCrawlerResponse> {
    const cmd = 'plugin:rss_admin_api|list_crawler';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminListCrawlerResponse>(cmd, {
        request,
    });
}

//删除爬虫
export async function remove_crawler(request: AdminRemoveCrawlerRequest): Promise<AdminRemoveCrawlerResponse> {
    const cmd = 'plugin:rss_admin_api|remove_crawler';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveCrawlerResponse>(cmd, {
        request,
    });
}