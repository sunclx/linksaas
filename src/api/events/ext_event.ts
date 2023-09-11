import type { PluginEvent } from '../events';
import * as ex from '../external_events';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo
} from '@/stores/linkAux';

function get_event_source_str(event_source: number): string {
    let event_source_str = '';
    switch (event_source) {
      case ex.EVENT_SOURCE_GITLAB:
        event_source_str = 'gitlab';
        break;
      case ex.EVENT_SOURCE_GITHUB:
        event_source_str = 'github';
        break;
      case ex.EVENT_SOURCE_GITEA:
        event_source_str = 'gitea';
        break;
      case ex.EVENT_SOURCE_GITEE:
        event_source_str = 'gitee';
        break;
      case ex.EVENT_SOURCE_GOGS:
        event_source_str = 'gogs';
        break;
      case ex.EVENT_SOURCE_JIRA:
        event_source_str = 'jira';
        break;
      case ex.EVENT_SOURCE_CONFLUENCE:
        event_source_str = 'confluence';
        break;
      case ex.EVENT_SOURCE_JENKINS:
        event_source_str = 'jenkins';
        break;
    }
    return event_source_str;
  }

  function get_user_policy_str(user_policy: number): string {
    let user_policy_str = '';
    switch (user_policy) {
      case ex.SOURCE_USER_POLICY_NONE:
        user_policy_str = '未设置策略';
        break;
      case ex.SOURCE_USER_POLICY_DISCARD:
        user_policy_str = '丢弃';
        break;
      case ex.SOURCE_USER_POLICY_MAPPING:
        user_policy_str = '关联成员';
        break;
      case ex.SOURCE_USER_POLICY_SKIP_MAPPING:
        user_policy_str = '不记名';
        break;
    }
    return user_policy_str;
  }
  export type CreateEvent = {
    event_source_id: string;
    event_source: number;
    title: string;
  };
  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
  ): LinkInfo[] {
    const event_source_str = get_event_source_str(inner.event_source);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建第三方接入 ${event_source_str} ${inner.title}`),
    ];
  }
  export type UpdateEvent = {
    event_source_id: string;
    event_source: number;
    old_title: string;
    new_title: string;
  };
  function get_update_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEvent,
  ): LinkInfo[] {
    const event_source_str = get_event_source_str(inner.event_source);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新第三方接入 ${event_source_str} ${inner.old_title}`),
    ];
    if (inner.new_title != inner.old_title) {
      ret_list.push(new LinkNoneInfo(` 新标题 ${inner.new_title}`));
    }
    return ret_list;
  }
  export type GetSecretEvent = {
    event_source_id: string;
    event_source: number;
    title: string;
  };
  function get_secret_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: GetSecretEvent,
  ): LinkInfo[] {
    const event_source_str = get_event_source_str(inner.event_source);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 获取 ${event_source_str} ${inner.title} 密钥`),
    ];
  }
  export type RemoveEvent = {
    event_source_id: string;
    event_source: number;
    title: string;
  };
  function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEvent,
  ): LinkInfo[] {
    const event_source_str = get_event_source_str(inner.event_source);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除第三方接入 ${event_source_str} ${inner.title}`),
    ];
  }
  export type SetSourceUserPolicyEvent = {
    event_source_id: string;
    event_source: number;
    title: string;
    source_user_name: string;
    source_display_name: string;
    user_policy: number;
    map_user_id: string;
    map_user_display_name: string;
  };
  function get_set_policy_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetSourceUserPolicyEvent,
  ): LinkInfo[] {
    const event_source_str = get_event_source_str(inner.event_source);
    const user_policy_str = get_user_policy_str(inner.user_policy);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name
        } 设置第三方接入用户策略 ${event_source_str} ${inner.title}`),
      new LinkNoneInfo(` 第三方用户${inner.source_display_name},策略设置为${user_policy_str}`),
    ];
    if (inner.map_user_id != '' && inner.map_user_display_name != '') {
      ret_list.push(new LinkNoneInfo(` ${inner.map_user_display_name}`));
    }
    return ret_list;
  }

  export class AllExtEvEvent {
    CreateEvent?: CreateEvent;
    UpdateEvent?: UpdateEvent;
    GetSecretEvent?: GetSecretEvent;
    RemoveEvent?: RemoveEvent;
    SetSourceUserPolicyEvent?: SetSourceUserPolicyEvent;
  }
  export function get_ext_event_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllExtEvEvent,
  ): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
      return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.UpdateEvent !== undefined) {
      return get_update_simple_content(ev, skip_prj_name, inner.UpdateEvent);
    } else if (inner.GetSecretEvent !== undefined) {
      return get_secret_simple_content(ev, skip_prj_name, inner.GetSecretEvent);
    } else if (inner.RemoveEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name, inner.RemoveEvent);
    } else if (inner.SetSourceUserPolicyEvent !== undefined) {
      return get_set_policy_simple_content(ev, skip_prj_name, inner.SetSourceUserPolicyEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }