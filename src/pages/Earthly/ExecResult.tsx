import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useLocation } from "react-router-dom";
import CardWrap from '@/components/CardWrap';
import type { LinkEarthlyExecState } from "@/stores/linkAux";
import type { ExecInfo, ActionInfo, RepoInfo } from '@/api/robot_earthly';
import {
    get_action, get_exec, watch_exec, get_repo,
    EXEC_STATE_INIT, EXEC_STATE_RUN, EXEC_STATE_SUCCESS, EXEC_STATE_FAIL,
} from '@/api/robot_earthly';
import DetailsNav from "@/components/DetailsNav";
import { request } from '@/utils/request';
import { useStores } from "@/hooks";
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type';
import DynamicTerm from "./components/DynamicTerm";
import s from './ExecResult.module.less';
import StaticTerm from "./components/StaticTerm";


const ExecResult = () => {
    const location = useLocation();
    const state = location.state as LinkEarthlyExecState;

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [execInfo, setExecInfo] = useState<ExecInfo | null>(null);
    const [actionInfo, setActionInfo] = useState<ActionInfo | null>(null);
    const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);

    const loadRepoInfo = async () => {
        const res = await (get_repo({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: state.repoId,
        }));
        if (res) {
            setRepoInfo(res.info);
        }
    };

    const loadActionInfo = async () => {
        const res = await request(get_action({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: state.repoId,
            action_id: state.actionId,
        }));
        if (res) {
            setActionInfo(res.info);
        }
    };

    const loadExecInfo = async () => {
        const res = await request(get_exec({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: state.repoId,
            action_id: state.actionId,
            exec_id: state.execId,
        }));
        if (res) {
            setExecInfo(res.info);
            if (res.info.exec_state == EXEC_STATE_INIT || res.info.exec_state == EXEC_STATE_RUN) {
                await request(watch_exec({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    repo_id: state.repoId,
                    action_id: state.actionId,
                    exec_id: state.execId,
                }));
            }
        }
    };

    const getParamStr = () => {
        if (execInfo == null) {
            return "";
        }
        const tmpList = [];
        for (const p of execInfo.param_list) {
            tmpList.push(`${p.name}=${p.value}`);
        }
        return tmpList.join(";");
    };

    useEffect(() => {
        loadExecInfo();
        loadActionInfo();
        loadRepoInfo();
    }, [state]);

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
            <DetailsNav title={`命令${actionInfo?.basic_info.action_name ?? ""}执行结果`} />
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
                    <div className={s.label}>仓库地址:</div>
                    <div>{repoInfo?.basic_info.repo_url ?? ""}</div>
                </div>
                <div className={s.info}>
                    <div className={s.label}>命令名称:</div>
                    <div>{actionInfo?.basic_info.action_name ?? ""}</div>
                </div>
                <div className={s.info}>
                    <div className={s.label}>执行分支/标签:</div>
                    <div>{execInfo?.branch ?? ""}</div>
                </div>
                <div className={s.info}>
                    <div className={s.label}>其他参数:</div>
                    <div>{execInfo != null && getParamStr()}</div>
                </div>
            </div>
            {execInfo?.exec_state == EXEC_STATE_RUN && <DynamicTerm repoId={state.repoId} actionId={state.actionId} execId={state.execId}/>}
            {(execInfo?.exec_state == EXEC_STATE_SUCCESS || execInfo?.exec_state == EXEC_STATE_FAIL) && <StaticTerm repoId={state.repoId} actionId={state.actionId} execId={state.execId}/>}
        </CardWrap>
    );
};

export default observer(ExecResult);