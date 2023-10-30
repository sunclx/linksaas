import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Space, Tabs, message } from 'antd';
import { useLocation } from 'react-router-dom';
import { useStores } from './stores';
import PipeLineEditor from './PipeLineEditor';
import { get_session, get_user_id } from '@/api/user';
import { request } from '@/utils/request';
import { update_pipe_line_job } from '@/api/project_cicd';
import RunParamModal from './RunParamModal';
import ResultReport from './ResultReport';
import CommentEntry from '@/components/CommentEntry';
import { COMMENT_TARGET_CI_CD } from '@/api/project_comment';


const CiCdApp = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const projectId = urlParams.get("projectId") ?? "";
    const fsId = urlParams.get("fsId") ?? "";
    const pipeLineId = urlParams.get("pipeLineId") ?? "";
    const execId = urlParams.get("execId") ?? "";
    const canUpdateStr = (urlParams.get("canUpdate") ?? "false").toLowerCase();
    const canExecStr = (urlParams.get("canExec") ?? "false").toLowerCase();
    const canAdminStr = (urlParams.get("admin") ?? "false").toLowerCase();

    const store = useStores();

    const [activeKey, setActiveKey] = useState("pipeline");
    const [showRunModal, setShowRunModal] = useState(false);

    const updatePipeLine = async () => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
        const sessionId = await get_session();
        await request(update_pipe_line_job({
            session_id: sessionId,
            project_id: store.paramStore.projectId,
            pipe_line_id: store.pipeLineStore.pipeLine.pipe_line_id,
            gitsource_job: store.pipeLineStore.pipeLine.gitsource_job,
            exec_job_list: store.pipeLineStore.pipeLine.exec_job_list,
        }));
        store.pipeLineStore.hasChange = false;
        store.pipeLineStore.loadPipeLine(store.paramStore.projectId, store.pipeLineStore.pipeLine.pipe_line_id,
            store.resultStore.execResult != null, store.resultStore.execResult?.pipe_line_time ?? 0);
        message.info("保存成功");
    };

    useEffect(() => {
        store.paramStore.projectId = projectId;
        store.paramStore.fsId = fsId;
        store.paramStore.canUpdate = (canUpdateStr == "true");
        store.paramStore.canExec = (canExecStr == "true");
        store.paramStore.canAdmin = (canAdminStr == "true");
        get_user_id().then(userId=>store.paramStore.userId = userId);
        store.pipeLineStore.loadCredList(projectId);
        if (execId == "") {
            store.pipeLineStore.loadPipeLine(projectId, pipeLineId, false, 0).then(() => store.pipeLineStore.incInitVersion());
        } else {
            store.resultStore.loadExecResult(projectId, pipeLineId, execId).then(() => {
                store.pipeLineStore.loadPipeLine(projectId, pipeLineId, true, store.resultStore.execResult?.pipe_line_time ?? 0).then(() => {
                    store.pipeLineStore.incInitVersion();
                });
                store.resultStore.loadExecState(projectId, pipeLineId);
            })
        }
    }, []);

    return (
        <div>
            <Tabs activeKey={activeKey} onChange={value => setActiveKey(value)}
                items={[
                    {
                        key: "pipeline",
                        label: "流水线",
                        children: <PipeLineEditor />
                    },
                    {
                        key: "result",
                        label: "运行结果",
                        disabled: store.resultStore.execResult == null,
                        children: <ResultReport />
                    }
                ]}
                type="card" style={{ backgroundColor: "white" }}
                tabBarExtraContent={
                    <div style={{ padding: "6px 0px", marginRight: "20px" }}>
                        {activeKey == "pipeline" && (
                            <Space size="middle">
                                {store.pipeLineStore.pipeLine != null && (
                                    <CommentEntry projectId={store.paramStore.projectId} targetType={COMMENT_TARGET_CI_CD}
                                        targetId={store.pipeLineStore.pipeLine.pipe_line_id} myUserId={store.paramStore.userId} myAdmin={store.paramStore.canAdmin} />
                                )}

                                {store.pipeLineStore.hasChange && store.paramStore.canUpdate && (
                                    <Button type="primary" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        updatePipeLine();
                                    }}>保存</Button>
                                )}
                                {store.pipeLineStore.hasChange == false && store.paramStore.canExec && (
                                    <Button type="primary" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowRunModal(true);
                                    }}>运行</Button>
                                )}
                            </Space>
                        )}
                    </div>
                } />
            {showRunModal == true && (
                <RunParamModal onCancel={() => setShowRunModal(false)} onOk={() => {
                    setShowRunModal(false);
                    setActiveKey("result");
                }} />
            )}
        </div>
    );
};

export default observer(CiCdApp);