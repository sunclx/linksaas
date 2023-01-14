import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import { Tabs, Space, Popover, Modal } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkScriptSuiteSate } from "@/stores/linkAux";
import { LinkScriptSuiteInfo } from "@/stores/linkAux";
import { useStores } from "@/hooks";
import s from './ScriptDetail.module.less';
import { request } from "@/utils/request";
import type { ScriptSuiteInfo, EnvParamDef, ArgParamDef } from "@/api/robot_script";
import { get_script_suite, update_script_suite_name, remove_script_suite } from "@/api/robot_script";
import { EditText } from "@/components/EditCell/EditText";
import Button from "@/components/Button";
import ScriptContentPanel from "./components/ScriptContentPanel";
import ParamDefPanel from "./components/ParamDefPanel";
import PermDefPanel from "./components/PermDefPanel";
import ExecListPanel from "./components/ExecListPanel";
import { MoreOutlined } from "@ant-design/icons";
import ExecModal from "./components/ExecModal";


const ScriptDetail = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const location = useLocation();
    const history = useHistory();

    const state = location.state as LinkScriptSuiteSate;
    const activeKey = state.tab ?? "scriptContent";

    const [scriptSuiteInfo, setScriptSuiteInfo] = useState<ScriptSuiteInfo | null>(null);
    const [showExecModal, setShowExecModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const loadScriptSuite = async () => {
        const res = await request(get_script_suite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            use_history_script: state.useHistoryScript,
            script_time: state.scriptTime,
        }));
        setScriptSuiteInfo(res.script_suite_info);
    }

    const removeScript = async () => {
        await request(remove_script_suite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
        }));
        linkAuxStore.goToScriptList(history);
    };

    useEffect(() => {
        loadScriptSuite();
    }, [activeKey]);

    return (
        <CardWrap>
            <DetailsNav title={<div className={s.nav_title}>
                <span>服务端脚本:&nbsp;&nbsp;</span>
                {scriptSuiteInfo != null && (
                    <EditText editable={projectStore.isAdmin} content={scriptSuiteInfo.script_suite_name} onChange={async (value) => {
                        try {
                            const res = await update_script_suite_name({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                script_suite_id: state.scriptSuiteId,
                                name: value,
                            });
                            if (res.code == 0) {
                                setScriptSuiteInfo({
                                    ...scriptSuiteInfo,
                                    script_suite_name: value,
                                });
                                return true;
                            }
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                        return false;
                    }} showEditIcon={true} />
                )}
            </div>} >
                <Space>
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowExecModal(true);
                    }}>执行脚本</Button>
                    <Popover content={
                        <div className={s.more}>
                            <Button type="link" danger disabled={!projectStore.isAdmin} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRemoveModal(true);
                            }}>删除脚本</Button>
                        </div>
                    } placement="bottom">
                        <MoreOutlined />
                    </Popover>
                </Space>
            </DetailsNav>
            <div className={s.content_wrap}>
                <div style={{ paddingTop: "5px" }}>
                    <p><b>使用前提：</b>服务器代理最低版本在0.1.3，并且在机器上安装了<a target="_blank" href="https://deno.land/" rel="noreferrer">deno</a>。</p>
                </div>
                <Tabs
                    activeKey={activeKey}
                    type="card"
                    onChange={value => {
                        linkAuxStore.goToLink(new LinkScriptSuiteInfo("", projectStore.curProjectId, state.scriptSuiteId, state.useHistoryScript, state.scriptTime, value), history);
                    }}>
                    <Tabs.TabPane tab="脚本内容" key="scriptContent">
                        {activeKey == "scriptContent" && scriptSuiteInfo != null && (
                            <ScriptContentPanel content={scriptSuiteInfo.script_content}
                                onUpdate={() => loadScriptSuite()} />
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="参数定义" key="paramDef">
                        {activeKey == "paramDef" && scriptSuiteInfo != null && (
                            <ParamDefPanel execParamDef={scriptSuiteInfo.exec_param_def}
                                onUpdateEnvDef={(envDefList: EnvParamDef[]) => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            exec_param_def: {
                                                env_param_def_list: envDefList,
                                                arg_param_def_list: scriptSuiteInfo.exec_param_def.arg_param_def_list,
                                            },
                                        });
                                    }
                                }}
                                onUpdateArgDef={(argDefList: ArgParamDef[]) => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            exec_param_def: {
                                                env_param_def_list: scriptSuiteInfo.exec_param_def.env_param_def_list,
                                                arg_param_def_list: argDefList,
                                            },
                                        });
                                    }
                                }} />
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="运行权限" key="permDef">
                        {activeKey == "permDef" && scriptSuiteInfo != null && (
                            <PermDefPanel
                                execUser={scriptSuiteInfo.exec_user}
                                permission={scriptSuiteInfo.permission}
                                onUpdateExecUser={execUser => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            exec_user: execUser,
                                        });
                                    }
                                }}
                                onUpdateEnvPerm={perm => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            permission: {
                                                env_perm: perm,
                                                sys_perm: scriptSuiteInfo.permission.sys_perm,
                                                net_perm: scriptSuiteInfo.permission.net_perm,
                                                read_perm: scriptSuiteInfo.permission.read_perm,
                                                write_perm: scriptSuiteInfo.permission.write_perm,
                                                run_perm: scriptSuiteInfo.permission.run_perm,
                                            },
                                        });
                                    }
                                }}
                                onUpdateSysPerm={perm => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            permission: {
                                                env_perm: scriptSuiteInfo.permission.env_perm,
                                                sys_perm: perm,
                                                net_perm: scriptSuiteInfo.permission.net_perm,
                                                read_perm: scriptSuiteInfo.permission.read_perm,
                                                write_perm: scriptSuiteInfo.permission.write_perm,
                                                run_perm: scriptSuiteInfo.permission.run_perm,
                                            },
                                        });
                                    }
                                }}
                                onUpdateNetPerm={perm => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            permission: {
                                                env_perm: scriptSuiteInfo.permission.env_perm,
                                                sys_perm: scriptSuiteInfo.permission.sys_perm,
                                                net_perm: perm,
                                                read_perm: scriptSuiteInfo.permission.read_perm,
                                                write_perm: scriptSuiteInfo.permission.write_perm,
                                                run_perm: scriptSuiteInfo.permission.run_perm,
                                            },
                                        });
                                    }
                                }}
                                onUpdateReadPerm={perm => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            permission: {
                                                env_perm: scriptSuiteInfo.permission.env_perm,
                                                sys_perm: scriptSuiteInfo.permission.sys_perm,
                                                net_perm: scriptSuiteInfo.permission.net_perm,
                                                read_perm: perm,
                                                write_perm: scriptSuiteInfo.permission.write_perm,
                                                run_perm: scriptSuiteInfo.permission.run_perm,
                                            },
                                        });
                                    }
                                }}
                                onUpdateWritePerm={perm => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            permission: {
                                                env_perm: scriptSuiteInfo.permission.env_perm,
                                                sys_perm: scriptSuiteInfo.permission.sys_perm,
                                                net_perm: scriptSuiteInfo.permission.net_perm,
                                                read_perm: scriptSuiteInfo.permission.read_perm,
                                                write_perm: perm,
                                                run_perm: scriptSuiteInfo.permission.run_perm,
                                            },
                                        });
                                    }
                                }}
                                onUpdateRunPerm={perm => {
                                    if (scriptSuiteInfo != null) {
                                        setScriptSuiteInfo({
                                            ...scriptSuiteInfo,
                                            permission: {
                                                env_perm: scriptSuiteInfo.permission.env_perm,
                                                sys_perm: scriptSuiteInfo.permission.sys_perm,
                                                net_perm: scriptSuiteInfo.permission.net_perm,
                                                read_perm: scriptSuiteInfo.permission.read_perm,
                                                write_perm: scriptSuiteInfo.permission.write_perm,
                                                run_perm: perm,
                                            },
                                        });
                                    }
                                }} />
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="执行记录" key="execList">
                        {activeKey == "execList" && scriptSuiteInfo != null && <ExecListPanel />}
                    </Tabs.TabPane>
                </Tabs>
                {showExecModal == true && scriptSuiteInfo != null && (
                    <ExecModal
                        scriptSuiteId={scriptSuiteInfo.script_suite_id}
                        scriptSuiteName={scriptSuiteInfo.script_suite_name}
                        execParamDef={scriptSuiteInfo.exec_param_def}
                        onCancel={() => setShowExecModal(false)} />
                )}
                {showRemoveModal == true && scriptSuiteInfo != null && (
                    <Modal open title="删除脚本"
                        onCancel={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowRemoveModal(false);
                        }}
                        onOk={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeScript();
                        }}>
                        是否删除服务端脚本 {scriptSuiteInfo.script_suite_name} ?
                    </Modal>
                )}
            </div>
        </CardWrap>
    );
}
export default observer(ScriptDetail);