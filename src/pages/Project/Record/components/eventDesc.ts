export interface EventAttr {
    key: string;
    desc: string;
}
export interface EventDesc {
    id: string;
    name: string;
    attrList: EventAttr[];
}

export interface EventGroup {
    id: string;
    name: string;
    eventDescList: EventDesc[];
}


const bookShelfEventList: EventDesc[] = [
    {
        id: "AddBookEvent",
        name: "增加书本",
        attrList: [
            {
                key: "book_id",
                desc: "书本ID"
            },
            {
                key: "book_title",
                desc: "书本标题"
            }
        ],
    },
    {
        id: "RemoveBookEvent",
        name: "删除书本",
        attrList: [
            {
                key: "book_id",
                desc: "书本ID"
            },
            {
                key: "book_title",
                desc: "书本标题"
            }
        ],
    }
];

const codeEventList: EventDesc[] = [
    {
        id: "AddCommentEvent",
        name: "新增代码评论",
        attrList: [
            {
                key: "comment_id",
                desc: "评论ID",
            },
            {
                key: "thread_id",
                desc: "评论会话ID",
            },
            {
                key: "content_type",
                desc: "内容类型",
            },
            {
                key: "content",
                desc: "内容",
            },
        ],
    },
    {
        id: "UpdateCommentEvent",
        name: "更新代码评论",
        attrList: [
            {
                key: "comment_id",
                desc: "评论ID",
            },
            {
                key: "thread_id",
                desc: "评论会话ID",
            },
            {
                key: "old_content_type",
                desc: "旧内容类型",
            },
            {
                key: "new_content_type",
                desc: "新内容类型",
            },
            {
                key: "old_content",
                desc: "旧内容",
            },
            {
                key: "new_content",
                desc: "新内容",
            },
        ],
    },
    {
        id: "RemoveCommentEvent",
        name: "删除代码评论",
        attrList: [
            {
                key: "comment_id",
                desc: "评论ID",
            },
            {
                key: "thread_id",
                desc: "评论会话ID",
            },
            {
                key: "content_type",
                desc: "内容类型",
            },
            {
                key: "content",
                desc: "内容",
            },
        ],
    },
];

const docEventList: EventDesc[] = [
    {
        id: "CreateSpaceEvent",
        name: "创建文档空间",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID"
            },
            {
                key: "title",
                desc: "文档空间标题"
            },
        ]
    },
    {
        id: "UpdateSpaceEvent",
        name: "修改文档空间",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID"
            },
            {
                key: "old_title",
                desc: "旧文档空间标题",
            },
            {
                key: "new_title",
                desc: "新文档空间标题",
            },
        ]
    },
    {
        id: "RemoveSpaceEvent",
        name: "删除文档空间",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID"
            },
            {
                key: "title",
                desc: "文档空间标题"
            },
        ]
    },
    {
        id: "CreateDocEvent",
        name: "创建文档",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
        ]
    },
    {
        id: "UpdateDocEvent",
        name: "更新文档",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "old_title",
                desc: "旧文档标题",
            },
            {
                key: "new_title",
                desc: "新文档标题",
            },
        ]
    },
    {
        id: "UpdateTagEvent",
        name: "更新文档标签",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
            {
                key: "old_tag_list",
                desc: "旧标签列表",
            },
            {
                key: "new_tag_list",
                desc: "新标签列表",
            },
        ]
    },
    {
        id: "MoveDocToRecycleEvent",
        name: "移动文档到回收站",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
        ]
    },
    {
        id: "RemoveDocEvent",
        name: "删除文档",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
        ]
    },
    {
        id: "RecoverDocEvent",
        name: "恢复文档",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
        ]
    },
    {
        id: "WatchDocEvent",
        name: "关注文档",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
        ]
    },
    {
        id: "UnWatchDocEvent",
        name: "取消关注文档",
        attrList: [
            {
                key: "doc_space_id",
                desc: "文档空间ID",
            },
            {
                key: "doc_space_name",
                desc: "文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
        ]
    },
    {
        id: "MoveDocEvent",
        name: "移动文档",
        attrList: [
            {
                key: "src_doc_space_id",
                desc: "源头文档空间ID",
            },
            {
                key: "src_doc_space_name",
                desc: "源头文档空间名称",
            },
            {
                key: "dest_doc_space_id",
                desc: "目标文档空间ID",
            },
            {
                key: "dest_doc_space_name",
                desc: "目标文档空间名称",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "title",
                desc: "文档标题",
            },
        ]
    },
];

const earthlyEventList: EventDesc[] = [
    {
        id: "AddRepoEvent",
        name: "创建仓库",
        attrList: [
            {
                key: "repo_id",
                desc: "仓库ID",
            },
            {
                key: "repo_url",
                desc: "仓库地址",
            },
        ]
    },
    {
        id: "RemoveRepoEvent",
        name: "删除仓库",
        attrList: [
            {
                key: "repo_id",
                desc: "仓库ID",
            },
            {
                key: "repo_url",
                desc: "仓库地址",
            },
        ]
    },
    {
        id: "CreateActionEvent",
        name: "创建执行命令",
        attrList: [
            {
                key: "repo_id",
                desc: "仓库ID",
            },
            {
                key: "repo_url",
                desc: "仓库地址",
            },
            {
                key: "action_id",
                desc: "命令ID",
            },
            {
                key: "action_name",
                desc: "命令名称",
            }
        ]
    },
    {
        id: "UpdateActionEvent",
        name: "更新执行命令",
        attrList: [
            {
                key: "repo_id",
                desc: "仓库ID",
            },
            {
                key: "repo_url",
                desc: "仓库地址",
            },
            {
                key: "action_id",
                desc: "命令ID",
            },
            {
                key: "action_name",
                desc: "命令名称",
            }
        ]
    },
    {
        id: "RemoveActionEvent",
        name: "删除执行命令",
        attrList: [
            {
                key: "repo_id",
                desc: "仓库ID",
            },
            {
                key: "repo_url",
                desc: "仓库地址",
            },
            {
                key: "action_id",
                desc: "命令ID",
            },
            {
                key: "action_name",
                desc: "命令名称",
            }
        ]
    },
    {
        id: "ExecEvent",
        name: "执行命令",
        attrList: [
            {
                key: "exec_id",
                desc: "执行ID"
            },
            {
                key: "repo_id",
                desc: "仓库ID",
            },
            {
                key: "repo_url",
                desc: "仓库地址",
            },
            {
                key: "action_id",
                desc: "命令ID",
            },
            {
                key: "action_name",
                desc: "命令名称",
            },
            {
                key: "branch",
                desc: "代码仓库分支或标签"
            },
            {
                key: "param_list",
                desc: "执行参数列表"
            },
        ]
    },
];

