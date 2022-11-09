import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import type { ActionInfo, ExecInfo, RepoInfo } from "@/api/robot_earthly";
import { EXEC_STATE_FAIL, EXEC_STATE_INIT, EXEC_STATE_RUN, EXEC_STATE_SUCCESS } from "@/api/robot_earthly";
import { get_action, list_exec, get_repo } from "@/api/robot_earthly";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkEarthlyActionState } from "@/stores/linkAux";
import { LinkEarthlyExecInfo } from "@/stores/linkAux";
import { request } from '@/utils/request';
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/es/table';
import { Table } from "antd";
import moment from 'moment';
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import s from './ActionDetail.module.less';
import ExecModal from "./components/ExecModal";

const PAGE_SIZE = 10;

const ActionDetail = () => {
    const location = useLocation();
    const state = location.state as LinkEarthlyActionState;
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
    const [actionInfo, setActionInfo] = useState<ActionInfo | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [execInfoList, setExecInfoList] = useState<ExecInfo[]>([]);
    const [showExecModal, setShowExecModal] = useState(false);


    const loadRepoInfo = async () => {
        const res = await request(get_repo({
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
        const res = await request(list_exec({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: state.repoId,
            action_id: state.actionId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        if (res) {
            setTotalCount(res.total_count);
            setExecInfoList(res.info_list);
        }
    };

    const columns: ColumnsType<ExecInfo> = [
        {
            title: "分支/标签",
            dataIndex: "branch",
        },
        {
            title: "执行参数",
            render: (_, record: ExecInfo) => (
                <div>
                    {record.param_list.map((param, index) => (
                        <div key={index}>{param.name}={param.value}</div>
                    ))}
                </div>
            ),
        },
        {
            title: "执行状态",
            render: (_, record: ExecInfo) => (
                <div>
                    {record.exec_state == EXEC_STATE_INIT && <span>准备执行</span>}
                    {record.exec_state == EXEC_STATE_RUN && <span>执行中</span>}
                    {record.exec_state == EXEC_STATE_SUCCESS && <span style={{ color: "green" }}>执行成功</span>}
                    {record.exec_state == EXEC_STATE_FAIL && <span style={{ color: "red" }}>执行失败</span>}
                </div>
            ),
        },
        {
            title: "执行人",
            dataIndex: "exec_display_name",
        },
        {
            title: "执行时间",
            render: (_, record: ExecInfo) => (
                <span>{moment(record.exec_time).format("YYYY-MM-DD HH:mm:ss")}</span>
            ),
        },
        {
            title: "",
            render: (_, record: ExecInfo) => (
                <Button type="link" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(
                        new LinkEarthlyExecInfo("", projectStore.curProjectId, state.repoId, state.actionId, record.exec_id),
                        history);
                }}>查看执行结果</Button>
            ),
        }
    ];

    useEffect(() => {
        loadActionInfo();
        loadRepoInfo();
    }, [state]);

    useEffect(() => {
        loadExecInfo();
    }, [projectStore.curProjectId, curPage]);
    return (
        <CardWrap>
            <DetailsNav title={`命令${actionInfo?.basic_info.action_name ?? ""}详情`} />
            <h2 className={s.sub_title}>基本信息</h2>
            <div className={s.info_wrap}>
                <div className={s.info}>
                    <div className={s.label}>仓库地址:</div>
                    <div>{repoInfo?.basic_info.repo_url ?? ""}</div>
                </div>
                <div className={s.info}>
                    <div className={s.label}>命令名称:</div>
                    <div>{actionInfo?.basic_info.action_name ?? ""}</div>
                </div>
            </div>
            <h2 className={s.sub_title}>
                执行记录
                <div className={s.exec_wrap}>
                    <Button onClick={e=>{
                        e.stopPropagation();
                        e.preventDefault();
                        setShowExecModal(true);
                    }}>执行命令</Button>
                </div>
            </h2>
            <div className={s.content_wrap}>

                <Table rowKey="exec_id" dataSource={execInfoList} columns={columns} pagination={false} />
                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
            </div>
            {showExecModal == true && <ExecModal
                repoId={state.repoId}
                actionInfo={actionInfo!}
                onCancel={() => setShowExecModal(false)}
                onOk={(execId: string) => {
                    linkAuxStore.goToLink(new LinkEarthlyExecInfo("", projectStore.curProjectId, state.repoId, state.actionId, execId), history);
                    setShowExecModal(false);
                }} />}
        </CardWrap>
    );
};

export default observer(ActionDetail);