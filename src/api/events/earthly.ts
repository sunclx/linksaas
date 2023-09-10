import type { PluginEvent } from '../events';
import { LinkEarthlyActionInfo, LinkEarthlyExecInfo } from '@/stores/linkAux';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo  
} from '@/stores/linkAux';

export type AddRepoEvent = {
    repo_id: string;
    repo_url: string;
  };

  function get_add_repo_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddRepoEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 添加仓库 ${inner.repo_url}`)];
  }

  export type RemoveRepoEvent = {
    repo_id: string;
    repo_url: string;
  };

  function get_remove_repo_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveRepoEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除仓库 ${inner.repo_url}`)];
  }

  export type CreateActionEvent = {
    repo_id: string;
    repo_url: string;
    action_id: string;
    action_name: string;
  };  

  function get_create_action_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateActionEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在仓库 ${inner.repo_url} 创建命令 ${inner.action_name}`)];
  }

  export type UpdateActionEvent = {
    repo_id: string;
    repo_url: string;
    action_id: string;
    action_name: string;
  };

  function get_update_action_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateActionEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在仓库 ${inner.repo_url} 更新命令 ${inner.action_name}`)];
  }

  export type RemoveActionEvent = {
    repo_id: string;
    repo_url: string;
    action_id: string;
    action_name: string;
  };

  function get_remove_action_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveActionEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 从仓库 ${inner.repo_url} 删除命令 ${inner.action_name}`)];
  }

  export type Param = {
    name: string;
    value: string;
  }

  export type ExecEvent = {
    exec_id: string;
    repo_id: string;
    repo_url: string;
    action_id: string;
    action_name: string;
    branch: string;
    param_list: Param[];
  };

  function get_exec_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ExecEvent,
  ): LinkInfo[] {
    let paramStr = "";
    if (inner.param_list.length > 0) {
      paramStr = `执行参数: ${inner.param_list.map(item => item.name + "=" + item.value).join(" ,")}`;
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 从仓库 ${inner.repo_url} 执行命令`),
      new LinkEarthlyActionInfo(inner.action_name, ev.project_id, inner.repo_id, inner.action_id),
      new LinkEarthlyExecInfo("执行结果", ev.project_id, inner.repo_id, inner.action_id, inner.exec_id),
      new LinkNoneInfo(`${paramStr}`),
    ];
  }

  export class AllEarthlyEvent {
    AddRepoEvent?: AddRepoEvent;
    RemoveRepoEvent?: RemoveRepoEvent;
    CreateActionEvent?: CreateActionEvent;
    UpdateActionEvent?: UpdateActionEvent;
    RemoveActionEvent?: RemoveActionEvent;
    ExecEvent?: ExecEvent;
  };

  export function get_earthly_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllEarthlyEvent,
  ): LinkInfo[] {
    if (inner.AddRepoEvent !== undefined) {
      return get_add_repo_simple_content(ev, skip_prj_name, inner.AddRepoEvent);
    } else if (inner.RemoveRepoEvent !== undefined) {
      return get_remove_repo_simple_content(ev, skip_prj_name, inner.RemoveRepoEvent);
    } else if (inner.CreateActionEvent !== undefined) {
      return get_create_action_simple_content(ev, skip_prj_name, inner.CreateActionEvent);
    } else if (inner.UpdateActionEvent !== undefined) {
      return get_update_action_simple_content(ev, skip_prj_name, inner.UpdateActionEvent);
    } else if (inner.RemoveActionEvent !== undefined) {
      return get_remove_action_simple_content(ev, skip_prj_name, inner.RemoveActionEvent);
    } else if (inner.ExecEvent !== undefined) {
      return get_exec_simple_content(ev, skip_prj_name, inner.ExecEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }