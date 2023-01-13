import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useLocation } from "react-router-dom";
import type { LinkScriptExecState } from "@/stores/linkAux";
import { useStores } from "@/hooks";
import { EXEC_STATE_FAIL, EXEC_STATE_INIT, EXEC_STATE_RUN, EXEC_STATE_SUCCESS, get_exec, watch_exec, get_script_suite_key } from "@/api/robot_script";
import type { ExecInfo, ScriptSuiteKey } from "@/api/robot_script";
import s from './ExecResult.module.less';
import { request } from "@/utils/request";
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import DynamicTerm from "./components/DynamicTerm";
import StaticTerm from "./components/StaticTerm";
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type';
import { Tag } from "antd";
import moment from 'moment';

const ExecResult = () => {
    const location = useLocation();
    const state = location.state as LinkScriptExecState;

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [execInfo, setExecInfo] = useState<ExecInfo | null>(null);
    const [scriptSuiteKey, setScriptSuiteKey] = useState<ScriptSuiteKey | null>(null);

    const loadExecInfo = async () => {
        const res = await request(get_exec({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            exec_id: state.execId,
        }));
        setExecInfo(res.exec_info);
        if (res.exec_info.exec_state == EXEC_STATE_INIT || res.exec_info.exec_state == EXEC_STATE_RUN) {
            await request(watch_exec({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                script_suite_id: state.scriptSuiteId,
                exec_id: state.execId,
            }));
        }
    };

    const loadScriptSuiteKey = async () => {
        const res = await request(get_script_suite_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
        }));
        setScriptSuiteKey(res.script_suite_key);
    };

    useEffect(() => {
        loadExecInfo();
        loadScriptSuiteKey();
    }, [state.execId]);

    useEffect(() => {
        const unlisten = listen<NoticeType.AllNotice>(`exec_state_${state.execId}`, () => {
            loadExecInfo();
        })
        return () => {
            unlisten.then(f => f());
        };
    }, [state]);

    return (
        <CardWrap>
            <DetailsNav title={`脚本 ${scriptSuiteKey?.script_suite_name ?? ""} 执行结果`} />
            <div className={s.result_wrap}>
                <h2 className={s.sub_title}>基本信息</h2>
                <div className={s.info_wrap}>
                    <div className={s.info}>
                        <div className={s.label}>执行状态:</div>
                        <div>
                            {execInfo?.exec_state == EXEC_STATE_INIT && <span>准备执行</span>}
                            {execInfo?.exec_state == EXEC_STATE_RUN && <span>执行中</span>}
                            {execInfo?.exec_state == EXEC_STATE_SUCCESS && <span style={{ color: "green" }}>执行成功</span>}
                            {execInfo?.exec_state == EXEC_STATE_FAIL && <span style={{ color: "red" }}>执行失败</span>}
                        </div>
                    </div>
                    <div className={s.info}>
                        <div className={s.label}>环境参数:</div>
                        <div>
                            {(execInfo?.exec_param.env_param_list ?? []).map((item, index) => (
                                <Tag key={index}>{item.env_name}={item.env_value}</Tag>
                            ))}
                        </div>
                    </div>
                    <div className={s.info}>
                        <div className={s.label}>命令行参数:</div>
                        <div>
                            {(execInfo?.exec_param.arg_param_list ?? []).map((item, index) => (
                                <Tag key={index}>{item}</Tag>
                            ))}
                        </div>
                    </div>
                    <div className={s.info}>
                        <div className={s.label}>执行人:</div>
                        <div>
                            {execInfo?.exec_display_name ?? ""}
                            &nbsp;&nbsp;
                            {execInfo != null && (
                                <span>{moment(execInfo.exec_time).format("YYYY-MM-DD HH:mm:ss")}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={s.term_wrap}>
                    {execInfo?.exec_state == EXEC_STATE_RUN && <DynamicTerm scriptSuiteId={state.scriptSuiteId} execId={state.execId} />}
                    {(execInfo?.exec_state == EXEC_STATE_SUCCESS || execInfo?.exec_state == EXEC_STATE_FAIL) && <StaticTerm scriptSuiteId={state.scriptSuiteId} execId={state.execId} />}
                </div>
            </div>
        </CardWrap>
    );
}
export default observer(ExecResult);