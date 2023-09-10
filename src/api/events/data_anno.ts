import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';


export type CreateAnnoProjectEvent = {
    anno_project_id: string;
    anno_project_name: string;
  };

  function get_create_anno_project_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateAnnoProjectEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建标注项目 ${inner.anno_project_name}`),
    ];
  }

  export type RemoveAnnoProjectEvent = {
    anno_project_id: string;
    anno_project_name: string;
  };

  function get_remove_anno_project_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveAnnoProjectEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除标注项目 ${inner.anno_project_name}`),
    ];
  }

  export type AddAnnoMemberEvent = {
    anno_project_id: string;
    anno_project_name: string;
    member_user_id: string;
    member_display_name: string;
  };

  function get_add_anno_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddAnnoMemberEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在标注项目 ${inner.anno_project_name} 中添加成员 ${inner.member_display_name}`),
    ];
  }

  export type RemoveAnnoMemberEvent = {
    anno_project_id: string;
    anno_project_name: string;
    member_user_id: string;
    member_display_name: string;
  };

  function get_remove_anno_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveAnnoMemberEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 从标注项目 ${inner.anno_project_name} 中删除成员 ${inner.member_display_name}`),
    ];
  }

  export class AllDataAnnoEvent {
    CreateAnnoProjectEvent?: CreateAnnoProjectEvent;
    RemoveAnnoProjectEvent?: RemoveAnnoProjectEvent;
    AddAnnoMemberEvent?: AddAnnoMemberEvent;
    RemoveAnnoMemberEvent?: RemoveAnnoMemberEvent;
  }

  export function get_data_anno_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllDataAnnoEvent,
  ): LinkInfo[] {
    if (inner.CreateAnnoProjectEvent !== undefined) {
      return get_create_anno_project_simple_content(ev, skip_prj_name, inner.CreateAnnoProjectEvent);
    } else if (inner.RemoveAnnoProjectEvent !== undefined) {
      return get_remove_anno_project_simple_content(ev, skip_prj_name, inner.RemoveAnnoProjectEvent);
    } else if (inner.AddAnnoMemberEvent !== undefined) {
      return get_add_anno_member_simple_content(ev, skip_prj_name, inner.AddAnnoMemberEvent);
    } else if (inner.RemoveAnnoMemberEvent !== undefined) {
      return get_remove_anno_member_simple_content(ev, skip_prj_name, inner.RemoveAnnoMemberEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }