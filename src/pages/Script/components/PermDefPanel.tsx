import React from "react";
import { observer, useLocalObservable } from 'mobx-react';
import { useStores } from "@/hooks";
import { useLocation } from "react-router-dom";
import type { LinkScriptSuiteSate } from "@/stores/linkAux";
import { Card, Checkbox, Input, Space, Tag, message } from "antd";
import s from "./PermDefPanel.module.less";
import type { Permission, EnvPermission, SysPermission, NetPermission, ReadPermission, WritePermission, RunPermission } from "@/api/robot_script";
import { runInAction } from "mobx";
import { uniqId } from "@/utils/utils";
import { PlusOutlined } from "@ant-design/icons";
import { update_env_perm, update_sys_perm, update_net_perm, update_read_perm, update_write_perm, update_run_perm, update_exec_user } from "@/api/robot_script";
import { request } from "@/utils/request";
import { EditText } from "@/components/EditCell/EditText";


interface PermDefPanelProps {
    execUser: string;
    permission: Permission;
    onUpdateExecUser: (execUser: string) => void;
    onUpdateEnvPerm: (perm: EnvPermission) => void;
    onUpdateSysPerm: (perm: SysPermission) => void;
    onUpdateNetPerm: (perm: NetPermission) => void;
    onUpdateReadPerm: (perm: ReadPermission) => void;
    onUpdateWritePerm: (perm: WritePermission) => void;
    onUpdateRunPerm: (perm: RunPermission) => void;
}

interface StringItem {
    id: string;
    value: string;
}

const NET_ADDR_REGEX = /^[^:]*:\d+$/;


const PermDefPanel: React.FC<PermDefPanelProps> = (props) => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const location = useLocation();

    const state = location.state as LinkScriptSuiteSate;

    const localStore = useLocalObservable(() => ({
        execUser: props.execUser,
        setExecUser(value: string) {
            runInAction(() => {
                this.execUser = value;
            });
        },
        //环境变量访问权限
        envAllowAll: props.permission.env_perm.allow_all,
        setEnvAllowAll(value: boolean) {
            runInAction(() => {
                this.envAllowAll = value;
            });
        },
        envPermPathList: props.permission.env_perm.env_list.map(item => (
            {
                id: uniqId(),
                value: item,
            }
        )) as StringItem[],
        setEnvPermPathList(value: StringItem[]) {
            runInAction(() => {
                this.envPermPathList = value;
            });
        },
        envPermPathEdit: false,
        setEnvPermPathEdit(value: boolean) {
            runInAction(() => {
                this.envPermPathEdit = value;
            });
        },
        envPermPathValue: "",
        setEnvPermPathValue(value: string) {
            runInAction(() => {
                this.envPermPathValue = value;
            });
        },
        //系统访问权限
        sysPermHostname: props.permission.sys_perm.allow_hostname,
        setSysPermHostname(value: boolean) {
            runInAction(() => {
                this.sysPermHostname = value;
            });
        },
        sysPermNetworkInterfaces: props.permission.sys_perm.allow_network_interfaces,
        setSysPermNetworkInterfaces(value: boolean) {
            runInAction(() => {
                this.sysPermNetworkInterfaces = value;
            });
        },
        sysPermLoadavg: props.permission.sys_perm.allow_loadavg,
        setSysPermLoadavg(value: boolean) {
            runInAction(() => {
                this.sysPermLoadavg = value;
            });
        },
        sysPermGetUid: props.permission.sys_perm.allow_get_uid,
        setSysPermGetUid(value: boolean) {
            runInAction(() => {
                this.sysPermGetUid = value;
            });
        },
        sysPermGetGid: props.permission.sys_perm.allow_get_gid,
        setSysPermGetGid(value: boolean) {
            runInAction(() => {
                this.sysPermGetGid = value;
            });
        },
        sysPermOsRelease: props.permission.sys_perm.allow_os_release,
        setSysPermOsRelease(value: boolean) {
            runInAction(() => {
                this.sysPermOsRelease = value;
            });
        },
        sysPermSystemMemoryInfo: props.permission.sys_perm.allow_system_memory_info,
        setSysPermSystemMemoryInfo(value: boolean) {
            runInAction(() => {
                this.sysPermSystemMemoryInfo = value;
            });
        },
        //网络访问权限
        netAllowAll: props.permission.net_perm.allow_all,
        setNetAllowAll(value: boolean) {
            runInAction(() => {
                this.netAllowAll = value;
            });
        },
        netPermAddrList: props.permission.net_perm.addr_list.map(item => (
            {
                id: uniqId(),
                value: item,
            }
        )) as StringItem[],
        setNetPermAddrList(value: StringItem[]) {
            runInAction(() => {
                this.netPermAddrList = value;
            });
        },
        netPermAddrEdit: false,
        setNetPermAddrEdit(value: boolean) {
            runInAction(() => {
                this.netPermAddrEdit = value;
            });
        },
        netPermAddrValue: "",
        setNetPermAddrValue(value: string) {
            runInAction(() => {
                this.netPermAddrValue = value;
            });
        },
        netPermVcUpdate: props.permission.net_perm.allow_vc_update,
        setNetPermVcUpdate(value: boolean) {
            runInAction(() => {
                this.netPermVcUpdate = value;
            });
        },
        //文件和目录读权限
        readAllowAll: props.permission.read_perm.allow_all,
        setReadAllowAll(value: boolean) {
            runInAction(() => {
                this.readAllowAll = value;
            });
        },
        readPermPathList: props.permission.read_perm.path_list.map(item => (
            {
                id: uniqId(),
                value: item,
            }
        )) as StringItem[],
        setReadPermPathList(value: StringItem[]) {
            runInAction(() => {
                this.readPermPathList = value;
            });
        },
        readPermPathEdit: false,
        setReadPermPathEdit(value: boolean) {
            runInAction(() => {
                this.readPermPathEdit = value;
            });
        },
        readPermPathValue: "",
        setReadPermPathValue(value: string) {
            runInAction(() => {
                this.readPermPathValue = value;
            });
        },
        //文件和目录写权限
        writeAllowAll: props.permission.write_perm.allow_all,
        setWriteAllowAll(value: boolean) {
            runInAction(() => {
                this.writeAllowAll = value;
            });
        },
        writePermPathList: props.permission.write_perm.path_list.map(item => (
            {
                id: uniqId(),
                value: item,
            }
        )) as StringItem[],
        setWritePermPathList(value: StringItem[]) {
            runInAction(() => {
                this.writePermPathList = value;
            });
        },
        writePermPathEdit: false,
        setWritePermPathEdit(value: boolean) {
            runInAction(() => {
                this.writePermPathEdit = value;
            });
        },
        writePermPathValue: "",
        setWritePermPathValue(value: string) {
            runInAction(() => {
                this.writePermPathValue = value;
            });
        },
        //外部程序运行权限
        runAllowAll: props.permission.run_perm.allow_all,
        setRunAllowAll(value: boolean) {
            runInAction(() => {
                this.runAllowAll = value;
            });
        },
        runPermFileList: props.permission.run_perm.file_list.map(item => (
            {
                id: uniqId(),
                value: item,
            }
        )) as StringItem[],
        setRunPermFileList(value: StringItem[]) {
            runInAction(() => {
                this.runPermFileList = value;
            });
        },
        runPermFileEdit: false,
        setRunPermFileEdit(value: boolean) {
            runInAction(() => {
                this.runPermFileEdit = value;
            });
        },
        runPermFileValue: "",
        setRunPermFileValue(value: string) {
            runInAction(() => {
                this.runPermFileValue = value;
            });
        },
    }));

    const updateEnvPerm = async (allowAll: boolean, envList: string[]) => {
        const envPerm: EnvPermission = {
            allow_all: allowAll,
            env_list: allowAll ? [] : envList,
        };
        await request(update_env_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            env_perm: envPerm,
        }));
        props.onUpdateEnvPerm(envPerm);
    };

    const addEnvPermPath = async () => {
        localStore.setEnvPermPathEdit(false);
        if (localStore.envPermPathValue != "") {
            const tmpList = localStore.envPermPathList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.envPermPathValue,
            });

            await updateEnvPerm(localStore.envAllowAll, tmpList.map(item => item.value));

            localStore.setEnvPermPathList(tmpList);
            localStore.setEnvPermPathValue("");
        }
    };

    const removeEnvPermPath = async (id: string) => {
        const tmpList = localStore.envPermPathList.filter(item => item.id != id);
        await updateEnvPerm(localStore.envAllowAll, tmpList.map(item => item.value));
        localStore.setEnvPermPathList(tmpList);
    };

    const updateSysPerm = async (perm: SysPermission) => {
        await request(update_sys_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            sys_perm: perm,
        }));
        props.onUpdateSysPerm(perm);
    };

    const updateNetPerm = async (allowAll: boolean, addrList: string[], allowVcUpdate: boolean) => {
        const netPerm: NetPermission = {
            allow_all: allowAll,
            addr_list: allowAll ? [] : addrList,
            allow_vc_update: allowAll ? false : allowVcUpdate,
        };
        await request(update_net_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            net_perm: netPerm,
        }));
        props.onUpdateNetPerm(netPerm);
    };

    const addNetPermAddr = async () => {
        localStore.setNetPermAddrEdit(false);
        if (localStore.netPermAddrValue != "") {
            if (NET_ADDR_REGEX.test(localStore.netPermAddrValue) == false) {
                message.error("网络地址必须是 hostname:port 这样的格式");
                return;
            }
            const tmpList = localStore.netPermAddrList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.netPermAddrValue,
            });
            await updateNetPerm(localStore.netAllowAll, tmpList.map(item => item.value), localStore.netPermVcUpdate);
            localStore.setNetPermAddrList(tmpList);
            localStore.setNetPermAddrValue("");
        }
    };

    const removeNetPermAddr = async (id: string) => {
        const tmpList = localStore.netPermAddrList.filter(item => item.id != id);
        await updateNetPerm(localStore.netAllowAll, tmpList.map(item => item.value), localStore.netPermVcUpdate);
        localStore.setNetPermAddrList(tmpList);
    };

    const updateReadPerm = async (allowAll: boolean, pathList: string[]) => {
        const readPerm: ReadPermission = {
            allow_all: allowAll,
            path_list: allowAll ? [] : pathList,
        };
        await request(update_read_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            read_perm: readPerm,
        }));
        props.onUpdateReadPerm(readPerm);
    };

    const addReadPermPath = async () => {
        localStore.setReadPermPathEdit(false);
        if (localStore.readPermPathValue != "") {
            if (localStore.readPermPathValue.startsWith("/") == false) {
                message.error("文件/目录必须是绝对路径");
                return;
            }
            const tmpList = localStore.readPermPathList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.readPermPathValue,
            });
            await updateReadPerm(localStore.readAllowAll, tmpList.map(item => item.value));
            localStore.setReadPermPathList(tmpList);
            localStore.setReadPermPathValue("");
        }
    };

    const removeReadPermPath = async (id: string) => {
        const tmpList = localStore.readPermPathList.filter(item => item.id != id);
        await updateReadPerm(localStore.readAllowAll, tmpList.map(item => item.value));
        localStore.setReadPermPathList(tmpList);
    }

    const updateWritePerm = async (allowAll: boolean, pathList: string[]) => {
        const writePerm: WritePermission = {
            allow_all: allowAll,
            path_list: allowAll ? [] : pathList,
        };
        await request(update_write_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            write_perm: writePerm,
        }));
        props.onUpdateWritePerm(writePerm);
    };

    const addWritePermPath = async () => {
        localStore.setWritePermPathEdit(false);
        if (localStore.writePermPathValue != "") {
            if (localStore.writePermPathValue.startsWith("/") == false) {
                message.error("文件/目录必须是绝对路径");
                return;
            }
            const tmpList = localStore.writePermPathList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.writePermPathValue,
            });
            await updateWritePerm(localStore.writeAllowAll, tmpList.map(item => item.value));
            localStore.setWritePermPathList(tmpList);
            localStore.setWritePermPathValue("");
        }
    };

    const removeWritePermPath = async (id: string) => {
        const tmpList = localStore.writePermPathList.filter(item => item.id != id);
        await updateWritePerm(localStore.writeAllowAll, tmpList.map(item => item.value));
        localStore.setWritePermPathList(tmpList);
    }

    const updateRunPerm = async (allowAll: boolean, fileList: string[]) => {
        const runPerm: RunPermission = {
            allow_all: allowAll,
            file_list: allowAll ? [] : fileList,
        };
        await request(update_run_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            run_perm: runPerm,
        }));
        props.onUpdateRunPerm(runPerm)
    };

    const addRunPermFile = async () => {
        localStore.setRunPermFileEdit(false);
        if (localStore.runPermFileValue != "") {
            const tmpList = localStore.runPermFileList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.runPermFileValue,
            });
            await updateRunPerm(localStore.runAllowAll, tmpList.map(item => item.value));
            localStore.setRunPermFileList(tmpList);
            localStore.setRunPermFileValue("");
        }
    };

    const removeRunPermFile = async (id: string) => {
        const tmpList = localStore.runPermFileList.filter(item => item.id != id);
        await updateRunPerm(localStore.runAllowAll, tmpList.map(item => item.value));
        localStore.setRunPermFileList(tmpList);
    }

    return (
        <div style={{ height: "calc(100vh - 270px)", overflowY: "scroll" }}>
            <div style={{ display: "flex", paddingLeft: "12px" }}>
                <h2 className={s.head} style={{ width: "220px", marginBottom: "0px", alignSelf: "center" }}>执行用户(可选，默认为root): </h2>
                <EditText editable={projectStore.isAdmin} content={localStore.execUser} onChange={async (value) => {
                    try {
                        await request(update_exec_user({
                            session_id: userStore.sessionId,
                            project_id: projectStore.curProjectId,
                            script_suite_id: state.scriptSuiteId,
                            exec_user: value,
                        }));
                        localStore.setExecUser(value);
                        props.onUpdateExecUser(value);
                        return true;
                    } catch (e) {
                        console.log(e);
                    }
                    return false;
                }} showEditIcon={true} />
            </div>
            <Card title={<h2 className={s.head}>访问系统变量权限</h2>} bordered={false} extra={
                <Checkbox checked={localStore.envAllowAll}
                    disabled={!projectStore.isAdmin}
                    onChange={e => {
                        e.stopPropagation();
                        updateEnvPerm(e.target.checked, localStore.envPermPathList.map(item => item.value)).then(() => {
                            localStore.setEnvAllowAll(e.target.checked);
                        });
                    }}>访问全部环境变量</Checkbox>
            }>
                {localStore.envAllowAll == false && (
                    <div className={s.tag_list}>
                        {localStore.envPermPathList.map(item => (
                            <Tag key={item.id} closable={projectStore.isAdmin} className={s.tag} onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeEnvPermPath(item.id);
                            }}>
                                {item.value}
                            </Tag>
                        ))}
                        {projectStore.isAdmin && (
                            <>
                                {localStore.envPermPathEdit == true && (
                                    <Input type="text" className={s.tag_input}
                                        onBlur={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addEnvPermPath();
                                        }}
                                        onPressEnter={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addEnvPermPath();
                                        }}
                                        onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            localStore.setEnvPermPathValue(e.target.value.trim());
                                        }} />
                                )}
                                {localStore.envPermPathEdit == false && (
                                    <Tag className={s.tag_plus} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        localStore.setEnvPermPathEdit(true);
                                    }}>
                                        <PlusOutlined /> 新增环境变量权限
                                    </Tag>
                                )}
                            </>
                        )}
                    </div>
                )}
            </Card>

            <Card title={<h2 className={s.head}>系统信息访问权限</h2>} bordered={false}>
                <div>
                    <Checkbox checked={localStore.sysPermHostname}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateSysPerm({
                                allow_hostname: e.target.checked,
                                allow_network_interfaces: localStore.sysPermNetworkInterfaces,
                                allow_loadavg: localStore.sysPermLoadavg,
                                allow_get_uid: localStore.sysPermGetUid,
                                allow_get_gid: localStore.sysPermGetGid,
                                allow_os_release: localStore.sysPermOsRelease,
                                allow_system_memory_info: localStore.sysPermSystemMemoryInfo,
                            }).then(() => {
                                localStore.setSysPermHostname(e.target.checked);
                            });

                        }}>Deno.hostname</Checkbox>
                    <Checkbox checked={localStore.sysPermNetworkInterfaces}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateSysPerm({
                                allow_hostname: localStore.sysPermHostname,
                                allow_network_interfaces: e.target.checked,
                                allow_loadavg: localStore.sysPermLoadavg,
                                allow_get_uid: localStore.sysPermGetUid,
                                allow_get_gid: localStore.sysPermGetGid,
                                allow_os_release: localStore.sysPermOsRelease,
                                allow_system_memory_info: localStore.sysPermSystemMemoryInfo,
                            }).then(() => {
                                localStore.setSysPermNetworkInterfaces(e.target.checked);
                            });
                        }}>Deno.networkInterfaces</Checkbox>
                    <Checkbox checked={localStore.sysPermLoadavg}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateSysPerm({
                                allow_hostname: localStore.sysPermHostname,
                                allow_network_interfaces: localStore.sysPermNetworkInterfaces,
                                allow_loadavg: e.target.checked,
                                allow_get_uid: localStore.sysPermGetUid,
                                allow_get_gid: localStore.sysPermGetGid,
                                allow_os_release: localStore.sysPermOsRelease,
                                allow_system_memory_info: localStore.sysPermSystemMemoryInfo,
                            }).then(() => {
                                localStore.setSysPermLoadavg(e.target.checked);
                            });
                        }}>Deno.loadavg</Checkbox>
                    <Checkbox checked={localStore.sysPermGetUid}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateSysPerm({
                                allow_hostname: localStore.sysPermHostname,
                                allow_network_interfaces: localStore.sysPermNetworkInterfaces,
                                allow_loadavg: localStore.sysPermLoadavg,
                                allow_get_uid: e.target.checked,
                                allow_get_gid: localStore.sysPermGetGid,
                                allow_os_release: localStore.sysPermOsRelease,
                                allow_system_memory_info: localStore.sysPermSystemMemoryInfo,
                            }).then(() => {
                                localStore.setSysPermGetUid(e.target.checked);
                            });
                        }}>Deno.uid</Checkbox>
                    <Checkbox checked={localStore.sysPermGetGid}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateSysPerm({
                                allow_hostname: localStore.sysPermHostname,
                                allow_network_interfaces: localStore.sysPermNetworkInterfaces,
                                allow_loadavg: localStore.sysPermLoadavg,
                                allow_get_uid: localStore.sysPermGetUid,
                                allow_get_gid: e.target.checked,
                                allow_os_release: localStore.sysPermOsRelease,
                                allow_system_memory_info: localStore.sysPermSystemMemoryInfo,
                            }).then(() => {
                                localStore.setSysPermGetGid(e.target.checked);
                            });

                        }}>Deno.gid</Checkbox>
                    <Checkbox checked={localStore.sysPermOsRelease}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateSysPerm({
                                allow_hostname: localStore.sysPermHostname,
                                allow_network_interfaces: localStore.sysPermNetworkInterfaces,
                                allow_loadavg: localStore.sysPermLoadavg,
                                allow_get_uid: localStore.sysPermGetUid,
                                allow_get_gid: localStore.sysPermGetGid,
                                allow_os_release: e.target.checked,
                                allow_system_memory_info: localStore.sysPermSystemMemoryInfo,
                            }).then(() => {
                                localStore.setSysPermOsRelease(e.target.checked);
                            });
                        }}>Deno.osRelease</Checkbox>
                    <Checkbox checked={localStore.sysPermSystemMemoryInfo}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateSysPerm({
                                allow_hostname: localStore.sysPermHostname,
                                allow_network_interfaces: localStore.sysPermNetworkInterfaces,
                                allow_loadavg: localStore.sysPermLoadavg,
                                allow_get_uid: localStore.sysPermGetUid,
                                allow_get_gid: localStore.sysPermGetGid,
                                allow_os_release: localStore.sysPermOsRelease,
                                allow_system_memory_info: e.target.checked,
                            }).then(() => {
                                localStore.setSysPermSystemMemoryInfo(e.target.checked);
                            });
                        }}>Deno.systemMemoryInfo</Checkbox>
                </div>
            </Card>
            <Card title={<h2 className={s.head}>网络访问权限</h2>} bordered={false} extra={
                <Space>
                    <Checkbox checked={localStore.netAllowAll}
                        disabled={!projectStore.isAdmin}
                        onChange={e => {
                            e.stopPropagation();
                            updateNetPerm(e.target.checked, localStore.netPermAddrList.map(item => item.value), localStore.netPermVcUpdate).then(() => {
                                localStore.setNetAllowAll(e.target.checked);
                            });

                        }}>访问全部网络</Checkbox>
                    <Checkbox checked={localStore.netAllowAll || localStore.netPermVcUpdate}
                        disabled={!projectStore.isAdmin || localStore.netAllowAll} onChange={e => {
                            e.stopPropagation();
                            updateNetPerm(localStore.netAllowAll, localStore.netPermAddrList.map(item => item.value), e.target.checked).then(() => {
                                localStore.setNetPermVcUpdate(e.target.checked);
                            });
                        }}>可更新可变内容块</Checkbox>
                </Space>
            }>
                {localStore.netAllowAll == false && (
                    <div className={s.tag_list}>
                        {localStore.netPermAddrList.map(item => (
                            <Tag key={item.id} closable={projectStore.isAdmin} className={s.tag} onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeNetPermAddr(item.id);
                            }}>
                                {item.value}
                            </Tag>
                        ))}
                        {projectStore.isAdmin && (
                            <>
                                {localStore.netPermAddrEdit == true && (
                                    <Input type="text" className={s.tag_input}
                                        onBlur={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addNetPermAddr();
                                        }}
                                        onPressEnter={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addNetPermAddr();
                                        }}
                                        onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            localStore.setNetPermAddrValue(e.target.value.trim());
                                        }} />
                                )}
                                {localStore.netPermAddrEdit == false && (
                                    <Tag className={s.tag_plus} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        localStore.setNetPermAddrEdit(true);
                                    }}>
                                        <PlusOutlined /> 新增网络地址
                                    </Tag>
                                )}
                            </>
                        )}
                    </div>
                )}
            </Card>
            <Card title={<h2 className={s.head}>文件/目录读权限</h2>} bordered={false} extra={
                <Checkbox checked={localStore.readAllowAll}
                    disabled={!projectStore.isAdmin}
                    onChange={e => {
                        e.stopPropagation();
                        updateReadPerm(e.target.checked, localStore.readPermPathList.map(item => item.value)).then(() => {
                            localStore.setReadAllowAll(e.target.checked);
                        });
                    }}>所有文件目录可读</Checkbox>
            }>
                {localStore.readAllowAll == false && (
                    <div className={s.tag_list}>
                        {localStore.readPermPathList.map(item => (
                            <Tag key={item.id} closable={projectStore.isAdmin} className={s.tag} onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeReadPermPath(item.id);
                            }}>
                                {item.value}
                            </Tag>
                        ))}
                        {projectStore.isAdmin && (
                            <>
                                {localStore.readPermPathEdit == true && (
                                    <Input type="text" className={s.tag_input}
                                        onBlur={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addReadPermPath();
                                        }}
                                        onPressEnter={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addReadPermPath();
                                        }}
                                        onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            localStore.setReadPermPathValue(e.target.value.trim());
                                        }} />
                                )}
                                {localStore.readPermPathEdit == false && (
                                    <Tag className={s.tag_plus} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        localStore.setReadPermPathEdit(true);
                                    }}>
                                        <PlusOutlined /> 新增文件/目录
                                    </Tag>
                                )}
                            </>
                        )}
                    </div>
                )}
            </Card>
            <Card title={<h2 className={s.head}>文件/目录写权限</h2>} bordered={false} extra={
                <Checkbox checked={localStore.writeAllowAll}
                    disabled={!projectStore.isAdmin}
                    onChange={e => {
                        e.stopPropagation();
                        updateWritePerm(e.target.checked, localStore.writePermPathList.map(item => item.value)).then(() => {
                            localStore.setWriteAllowAll(e.target.checked);
                        });
                    }}>所有文件目录可写</Checkbox>
            }>
                {localStore.writeAllowAll == false && (
                    <div className={s.tag_list}>
                        {localStore.writePermPathList.map(item => (
                            <Tag key={item.id} closable={projectStore.isAdmin} className={s.tag} onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeWritePermPath(item.id);
                            }}>
                                {item.value}
                            </Tag>
                        ))}
                        {projectStore.isAdmin && (
                            <>
                                {localStore.writePermPathEdit == true && (
                                    <Input type="text" className={s.tag_input}
                                        onBlur={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addWritePermPath();
                                        }}
                                        onPressEnter={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addWritePermPath();
                                        }}
                                        onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            localStore.setWritePermPathValue(e.target.value.trim());
                                        }} />
                                )}
                                {localStore.writePermPathEdit == false && (
                                    <Tag className={s.tag_plus} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        localStore.setWritePermPathEdit(true);
                                    }}>
                                        <PlusOutlined /> 新增文件/目录
                                    </Tag>
                                )}
                            </>
                        )}
                    </div>
                )}
            </Card>
            <Card title={<h2 className={s.head}>外部程序运行权限(<span style={{ color: "red" }}>外部程序不受上述网络和文件读写约束</span>)</h2>} bordered={false} extra={
                <Checkbox checked={localStore.runAllowAll} onChange={e => {
                    e.stopPropagation();
                    updateRunPerm(e.target.checked, localStore.runPermFileList.map(item => item.value)).then(() => {
                        localStore.setRunAllowAll(e.target.checked);
                    });
                }}>可运行所有外部程序</Checkbox>
            }>
                {localStore.runAllowAll == false && (
                    <div className={s.tag_list}>
                        {localStore.runPermFileList.map(item => (
                            <Tag key={item.id} closable className={s.tag} onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeRunPermFile(item.id);
                            }}>
                                {item.value}
                            </Tag>
                        ))}
                        {localStore.runPermFileEdit == true && (
                            <Input type="text" className={s.tag_input}
                                onBlur={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    addRunPermFile();
                                }}
                                onPressEnter={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    addRunPermFile();
                                }}
                                onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    localStore.setRunPermFileValue(e.target.value.trim());
                                }} />
                        )}
                        {localStore.runPermFileEdit == false && (
                            <Tag className={s.tag_plus} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                localStore.setRunPermFileEdit(true);
                            }}>
                                <PlusOutlined /> 新增外部程序
                            </Tag>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default observer(PermDefPanel);