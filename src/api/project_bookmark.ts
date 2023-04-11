import { invoke } from '@tauri-apps/api/tauri';

export type CateInfo = {
    cate_id: string;
    cate_name: string;
    book_mark_count: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
    update_time: number;
};

export type BookMarkInfo = {
    book_mark_id: string;
    title: string;
    url: string;
    cate_id: string;
    cate_name: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
};

export type CreateCateRequest = {
    session_id: string;
    project_id: string;
    cate_name: string;
};

export type CreateCateResponse = {
    code: number;
    err_msg: string;
    cate_id: string;
};


export type UpdateCateRequest = {
    session_id: string;
    project_id: string;
    cate_id: string;
    cate_name: string;
};

export type UpdateCateResponse = {
    code: number;
    err_msg: string;
};


export type ListCateRequest = {
    session_id: string;
    project_id: string;
};

export type ListCateResponse = {
    code: number;
    err_msg: string;
    cate_info_list: CateInfo[];
};


export type RemoveCateRequest = {
    session_id: string;
    project_id: string;
    cate_id: string;
};

export type RemoveCateResponse = {
    code: number;
    err_msg: string;
};


export type CreateBookMarkRequest = {
    session_id: string;
    project_id: string;
    title: string;
    url: string;
    content: string;
    cate_id: string;
};

export type CreateBookMarkResponse = {
    code: number;
    err_msg: string;
    book_mark_id: string;
};


export type ListBookMarkRequest = {
    session_id: string;
    project_id: string;
    filter_by_cate_id: boolean;
    cate_id: string;
    offset: number;
    limit: number;
};

export type ListBookMarkResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    book_mark_info_list: BookMarkInfo[];
};


export type GetBookMarkRequest = {
    session_id: string;
    project_id: string;
    book_mark_id: string;
};

export type GetBookMarkResponse = {
    code: number;
    err_msg: string;
    book_mark_info: BookMarkInfo;
    content: string;
};


export type RemoveBookMarkRequest = {
    session_id: string;
    project_id: string;
    book_mark_id: string;
};

export type RemoveBookMarkResponse = {
    code: number;
    err_msg: string;
}

export type SetBookMarkCateRequest = {
    session_id: string;
    project_id: string;
    book_mark_id: string;
    cate_id: string;
};

export type SetBookMarkCateResponse = {
    code: number;
    err_msg: string;
};

//创建分类
export async function create_cate(request: CreateCateRequest): Promise<CreateCateResponse> {
    const cmd = 'plugin:project_bookmark_api|create_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateCateResponse>(cmd, {
        request,
    });
}

//修改分类
export async function update_cate(request: UpdateCateRequest): Promise<UpdateCateResponse> {
    const cmd = 'plugin:project_bookmark_api|update_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateCateResponse>(cmd, {
        request,
    });
}

//列出分类
export async function list_cate(request: ListCateRequest): Promise<ListCateResponse> {
    const cmd = 'plugin:project_bookmark_api|list_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListCateResponse>(cmd, {
        request,
    });
}

//删除分类
export async function remove_cate(request: RemoveCateRequest): Promise<RemoveCateResponse> {
    const cmd = 'plugin:project_bookmark_api|remove_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveCateResponse>(cmd, {
        request,
    });
}

//创建书签
export async function create_book_mark(request: CreateBookMarkRequest): Promise<CreateBookMarkResponse> {
    const cmd = 'plugin:project_bookmark_api|create_book_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateBookMarkResponse>(cmd, {
        request,
    });
}

//列出书签
export async function list_book_mark(request: ListBookMarkRequest): Promise<ListBookMarkResponse> {
    const cmd = 'plugin:project_bookmark_api|list_book_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListBookMarkResponse>(cmd, {
        request,
    });
}

//获取书签
export async function get_book_mark(request: GetBookMarkRequest): Promise<GetBookMarkResponse> {
    const cmd = 'plugin:project_bookmark_api|get_book_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetBookMarkResponse>(cmd, {
        request,
    });
}

//删除书签
export async function remove_book_mark(request: RemoveBookMarkRequest): Promise<RemoveBookMarkResponse> {
    const cmd = 'plugin:project_bookmark_api|remove_book_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveBookMarkResponse>(cmd, {
        request,
    });
}

//修改书签分类
export async function set_book_mark_cate(request: SetBookMarkCateRequest): Promise<SetBookMarkCateResponse> {
    const cmd = 'plugin:project_bookmark_api|set_book_mark_cate';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetBookMarkCateResponse>(cmd, {
        request,
    });
}
