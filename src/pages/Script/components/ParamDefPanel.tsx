import React, { useState } from "react";
import { observer, useLocalObservable } from 'mobx-react';
import type { ExecParamDef, EnvParamDef, ArgParamDef } from "@/api/robot_script";
import { update_env_param_def, update_arg_param_def } from "@/api/robot_script";
import { useLocation } from "react-router-dom";
import type { LinkScriptSuiteSate } from "@/stores/linkAux";
import { uniqId } from "@/utils/utils";
import { runInAction } from "mobx";
import { Card, Table } from "antd";
import Button from "@/components/Button";
import type { ColumnsType } from 'antd/es/table';
import AddEnvDefModal from "./AddEnvDefModal";
import AddArgDefModal from "./AddArgDefModal";
import { EditText } from "@/components/EditCell/EditText";
import { useStores } from "@/hooks";
import { EditTextArea } from "@/components/EditCell/EditTextArea";
import { request } from "@/utils/request";

interface ParamDefPanelProps {
    execParamDef: ExecParamDef;
    onUpdateEnvDef: (envDefList: EnvParamDef[]) => void;
    onUpdateArgDef: (argDefList: ArgParamDef[]) => void;
}

interface EnvParamDefItem {
    id: string;
    value: EnvParamDef;
}
interface ArgParamDefItem {
    id: string;
    value: ArgParamDef;
}