const extEventList: EventDesc[] = [
    {
        id: "CreateEvent",
        name: "创建外部事件源",
        attrList: [
            {
                key: "event_source_id",
                desc: "外部事件源ID"
            },
            {
                key: "event_source",
                desc: "外部事件源类型"
            },
            {
                key: "title",
                desc: "外部事件源标题"
            },
        ],
    },
    {
        id: "UpdateEvent",
        name: "修改外部事件源",
        attrList: [
            {
                key: "event_source_id",
                desc: "外部事件源ID"
            },
            {
                key: "event_source",
                desc: "外部事件源类型"
            },
            {
                key: "old_title",
                desc: "旧外部事件源标题"
            },
            {
                key: "new_title",
                desc: "新外部事件源标题"
            },
        ],
    },
    {
        id: "GetSecretEvent",
        name: "获取外部事件源密钥",
        attrList: [
            {
                key: "event_source_id",
                desc: "外部事件源ID"
            },
            {
                key: "event_source",
                desc: "外部事件源类型"
            },
            {
                key: "title",
                desc: "外部事件源标题"
            },
        ],
    },
    {
        id: "RemoveEvent",
        name: "删除外部事件源",
        attrList: [
            {
                key: "event_source_id",
                desc: "外部事件源ID"
            },
            {
                key: "event_source",
                desc: "外部事件源类型"
            },
            {
                key: "title",
                desc: "外部事件源标题"
            },
        ],
    },
    {
        id: "SetSourceUserPolicyEvent",
        name: "设置外部事件源用户策略",
        attrList: [
            {
                key: "event_source_id",
                desc: "外部事件源ID"
            },
            {
                key: "event_source",
                desc: "外部事件源类型"
            },
            {
                key: "title",
                desc: "外部事件源标题"
            },
            {
                key: "source_user_name",
                desc: "外部用户账号",
            },
            {
                key: "source_display_name",
                desc: "外部用户名",
            },
            {
                key: "user_policy",
                desc: "用户关联策略",
            },
            {
                key: "map_user_id",
                desc: "关联本地用户ID",
            },
            {
                key: "map_user_display_name",
                desc: "关联本地用户名称",
            },
        ],
    },
];

const ideaEventList: EventDesc[] = [
    {
        id: "CreateIdeaEvent",
        name: "创建知识点",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
            {
                key: "tag_list",
                desc: "知识点标签列表",
            },
            {
                key: "keyword_list",
                desc: "关键词列表",
            },
        ]
    },
    {
        id: "UpdateIdeaContentEvent",
        name: "更新知识点内容",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "old_title",
                desc: "旧知识点标题",
            },
            {
                key: "new_title",
                desc: "新知识点标题",
            },
        ]
    },
    {
        id: "UpdateIdeaTagEvent",
        name: "修改知识点标签",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
            {
                key: "old_tag_list",
                desc: "旧知识点标签列表",
            },
            {
                key: "new_tag_list",
                desc: "新知识点标签列表",
            },
        ]
    },
    {
        id: "UpdateIdeaKeywordEvent",
        name: "修改知识点关键词",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
            {
                key: "old_keyword_list",
                desc: "旧关键词列表",
            },
            {
                key: "new_keyword_list",
                desc: "新关键词列表",
            },
        ]
    },
    {
        id: "LockIdeaEvent",
        name: "锁定知识点",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
        ]
    },
    {
        id: "UnlockIdeaEvent",
        name: "解锁知识点",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
        ]
    },
    {
        id: "RemoveIdeaEvent",
        name: "删除知识点",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
        ]
    },
    {
        id: "SetAppraiseEvent",
        name: "评价知识点",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
            {
                key: "appriase_type",
                desc: "评价类型"
            }
        ]
    },
    {
        id: "CancelAppraiseEvent",
        name: "取消评价知识点",
        attrList: [
            {
                key: "idea_id",
                desc: "知识点ID",
            },
            {
                key: "title",
                desc: "知识点标题",
            },
            {
                key: "appriase_type",
                desc: "评价类型"
            }
        ]
    },
];

const dataAnnoEventList: EventDesc[] = [
    {
        id: "CreateAnnoProjectEvent",
        name: "创建标注项目",
        attrList: [
            {
                key: "anno_project_id",
                desc: "标注项目ID",
            },
            {
                key: "anno_project_name",
                desc: "标注项目名称",
            },
        ],
    },
    {
        id: "RemoveAnnoProjectEvent",
        name: "删除标注项目",
        attrList: [
            {
                key: "anno_project_id",
                desc: "标注项目ID",
            },
            {
                key: "anno_project_name",
                desc: "标注项目名称",
            },
        ],
    },
    {
        id: "AddAnnoMemberEvent",
        name: "新增标注成员",
        attrList: [
            {
                key: "anno_project_id",
                desc: "标注项目ID",
            },
            {
                key: "anno_project_name",
                desc: "标注项目名称",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ],
    },
    {
        id: "RemoveAnnoMemberEvent",
        name: "移除标注成员",
        attrList: [
            {
                key: "anno_project_id",
                desc: "标注项目ID",
            },
            {
                key: "anno_project_name",
                desc: "标注项目名称",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ],
    },
];

const apiCollectionEventList: EventDesc[] = [
    {
        id: "CreateApiCollectionEvent",
        name: "创建接口集合",
        attrList: [
            {
                key: "api_coll_id",
                desc: "接口集合ID",
            },
            {
                key: "api_coll_type",
                desc: "接口集合类型",
            },
            {
                key: "name",
                desc: "接口集合名称",
            },
        ],
    },
    {
        id: "RemoveApiCollectionEvent",
        name: "删除接口集合",
        attrList: [
            {
                key: "api_coll_id",
                desc: "接口集合ID",
            },
            {
                key: "api_coll_type",
                desc: "接口集合类型",
            },
            {
                key: "name",
                desc: "接口集合名称",
            },
        ],
    },
];

const testCaseEventList: EventDesc[] = [
    {
        id: "CreateEntryEvent",
        name: "创建节点",
        attrList: [
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "entry_type",
                desc: "节点类型",
            },
            {
                key: "title",
                desc: "节点标题",
            },
            {
                key: "parent_entry_id",
                desc: "父目录ID",
            },
            {
                key: "parent_title",
                desc: "父目录标题",
            },
        ]
    },
    {
        id: "MoveEntryEvent",
        name: "移动节点",
        attrList: [
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "entry_type",
                desc: "节点类型",
            },
            {
                key: "title",
                desc: "节点标题",
            },
            {
                key: "parent_entry_id",
                desc: "父目录ID",
            },
            {
                key: "parent_title",
                desc: "父目录标题",
            },
        ]
    },
    {
        id: "UpdateEntryTitleEvent",
        name: "更新节点标题",
        attrList: [
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "entry_type",
                desc: "节点类型",
            },
            {
                key: "old_title",
                desc: "旧节点标题",
            },
            {
                key: "new_title",
                desc: "新节点标题",
            },
        ]
    },
    {
        id: "RemoveEntryEvent",
        name: "删除节点",
        attrList: [
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "entry_type",
                desc: "节点类型",
            },
            {
                key: "title",
                desc: "节点标题",
            },
        ]
    },
    {
        id: "AddRuleEvent",
        name: "增加验证用例",
        attrList: [
            {
                key: "rule_id",
                desc: "验证用例ID",
            },
            {
                key: "rule_info",
                desc: "验证用例信息",
            },
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "title",
                desc: "节点标题",
            },
        ]
    },
    {
        id: "UpdateRuleEvent",
        name: "修改验证用例",
        attrList: [
            {
                key: "rule_id",
                desc: "验证用例ID",
            },
            {
                key: "old_rule_info",
                desc: "旧验证用例信息",
            },
            {
                key: "new_rule_info",
                desc: "新验证用例信息",
            },
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "title",
                desc: "节点标题",
            },
        ]
    },
    {
        id: "RemoveRuleEvent",
        name: "删除验证用例",
        attrList: [
            {
                key: "rule_id",
                desc: "验证用例ID",
            },
            {
                key: "rule_info",
                desc: "验证用例信息",
            },
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "title",
                desc: "节点标题",
            },
        ]
    },
    {
        id: "AddMetricEvent",
        name: "增加指标",
        attrList: [
            {
                key: "metric_id",
                desc: "指标ID",
            },
            {
                key: "metric_info",
                desc: "指标信息",
            },
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "title",
                desc: "节点标题",
            },
        ]
    },
    {
        id: "UpdateMetricEvent",
        name: "修改指标",
        attrList: [
            {
                key: "metric_id",
                desc: "指标ID",
            },
            {
                key: "old_metric_info",
                desc: "旧指标信息",
            },
            {
                key: "new_metric_info",
                desc: "新指标信息",
            },
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "title",
                desc: "节点标题",
            },
        ]
    },
    {
        id: "RemoveMetricEvent",
        name: "删除指标",
        attrList: [
            {
                key: "metric_id",
                desc: "指标ID",
            },
            {
                key: "metric_info",
                desc: "指标信息",
            },
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "title",
                desc: "节点标题",
            },
        ]
    },
    {
        id: "UpdateContentEvent",
        name: "更新测试步骤",
        attrList: [
            {
                key: "entry_id",
                desc: "节点ID",
            },
            {
                key: "entry_title",
                desc: "节点标题",
            },
        ]
    },
];

const spritEventList: EventDesc[] = [
    {
        id: "CreateEvent",
        name: "创建工作计划",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "title",
                desc: "工作计划标题",
            },
            {
                key: "start_time",
                desc: "开始时间",
            },
            {
                key: "end_time",
                desc: "结束时间",
            },
        ],
    },
    {
        id: "UpdateEvent",
        name: "修改工作计划",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "old_title",
                desc: "旧工作计划标题",
            },
            {
                key: "new_title",
                desc: "新工作计划标题",
            },
            {
                key: "old_start_time",
                desc: "旧开始时间",
            },
            {
                key: "new_start_time",
                desc: "新开始时间",
            },
            {
                key: "old_end_time",
                desc: "旧结束时间",
            },
            {
                key: "new_end_time",
                desc: "新结束时间",
            },
        ],
    },
    {
        id: "RemoveEvent",
        name: "删除工作计划",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "title",
                desc: "工作计划标题",
            },
            {
                key: "start_time",
                desc: "开始时间",
            },
            {
                key: "end_time",
                desc: "结束时间",
            },
        ],
    },
    {
        id: "WatchEvent",
        name: "关注工作计划",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "title",
                desc: "工作计划标题",
            },
            {
                key: "start_time",
                desc: "开始时间",
            },
            {
                key: "end_time",
                desc: "结束时间",
            },
        ],
    },
    {
        id: "UnWatchEvent",
        name: "取消关注工作计划",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "title",
                desc: "工作计划标题",
            },
            {
                key: "start_time",
                desc: "开始时间",
            },
            {
                key: "end_time",
                desc: "结束时间",
            },
        ],
    },
    {
        id: "LinkDocEvent",
        name: "关联文档",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "sprit_title",
                desc: "工作计划标题",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "doc_title",
                desc: "文档标题",
            },
        ],
    },
    {
        id: "CancelLinkDocEvent",
        name: "取消关联文档",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "sprit_title",
                desc: "工作计划标题",
            },
            {
                key: "doc_id",
                desc: "文档ID",
            },
            {
                key: "doc_title",
                desc: "文档标题",
            },
        ],
    },
    {
        id: "LinkChannelEvent",
        name: "关联频道",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "sprit_title",
                desc: "工作计划标题",
            },
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_title",
                desc: "频道标题",
            },
        ],
    },
    {
        id: "CancelLinkChannelEvent",
        name: "取消关联频道",
        attrList: [
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "sprit_title",
                desc: "工作计划标题",
            },
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_title",
                desc: "频道标题",
            },
        ],
    },
];

const scriptEventList: EventDesc[] = [
    {
        id: "CreateScriptSuiteEvent",
        name: "创建脚本套件",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
        ]
    },
    {
        id: "RemoveScriptSuiteEvent",
        name: "删除脚本套件",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
        ]
    },
    {
        id: "UpdateScriptSuiteNameEvent",
        name: "更新脚本套件名称",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "old_name",
                desc: "旧脚本套件名称",
            },
            {
                key: "new_name",
                desc: "新脚本套件名称",
            },
        ]
    },
    {
        id: "UpdateEnvPermEvent",
        name: "更新环境权限",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_perm",
                desc: "旧环境变量权限"
            },
            {
                key: "new_perm",
                desc: "新环境变量权限"
            }
        ]
    },
    {
        id: "UpdateSysPermEvent",
        name: "更新系统信息权限",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_perm",
                desc: "旧系统信息权限"
            },
            {
                key: "new_perm",
                desc: "新系统信息权限"
            }
        ]
    },
    {
        id: "UpdateNetPermEvent",
        name: "更新网络访问权限",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_perm",
                desc: "旧网络访问权限"
            },
            {
                key: "new_perm",
                desc: "新网络访问权限"
            }
        ]
    },
    {
        id: "UpdateReadPermEvent",
        name: "新文件读取权限",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_perm",
                desc: "旧文件读取权限"
            },
            {
                key: "new_perm",
                desc: "新文件读取权限"
            }
        ]
    },
    {
        id: "UpdateWritePermEvent",
        name: "更新文件写权限",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_perm",
                desc: "旧文件写入权限"
            },
            {
                key: "new_perm",
                desc: "新文件写入权限"
            }
        ]
    },
    {
        id: "UpdateRunPermEvent",
        name: "更新子进程运行权限",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_perm",
                desc: "旧子进程执行权限"
            },
            {
                key: "new_perm",
                desc: "新子进程执行权限"
            }
        ]
    },
    {
        id: "UpdateScriptEvent",
        name: "更新脚本套件",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
        ],
    },
    {
        id: "UpdateExecUserEvent",
        name: "更新执行用户",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_exec_user",
                desc: "旧执行用户",
            },
            {
                key: "new_exec_user",
                desc: "新执行用户",
            },
        ]
    },
    {
        id: "UpdateEnvParamDefEvent",
        name: "更新环境参数定义",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_env_param_def_list",
                desc: "旧环境变量定义"
            },
            {
                key: "new_env_param_def_list",
                desc: "新环境变量定义"
            },
        ]
    },
    {
        id: "UpdateArgParamDefEvent",
        name: "更新脚本参数定义",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "old_arg_param_def_list",
                desc: "旧执行参数定义",
            },
            {
                key: "new_arg_param_def_list",
                desc: "新执行参数定义",
            },
        ]
    },
    {
        id: "RecoverScriptEvent",
        name: "恢复脚本套件",
        attrList: [
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "script_time",
                desc: "脚本套件修改时间"
            }
        ]
    },
    {
        id: "ExecEvent",
        name: "执行脚本套件",
        attrList: [
            {
                key: "exec_id",
                desc: "执行ID"
            },
            {
                key: "script_suite_id",
                desc: "脚本套件ID",
            },
            {
                key: "script_suite_name",
                desc: "脚本套件名称",
            },
            {
                key: "script_time",
                desc: "脚本套件修改时间"
            },
            {
                key: "env_param_list",
                desc: "执行环境变量列表"
            },
            {
                key: "arg_param_list",
                desc: "执行参数列表"
            }
        ]
    },
];

const robotEventList: EventDesc[] = [
    {
        id: "CreateEvent",
        name: "创建服务器代理",
        attrList: [
            {
                key: "robot_id",
                desc: "服务器代理ID",
            },
            {
                key: "robot_name",
                desc: "服务器代理名称",
            },
        ]
    },
    {
        id: "UpdateEvent",
        name: "修改服务器代理",
        attrList: [
            {
                key: "robot_id",
                desc: "服务器代理ID",
            },
            {
                key: "old_robot_name",
                desc: "旧服务器代理名称",
            },
            {
                key: "new_robotname",
                desc: "新服务器代理名称",
            },
        ]
    },
    {
        id: "RemoveEvent",
        name: "删除服务器代理",
        attrList: [
            {
                key: "robot_id",
                desc: "服务器代理ID",
            },
            {
                key: "robot_name",
                desc: "服务器代理名称",
            },
        ]
    },
    {
        id: "AddAccessUserEvent",
        name: "新增访问用户",
        attrList: [
            {
                key: "robot_id",
                desc: "服务器代理ID",
            },
            {
                key: "robot_name",
                desc: "服务器代理名称",
            },
            {
                key: "member_user_id",
                desc: "成员用户ID",
            },
            {
                key: "member_display_name",
                desc: "成员用户名称"
            }
        ]
    },
    {
        id: "RemoveAccessUserEvent",
        name: "删除访问用户",
        attrList: [
            {
                key: "robot_id",
                desc: "服务器代理ID",
            },
            {
                key: "robot_name",
                desc: "服务器代理名称",
            },
            {
                key: "member_user_id",
                desc: "成员用户ID",
            },
            {
                key: "member_display_name",
                desc: "成员用户名称"
            }
        ]
    },
    {
        id: "RenewTokenEvent",
        name: "更新服务器代理访问令牌",
        attrList: [
            {
                key: "robot_id",
                desc: "服务器代理ID",
            },
            {
                key: "robot_name",
                desc: "服务器代理名称",
            },
        ]
    },
];

const requirementEventList: EventDesc[] = [
    {
        id: "CreateRequirementEvent",
        name: "创建需求",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
        ]
    },
    {
        id: "UpdateRequirementEvent",
        name: "修改需求",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "old_title",
                desc: "旧需求标题"
            },
            {
                key: "new_title",
                desc: "新需求标题"
            },
        ]
    },
    {
        id: "UpdateTagEvent",
        name: "更新需求标签",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
            {
                key: "old_tag_list",
                desc: "旧标签列表",
            },
            {
                key: "new_tag_list",
                desc: "新标签列表",
            },
        ]
    },
    {
        id: "RemoveRequirementEvent",
        name: "删除需求",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
        ]
    },
    {
        id: "LinkIssueEvent",
        name: "关联任务/缺陷",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
            {
                key: "issue_id",
                desc: "任务/缺陷ID",
            },
            {
                key: "issue_title",
                desc: "任务/缺陷标题",
            },
        ]
    },
    {
        id: "UnlinkIssueEvent",
        name: "取消关联任务/缺陷",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
            {
                key: "issue_id",
                desc: "任务/缺陷ID",
            },
            {
                key: "issue_title",
                desc: "任务/缺陷标题",
            },
        ]
    },
    {
        id: "CloseRequirementEvent",
        name: "关闭需求",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
        ]
    },
    {
        id: "OpenRequirementEvent",
        name: "打开需求",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
        ]
    },
    {
        id: "SetKanoInfoEvent",
        name: "设置kano分析",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
        ]
    },
    {
        id: "SetFourQInfoEvent",
        name: "设置四象限分析",
        attrList: [
            {
                key: "requirement_id",
                desc: "需求ID"
            },
            {
                key: "title",
                desc: "需求标题"
            },
        ]
    },
];

const projectEventList: EventDesc[] = [
    {
        id: "CreateProjectEvent",
        name: "创建项目",
        attrList: []
    },
    {
        id: "UpdateProjectEvent",
        name: "修改项目",
        attrList: [
            {
                key: "new_project_name",
                desc: "新项目名称",
            }
        ]
    },
    {
        id: "OpenProjectEvent",
        name: "打开项目",
        attrList: []
    },
    {
        id: "CloseProjectEvent",
        name: "关闭项目",
        attrList: []
    },
    {
        id: "RemoveProjectEvent",
        name: "删除项目",
        attrList: []
    },
    {
        id: "GenInviteEvent",
        name: "创建邀请",
        attrList: []
    },
    {
        id: "JoinProjectEvent",
        name: "加入项目",
        attrList: []
    },
    {
        id: "LeaveProjectEvent",
        name: "离开项目",
        attrList: []
    },
    {
        id: "CreateRoleEvent",
        name: "创建角色",
        attrList: [
            {
                key: "role_id",
                desc: "角色ID",
            },
            {
                key: "role_name",
                desc: "角色名称",
            }
        ]
    },
    {
        id: "UpdateRoleEvent",
        name: "更新角色",
        attrList: [
            {
                key: "role_id",
                desc: "角色ID",
            },
            {
                key: "old_role_name",
                desc: "旧角色名称",
            },
            {
                key: "new_role_name",
                desc: "新角色名称",
            },
        ]
    },
    {
        id: "RemoveRoleEvent",
        name: "删除角色",
        attrList: [
            {
                key: "role_id",
                desc: "角色ID",
            },
            {
                key: "role_name",
                desc: "角色名称",
            }
        ]
    },
    {
        id: "UpdateProjectMemberEvent",
        name: "更新成员",
        attrList: [
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "old_member_display_name",
                desc: "旧成员名称",
            },
            {
                key: "new_member_display_name",
                desc: "新成员名称",
            },
        ]
    },
    {
        id: "RemoveProjectMemberEvent",
        name: "删除成员",
        attrList: [
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "SetProjectMemberRoleEvent",
        name: "设置成员角色",
        attrList: [
            {
                key: "role_id",
                desc: "角色ID",
            },
            {
                key: "role_name",
                desc: "角色名称",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "CreateChannelEvent",
        name: "创建频道",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
            {
                key: "pub_channel",
                desc: "公开频道",
            },
        ]
    },
    {
        id: "UpdateChannelEvent",
        name: "更新频道",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "old_channel_name",
                desc: "旧频道名称",
            },
            {
                key: "new_channel_name",
                desc: "新频道名称",
            },
            {
                key: "old_pub_channel",
                desc: "旧公开频道",
            },
            {
                key: "new_pub_channel",
                desc: "新公开频道",
            },
        ]
    },
    {
        id: "OpenChannelEvent",
        name: "打开频道",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
        ]
    },
    {
        id: "CloseChannelEvent",
        name: "关闭频道",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
        ]
    },
    {
        id: "RemoveChannelEvent",
        name: "删除频道",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
        ]
    },
    {
        id: "AddChannelMemberEvent",
        name: "增加频道成员",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "RemoveChannelMemberEvent",
        name: "删除频道成员",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "WatchChannelEvent",
        name: "关注频道",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
        ]
    },
    {
        id: "UnWatchChannelEvent",
        name: "取消关注频道",
        attrList: [
            {
                key: "channel_id",
                desc: "频道ID",
            },
            {
                key: "channel_name",
                desc: "频道名称",
            },
        ]
    },
    {
        id: "CreateAppraiseEvent",
        name: "创建成员互估",
        attrList: [
            {
                key: "appraise_id",
                desc: "成员互估ID"
            },
            {
                key: "title",
                desc: "成员互估标题"
            },
        ]
    },
    {
        id: "UpdateAppraiseEvent",
        name: "修改成员互估",
        attrList: [
            {
                key: "appraise_id",
                desc: "成员互估ID"
            },
            {
                key: "old_title",
                desc: "旧成员互估标题"
            },
            {
                key: "new_title",
                desc: "新成员互估标题"
            },
        ]
    },
    {
        id: "RemoveAppraiseEvent",
        name: "删除成员互估",
        attrList: [
            {
                key: "appraise_id",
                desc: "成员互估ID"
            },
            {
                key: "title",
                desc: "成员互估标题"
            },
        ]
    },
    {
        id: "AddProjectAppEvent",
        name: "增加项目应用",
        attrList: [
            {
                key: "app_id",
                desc: "应用ID"
            },
            {
                key: "app_name",
                desc: "应用名称"
            },
            {
                key: "app_url",
                desc: "应用地址"
            },
            {
                key: "app_open_type",
                desc: "应用打开方式"
            },
        ]
    },
    {
        id: "RemoveProjectAppEvent",
        name: "删除项目应用",
        attrList: [
            {
                key: "app_id",
                desc: "应用ID"
            },
            {
                key: "app_name",
                desc: "应用名称"
            },
        ]
    },
    {
        id: "CreateGoalEvent",
        name: "创建目标",
        attrList: [
            {
                key: "goal_id",
                desc: "目标ID",
            },
            {
                key: "from_time",
                desc: "开始时间",
            },
            {
                key: "to_time",
                desc: "结束时间",
            },
        ]
    },
    {
        id: "UpdateGoalEvent",
        name: "修改目标",
        attrList: [
            {
                key: "goal_id",
                desc: "目标ID",
            },
            {
                key: "from_time",
                desc: "开始时间",
            },
            {
                key: "to_time",
                desc: "结束时间",
            },
        ]
    },
    {
        id: "RemoveGoalEvent",
        name: "删除目标",
        attrList: [
            {
                key: "goal_id",
                desc: "目标ID",
            },
            {
                key: "from_time",
                desc: "开始时间",
            },
            {
                key: "to_time",
                desc: "结束时间",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "LockGoalEvent",
        name: "锁定目标",
        attrList: [
            {
                key: "goal_id",
                desc: "目标ID",
            },
            {
                key: "from_time",
                desc: "开始时间",
            },
            {
                key: "to_time",
                desc: "结束时间",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "UnlockGoalEvent",
        name: "解锁目标",
        attrList: [
            {
                key: "goal_id",
                desc: "目标ID",
            },
            {
                key: "from_time",
                desc: "开始时间",
            },
            {
                key: "to_time",
                desc: "结束时间",
            },
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "ChangeOwnerEvent",
        name: "转移超管权限",
        attrList: [
            {
                key: "member_user_id",
                desc: "成员ID",
            },
            {
                key: "member_display_name",
                desc: "成员名称",
            },
        ]
    },
    {
        id: "CreateEventSubscribeEvent",
        name: "创建事件订阅",
        attrList: [
            {
                key: "subscribe_id",
                desc: "事件订阅ID"
            },
            {
                key: "chat_bot_type",
                desc: "事件订阅类型"
            },
            {
                key: "chat_bot_name",
                desc: "事件订阅名称"
            },
        ]
    },
    {
        id: "UpdateEventSubscribeEvent",
        name: "修改事件订阅",
        attrList: [
            {
                key: "subscribe_id",
                desc: "事件订阅ID"
            },
            {
                key: "chat_bot_type",
                desc: "事件订阅类型"
            },
            {
                key: "old_chat_bot_name",
                desc: "旧事件订阅名称"
            },
            {
                key: "new_chat_bot_name",
                desc: "新事件订阅名称"
            },
        ]
    },
    {
        id: "RemoveEventSubscribeEvent",
        name: "删除事件订阅",
        attrList: [
            {
                key: "subscribe_id",
                desc: "事件订阅ID"
            },
            {
                key: "chat_bot_type",
                desc: "事件订阅类型"
            },
            {
                key: "chat_bot_name",
                desc: "事件订阅名称"
            },
        ]
    },
    {
        id: "SetAlarmConfigEvent",
        name: "设置告警",
        attrList: []
    },
    {
        id: "CustomEvent",
        name: "自定义事件",
        attrList: [
            {
                key: "event_type",
                desc: "自定义事件类型"
            },
            {
                key: "event_content",
                desc: "自定义事件内容"
            }
        ],
    }
];

const issueEventList: EventDesc[] = [
    {
        id: "CreateEvent",
        name: "创建工单",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
        ]
    },
    {
        id: "UpdateEvent",
        name: "修改工单",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "old_title",
                desc: "旧工单标题",
            },
            {
                key: "new_title",
                desc: "新工单标题",
            },
        ]
    },
    {
        id: "UpdateTagEvent",
        name: "更新工单标签",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "old_tag_list",
                desc: "旧标签列表",
            },
            {
                key: "new_tag_list",
                desc: "新标签列表",
            },
        ]
    },
    {
        id: "RemoveEvent",
        name: "删除工单",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
        ]
    },
    {
        id: "AssignExecUserEvent",
        name: "指派执行者",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "exec_user_id",
                desc: "执行用户ID"
            },
            {
                key: "exec_user_display_name",
                desc: "执行用户名称"
            },
        ]
    },
    {
        id: "AssignCheckUserEvent",
        name: "指派检查者",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "check_user_id",
                desc: "检查用户ID"
            },
            {
                key: "check_user_display_name",
                desc: "检查用户名称"
            },
        ]
    },
    {
        id: "ChangeStateEvent",
        name: "修改工单状态",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "old_state",
                desc: "旧工单状态",
            },
            {
                key: "new_state",
                desc: "新工单状态",
            },
        ]
    },
    {
        id: "LinkSpritEvent",
        name: "关联工作计划",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "sprit_title",
                desc: "工作计划标题",
            },
        ]
    },
    {
        id: "CancelLinkSpritEvent",
        name: "取消关联工作计划",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "sprit_id",
                desc: "工作计划ID",
            },
            {
                key: "sprit_title",
                desc: "工作计划标题",
            },
        ]
    },
    {
        id: "SetStartTimeEvent",
        name: "设置开始时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "start_time",
                desc: "开始时间"
            }
        ]
    },
    {
        id: "CancelStartTimeEvent",
        name: "取消开始时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
        ]
    },
    {
        id: "SetEndTimeEvent",
        name: "设置结束时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "end_time",
                desc: "结束时间",
            }
        ]
    },
    {
        id: "CancelEndTimeEvent",
        name: "取消结束时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
        ]
    },
    {
        id: "SetEstimateMinutesEvent",
        name: "设置预估时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "estimate_minutes",
                desc: "预估时间(单位分钟)"
            }
        ]
    },
    {
        id: "CancelEstimateMinutesEvent",
        name: "取消预估时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
        ]
    },
    {
        id: "SetRemainMinutesEvent",
        name: "设置剩余时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "remain_minutes",
                desc: "剩余时间(单位分钟)"
            },
            {
                key: "has_spend_minutes",
                desc: "是否有开销时间"
            },
            {
                key: "spend_minutes",
                desc: "开销时间(单位分钟)"
            },
        ]
    },
    {
        id: "CancelRemainMinutesEvent",
        name: "取消剩余时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
        ]
    },
    {
        id: "CreateSubIssueEvent",
        name: "增加子工单",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "issue_title",
                desc: "工单标题",
            },
            {
                key: "title",
                desc: "子工单标题"
            }
        ]
    },
    {
        id: "UpdateSubIssueEvent",
        name: "修改子工单",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "issue_title",
                desc: "工单标题",
            },
            {
                key: "old_title",
                desc: "旧子工单标题"
            },
            {
                key: "new_title",
                desc: "新子工单标题"
            }
        ]
    },
    {
        id: "UpdateSubIssueStateEvent",
        name: "更新子工单状态",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "issue_title",
                desc: "工单标题",
            },
            {
                key: "title",
                desc: "子工单标题"
            },
            {
                key: "done",
                desc: "是否完成"
            }
        ]
    },
    {
        id: "RemoveSubIssueEvent",
        name: "删除子工单",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "issue_title",
                desc: "工单标题",
            },
            {
                key: "title",
                desc: "子工单标题"
            },
        ]
    },
    {
        id: "AddDependenceEvent",
        name: "增加工单依赖",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "issue_title",
                desc: "工单标题",
            },
            {
                key: "depend_issue_id",
                desc: "依赖工单ID"
            },
            {
                key: "depend_issue_type",
                desc: "依赖工单类型"
            },
            {
                key: "depend_issue_title",
                desc: "依赖工单标题"
            },
        ]
    },
    {
        id: "RemoveDependenceEvent",
        name: "删除依赖依赖",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "issue_title",
                desc: "工单标题",
            },
            {
                key: "depend_issue_id",
                desc: "依赖工单ID"
            },
            {
                key: "depend_issue_type",
                desc: "依赖工单类型"
            },
            {
                key: "depend_issue_title",
                desc: "依赖工单标题"
            },
        ]
    },
    {
        id: "SetDeadLineTimeEvent",
        name: "设置截止时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
            {
                key: "dead_line_time",
                desc: "截止时间"
            }
        ]
    },
    {
        id: "CancelDeadLineTimeEvent",
        name: "取消截止时间",
        attrList: [
            {
                key: "issue_id",
                desc: "工单ID",
            },
            {
                key: "issue_type",
                desc: "工单类型",
            },
            {
                key: "title",
                desc: "工单标题",
            },
        ]
    },
];

const gitlabEventList: EventDesc[] = [
    {
        id: "BuildEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "ref",
                desc: ""
            },
            {
                key: "tag",
                desc: ""
            },
            {
                key: "before_sha",
                desc: ""
            },
            {
                key: "sha",
                desc: ""
            },
            {
                key: "build_id",
                desc: ""
            },
            {
                key: "build_name",
                desc: ""
            },
            {
                key: "build_stage",
                desc: ""
            },
            {
                key: "build_status",
                desc: ""
            },
            {
                key: "build_started_at",
                desc: ""
            },
            {
                key: "build_finished_at",
                desc: ""
            },
            {
                key: "build_duration",
                desc: ""
            },
            {
                key: "build_allow_failure",
                desc: ""
            },
            {
                key: "project_id",
                desc: ""
            },
            {
                key: "project_name",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "commit",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "runner",
                desc: ""
            }
        ]
    },
    {
        id: "CommentEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "user",
                desc: "",
            },
            {
                key: "project_id",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "repository",
                desc: "",
            },
            {
                key: "object_attributes",
                desc: "",
            },
            {
                key: "merge_request",
                desc: "",
            },
            {
                key: "commit",
                desc: "",
            },
            {
                key: "issue",
                desc: "",
            },
            {
                key: "snippet",
                desc: "",
            },
        ]
    },
    {
        id: "IssueEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "object_attributes",
                desc: ""
            },
            {
                key: "assignee",
                desc: ""
            },
            {
                key: "changes",
                desc: ""
            },
        ]
    },
    {
        id: "JobEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "ref",
                desc: ""
            },
            {
                key: "tag",
                desc: ""
            },
            {
                key: "before_sha",
                desc: ""
            },
            {
                key: "sha",
                desc: ""
            },
            {
                key: "build_id",
                desc: ""
            },
            {
                key: "build_name",
                desc: ""
            },
            {
                key: "build_stage",
                desc: ""
            },
            {
                key: "build_status",
                desc: ""
            },
            {
                key: "build_started_at",
                desc: ""
            },
            {
                key: "build_finished_at",
                desc: ""
            },
            {
                key: "build_duration",
                desc: ""
            },
            {
                key: "build_allow_failure",
                desc: ""
            },
            {
                key: "project_id",
                desc: ""
            },
            {
                key: "project_name",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "commit",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "runner",
                desc: ""
            }
        ]
    },
    {
        id: "MergeRequestEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "user",
                desc: "",
            },
            {
                key: "object_attributes",
                desc: "",
            },
            {
                key: "changes",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "repository",
                desc: "",
            },
            {
                key: "labels",
                desc: "",
            },
            {
                key: "assignees",
                desc: "",
            },
        ]
    },
    {
        id: "PipelineEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "commit",
                desc: ""
            },
            {
                key: "object_attributes",
                desc: ""
            },
            {
                key: "merge_request",
                desc: ""
            },
            {
                key: "builds",
                desc: ""
            },
        ]
    },
    {
        id: "PushEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "before",
                desc: "",
            },
            {
                key: "after",
                desc: "",
            },
            {
                key: "ref",
                desc: "",
            },
            {
                key: "checkout_sha",
                desc: "",
            },
            {
                key: "user_id",
                desc: "",
            },
            {
                key: "user_name",
                desc: "",
            },
            {
                key: "user_username",
                desc: "",
            },
            {
                key: "user_email",
                desc: "",
            },
            {
                key: "user_avatar",
                desc: "",
            },
            {
                key: "project_id",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "repository",
                desc: "",
            },
            {
                key: "commits",
                desc: "",
            },
            {
                key: "total_commits_count",
                desc: "",
            },
        ]
    },
    {
        id: "TagEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "before",
                desc: ""
            },
            {
                key: "after",
                desc: ""
            },
            {
                key: "ref",
                desc: ""
            },
            {
                key: "checkout_sha",
                desc: ""
            },
            {
                key: "user_id",
                desc: ""
            },
            {
                key: "user_name",
                desc: ""
            },
            {
                key: "user_username",
                desc: ""
            },
            {
                key: "user_avatar",
                desc: ""
            },
            {
                key: "project_id",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "commits",
                desc: ""
            },
            {
                key: "total_commits_count",
                desc: ""
            },
        ]
    },
    {
        id: "WikiEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "user",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "wiki",
                desc: "",
            },
            {
                key: "object_attributes",
                desc: "",
            },
        ]
    },
];

