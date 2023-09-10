import type { PluginEvent } from '../events';
import {  LinkRequirementInfo } from '@/stores/linkAux';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo,
  LinkTaskInfo,
} from '@/stores/linkAux';

export type CreateRequirementEvent = {
    requirement_id: string;
    title: string;
  };

  function get_create_req_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateRequirementEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建需求 `),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
    ];
  }

  export type UpdateRequirementEvent = {
    requirement_id: string;
    old_title: string;
    new_title: string;
  };

  function get_update_req_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateRequirementEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改需求`),
      new LinkRequirementInfo(inner.new_title, ev.project_id, inner.requirement_id),
      new LinkNoneInfo(`(原标题 ${inner.old_title})`),
    ];
  }

  export type TagInfo = {
    tag_id: string;
    tag_name: string;
  };

  export type UpdateTagEvent = {
    requirement_id: string;
    title: string;
    old_tag_list: TagInfo[];
    new_tag_list: TagInfo[];
  };

  function get_update_tag_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateTagEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改需求`),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
      new LinkNoneInfo(`新标签 ${inner.new_tag_list.map(tag => tag.tag_name).join(",")} 旧标签 ${inner.old_tag_list.map(tag => tag.tag_name).join(",")}`),
    ];
  }

  export type RemoveRequirementEvent = {
    requirement_id: string;
    title: string;
  };

  function get_remove_req_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveRequirementEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除需求 ${inner.title}`)];
  }

  export type LinkIssueEvent = {
    requirement_id: string;
    title: string;
    issue_id: string;
    issue_title: string;
  };

  function get_link_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: LinkIssueEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联 需求`),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
      new LinkNoneInfo("到任务"),
      new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id),
    ];
  }

  export type UnlinkIssueEvent = {
    requirement_id: string;
    title: string;
    issue_id: string;
    issue_title: string;
  };

  function get_unlink_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UnlinkIssueEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消 需求`),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
      new LinkNoneInfo("和任务"),
      new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id),
      new LinkNoneInfo("的关联"),
    ];
  }

  export type CloseRequirementEvent = {
    requirement_id: string;
    title: string;
  };

  function get_close_req_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CloseRequirementEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关闭 需求`),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
    ];
  }

  export type OpenRequirementEvent = {
    requirement_id: string;
    title: string;
  };

  function get_open_req_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: OpenRequirementEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 打开 需求`),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
    ];
  }

  export type SetKanoInfoEvent = {
    requirement_id: string;
    title: string;
  };

  function get_set_kano_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetKanoInfoEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改 需求`),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
      new LinkNoneInfo("kano 分析数值"),
    ];
  }

  export type SetFourQInfoEvent = {
    requirement_id: string;
    title: string;
  };

  function get_set_four_q_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetFourQInfoEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改 需求`),
      new LinkRequirementInfo(inner.title, ev.project_id, inner.requirement_id),
      new LinkNoneInfo("四象限分析数值"),
    ];
  }

  export class AllRequirementEvent {
    CreateRequirementEvent?: CreateRequirementEvent;
    UpdateRequirementEvent?: UpdateRequirementEvent;
    UpdateTagEvent?: UpdateTagEvent;
    RemoveRequirementEvent?: RemoveRequirementEvent;
    LinkIssueEvent?: LinkIssueEvent;
    UnlinkIssueEvent?: UnlinkIssueEvent;
    CloseRequirementEvent?: CloseRequirementEvent;
    OpenRequirementEvent?: OpenRequirementEvent;
    SetKanoInfoEvent?: SetKanoInfoEvent;
    SetFourQInfoEvent?: SetFourQInfoEvent;
  }
  export function get_requirement_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllRequirementEvent,
  ): LinkInfo[] {
    if (inner.CreateRequirementEvent !== undefined) {
      return get_create_req_simple_content(ev, skip_prj_name, inner.CreateRequirementEvent);
    } else if (inner.UpdateRequirementEvent !== undefined) {
      return get_update_req_simple_content(ev, skip_prj_name, inner.UpdateRequirementEvent);
    } else if (inner.UpdateTagEvent !== undefined) {
      return get_update_tag_simple_content(ev, skip_prj_name, inner.UpdateTagEvent);
    } else if (inner.RemoveRequirementEvent !== undefined) {
      return get_remove_req_simple_content(ev, skip_prj_name, inner.RemoveRequirementEvent);
    } else if (inner.LinkIssueEvent !== undefined) {
      return get_link_issue_simple_content(ev, skip_prj_name, inner.LinkIssueEvent);
    } else if (inner.UnlinkIssueEvent !== undefined) {
      return get_unlink_issue_simple_content(ev, skip_prj_name, inner.UnlinkIssueEvent);
    } else if (inner.CloseRequirementEvent !== undefined) {
      return get_close_req_simple_content(ev, skip_prj_name, inner.CloseRequirementEvent);
    } else if (inner.OpenRequirementEvent !== undefined) {
      return get_open_req_simple_content(ev, skip_prj_name, inner.OpenRequirementEvent);
    } else if (inner.SetKanoInfoEvent !== undefined) {
      return get_set_kano_simple_content(ev, skip_prj_name, inner.SetKanoInfoEvent);
    } else if (inner.SetFourQInfoEvent !== undefined) {
      return get_set_four_q_simple_content(ev, skip_prj_name, inner.SetFourQInfoEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }