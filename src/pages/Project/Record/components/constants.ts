import type { CheckboxOptionType } from 'antd';
import type {
    ProjectEvCfg,  ExtEvCfg,
    GiteeEvCfg, GitlabEvCfg, IssueEvCfg, SpritEvCfg,
    RequirementEvCfg, CodeEvCfg, IdeaEvCfg, DataAnnoEvCfg, ApiCollectionEvCfg, AtomgitEvCfg, CiCdEvCfg
} from '@/api/events_subscribe';

export const projectEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建项目",
        value: "createProject",
    },
    {
        label: "更新项目",
        value: "updateProject",
    },
    {
        label: "激活项目",
        value: "openProject",
    },
    {
        label: "关闭项目",
        value: "closeProject",
    },
    {
        label: "删除项目",
        value: "removeProject",
    },
    {
        label: "邀请成员",
        value: "genInvite",
    },
    {
        label: "加入项目",
        value: "joinProject",
    },
    {
        label: "离开项目",
        value: "leaveProject",
    },
    {
        label: "创建角色",
        value: "createRole",
    },
    {
        label: "更新角色",
        value: "updateRole",
    },
    {
        label: "删除角色",
        value: "removeRole",
    },
    {
        label: "更新项目成员",
        value: "updateProjectMember",
    },
    {
        label: "删除项目成员",
        value: "removeProjectMember",
    },
    {
        label: "设置成员角色",
        value: "setProjectMemberRole",
    },
    {
        label: "创建评估",
        value: "createAppraise",
    },
    {
        label: "更新评估",
        value: "updateAppraise",
    },
    {
        label: "删除评估",
        value: "removeAppraise",
    },
    {
        label: "转移超级管理员",
        value: "changeOwner",
    },
    {
        label: "创建事件订阅",
        value: "createSubscribe",
    },
    {
        label: "修改事件订阅",
        value: "updateSubscribe",
    },
    {
        label: "删除事件订阅",
        value: "removeSubscribe",
    },
    {
        label: "更新预警配置",
        value: "setAlarmConfig",
    },
    {
        label: "自定义事件",
        value: "customEvent"
    }
];

export const calcProjectEvCfg = (values: string[] | undefined): ProjectEvCfg => {
    const ret: ProjectEvCfg = {
        create_project: false,
        update_project: false,
        open_project: false,
        close_project: false,
        remove_project: false,
        gen_invite: false,
        join_project: false,
        leave_project: false,
        create_role: false,
        update_role: false,
        remove_role: false,
        update_project_member: false,
        remove_project_member: false,
        set_project_member_role: false,
        create_appraise: false,
        update_appraise: false,
        remove_appraise: false,
        change_owner: false,
        create_subscribe: false,
        update_subscribe: false,
        remove_subscribe: false,
        set_alarm_config: false,
        custom_event: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "createProject") {
            ret.create_project = true;
        } else if (value == "updateProject") {
            ret.update_project = true;
        } else if (value == "openProject") {
            ret.open_project = true;
        } else if (value == "closeProject") {
            ret.close_project = true;
        } else if (value == "removeProject") {
            ret.remove_project = true;
        } else if (value == "genInvite") {
            ret.gen_invite = true;
        } else if (value == "joinProject") {
            ret.join_project = true;
        } else if (value == "leaveProject") {
            ret.leave_project = true;
        } else if (value == "createRole") {
            ret.create_role = true;
        } else if (value == "updateRole") {
            ret.update_role = true;
        } else if (value == "removeRole") {
            ret.remove_role = true;
        } else if (value == "updateProjectMember") {
            ret.update_project_member = true;
        } else if (value == "removeProjectMember") {
            ret.remove_project_member = true;
        } else if (value == "setProjectMemberRole") {
            ret.set_project_member_role = true;
        } else if (value == "createAppraise") {
            ret.create_appraise = true;
        } else if (value == "updateAppraise") {
            ret.update_appraise = true;
        } else if (value == "removeAppraise") {
            ret.remove_appraise = true;
        } else if (value == "changeOwner") {
            ret.change_owner = true;
        } else if (value == "createSubscribe") {
            ret.create_subscribe = true;
        } else if (value == "updateSubscribe") {
            ret.update_subscribe = true;
        } else if (value == "removeSubscribe") {
            ret.remove_subscribe = true;
        } else if (value == "setAlarmConfig") {
            ret.set_alarm_config = true;
        } else if (value == "customEvent") {
            ret.custom_event = true;
        }
    });
    return ret;
};

