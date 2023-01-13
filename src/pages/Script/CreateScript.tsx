import React, { useState } from "react";
import { observer, useLocalObservable } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from '@/components/DetailsNav';
import Button from "@/components/Button";
import { Card, Checkbox, Input, Space, Tag, Tooltip, Table, message } from 'antd';
import { useHistory } from "react-router-dom";
import CodeEditor from '@uiw/react-textarea-code-editor';
import s from "./CreateScript.module.less";
import { runInAction } from "mobx";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";
import type { EnvParamDef, ArgParamDef } from "@/api/robot_script";
import AddEnvDefModal from "./components/AddEnvDefModal";
import AddArgDefModal from "./components/AddArgDefModal";
import type { ColumnsType } from 'antd/es/table';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { create_script_suite } from '@/api/robot_script';

interface StringItem {
    id: string;
    value: string;
}

interface EnvParamDefItem {
    id: string;
    value: EnvParamDef;
}

interface ArgParamDefItem {
    id: string;
    value: ArgParamDef;
}

const NET_ADDR_REGEX = /^[^:]*:\d+$/;

const CreateScript = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [showEnvDefModal, setShowEnvDefModal] = useState(false);
    const [showArgDefModal, setShowArgDefModal] = useState(false);

    const localStore = useLocalObservable(() => ({
        title: "",
        setTitle(value: string) {
            runInAction(() => {
                this.title = value;
            });
        },
        scriptContent: "",
        setScriptContent(value: string) {
            runInAction(() => {
                this.scriptContent = value;
            });
        },
        execUser: "",
        setExecUser(value: string) {
            runInAction(() => {
                this.execUser = value;
            });
        },
        //环境变量访问权限
        envAllowAll: false,
        setEnvAllowAll(value: boolean) {
            runInAction(() => {
                this.envAllowAll = value;
            });
        },
        envPermPathList: [] as StringItem[],
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
        sysPermHostname: false,
        setSysPermHostname(value: boolean) {
            runInAction(() => {
                this.sysPermHostname = value;
            });
        },
        sysPermNetworkInterfaces: false,
        setSysPermNetworkInterfaces(value: boolean) {
            runInAction(() => {
                this.sysPermNetworkInterfaces = value;
            });
        },
        sysPermLoadavg: false,
        setSysPermLoadavg(value: boolean) {
            runInAction(() => {
                this.sysPermLoadavg = value;
            });
        },
        sysPermGetUid: false,
        setSysPermGetUid(value: boolean) {
            runInAction(() => {
                this.sysPermGetUid = value;
            });
        },
        sysPermGetGid: false,
        setSysPermGetGid(value: boolean) {
            runInAction(() => {
                this.sysPermGetGid = value;
            });
        },
        sysPermOsRelease: false,
        setSysPermOsRelease(value: boolean) {
            runInAction(() => {
                this.sysPermOsRelease = value;
            });
        },
        sysPermSystemMemoryInfo: false,
        setSysPermSystemMemoryInfo(value: boolean) {
            runInAction(() => {
                this.sysPermSystemMemoryInfo = value;
            });
        },
        //网络访问权限
        netAllowAll: false,
        setNetAllowAll(value: boolean) {
            runInAction(() => {
                this.netAllowAll = value;
            });
        },
        netPermAddrList: [] as StringItem[],
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
        netPermVcUpdate: false,
        setNetPermVcUpdate(value: boolean) {
            runInAction(() => {
                this.netPermVcUpdate = value;
            });
        },
        //文件和目录读权限
        readAllowAll: false,
        setReadAllowAll(value: boolean) {
            runInAction(() => {
                this.readAllowAll = value;
            });
        },
        readPermPathList: [] as StringItem[],
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
        writeAllowAll: false,
        setWriteAllowAll(value: boolean) {
            runInAction(() => {
                this.writeAllowAll = value;
            });
        },
        writePermPathList: [] as StringItem[],
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
        runAllowAll: false,
        setRunAllowAll(value: boolean) {
            runInAction(() => {
                this.runAllowAll = value;
            });
        },
        runPermFileList: [] as StringItem[],
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
        //环境变量定义
        envDefList: [] as EnvParamDefItem[],
        setEnvDefList(value: EnvParamDefItem[]) {
            runInAction(() => {
                this.envDefList = value;
            });
        },
        //运行参数定义
        argDefList: [] as ArgParamDefItem[],
        setArgDefList(value: ArgParamDefItem[]) {
            runInAction(() => {
                this.argDefList = value;
            });
        },
    }));

    const envDefColumns: ColumnsType<EnvParamDefItem> = [
        {
            title: "环境变量名",
            dataIndex: ["value", "env_name"],
            width: 150,
        },
        {
            title: "默认值",
            dataIndex: ["value", "default_value"],
            width: 150,
        },
        {
            title: "描述",
            dataIndex: ["value", "desc"],
        },
        {
            title: "操作",
            width: 100,
            render: (_, record: EnvParamDefItem) => (
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = localStore.envDefList.filter(item => item.id != record.id);
                    localStore.setEnvDefList(tmpList);
                }}>删除</Button>
            ),
        }
    ];

    const argDefColumns: ColumnsType<ArgParamDefItem> = [
        {
            title: "参数名",
            render: (_, _record, index: number) => <span>args{index + 1}</span>,
            width: 100,
        },
        {
            title: "默认值",
            dataIndex: ["value", "default_value"],
            width: 150,
        },
        {
            title: "描述",
            dataIndex: ["value", "desc"],
        },
        {
            title: "操作",
            width: 100,
            render: (_, record: ArgParamDefItem) => (
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = localStore.argDefList.filter(item => item.id != record.id);
                    localStore.setArgDefList(tmpList);
                }}>删除</Button>
            ),
        }
    ];

    const addEnvPermPath = () => {
        localStore.setEnvPermPathEdit(false);
        if (localStore.envPermPathValue != "") {
            const tmpList = localStore.envPermPathList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.envPermPathValue,
            });
            localStore.setEnvPermPathList(tmpList);
            localStore.setEnvPermPathValue("");
        }
    };

    const removeEnvPermPath = (id: string) => {
        const tmpList = localStore.envPermPathList.filter(item => item.id != id);
        localStore.setEnvPermPathList(tmpList);
    };

    const addNetPermAddr = () => {
        localStore.setNetPermAddrEdit(false);
        if (localStore.netPermAddrValue != "") {
            const tmpList = localStore.netPermAddrList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.netPermAddrValue,
            });
            localStore.setNetPermAddrList(tmpList);
            localStore.setNetPermAddrValue("");
        }
    };

    const removeNetPermAddr = (id: string) => {
        const tmpList = localStore.netPermAddrList.filter(item => item.id != id);
        localStore.setNetPermAddrList(tmpList);
    };

    const addReadPermPath = () => {
        localStore.setReadPermPathEdit(false);
        if (localStore.readPermPathValue != "") {
            const tmpList = localStore.readPermPathList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.readPermPathValue,
            });
            localStore.setReadPermPathList(tmpList);
            localStore.setReadPermPathValue("");
        }
    };

    const removeReadPermPath = (id: string) => {
        const tmpList = localStore.readPermPathList.filter(item => item.id != id);
        localStore.setReadPermPathList(tmpList);
    }

    const addWritePermPath = () => {
        localStore.setWritePermPathEdit(false);
        if (localStore.writePermPathValue != "") {
            const tmpList = localStore.writePermPathList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.writePermPathValue,
            });
            localStore.setWritePermPathList(tmpList);
            localStore.setWritePermPathValue("");
        }
    };

    const removeWritePermPath = (id: string) => {
        const tmpList = localStore.writePermPathList.filter(item => item.id != id);
        localStore.setWritePermPathList(tmpList);
    }

    const addRunPermFile = () => {
        localStore.setRunPermFileEdit(false);
        if (localStore.runPermFileValue != "") {
            const tmpList = localStore.runPermFileList.slice();
            tmpList.push({
                id: uniqId(),
                value: localStore.runPermFileValue,
            });
            localStore.setRunPermFileList(tmpList);
            localStore.setRunPermFileValue("");
        }
    };

    const removeRunPermFile = (id: string) => {
        const tmpList = localStore.runPermFileList.filter(item => item.id != id);
        localStore.setRunPermFileList(tmpList);
    }

    const createScriptSuite = async () => {
        //检查参数
        if (localStore.title.trim() == "") {
            message.error("脚本标题不能为空");
            return;
        }
        if (localStore.scriptContent.trim() == "") {
            message.error("脚本内容不能为空");
            return;
        }
        for (const envDef of localStore.envDefList) {
            if (envDef.value.env_name.startsWith("ARG_") == false) {
                message.error("环境参数名必须以ARG_开始");
                return;
            }
            if (envDef.value.default_value.trim() == "") {
                message.error("环境参数缺少默认值");
                return;
            }
        }
        for (const argDef of localStore.argDefList) {
            if (argDef.value.default_value.trim() == "") {
                message.error("命令行参数缺少默认值");
                return;
            }
        }
        if (localStore.netAllowAll == false) {
            for (const netAddr of localStore.netPermAddrList) {
                if (NET_ADDR_REGEX.test(netAddr.value) == false) {
                    message.error(`网络访问权限中${netAddr.value}不是合法的网络地址`);
                    return;
                }
            }
        }
        if (localStore.readAllowAll == false) {
            for (const p of localStore.readPermPathList) {
                if (p.value.startsWith("/") == false) {
                    message.error(`文件/目录读权限中${p.value}不是绝对路径`);
                    return;
                }
            }
        }
        if (localStore.writeAllowAll == false) {
            for (const p of localStore.writePermPathList) {
                if (p.value.startsWith("/") == false) {
                    message.error(`文件/目录写权限中${p.value}不是绝对路径`);
                    return;
                }
            }
        }
        //调用接口
        await request(create_script_suite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_name: localStore.title,
            exec_user: localStore.execUser,
            permission: {
                env_perm: {
                    allow_all: localStore.envAllowAll,
                    env_list: localStore.envAllowAll ? [] : localStore.envPermPathList.map(item => item.value),
                },
                sys_perm: {
                    allow_hostname: localStore.sysPermHostname,
                    allow_network_interfaces: localStore.sysPermNetworkInterfaces,
                    allow_loadavg: localStore.sysPermLoadavg,
                    allow_get_uid: localStore.sysPermGetUid,
                    allow_get_gid: localStore.sysPermGetGid,
                    allow_os_release: localStore.sysPermOsRelease,
                    allow_system_memory_info: localStore.sysPermSystemMemoryInfo,
                },
                net_perm: {
                    allow_all: localStore.netAllowAll,
                    addr_list: localStore.netAllowAll ? [] : localStore.netPermAddrList.map(item => item.value),
                    allow_vc_update: localStore.netAllowAll ? false : localStore.netPermVcUpdate,
                },
                read_perm: {
                    allow_all: localStore.readAllowAll,
                    path_list: localStore.readAllowAll ? [] : localStore.readPermPathList.map(item => item.value),
                },
                write_perm: {
                    allow_all: localStore.writeAllowAll,
                    path_list: localStore.writeAllowAll ? [] : localStore.writePermPathList.map(item => item.value),
                },
                run_perm: {
                    allow_all: localStore.runAllowAll,
                    file_list: localStore.runAllowAll ? [] : localStore.runPermFileList.map(item => item.value),
                },
            },
            exec_param_def: {
                env_param_def_list: localStore.envDefList.map(item => item.value),
                arg_param_def_list: localStore.argDefList.map(item => item.value),
            },
            script_content: localStore.scriptContent,
        }));
        linkAuxStore.goToScriptList(history);
    };

    return (
        <CardWrap>
            <DetailsNav title="创建服务端脚本" >
                <Space>
                    <Button type="default" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        history.goBack();
                    }}>取消</Button>
                    <Button
                        title={localStore.title == "" ? "标题为空" : ""}
                        disabled={localStore.title == ""}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            createScriptSuite();
                        }}>创建</Button>
                </Space>
            </DetailsNav>
            <div className={s.content_wrap}>
                <Input
                    allowClear
                    bordered={false}
                    placeholder={`请输入脚本名称`}
                    className={s.title}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        localStore.setTitle(e.target.value.trim());
                    }}
                />
                <Card title={
                    <span>基于<a href="https://deno.land/" target="_blank" rel="noreferrer">deno</a>的脚本,支持javascript和typescript。</span>
                } bordered={false}>
                    <CodeEditor
                        language="typescript"
                        minHeight={200}
                        placeholder="请输入代码"
                        onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            localStore.setScriptContent(e.target.value.trim());
                        }}
                        style={{
                            fontSize: 14,
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                </Card>

                <Card bordered={false}>
                    <div className={s.exec_user}>
                        <h2 style={{ width: "240px", marginBottom: "0px", alignSelf: "center" }}>执行用户(可选，默认为root): </h2>
                        <Input onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            localStore.setExecUser(e.target.value.trim());
                        }} />
                    </div>
                </Card>
                <Card title={<h1>脚本运行参数设置</h1>} style={{ marginBottom: "20px" }}>
                    <Card title={<h2>环境参数定义(通过环境变量传递参数)</h2>} bordered={false} extra={
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowEnvDefModal(true);
                        }}>新建环境参数定义</Button>
                    }>
                        <Table rowKey="id" columns={envDefColumns} dataSource={localStore.envDefList} pagination={false} />
                    </Card>
                    <Card title={<h2>命令行参数定义(comand [args...])</h2>} bordered={false} extra={
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowArgDefModal(true);
                        }}>新建命令行参数定义</Button>
                    }>
                        <Table rowKey="id" columns={argDefColumns} dataSource={localStore.argDefList} pagination={false} />
                    </Card>
                </Card>

                <Card title={<h1>脚本运行权限设置</h1>}>
                    <Card title={<h2>访问系统变量权限</h2>} bordered={false} extra={
                        <Checkbox checked={localStore.envAllowAll} onChange={e => {
                            e.stopPropagation();
                            localStore.setEnvAllowAll(e.target.checked);
                        }}>访问全部环境变量</Checkbox>
                    }>
                        {localStore.envAllowAll == false && (
                            <div className={s.tag_list}>
                                {localStore.envPermPathList.map(item => (
                                    <Tag key={item.id} closable className={s.tag} onClose={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeEnvPermPath(item.id);
                                    }}>
                                        {item.value}
                                    </Tag>
                                ))}
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
                            </div>
                        )}
                    </Card>
                    <Card title={<h2>系统信息访问权限</h2>} bordered={false}>
                        <div>
                            <Checkbox checked={localStore.sysPermHostname} onChange={e => {
                                e.stopPropagation();
                                localStore.setSysPermHostname(e.target.checked);
                            }}>Deno.hostname</Checkbox>
                            <Checkbox checked={localStore.sysPermNetworkInterfaces} onChange={e => {
                                e.stopPropagation();
                                localStore.setSysPermNetworkInterfaces(e.target.checked);
                            }}>Deno.networkInterfaces</Checkbox>
                            <Checkbox checked={localStore.sysPermLoadavg} onChange={e => {
                                e.stopPropagation();
                                localStore.setSysPermLoadavg(e.target.checked);
                            }}>Deno.loadavg</Checkbox>
                            <Checkbox checked={localStore.sysPermGetUid} onChange={e => {
                                e.stopPropagation();
                                localStore.setSysPermGetUid(e.target.checked);
                            }}>Deno.uid</Checkbox>
                            <Checkbox checked={localStore.sysPermGetGid} onChange={e => {
                                e.stopPropagation();
                                localStore.setSysPermGetGid(e.target.checked);
                            }}>Deno.gid</Checkbox>
                            <Checkbox checked={localStore.sysPermOsRelease} onChange={e => {
                                e.stopPropagation();
                                localStore.setSysPermOsRelease(e.target.checked);
                            }}>Deno.osRelease</Checkbox>
                            <Checkbox checked={localStore.sysPermSystemMemoryInfo} onChange={e => {
                                e.stopPropagation();
                                localStore.setSysPermSystemMemoryInfo(e.target.checked);
                            }}>Deno.systemMemoryInfo</Checkbox>
                        </div>
                    </Card>
                    <Card title={<h2>网络访问权限</h2>} bordered={false} extra={
                        <Space>
                            <Checkbox checked={localStore.netAllowAll} onChange={e => {
                                e.stopPropagation();
                                localStore.setNetAllowAll(e.target.checked);
                            }}>访问全部网络</Checkbox>
                            <Checkbox checked={localStore.netAllowAll || localStore.netPermVcUpdate}
                                disabled={localStore.netAllowAll} onChange={e => {
                                    e.stopPropagation();
                                    localStore.setNetPermVcUpdate(e.target.checked);
                                }}>可更新可变内容块</Checkbox>
                        </Space>
                    }>
                        {localStore.netAllowAll == false && (
                            <div className={s.tag_list}>
                                {localStore.netPermAddrList.map(item => (
                                    <Tag key={item.id} closable className={s.tag} onClose={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeNetPermAddr(item.id);
                                    }}>
                                        {NET_ADDR_REGEX.test(item.value) == false && (
                                            <Tooltip title="需要符合hostname:port的格式">
                                                <WarningOutlined className={s.warn_icon} />
                                            </Tooltip>
                                        )}
                                        {item.value}
                                    </Tag>
                                ))}
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
                            </div>
                        )}
                    </Card>
                    <Card title={<h2>文件/目录读权限</h2>} bordered={false} extra={
                        <Checkbox checked={localStore.readAllowAll} onChange={e => {
                            e.stopPropagation();
                            localStore.setReadAllowAll(e.target.checked);
                        }}>所有文件目录可读</Checkbox>
                    }>
                        {localStore.readAllowAll == false && (
                            <div className={s.tag_list}>
                                {localStore.readPermPathList.map(item => (
                                    <Tag key={item.id} closable className={s.tag} onClose={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeReadPermPath(item.id);
                                    }}>
                                        {item.value.startsWith("/") == false && (
                                            <Tooltip title="只支持绝对路径">
                                                <WarningOutlined className={s.warn_icon} />
                                            </Tooltip>
                                        )}
                                        {item.value}
                                    </Tag>
                                ))}
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
                            </div>
                        )}
                    </Card>
                    <Card title={<h2>文件/目录写权限</h2>} bordered={false} extra={
                        <Checkbox checked={localStore.writeAllowAll} onChange={e => {
                            e.stopPropagation();
                            localStore.setWriteAllowAll(e.target.checked);
                        }}>所有文件目录可写</Checkbox>
                    }>
                        {localStore.writeAllowAll == false && (
                            <div className={s.tag_list}>
                                {localStore.writePermPathList.map(item => (
                                    <Tag key={item.id} closable className={s.tag} onClose={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeWritePermPath(item.id);
                                    }}>
                                        {item.value.startsWith("/") == false && (
                                            <Tooltip title="只支持绝对路径">
                                                <WarningOutlined className={s.warn_icon} />
                                            </Tooltip>
                                        )}
                                        {item.value}
                                    </Tag>
                                ))}
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
                            </div>
                        )}
                    </Card>
                    <Card title={<h2>外部程序运行权限(<span style={{ color: "red" }}>外部程序不受上述网络和文件读写约束</span>)</h2>} bordered={false} extra={
                        <Checkbox checked={localStore.runAllowAll} onChange={e => {
                            e.stopPropagation();
                            localStore.setRunAllowAll(e.target.checked);
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
                </Card>
            </div>
            {showEnvDefModal == true && (
                <AddEnvDefModal onCancel={() => setShowEnvDefModal(false)} onOk={envDef => {
                    const tmpList = localStore.envDefList.slice();
                    tmpList.push({
                        id: uniqId(),
                        value: envDef,
                    });
                    localStore.setEnvDefList(tmpList);
                    setShowEnvDefModal(false);
                }} />
            )}
            {showArgDefModal == true && (
                <AddArgDefModal onCancel={() => setShowArgDefModal(false)} onOk={argDef => {
                    const tmpList = localStore.argDefList.slice();
                    tmpList.push({
                        id: uniqId(),
                        value: argDef,
                    });
                    localStore.setArgDefList(tmpList);
                    setShowArgDefModal(false);
                }} />
            )}
        </CardWrap>
    );
};

export default observer(CreateScript);