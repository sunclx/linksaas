import { invoke } from '@tauri-apps/api/tauri';


export type BookTag ={
    tag_id: string;
    tag_name: string;
    book_count: number;
};

export type BookInfo ={
    book_id: string;
    book_title: string;
    book_desc: string;
};

export type ListTagRequest ={
    filter_by_keyword: boolean;
    keyword: string;
    offset: number;
    limit: number;
};

export type ListTagResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    tag_list: BookTag[];
};


export type ListBookRequest = {
    filter_by_tag: boolean;
    tag_id_list: string[];
    filter_by_keyword: boolean;
    keyword: string;
    offset: number;
    limit: number;
};

export type ListBookResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: BookInfo[],
};


export type GetBookRequest = { 
    book_id: string;
};

export type GetBookResponse = {
    code: number;
    err_msg: string;
    info: BookInfo;
};


export type GetBookFileRequest = {
    book_id: string;
};

export type GetBookFileResponse = {
    code: number;
    err_msg: string;
    book_data: Uint8Array,
};

//列出书的标签
export async function list_tag(request: ListTagRequest): Promise<ListTagResponse> {
    const cmd = 'plugin:project_book_store_api|list_tag';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListTagResponse>(cmd, {
        request,
    });
}

//列出书
export async function list_book(request: ListBookRequest): Promise<ListBookResponse> {
    const cmd = 'plugin:project_book_store_api|list_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListBookResponse>(cmd, {
        request,
    });
}

//获取指定书本信息
export async function get_book(request: GetBookRequest): Promise<GetBookResponse> {
    const cmd = 'plugin:project_book_store_api|get_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetBookResponse>(cmd, {
        request,
    });
}

//获取书本文件
export async function get_book_file(request: GetBookFileRequest): Promise<GetBookFileResponse> {
    const cmd = 'plugin:project_book_store_api|get_book_file';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetBookFileResponse>(cmd, {
        request,
    });
}