export const genProjectEvCfgValues = (cfg: ProjectEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create_project) {
        retList.push("createProject");
    }
    if (cfg.update_project) {
        retList.push("updateProject");
    }
    if (cfg.open_project) {
        retList.push("openProject");
    }
    if (cfg.close_project) {
        retList.push("closeProject");
    }
    if (cfg.remove_project) {
        retList.push("removeProject");
    }
    if (cfg.gen_invite) {
        retList.push("genInvite");
    }
    if (cfg.join_project) {
        retList.push("joinProject");
    }
    if (cfg.leave_project) {
        retList.push("leaveProject");
    }
    if (cfg.create_role) {
        retList.push("createRole");
    }
    if (cfg.update_role) {
        retList.push("updateRole");
    }
    if (cfg.remove_role) {
        retList.push("removeRole");
    }
    if (cfg.update_project_member) {
        retList.push("updateProjectMember");
    }
    if (cfg.remove_project_member) {
        retList.push("removeProjectMember");
    }
    if (cfg.set_project_member_role) {
        retList.push("setProjectMemberRole");
    }
    if (cfg.create_appraise) {
        retList.push("createAppraise");
    }
    if (cfg.update_appraise) {
        retList.push("updateAppraise");
    }
    if (cfg.remove_appraise) {
        retList.push("removeAppraise");
    }
    if (cfg.change_owner) {
        retList.push("changeOwner");
    }
    if (cfg.create_subscribe) {
        retList.push("createSubscribe");
    }
    if (cfg.update_subscribe) {
        retList.push("updateSubscribe");
    }
    if (cfg.remove_subscribe) {
        retList.push("removeSubscribe");
    }
    if (cfg.set_alarm_config) {
        retList.push("setAlarmConfig");
    }
    if (cfg.custom_event) {
        retList.push("customEvent");
    }
    return retList;
}

export const extEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建第三方接入",
        value: "create",
    },
    {
        label: "更新第三方接入",
        value: "update",
    },
    {
        label: "获取第三方接入密钥",
        value: "getSecret",
    },
    {
        label: "删除第三方接入",
        value: "remove",
    },
    {
        label: "设置事件分发策略",
        value: "setSourceUserPolicy",
    },
];

export const calcExtEvCfg = (values: string[] | undefined): ExtEvCfg => {
    const ret: ExtEvCfg = {
        create: false,
        update: false,
        get_secret: false,
        remove: false,
        set_source_user_policy: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "create") {
            ret.create = true;
        } else if (value == "update") {
            ret.update = true;
        } else if (value == "getSecret") {
            ret.get_secret = true;
        } else if (value == "remove") {
            ret.remove = true;
        } else if (value == "setSourceUserPolicy") {
            ret.set_source_user_policy = true;
        }
    });
    return ret;
}

export const genExtEvCfgValues = (cfg: ExtEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create) {
        retList.push("create");
    }
    if (cfg.update) {
        retList.push("update");
    }
    if (cfg.get_secret) {
        retList.push("getSecret");
    }
    if (cfg.remove) {
        retList.push("remove");
    }
    if (cfg.set_source_user_policy) {
        retList.push("setSourceUserPolicy");
    }
    return retList;
};

export const giteeEvOptionList: CheckboxOptionType[] = [
    {
        label: "PushEvent",
        value: "push",
    },
    {
        label: "IssueEvent",
        value: "issue",
    },
    {
        label: "PullRequestEvent",
        value: "pullRequest",
    },
    {
        label: "NoteEvent",
        value: "note",
    },
];

export const calcGiteeEvCfg = (values: string[] | undefined): GiteeEvCfg => {
    const ret: GiteeEvCfg = {
        push: false,
        issue: false,
        pull_request: false,
        note: false,
    }
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "push") {
            ret.push = true;
        } else if (value == "issue") {
            ret.issue = true;
        } else if (value == "pullRequest") {
            ret.pull_request = true;
        } else if (value == "note") {
            ret.note = true;
        }
    });
    return ret;
};

export const genGiteeEvCfgValues = (cfg: GiteeEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.push) {
        retList.push("push");
    }
    if (cfg.issue) {
        retList.push("issue");
    }
    if (cfg.pull_request) {
        retList.push("pullRequest");
    }
    if (cfg.note) {
        retList.push("note");
    }
    return retList;
};

export const gitlabEvOptionList: CheckboxOptionType[] = [
    {
        label: "BuildEvent",
        value: "build",
    },
    {
        label: "CommentEvent",
        value: "comment",
    },
    {
        label: "IssueEvent",
        value: "issue",
    },
    {
        label: "JobEvent",
        value: "job",
    },
    {
        label: "MergeRequestEvent",
        value: "mergeRequest",
    },
    {
        label: "PipelineEvent",
        value: "pipeline",
    },
    {
        label: "PushEvent",
        value: "push",
    },
    {
        label: "TagEvent",
        value: "tag",
    },
    {
        label: "WikiEvent",
        value: "wiki",
    },
];

export const calcGitlabEvCfg = (values: string[] | undefined): GitlabEvCfg => {
    const ret: GitlabEvCfg = {
        build: false,
        comment: false,
        issue: false,
        job: false,
        merge_request: false,
        pipeline: false,
        push: false,
        tag: false,
        wiki: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "build") {
            ret.build = true;
        } else if (value == "comment") {
            ret.comment = true;
        } else if (value == "issue") {
            ret.issue = true;
        } else if (value == "job") {
            ret.job = true;
        } else if (value == "mergeRequest") {
            ret.merge_request = true;
        } else if (value == "pipeline") {
            ret.pipeline = true;
        } else if (value == "push") {
            ret.push = true;
        } else if (value == "tag") {
            ret.tag = true;
        } else if (value == "wiki") {
            ret.wiki = true;
        }
    });
    return ret;
};

export const genGitlabEvCfgValues = (cfg: GitlabEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.build) {
        retList.push("build");
    }
    if (cfg.comment) {
        retList.push("comment");
    }
    if (cfg.issue) {
        retList.push("issue");
    }
    if (cfg.job) {
        retList.push("job");
    }
    if (cfg.merge_request) {
        retList.push("mergeRequest");
    }
    if (cfg.pipeline) {
        retList.push("pipeline");
    }
    if (cfg.push) {
        retList.push("push");
    }
    if (cfg.tag) {
        retList.push("tag");
    }
    if (cfg.wiki) {
        retList.push("wiki");
    }
    return retList;
};

export const issueEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建工单",
        value: "create",
    },
    {
        label: "更新工单",
        value: "update",
    },
    {
        label: "更新标签",
        value: "updateTag",
    },
    {
        label: "删除工单",
        value: "remove",
    },
    {
        label: "指派执行者",
        value: "assignExecUser",
    },
    {
        label: "指派检查者",
        value: "assignCheckUser",
    },
    {
        label: "变更状态",
        value: "changeState",
    },
    {
        label: "变更执行阶段",
        value: "updateProcessStage"
    },
    {
        label: "关联工作计划",
        value: "linkSprit",
    },
    {
        label: "取消关联工作计划",
        value: "cancelLinkSprit",
    },
    {
        label: "设置开始时间",
        value: "setStartTime",
    },
    {
        label: "取消开始时间",
        value: "cancelStartTime",
    },
    {
        label: "设置结束时间",
        value: "setEndTime",
    },
    {
        label: "取消结束时间",
        value: "cancelEndTime",
    },
    {
        label: "设置预估工时",
        value: "setEstimateMinutes",
    },
    {
        label: "取消预估工时",
        value: "cancelEstimateMinutes",
    },
    {
        label: "设置剩余工时",
        value: "setRemainMinutes",
    },
    {
        label: "取消剩余工时",
        value: "cancelRemainMinutes",
    },
    {
        label: "创建子工单",
        value: "createSubIssue",
    },
    {
        label: "更新子工单",
        value: "updateSubIssue",
    },
    {
        label: "更新子工单状态",
        value: "updateSubIssueState",
    },
    {
        label: "删除子工单",
        value: "removeSubIssue",
    },
    {
        label: "增加依赖工单",
        value: "addDependence",
    },
    {
        label: "删除依赖工单",
        value: "removeDependence",
    },
    {
        label: "设置截至时间",
        value: "setDeadLineTime",
    },
    {
        label: "取消截至时间",
        value: "cancelDeadLineTime"
    },
];

