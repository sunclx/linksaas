import { invoke } from '@tauri-apps/api/tauri';

export type CateInfo = {
    cate_id: string;
    cate_name: string;
    book_count: number;
};

export type ListBookParam = {
    filter_by_cate_id: boolean;
    cate_id: string;
};

export type BookInfo = {
    book_id: string;
    book_title: string;
    cate_id: string;
    cate_name: string;
    file_id: string;
    cover_file_id: string;
    create_time: number;
    update_time: number;
};

export type TocValue = {
    level: number;
    value: string;
};

export type BookExtraInfo = {
    book_id: string;
    desc: string;
    toc_list: TocValue[];
};

export type ProjectInstallInfo = {
    project_id: string;
    project_name: string;
    has_install: boolean;
    can_install: boolean;
};

export type InstallInfo = {
    user_install: boolean;
    project_list: ProjectInstallInfo[];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ListCateRequest = {}

export type ListCateResponse = {
    code: number;
    err_msg: string;
    cate_list: CateInfo[];
};


export type ListBookRequest = {
    list_param: ListBookParam;
    offset: number;
    limit: number;
};

export type ListBookResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    book_list: BookInfo[];
};

export type GetBookExtraRequest = {
    book_id: string;
};

export type GetBookExtraResponse = {
    code: number;
    err_msg: string;
    extra_info: BookExtraInfo;
};


export type GetInstallInfoRequest = {
    session_id: string;
    book_id: string;
};

export type GetInstallInfoResponse = {
    code: number;
    err_msg: string;
    install_info: InstallInfo;
};

//列出分类
export async function list_cate(request: ListCateRequest): Promise<ListCateResponse> {
    const cmd = 'plugin:bookstore_api|list_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCateResponse>(cmd, {
        request,
    });
}

//列出书本
export async function list_book(request: ListBookRequest): Promise<ListBookResponse> {
    const cmd = 'plugin:bookstore_api|list_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListBookResponse>(cmd, {
        request,
    });
}

//获取书本详情
export async function get_book_extra(request: GetBookExtraRequest): Promise<GetBookExtraResponse> {
    const cmd = 'plugin:bookstore_api|get_book_extra';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetBookExtraResponse>(cmd, {
        request,
    });
}

//获取安装信息
export async function get_install_info(request: GetInstallInfoRequest): Promise<GetInstallInfoResponse> {
    const cmd = 'plugin:bookstore_api|get_install_info';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetInstallInfoResponse>(cmd, {
        request,
    });
}

