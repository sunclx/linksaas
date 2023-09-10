import type { PluginEvent } from '../events';
import { LinkScriptExecInfo, LinkScriptSuiteInfo } from '@/stores/linkAux';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo
} from '@/stores/linkAux';

import moment from 'moment';

export type CreateScriptSuiteEvent = {
    script_suite_id: string;
    script_suite_name: string;
  };

  function get_create_script_suite_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateScriptSuiteEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
    ];
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
    return [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建脚本套件 ${inner.script_suite_name}`)];
  }

  export type UpdateScriptSuiteNameEvent = {
    script_suite_id: string;
    old_name: string;
    new_name: string;
  };

  function get_update_script_suite_name_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateScriptSuiteNameEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建脚本套件`),
      new LinkScriptSuiteInfo(inner.new_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo(`原名称 ${inner.old_name}`)
    ];
  }

  export type EnvPermission = {
    allow_all: boolean;
    env_list: string[];
  };

  export type UpdateEnvPermEvent = {
    script_suite_id: string;
    script_suite_name: string;
    old_perm: EnvPermission;
    new_perm: EnvPermission;
  };

  function get_update_env_perm_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateEnvPermEvent,
  ): LinkInfo[] {
    let oldPerm = `访问全部环境变量：${inner.old_perm.allow_all ? "是" : "否"}`;
    if (inner.old_perm.allow_all == false && inner.old_perm.env_list.length > 0) {
      oldPerm = oldPerm + `,可访问环境变量:` + inner.old_perm.env_list.join(",");
    }
    let newPerm = `访问全部环境变量：${inner.new_perm.allow_all ? "是" : "否"}`;
    if (inner.new_perm.allow_all == false && inner.new_perm.env_list.length > 0) {
      newPerm = newPerm + `,可访问环境变量:` + inner.new_perm.env_list.join(",");
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo("环境变量访问权限"),
      new LinkNoneInfo(`旧权限 ${oldPerm}。`),
      new LinkNoneInfo(`新权限 ${newPerm}。`),
    ];
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

  function get_sys_perm_str(p: SysPermission): string {
    const tmpList: string[] = [];
    if (p.allow_hostname) {
      tmpList.push("hostname");
    }
    if (p.allow_network_interfaces) {
      tmpList.push("networkInterfaces");
    }
    if (p.allow_loadavg) {
      tmpList.push("loadavg");
    }
    if (p.allow_get_uid) {
      tmpList.push("uid");
    }
    if (p.allow_get_gid) {
      tmpList.push("gid");
    }
    if (p.allow_os_release) {
      tmpList.push("osRelease");
    }
    if (p.allow_system_memory_info) {
      tmpList.push("systemMemoryInfo");
    }
    if (tmpList.length == 0) {
      return "无"
    }
    return tmpList.join(",")
  }

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
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo("系统信息访问权限"),
      new LinkNoneInfo(`旧权限 ${get_sys_perm_str(inner.old_perm)}。`),
      new LinkNoneInfo(`新权限 ${get_sys_perm_str(inner.new_perm)}。`),
    ];
  }

  export type NetPermission = {
    allow_all: boolean;
    addr_list: string[];
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
    let oldPerm = `访问全部网络：${inner.old_perm.allow_all ? "是" : "否"}`;
    if (inner.old_perm.allow_all == false && inner.old_perm.addr_list.length > 0) {
      oldPerm = oldPerm + `,可访问网络:` + inner.old_perm.addr_list.join(",");
    }
    let newPerm = `访问全部网络：${inner.new_perm.allow_all ? "是" : "否"}`;
    if (inner.new_perm.allow_all == false && inner.new_perm.addr_list.length > 0) {
      newPerm = newPerm + `,可访问网络:` + inner.new_perm.addr_list.join(",");
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo("网络访问权限"),
      new LinkNoneInfo(`旧权限 ${oldPerm}。`),
      new LinkNoneInfo(`新权限 ${newPerm}。`),
    ];
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
    let oldPerm = `读全部文件/目录：${inner.old_perm.allow_all ? "是" : "否"}`;
    if (inner.old_perm.allow_all == false && inner.old_perm.path_list.length > 0) {
      oldPerm = oldPerm + `,可读文件/目录:` + inner.old_perm.path_list.join(",");
    }
    let newPerm = `读全部文件/目录：${inner.new_perm.allow_all ? "是" : "否"}`;
    if (inner.new_perm.allow_all == false && inner.new_perm.path_list.length > 0) {
      newPerm = newPerm + `,可读文件/目录:` + inner.new_perm.path_list.join(",");
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo("文件/目录读权限"),
      new LinkNoneInfo(`旧权限 ${oldPerm}。`),
      new LinkNoneInfo(`新权限 ${newPerm}。`),
    ];
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
    let oldPerm = `写全部文件/目录：${inner.old_perm.allow_all ? "是" : "否"}`;
    if (inner.old_perm.allow_all == false && inner.old_perm.path_list.length > 0) {
      oldPerm = oldPerm + `,可写文件/目录:` + inner.old_perm.path_list.join(",");
    }
    let newPerm = `写全部文件/目录：${inner.new_perm.allow_all ? "是" : "否"}`;
    if (inner.new_perm.allow_all == false && inner.new_perm.path_list.length > 0) {
      newPerm = newPerm + `,可写文件/目录:` + inner.new_perm.path_list.join(",");
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo("文件/目录写权限"),
      new LinkNoneInfo(`旧权限 ${oldPerm}。`),
      new LinkNoneInfo(`新权限 ${newPerm}。`),
    ];
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
    let oldPerm = `运行所有外部程序：${inner.old_perm.allow_all ? "是" : "否"}`;
    if (inner.old_perm.allow_all == false && inner.old_perm.file_list.length > 0) {
      oldPerm = oldPerm + `,可运行外部程序:` + inner.old_perm.file_list.join(",");
    }
    let newPerm = `运行所有外部程序：${inner.new_perm.allow_all ? "是" : "否"}`;
    if (inner.new_perm.allow_all == false && inner.new_perm.file_list.length > 0) {
      newPerm = newPerm + `,可运行外部程序:` + inner.new_perm.file_list.join(",");
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo("外部程序运行权限"),
      new LinkNoneInfo(`旧权限 ${oldPerm}。`),
      new LinkNoneInfo(`新权限 ${newPerm}。`),
    ];
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
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件脚本`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, true, ev.event_time),
    ];
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
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo(`执行用户。旧执行用户：${inner.old_exec_user == "" ? "root" : inner.old_exec_user}，新执行用户：${inner.new_exec_user == "" ? "root" : inner.new_exec_user}`),
    ];
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
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo(`环境参数定义。旧环境参数定义：${inner.old_env_param_def_list.map(item => item.env_name).join(",")},新环境参数定义：${inner.new_env_param_def_list.map(item => item.env_name).join(",")}`),
    ];
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
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 更新脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo("命令行参数定义。"),
    ];
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
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 恢复脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, false, 0),
      new LinkNoneInfo(`脚本内容到历史(${moment(inner.script_time).format("YYYY-MM-DD HH:mm:ss")})。`),
    ];
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
    let envParamStr = "";
    if (inner.env_param_list.length > 0) {
      envParamStr = `环境参数：${inner.env_param_list.map(item => item.env_name + "=" + item.env_value).join(" , ")}`;
    }
    let argParamStr = "";
    if (inner.arg_param_list.length > 0) {
      argParamStr = `命令行参数：${inner.arg_param_list.join(" ")}`;
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 执行脚本套件`),
      new LinkScriptSuiteInfo(inner.script_suite_name, ev.project_id, inner.script_suite_id, true, inner.script_time),
      new LinkScriptExecInfo("执行结果", ev.project_id, inner.script_suite_id, inner.exec_id),
      new LinkNoneInfo(`${envParamStr} ${argParamStr}`),
    ];
  }

  export class AllScriptEvent {
    CreateScriptSuiteEvent?: CreateScriptSuiteEvent;
    RemoveScriptSuiteEvent?: RemoveScriptSuiteEvent;
    UpdateScriptSuiteNameEvent?: UpdateScriptSuiteNameEvent;
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

  export function get_script_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllScriptEvent,
  ): LinkInfo[] {
    if (inner.CreateScriptSuiteEvent !== undefined) {
      return get_create_script_suite_simple_content(ev, skip_prj_name, inner.CreateScriptSuiteEvent);
    } else if (inner.RemoveScriptSuiteEvent !== undefined) {
      return get_remove_script_suite_simple_content(ev, skip_prj_name, inner.RemoveScriptSuiteEvent);
    } else if (inner.UpdateScriptSuiteNameEvent !== undefined) {
      return get_update_script_suite_name_simple_content(ev, skip_prj_name, inner.UpdateScriptSuiteNameEvent);
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