import { invoke } from '@tauri-apps/api/tauri';
import { TocValue } from './bookstore';

export type AdminAddCateRequest = {
    admin_session_id: string;
    cate_name: string;
};

export type AdminAddCateResponse = {
    code: number;
    err_msg: string;
    cate_id: string;
};


export type AdminUpdateCateRequest = {
    admin_session_id: string;
    cate_id: string;
    cate_name: string;
};

export type AdminUpdateCateResponse = {
    code: number;
    err_msg: string;
};


export type AdminRemoveCateRequest = {
    admin_session_id: string;
    cate_id: string;
};

export type AdminRemoveCateResponse = {
    code: number;
    err_msg: string;
};


export type AdminAddBookRequest = {
    admin_session_id: string;
    book_title: string;
    cate_id: string;
    file_id: string;
    cover_file_id: string;
};

export type AdminAddBookResponse = {
    code: number;
    err_msg: string;
    book_id: string;
};


export type AdminUpdateBookRequest = {
    admin_session_id: string;
    book_id: string;
    book_title: string;
    cate_id: string;
};

export type AdminUpdateBookResponse = {
    code: number;
    err_msg: string;
};

export type AdminSetBookExtraRequest = {
    admin_session_id: string;
    book_id: string;
    desc: string;
    toc_list: TocValue[];
};

export type AdminSetBookExtraResponse = {
    code: number;
    err_msg: string;
}

export type AdminRemoveBookRequest = {
    admin_session_id: string;
    book_id: string;
}

export type AdminRemoveBookResponse = {
    code: number;
    err_msg: string;
}

//创建分类
export async function add_cate(request: AdminAddCateRequest): Promise<AdminAddCateResponse> {
    const cmd = 'plugin:bookstore_admin_api|add_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddCateResponse>(cmd, {
        request,
    });
}

//更新分类
export async function update_cate(request: AdminUpdateCateRequest): Promise<AdminUpdateCateResponse> {
    const cmd = 'plugin:bookstore_admin_api|update_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateCateResponse>(cmd, {
        request,
    });
}

//删除分类
export async function remove_cate(request: AdminRemoveCateRequest): Promise<AdminRemoveCateResponse> {
    const cmd = 'plugin:bookstore_admin_api|remove_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveCateResponse>(cmd, {
        request,
    });
}

//上传书本
export async function add_book(request: AdminAddBookRequest): Promise<AdminAddBookResponse> {
    const cmd = 'plugin:bookstore_admin_api|add_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminAddBookResponse>(cmd, {
        request,
    });
}

//更新书本
export async function update_book(request: AdminUpdateBookRequest): Promise<AdminUpdateBookResponse> {
    const cmd = 'plugin:bookstore_admin_api|update_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminUpdateBookResponse>(cmd, {
        request,
    });
}

//设置额外信息
export async function set_book_extra(request: AdminSetBookExtraRequest): Promise<AdminSetBookExtraResponse> {
    const cmd = 'plugin:bookstore_admin_api|set_book_extra';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminSetBookExtraResponse>(cmd, {
        request,
    });
}

//删除书本
export async function remove_book(request: AdminRemoveBookRequest): Promise<AdminRemoveBookResponse> {
    const cmd = 'plugin:bookstore_admin_api|remove_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AdminRemoveBookResponse>(cmd, {
        request,
    });
}