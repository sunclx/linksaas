/* eslint-disable @typescript-eslint/no-namespace */
import type { PluginEvent } from './events';
import * as pi from './project_issue';
import * as ex from './external_events';
import * as es from './events_subscribe';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo, LinkProjectInfo, LinkChannelInfo,
  LinkImageInfo, LinkExterneInfo, LinkAppraiseInfo,
  LinkSpritInfo, LinkTaskInfo, LinkBugInfo, LinkDocInfo,
  LinkAppInfo, LinkTestCaseEntryInfo
} from '@/stores/linkAux'
import * as tc from '@/api/project_test_case';

import moment from 'moment';


export function get_issue_type_str(issue_type: number): string {
  if (issue_type == pi.ISSUE_TYPE_BUG) {
    return '缺陷';
  } else if (issue_type == pi.ISSUE_TYPE_TASK) {
    return '任务';
  } else {
    return '';
  }
}

function get_issue_state_str(issue_state: number): string {
  let state_str = '';
  switch (issue_state) {
    case pi.ISSUE_STATE_PLAN:
      state_str = '规划中';
      break;
    case pi.ISSUE_STATE_PROCESS:
      state_str = '处理中';
      break;
    case pi.ISSUE_STATE_CHECK:
      state_str = '检查中';
      break;
    case pi.ISSUE_STATE_CLOSE:
      state_str = '关闭';
      break;
    default:
      break;
  }
  return state_str;
}

export namespace project {
  function get_chat_bot_type_str(chat_bot_type: number): string {
    if (chat_bot_type == es.CHAT_BOT_QYWX) {
      return "企业微信";
    } else if (chat_bot_type == es.CHAT_BOT_DING) {
      return "钉钉";
    } else if (chat_bot_type == es.CHAT_BOT_FS) {
      return "飞书";
    }
    return "";
  }

