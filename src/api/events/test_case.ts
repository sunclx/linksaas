import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
    LinkNoneInfo,
    LinkTestCaseEntryInfo
} from '@/stores/linkAux';
import * as tc from '@/api/project_test_case';

///创建节点
export type CreateEntryEvent = {
    entry_id: string;
    entry_type: number;
    title: string;
    parent_entry_id: string;
    parent_title: string;
};

function get_create_entry_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEntryEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建 ${inner.entry_type == tc.ENTRY_TYPE_DIR ? "目录" : "测试用例"}`),
        new LinkTestCaseEntryInfo(inner.title, ev.project_id, inner.entry_id),
        new LinkNoneInfo("  父目录"),
        new LinkTestCaseEntryInfo(inner.parent_title, ev.project_id, inner.parent_entry_id),
    ];
}

///移动节点
export type MoveEntryEvent = {
    entry_id: string;
    entry_type: number;
    title: string;
    parent_entry_id: string;
    parent_title: string;
};

function get_move_entry_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: MoveEntryEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 移动 ${inner.entry_type == tc.ENTRY_TYPE_DIR ? "目录" : "测试用例"}`),
        new LinkTestCaseEntryInfo(inner.title, ev.project_id, inner.entry_id),
        new LinkNoneInfo("到"),
        new LinkTestCaseEntryInfo(inner.parent_title, ev.project_id, inner.parent_entry_id),
    ];
}

///更新节点标题
export type UpdateEntryTitleEvent = {
    entry_id: string;
    entry_type: number;
    old_title: string;
    new_title: string;
};

function get_update_entry_title_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEntryTitleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新 ${inner.entry_type == tc.ENTRY_TYPE_DIR ? "目录" : "测试用例"}`),
        new LinkTestCaseEntryInfo(inner.new_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo(` 原标题 ${inner.old_title}`),
    ];
}

///删除节点
export type RemoveEntryEvent = {
    entry_id: string;
    entry_type: number;
    title: string;
};

function get_remove_entry_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEntryEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除 ${inner.entry_type == tc.ENTRY_TYPE_DIR ? "目录" : "测试用例"} ${inner.title}`),
    ];
}

export type RuleInfo = {
    desc: string;
    pre_condition: string;
    expect_result: string;
};

///增加验证用例
export type AddRuleEvent = {
    rule_id: string;
    rule_info: RuleInfo;
    entry_id: string;
    entry_title: string;
};

function get_add_rule_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddRuleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在测试用例`),
        new LinkTestCaseEntryInfo(inner.entry_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo(`新增验证规则[描述:${inner.rule_info.desc}  前置条件:${inner.rule_info.pre_condition}  预期结果:${inner.rule_info.expect_result}]`),
    ];
}

///更新验证用例
export type UpdateRuleEvent = {
    rule_id: string;
    old_rule_info: RuleInfo;
    new_rule_info: RuleInfo;
    entry_id: string;
    entry_title: string;
};

function get_update_rule_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateRuleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在测试用例`),
        new LinkTestCaseEntryInfo(inner.entry_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo(`更新验证规则`),
        new LinkNoneInfo(`新规则[描述:${inner.new_rule_info.desc}  前置条件:${inner.new_rule_info.pre_condition}  预期结果:${inner.new_rule_info.expect_result}]`),
        new LinkNoneInfo(`旧规则[描述:${inner.old_rule_info.desc}  前置条件:${inner.old_rule_info.pre_condition}  预期结果:${inner.old_rule_info.expect_result}]`),
    ];
}

///删除验证用例
export type RemoveRuleEvent = {
    rule_id: string;
    rule_info: RuleInfo;
    entry_id: string;
    entry_title: string;
};

function get_remove_rule_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveRuleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在测试用例`),
        new LinkTestCaseEntryInfo(inner.entry_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo(`删除验证规则[描述:${inner.rule_info.desc}  前置条件:${inner.rule_info.pre_condition}  预期结果:${inner.rule_info.expect_result}]`),
    ];
}

export type MetricInfo = {
    desc: string;
    value: number;
};

///增加指标
export type AddMetricEvent = {
    metric_id: string;
    metric_info: MetricInfo;
    entry_id: string;
    entry_title: string;
};

function get_add_metric_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddMetricEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在测试用例`),
        new LinkTestCaseEntryInfo(inner.entry_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo(`新增测试指标[描述:${inner.metric_info.desc}  阈值:${inner.metric_info.value.toFixed(2)}]`),
    ];
}

