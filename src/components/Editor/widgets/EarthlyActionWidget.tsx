import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { EditOutlined, MacCommandOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import type { RepoInfo, ActionInfo } from '@/api/robot_earthly';
import { list_repo, list_action, get_repo, get_action } from '@/api/robot_earthly';
import { List, Modal } from 'antd';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { useHistory } from 'react-router-dom';
import { LinkEarthlyActionInfo, LinkEarthlyExecInfo } from '@/stores/linkAux';
import ExecModal from '@/pages/Earthly/components/ExecModal';

interface WidgetData {
    repoId: string;
    repoName: string;
    actionId: string;
    actionName: string;
}

interface SelectActionModalProps {
    onCancel: () => void;
    onSelect: (repoInfo: RepoInfo, actionInfo: ActionInfo) => void;
}

const PAGE_SIZE = 10;

const SelectActionModal: React.FC<SelectActionModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [repoInfoList, setRepoInfoList] = useState<RepoInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [curRepoInfo, setCurRepoInfo] = useState<RepoInfo | null>(null);
    const [actionInfoList, setActionInfoList] = useState<ActionInfo[]>([]);

    const loadRepoInfoList = async () => {
        const res = await request(list_repo({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setRepoInfoList(res.info_list);
    };

    const loadActionInfoList = async () => {
        if (curRepoInfo == null) {
            setActionInfoList([]);
        } else {
            const res = await request(list_action({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                repo_id: curRepoInfo.repo_id,
            }));
            setActionInfoList(res.info_list);
        }
    };

    useEffect(() => {
        loadRepoInfoList();
    }, [curPage]);

    useEffect(() => {
        loadActionInfoList();
    }, [curRepoInfo]);

    return (
        <Modal open title="选择仓库指令" footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }} bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}>
            <List rowKey="repo_id" dataSource={repoInfoList}
                pagination={{ current: curPage + 1, total: totalCount, pageSize: PAGE_SIZE, onChange: page => setCurPage(page + 1) }}
                renderItem={repoInfo => (
                    <List.Item key={repoInfo.repo_id} style={{ display: "block" }}>
                        <div style={{ display: "flex", width: "100%" }}>
                            <div style={{ flex: 1 }}>{repoInfo.basic_info.repo_url}</div>
                            <div style={{ flex: 0 }}>
                                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (curRepoInfo?.repo_id == repoInfo.repo_id) {
                                        setCurRepoInfo(null);
                                    } else {
                                        setCurRepoInfo(repoInfo);
                                    }

                                }}>
                                    {curRepoInfo?.repo_id == repoInfo.repo_id ? "收起" : "展开"}
                                </Button>
                            </div>
                        </div>
                        {curRepoInfo?.repo_id == repoInfo.repo_id && (
                            <List rowKey="action_id" dataSource={actionInfoList} style={{ borderTop: "1px solid #e4e4e8" }} pagination={false}
                                renderItem={actionInfo => (
                                    <List.Item key={actionInfo.action_id}>
                                        <Button type="link" onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            props.onSelect(curRepoInfo, actionInfo);
                                        }}>指令&nbsp;{actionInfo.basic_info.action_name}</Button>
                                    </List.Item>
                                )} />
                        )}
                    </List.Item>
                )} />
        </Modal>
    );
};

export const earthlyActionWidgetInitData: WidgetData = {
    repoId: "",
    repoName: "",
    actionId: "",
    actionName: "",
};

