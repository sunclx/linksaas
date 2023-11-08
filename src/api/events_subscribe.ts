import { invoke } from '@tauri-apps/api/tauri';

export type CHAT_BOT_TYPE = number;

export const CHAT_BOT_QYWX: CHAT_BOT_TYPE = 0;  //企业微信
export const CHAT_BOT_DING: CHAT_BOT_TYPE = 1;  //钉钉
export const CHAT_BOT_FS: CHAT_BOT_TYPE = 2;    //飞书

export type ProjectEvCfg = {
    create_project: boolean;
    update_project: boolean;
    open_project: boolean;
    close_project: boolean;
    remove_project: boolean;
    gen_invite: boolean;
    join_project: boolean;
    leave_project: boolean;
    create_role: boolean;
    update_role: boolean;
    remove_role: boolean;
    update_project_member: boolean;
    remove_project_member: boolean;
    set_project_member_role: boolean;
    change_owner: boolean;
    create_subscribe: boolean;
    update_subscribe: boolean;
    remove_subscribe: boolean;
    set_alarm_config: boolean;
    custom_event: boolean;
    watch: boolean;
    unwatch: boolean;
};

export type ExtEvCfg = {
    create: boolean;
    update: boolean;
    get_secret: boolean;
    remove: boolean;
    set_source_user_policy: boolean;
};

export type GiteeEvCfg = {
    push: boolean;
    issue: boolean;
    pull_request: boolean;
    note: boolean;
};

export type GitlabEvCfg = {
    build: boolean;
    comment: boolean;
    issue: boolean;
    job: boolean;
    merge_request: boolean;
    pipeline: boolean;
    push: boolean;
    tag: boolean;
    wiki: boolean;
}

export type IssueEvCfg = {
    create: boolean;
    update: boolean;
    remove: boolean;
    assign_exec_user: boolean;
    assign_check_user: boolean;
    change_state: boolean;
    update_process_stage: boolean;
    link_sprit: boolean;
    cancel_link_sprit: boolean;
    set_start_time: boolean;
    cancel_start_time: boolean;
    set_end_time: boolean;
    cancel_end_time: boolean;
    set_estimate_minutes: boolean;
    cancel_estimate_minutes: boolean;
    set_remain_minutes: boolean;
    cancel_remain_minutes: boolean;
    create_sub_issue: boolean;
    update_sub_issue: boolean;
    update_sub_issue_state: boolean;
    remove_sub_issue: boolean;
    add_dependence: boolean;
    remove_dependence: boolean;
    set_dead_line_time: boolean;
    cancel_dead_line_time: boolean;
    update_tag: boolean;
};

export type RequirementEvCfg = {
    create_requirement: boolean;
    update_requirement: boolean;
    remove_requirement: boolean;
    link_issue: boolean;
    unlink_issue: boolean;
    close_requirement: boolean;
    open_requirement: boolean;
    set_kano_info: boolean;
    set_four_q_info: boolean;
    update_tag: boolean;
};

export type CodeEvCfg = {
    add_comment: boolean;
    update_comment: boolean;
    remove_comment: boolean;
};

export type IdeaEvCfg = {
    create_idea: boolean;
    update_idea_content: boolean;
    update_idea_tag: boolean;
    update_idea_keyword: boolean;
    lock_idea: boolean;
    unlock_idea: boolean;
    remove_idea: boolean;
    set_appraise: boolean;
    cancel_appraise: boolean;
};

export type DataAnnoEvCfg = {
    create_anno_project: boolean;
    remove_anno_project: boolean;
    add_anno_member: boolean;
    remove_anno_member: boolean;
};

export type ApiCollectionEvCfg = {
    create: boolean;
    remove: boolean;
}

export type CiCdEvCfg = {
    create_pipe_line: boolean;
    remove_pipe_line: boolean;
};

export type AtomgitEvCfg = {
    push: boolean;
    issue: boolean;
}

export type EntryEvCfg = {
    create: boolean;
    open: boolean;
    close: boolean;
    remove: boolean;
};

export type EventCfg = {
    project_ev_cfg: ProjectEvCfg;
    ext_ev_cfg: ExtEvCfg;
    gitee_ev_cfg: GiteeEvCfg;
    gitlab_ev_cfg: GitlabEvCfg;
    issue_ev_cfg: IssueEvCfg;
    requirement_ev_cfg: RequirementEvCfg;
    code_ev_cfg: CodeEvCfg;
    idea_ev_cfg: IdeaEvCfg;
    data_anno_ev_cfg: DataAnnoEvCfg;
    api_collection_ev_cfg: ApiCollectionEvCfg;
    atomgit_ev_cfg: AtomgitEvCfg;
    ci_cd_ev_cfg: CiCdEvCfg;
    entry_ev_cfg: EntryEvCfg;
};

export type SubscribeInfo = {
    subscribe_id: string;
    project_id: string;
    chat_bot_name: string;
    event_cfg: EventCfg;
    create_time: number;
    create_user_id: string;
    create_display_name: string;
    create_logo_uri: string;
    update_time: number;
    update_user_id: string;
    update_display_name: string;
    update_logo_uri: string;
}

export type CreateRequest = {
    session_id: string;
    project_id: string;
    chat_bot_name: string;
    chat_bot_type: CHAT_BOT_TYPE,
    chat_bot_addr: string;
    chat_bot_sign_code: string;
    event_cfg: EventCfg;
};

