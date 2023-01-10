import React from "react";
import { observer, useLocalObservable } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from '@/components/DetailsNav';
import Button from "@/components/Button";
import { Card, Checkbox, Input, Space, Tag, Tooltip } from 'antd';
import { useHistory } from "react-router-dom";
import CodeEditor from '@uiw/react-textarea-code-editor';
import s from "./CreateScript.module.less";
import { runInAction } from "mobx";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";

interface StringItem {
    id: string;
    value: string;
}

const NET_ADDR_REGEX = /^[^:]*:\d+$/;

const CreateScript = () => {
    const history = useHistory();

    const localStore = useLocalObservable(() => ({
        title: "",
        setTitle(value: string) {
            runInAction(() => {
                this.title = value;
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
        //文件和目录读取权限
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
    }));

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
                            //TODO
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
                        localStore.setTitle(e.target.value);
                    }}
                />
                <Card bordered={false}>
                    <CodeEditor
                        language="typescript"
                        minHeight={200}
                        placeholder="请输入代码"
                        onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            //TODO
                        }}
                        style={{
                            fontSize: 14,
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                </Card>

                <Card bordered={false}>
                    <div className={s.exec_user}>
                        <h2 style={{ width: "100px", marginBottom: "0px", alignSelf: "center" }}>执行用户: </h2>
                        <Input />
                    </div>
                </Card>
                <Card title={<h1>脚本运行参数设置</h1>} style={{ marginBottom: "20px" }}>
                    <Card title={<h2>环境参数定义</h2>} bordered={false}>
                        111
                    </Card>
                    <Card title={<h2>脚本运行参数定义</h2>} bordered={false}>
                        11
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
                                    <Tag key={item.id} closable className={s.tag}>
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
                                    <Tag key={item.id} closable className={s.tag}>
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
                        <Checkbox checked={localStore.readAllowAll} onChange={e=>{
                            e.stopPropagation();
                            localStore.setReadAllowAll(e.target.checked);
                        }}>所有文件目录可读</Checkbox>
                    }>
                        11
                    </Card>
                    <Card title={<h2>文件/目录写权限</h2>} bordered={false}>
                        11
                    </Card>
                    <Card title={<h2>外部程序运行权限</h2>} bordered={false}>
                        11
                    </Card>
                </Card>
            </div>
        </CardWrap>
    );
};

export default observer(CreateScript);