const ParamDefPanel: React.FC<ParamDefPanelProps> = (props) => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const location = useLocation();

    const state = location.state as LinkScriptSuiteSate;

    const [showEnvDefModal, setShowEnvDefModal] = useState(false);
    const [showArgDefModal, setShowArgDefModal] = useState(false);

    const localStore = useLocalObservable(() => ({
        envParamDefList: props.execParamDef.env_param_def_list.map(item => ({
            id: uniqId(),
            value: item,
        })) as EnvParamDefItem[],
        setEnvParamDefList(value: EnvParamDefItem[]) {
            runInAction(() => {
                this.envParamDefList = value;
            });
        },
        argParamDefList: props.execParamDef.arg_param_def_list.map(item => ({
            id: uniqId(),
            value: item,
        })) as ArgParamDefItem[],
        setArgParamDefList(value: ArgParamDefItem[]) {
            runInAction(() => {
                this.argParamDefList = value;
            });
        }
    }));

    const saveEnvParamDef = async (value: EnvParamDefItem[]) => {
        const envDefList = value.map(item => item.value);
        await request(update_env_param_def({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            env_param_def_list: envDefList,
        }));
        props.onUpdateEnvDef(envDefList);
    };

    const saveArgParamDef = async (value: ArgParamDefItem[]) => {
        const argDefList = value.map(item => item.value);
        await request(update_arg_param_def({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            arg_param_def_list: argDefList,
        }));
        props.onUpdateArgDef(argDefList);
    };

    const envDefColumns: ColumnsType<EnvParamDefItem> = [
        {
            title: "环境变量名",
            width: 200,
            render: (_, record: EnvParamDefItem) => (
                <EditText editable={projectStore.isAdmin} content={record.value.env_name} onChange={async (value) => {
                    const tmpList = localStore.envParamDefList.slice();
                    const index = tmpList.findIndex(item => item.id == record.id);
                    if (index != -1) {
                        tmpList[index].value.env_name = value;
                        localStore.setEnvParamDefList(tmpList);
                        try {
                            saveEnvParamDef(tmpList);
                            return true;
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    return false;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "默认值",
            width: 200,
            render: (_, record: EnvParamDefItem) => (
                <EditText editable={projectStore.isAdmin} content={record.value.default_value} onChange={async (value) => {
                    const tmpList = localStore.envParamDefList.slice();
                    const index = tmpList.findIndex(item => item.id == record.id);
                    if (index != -1) {
                        tmpList[index].value.default_value = value;
                        localStore.setEnvParamDefList(tmpList);
                        try {
                            saveEnvParamDef(tmpList);
                            return true;
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    return false;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "描述",
            render: (_, record: EnvParamDefItem) => (
                <EditTextArea editable={projectStore.isAdmin} content={record.value.desc} onChange={async (value) => {
                    const tmpList = localStore.envParamDefList.slice();
                    const index = tmpList.findIndex(item => item.id == record.id);
                    if (index != -1) {
                        tmpList[index].value.desc = value;
                        localStore.setEnvParamDefList(tmpList);
                        try {
                            saveEnvParamDef(tmpList);
                            return true;
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    return false;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, record: EnvParamDefItem) => (
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = localStore.envParamDefList.filter(item => item.id != record.id);
                    localStore.setEnvParamDefList(tmpList);
                    saveEnvParamDef(tmpList);
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
            width: 200,
            render: (_, record: ArgParamDefItem) => (
                <EditText editable={projectStore.isAdmin} content={record.value.default_value} onChange={async (value) => {
                    const tmpList = localStore.argParamDefList.slice();
                    const index = tmpList.findIndex(item => item.id == record.id);
                    if (index != -1) {
                        tmpList[index].value.default_value = value;
                        localStore.setArgParamDefList(tmpList);
                        try {
                            saveArgParamDef(tmpList);
                            return true;
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    return false;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "描述",
            render: (_, record: ArgParamDefItem) => (
                <EditTextArea editable={projectStore.isAdmin} content={record.value.desc} onChange={async (value) => {
                    const tmpList = localStore.argParamDefList.slice();
                    const index = tmpList.findIndex(item => item.id == record.id);
                    if (index != -1) {
                        tmpList[index].value.desc = value;
                        localStore.setArgParamDefList(tmpList);
                        try {
                            saveArgParamDef(tmpList);
                            return true;
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    return false;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, record: ArgParamDefItem) => (
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = localStore.argParamDefList.filter(item => item.id != record.id);
                    localStore.setArgParamDefList(tmpList);
                    saveArgParamDef(tmpList);
                }}>删除</Button>
            ),
        }
    ];

    return (
        <div style={{ height: "calc(100vh - 240px)", overflowY: "scroll" }}>
            <Card title={<h2>环境参数定义(通过环境变量传递参数)</h2>} bordered={false} extra={
                <Button
                    disabled={!projectStore.isAdmin}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowEnvDefModal(true);
                    }}>新建环境参数定义</Button>
            }>
                <Table rowKey="id" columns={envDefColumns} dataSource={localStore.envParamDefList} pagination={false} />
            </Card>
            <Card title={<h2>脚本运行参数定义(comand [args...])</h2>} bordered={false} extra={
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowArgDefModal(true);
                }}>新建脚本运行参数定义</Button>
            }>
                <Table rowKey="id" columns={argDefColumns} dataSource={localStore.argParamDefList} pagination={false} />
            </Card>
            {showEnvDefModal == true && (
                <AddEnvDefModal onCancel={() => setShowEnvDefModal(false)} onOk={envDef => {
                    const tmpList = localStore.envParamDefList.slice();
                    tmpList.push({
                        id: uniqId(),
                        value: envDef,
                    });
                    localStore.setEnvParamDefList(tmpList);
                    saveEnvParamDef(tmpList);
                    setShowEnvDefModal(false);
                }} />
            )}
            {showArgDefModal == true && (
                <AddArgDefModal onCancel={() => setShowArgDefModal(false)} onOk={argDef => {
                    const tmpList = localStore.argParamDefList.slice();
                    tmpList.push({
                        id: uniqId(),
                        value: argDef,
                    });
                    localStore.setArgParamDefList(tmpList);
                    saveArgParamDef(tmpList);
                    setShowArgDefModal(false);
                }} />
            )}
        </div>
    );
};

export default observer(ParamDefPanel);