const atomgitEventList: EventDesc[] = [
    {
        id: "BuildEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "ref",
                desc: ""
            },
            {
                key: "tag",
                desc: ""
            },
            {
                key: "before_sha",
                desc: ""
            },
            {
                key: "sha",
                desc: ""
            },
            {
                key: "build_id",
                desc: ""
            },
            {
                key: "build_name",
                desc: ""
            },
            {
                key: "build_stage",
                desc: ""
            },
            {
                key: "build_status",
                desc: ""
            },
            {
                key: "build_started_at",
                desc: ""
            },
            {
                key: "build_finished_at",
                desc: ""
            },
            {
                key: "build_duration",
                desc: ""
            },
            {
                key: "build_allow_failure",
                desc: ""
            },
            {
                key: "project_id",
                desc: ""
            },
            {
                key: "project_name",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "commit",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "runner",
                desc: ""
            }
        ]
    },
    {
        id: "CommentEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "user",
                desc: "",
            },
            {
                key: "project_id",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "repository",
                desc: "",
            },
            {
                key: "object_attributes",
                desc: "",
            },
            {
                key: "merge_request",
                desc: "",
            },
            {
                key: "commit",
                desc: "",
            },
            {
                key: "issue",
                desc: "",
            },
            {
                key: "snippet",
                desc: "",
            },
        ]
    },
    {
        id: "IssueEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "object_attributes",
                desc: ""
            },
            {
                key: "assignee",
                desc: ""
            },
            {
                key: "changes",
                desc: ""
            },
        ]
    },
    {
        id: "JobEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "ref",
                desc: ""
            },
            {
                key: "tag",
                desc: ""
            },
            {
                key: "before_sha",
                desc: ""
            },
            {
                key: "sha",
                desc: ""
            },
            {
                key: "build_id",
                desc: ""
            },
            {
                key: "build_name",
                desc: ""
            },
            {
                key: "build_stage",
                desc: ""
            },
            {
                key: "build_status",
                desc: ""
            },
            {
                key: "build_started_at",
                desc: ""
            },
            {
                key: "build_finished_at",
                desc: ""
            },
            {
                key: "build_duration",
                desc: ""
            },
            {
                key: "build_allow_failure",
                desc: ""
            },
            {
                key: "project_id",
                desc: ""
            },
            {
                key: "project_name",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "commit",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "runner",
                desc: ""
            }
        ]
    },
    {
        id: "MergeRequestEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "user",
                desc: "",
            },
            {
                key: "object_attributes",
                desc: "",
            },
            {
                key: "changes",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "repository",
                desc: "",
            },
            {
                key: "labels",
                desc: "",
            },
            {
                key: "assignees",
                desc: "",
            },
        ]
    },
    {
        id: "PipelineEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "commit",
                desc: ""
            },
            {
                key: "object_attributes",
                desc: ""
            },
            {
                key: "merge_request",
                desc: ""
            },
            {
                key: "builds",
                desc: ""
            },
        ]
    },
    {
        id: "PushEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "before",
                desc: "",
            },
            {
                key: "after",
                desc: "",
            },
            {
                key: "ref",
                desc: "",
            },
            {
                key: "checkout_sha",
                desc: "",
            },
            {
                key: "user_id",
                desc: "",
            },
            {
                key: "user_name",
                desc: "",
            },
            {
                key: "user_username",
                desc: "",
            },
            {
                key: "user_email",
                desc: "",
            },
            {
                key: "user_avatar",
                desc: "",
            },
            {
                key: "project_id",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "repository",
                desc: "",
            },
            {
                key: "commits",
                desc: "",
            },
            {
                key: "total_commits_count",
                desc: "",
            },
        ]
    },
    {
        id: "TagEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: ""
            },
            {
                key: "before",
                desc: ""
            },
            {
                key: "after",
                desc: ""
            },
            {
                key: "ref",
                desc: ""
            },
            {
                key: "checkout_sha",
                desc: ""
            },
            {
                key: "user_id",
                desc: ""
            },
            {
                key: "user_name",
                desc: ""
            },
            {
                key: "user_username",
                desc: ""
            },
            {
                key: "user_avatar",
                desc: ""
            },
            {
                key: "project_id",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "repository",
                desc: ""
            },
            {
                key: "commits",
                desc: ""
            },
            {
                key: "total_commits_count",
                desc: ""
            },
        ]
    },
    {
        id: "WikiEvent",
        name: "",
        attrList: [
            {
                key: "object_kind",
                desc: "",
            },
            {
                key: "user",
                desc: "",
            },
            {
                key: "project",
                desc: "",
            },
            {
                key: "wiki",
                desc: "",
            },
            {
                key: "object_attributes",
                desc: "",
            },
        ]
    },
];

