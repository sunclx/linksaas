import { invoke } from '@tauri-apps/api/tauri';

export type CheckAccessProjectResponse = {
    code: number;
    err_msg: string;
    can_access: boolean;
};

export type CheckAccessEventResponse = {
    code: number;
    err_msg: string;
    can_access: boolean;
};

export type CheckAccessDocResponse = {
    code: number;
    err_msg: string;
    can_access: boolean;
};

export type CheckAccessIssueResponse = {
    code: number;
    err_msg: string;
    can_access: boolean;
};

export type CheckAccessAppraiseResponse = {
    code: number;
    err_msg: string;
    can_access: boolean;
};

export type CheckAccessUserKbResponse = {
    code: number;
    err_msg: string;
    can_access: boolean;
};

// 是否可以访问项目
export async function check_access_project(session_id: string, project_id: string): Promise<CheckAccessProjectResponse> {
    const cmd = 'plugin:link_aux_api|check_access_project';
    const request = {
        session_id,
        project_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CheckAccessProjectResponse>(cmd, {
        request,
    });
}

// 是否可以访问工作事件
export async function check_access_event(session_id: string, project_id: string, event_id: string): Promise<CheckAccessEventResponse> {
    const cmd = 'plugin:link_aux_api|check_access_event';
    const request = {
        session_id,
        project_id,
        event_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CheckAccessEventResponse>(cmd, {
        request,
    });
}

// 是否可以访问项目文档
export async function check_access_doc(session_id: string, project_id: string, doc_id: string): Promise<CheckAccessDocResponse> {
    const cmd = 'plugin:link_aux_api|check_access_doc';
    const request = {
        session_id,
        project_id,
        doc_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CheckAccessDocResponse>(cmd, {
        request,
    });
}

// 是否可以访问工单
export async function check_access_issue(session_id: string, project_id: string, issue_id: string): Promise<CheckAccessIssueResponse> {
    const cmd = 'plugin:link_aux_api|check_access_issue';
    const request = {
        session_id,
        project_id,
        issue_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CheckAccessIssueResponse>(cmd, {
        request,
    });
}

// 是否可以访问互评
export async function check_access_appraise(session_id: string, project_id: string, appraise_id: string): Promise<CheckAccessAppraiseResponse> {
    const cmd = 'plugin:link_aux_api|check_access_appraise';
    const request = {
        session_id,
        project_id,
        appraise_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CheckAccessAppraiseResponse>(cmd, {
        request,
    });
}

//是否可以访问用户知识库
export async function check_access_user_kb(session_id: string, user_id: string, space_id: string, doc_id: string): Promise<CheckAccessUserKbResponse> {
    const cmd = 'plugin:link_aux_api|check_access_user_kb';
    const request = {
        session_id,
        user_id,
        space_id,
        doc_id,
    };
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CheckAccessUserKbResponse>(cmd, {
        request,
    });
}