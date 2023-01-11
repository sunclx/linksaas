import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import { Tabs, Space } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkScriptSuiteSate } from "@/stores/linkAux";
import { LinkScriptSuiteInfo } from "@/stores/linkAux";
import { useStores } from "@/hooks";
import s from './ScriptDetail.module.less';
import { request } from "@/utils/request";
import type { ScriptSuiteInfo } from "@/api/robot_script";
import { get_script_suite, update_script_suite_name } from "@/api/robot_script";
import { EditText } from "@/components/EditCell/EditText";
import Button from "@/components/Button";
import ScriptContentPanel from "./components/ScriptContentPanel";
import ParamDefPanel from "./components/ParamDefPanel";
import PermDefPanel from "./components/PermDefPanel";
import ExecListPanel from "./components/ExecListPanel";


const ScriptDetail = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const location = useLocation();
    const history = useHistory();

    const state = location.state as LinkScriptSuiteSate;
    const activeKey = state.tab ?? "scriptContent";

    const [scriptSuiteInfo, setScriptSuiteInfo] = useState<ScriptSuiteInfo | null>(null);

    const loadScriptSuite = async () => {
        const res = await request(get_script_suite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            use_history_script: state.useHistoryScript,
            script_time: state.scriptTime,
        }));
        setScriptSuiteInfo(res.script_suite_info);
        console.log(res.script_suite_info);
    }

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
                    <Button>22</Button>
                </Space>
            </DetailsNav>
            <div className={s.content_wrap}>
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
                        {activeKey == "paramDef" && scriptSuiteInfo != null && <ParamDefPanel />}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="运行缺陷" key="permDef">
                        {activeKey == "permDef" && scriptSuiteInfo != null && <PermDefPanel />}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="执行记录" key="execList">
                        {activeKey == "execList" && scriptSuiteInfo != null && <ExecListPanel />}
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </CardWrap>
    );
}
export default observer(ScriptDetail);