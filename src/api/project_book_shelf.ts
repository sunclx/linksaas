import { invoke } from '@tauri-apps/api/tauri';

export type BookInfo = {
    book_id: string;
    book_title: string;
    file_loc_id: string;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    create_time: number;
};

export type AddBookRequest = {
    session_id: string;
    project_id: string;
    book_title: string;
    book_desc: string;
    file_id: string;
};

export type AddBookResponse = {
    code: number;
    err_msg: string;
    book_id: string;
};

export type UpdateBookRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    book_title: string;
};

export type UpdateBookResponse = {
    code: number;
    err_msg: string;
};

export type ListBookRequest = {
    session_id: string;
    project_id: string;
    offset: number;
    limit: number;
};

export type ListBookResponse = {
    code: number;
    err_msg: string;
    total_count: number;
    info_list: BookInfo[];
};

export type GetBookRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
};

export type GetBookResponse = {
    code: number,
    err_msg: string;
    info: BookInfo;
};

export type RemoveBookRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
};

export type RemoveBookResponse = {
    code: number;
    err_msg: string;
};

export type MarkInfo = {
    mark_id: string;
    book_id: string;
    project_id: string;
    mark_user_id: string;
    mark_display_name: string;
    mark_logo_uri: string;
    mark_content: string;
    cfi_range: string;
    time_stamp: number;
};

export type AddMarkRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    cfi_range: string;
    mark_content: string;
};

export type AddMarkResponse = {
    code: number;
    err_msg: string;
    mark_id: string;
};

export type ListMarkRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
};

export type ListMarkResponse = {
    code: number;
    err_msg: string;
    info_list: MarkInfo[];
}

export type GetMarkRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    mark_id: string;
};

export type GetMarkResponse = {
    code: number;
    err_msg: string;
    info: MarkInfo;
};

export type RemoveMarkRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    mark_id: string;
};

export type RemoveMarkResponse = {
    code: number;
    err_msg: string;
};

export type SetReadLocRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    cfi_loc: string;
};

export type SetReadLocResponse = {
    code: number;
    err_msg: string;
};

export type GetReadLocRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
};

export type GetReadLocResponse = {
    code: number;
    err_msg: string;
    cfi_loc: string;
};

//添加书本
export async function add_book(request: AddBookRequest): Promise<AddBookResponse> {
    const cmd = 'plugin:project_book_shelf_api|add_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddBookResponse>(cmd, {
        request,
    });
}

//更新书本
export async function update_book(request: UpdateBookRequest): Promise<UpdateBookResponse> {
    const cmd = 'plugin:project_book_shelf_api|update_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateBookResponse>(cmd, {
        request,
    });
}

//列出书本
export async function list_book(request: ListBookRequest): Promise<ListBookResponse> {
    const cmd = 'plugin:project_book_shelf_api|list_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListBookResponse>(cmd, {
        request,
    });
}

//获取单个书本
export async function get_book(request: GetBookRequest): Promise<GetBookResponse> {
    const cmd = 'plugin:project_book_shelf_api|get_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetBookResponse>(cmd, {
        request,
    });
}

//删除书本
export async function remove_book(request: RemoveBookRequest): Promise<RemoveBookResponse> {
    const cmd = 'plugin:project_book_shelf_api|remove_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveBookResponse>(cmd, {
        request,
    });
}

//解析epub文件获取标题
export async function parse_book_title(filePath: string): Promise<string> {
    const cmd = 'plugin:project_book_shelf_api|parse_book_title';
    console.log(`%c${cmd}`, 'color:#0f0;', filePath);
    return invoke<string>(cmd, {
        filePath,
    });
}

// 增加标注
export async function add_mark(request: AddMarkRequest): Promise<AddMarkResponse> {
    const cmd = 'plugin:project_book_shelf_api|add_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddMarkResponse>(cmd, {
        request,
    });
}

// 列出标注
export async function list_mark(request: ListMarkRequest): Promise<ListMarkResponse> {
    const cmd = 'plugin:project_book_shelf_api|list_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListMarkResponse>(cmd, {
        request,
    });
}

// 获取单个标注
export async function get_mark(request: GetMarkRequest): Promise<GetMarkResponse> {
    const cmd = 'plugin:project_book_shelf_api|get_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetMarkResponse>(cmd, {
        request,
    });
}

// 删除标注
export async function remove_mark(request: RemoveMarkRequest): Promise<RemoveMarkResponse> {
    const cmd = 'plugin:project_book_shelf_api|remove_mark';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveMarkResponse>(cmd, {
        request,
    });
}

// 设置阅读位置
export async function set_read_loc(request: SetReadLocRequest): Promise<SetReadLocResponse> {
    const cmd = 'plugin:project_book_shelf_api|set_read_loc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<SetReadLocResponse>(cmd, {
        request,
    });
}

// 获取阅读位置
export async function get_read_loc(request: GetReadLocRequest): Promise<GetReadLocResponse> {
    const cmd = 'plugin:project_book_shelf_api|get_read_loc';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetReadLocResponse>(cmd, {
        request,
    });
}