  /*
   *  项目相关的事件定义
   */
  export type CreateProjectEvent = {};
  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: CreateProjectEvent,
  ): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('创建项目')];
    if (!skip_prj_name) {
      ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
  }
  export type UpdateProjectEvent = {
    new_project_name: string;
  };
  function get_update_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateProjectEvent,
  ): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('修改项目')];
    if (!skip_prj_name) {
      ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    if (inner.new_project_name != ev.project_name) {
      ret_list.push(
        new LinkNoneInfo(`新项目名 ${inner.new_project_name}`)
      );
    }
    return ret_list;
  }
  export type OpenProjectEvent = {};
  function get_open_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: OpenProjectEvent,
  ): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('激活项目')];
    if (!skip_prj_name) {
      ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
  }

  export type CloseProjectEvent = {};
  function get_close_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: CloseProjectEvent,
  ): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('关闭项目')];
    if (!skip_prj_name) {
      ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
  }

  export type RemoveProjectEvent = {};
  function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: RemoveProjectEvent,
  ): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('删除项目')];
    if (!skip_prj_name) {
      ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
  }

  export type GenInviteEvent = {};
  function get_gen_invite_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: GenInviteEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 发送加入项目邀请`),
    ];
    return ret_list;
  }
  export type JoinProjectEvent = {};
  function get_join_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: JoinProjectEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 加入项目`),
    ];
    return ret_list;
  }
  export type LeaveProjectEvent = {};
  function get_leave_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    // inner: LeaveProjectEvent,
  ): LinkInfo[] {
    const ret_list: LinkInfo[] = [new LinkNoneInfo('离开项目')];
    if (!skip_prj_name) {
      ret_list.push(new LinkProjectInfo(ev.project_name, ev.project_id));
    }
    return ret_list;
  }
  export type CreateRoleEvent = {
    role_id: string;
    role_name: string;
  };
  function get_create_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateRoleEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建项目角色`),
      new LinkNoneInfo(` ${inner.role_name}`),
    ];
  }
  export type UpdateRoleEvent = {
    role_id: string;
    old_role_name: string;
    new_role_name: string;
  };
  function get_update_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateRoleEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目角色`),
      new LinkNoneInfo(` ${inner.old_role_name}`)
    ];
    if (inner.old_role_name != inner.new_role_name) {
      ret_list.push(new LinkNoneInfo(`新角色 ${inner.new_role_name}`));
    }
    return ret_list;
  }
  export type RemoveRoleEvent = {
    role_id: string;
    role_name: string;
  };
  function get_remove_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveRoleEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除项目角色`),
      new LinkNoneInfo(` ${inner.role_name}`),
    ];
  }

  export type UpdateProjectMemberEvent = {
    member_user_id: string;
    old_member_display_name: string;
    new_member_display_name: string;
  };
  function get_update_prj_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateProjectMemberEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目成员`),
      new LinkNoneInfo(`${inner.old_member_display_name}`),
    ];
    if (inner.old_member_display_name != inner.new_member_display_name) {
      ret_list.push(new LinkNoneInfo(`新名称 ${inner.new_member_display_name}`));
    }
    return ret_list;
  }
  export type RemoveProjectMemberEvent = {
    member_user_id: string;
    member_display_name: string;
  };
  function get_remove_prj_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveProjectMemberEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除项目成员 ${inner.member_display_name}`)
    ];
  }
  export type SetProjectMemberRoleEvent = {
    role_id: string;
    role_name: string;
    member_user_id: string;
    member_display_name: string;
  };
  function get_set_role_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetProjectMemberRoleEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目成员角色`),
      new LinkNoneInfo(` ${inner.member_display_name}`),
      new LinkNoneInfo(` ${inner.role_name}`),
    ];
  }

  export type CreateChannelEvent = {
    channel_id: string;
    channel_name: string;
    pub_channel: boolean;
    channel_type: number;
  };
  function get_create_chan_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateChannelEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建项目频道 ${inner.pub_channel ? '公开频道' : '私有频道'}`),
      new LinkChannelInfo(inner.channel_name, ev.project_id, inner.channel_id),
    ];
  }

  export type UpdateChannelEvent = {
    channel_id: string;
    old_channel_name: string;
    old_pub_channel: boolean;
    new_channel_name: string;
    new_pub_channel: boolean;
  };
  function get_update_chan_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateChannelEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新项目频道 ${inner.old_pub_channel ? '公开频道' : '私有频道'}`),
      new LinkChannelInfo(inner.old_channel_name, ev.project_id, inner.channel_id),
    ];
    if (inner.old_channel_name != inner.new_channel_name) {
      ret_list.push(new LinkNoneInfo(`新频道名称 ${inner.new_channel_name}`));
    }
    if (inner.old_pub_channel != inner.new_pub_channel) {
      ret_list.push(new LinkNoneInfo(`新的可见级别 ${inner.new_pub_channel ? '公开频道' : '私有频道'}`));
    }
    return ret_list;
  }

  export type OpenChannelEvent = {
    channel_id: string;
    channel_name: string;
  };
  function get_open_chan_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: OpenChannelEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 激活项目频道`),
      new LinkChannelInfo(inner.channel_name, ev.project_id, inner.channel_id),
    ];
  }

  export type CloseChannelEvent = {
    channel_id: string;
    channel_name: string;
  };
  function get_close_chan_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CloseChannelEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关闭项目频道`),
      new LinkChannelInfo(inner.channel_name, ev.project_id, inner.channel_id),
    ];
  }

  export type RemoveChannelEvent = {
    channel_id: string;
    channel_name: string;
  };
  function get_remove_chan_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveChannelEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除项目频道`),
      new LinkChannelInfo(inner.channel_name, ev.project_id, inner.channel_id),
    ];
  }

  export type AddChannelMemberEvent = {
    channel_id: string;
    channel_name: string;
    member_user_id: string;
    member_display_name: string;
  };
  function get_add_chan_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddChannelMemberEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在频道`),
      new LinkChannelInfo(inner.channel_name, ev.project_id, inner.channel_id),
      new LinkNoneInfo(`新增成员${inner.member_display_name}`),
    ];
  }
  export type RemoveChannelMemberEvent = {
    channel_id: string;
    channel_name: string;
    member_user_id: string;
    member_display_name: string;
  };
  function get_remove_chan_member_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveChannelMemberEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在频道`),
      new LinkChannelInfo(inner.channel_name, ev.project_id, inner.channel_id),
      new LinkNoneInfo(`移除成员${inner.member_display_name}`),
    ];
  }

  export type UploadWorkSnapShotEvent = {
    fs_id: string;
    file_id: string;
    thumb_file_id: string;
  };
  function get_upload_work_snap_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UploadWorkSnapShotEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 上传工作快照`),
      new LinkImageInfo('图片', `fs://localhost/${inner.fs_id}/${inner.file_id}/snap.png`, `fs://localhost/${inner.fs_id}/${inner.thumb_file_id}/snap.png`),
    ];
  }

  export type CreateAppraiseEvent = {
    appraise_id: string;
    title: string;
  };

  function get_create_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateAppraiseEvent
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建评估`),
      new LinkAppraiseInfo(inner.title, ev.project_id, inner.appraise_id),
    ];
  }

  export type UpdateAppraiseEvent = {
    appraise_id: string;
    old_title: string;
    new_title: string;
  };

  function get_update_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateAppraiseEvent
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新评估`),
      new LinkAppraiseInfo(inner.new_title, ev.project_id, inner.appraise_id),
    ];
    if (inner.old_title != inner.new_title) {
      ret_list.push(new LinkNoneInfo(`旧标题 ${inner.old_title}`));
    }
    return ret_list;
  }

  export type RemoveAppraiseEvent = {
    appraise_id: string;
    title: string;
  };

  function get_remove_appraise_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveAppraiseEvent
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除评估 ${inner.title}`),
    ];
  }

  export type AddProjectAppEvent = {
    app_id: string;
    app_name: string;
    app_url: string;
    app_open_type: number;
  };

  function get_add_project_app_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddProjectAppEvent
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 添加应用`),
      new LinkAppInfo(inner.app_name, ev.project_id, inner.app_id, inner.app_url, inner.app_open_type),
    ];
  }

  export type RemoveProjectAppEvent = {
    app_id: string;
    app_name: string;
  }

  function get_remove_project_app_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveProjectAppEvent
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除应用`),
      new LinkNoneInfo(`${inner.app_name}`),
    ];
  }

  export type CreateGoalEvent = {
    goal_id: string;
  };

  function get_create_goal_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateGoalEvent
  ): LinkInfo[] {
    console.log(inner);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建了新目标`),
    ];
  }

  export type UpdateGoalEvent = {
    goal_id: string;
  };

  function get_update_goal_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateGoalEvent
  ): LinkInfo[] {
    console.log(inner);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新了目标`),
    ];
  }

  export type ChangeOwnerEvent = {
    member_user_id: string;
    member_display_name: string;
  };

  function get_change_owner_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ChangeOwnerEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 转移超级管理员给 ${inner.member_display_name}`)];
  }

  export type CreateEventSubscribeEvent = {
    subscribe_id: string;
    chat_bot_type: number;
    chat_bot_name: string;
  }

  function get_create_subscribe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEventSubscribeEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建事件订阅 ${get_chat_bot_type_str(inner.chat_bot_type)} ${inner.chat_bot_name}`)];
  }

  export type UpdateEventSubscribeEvent = {
    subscribe_id: string;
    chat_bot_type: number;
    old_chat_bot_name: string;
    new_chat_bot_name: string;
  };

  function get_update_subscribe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEventSubscribeEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新事件订阅 ${get_chat_bot_type_str(inner.chat_bot_type)} ${inner.new_chat_bot_name} 原标题 ${inner.old_chat_bot_name}`)];
  }

  export type RemoveEventSubscribeEvent = {
    subscribe_id: string;
    chat_bot_type: number;
    chat_bot_name: string;
  };

  function get_remove_subscribe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEventSubscribeEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除事件订阅 ${get_chat_bot_type_str(inner.chat_bot_type)} ${inner.chat_bot_name}`)];
  }

  export type AllProjectEvent = {
    CreateProjectEvent?: CreateProjectEvent;
    UpdateProjectEvent?: UpdateProjectEvent;
    OpenProjectEvent?: OpenProjectEvent;
    CloseProjectEvent?: CloseProjectEvent;
    RemoveProjectEvent?: RemoveProjectEvent;
    GenInviteEvent?: GenInviteEvent;
    JoinProjectEvent?: JoinProjectEvent;
    LeaveProjectEvent?: LeaveProjectEvent;
    CreateRoleEvent?: CreateRoleEvent;
    UpdateRoleEvent?: UpdateRoleEvent;
    RemoveRoleEvent?: RemoveRoleEvent;
    UpdateProjectMemberEvent?: UpdateProjectMemberEvent;
    RemoveProjectMemberEvent?: RemoveProjectMemberEvent;
    SetProjectMemberRoleEvent?: SetProjectMemberRoleEvent;
    CreateChannelEvent?: CreateChannelEvent;
    UpdateChannelEvent?: UpdateChannelEvent;
    OpenChannelEvent?: OpenChannelEvent;
    CloseChannelEvent?: CloseChannelEvent;
    RemoveChannelEvent?: RemoveChannelEvent;
    AddChannelMemberEvent?: AddChannelMemberEvent;
    RemoveChannelMemberEvent?: RemoveChannelMemberEvent;
    UploadWorkSnapShotEvent?: UploadWorkSnapShotEvent;
    CreateAppraiseEvent?: CreateAppraiseEvent;
    UpdateAppraiseEvent?: UpdateAppraiseEvent;
    RemoveAppraiseEvent?: RemoveAppraiseEvent;
    AddProjectAppEvent?: AddProjectAppEvent;
    RemoveProjectAppEvent?: RemoveProjectAppEvent;
    CreateGoalEvent?: CreateGoalEvent;
    UpdateGoalEvent?: UpdateGoalEvent;
    ChangeOwnerEvent?: ChangeOwnerEvent;
    CreateEventSubscribeEvent?: CreateEventSubscribeEvent;
    UpdateEventSubscribeEvent?: UpdateEventSubscribeEvent;
    RemoveEventSubscribeEvent?: RemoveEventSubscribeEvent;
  };
  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllProjectEvent,
  ): LinkInfo[] {
    if (inner.CreateProjectEvent !== undefined) {
      return get_create_simple_content(ev, skip_prj_name);
    } else if (inner.RemoveProjectEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name);
    } else if (inner.UpdateProjectEvent !== undefined) {
      return get_update_simple_content(ev, skip_prj_name, inner.UpdateProjectEvent);
    } else if (inner.OpenProjectEvent !== undefined) {
      return get_open_simple_content(ev, skip_prj_name);
    } else if (inner.CloseProjectEvent !== undefined) {
      return get_close_simple_content(ev, skip_prj_name);
    } else if (inner.GenInviteEvent !== undefined) {
      return get_gen_invite_simple_content(ev, skip_prj_name);
    } else if (inner.JoinProjectEvent !== undefined) {
      return get_join_simple_content(ev, skip_prj_name);
    } else if (inner.LeaveProjectEvent !== undefined) {
      return get_leave_simple_content(ev, skip_prj_name);
    } else if (inner.CreateRoleEvent !== undefined) {
      return get_create_role_simple_content(ev, skip_prj_name, inner.CreateRoleEvent);
    } else if (inner.UpdateRoleEvent !== undefined) {
      return get_update_role_simple_content(ev, skip_prj_name, inner.UpdateRoleEvent);
    } else if (inner.RemoveRoleEvent !== undefined) {
      return get_remove_role_simple_content(ev, skip_prj_name, inner.RemoveRoleEvent);
    } else if (inner.UpdateProjectMemberEvent !== undefined) {
      return get_update_prj_member_simple_content(
        ev,
        skip_prj_name,
        inner.UpdateProjectMemberEvent,
      );
    } else if (inner.RemoveProjectMemberEvent !== undefined) {
      return get_remove_prj_member_simple_content(
        ev,
        skip_prj_name,
        inner.RemoveProjectMemberEvent,
      );
    } else if (inner.SetProjectMemberRoleEvent !== undefined) {
      return get_set_role_simple_content(ev, skip_prj_name, inner.SetProjectMemberRoleEvent);
    } else if (inner.CreateChannelEvent !== undefined) {
      return get_create_chan_simple_content(ev, skip_prj_name, inner.CreateChannelEvent);
    } else if (inner.UpdateChannelEvent !== undefined) {
      return get_update_chan_simple_content(ev, skip_prj_name, inner.UpdateChannelEvent);
    } else if (inner.OpenChannelEvent !== undefined) {
      return get_open_chan_simple_content(ev, skip_prj_name, inner.OpenChannelEvent);
    } else if (inner.CloseChannelEvent !== undefined) {
      return get_close_chan_simple_content(ev, skip_prj_name, inner.CloseChannelEvent);
    } else if (inner.RemoveChannelEvent !== undefined) {
      return get_remove_chan_simple_content(ev, skip_prj_name, inner.RemoveChannelEvent);
    } else if (inner.AddChannelMemberEvent !== undefined) {
      return get_add_chan_member_simple_content(ev, skip_prj_name, inner.AddChannelMemberEvent);
    } else if (inner.RemoveChannelMemberEvent !== undefined) {
      return get_remove_chan_member_simple_content(
        ev,
        skip_prj_name,
        inner.RemoveChannelMemberEvent,
      );
    } else if (inner.UploadWorkSnapShotEvent !== undefined) {
      return get_upload_work_snap_simple_content(ev, skip_prj_name, inner.UploadWorkSnapShotEvent);
    } else if (inner.CreateAppraiseEvent !== undefined) {
      return get_create_appraise_simple_content(ev, skip_prj_name, inner.CreateAppraiseEvent);
    } else if (inner.UpdateAppraiseEvent !== undefined) {
      return get_update_appraise_simple_content(ev, skip_prj_name, inner.UpdateAppraiseEvent);
    } else if (inner.RemoveAppraiseEvent !== undefined) {
      return get_remove_appraise_simple_content(ev, skip_prj_name, inner.RemoveAppraiseEvent);
    } else if (inner.AddProjectAppEvent !== undefined) {
      return get_add_project_app_simple_content(ev, skip_prj_name, inner.AddProjectAppEvent);
    } else if (inner.RemoveProjectAppEvent !== undefined) {
      return get_remove_project_app_simple_content(ev, skip_prj_name, inner.RemoveProjectAppEvent);
    } else if (inner.CreateGoalEvent !== undefined) {
      return get_create_goal_simple_content(ev, skip_prj_name, inner.CreateGoalEvent);
    } else if (inner.UpdateGoalEvent !== undefined) {
      return get_update_goal_simple_content(ev, skip_prj_name, inner.UpdateGoalEvent);
    } else if (inner.ChangeOwnerEvent !== undefined) {
      return get_change_owner_simple_content(ev, skip_prj_name, inner.ChangeOwnerEvent);
    } else if (inner.CreateEventSubscribeEvent !== undefined) {
      return get_create_subscribe_simple_content(ev, skip_prj_name, inner.CreateEventSubscribeEvent);
    } else if (inner.UpdateEventSubscribeEvent !== undefined) {
      return get_update_subscribe_simple_content(ev, skip_prj_name, inner.UpdateEventSubscribeEvent);
    } else if (inner.RemoveEventSubscribeEvent !== undefined) {
      return get_remove_subscribe_simple_content(ev, skip_prj_name, inner.RemoveEventSubscribeEvent);
    } else {
      return [new LinkNoneInfo('未知事件')];
    }
  }
}

export namespace project_doc {
  export type CreateSpaceEvent = {
    doc_space_id: string;
    title: string;
  };

  function get_create_space_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateSpaceEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建 文档空间 ${inner.title}`)
    ];
  }

  export type UpdateSpaceEvent = {
    doc_space_id: string;
    old_title: string;
    new_title: string;
  };

  function get_update_space_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateSpaceEvent,
  ): LinkInfo[] {
    const ret_lsit = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改 文档空间 ${inner.old_title}`)
    ];
    if (inner.new_title != inner.old_title) {
      ret_lsit.push(new LinkNoneInfo(`新标题 ${inner.new_title}`));
    }
    return ret_lsit;
  }

  export type RemoveSpaceEvent = {
    doc_space_id: string;
    title: string;
  }

  function get_remove_space_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveSpaceEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除 文档空间 ${inner.title}`)
    ];
  }

  export type CreateDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
  }

  function get_create_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在文档空间 ${inner.doc_space_name} 创建文档`),
      new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
  }


  export type UpdateDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    old_title: string;
    new_title: string;
  }

  function get_update_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateDocEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在文档空间 ${inner.doc_space_name} 修改文档`),
      new LinkDocInfo(inner.old_title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
    if (inner.new_title != inner.old_title) {
      ret_list.push(new LinkNoneInfo(`新标题 ${inner.new_title}`));
    }
    return ret_list;
  }

  export type MoveDocToRecycleEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
  }

  function get_move_doc_to_recycle_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: MoveDocToRecycleEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在文档空间 ${inner.doc_space_name} 删除文档 ${inner.title}`),
    ];
  }

  export type MoveDocEvent = {
    src_doc_space_id: string;
    src_doc_space_name: string;
    dest_doc_space_id: string;
    dest_doc_space_name: string;
    doc_id: string;
    title: string;
  };

  function get_move_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: MoveDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 移动文档`),
      new LinkDocInfo(inner.title, ev.project_id, "", inner.doc_id),
      new LinkNoneInfo(`从${inner.src_doc_space_name} 到 ${inner.dest_doc_space_name}`)
    ];
  }

  export type RemoveDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
  }

  function get_remove_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 从回收站清除文档 ${inner.title}`),
    ];
  }

  export type RecoverDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
  }

  function get_recover_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RecoverDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 恢复 文档空间 ${inner.doc_space_name} 文档`),
      new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
  }

  export type WatchDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
  }

  function get_watch_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: WatchDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在 文档空间 ${inner.doc_space_name} 关注文档`),
      new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
  }

  export type UnWatchDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
  }

  function get_unwatch_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UnWatchDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在 文档空间 ${inner.doc_space_name} 取消关注文档`),
      new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
  }

  export type AllProjectDocEvent = {
    CreateSpaceEvent?: CreateSpaceEvent;
    UpdateSpaceEvent?: UpdateSpaceEvent;
    RemoveSpaceEvent?: RemoveSpaceEvent;
    CreateDocEvent?: CreateDocEvent;
    UpdateDocEvent?: UpdateDocEvent;
    MoveDocToRecycleEvent?: MoveDocToRecycleEvent;
    MoveDocEvent?: MoveDocEvent;
    RemoveDocEvent?: RemoveDocEvent;
    RecoverDocEvent?: RecoverDocEvent;
    WatchDocEvent?: WatchDocEvent;
    UnWatchDocEvent?: UnWatchDocEvent;
  };

  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllProjectDocEvent): LinkInfo[] {
    if (inner.CreateSpaceEvent !== undefined) {
      return get_create_space_simple_content(ev, skip_prj_name, inner.CreateSpaceEvent);
    } else if (inner.UpdateSpaceEvent !== undefined) {
      return get_update_space_simple_content(ev, skip_prj_name, inner.UpdateSpaceEvent);
    } else if (inner.RemoveSpaceEvent !== undefined) {
      return get_remove_space_simple_content(ev, skip_prj_name, inner.RemoveSpaceEvent);
    } else if (inner.CreateDocEvent !== undefined) {
      return get_create_doc_simple_content(ev, skip_prj_name, inner.CreateDocEvent);
    } else if (inner.UpdateDocEvent !== undefined) {
      return get_update_doc_simple_content(ev, skip_prj_name, inner.UpdateDocEvent);
    } else if (inner.MoveDocToRecycleEvent !== undefined) {
      return get_move_doc_to_recycle_simple_content(ev, skip_prj_name, inner.MoveDocToRecycleEvent);
    } else if (inner.MoveDocEvent !== undefined) {
      return get_move_doc_simple_content(ev, skip_prj_name, inner.MoveDocEvent);
    } else if (inner.RemoveDocEvent !== undefined) {
      return get_remove_doc_simple_content(ev, skip_prj_name, inner.RemoveDocEvent);
    } else if (inner.RecoverDocEvent !== undefined) {
      return get_recover_doc_simple_content(ev, skip_prj_name, inner.RecoverDocEvent);
    } else if (inner.WatchDocEvent !== undefined) {
      return get_watch_doc_simple_content(ev, skip_prj_name, inner.WatchDocEvent);
    } else if (inner.UnWatchDocEvent !== undefined) {
      return get_unwatch_doc_simple_content(ev, skip_prj_name, inner.UnWatchDocEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }
}

namespace sprit {
  /*
   * 迭代相关的事件定义
   */
  export type CreateEvent = {
    sprit_id: string;
    title: string;
    start_time: number;
    end_time: number;
  };
  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建迭代`),
      new LinkSpritInfo(inner.title, ev.project_id, inner.sprit_id),
      new LinkNoneInfo(`迭代时间 ${moment(inner.start_time).format("YYYY-MM-DD")} 至 ${moment(inner.end_time).format("YYYY-MM-DD")}`),
    ];
  }
  export type UpdateEvent = {
    sprit_id: string;
    old_title: string;
    new_title: string;
    old_start_time: number;
    new_start_time: number;
    old_end_time: number;
    new_end_time: number;
  };

  function get_update_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新迭代`),
      new LinkSpritInfo(inner.new_title, ev.project_id, inner.sprit_id),
    ];
    if (inner.old_title != inner.new_title) {
      ret_list.push(new LinkNoneInfo(`老标题 ${inner.old_title}`));
    }
    const oldStartTime = moment(inner.old_start_time).format("YYYY-MM-DD");
    const newStartTime = moment(inner.new_start_time).format("YYYY-MM-DD");
    if (oldStartTime != newStartTime) {
      ret_list.push(new LinkNoneInfo(`开始时间从${oldStartTime}调整到${newStartTime}`));
    }
    const oldEndTime = moment(inner.old_end_time).format("YYYY-MM-DD");
    const newEndTime = moment(inner.new_end_time).format("YYYY-MM-DD");
    if (oldEndTime != newEndTime) {
      ret_list.push(new LinkNoneInfo(`结束时间从${oldEndTime}调整到${newEndTime}`));
    }
    return ret_list;
  }

  export type RemoveEvent = {
    sprit_id: string;
    title: string;
    start_time: number;
    end_time: number;
  }

  function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除迭代`),
      new LinkNoneInfo(inner.title),
      new LinkNoneInfo(`(${moment(inner.start_time).format("YYYY-MM-DD")}-${moment(inner.end_time).format("YYYY-MM-DD")})`),
    ];
  }

  export type LinkDocEvent = {
    sprit_id: string;
    sprit_title: string;
    doc_id: string;
    doc_title: string;
  };

  function get_link_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: LinkDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联迭代`),
      new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id),
      new LinkNoneInfo("和文档"),
      new LinkDocInfo(inner.doc_title, ev.project_id, "", inner.doc_id),
    ];
  }

  export type CancelLinkDocEvent = {
    sprit_id: string;
    sprit_title: string;
    doc_id: string;
    doc_title: string;
  }

  function get_cancel_link_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelLinkDocEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消迭代`),
      new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id),
      new LinkNoneInfo("和文档"),
      new LinkDocInfo(inner.doc_title, ev.project_id, "", inner.doc_id),
      new LinkNoneInfo("关联"),
    ];
  }


  export type LinkChannelEvent = {
    sprit_id: string;
    sprit_title: string;
    channel_id: string;
    channel_title: string;
  };

  function get_link_channel_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: LinkChannelEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联迭代`),
      new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id),
      new LinkNoneInfo("和频道"),
      new LinkChannelInfo(inner.channel_title, ev.project_id, inner.channel_id),
    ];
  }

  export type CancelLinkChannelEvent = {
    sprit_id: string;
    sprit_title: string;
    channel_id: string;
    channel_title: string;
  };

  function get_cancel_link_channel_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelLinkChannelEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消迭代`),
      new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id),
      new LinkNoneInfo("和频道"),
      new LinkChannelInfo(inner.channel_title, ev.project_id, inner.channel_id),
      new LinkNoneInfo("关联"),
    ];
  }

  export type AllSpritEvent = {
    CreateEvent?: CreateEvent;
    UpdateEvent?: UpdateEvent;
    RemoveEvent?: RemoveEvent;
    LinkDocEvent?: LinkDocEvent;
    CancelLinkDocEvent?: CancelLinkDocEvent;
    LinkChannelEvent?: LinkChannelEvent;
    CancelLinkChannelEvent?: CancelLinkChannelEvent;
  };

  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllSpritEvent,
  ): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
      return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.UpdateEvent !== undefined) {
      return get_update_simple_content(ev, skip_prj_name, inner.UpdateEvent);
    } else if (inner.RemoveEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name, inner.RemoveEvent);
    } else if (inner.LinkDocEvent !== undefined) {
      return get_link_doc_simple_content(ev, skip_prj_name, inner.LinkDocEvent)
    } else if (inner.CancelLinkDocEvent !== undefined) {
      return get_cancel_link_doc_simple_content(ev, skip_prj_name, inner.CancelLinkDocEvent);
    } else if (inner.LinkChannelEvent !== undefined) {
      return get_link_channel_simple_content(ev, skip_prj_name, inner.LinkChannelEvent);
    } else if (inner.CancelLinkChannelEvent !== undefined) {
      return get_cancel_link_channel_simple_content(ev, skip_prj_name, inner.CancelLinkChannelEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }
}

namespace test_case {
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

  export function get_simple_content_inner(
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
}
namespace issue {
  /*
   * 工单相关的事件定义
   */
  export type CreateEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
  };
  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    return ret_list;
  }

  export type UpdateEvent = {
    issue_id: string;
    issue_type: number;
    old_title: string;
    new_title: string;
  };
  function get_update_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.old_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.old_title, ev.project_id, inner.issue_id));
    }
    if (inner.old_title != inner.new_title) {
      ret_list.push(new LinkNoneInfo(`新标题 ${inner.new_title}`));
    }
    return ret_list;
  }

  export type RemoveEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
  };
  function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveEvent,
  ) {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除${issue_type_str} ${inner.title}`),
    ];
  }

  export type AssignExecUserEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    exec_user_id: string;
    exec_user_display_name: string;
  };
  function get_assign_exec_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AssignExecUserEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 指派`),
      new LinkNoneInfo(`${inner.exec_user_display_name}`),
      new LinkNoneInfo(`为${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('执行人'));
    return ret_list;
  }
  export type AssignCheckUserEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    check_user_id: string;
    check_user_display_name: string;
  };
  function get_assign_check_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AssignCheckUserEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 指派`),
      new LinkNoneInfo(` ${inner.check_user_display_name}`),
      new LinkNoneInfo(`为${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('检查人'));
    return ret_list;
  }

  export type ChangeStateEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    old_state: number;
    new_state: number;
  };
  function get_change_state_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ChangeStateEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const old_state_str = get_issue_state_str(inner.old_state);
    const new_state_str = get_issue_state_str(inner.new_state);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更改${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }

    ret_list.push(new LinkNoneInfo(`老状态 ${old_state_str} 新状态 ${new_state_str}`));
    return ret_list;
  }

  export type LinkSpritEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    sprit_id: string;
    sprit_title: string;
  };

  function get_link_sprit_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: LinkSpritEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('到迭代'));
    ret_list.push(new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id))
    return ret_list;
  }

  export type CancelLinkSpritEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    sprit_id: string;
    sprit_title: string;
  };

  function get_cancel_link_sprit_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelLinkSpritEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消关联${issue_type_str} `),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo('到迭代'));
    ret_list.push(new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id))
    return ret_list;
  }


  export type SetStartTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    start_time: number;
  };
  function get_set_start_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetStartTimeEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const d = new Date(inner.start_time);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`开始时间 ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`));
    return ret_list;
  }
  export type SetEndTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    end_time: number;
  };
  function get_set_end_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetEndTimeEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const d = new Date(inner.end_time);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`结束时间 ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`));
    return ret_list;
  }
  export type SetEstimateMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    estimate_minutes: number;
  };
  function get_set_estimate_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetEstimateMinutesEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`预估时间 ${(inner.estimate_minutes / 60).toFixed(1)}小时`));
    return ret_list;
  }

  export type SetRemainMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    remain_minutes: number;
    has_spend_minutes: boolean;
    spend_minutes: number;
  };
  function get_set_remain_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: SetRemainMinutesEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 设置${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`剩余时间 ${(inner.remain_minutes / 60).toFixed(1)}小时`));
    if (inner.has_spend_minutes) {
      ret_list.push(new LinkNoneInfo(`新增开销时间 ${(inner.spend_minutes / 60).toFixed(1)}小时`));
    }
    return ret_list;
  }

  export type CancelStartTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
  };
  function get_cancel_start_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelStartTimeEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`开始时间`));
    return ret_list;
  }
  export type CancelEndTimeEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    end_time: number;
  };
  function get_cancel_end_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelEndTimeEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`结束时间`));
    return ret_list;
  }
  export type CancelEstimateMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
    estimate_minutes: number;
  };
  function get_cancel_estimate_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelEstimateMinutesEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`预估时间`));
    return ret_list;
  }

  export type CancelRemainMinutesEvent = {
    issue_id: string;
    issue_type: number;
    title: string;
  };
  function get_cancel_remain_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CancelRemainMinutesEvent,
  ): LinkInfo[] {
    const issue_type_str = get_issue_type_str(inner.issue_type);
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消${issue_type_str}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`剩余时间`));
    return ret_list;
  }

  export type CreateSubIssueEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    title: string;
  };

  function get_create_sub_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateSubIssueEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 ${inner.title}`));
    return ret_list;
  }

  export type UpdateSubIssueEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    old_title: string;
    new_title: string;
  };

  function get_update_sub_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateSubIssueEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 原标题:${inner.old_title} 现标题:${inner.new_title}`));
    return ret_list;
  }

  export type UpdateSubIssueStateEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    title: string;
    done: boolean;
  };

  function get_update_sub_issue_state_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateSubIssueStateEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 标记 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 ${inner.title} 状态 为 ${inner.done ? "完成" : "未完成"}`));
    return ret_list;
  }

  export type RemoveSubIssueEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    title: string;
  };

  function get_remove_sub_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveSubIssueEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`子工单 ${inner.title}`));
    return ret_list;
  }

  export type AddDependenceEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    depend_issue_id: string;
    depend_issue_type: number;
    depend_issue_title: string;
  };

  function get_add_depend_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddDependenceEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`和 ${get_issue_type_str(inner.depend_issue_type)}`));
    if (inner.depend_issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    } else if (inner.depend_issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    }
    return ret_list;
  }

  export type RemoveDependenceEvent = {
    issue_id: string;
    issue_type: number;
    issue_title: string;
    depend_issue_id: string;
    depend_issue_type: number;
    depend_issue_title: string;
  };

  function get_remove_depend_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveDependenceEvent,
  ): LinkInfo[] {
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消关联 ${get_issue_type_str(inner.issue_type)}`),
    ];
    if (inner.issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.issue_title, ev.project_id, inner.issue_id));
    } else if (inner.issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.issue_title, ev.project_id, inner.issue_id));
    }
    ret_list.push(new LinkNoneInfo(`和 ${get_issue_type_str(inner.depend_issue_type)}`));
    if (inner.depend_issue_type == pi.ISSUE_TYPE_TASK) {
      ret_list.push(new LinkTaskInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    } else if (inner.depend_issue_type == pi.ISSUE_TYPE_BUG) {
      ret_list.push(new LinkBugInfo(inner.depend_issue_title, ev.project_id, inner.depend_issue_id));
    }
    return ret_list;
  }

  export class AllIssueEvent {
    CreateEvent?: CreateEvent;
    UpdateEvent?: UpdateEvent;
    RemoveEvent?: RemoveEvent;
    AssignExecUserEvent?: AssignExecUserEvent;
    AssignCheckUserEvent?: AssignCheckUserEvent;
    ChangeStateEvent?: ChangeStateEvent;
    LinkSpritEvent?: LinkSpritEvent;
    CancelLinkSpritEvent?: CancelLinkSpritEvent;
    SetStartTimeEvent?: SetStartTimeEvent;
    SetEndTimeEvent?: SetEndTimeEvent;
    SetEstimateMinutesEvent?: SetEstimateMinutesEvent;
    SetRemainMinutesEvent?: SetRemainMinutesEvent;
    CancelStartTimeEvent?: CancelStartTimeEvent;
    CancelEndTimeEvent?: CancelEndTimeEvent;
    CancelEstimateMinutesEvent?: CancelEstimateMinutesEvent;
    CancelRemainMinutesEvent?: CancelRemainMinutesEvent;
    CreateSubIssueEvent?: CreateSubIssueEvent;
    UpdateSubIssueEvent?: UpdateSubIssueEvent;
    UpdateSubIssueStateEvent?: UpdateSubIssueStateEvent;
    RemoveSubIssueEvent?: RemoveSubIssueEvent;
    AddDependenceEvent?: AddDependenceEvent;
    RemoveDependenceEvent?: RemoveDependenceEvent;
  }
  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllIssueEvent,
  ): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
      return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.UpdateEvent !== undefined) {
      return get_update_simple_content(ev, skip_prj_name, inner.UpdateEvent);
    } else if (inner.RemoveEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name, inner.RemoveEvent);
    } else if (inner.AssignExecUserEvent !== undefined) {
      return get_assign_exec_simple_content(ev, skip_prj_name, inner.AssignExecUserEvent);
    } else if (inner.AssignCheckUserEvent !== undefined) {
      return get_assign_check_simple_content(ev, skip_prj_name, inner.AssignCheckUserEvent);
    } else if (inner.ChangeStateEvent !== undefined) {
      return get_change_state_simple_content(ev, skip_prj_name, inner.ChangeStateEvent);
    } else if (inner.LinkSpritEvent !== undefined) {
      return get_link_sprit_simple_content(ev, skip_prj_name, inner.LinkSpritEvent);
    } else if (inner.CancelLinkSpritEvent !== undefined) {
      return get_cancel_link_sprit_simple_content(ev, skip_prj_name, inner.CancelLinkSpritEvent);
    } else if (inner.SetStartTimeEvent !== undefined) {
      return get_set_start_simple_content(ev, skip_prj_name, inner.SetStartTimeEvent);
    } else if (inner.SetEndTimeEvent !== undefined) {
      return get_set_end_simple_content(ev, skip_prj_name, inner.SetEndTimeEvent);
    } else if (inner.SetEstimateMinutesEvent !== undefined) {
      return get_set_estimate_simple_content(ev, skip_prj_name, inner.SetEstimateMinutesEvent);
    } else if (inner.SetRemainMinutesEvent !== undefined) {
      return get_set_remain_simple_content(ev, skip_prj_name, inner.SetRemainMinutesEvent);
    } else if (inner.CancelStartTimeEvent !== undefined) {
      return get_cancel_start_simple_content(ev, skip_prj_name, inner.CancelStartTimeEvent);
    } else if (inner.CancelEndTimeEvent !== undefined) {
      return get_cancel_end_simple_content(ev, skip_prj_name, inner.CancelEndTimeEvent);
    } else if (inner.CancelEstimateMinutesEvent !== undefined) {
      return get_cancel_estimate_simple_content(ev, skip_prj_name, inner.CancelEstimateMinutesEvent);
    } else if (inner.CancelRemainMinutesEvent !== undefined) {
      return get_cancel_remain_simple_content(ev, skip_prj_name, inner.CancelRemainMinutesEvent);
    } else if (inner.CreateSubIssueEvent !== undefined) {
      return get_create_sub_issue_simple_content(ev, skip_prj_name, inner.CreateSubIssueEvent);
    } else if (inner.UpdateSubIssueEvent !== undefined) {
      return get_update_sub_issue_simple_content(ev, skip_prj_name, inner.UpdateSubIssueEvent);
    } else if (inner.UpdateSubIssueStateEvent !== undefined) {
      return get_update_sub_issue_state_simple_content(ev, skip_prj_name, inner.UpdateSubIssueStateEvent);
    } else if (inner.RemoveSubIssueEvent !== undefined) {
      return get_remove_sub_issue_simple_content(ev, skip_prj_name, inner.RemoveSubIssueEvent);
    } else if (inner.AddDependenceEvent !== undefined) {
      return get_add_depend_simple_content(ev, skip_prj_name, inner.AddDependenceEvent);
    } else if (inner.RemoveDependenceEvent !== undefined) {
      return get_remove_depend_simple_content(ev, skip_prj_name, inner.RemoveDependenceEvent);
    } else {
      return [new LinkNoneInfo('未知事件')];
    }
  }
}

namespace book_shelf {
  export type AddBookEvent = {
    book_id: string;
    book_title: string;
  };

  function get_add_simple_content(ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddBookEvent): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 增加书本 ${inner.book_title}`),
    ];
  }


  export type RemoveBookEvent = {
    book_id: string;
    book_title: string;
  };

  function get_remove_simple_content(ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveBookEvent): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除书本 ${inner.book_title}`),
    ];
  }

  export class AllBookShelfEvent {
    AddBookEvent?: AddBookEvent;
    RemoveBookEvent?: RemoveBookEvent;
  }

  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllBookShelfEvent,
  ): LinkInfo[] {
    if (inner.AddBookEvent !== undefined) {
      return get_add_simple_content(ev, skip_prj_name, inner.AddBookEvent);
    } else if (inner.RemoveBookEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name, inner.RemoveBookEvent);
    } else {
      return [new LinkNoneInfo('未知事件')];
    }
  }
}

namespace ext_event {
  /*
   * 第三方接入相关的事件
   */
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
  export function get_simple_content_inner(
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
}

namespace gitlab {
  /*
   * gitlab相关的事件
   */
  export type Author = {
    name: string;
    email: string;
  };
  export type Variable = {
    key: string;
    value: string;
  };
  export type User = {
    id: number;
    name: string;
    user_name: string;
    avatar_url: string;
    email: string;
  };
  export type BuildCommit = {
    id: number;
    sha: string;
    message: string;
    author_name: string;
    author_email: string;
    status: string;
    duration: number;
    started_at: number[];
    finished_at: number[];
  };
  export type Repository = {
    name: string;
    url: string;
    description: string;
    homepage: string;
    git_ssh_url: string;
    git_http_url: string;
    visibility_level: number;
  };
  export type Runner = {
    id: number;
    description: string;
    active: boolean;
    is_shared: boolean;
  };

  export type Project = {
    id: number;
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
  };
  export type Position = {
    base_sha: string;
    start_sha: string;
    head_sha: string;
    old_path: string;
    new_path: string;
    position_type: string;
    old_line: number;
    new_line: number;
    width: number;
    height: number;
    x: number;
    y: number;
  };
  export type StDiff = {
    diff: string;
    new_path: string;
    old_path: string;
    a_mode: string;
    b_mode: string;
    new_file: boolean;
    renamed_file: boolean;
    deleted_file: boolean;
  };
  export type Source = {
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
  };

  export type Target = {
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
  };

  export type LastCommit = {
    id: string;
    message: string;
    timestamp: number[];
    url: string;
    author: null | Author;
  };

  export type ObjectAttributes = {
    id: number;
    title: string;
    assignee_ids: number[];
    assignee_id: number;
    author_id: number;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    updated_by_id: number;
    last_edited_at: number[];
    last_edited_by_id: number;
    relative_position: number;
    position: null | Position;
    branch_name: string;
    description: string;
    milestone_id: number;
    state: string;
    state_id: number;
    conf_idential: boolean;
    discussion_locked: boolean;
    due_date: number[];
    time_estimate: number;
    total_time_spent: number;
    iid: number;
    url: string;
    action: string;
    target_branch: string;
    source_branch: string;
    source_project_id: number;
    target_project_id: number;
    st_commits: string;
    merge_status: string;
    content: string;
    format: string;
    message: string;
    slug: string;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    status: string;
    stages: string[];
    duration: number;
    note: string;
    notebook_type: string;
    at: number[];
    line_code: string;
    commit_id: string;
    noteable_id: number;
    system: boolean;
    work_in_progress: boolean;
    st_diffs: StDiff[];
    source: null | Source;
    target: null | Target;
    last_commit: null | LastCommit;
    assignee: null | Assignee;
  };
  export type Assignee = {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
    email: string;
  };
  export type MergeRequest = {
    id: number;
    target_branch: string;
    source_branch: string;
    source_project_id: number;
    assignee_id: number;
    author_id: number;
    title: string;
    created_at: number[];
    updated_at: number[];
    milestone_id: number;
    state: string;
    merge_status: string;
    target_project_id: number;
    iid: number;
    description: string;
    position: number;
    locked_at: number[];
    source: null | Source;
    target: null | Target;
    last_commit: null | LastCommit;
    work_in_progress: boolean;
    assignee: null | Assignee;
    url: string;
  };
  export type Commit = {
    id: string;
    message: string;
    title: string;
    timestamp: number[];
    url: string;
    author: null | Author;
    added: string[];
    modified: string[];
    removed: string[];
  };
  export type Issue = {
    id: number;
    title: string;
    assignee_id: number;
    author_id: number;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    position: number;
    branch_name: string;
    description: string;
    milestone_id: number;
    state: string;
    iid: number;
  };
  export type Snippet = {
    id: number;
    title: string;
    content: string;
    author_id: number;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    file_name: string;
    expires_at: number[];
    type: string;
    visibility_level: number;
  };
  export type Label = {
    id: number;
    title: string;
    color: string;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    template: boolean;
    description: string;
    type: string;
    group_id: number;
  };
  export type LabelChanges = {
    previous: Label[];
    current: Label[];
  };
  export type Changes = {
    label_changes: null | LabelChanges;
  };
  export type PipelineObjectAttributes = {
    id: number;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    source: string;
    status: string;
    stages: string[];
    created_at: number[];
    finished_at: number[];
    duration: number;
    variables: Variable[];
  };

  export type ArtifactsFile = {
    filename: string;
    size: string;
  };
  export type Build = {
    id: number;
    stage: string;
    name: string;
    status: string;
    created_at: number[];
    started_at: number[];
    finished_at: number[];
    when: string;
    manual: boolean;
    user: null | User;
    runner: null | Runner;
    artifacts_file: null | ArtifactsFile;
  };
  export type Wiki = {
    web_url: string;
    git_ssh_url: string;
    git_http_url: string;
    path_with_namespace: string;
    default_branch: string;
  };
  export type BuildEvent = {
    object_kind: string;
    ref: string;
    tag: boolean;
    before_sha: string;
    sha: string;
    build_id: number;
    build_name: string;
    build_stage: string;
    build_status: string;
    build_started_at: number[];
    build_finished_at: number[];
    build_duration: number;
    build_allow_failure: boolean;
    project_id: number;
    project_name: string;
    user: null | User;
    commit: null | BuildCommit;
    repository: null | Repository;
    runner: null | Runner;
  };
  function get_build_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: BuildEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type CommentEvent = {
    object_kind: string;
    user: null | User;
    project_id: number;
    project: null | Project;
    repository: null | Repository;
    object_attributes: null | ObjectAttributes;
    merge_request: null | MergeRequest;
    commit: null | Commit;
    issue: null | Issue;
    snippet: null | Snippet;
  };
  function get_comment_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CommentEvent,
  ): LinkInfo[] {
    const retList = [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name} 评论`)];
    if (inner.commit?.url ?? "" != "") {
      retList.push(new LinkExterneInfo(`Commit(${inner.commit?.id})`, inner.commit?.url ?? ""));
    }
    if (inner.issue?.id ?? 0 != 0) {
      retList.push(new LinkNoneInfo(`工单:${inner.issue?.title ?? ""}`));
    }
    retList.push(new LinkNoneInfo(`内容:${inner.object_attributes?.description}`));
    return retList;
  }
  export type IssueEvent = {
    object_kind: string;
    user: null | User;
    project: null | Project;
    repository: null | Repository;
    object_attributes: null | ObjectAttributes;
    assignee: null | Assignee;
    changes: null | Changes;
  };
  function get_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueEvent,
  ): LinkInfo[] {
    let opt = "创建";
    if (inner.object_attributes?.action == "close") {
      opt = "关闭";
    } else if (inner.object_attributes?.action == "reopen") {
      opt = "重新打开";
    }
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name ?? ""} ${opt}工单`),
      new LinkExterneInfo(inner.object_attributes?.title ?? "", inner.object_attributes?.url ?? ""),
    ];
    return retList;
  }
  export type JobEvent = {
    object_kind: string;
    ref: string;
    tag: boolean;
    before_sha: string;
    sha: string;
    build_id: number;
    build_name: string;
    build_stage: string;
    build_status: string;
    build_started_at: number[];
    build_finished_at: number[];
    build_duration: number;
    build_allow_failure: boolean;
    build_failure_reason: string;
    pipeline_id: number;
    project_id: number;
    project_name: string;
    user: null | User;
    commit: null | BuildCommit;
    repository: null | Repository;
    runner: null | Runner;
  };
  function get_job_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: JobEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type MergeRequestEvent = {
    object_kind: string;
    user: null | User;
    object_attributes: null | ObjectAttributes;
    changes: null | Changes;
    project: null | Project;
    repository: null | Repository;
    labels: Label[];
    assignees: Assignee[];
  };
  function get_merge_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: MergeRequestEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name}`),
      new LinkNoneInfo(`${inner.object_attributes?.action == "open" ? "打开" : "关闭"} 合并需求`),
      new LinkExterneInfo(inner.object_attributes?.source?.name ?? "", inner.object_attributes?.source?.homepage ?? ""),
      new LinkNoneInfo(inner.object_attributes?.source_branch ?? ""),
      new LinkNoneInfo("至"),
      new LinkExterneInfo(inner.object_attributes?.target?.name ?? "", inner.object_attributes?.target?.homepage ?? ""),
      new LinkNoneInfo(inner.object_attributes?.target_branch ?? ""),
    ];
  }
  export type PipelineEvent = {
    object_kind: string;
    user: null | User;
    project: null | Project;
    commit: null | Commit;
    object_attributes: null | PipelineObjectAttributes;
    merge_request: null | MergeRequest;
    builds: Build[];
  };
  function get_pipe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PipelineEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type PushEvent = {
    object_kind: string;
    before: string;
    after: string;
    ref: string;
    checkout_sha: string;
    user_id: number;
    user_name: string;
    user_username: string;
    user_email: string;
    user_avatar: string;
    project_id: number;
    project: null | Project;
    repository: null | Repository;
    commits: Commit[];
    total_commits_count: number;
  };
  function get_push_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PushEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user_name}推送`),
      new LinkExterneInfo(inner.project?.name ?? "", inner.project?.homepage ?? ""),
      new LinkNoneInfo(`包含${inner.commits.length}次提交`),
      new LinkNoneInfo(`最后提交内容:${inner.commits[inner.commits.length - 1]?.title}`),
    ];
  }
  export type TagEvent = {
    object_kind: string;
    before: string;
    after: string;
    ref: string;
    checkout_sha: string;
    user_id: number;
    user_name: string;
    user_username: string;
    user_avatar: string;
    project_id: number;
    project: null | Project;
    repository: null | Repository;
    commits: Commit[];
    total_commits_count: number;
  };
  function get_tag_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: TagEvent,
  ): LinkInfo[] {
    let opt = "新增";
    if (inner.commits.length == 0) {
      opt = "删除";
    }
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user_name} ${opt}标签`),
    ];
    if (inner.commits.length > 0) {
      retList.push(new LinkExterneInfo(inner.ref, inner.commits[inner.commits.length - 1]?.url ?? ""));
    } else {
      retList.push(new LinkNoneInfo(inner.ref));
    }
    return retList;
  }
  export type WikiEvent = {
    object_kind: string;
    user: null | User;
    project: null | Project;
    wiki: null | Wiki;
    object_attributes: null | ObjectAttributes;
  };
  function get_wiki_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: WikiEvent,
  ): LinkInfo[] {
    let opt = "创建";
    if (inner.object_attributes?.action == "update") {
      opt = "更新";
    } else if (inner.object_attributes?.action == "delete") {
      opt = "删除";
    }
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name ?? ""} ${opt}WIKI`),
    ];
    if (inner.object_attributes?.action == "delete") {
      retList.push(new LinkNoneInfo(inner.object_attributes?.title ?? ""));
    } else {
      if (inner.object_attributes?.url ?? "" != "") {
        retList.push(new LinkExterneInfo(inner.object_attributes?.title ?? "", inner.object_attributes?.url ?? ""));
      }
    }
    return retList;
  }

  export class AllGitlabEvent {
    BuildEvent?: BuildEvent;
    CommentEvent?: CommentEvent;
    IssueEvent?: IssueEvent;
    JobEvent?: JobEvent;
    MergeRequestEvent?: MergeRequestEvent;
    PipelineEvent?: PipelineEvent;
    PushEvent?: PushEvent;
    TagEvent?: TagEvent;
    WikiEvent?: WikiEvent;
  }
  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllGitlabEvent,
  ): LinkInfo[] {
    // console.log(JSON.stringify(inner));
    if (inner.BuildEvent !== undefined) {
      return get_build_simple_content(ev, skip_prj_name, inner.BuildEvent);
    } else if (inner.CommentEvent !== undefined) {
      return get_comment_simple_content(ev, skip_prj_name, inner.CommentEvent);
    } else if (inner.IssueEvent !== undefined) {
      return get_issue_simple_content(ev, skip_prj_name, inner.IssueEvent);
    } else if (inner.MergeRequestEvent !== undefined) {
      return get_merge_simple_content(ev, skip_prj_name, inner.MergeRequestEvent);
    } else if (inner.PipelineEvent !== undefined) {
      return get_pipe_simple_content(ev, skip_prj_name, inner.PipelineEvent);
    } else if (inner.PushEvent !== undefined) {
      return get_push_simple_content(ev, skip_prj_name, inner.PushEvent);
    } else if (inner.TagEvent !== undefined) {
      return get_tag_simple_content(ev, skip_prj_name, inner.TagEvent);
    } else if (inner.WikiEvent !== undefined) {
      return get_wiki_simple_content(ev, skip_prj_name, inner.WikiEvent);
    } else if (inner.JobEvent != undefined) {
      return get_job_simple_content(ev, skip_prj_name, inner.JobEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }
}

namespace gogs {
  /*
   * gogs相关事件
   */
  export type Permission = {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  export type User = {
    id: number;
    user_name: string;
    login: string;
    full_name: string;
    email: string;
    avatar_url: string;
  };
  export type Repository = {
    id: number;
    owner: User[];
    name: string;
    full_name: string;
    description: string;
    private_flag: boolean;
    unlisted: boolean;
    fork: boolean;
    parent: Repository[];
    empty: boolean;
    mirror: boolean;
    size: number;
    html_url: string;
    ssh_url: string;
    clone_url: string;
    website: string;
    stars: number;
    forks: number;
    watchers: number;
    open_issues: number;
    default_branch: string;
    created: string;
    updated: string;
    permissions: Permission[];
  };
  export type Label = {
    id: number;
    name: string;
    color: string;
    url: string;
  };
  export type Milestone = {
    id: number;
    title: string;
    description: string;
    state: string;
    open_issues: number;
    closed_issues: number;
    closed: string[];
    deadline: string[];
  };
  export type PullRequestMeta = {
    has_merged: boolean;
    merged: string[];
  };
  export type Issue = {
    id: number;
    index: number;
    poster: User[];
    title: string;
    body: string;
    labels: Label[];
    milestone: Milestone[];
    assignee: User[];
    state: string;
    comments: number;
    created: string;
    updated: string;
    pull_request: PullRequestMeta[];
  };
  export type Comment = {
    id: number;
    html_url: string;
    poster: User[];
    body: string;
    created: string;
    updated: string;
  };
  export type ChangesFrom = {
    from_value: string;
  };
  export type Changes = {
    title: ChangesFrom[];
    body: ChangesFrom[];
  };
  export type PullRequest = {
    id: number;
    index: number;
    poster: User[];
    title: string;
    body: string;
    labels: Label[];
    milestone: Milestone[];
    assignee: User[];
    state: string;
    comments: number;
    head_branch: string;
    head_repo: Repository[];
    base_branch: string;
    base_repo: Repository[];
    html_url: string;
    mergeable: boolean[];
    has_merged: boolean;
    merged: string[];
    merged_commit_id: string[];
    merged_by: User[];
  };
  export type CommitUser = {
    name: string;
    email: string;
    user_name: string;
  };
  export type Commit = {
    id: string;
    message: string;
    url: string;
    author: CommitUser[];
    committer: CommitUser[];
    added: string[];
    removed: string[];
    modified: string[];
    timestamp: number;
  };
  export type Release = {
    id: number;
    tag_name: string;
    target_commitish: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    author: User[];
    created: string;
  };
  export type CreateEvent = {
    ref: string;
    ref_type: string;
    sha: string;
    default_branch: string;
    repo: Repository[];
    sender: User[];
  };
  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type DeleteEvent = {
    ref: string;
    ref_type: string;
    pusher_type: string;
    repo: Repository[];
    sender: User[];
  };
  function get_delete_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: DeleteEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type ForkEvent = {
    forkee: Repository[];
    repo: Repository[];
    sender: User[];
  };
  function get_fork_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ForkEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type IssueCommentEvent = {
    action: string;
    issue: Issue[];
    comment: Comment[];
    changes: Changes[];
    repository: Repository[];
    sender: User[];
  };
  function get_issue_comment_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueCommentEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type IssueEvent = {
    action: string;
    index: number;
    issue: Issue[];
    changes: Changes[];
    repository: Repository[];
    sender: User[];
  };
  function get_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type PullRequestEvent = {
    action: string;
    index: number;
    pull_request: PullRequest[];
    changes: Changes[];
    repository: Repository[];
    sender: User[];
  };
  function get_pr_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PullRequestEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type PushEvent = {
    ref: string;
    before: string;
    after: string;
    compare_url: string;
    commits: Commit[];
    repo: Repository[];
    pusher: User[];
    sender: User[];
  };
  function get_push_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PushEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type ReleaseEvent = {
    action: string;
    release: Release[];
    repository: Repository[];
    sender: User[];
  };
  function get_relase_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ReleaseEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export class AllGogsEvent {
    CreateEvent?: CreateEvent;
    DeleteEvent?: DeleteEvent;
    ForkEvent?: ForkEvent;
    IssueCommentEvent?: IssueCommentEvent;
    IssueEvent?: IssueEvent;
    PullRequestEvent?: PullRequestEvent;
    PushEvent?: PushEvent;
    ReleaseEvent?: ReleaseEvent;
  }
  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllGogsEvent,
  ): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
      return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.DeleteEvent !== undefined) {
      return get_delete_simple_content(ev, skip_prj_name, inner.DeleteEvent);
    } else if (inner.ForkEvent !== undefined) {
      return get_fork_simple_content(ev, skip_prj_name, inner.ForkEvent);
    } else if (inner.IssueCommentEvent !== undefined) {
      return get_issue_comment_simple_content(ev, skip_prj_name, inner.IssueCommentEvent);
    } else if (inner.IssueEvent !== undefined) {
      return get_issue_simple_content(ev, skip_prj_name, inner.IssueEvent);
    } else if (inner.PullRequestEvent !== undefined) {
      return get_pr_simple_content(ev, skip_prj_name, inner.PullRequestEvent);
    } else if (inner.PushEvent !== undefined) {
      return get_push_simple_content(ev, skip_prj_name, inner.PushEvent);
    } else if (inner.ReleaseEvent !== undefined) {
      return get_relase_simple_content(ev, skip_prj_name, inner.ReleaseEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }
}

namespace gitee {
  /*
   * gitee相关事件
   */
  export type User = {
    id: number[];
    name: string;
    email: string;
    username: string[];
    url: string[];
    login: string[];
    avatar_url: string[];
    html_url: string[];
    type_str: string[];
    site_admin: boolean;
    time: number[];
    remark: string[];
  };
  export type Project = {
    id: number;
    name: string;
    path: string;
    full_name: string;
    owner: User[];
    private_flag: boolean;
    html_url: string;
    url: string;
    description: string;
    fork: boolean;
    created_at: number;
    updated_at: number;
    pushed_at: number;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    git_http_url: string;
    git_ssh_url: string;
    git_svn_url: string;
    homepage: string[];
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    language: string;
    has_issues: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    license: string[];
    open_issues_count: number;
    default_branch: string;
    namespace: string;
    name_with_namespace: string;
    path_with_namespace: string;
  };
  export type Commit = {
    id: string;
    tree_id: string;
    parent_ids: string[];
    msg: string;
    timestamp: number;
    url: string;
    author: User[];
    committer: User[];
    distinct: boolean;
    added: string[];
    removed: string[];
    modified: string[];
  };
  export type Enterprise = {
    name: string;
    url: string;
  };
  export type Label = {
    id: number;
    name: string;
    color: string;
  };
  export type Milestone = {
    html_url: string;
    id: number;
    number: number;
    title: string;
    description: string;
    open_issues: number;
    closed_issues: number;
    state: string;
    created_at: number;
    updated_at: number;
    due_on: number[];
  };
  export type Issue = {
    html_url: string;
    id: number;
    number: string;
    title: string;
    user: User[];
    labels: Label[];
    state: string;
    state_name: string;
    type_name: string;
    assignee: User[];
    collaborators: User[];
    milestone: Milestone[];
    comments: number;
    created_at: number;
    updated_at: number;
    body: string;
  };
  export type Note = {
    id: number;
    body: string;
    user: User[];
    created_at: number;
    updated_at: number;
    html_url: string;
    position: string[];
    commit_id: string[];
  };
  export type PullRequest = {
    id: number;
    number: number;
    state: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    title: string;
    body: string[];
    created_at: number;
    updated_at: number;
    closed_at: number[];
    merged_at: number[];
    merge_commit_sha: string;
    merge_reference_name: string;
    user: User[];
    assignee: User[];
    assignees: User[];
    tester: User[];
    testers: User[];
    need_test: boolean;
    need_review: boolean;
    milestone: Milestone[];
    head: Branch[];
    base: Branch[];
    merged: boolean;
    mergeable: boolean;
    merge_status: string;
    updated_by: User[];
    comments: number;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
  };
  export type Branch = {
    label: string;
    ref: string;
    sha: string;
    user: string;
    repo: Project[];
  };
  export type PushEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    ref: string;
    before: string;
    after: string;
    total_commits_count: number;
    commits_more_than_ten: boolean;
    created: boolean;
    deleted: boolean;
    compare: string;
    commits: Commit[];
    head_commit: null | Commit;
    project: Project[];
    user_id: number;
    user_name: string;
    user: User[];
    pusher: User[];
    sender: User[];
    enterprise: Enterprise[];
  };
  function get_push_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PushEvent,
  ): LinkInfo[] {
    let repo_url = "";
    if (inner.project.length > 0) {
      repo_url = inner.project[0].url;
    }
    let project_name = '';
    if (inner.project.length > 0) {
      project_name = inner.project[0].full_name;
    }
    let src_user = '';
    if (inner.sender.length > 0) {
      src_user = inner.sender[0].name;
    }
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${src_user})推送`),
      new LinkExterneInfo(project_name, repo_url),
      new LinkNoneInfo(`包含${inner.total_commits_count}次提交`),
      new LinkNoneInfo(`最后提交内容:${inner.commits.pop()?.msg}`),

    ];
    if (inner.head_commit != null) {
      ret_list.push(new LinkNoneInfo(`最新提交内容:${inner.head_commit.msg}`));
    }
    return ret_list;
  }
  export type IssueEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    action: string;
    issue: Issue[];
    project: Project[];
    sender: User[];
    target_user: User[];
    user: User[];
    assignee: User[];
    updated_by: User[];
    iid: string;
    title: string;
    description: string;
    state: string;
    milestone: string;
    url: string;
    enterprise: Enterprise[];
  };
  function get_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueEvent,
  ): LinkInfo[] {
    let action_str = '';
    if (inner.action == 'open') {
      action_str = '新建工单';
    } else if (inner.action == 'state_change') {
      action_str = '修改工单状态';
    } else if (inner.action == 'delete') {
      action_str = '删除工单';
    }
    let issue_title = "";
    let issue_url = "";
    if (inner.issue.length > 0) {
      issue_title = inner.issue[0].title;
      issue_url = inner.issue[0].html_url;
    }
    let src_user = '';
    if (inner.sender.length > 0) {
      src_user = inner.sender[0].name;
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${src_user}) ${action_str}`),
      new LinkExterneInfo(issue_title, issue_url),
    ];
  }

  export type PullRequestEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    action: string;
    pull_request: PullRequest[];
    number: number;
    iid: number;
    title: string;
    body: string[];
    state: string;
    merge_status: string;
    merge_commit_sha: string;
    url: string;
    source_branch: string[];
    source_repo: Project[];
    target_branch: string;
    target_repo: Project[];
    project: Project[];
    author: User[];
    updated_by: User[];
    sender: User[];
    target_user: User[];
    enterprise: Enterprise[];
  };

  function get_pr_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PullRequestEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type NoteEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    action: string;
    comment: null | Note;
    project: Project[];
    author: User[];
    sender: User[];
    url: string;
    note: string;
    noteable_type: string;
    noteable_id: number;
    issue: Issue[];
    pull_request: PullRequest[];
    title: string;
    per_iid: string;
    short_commit_id: string[];
    enterprise: Enterprise[];
  };

  function get_note_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: NoteEvent,
  ): LinkInfo[] {
    let comment_url = '';
    if (inner.comment !== null) {
      comment_url = inner.comment.html_url;
    }
    let issue_url = '';
    if (inner.issue.length > 0) {
      issue_url = inner.issue[0].html_url;
    }
    let src_user = '';
    if (inner.sender.length > 0) {
      src_user = inner.sender[0].name;
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${src_user}) 对工单`),
      new LinkExterneInfo(inner.title, issue_url),
      new LinkNoneInfo('发表评论'),
      new LinkExterneInfo(inner.comment?.body || "", comment_url),
    ];
  }

  export class AllGiteeEvent {
    PushEvent?: PushEvent;
    IssueEvent?: IssueEvent;
    PullRequestEvent?: PullRequestEvent;
    NoteEvent?: NoteEvent;
  }

  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllGiteeEvent,
  ): LinkInfo[] {
    if (inner.PushEvent !== undefined) {
      return get_push_simple_content(ev, skip_prj_name, inner.PushEvent);
    } else if (inner.IssueEvent !== undefined) {
      return get_issue_simple_content(ev, skip_prj_name, inner.IssueEvent);
    } else if (inner.PullRequestEvent !== undefined) {
      return get_pr_simple_content(ev, skip_prj_name, inner.PullRequestEvent);
    } else if (inner.NoteEvent !== undefined) {
      return get_note_simple_content(ev, skip_prj_name, inner.NoteEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }
}

namespace robot {
  export type CreateEvent = {
    robot_id: string;
    robot_name: string;
  };

  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
  ): LinkInfo[] {
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建机器人 ${inner.robot_name}`)];
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
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新机器人 ${inner.old_robot_name}`)];
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
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除机器人 ${inner.robot_name}`)];
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
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在机器人 ${inner.robot_name} 增加用户 ${inner.member_display_name} 访问权限`)];
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
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在机器人 ${inner.robot_name} 移除用户 ${inner.member_display_name} 访问权限`)];
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
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新机器人 ${inner.robot_name} 访问令牌`)];
  }

  export class AllRobotEvent {
    CreateEvent?: CreateEvent;
    UpdateEvent?: UpdateEvent;
    RemoveEvent?: RemoveEvent;
    AddAccessUserEvent?: AddAccessUserEvent;
    RemoveAccessUserEvent?: RemoveAccessUserEvent;
    RenewTokenEvent?: RenewTokenEvent;
  };

  export function get_simple_content_inner(
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
}

