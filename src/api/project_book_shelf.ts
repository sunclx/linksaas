import { invoke } from '@tauri-apps/api/tauri';

export type ANNO_TYPE = number;
export const ANNO_HIGHLIGHT: ANNO_TYPE = 0;
export const ANNO_UNDERLINE: ANNO_TYPE = 1;
export const ANNO_MARK: ANNO_TYPE = 2;


export type BookInfo = {
    book_id: string;
    book_title: string;
    book_desc: string;
    file_loc_id: string;
};

export type AnnoStatusItem = {
    anno_user_id: string;
    anno_display_name: string;
    anno_logo_uri: string;
    anno_count: number;
};

export type AnnoInfo = {
    anno_id: string;
    book_id: string;
    project_id: string;
    anno_user_id: string;
    anno_display_name: string;
    anno_logo_uri: string;
    anno_type: ANNO_TYPE;
    cfi_range: string;
    time_stamp: number;
    content: string;
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
    book_desc: string;
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

export type RemoveBookRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
};

export type RemoveBookResponse = {
    code: number;
    err_msg: string;
};

export type AddAnnoRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    anno_type: ANNO_TYPE;
    cfi_range: string;
    content: string;
};

export type AddAnnoResponse = {
    code: number;
    err_msg: string;
    anno_id: string;
};

export type GetAnnoStatusRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
};

export type GetAnnoStatusResponse = {
    code: number;
    err_msg: string;
    info_list: AnnoStatusItem[],
};


export type ListAnnoRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    anno_user_id: string;
};

export type ListAnnoResponse = {
    code: number;
    err_msg: string;
    info_list: AnnoInfo[],
}


export type RemoveAnnoRequest = {
    session_id: string;
    project_id: string;
    book_id: string;
    anno_id: string;
};

export type RemoveAnnoResponse = {
    code: number;
    err_msg: string;
}


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

//删除书本
export async function remove_book(request: RemoveBookRequest): Promise<RemoveBookResponse> {
    const cmd = 'plugin:project_book_shelf_api|remove_book';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveBookResponse>(cmd, {
        request,
    });
}

// 增加标注
export async function add_anno(request: AddAnnoRequest): Promise<AddAnnoResponse> {
    const cmd = 'plugin:project_book_shelf_api|add_anno';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<AddAnnoResponse>(cmd, {
        request,
    });
}

//获取标注状态
export async function get_anno_status(request: GetAnnoStatusRequest): Promise<GetAnnoStatusResponse> {
    const cmd = 'plugin:project_book_shelf_api|get_anno_status';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<GetAnnoStatusResponse>(cmd, {
        request,
    });
}

//列出标注
export async function list_anno(request: ListAnnoRequest): Promise<ListAnnoResponse> {
    const cmd = 'plugin:project_book_shelf_api|list_anno';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<ListAnnoResponse>(cmd, {
        request,
    });
}

//删除标注
export async function remove_anno(request: RemoveAnnoRequest): Promise<RemoveAnnoResponse> {
    const cmd = 'plugin:project_book_shelf_api|remove_anno';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveAnnoResponse>(cmd, {
        request,
    });
}