///更新指标
export type UpdateMetricEvent = {
    metric_id: string;
    old_metric_info: MetricInfo;
    new_metric_info: MetricInfo;
    entry_id: string;
    entry_title: string;
};

function get_update_metric_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateMetricEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在测试用例`),
        new LinkTestCaseEntryInfo(inner.entry_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo(`更新测试指标`),
        new LinkNoneInfo(`新测试指标[描述:${inner.new_metric_info.desc}  阈值:${inner.new_metric_info.value.toFixed(2)}]`),
        new LinkNoneInfo(`旧测试指标[描述:${inner.old_metric_info.desc}  阈值:${inner.old_metric_info.value.toFixed(2)}]`),
    ];
}

///删除验证指标
export type RemoveMetricEvent = {
    metric_id: string;
    metric_info: MetricInfo;
    entry_id: string;
    entry_title: string;
};

function get_remove_metric_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveMetricEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在测试用例`),
        new LinkTestCaseEntryInfo(inner.entry_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo(`删除测试指标[描述:${inner.metric_info.desc}  阈值:${inner.metric_info.value.toFixed(2)}]`),
    ];
}

///更新测试步骤
export type UpdateContentEvent = {
    entry_id: string;
    entry_title: string;
};

function get_update_content_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateContentEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新测试用例`),
        new LinkTestCaseEntryInfo(inner.entry_title, ev.project_id, inner.entry_id),
        new LinkNoneInfo("测试方案"),
    ]
}

export type AllTestCaseEvent = {
    CreateEntryEvent?: CreateEntryEvent;
    MoveEntryEvent?: MoveEntryEvent;
    UpdateEntryTitleEvent?: UpdateEntryTitleEvent;
    RemoveEntryEvent?: RemoveEntryEvent;
    AddRuleEvent?: AddRuleEvent;
    UpdateRuleEvent?: UpdateRuleEvent;
    RemoveRuleEvent?: RemoveRuleEvent;
    AddMetricEvent?: AddMetricEvent;
    UpdateMetricEvent?: UpdateMetricEvent;
    RemoveMetricEvent?: RemoveMetricEvent;
    UpdateContentEvent?: UpdateContentEvent;
};

export function get_test_case_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllTestCaseEvent,
): LinkInfo[] {
    if (inner.CreateEntryEvent !== undefined) {
        return get_create_entry_simple_content(ev, skip_prj_name, inner.CreateEntryEvent);
    } else if (inner.MoveEntryEvent !== undefined) {
        return get_move_entry_simple_content(ev, skip_prj_name, inner.MoveEntryEvent);
    } else if (inner.UpdateEntryTitleEvent !== undefined) {
        return get_update_entry_title_simple_content(ev, skip_prj_name, inner.UpdateEntryTitleEvent);
    } else if (inner.RemoveEntryEvent !== undefined) {
        return get_remove_entry_simple_content(ev, skip_prj_name, inner.RemoveEntryEvent);
    } else if (inner.AddRuleEvent !== undefined) {
        return get_add_rule_simple_content(ev, skip_prj_name, inner.AddRuleEvent);
    } else if (inner.UpdateRuleEvent !== undefined) {
        return get_update_rule_simple_content(ev, skip_prj_name, inner.UpdateRuleEvent);
    } else if (inner.RemoveRuleEvent !== undefined) {
        return get_remove_rule_simple_content(ev, skip_prj_name, inner.RemoveRuleEvent);
    } else if (inner.AddMetricEvent !== undefined) {
        return get_add_metric_simple_content(ev, skip_prj_name, inner.AddMetricEvent);
    } else if (inner.UpdateMetricEvent !== undefined) {
        return get_update_metric_simple_content(ev, skip_prj_name, inner.UpdateMetricEvent);
    } else if (inner.RemoveMetricEvent !== undefined) {
        return get_remove_metric_simple_content(ev, skip_prj_name, inner.RemoveMetricEvent);
    } else if (inner.UpdateContentEvent !== undefined) {
        return get_update_content_simple_content(ev, skip_prj_name, inner.UpdateContentEvent);
    }
    return [new LinkNoneInfo('未知事件')];
}