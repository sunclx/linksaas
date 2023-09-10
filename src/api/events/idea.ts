import type { PluginEvent } from '../events';
import { LinkIdeaPageInfo } from '@/stores/linkAux';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';

import { APPRAISE_AGREE } from '../project_idea';

export type IdeaTag = {
    tag_id: string;
    tag_name: string;
  };

  export type CreateIdeaEvent = {
    idea_id: string;
    title: string;
    tag_list: IdeaTag[];
    keyword_list: string[];
  };

  function get_create_idea_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateIdeaEvent,
  ): LinkInfo[] {
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建 知识点`),
      new LinkIdeaPageInfo(inner.title, ev.project_id, "", [], inner.idea_id),
    ];
    if (inner.tag_list.length > 0) {
      retList.push(new LinkNoneInfo("标签列表"));
      inner.tag_list.forEach(tag => {
        retList.push(new LinkIdeaPageInfo(tag.tag_name, ev.project_id, tag.tag_id, []));
      })
    }
    if (inner.keyword_list.length > 0) {
      retList.push(new LinkNoneInfo("关键词列表"));
      inner.keyword_list.forEach(keyword => {
        retList.push(new LinkIdeaPageInfo(keyword, ev.project_id, "", [keyword]));
      })
    }
    return retList;
  }

  export type UpdateIdeaContentEvent = {
    idea_id: string;
    old_title: string;
    new_title: string;
  }

  function get_update_idea_content_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateIdeaContentEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新 知识点`),
      new LinkIdeaPageInfo(inner.new_title, ev.project_id, "", [], inner.idea_id),
      new LinkNoneInfo(`内容 原标题 ${inner.old_title}`),
    ];
  }

  export type UpdateIdeaTagEvent = {
    idea_id: string;
    title: string;
    old_tag_list: IdeaTag[];
    new_tag_list: IdeaTag[];
  }

  function get_update_idea_tag_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateIdeaTagEvent,
  ): LinkInfo[] {
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新 知识点`),
      new LinkIdeaPageInfo(inner.title, ev.project_id, "", [], inner.idea_id),
      new LinkNoneInfo("标签"),
    ];
    retList.push(new LinkNoneInfo("新标签"));
    inner.new_tag_list.forEach(tag => {
      retList.push(new LinkIdeaPageInfo(tag.tag_name, ev.project_id, tag.tag_id, []));
    });
    retList.push(new LinkNoneInfo("原标签"));
    inner.old_tag_list.forEach(tag => {
      retList.push(new LinkIdeaPageInfo(tag.tag_name, ev.project_id, tag.tag_id, []));
    });
    return retList;
  }

  export type UpdateIdeaKeywordEvent = {
    idea_id: string;
    title: string;
    old_keyword_list: string[];
    new_keyword_list: string[];
  }

  function get_update_idea_keyword_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateIdeaKeywordEvent,
  ): LinkInfo[] {
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新 知识点`),
      new LinkIdeaPageInfo(inner.title, ev.project_id, "", [], inner.idea_id),
      new LinkNoneInfo("关键词"),
    ];
    retList.push(new LinkNoneInfo("新关键词"));
    inner.new_keyword_list.forEach(keyword => {
      new LinkIdeaPageInfo(keyword, ev.project_id, "", [keyword]);
    });
    retList.push(new LinkNoneInfo("原关键词"));
    inner.old_keyword_list.forEach(keyword => {
      new LinkIdeaPageInfo(keyword, ev.project_id, "", [keyword]);
    });
    return retList;
  }

  export type LockIdeaEvent = {
    idea_id: string;
    title: string;
  };

  function get_lock_idea_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: LockIdeaEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 锁定 知识点`),
      new LinkIdeaPageInfo(inner.title, ev.project_id, "", [], inner.idea_id),
    ];
  }

  export type UnlockIdeaEvent = {
    idea_id: string;
    title: string;
  };

  function get_unlock_idea_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UnlockIdeaEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 解锁 知识点`),
      new LinkIdeaPageInfo(inner.title, ev.project_id, "", [], inner.idea_id),
    ];
  }

  export type RemoveIdeaEvent = {
    idea_id: string;
    title: string;
  };

  function get_remove_idea_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveIdeaEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除 知识点 ${inner.title}`)];
  }

  export type SetAppraiseEvent = {
    idea_id: string;
    title: string;
    appriase_type: number;
  }

  function get_set_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetAppraiseEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} ${inner.appriase_type == APPRAISE_AGREE ? "赞同" : "不赞同"} 知识点`),
      new LinkIdeaPageInfo(inner.title, ev.project_id, "", [], inner.idea_id),
    ];
  }

  export type CancelAppraiseEvent = {
    idea_id: string;
    title: string;
    appriase_type: number;
  }

  function get_cancel_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelAppraiseEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消标记 知识点`),
      new LinkIdeaPageInfo(inner.title, ev.project_id, "", [], inner.idea_id),
    ];
  }

  export class AllIdeaEvent {
    CreateIdeaEvent?: CreateIdeaEvent;
    UpdateIdeaContentEvent?: UpdateIdeaContentEvent;
    UpdateIdeaTagEvent?: UpdateIdeaTagEvent;
    UpdateIdeaKeywordEvent?: UpdateIdeaKeywordEvent;
    LockIdeaEvent?: LockIdeaEvent;
    UnlockIdeaEvent?: UnlockIdeaEvent;
    RemoveIdeaEvent?: RemoveIdeaEvent;
    SetAppraiseEvent?: SetAppraiseEvent;
    CancelAppraiseEvent?: CancelAppraiseEvent;
  };
  export function get_idea_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllIdeaEvent,
  ): LinkInfo[] {
    if (inner.CreateIdeaEvent !== undefined) {
      return get_create_idea_simple_content(ev, skip_prj_name, inner.CreateIdeaEvent);
    } else if (inner.UpdateIdeaContentEvent !== undefined) {
      return get_update_idea_content_simple_content(ev, skip_prj_name, inner.UpdateIdeaContentEvent);
    } else if (inner.UpdateIdeaTagEvent !== undefined) {
      return get_update_idea_tag_simple_content(ev, skip_prj_name, inner.UpdateIdeaTagEvent);
    } else if (inner.UpdateIdeaKeywordEvent !== undefined) {
      return get_update_idea_keyword_simple_content(ev, skip_prj_name, inner.UpdateIdeaKeywordEvent);
    } else if (inner.LockIdeaEvent !== undefined) {
      return get_lock_idea_simple_content(ev, skip_prj_name, inner.LockIdeaEvent);
    } else if (inner.UnlockIdeaEvent !== undefined) {
      return get_unlock_idea_simple_content(ev, skip_prj_name, inner.UnlockIdeaEvent);
    } else if (inner.RemoveIdeaEvent !== undefined) {
      return get_remove_idea_simple_content(ev, skip_prj_name, inner.RemoveIdeaEvent);
    } else if (inner.SetAppraiseEvent !== undefined) {
      return get_set_appraise_simple_content(ev, skip_prj_name, inner.SetAppraiseEvent);
    } else if (inner.CancelAppraiseEvent !== undefined) {
      return get_cancel_appraise_simple_content(ev, skip_prj_name, inner.CancelAppraiseEvent);
    } else {
      return [new LinkNoneInfo('未知事件')];
    }
  }