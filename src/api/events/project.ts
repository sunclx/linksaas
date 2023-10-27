import * as es from '../events_subscribe';
import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
    LinkNoneInfo, LinkProjectInfo,
    LinkAppraiseInfo
} from '@/stores/linkAux';
import type { WATCH_TARGET_TYPE } from '../project_watch';

function get_chat_bot_type_str(chat_bot_type: number): string {
    if (chat_bot_type == es.CHAT_BOT_QYWX) {
        return "企业微信";
    } else if (chat_bot_type == es.CHAT_BOT_DING) {
        return "钉钉";
    } else if (chat_bot_type == es.CHAT_BOT_FS) {
        return "飞书";
    }
    return "";
}

/*
 *  项目相关的事件定义
 */
export type CreateProjectEvent = {};
function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: CreateProjectEvent,
): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('创建项目')];
    if (!skip_prj_name) {
        ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
}
export type UpdateProjectEvent = {
    new_project_name: string;
};
function get_update_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateProjectEvent,
): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('修改项目')];
    if (!skip_prj_name) {
        ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    if (inner.new_project_name != ev.project_name) {
        ret_list.push(
            new LinkNoneInfo(`新项目名 ${inner.new_project_name}`)
        );
    }
    return ret_list;
}
export type OpenProjectEvent = {};
function get_open_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: OpenProjectEvent,
): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('激活项目')];
    if (!skip_prj_name) {
        ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
}

export type CloseProjectEvent = {};
function get_close_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: CloseProjectEvent,
): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('关闭项目')];
    if (!skip_prj_name) {
        ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
}

export type RemoveProjectEvent = {};
function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: RemoveProjectEvent,
): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('删除项目')];
    if (!skip_prj_name) {
        ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
}

export type GenInviteEvent = {};
function get_gen_invite_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: GenInviteEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 发送加入项目邀请`),
    ];
    return ret_list;
}
export type JoinProjectEvent = {};
function get_join_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: JoinProjectEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 加入项目`),
    ];
    return ret_list;
}
export type LeaveProjectEvent = {};
function get_leave_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: LeaveProjectEvent,
): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('离开项目')];
    if (!skip_prj_name) {
        ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
}

export type CreateRoleEvent = {
    role_id: string;
    role_name: string;
};

function get_create_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateRoleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建项目角色`),
        new LinkNoneInfo(` ${inner.role_name}`),
    ];
}

export type UpdateRoleEvent = {
    role_id: string;
    old_role_name: string;
    new_role_name: string;
};

function get_update_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateRoleEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目角色`),
        new LinkNoneInfo(` ${inner.old_role_name}`)
    ];
    if (inner.old_role_name != inner.new_role_name) {
        ret_list.push(new LinkNoneInfo(`新角色 ${inner.new_role_name}`));
    }
    return ret_list;
}

export type RemoveRoleEvent = {
    role_id: string;
    role_name: string;
};

function get_remove_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveRoleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除项目角色`),
        new LinkNoneInfo(` ${inner.role_name}`),
    ];
}

export type UpdateProjectMemberEvent = {
    member_user_id: string;
    old_member_display_name: string;
    new_member_display_name: string;
};
function get_update_prj_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateProjectMemberEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目成员`),
        new LinkNoneInfo(`${inner.old_member_display_name}`),
    ];
    if (inner.old_member_display_name != inner.new_member_display_name) {
        ret_list.push(new LinkNoneInfo(`新名称 ${inner.new_member_display_name}`));
    }
    return ret_list;
}
export type RemoveProjectMemberEvent = {
    member_user_id: string;
    member_display_name: string;
};
function get_remove_prj_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveProjectMemberEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除项目成员 ${inner.member_display_name}`)
    ];
}
export type SetProjectMemberRoleEvent = {
    role_id: string;
    role_name: string;
    member_user_id: string;
    member_display_name: string;
};
function get_set_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetProjectMemberRoleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目成员角色`),
        new LinkNoneInfo(` ${inner.member_display_name}`),
        new LinkNoneInfo(` ${inner.role_name}`),
    ];
}

export type CreateAppraiseEvent = {
    appraise_id: string;
    title: string;
};

function get_create_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateAppraiseEvent
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建评估`),
        new LinkAppraiseInfo(inner.title, ev.project_id, inner.appraise_id),
    ];
}

export type UpdateAppraiseEvent = {
    appraise_id: string;
    old_title: string;
    new_title: string;
};

function get_update_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateAppraiseEvent
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新评估`),
        new LinkAppraiseInfo(inner.new_title, ev.project_id, inner.appraise_id),
    ];
    if (inner.old_title != inner.new_title) {
        ret_list.push(new LinkNoneInfo(`旧标题 ${inner.old_title}`));
    }
    return ret_list;
}

export type RemoveAppraiseEvent = {
    appraise_id: string;
    title: string;
};

function get_remove_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveAppraiseEvent
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除评估 ${inner.title}`),
    ];
}

export type ChangeOwnerEvent = {
    member_user_id: string;
    member_display_name: string;
};

function get_change_owner_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ChangeOwnerEvent,
): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 转移超级管理员给 ${inner.member_display_name}`)];
}

export type CreateEventSubscribeEvent = {
    subscribe_id: string;
    chat_bot_type: number;
    chat_bot_name: string;
}

function get_create_subscribe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEventSubscribeEvent,
): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建事件订阅 ${get_chat_bot_type_str(inner.chat_bot_type)} ${inner.chat_bot_name}`)];
}

export type UpdateEventSubscribeEvent = {
    subscribe_id: string;
    chat_bot_type: number;
    old_chat_bot_name: string;
    new_chat_bot_name: string;
};

function get_update_subscribe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEventSubscribeEvent,
): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新事件订阅 ${get_chat_bot_type_str(inner.chat_bot_type)} ${inner.new_chat_bot_name} 原标题 ${inner.old_chat_bot_name}`)];
}

export type RemoveEventSubscribeEvent = {
    subscribe_id: string;
    chat_bot_type: number;
    chat_bot_name: string;
};

function get_remove_subscribe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEventSubscribeEvent,
): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除事件订阅 ${get_chat_bot_type_str(inner.chat_bot_type)} ${inner.chat_bot_name}`)];
}

export type SetAlarmConfigEvent = {};

function get_set_alarm_config_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: UnWatchChannelEvent
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目预警设置`),
    ];
}

export type CustomEvent = {
    event_type: string;
    event_content: string;
};

function get_custom_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CustomEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} ${inner.event_type}:${inner.event_content}`),
    ];
}


export type WatchEvent = {
    target_type: WATCH_TARGET_TYPE;
    target_id: string;
    target_title: string;
};

function get_watch_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: WatchEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} TODO`),
    ];
}

export type UnwatchEvent = {
    target_type: WATCH_TARGET_TYPE;
    target_id: string;
    target_title: string;
};