export type CreateResponse = {
    code: number;
    err_msg: string;
    subscribe_id: string;
};


export type UpdateRequest = {
    session_id: string;
    project_id: string;
    subscribe_id: string;
    chat_bot_name: string;
    event_cfg: EventCfg;
};

export type UpdateResponse = {
    code: number;
    err_msg: string;
};

export type ListRequest = {
    session_id: string;
    project_id: string;
};

export type ListResponse = {
    code: number;
    err_msg: string;
    info_list: SubscribeInfo[];
};

export type RemoveRequest = {
    session_id: string;
    project_id: string;
    subscribe_id: string;
};

export type RemoveResponse = {
    code: number;
    err_msg: string;
};

export function adjust_event_cfg(cfg: EventCfg): EventCfg {
    if (cfg.code_ev_cfg == undefined || cfg.code_ev_cfg == null) {
        cfg.code_ev_cfg = {
            add_comment: false,
            update_comment: false,
            remove_comment: false,
        };
    }
    if (cfg.idea_ev_cfg == undefined || cfg.idea_ev_cfg == null) {
        cfg.idea_ev_cfg = {
            create_idea: false,
            update_idea_content: false,
            update_idea_tag: false,
            update_idea_keyword: false,
            lock_idea: false,
            unlock_idea: false,
            remove_idea: false,
            set_appraise: false,
            cancel_appraise: false,
        };
    }
    if (cfg.data_anno_ev_cfg == undefined || cfg.data_anno_ev_cfg == null) {
        cfg.data_anno_ev_cfg = {
            create_anno_project: false,
            remove_anno_project: false,
            add_anno_member: false,
            remove_anno_member: false,
        };
    }
    if (cfg.api_collection_ev_cfg == undefined || cfg.api_collection_ev_cfg == null) {
        cfg.api_collection_ev_cfg = {
            create: false,
            remove: false,
        };
    }
    if (cfg.atomgit_ev_cfg == undefined || cfg.atomgit_ev_cfg == null) {
        cfg.atomgit_ev_cfg = {
            push: false,
            issue: false,
        };
    }
    if (cfg.ci_cd_ev_cfg == undefined || cfg.ci_cd_ev_cfg == null) {
        cfg.ci_cd_ev_cfg = {
            create_pipe_line: false,
            remove_pipe_line: false,
        }
    }
    if (cfg.entry_ev_cfg == undefined || cfg.entry_ev_cfg == null) {
        cfg.entry_ev_cfg = {
            create: false,
            open: false,
            close: false,
            remove: false,
        }
    }
    return cfg;
}

//增加订阅
export async function create(request: CreateRequest): Promise<CreateResponse> {
    const cmd = 'plugin:events_subscribe_api|create';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<CreateResponse>(cmd, {
        request,
    });
}

//更新订阅
export async function update(request: UpdateRequest): Promise<UpdateResponse> {
    const cmd = 'plugin:events_subscribe_api|update';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<UpdateResponse>(cmd, {
        request,
    });
}

//列出订阅
export async function list(request: ListRequest): Promise<ListResponse> {
    const cmd = 'plugin:events_subscribe_api|list';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    const ret = await invoke<ListResponse>(cmd, {
        request,
    });
    for (const info of ret.info_list) {
        if (info.event_cfg.requirement_ev_cfg == undefined || info.event_cfg.requirement_ev_cfg == null) {
            info.event_cfg.requirement_ev_cfg = {
                create_requirement: false,
                update_requirement: false,
                remove_requirement: false,
                link_issue: false,
                unlink_issue: false,
                close_requirement: false,
                open_requirement: false,
                set_kano_info: false,
                set_four_q_info: false,
                update_tag: false,
            };
        }
        if (info.event_cfg.code_ev_cfg == undefined || info.event_cfg.code_ev_cfg == null) {
            info.event_cfg.code_ev_cfg = {
                add_comment: false,
                update_comment: false,
                remove_comment: false,
            };
        }
        if (info.event_cfg.idea_ev_cfg == undefined || info.event_cfg.idea_ev_cfg == null) {
            info.event_cfg.idea_ev_cfg = {
                create_idea: false,
                update_idea_content: false,
                update_idea_tag: false,
                update_idea_keyword: false,
                lock_idea: false,
                unlock_idea: false,
                remove_idea: false,
                set_appraise: false,
                cancel_appraise: false,
            };
        }
        if (info.event_cfg.data_anno_ev_cfg == undefined || info.event_cfg.data_anno_ev_cfg == null) {
            info.event_cfg.data_anno_ev_cfg = {
                create_anno_project: false,
                remove_anno_project: false,
                add_anno_member: false,
                remove_anno_member: false,
            };
        }
        if (info.event_cfg.api_collection_ev_cfg == undefined || info.event_cfg.api_collection_ev_cfg == null) {
            info.event_cfg.api_collection_ev_cfg = {
                create: false,
                remove: false,
            };
        }
    }
    return ret;
}

//删除订阅
export async function remove(request: RemoveRequest): Promise<RemoveResponse> {
    const cmd = 'plugin:events_subscribe_api|remove';
    console.log(`%c${cmd}`, 'color:#0f0;', request);
    return invoke<RemoveResponse>(cmd, {
        request,
    });
}