import type { PluginEvent } from '../events';
import * as pi from '../project_issue';
import type { LinkInfo } from '@/stores/linkAux';
import {
    LinkNoneInfo,
    LinkSpritInfo, LinkTaskInfo, LinkBugInfo,

} from '@/stores/linkAux';

import moment from 'moment';


export function get_issue_type_str(issue_type: number): string {
    if (issue_type == pi.ISSUE_TYPE_BUG) {
        return '缺陷';
    } else if (issue_type == pi.ISSUE_TYPE_TASK) {
        return '任务';
    } else {
        return '';
    }
}

function get_issue_state_str(issue_state: number): string {
    let state_str = '';
    switch (issue_state) {
        case pi.ISSUE_STATE_PLAN:
            state_str = '规划中';
            break;
        case pi.ISSUE_STATE_PROCESS:
            state_str = '处理中';
            break;
        case pi.ISSUE_STATE_CHECK:
            state_str = '检查中';
            break;
        case pi.ISSUE_STATE_CLOSE:
            state_str = '关闭';
            break;
        default:
            break;
    }
    return state_str;
}

function get_process_stage_str(stage: number): string {
    if (stage == pi.PROCESS_STAGE_TODO) {
        return "未开始";
    } else if (stage == pi.PROCESS_STAGE_DONE) {
        return "执行中";
    } else if (stage == pi.PROCESS_STAGE_DONE) {
        return "已完成";
    }
    return "";
}

export type CreateEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
};
function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    return ret_list;
}

export type UpdateEvent = {
    issue_id: string;
    issue_type: number;
    old_title: string;
    new_title: string;
};
function get_update_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.old_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.old_title, ev.project_id, inner.issue_id));
    }
    if (inner.old_title != inner.new_title) {
        ret_list.push(new LinkNoneInfo(`新标题 ${inner.new_title}`));
    }
    return ret_list;
}

export type TagInfo = {
    tag_id: string;
    tag_name: string;
};

export type UpdateTagEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    old_tag_list: TagInfo[];
    new_tag_list: TagInfo[];
}

function get_update_tag_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateTagEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`新标签 ${inner.new_tag_list.map(tag => tag.tag_name).join(",")} 旧标签 ${inner.old_tag_list.map(tag => tag.tag_name).join(",")}`));
    return ret_list;
}

export type RemoveEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
};
function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEvent,
) {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除${issue_type_str} ${inner.title}`),
    ];
}

export type AssignExecUserEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    exec_user_id: string;
    exec_user_display_name: string;
};
function get_assign_exec_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AssignExecUserEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 指派`),
        new LinkNoneInfo(`${inner.exec_user_display_name}`),
        new LinkNoneInfo(`为${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('执行人'));
    return ret_list;
}
export type AssignCheckUserEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    check_user_id: string;
    check_user_display_name: string;
};
function get_assign_check_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AssignCheckUserEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 指派`),
        new LinkNoneInfo(` ${inner.check_user_display_name}`),
        new LinkNoneInfo(`为${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('检查人'));
    return ret_list;
}

export type ChangeStateEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    old_state: number;
    new_state: number;
};

function get_change_state_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ChangeStateEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const old_state_str = get_issue_state_str(inner.old_state);
    const new_state_str = get_issue_state_str(inner.new_state);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更改${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }

    ret_list.push(new LinkNoneInfo(`老状态 ${old_state_str} 新状态 ${new_state_str}`));
    return ret_list;
}

export type UpdateProcessStageEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    old_stage: number;
    new_stage: number;
};

function get_update_process_stage_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateProcessStageEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const old_stage_str = get_process_stage_str(inner.old_stage);
    const new_stage_str = get_process_stage_str(inner.new_stage);

    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更改${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }

    ret_list.push(new LinkNoneInfo(`老阶段 ${old_stage_str} 新阶段 ${new_stage_str}`));
    return ret_list;
}

export type LinkSpritEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    sprit_id: string;
    sprit_title: string;
};

function get_link_sprit_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: LinkSpritEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('到工作计划'));
    ret_list.push(new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id))
    return ret_list;
}

export type CancelLinkSpritEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    sprit_id: string;
    sprit_title: string;
};

function get_cancel_link_sprit_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelLinkSpritEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消关联${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('到工作计划'));
    ret_list.push(new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id))
    return ret_list;
}


export type SetStartTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    start_time: number;
};
function get_set_start_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetStartTimeEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`开始时间 ${moment(inner.start_time).format("YYYY-MM-DD")}`));
    return ret_list;
}
export type SetEndTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    end_time: number;
};
function get_set_end_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetEndTimeEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`结束时间 ${moment(inner.end_time).format("YYYY-MM-DD")}`));
    return ret_list;
}
export type SetEstimateMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    estimate_minutes: number;
};
function get_set_estimate_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetEstimateMinutesEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`预估时间 ${(inner.estimate_minutes / 60).toFixed(1)}小时`));
    return ret_list;
}

export type SetRemainMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    remain_minutes: number;
    has_spend_minutes: boolean;
    spend_minutes: number;
};
function get_set_remain_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetRemainMinutesEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`剩余时间 ${(inner.remain_minutes / 60).toFixed(1)}小时`));
    if (inner.has_spend_minutes) {
        ret_list.push(new LinkNoneInfo(`新增开销时间 ${(inner.spend_minutes / 60).toFixed(1)}小时`));
    }
    return ret_list;
}

export type CancelStartTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
};
function get_cancel_start_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelStartTimeEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`开始时间`));
    return ret_list;
}
export type CancelEndTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    end_time: number;
};
function get_cancel_end_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelEndTimeEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`结束时间`));
    return ret_list;
}
export type CancelEstimateMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    estimate_minutes: number;
};
function get_cancel_estimate_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelEstimateMinutesEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`预估时间`));
    return ret_list;
}

export type CancelRemainMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
};
function get_cancel_remain_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelRemainMinutesEvent,
): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`剩余时间`));
    return ret_list;
}

export type CreateSubIssueEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    title: string;
};

function get_create_sub_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateSubIssueEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 ${inner.title}`));
    return ret_list;
}