function get_unwatch_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UnwatchEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} TODO`),
    ];
}


export type AllProjectEvent = {
    CreateProjectEvent?: CreateProjectEvent;
    UpdateProjectEvent?: UpdateProjectEvent;
    OpenProjectEvent?: OpenProjectEvent;
    CloseProjectEvent?: CloseProjectEvent;
    RemoveProjectEvent?: RemoveProjectEvent;
    GenInviteEvent?: GenInviteEvent;
    JoinProjectEvent?: JoinProjectEvent;
    LeaveProjectEvent?: LeaveProjectEvent;
    CreateRoleEvent?: CreateRoleEvent;
    UpdateRoleEvent?: UpdateRoleEvent;
    RemoveRoleEvent?: RemoveRoleEvent;
    UpdateProjectMemberEvent?: UpdateProjectMemberEvent;
    RemoveProjectMemberEvent?: RemoveProjectMemberEvent;
    SetProjectMemberRoleEvent?: SetProjectMemberRoleEvent;

    CreateAppraiseEvent?: CreateAppraiseEvent;
    UpdateAppraiseEvent?: UpdateAppraiseEvent;
    RemoveAppraiseEvent?: RemoveAppraiseEvent;
    ChangeOwnerEvent?: ChangeOwnerEvent;
    CreateEventSubscribeEvent?: CreateEventSubscribeEvent;
    UpdateEventSubscribeEvent?: UpdateEventSubscribeEvent;
    RemoveEventSubscribeEvent?: RemoveEventSubscribeEvent;
    SetAlarmConfigEvent?: SetAlarmConfigEvent;
    CustomEvent?: CustomEvent;

    WatchEvent?: WatchEvent;
    UnwatchEvent?: UnwatchEvent;
};

export function get_project_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllProjectEvent,
): LinkInfo[] {
    if (inner.CreateProjectEvent !== undefined) {
        return get_create_simple_content(ev, skip_prj_name);
    } else if (inner.RemoveProjectEvent !== undefined) {
        return get_remove_simple_content(ev, skip_prj_name);
    } else if (inner.UpdateProjectEvent !== undefined) {
        return get_update_simple_content(ev, skip_prj_name, inner.UpdateProjectEvent);
    } else if (inner.OpenProjectEvent !== undefined) {
        return get_open_simple_content(ev, skip_prj_name);
    } else if (inner.CloseProjectEvent !== undefined) {
        return get_close_simple_content(ev, skip_prj_name);
    } else if (inner.GenInviteEvent !== undefined) {
        return get_gen_invite_simple_content(ev, skip_prj_name);
    } else if (inner.JoinProjectEvent !== undefined) {
        return get_join_simple_content(ev, skip_prj_name);
    } else if (inner.LeaveProjectEvent !== undefined) {
        return get_leave_simple_content(ev, skip_prj_name);
    } else if (inner.CreateRoleEvent !== undefined) {
        return get_create_role_simple_content(ev, skip_prj_name, inner.CreateRoleEvent);
    } else if (inner.UpdateRoleEvent !== undefined) {
        return get_update_role_simple_content(ev, skip_prj_name, inner.UpdateRoleEvent);
    } else if (inner.RemoveRoleEvent !== undefined) {
        return get_remove_role_simple_content(ev, skip_prj_name, inner.RemoveRoleEvent);
    } else if (inner.UpdateProjectMemberEvent !== undefined) {
        return get_update_prj_member_simple_content(
            ev,
            skip_prj_name,
            inner.UpdateProjectMemberEvent,
        );
    } else if (inner.RemoveProjectMemberEvent !== undefined) {
        return get_remove_prj_member_simple_content(
            ev,
            skip_prj_name,
            inner.RemoveProjectMemberEvent,
        );
    } else if (inner.SetProjectMemberRoleEvent !== undefined) {
        return get_set_role_simple_content(ev, skip_prj_name, inner.SetProjectMemberRoleEvent);
    } else if (inner.CreateAppraiseEvent !== undefined) {
        return get_create_appraise_simple_content(ev, skip_prj_name, inner.CreateAppraiseEvent);
    } else if (inner.UpdateAppraiseEvent !== undefined) {
        return get_update_appraise_simple_content(ev, skip_prj_name, inner.UpdateAppraiseEvent);
    } else if (inner.RemoveAppraiseEvent !== undefined) {
        return get_remove_appraise_simple_content(ev, skip_prj_name, inner.RemoveAppraiseEvent);
    } else if (inner.ChangeOwnerEvent !== undefined) {
        return get_change_owner_simple_content(ev, skip_prj_name, inner.ChangeOwnerEvent);
    } else if (inner.CreateEventSubscribeEvent !== undefined) {
        return get_create_subscribe_simple_content(ev, skip_prj_name, inner.CreateEventSubscribeEvent);
    } else if (inner.UpdateEventSubscribeEvent !== undefined) {
        return get_update_subscribe_simple_content(ev, skip_prj_name, inner.UpdateEventSubscribeEvent);
    } else if (inner.RemoveEventSubscribeEvent !== undefined) {
        return get_remove_subscribe_simple_content(ev, skip_prj_name, inner.RemoveEventSubscribeEvent);
    } else if (inner.SetAlarmConfigEvent !== undefined) {
        return get_set_alarm_config_simple_content(ev, skip_prj_name);
    } else if (inner.CustomEvent !== undefined) {
        return get_custom_simple_content(ev, skip_prj_name, inner.CustomEvent);
    }else if(inner.WatchEvent !== undefined){
        return get_watch_simple_content(ev,skip_prj_name,inner.WatchEvent);
    }else if(inner.UnwatchEvent !== undefined){
        return get_unwatch_simple_content(ev,skip_prj_name,inner.UnwatchEvent);
    } else {
        return [new LinkNoneInfo('未知事件')];
    }
}