namespace earthly {
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
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export class AllEarthlyEvent {
    AddRepoEvent?: AddRepoEvent;
    RemoveRepoEvent?: RemoveRepoEvent;
    CreateActionEvent?: CreateActionEvent;
    UpdateActionEvent?: UpdateActionEvent;
    RemoveActionEvent?: RemoveActionEvent;
    ExecEvent?: ExecEvent;
  };

  export function get_simple_content_inner(
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
}

namespace script {
  export type CreateScriptSuiteEvent = {
    script_suite_id: string;
    script_suite_name: string;
  };

  function get_create_script_suite_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateScriptSuiteEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type RemoveScriptSuiteEvent = {
    script_suite_id: string;
    script_suite_name: string;
  };

  function get_remove_script_suite_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveScriptSuiteEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type EnvPermission = {
    allow_all: boolean;
    env_list: string[];
  };

  export type UpdateEnvPermEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_perm: EnvPermission[];
    new_perm: EnvPermission[];
  };

  function get_update_env_perm_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEnvPermEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type SysPermission = {
    allow_hostname: boolean;
    allow_network_interfaces: boolean;
    allow_loadavg: boolean;
    allow_get_uid: boolean;
    allow_get_gid: boolean;
    allow_os_release: boolean;
    allow_system_memory_info: boolean;
  };

  export type UpdateSysPermEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_perm: SysPermission;
    new_perm: SysPermission;
  };

  function get_update_sys_perm_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateSysPermEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type NetPermission = {
    allow_all: boolean;
    addr_list: string[];
    allow_vc_update: boolean;
  }

  export type UpdateNetPermEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_perm: NetPermission;
    new_perm: NetPermission;
  };

  function get_update_net_perm_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateNetPermEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type ReadPermission = {
    allow_all: boolean;
    path_list: string[];
  }

  export type UpdateReadPermEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_perm: ReadPermission;
    new_perm: ReadPermission;
  };

  function get_update_read_perm_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateReadPermEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type WritePermission = {
    allow_all: boolean;
    path_list: string[];
  };

  export type UpdateWritePermEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_perm: WritePermission;
    new_perm: WritePermission;
  };

  function get_update_write_perm_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateWritePermEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type RunPermission = {
    allow_all: boolean;
    file_list: string[];
  };

  export type UpdateRunPermEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_perm: RunPermission;
    new_perm: RunPermission;
  };

  function get_update_run_perm_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateRunPermEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type UpdateScriptEvent = {
    script_suite_id: string;
    script_suite_name: string;
  };

  function get_update_script_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateScriptEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type UpdateExecUserEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_exec_user: string;
    new_exec_user: string;
  };

  function get_update_exec_user_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateExecUserEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type EnvParamDef = {
    env_name: string;
    desc: string;
    default_value: string;
  };

  export type UpdateEnvParamDefEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_env_param_def_list: EnvParamDef[];
    new_env_param_def_list: EnvParamDef[];
  };

  function get_update_env_param_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEnvParamDefEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type ArgParamDef = {
    desc: string;
    default_value: string;
  };

  export type UpdateArgParamDefEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_arg_param_def_list: ArgParamDef[];
    new_arg_param_def_list: ArgParamDef[];
  };

  function get_update_arg_param_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateArgParamDefEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type RecoverScriptEvent = {
    script_suite_id: string;
    script_suite_name: string;
    script_time: number;
  };

  function get_recover_script_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RecoverScriptEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type EnvParam = {
    env_name: string;
    env_value: string;
  };

  export type ExecEvent = {
    exec_id: string;
    script_suite_id: string;
    script_suite_name: string;
    script_time: number;
    env_param_list: EnvParam[];
    arg_param_list: string[];
  };

  function get_exec_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ExecEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export class AllScriptEvent {
    CreateScriptSuiteEvent?: CreateScriptSuiteEvent;
    RemoveScriptSuiteEvent?: RemoveScriptSuiteEvent;
    UpdateEnvPermEvent?: UpdateEnvPermEvent;
    UpdateSysPermEvent?: UpdateSysPermEvent;
    UpdateNetPermEvent?: UpdateNetPermEvent;
    UpdateReadPermEvent?: UpdateReadPermEvent;
    UpdateWritePermEvent?: UpdateWritePermEvent;
    UpdateRunPermEvent?: UpdateRunPermEvent;
    UpdateScriptEvent?: UpdateScriptEvent;
    UpdateExecUserEvent?: UpdateExecUserEvent;
    UpdateEnvParamDefEvent?: UpdateEnvParamDefEvent;
    UpdateArgParamDefEvent?: UpdateArgParamDefEvent;
    RecoverScriptEvent?: RecoverScriptEvent;
    ExecEvent?: ExecEvent;
  };

  export function get_simple_content_inner(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllScriptEvent,
  ): LinkInfo[] {
    if (inner.CreateScriptSuiteEvent !== undefined) {
      return get_create_script_suite_simple_content(ev, skip_prj_name, inner.CreateScriptSuiteEvent);
    } else if (inner.RemoveScriptSuiteEvent !== undefined) {
      return get_remove_script_suite_simple_content(ev, skip_prj_name, inner.RemoveScriptSuiteEvent);
    } else if (inner.UpdateEnvPermEvent !== undefined) {
      return get_update_env_perm_simple_content(ev, skip_prj_name, inner.UpdateEnvPermEvent);
    } else if (inner.UpdateSysPermEvent !== undefined) {
      return get_update_sys_perm_simple_content(ev, skip_prj_name, inner.UpdateSysPermEvent);
    } else if (inner.UpdateNetPermEvent !== undefined) {
      return get_update_net_perm_simple_content(ev, skip_prj_name, inner.UpdateNetPermEvent);
    } else if (inner.UpdateReadPermEvent !== undefined) {
      return get_update_read_perm_simple_content(ev, skip_prj_name, inner.UpdateReadPermEvent);
    } else if (inner.UpdateWritePermEvent !== undefined) {
      return get_update_write_perm_simple_content(ev, skip_prj_name, inner.UpdateWritePermEvent);
    } else if (inner.UpdateRunPermEvent !== undefined) {
      return get_update_run_perm_simple_content(ev, skip_prj_name, inner.UpdateRunPermEvent);
    } else if (inner.UpdateScriptEvent !== undefined) {
      return get_update_script_simple_content(ev, skip_prj_name, inner.UpdateScriptEvent);
    } else if (inner.UpdateExecUserEvent !== undefined) {
      return get_update_exec_user_simple_content(ev, skip_prj_name, inner.UpdateExecUserEvent);
    } else if (inner.UpdateEnvParamDefEvent !== undefined) {
      return get_update_env_param_simple_content(ev, skip_prj_name, inner.UpdateEnvParamDefEvent);
    } else if (inner.UpdateArgParamDefEvent !== undefined) {
      return get_update_arg_param_simple_content(ev, skip_prj_name, inner.UpdateArgParamDefEvent);
    } else if (inner.RecoverScriptEvent !== undefined) {
      return get_recover_script_simple_content(ev, skip_prj_name, inner.RecoverScriptEvent);
    } else if (inner.ExecEvent !== undefined) {
      return get_exec_simple_content(ev, skip_prj_name, inner.ExecEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }
}

export class AllEvent {
  ProjectEvent?: project.AllProjectEvent;
  ProjectDocEvent?: project_doc.AllProjectDocEvent;
  SpritEvent?: sprit.AllSpritEvent;
  TestCaseEvent?: test_case.AllTestCaseEvent;
  IssueEvent?: issue.AllIssueEvent;
  BookShelfEvent?: book_shelf.AllBookShelfEvent;
  ExtEvEvent?: ext_event.AllExtEvEvent;
  GitlabEvent?: gitlab.AllGitlabEvent;
  GogsEvent?: gogs.AllGogsEvent;
  GiteeEvent?: gitee.AllGiteeEvent;
  RobotEvent?: robot.AllRobotEvent;
  EarthlyEvent?: earthly.AllEarthlyEvent;
  ScriptEvent?: script.AllScriptEvent;
}

export function get_simple_content(ev: PluginEvent, skip_prj_name: boolean): LinkInfo[] {
  if (ev.event_data.ProjectEvent !== undefined) {
    return project.get_simple_content_inner(ev, skip_prj_name, ev.event_data.ProjectEvent);
  } else if (ev.event_data.ProjectDocEvent !== undefined) {
    return project_doc.get_simple_content_inner(ev, skip_prj_name, ev.event_data.ProjectDocEvent);
  } else if (ev.event_data.SpritEvent !== undefined) {
    return sprit.get_simple_content_inner(ev, skip_prj_name, ev.event_data.SpritEvent);
  } else if (ev.event_data.TestCaseEvent !== undefined) {
    return test_case.get_simple_content_inner(ev, skip_prj_name, ev.event_data.TestCaseEvent);
  } else if (ev.event_data.IssueEvent !== undefined) {
    return issue.get_simple_content_inner(ev, skip_prj_name, ev.event_data.IssueEvent);
  } else if (ev.event_data.BookShelfEvent !== undefined) {
    return book_shelf.get_simple_content_inner(ev, skip_prj_name, ev.event_data.BookShelfEvent);
  } else if (ev.event_data.ExtEvEvent !== undefined) {
    return ext_event.get_simple_content_inner(ev, skip_prj_name, ev.event_data.ExtEvEvent);
  } else if (ev.event_data.GitlabEvent !== undefined) {
    return gitlab.get_simple_content_inner(ev, skip_prj_name, ev.event_data.GitlabEvent);
  } else if (ev.event_data.GogsEvent !== undefined) {
    return gogs.get_simple_content_inner(ev, skip_prj_name, ev.event_data.GogsEvent);
  } else if (ev.event_data.GiteeEvent !== undefined) {
    return gitee.get_simple_content_inner(ev, skip_prj_name, ev.event_data.GiteeEvent);
  } else if (ev.event_data.RobotEvent !== undefined) {
    return robot.get_simple_content_inner(ev, skip_prj_name, ev.event_data.RobotEvent);
  } else if (ev.event_data.EarthlyEvent !== undefined) {
    return earthly.get_simple_content_inner(ev, skip_prj_name, ev.event_data.EarthlyEvent);
  } else if (ev.event_data.ScriptEvent !== undefined) {
    return script.get_simple_content_inner(ev, skip_prj_name, ev.event_data.ScriptEvent);
  }
  return [new LinkNoneInfo('未知事件')];
}
