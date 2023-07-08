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
    create_channel: boolean;
    update_channel: boolean;
    open_channel: boolean;
    close_channel: boolean;
    remove_channel: boolean;
    add_channel_member: boolean;
    remove_channel_member: boolean;
    create_appraise: boolean;
    update_appraise: boolean;
    remove_appraise: boolean;
    add_project_app: boolean;
    remove_project_app: boolean;
    create_goal: boolean;
    update_goal: boolean;
    remove_goal: boolean;
    lock_goal: boolean;
    unlock_goal: boolean;
    change_owner: boolean;
    create_subscribe: boolean;
    update_subscribe: boolean;
    remove_subscribe: boolean;
    watch_channel: boolean;
    un_watch_channel: boolean;
    set_alarm_config: boolean;
};

export type BookShelfEvCfg = {
    add_book: boolean;
    remove_book: boolean;
};

export type DocEvCfg = {
    create_space: boolean;
    update_space: boolean;
    remove_space: boolean;
    create_doc: boolean;
    update_doc: boolean;
    move_doc_to_recycle: boolean;
    remove_doc: boolean;
    recover_doc: boolean;
    watch_doc: boolean;
    un_watch_doc: boolean;
    move_doc: boolean;
    update_tag: boolean;
};

export type EarthlyEvCfg = {
    add_repo: boolean;
    remove_repo: boolean;
    create_action: boolean;
    update_action: boolean;
    remove_action: boolean;
    exec: boolean;
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

export type RobotEvCfg = {
    create: boolean;
    update: boolean;
    remove: boolean;
    add_access_user: boolean;
    remove_access_user: boolean;
    renew_token: boolean;
};

export type SpritEvCfg = {
    create: boolean;
    update: boolean;
    remove: boolean;
    link_doc: boolean;
    cancel_link_doc: boolean;
    link_channel: boolean;
    cancel_link_channel: boolean;
    watch: boolean;
    un_watch: boolean;
}

export type TestCaseEvCfg = {
    create_entry: boolean;
    move_entry: boolean;
    update_entry_title: boolean;
    remove_entry: boolean;
    add_rule: boolean;
    update_rule: boolean;
    remove_rule: boolean;
    add_metric: boolean;
    update_metric: boolean;
    remove_metric: boolean;
    update_content: boolean;
}

export type ScriptEvCfg = {
    create_script_suite: boolean;
    remove_script_suite: boolean;
    update_script_suite_name: boolean;
    update_env_perm: boolean;
    update_sys_perm: boolean;
    update_net_perm: boolean;
    update_read_perm: boolean;
    update_write_perm: boolean;
    update_run_perm: boolean;
    update_script: boolean;
    update_exec_user: boolean;
    update_env_param_def: boolean;
    update_arg_param_def: boolean;
    recover_script: boolean;
    exec: boolean;
};

export type RequirementEvCfg = {
    create_cate: boolean;
    update_cate: boolean;
    remove_cate: boolean;
    create_requirement: boolean;
    update_requirement: boolean;
    set_requirement_cate: boolean;
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



export type EventCfg = {
    project_ev_cfg: ProjectEvCfg;
    book_shelf_ev_cfg: BookShelfEvCfg;
    doc_ev_cfg: DocEvCfg;
    earthly_ev_cfg: EarthlyEvCfg;
    ext_ev_cfg: ExtEvCfg;
    gitee_ev_cfg: GiteeEvCfg;
    gitlab_ev_cfg: GitlabEvCfg;
    issue_ev_cfg: IssueEvCfg;
    robot_ev_cfg: RobotEvCfg;
    sprit_ev_cfg: SpritEvCfg;
    test_case_ev_cfg: TestCaseEvCfg;
    script_ev_cfg: ScriptEvCfg;
    requirement_ev_cfg: RequirementEvCfg;
    code_ev_cfg: CodeEvCfg;
    idea_ev_cfg: IdeaEvCfg;
    data_anno_ev_cfg: DataAnnoEvCfg;
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
    if (cfg.script_ev_cfg == undefined) {
        cfg.script_ev_cfg = {
            create_script_suite: false,
            remove_script_suite: false,
            update_script_suite_name: false,
            update_env_perm: false,
            update_sys_perm: false,
            update_net_perm: false,
            update_read_perm: false,
            update_write_perm: false,
            update_run_perm: false,
            update_script: false,
            update_exec_user: false,
            update_env_param_def: false,
            update_arg_param_def: false,
            recover_script: false,
            exec: false,
        };
    }
    if (cfg.code_ev_cfg == undefined) {
        cfg.code_ev_cfg = {
            add_comment: false,
            update_comment: false,
            remove_comment: false,
        };
    }
    if (cfg.idea_ev_cfg == undefined) {
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
                create_cate: false,
                update_cate: false,
                remove_cate: false,
                create_requirement: false,
                update_requirement: false,
                set_requirement_cate: false,
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