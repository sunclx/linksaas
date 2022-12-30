import type { CheckboxOptionType } from 'antd';

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
        label: "创建频道",
        value: "createChannel",
    },
    {
        label: "更新频道",
        value: "updateChannel",
    },
    {
        label: "激活频道",
        value: "openChannel",
    },
    {
        label: "关闭频道",
        value: "closeChannel",
    },
    {
        label: "删除频道",
        value: "removeChannel",
    },
    {
        label: "添加频道成员",
        value: "addChannelMember",
    },
    {
        label: "删除频道成员",
        value: "removeChannelMember",
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
        label: "增加项目应用",
        value: "addProjectApp",
    },
    {
        label: "删除项目应用",
        value: "removeProjectApp",
    },
    {
        label: "创建目标",
        value: "createGoal",
    },
    {
        label: "更新目标",
        value: "updateGoal",
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
];

export const bookShelfEvOptionList: CheckboxOptionType[] = [
    {
        label: "新增电子书",
        value: "addBook",
    },
    {
        label: "删除电子书",
        value: "removeBook",
    },
];

export const docEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建文档空间",
        value: "createSpace",
    },
    {
        label: "更新文档空间",
        value: "updateSpace",
    },
    {
        label: "删除文档空间",
        value: "removeSpace",
    },
    {
        label: "创建文档",
        value: "createDoc",
    },
    {
        label: "更新文档",
        value: "updateDoc",
    },
    {
        label: "移动到回收站",
        value: "moveDocToRecycle",
    },
    {
        label: "删除文档",
        value: "removeDoc",
    },
    {
        label: "恢复文档",
        value: "recoverDoc",
    },
    {
        label: "关注文档",
        value: "watchDoc",
    },
    {
        label: "取消关注文档",
        value: "unWatchDoc",
    },
    {
        label: "移动文档",
        value: "moveDoc",
    },
];

export const earthlyEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建仓库",
        value: "addRepo",
    },
    {
        label: "删除仓库",
        value: "removeRepo",
    },
    {
        label: "创建指令",
        value: "createAction",
    },
    {
        label: "更新指令",
        value: "updateAction",
    },
    {
        label: "删除指令",
        value: "removeAction",
    },
];

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
        label: "删除工单",
        value: "remove",
    },
    {
        label: "指派执行者",
        value: "AssignExecUser",
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
        label: "关联迭代",
        value: "linkSprit",
    },
    {
        label: "取消关联迭代",
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
];

export const robotEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建服务器代理",
        value: "create",
    },
    {
        label: "更新服务器代理",
        value: "update",
    },
    {
        label: "删除服务器代理",
        value: "remove",
    },
    {
        label: "增加访问用户",
        value: "addAccessUser",
    },
    {
        label: "删除访问用户",
        value: "removeAccessUser",
    },
    {
        label: "更新服务器代理令牌",
        value: "renewToken",
    },
];

export const spritEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建迭代",
        value: "create",
    },
    {
        label: "更新迭代",
        value: "update",
    },
    {
        label: "删除迭代",
        value: "remove",
    },
    {
        label: "关联文档",
        value: "linkDoc",
    },
    {
        label: "取消关联文档",
        value: "cancelLinkDoc",
    },
    {
        label: "关联频道",
        value: "linkChannel",
    },
    {
        label: "取消关联文档",
        value: "cancelLinkChannel",
    },
];

export const testCaseEvOptionList: CheckboxOptionType[] = [
    {
        label: "创建节点",
        value: "createEntry",
    },
    {
        label: "移动节点",
        value: "moveEntry",
    },
    {
        label: "更新节点标题",
        value: "updateEntryTitle",
    },
    {
        label: "删除节点",
        value: "removeEntry",
    },
    {
        label: "增加验证规则",
        value: "addRule",
    },
    {
        label: "更新验证规则",
        value: "updateRule",
    },
    {
        label: "删除验证规则",
        value: "removeRule",
    },
    {
        label: "新增测试指标",
        value: "addMetric",
    },
    {
        label: "更新测试指标",
        value: "updateMetric",
    },
    {
        label: "删除测试指标",
        value: "removeMetric",
    },
    {
        label: "更新测试步骤",
        value: "updateContent",
    },
];