const EditEarthlyAction: React.FC<WidgetProps> = (props) => {
    const widgetData = props.initData as WidgetData;

    const history = useHistory();

    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [repoId, setRepoId] = useState(widgetData.repoId);
    const [repoName, setRepoName] = useState(widgetData.repoName);
    const [actionId, setActionId] = useState(widgetData.actionId);
    const [actionName, setActionName] = useState(widgetData.actionName);

    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        const saveData: WidgetData = {
            repoId: repoId,
            repoName: repoName,
            actionId: actionId,
            actionName: actionName,
        };
        props.writeData(saveData);
    }, [repoId, repoName, actionId, actionName]);

    return (
        <ErrorBoundary>
            <EditorWrap onChange={() => props.removeSelf()}>
                <div>
                    <MacCommandOutlined />&nbsp;&nbsp;代码仓库:
                    <a style={{ minWidth: "40px", marginRight: "20px" }} href={repoName} target='_blank' rel="noreferrer">&nbsp;&nbsp;{repoName}</a>
                    {actionId != "" && (
                        <>
                            指令:
                            <a style={{ minWidth: "40px", marginRight: "20px" }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                linkAuxStore.goToLink(new LinkEarthlyActionInfo("", projectStore.curProjectId, repoId, actionId), history);
                            }}>{actionName}</a>
                        </>
                    )}
                    <Button type="link" style={{ flex: 0, minWidth: "0px", padding: "0px 0px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowModal(true);
                        }}>
                        <EditOutlined />
                    </Button>
                </div>
                {showModal == true && (
                    <SelectActionModal onCancel={() => setShowModal(false)} onSelect={(repoInfo, actionInfo) => {
                        setRepoId(repoInfo.repo_id);
                        setRepoName(repoInfo.basic_info.repo_url);
                        setActionId(actionInfo.action_id);
                        setActionName(actionInfo.basic_info.action_name);
                        setShowModal(false);
                    }} />
                )}
            </EditorWrap>
        </ErrorBoundary>
    );
};


const ViewEarthlyAction: React.FC<WidgetProps> = (props) => {
    const widgetData = props.initData as WidgetData;

    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [repoName, setRepoName] = useState(widgetData.repoName);
    const [actionName, setActionName] = useState(widgetData.actionName);
    const [showExecModal, setShowExecModal] = useState(false);

    const [actionInfo, setActionInfo] = useState<ActionInfo | null>(null);

    const loadRepoInfo = async () => {
        const res = await request(get_repo({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: widgetData.repoId,
        }));
        setRepoName(res.info.basic_info.repo_url);
    };

    const loadActionInfo = async () => {
        const res = await request(get_action({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: widgetData.repoId,
            action_id: widgetData.actionId,
        }));
        setActionName(res.info.basic_info.action_name);
        setActionInfo(res.info);
    };

    useEffect(() => {
        if (widgetData.repoId != "") {
            loadRepoInfo();
        }
        if (widgetData.actionId != "") {
            loadActionInfo();
        }
    }, []);

    return (
        <ErrorBoundary>
            <EditorWrap>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, lineHeight: "32px" }}>
                        <MacCommandOutlined />&nbsp;&nbsp;代码仓库:
                        <a style={{ minWidth: "40px", marginRight: "20px" }} href={repoName} target='_blank' rel="noreferrer">&nbsp;&nbsp;{repoName}</a>
                        指令:
                        <a style={{ minWidth: "40px", marginRight: "20px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToLink(new LinkEarthlyActionInfo("", projectStore.curProjectId, widgetData.repoId, widgetData.actionId), history);
                        }}>{actionName}</a>
                    </div>
                    <Button type="primary" style={{ flex: 0, width: "100px", padding: "0px 10px" }}
                        disabled={actionInfo == null}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowExecModal(true);
                        }}>
                        执行脚本
                    </Button>
                </div>
                {showExecModal == true && actionInfo != null && (
                    <ExecModal repoId={widgetData.repoId} actionInfo={actionInfo} onCancel={() => setShowExecModal(false)} onOk={(execId) => {
                        setShowExecModal(false);
                        linkAuxStore.goToLink(new LinkEarthlyExecInfo("", projectStore.curProjectId, widgetData.repoId, widgetData.actionId, execId), history);
                    }} />
                )}
            </EditorWrap>
        </ErrorBoundary>
    );
};

export const EarthlyActionWidget: React.FC<WidgetProps> = (props) => {
    if (props.editMode) {
        return <EditEarthlyAction {...props} />;
    } else {
        return <ViewEarthlyAction {...props} />;
    }
};