export const calcIssueEvCfg = (values: string[] | undefined): IssueEvCfg => {
    const ret: IssueEvCfg = {
        create: false,
        update: false,
        remove: false,
        assign_exec_user: false,
        assign_check_user: false,
        change_state: false,
        update_process_stage: false,
        link_sprit: false,
        cancel_link_sprit: false,
        set_start_time: false,
        cancel_start_time: false,
        set_end_time: false,
        cancel_end_time: false,
        set_estimate_minutes: false,
        cancel_estimate_minutes: false,
        set_remain_minutes: false,
        cancel_remain_minutes: false,
        create_sub_issue: false,
        update_sub_issue: false,
        update_sub_issue_state: false,
        remove_sub_issue: false,
        add_dependence: false,
        remove_dependence: false,
        set_dead_line_time: false,
        cancel_dead_line_time: false,
        update_tag: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "create") {
            ret.create = true;
        } else if (value == "update") {
            ret.update = true;
        } else if (value == "remove") {
            ret.remove = true;
        } else if (value == "assignExecUser") {
            ret.assign_exec_user = true;
        } else if (value == "assignCheckUser") {
            ret.assign_check_user = true;
        } else if (value == "changeState") {
            ret.change_state = true;
        } else if (value == "updateProcessStage") {
            ret.update_process_stage = true;
        } else if (value == "linkSprit") {
            ret.link_sprit = true;
        } else if (value == "cancelLinkSprit") {
            ret.cancel_link_sprit = true;
        } else if (value == "setStartTime") {
            ret.set_start_time = true;
        } else if (value == "cancelStartTime") {
            ret.cancel_start_time = true;
        } else if (value == "setEndTime") {
            ret.set_end_time = true;
        } else if (value == "cancelEndTime") {
            ret.cancel_end_time = true;
        } else if (value == "setEstimateMinutes") {
            ret.set_estimate_minutes = true;
        } else if (value == "cancelEstimateMinutes") {
            ret.cancel_estimate_minutes = true;
        } else if (value == "setRemainMinutes") {
            ret.set_remain_minutes = true;
        } else if (value == "cancelRemainMinutes") {
            ret.cancel_remain_minutes = true;
        } else if (value == "createSubIssue") {
            ret.create_sub_issue = true;
        } else if (value == "updateSubIssue") {
            ret.update_sub_issue = true;
        } else if (value == "updateSubIssueState") {
            ret.update_sub_issue_state = true;
        } else if (value == "removeSubIssue") {
            ret.remove_sub_issue = true;
        } else if (value == "addDependence") {
            ret.add_dependence = true;
        } else if (value == "removeDependence") {
            ret.remove_dependence = true;
        } else if (value == "setDeadLineTime") {
            ret.set_dead_line_time = true;
        } else if (value == "cancelDeadLineTime") {
            ret.cancel_dead_line_time = true;
        } else if (value == "updateTag") {
            ret.update_tag = true;
        }
    });
    return ret;
};

