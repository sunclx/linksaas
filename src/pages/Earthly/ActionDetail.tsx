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
import { message, Popover, Table } from "antd";
import moment from 'moment';
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import s from './ActionDetail.module.less';
import ExecModal from "./components/ExecModal";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { writeText } from '@tauri-apps/api/clipboard';
import DownladArtifact from "./components/DownladArtifact";
import CodeEditor from '@uiw/react-textarea-code-editor';


const PAGE_SIZE = 10;
const TIPS_ARTIFACT_ARGS = `ARG LINKSAAS_ARTIFACT_TOKEN=""`;
const TIPS_ARTIFACT_CURL = "RUN curl -s -F your_param=@your_file";

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
            title: (
                <span>
                    artifact&nbsp;&nbsp;
                    <Popover content={<div className={s.artifact_tips}>
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>你可以通过在构建过程中调用curl上传artifact</h3>
                        <p>机器人的版本需要0.1.2版本以上，Earthfile可参考<a target="_blank" href="https://jihulab.com/linksaas/robot/-/blob/develop/Earthfile" rel="noreferrer">demo</a></p>
                        <ul>
                            <li><p>在构建目标中添加&nbsp;&nbsp;<a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                writeText(TIPS_ARTIFACT_ARGS).then(() => message.info("复制成功"));
                            }}>复制</a></p>
                                <CodeEditor
                                    value={TIPS_ARTIFACT_ARGS}
                                    language="bash"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            </li>
                            <li><p>在构建目标中添加&nbsp;&nbsp;<a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                writeText(`${TIPS_ARTIFACT_CURL} ${actionInfo?.artifact_url ?? ""}`).then(() => message.info("复制成功"));
                            }}>复制</a></p>
                                <CodeEditor
                                    value={`${TIPS_ARTIFACT_CURL} ${actionInfo?.artifact_url ?? ""}`}
                                    language="bash"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            </li>
                        </ul>
                    </div>}>
                        <a><QuestionCircleOutlined /></a>
                    </Popover>
                </span>),
            render: (_, record: ExecInfo) => (<div>
                {record.artifact_list.map(atrifact => (
                    <DownladArtifact key={atrifact.file_id} fileId={atrifact.file_id} fileName={atrifact.file_name} />
                ))}
            </div>),
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
                    <Button onClick={e => {
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