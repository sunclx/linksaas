import { invoke } from '@tauri-apps/api/tauri';

export type ISSUE_TYPE = number;

export const ISSUE_TYPE_TASK: ISSUE_TYPE = 0;
export const ISSUE_TYPE_BUG: ISSUE_TYPE = 1;

export type DocResultItem = {
    project_id: string;
    doc_space_id: string;
    doc_id: string;
    title: string;
    content: string;

};

export type ChannelResultItem = {
    project_id: string;
    channel_id: string;
    msg_id: string;
    content: string;
};

export type IssueResultItem = {
    project_id: string;
    issue_id: string;
    title: string;
    content: string;
};

export type BookMarkResultItem = {
    project_id: string;
    book_mark_id: string;
    cate_id: string;
    title: string;
    content: string;
};

export type SearchProjectChannelRequest = {
    session_id: string;
    filter_by_project_id: boolean;
    project_id: string;
    keyword: string;
    filter_by_channel_id: boolean;
    channel_id: string;
    filter_by_time_range: boolean;
    from_time_stamp: number;
    to_time_stamp: number;
    offset: number;
    limit: number;
};

export type SearchProjectChannelResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    item_list: ChannelResultItem[],
};


export type SearchProjectIssueRequest = {
    session_id: string;
    filter_by_project_id: boolean;
    project_id: string;
    keyword: string;
    issue_type: ISSUE_TYPE;
    filter_by_time_range: boolean;
    from_time_stamp: number;
    to_time_stamp: number;
    offset: number;
    limit: number;
};

export type SearchProjectIssueResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    item_list: IssueResultItem[],
};


export type SearchProjectDocRequest = {
    session_id: string;
    filter_by_project_id: boolean;
    project_id: string;
    keyword: string;
    filter_by_doc_space_id: boolean;
    doc_space_id: string;
    filter_by_time_range: boolean;
    from_time_stamp: number;
    to_time_stamp: number;
    offset: number;
    limit: number;
};

export type SearchProjectDocResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    item_list: DocResultItem[],
};

export type SearchProjectBookMarkRequest = {
    session_id: string;
    filter_by_project_id: boolean;
    project_id: string;
    keyword: string;
    filter_by_cate_id: boolean;
    cate_id: string;
    filter_by_time_range: boolean;
    from_time_stamp: number;
    to_time_stamp: number;
    offset: number;
    limit: number;
};

export type SearchProjectBookMarkResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    item_list: BookMarkResultItem[];
};

//搜素频道
export async function search_project_channel(request: SearchProjectChannelRequest): Promise<SearchProjectChannelResponse> {
    const cmd = 'plugin:search_api|search_project_channel';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SearchProjectChannelResponse>(cmd, {
        request,
    });
}

//搜素工单
export async function search_project_issue(request: SearchProjectIssueRequest): Promise<SearchProjectIssueResponse> {
    const cmd = 'plugin:search_api|search_project_issue';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SearchProjectIssueResponse>(cmd, {
        request,
    });
}

//搜素文档
export async function search_project_doc(request: SearchProjectDocRequest): Promise<SearchProjectDocResponse> {
    const cmd = 'plugin:search_api|search_project_doc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SearchProjectDocResponse>(cmd, {
        request,
    });
}

//搜索项目书签
export async function search_project_book_mark(request: SearchProjectBookMarkRequest): Promise<SearchProjectBookMarkResponse> {
    const cmd = 'plugin:search_api|search_project_book_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SearchProjectBookMarkResponse>(cmd, {
        request,
    });
}