export type UpdateSubIssueEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    old_title: string;
    new_title: string;
};

function get_update_sub_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateSubIssueEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 原标题:${inner.old_title} 现标题:${inner.new_title}`));
    return ret_list;
}

export type UpdateSubIssueStateEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    title: string;
    done: boolean;
};

function get_update_sub_issue_state_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateSubIssueStateEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 标记 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 ${inner.title} 状态 为 ${inner.done ? "完成" : "未完成"}`));
    return ret_list;
}

export type RemoveSubIssueEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    title: string;
};

function get_remove_sub_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveSubIssueEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 ${inner.title}`));
    return ret_list;
}

export type AddDependenceEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    depend_issue_id: string;
    depend_issue_type: number;
    depend_issue_title: string;
};

function get_add_depend_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddDependenceEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`和 ${get_issue_type_str(inner.depend_issue_type)}`));
    if (inner.depend_issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    } else if (inner.depend_issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    }
    return ret_list;
}

export type RemoveDependenceEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    depend_issue_id: string;
    depend_issue_type: number;
    depend_issue_title: string;
};

function get_remove_depend_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveDependenceEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消关联 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`和 ${get_issue_type_str(inner.depend_issue_type)}`));
    if (inner.depend_issue_type == pi.ISSUE_TYPE_TASK) {
        ret_list.push(new LinkTaskInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    } else if (inner.depend_issue_type == pi.ISSUE_TYPE_BUG) {
        ret_list.push(new LinkBugInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    }
    return ret_list;
}

export type SetDeadLineTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    dead_line_time: number;
};

function get_set_deadline_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetDeadLineTimeEvent,
): LinkInfo[] {
    const retList = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        retList.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        retList.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    retList.push(new LinkNoneInfo(`截止时间 ${moment(inner.dead_line_time).format("YYYY-MM-DD")}`));
    return retList;
}

export type CancelDeadLineTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
};

function get_cancel_deadline_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelDeadLineTimeEvent,
): LinkInfo[] {
    const retList = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
        retList.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
        retList.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    retList.push(new LinkNoneInfo("截止时间"));
    return retList;
}

export class AllIssueEvent {
    CreateEvent?: CreateEvent;
    UpdateEvent?: UpdateEvent;
    UpdateTagEvent?: UpdateTagEvent;
    RemoveEvent?: RemoveEvent;
    AssignExecUserEvent?: AssignExecUserEvent;
    AssignCheckUserEvent?: AssignCheckUserEvent;
    ChangeStateEvent?: ChangeStateEvent;
    UpdateProcessStageEvent?: UpdateProcessStageEvent;
    LinkSpritEvent?: LinkSpritEvent;
    CancelLinkSpritEvent?: CancelLinkSpritEvent;
    SetStartTimeEvent?: SetStartTimeEvent;
    SetEndTimeEvent?: SetEndTimeEvent;
    SetEstimateMinutesEvent?: SetEstimateMinutesEvent;
    SetRemainMinutesEvent?: SetRemainMinutesEvent;
    CancelStartTimeEvent?: CancelStartTimeEvent;
    CancelEndTimeEvent?: CancelEndTimeEvent;
    CancelEstimateMinutesEvent?: CancelEstimateMinutesEvent;
    CancelRemainMinutesEvent?: CancelRemainMinutesEvent;
    CreateSubIssueEvent?: CreateSubIssueEvent;
    UpdateSubIssueEvent?: UpdateSubIssueEvent;
    UpdateSubIssueStateEvent?: UpdateSubIssueStateEvent;
    RemoveSubIssueEvent?: RemoveSubIssueEvent;
    AddDependenceEvent?: AddDependenceEvent;
    RemoveDependenceEvent?: RemoveDependenceEvent;
    SetDeadLineTimeEvent?: SetDeadLineTimeEvent;
    CancelDeadLineTimeEvent?: CancelDeadLineTimeEvent;
}

export function get_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllIssueEvent,
): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
        return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.UpdateEvent !== undefined) {
        return get_update_simple_content(ev, skip_prj_name, inner.UpdateEvent);
    } else if (inner.UpdateTagEvent !== undefined) {
        return get_update_tag_simple_content(ev, skip_prj_name, inner.UpdateTagEvent);
    } else if (inner.RemoveEvent !== undefined) {
        return get_remove_simple_content(ev, skip_prj_name, inner.RemoveEvent);
    } else if (inner.AssignExecUserEvent !== undefined) {
        return get_assign_exec_simple_content(ev, skip_prj_name, inner.AssignExecUserEvent);
    } else if (inner.AssignCheckUserEvent !== undefined) {
        return get_assign_check_simple_content(ev, skip_prj_name, inner.AssignCheckUserEvent);
    } else if (inner.ChangeStateEvent !== undefined) {
        return get_change_state_simple_content(ev, skip_prj_name, inner.ChangeStateEvent);
    } else if (inner.UpdateProcessStageEvent !== undefined) {
        return get_update_process_stage_simple_content(ev, skip_prj_name, inner.UpdateProcessStageEvent);
    } else if (inner.LinkSpritEvent !== undefined) {
        return get_link_sprit_simple_content(ev, skip_prj_name, inner.LinkSpritEvent);
    } else if (inner.CancelLinkSpritEvent !== undefined) {
        return get_cancel_link_sprit_simple_content(ev, skip_prj_name, inner.CancelLinkSpritEvent);
    } else if (inner.SetStartTimeEvent !== undefined) {
        return get_set_start_simple_content(ev, skip_prj_name, inner.SetStartTimeEvent);
    } else if (inner.SetEndTimeEvent !== undefined) {
        return get_set_end_simple_content(ev, skip_prj_name, inner.SetEndTimeEvent);
    } else if (inner.SetEstimateMinutesEvent !== undefined) {
        return get_set_estimate_simple_content(ev, skip_prj_name, inner.SetEstimateMinutesEvent);
    } else if (inner.SetRemainMinutesEvent !== undefined) {
        return get_set_remain_simple_content(ev, skip_prj_name, inner.SetRemainMinutesEvent);
    } else if (inner.CancelStartTimeEvent !== undefined) {
        return get_cancel_start_simple_content(ev, skip_prj_name, inner.CancelStartTimeEvent);
    } else if (inner.CancelEndTimeEvent !== undefined) {
        return get_cancel_end_simple_content(ev, skip_prj_name, inner.CancelEndTimeEvent);
    } else if (inner.CancelEstimateMinutesEvent !== undefined) {
        return get_cancel_estimate_simple_content(ev, skip_prj_name, inner.CancelEstimateMinutesEvent);
    } else if (inner.CancelRemainMinutesEvent !== undefined) {
        return get_cancel_remain_simple_content(ev, skip_prj_name, inner.CancelRemainMinutesEvent);
    } else if (inner.CreateSubIssueEvent !== undefined) {
        return get_create_sub_issue_simple_content(ev, skip_prj_name, inner.CreateSubIssueEvent);
    } else if (inner.UpdateSubIssueEvent !== undefined) {
        return get_update_sub_issue_simple_content(ev, skip_prj_name, inner.UpdateSubIssueEvent);
    } else if (inner.UpdateSubIssueStateEvent !== undefined) {
        return get_update_sub_issue_state_simple_content(ev, skip_prj_name, inner.UpdateSubIssueStateEvent);
    } else if (inner.RemoveSubIssueEvent !== undefined) {
        return get_remove_sub_issue_simple_content(ev, skip_prj_name, inner.RemoveSubIssueEvent);
    } else if (inner.AddDependenceEvent !== undefined) {
        return get_add_depend_simple_content(ev, skip_prj_name, inner.AddDependenceEvent);
    } else if (inner.RemoveDependenceEvent !== undefined) {
        return get_remove_depend_simple_content(ev, skip_prj_name, inner.RemoveDependenceEvent);
    } else if (inner.SetDeadLineTimeEvent !== undefined) {
        return get_set_deadline_simple_content(ev, skip_prj_name, inner.SetDeadLineTimeEvent);
    } else if (inner.CancelDeadLineTimeEvent !== undefined) {
        return get_cancel_deadline_simple_content(ev, skip_prj_name, inner.CancelDeadLineTimeEvent);
    } else {
        return [new LinkNoneInfo('未知事件')];
    }
}