const giteeEventList: EventDesc[] = [
    {
        id: "PushEvent",
        name: "",
        attrList: [
            {
                key: "hook_id",
                desc: ""
            },
            {
                key: "hook_url",
                desc: ""
            },
            {
                key: "hook_name",
                desc: ""
            },
            {
                key: "timestamp",
                desc: ""
            },
            {
                key: "sign",
                desc: ""
            },
            {
                key: "ref",
                desc: ""
            },
            {
                key: "before",
                desc: ""
            },
            {
                key: "after",
                desc: ""
            },
            {
                key: "total_commits_count",
                desc: ""
            },
            {
                key: "commits_more_than_ten",
                desc: ""
            },
            {
                key: "created",
                desc: ""
            },
            {
                key: "deleted",
                desc: ""
            },
            {
                key: "compare",
                desc: ""
            },
            {
                key: "commits",
                desc: ""
            },
            {
                key: "head_commit",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "user_id",
                desc: ""
            },
            {
                key: "user_name",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "pusher",
                desc: ""
            },
            {
                key: "sender",
                desc: ""
            },
            {
                key: "enterprise",
                desc: ""
            },
        ]
    },
    {
        id: "IssueEvent",
        name: "",
        attrList: [
            {
                key: "hook_id",
                desc: ""
            },
            {
                key: "hook_id",
                desc: ""
            },
            {
                key: "hook_name",
                desc: ""
            },
            {
                key: "timestamp",
                desc: ""
            },
            {
                key: "sign",
                desc: ""
            },
            {
                key: "action",
                desc: ""
            },
            {
                key: "issue",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "sender",
                desc: ""
            },
            {
                key: "target_user",
                desc: ""
            },
            {
                key: "user",
                desc: ""
            },
            {
                key: "assignee",
                desc: ""
            },
            {
                key: "updated_by",
                desc: ""
            },
            {
                key: "iid",
                desc: ""
            },
            {
                key: "title",
                desc: ""
            },
            {
                key: "description",
                desc: ""
            },
            {
                key: "state",
                desc: ""
            },
            {
                key: "milestone",
                desc: ""
            },
            {
                key: "url",
                desc: ""
            },
            {
                key: "enterprise",
                desc: ""
            },
        ]
    },
    {
        id: "PullRequestEvent",
        name: "",
        attrList: [
            {
                key: "hook_id",
                desc: ""
            },
            {
                key: "hook_url",
                desc: ""
            },
            {
                key: "hook_name",
                desc: ""
            },
            {
                key: "timestamp",
                desc: ""
            },
            {
                key: "sign",
                desc: ""
            },
            {
                key: "action",
                desc: ""
            },
            {
                key: "pull_request",
                desc: ""
            },
            {
                key: "number",
                desc: ""
            },
            {
                key: "iid",
                desc: ""
            },
            {
                key: "title",
                desc: ""
            },
            {
                key: "body",
                desc: ""
            },
            {
                key: "state",
                desc: ""
            },
            {
                key: "merge_status",
                desc: ""
            },
            {
                key: "merge_commit_sha",
                desc: ""
            },
            {
                key: "url",
                desc: ""
            },
            {
                key: "source_branch",
                desc: ""
            },
            {
                key: "source_repo",
                desc: ""
            },
            {
                key: "target_branch",
                desc: ""
            },
            {
                key: "target_repo",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "author",
                desc: ""
            },
            {
                key: "updated_by",
                desc: ""
            },
            {
                key: "sender",
                desc: ""
            },
            {
                key: "target_user",
                desc: ""
            },
            {
                key: "enterprise",
                desc: ""
            },
        ]
    },
    {
        id: "NoteEvent",
        name: "",
        attrList: [
            {
                key: "hook_id",
                desc: ""
            },
            {
                key: "hook_url",
                desc: ""
            },
            {
                key: "hook_name",
                desc: ""
            },
            {
                key: "timestamp",
                desc: ""
            },
            {
                key: "sign",
                desc: ""
            },
            {
                key: "action",
                desc: ""
            },
            {
                key: "comment",
                desc: ""
            },
            {
                key: "project",
                desc: ""
            },
            {
                key: "author",
                desc: ""
            },
            {
                key: "sender",
                desc: ""
            },
            {
                key: "url",
                desc: ""
            },
            {
                key: "note",
                desc: ""
            },
            {
                key: "noteable_type",
                desc: ""
            },
            {
                key: "noteable_id",
                desc: ""
            },
            {
                key: "issue",
                desc: ""
            },
            {
                key: "pull_request",
                desc: ""
            },
            {
                key: "title",
                desc: ""
            },
            {
                key: "per_iid",
                desc: ""
            },
            {
                key: "short_commit_id",
                desc: ""
            },
            {
                key: "enterprise",
                desc: ""
            },
        ]
    },
];

export const eventGroupList: EventGroup[] = [
    {
        id: "ProjectEvent",
        name: "项目",
        eventDescList: projectEventList,
    },
    {
        id: "ProjectDocEvent",
        name: "文档",
        eventDescList: docEventList,
    },
    {
        id: "SpritEvent",
        name: "工作计划",
        eventDescList: spritEventList,
    },
    {
        id: "TestCaseEvent",
        name: "测试用例",
        eventDescList: testCaseEventList,
    },
    {
        id: "IssueEvent",
        name: "工单",
        eventDescList: issueEventList,
    },
    {
        id: "BookShelfEvent",
        name: "项目书籍",
        eventDescList: bookShelfEventList,
    },
    {
        id: "ExtEvEvent",
        name: "外部接入",
        eventDescList: extEventList,
    },
    {
        id: "AtomgitEvent",
        name: "atomgit",
        eventDescList: atomgitEventList,
    },
    {
        id: "GiteeEvent",
        name: "gitee",
        eventDescList: giteeEventList,
    },
    {
        id: "GitlabEvent",
        name: "gitlab",
        eventDescList: gitlabEventList,
    },
    {
        id: "RobotEvent",
        name: "服务器代理",
        eventDescList: robotEventList,
    },
    {
        id: "EarthlyEvent",
        name: "CI/CD",
        eventDescList: earthlyEventList,
    },
    {
        id: "ScriptEvent",
        name: "服务端脚本",
        eventDescList: scriptEventList,
    },
    {
        id: "RequirementEvent",
        name: "项目需求",
        eventDescList: requirementEventList,
    },
    {
        id: "CodeEvent",
        name: "代码评论",
        eventDescList: codeEventList,
    },
    {
        id: "IdeaEvent",
        name: "知识点",
        eventDescList: ideaEventList,
    },
    {
        id: "DataAnnoEvent",
        name: "数据标注",
        eventDescList: dataAnnoEventList,
    },
    {
        id: "ApiCollectionEvent",
        name: "接口集合",
        eventDescList: apiCollectionEventList,
    }
];