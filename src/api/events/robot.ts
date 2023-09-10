import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo
} from '@/stores/linkAux';

export type CreateEvent = {
    robot_id: string;
    robot_name: string;
  };

  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建服务器代理 ${inner.robot_name}`)];
  }

  export type UpdateEvent = {
    robot_id: string;
    old_robot_name: string;
    new_robotname: string;
  };

  function get_update_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新服务器代理 ${inner.old_robot_name}`)];
  }

  export type RemoveEvent = {
    robot_id: string;
    robot_name: string;
  };

  function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除服务器代理 ${inner.robot_name}`)];
  }

  export type AddAccessUserEvent = {
    robot_id: string;
    robot_name: string;
    member_user_id: string;
    member_display_name: string;
  };

  function get_add_access_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddAccessUserEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在服务器代理 ${inner.robot_name} 增加用户 ${inner.member_display_name} 访问权限`)];
  }

  export type RemoveAccessUserEvent = {
    robot_id: string;
    robot_name: string;
    member_user_id: string;
    member_display_name: string;
  };

  function get_remove_access_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveAccessUserEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在服务器代理 ${inner.robot_name} 移除用户 ${inner.member_display_name} 访问权限`)];
  }

  export type RenewTokenEvent = {
    robot_id: string;
    robot_name: string;
  };

  function get_renew_token_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RenewTokenEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新服务器代理 ${inner.robot_name} 访问令牌`)];
  }

  export class AllRobotEvent {
    CreateEvent?: CreateEvent;
    UpdateEvent?: UpdateEvent;
    RemoveEvent?: RemoveEvent;
    AddAccessUserEvent?: AddAccessUserEvent;
    RemoveAccessUserEvent?: RemoveAccessUserEvent;
    RenewTokenEvent?: RenewTokenEvent;
  };

  export function get_robot_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllRobotEvent,
  ): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
      return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.UpdateEvent !== undefined) {
      return get_update_simple_content(ev, skip_prj_name, inner.UpdateEvent);
    } else if (inner.RemoveEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name, inner.RemoveEvent);
    } else if (inner.AddAccessUserEvent !== undefined) {
      return get_add_access_simple_content(ev, skip_prj_name, inner.AddAccessUserEvent);
    } else if (inner.RemoveAccessUserEvent !== undefined) {
      return get_remove_access_simple_content(ev, skip_prj_name, inner.RemoveAccessUserEvent);
    } else if (inner.RenewTokenEvent !== undefined) {
      return get_renew_token_simple_content(ev, skip_prj_name, inner.RenewTokenEvent);

    }
    return [new LinkNoneInfo('未知事件')];
  }