export const genIssueEvCfgValues = (cfg: IssueEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create) {
        retList.push("create");
    }
    if (cfg.update) {
        retList.push("update");
    }
    if (cfg.remove) {
        retList.push("remove");
    }
    if (cfg.assign_exec_user) {
        retList.push("assignExecUser");
    }
    if (cfg.assign_check_user) {
        retList.push("assignCheckUser");
    }
    if (cfg.change_state) {
        retList.push("changeState");
    }
    if (cfg.update_process_stage) {
        retList.push("updateProcessStage");
    }
    if (cfg.link_sprit) {
        retList.push("linkSprit");
    }
    if (cfg.cancel_link_sprit) {
        retList.push("cancelLinkSprit");
    }
    if (cfg.set_start_time) {
        retList.push("setStartTime");
    }
    if (cfg.cancel_start_time) {
        retList.push("cancelStartTime");
    }
    if (cfg.set_end_time) {
        retList.push("setEndTime");
    }
    if (cfg.cancel_end_time) {
        retList.push("cancelEndTime");
    }
    if (cfg.set_estimate_minutes) {
        retList.push("setEstimateMinutes");
    }
    if (cfg.cancel_estimate_minutes) {
        retList.push("cancelEstimateMinutes");
    }
    if (cfg.set_remain_minutes) {
        retList.push("setRemainMinutes");
    }
    if (cfg.cancel_remain_minutes) {
        retList.push("cancelRemainMinutes");
    }
    if (cfg.create_sub_issue) {
        retList.push("createSubIssue");
    }
    if (cfg.update_sub_issue) {
        retList.push("updateSubIssue");
    }
    if (cfg.update_sub_issue_state) {
        retList.push("updateSubIssueState");
    }
    if (cfg.remove_sub_issue) {
        retList.push("removeSubIssue");
    }
    if (cfg.add_dependence) {
        retList.push("addDependence");
    }
    if (cfg.remove_dependence) {
        retList.push("removeDependence");
    }
    if (cfg.set_dead_line_time) {
        retList.push("setDeadLineTime");
    }
    if (cfg.cancel_dead_line_time) {
        retList.push("cancelDeadLineTime");
    }
    if (cfg.update_tag) {
        retList.push("updateTag");
    }
    return retList;
};

export const requirementEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建需求",
        value: "create_requirement",
    },
    {
        label: "更新需求",
        value: "update_requirement",
    },
    {
        label: "更新标签",
        value: "update_tag",
    },
    {
        label: "删除需求",
        value: "remove_requirement",
    },
    {
        label: "关联任务",
        value: "link_issue",
    },
    {
        label: "取消关联任务",
        value: "unlink_issue",
    },
    {
        label: "关闭需求",
        value: "close_requirement",
    },
    {
        label: "打开需求",
        value: "open_requirement",
    },
    {
        label: "更新kano分析数值",
        value: "set_kano_info",
    },
    {
        label: "更新四象限分析数值",
        value: "set_four_q_info",
    },
];

export const calcRequirementEvCfg = (values: string[] | undefined): RequirementEvCfg => {
    const ret: RequirementEvCfg = {
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
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "create_requirement") {
            ret.create_requirement = true;
        } else if (value == "update_requirement") {
            ret.update_requirement = true;
        } else if (value == "remove_requirement") {
            ret.remove_requirement = true;
        } else if (value == "link_issue") {
            ret.link_issue = true;
        } else if (value == "unlink_issue") {
            ret.unlink_issue = true;
        } else if (value == "close_requirement") {
            ret.close_requirement = true;
        } else if (value == "open_requirement") {
            ret.open_requirement = true;
        } else if (value == "set_kano_info") {
            ret.set_kano_info = true;
        } else if (value == "set_four_q_info") {
            ret.set_four_q_info = true;
        } else if (value == "update_tag") {
            ret.update_tag = true;
        }
    });
    return ret;
};

export const genRequirementEvCfgValues = (cfg: RequirementEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create_requirement) {
        retList.push("create_requirement");
    }
    if (cfg.update_requirement) {
        retList.push("update_requirement");
    }
    if (cfg.remove_requirement) {
        retList.push("remove_requirement");
    }
    if (cfg.link_issue) {
        retList.push("link_issue");
    }
    if (cfg.unlink_issue) {
        retList.push("unlink_issue");
    }
    if (cfg.close_requirement) {
        retList.push("close_requirement");
    }
    if (cfg.open_requirement) {
        retList.push("open_requirement");
    }
    if (cfg.set_kano_info) {
        retList.push("set_kano_info");
    }
    if (cfg.set_four_q_info) {
        retList.push("set_four_q_info");
    }
    if (cfg.update_tag) {
        retList.push("update_tag");
    }
    return retList;
}

export const spritEvOptionList: CheckboxOptionType[] = [
    {
        label: "关联文档",
        value: "linkDoc",
    },
    {
        label: "取消关联文档",
        value: "cancelLinkDoc",
    },
];

export const calcSpritEvCfg = (values: string[] | undefined): SpritEvCfg => {
    const ret: SpritEvCfg = {
        link_doc: false,
        cancel_link_doc: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "linkDoc") {
            ret.link_doc = true;
        } else if (value == "cancelLinkDoc") {
            ret.cancel_link_doc = true;
        } 
    });
    return ret;
};

export const genSpritEvCfgValues = (cfg: SpritEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.link_doc) {
        retList.push("linkDoc");
    }
    if (cfg.cancel_link_doc) {
        retList.push("cancelLinkDoc");
    }
    return retList;
};

export const codeEvOptionList: CheckboxOptionType[] = [
    {
        label: "增加评论",
        value: "addComment",
    },
    {
        label: "更新评论",
        value: "updateComment",
    },
    {
        label: "删除评论",
        value: "removeComment",
    }
];

export const calcCodeEvCfg = (values: string[] | undefined): CodeEvCfg => {
    const ret: CodeEvCfg = {
        add_comment: false,
        update_comment: false,
        remove_comment: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "addComment") {
            ret.add_comment = true;
        } else if (value == "updateComment") {
            ret.update_comment = true;
        } else if (value == "removeComment") {
            ret.remove_comment = true;
        }
    });
    return ret;
};

export const genCodeEvCfgValues = (cfg: CodeEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.add_comment) {
        retList.push("addComment");
    }
    if (cfg.update_comment) {
        retList.push("updateComment");
    }
    if (cfg.remove_comment) {
        retList.push("removeComment");
    }
    return retList;
};

export const ideaEvOptionList: CheckboxOptionType[] = [
    {
        label: "增加知识点",
        value: "create_idea",
    },
    {
        label: "更新知识点内容",
        value: "update_idea_content",
    },
    {
        label: "更新知识点标签",
        value: "update_idea_tag",
    },
    {
        label: "更新知识点关键词",
        value: "update_idea_keyword",
    },
    {
        label: "锁定知识点",
        value: "lock_idea",
    },
    {
        label: "解锁知识点",
        value: "unlock_idea",
    },
    {
        label: "删除知识点",
        value: "remove_idea",
    },
    {
        label: "评价知识点",
        value: "set_appraise",
    },
    {
        label: "取消评价知识点",
        value: "cancel_appraise",
    },
]

export const calcIdeaEvCfg = (values: string[] | undefined): IdeaEvCfg => {
    const ret: IdeaEvCfg = {
        create_idea: false,
        update_idea_content: false,
        update_idea_tag: false,
        update_idea_keyword: false,
        lock_idea: false,
        unlock_idea: false,
        remove_idea: false,
        set_appraise: false,
        cancel_appraise: false,
    }
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "create_idea") {
            ret.create_idea = true;
        } else if (value == "update_idea_content") {
            ret.update_idea_content = true;
        } else if (value == "update_idea_tag") {
            ret.update_idea_tag = true;
        } else if (value == "update_idea_keyword") {
            ret.update_idea_keyword = true;
        } else if (value == "lock_idea") {
            ret.lock_idea = true;
        } else if (value == "unlock_idea") {
            ret.unlock_idea = true;
        } else if (value == "remove_idea") {
            ret.remove_idea = true;
        } else if (value == "set_appraise") {
            ret.set_appraise = true;
        } else if (value == "cancel_appraise") {
            ret.cancel_appraise = true;
        }
    });
    return ret;
}

export const genIdeaEvCfgValues = (cfg: IdeaEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create_idea) {
        retList.push("create_idea");
    }
    if (cfg.update_idea_content) {
        retList.push("update_idea_content");
    }
    if (cfg.update_idea_tag) {
        retList.push("update_idea_tag");
    }
    if (cfg.update_idea_keyword) {
        retList.push("update_idea_keyword");
    }
    if (cfg.lock_idea) {
        retList.push("lock_idea");
    }
    if (cfg.unlock_idea) {
        retList.push("unlock_idea");
    }
    if (cfg.remove_idea) {
        retList.push("remove_idea");
    }
    if (cfg.set_appraise) {
        retList.push("set_appraise");
    }
    if (cfg.cancel_appraise) {
        retList.push("cancel_appraise");
    }
    return retList;
}

export const dataAnnoEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建标注项目",
        value: "create_anno_project",
    },
    {
        label: "删除标注项目",
        value: "remove_anno_project",
    },
    {
        label: "增加标注成员",
        value: "add_anno_member",
    },
    {
        label: "移除标注成员",
        value: "remove_anno_member",
    },
];

export const calcDataAnnoEvCfg = (values: string[] | undefined): DataAnnoEvCfg => {
    const ret: DataAnnoEvCfg = {
        create_anno_project: false,
        remove_anno_project: false,
        add_anno_member: false,
        remove_anno_member: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "create_anno_project") {
            ret.create_anno_project = true;
        } else if (value == "remove_anno_project") {
            ret.remove_anno_project = true;
        } else if (value == "add_anno_member") {
            ret.add_anno_member = true;
        } else if (value == "remove_anno_member") {
            ret.remove_anno_member = true;
        }
    });
    return ret;
};

export const genDataAnnoEvCfgValues = (cfg: DataAnnoEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create_anno_project) {
        retList.push("create_anno_project");
    }
    if (cfg.remove_anno_project) {
        retList.push("remove_anno_project");
    }
    if (cfg.add_anno_member) {
        retList.push("add_anno_member");
    }
    if (cfg.remove_anno_member) {
        retList.push("remove_anno_member");
    }
    return retList;
};

export const apiCollectionEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建接口集合",
        value: "create",
    },
    {
        label: "删除接口集合",
        value: "remove",
    }
];

export const calcApiCollectionEvCfg = (values: string[] | undefined): ApiCollectionEvCfg => {
    const ret: ApiCollectionEvCfg = {
        create: false,
        remove: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "create") {
            ret.create = true;
        } else if (value == "remove") {
            ret.remove = true;
        }
    });
    return ret;
};

export const genApiCollectionEvCfgValues = (cfg: ApiCollectionEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create) {
        retList.push("create");
    }
    if (cfg.remove) {
        retList.push("remove");
    }
    return retList;
};


export const atomgitEvOptionList: CheckboxOptionType[] = [
    {
        label: "IssueEvent",
        value: "issue",
    },
    {
        label: "PushEvent",
        value: "push",
    },
];

export const calcAtomgitEvCfg = (values: string[] | undefined): AtomgitEvCfg => {
    const ret: AtomgitEvCfg = {
        issue: false,
        push: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "issue") {
            ret.issue = true;
        } else if (value == "push") {
            ret.push = true;
        }
    });
    return ret;
};

export const genAtomgitEvCfgValues = (cfg: AtomgitEvCfg): string[] => {
    const retList: string[] = [];

    if (cfg.issue) {
        retList.push("issue");
    }
    if (cfg.push) {
        retList.push("push");
    }
    return retList;
};


export const ciCdEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建流水线",
        value: "create_pipe_line",
    },
    {
        label: "删除流水线",
        value: "remove_pipe_line",
    }
];

export const calcCiCdEvCfg = (values: string[] | undefined): CiCdEvCfg => {
    const ret: CiCdEvCfg = {
        create_pipe_line: false,
        remove_pipe_line: false,
    };
    if (values == undefined) {
        return ret;
    }
    values.forEach(value => {
        if (value == "create_pipe_line") {
            ret.create_pipe_line = true;
        } else if (value == "remove_pipe_line") {
            ret.remove_pipe_line = true;
        }
    });
    return ret;
};

export const genCiCdEvCfgValues = (cfg: CiCdEvCfg): string[] => {
    const retList: string[] = [];
    if (cfg.create_pipe_line) {
        retList.push("create_pipe_line");
    }
    if (cfg.remove_pipe_line) {
        retList.push("remove_pipe_line");
    }
    return retList;
};