import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { EditOutlined, MacCommandOutlined } from '@ant-design/icons';
import Button from '@/components/Button';
import { List, Modal } from 'antd';
import type { ScriptSuiteKey, ScriptSuiteInfo } from "@/api/robot_script";
import { list_script_suite_key, get_script_suite } from "@/api/robot_script";
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import ExecModal from '@/pages/Script/components/ExecModal';
import { useHistory } from 'react-router-dom';
import { LinkScriptExecInfo, LinkScriptSuiteInfo } from '@/stores/linkAux';

interface WidgetData {
    scriptSuiteId: string;
    scriptSuiteName: string;
}

export const serverScriptWidgetInitData: WidgetData = {
    scriptSuiteId: "",
    scriptSuiteName: "",
};

const PAGE_SIZE = 10;

const EditServerScript: React.FC<WidgetProps> = (props) => {
    const widgetData = props.initData as WidgetData;

    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [suiteName, setSuiteName] = useState(widgetData.scriptSuiteName);
    const [suiteId, setSuiteId] = useState(widgetData.scriptSuiteId);
    const [showModal, setShowModal] = useState(true);

    const [suiteInfoList, setSuiteInfoList] = useState<ScriptSuiteKey[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadSuiteInfoList = async () => {
        const res = await request(list_script_suite_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setSuiteInfoList(res.script_suite_key_list);
    };

    useEffect(() => {
        const saveData: WidgetData = {
            scriptSuiteId: suiteId,
            scriptSuiteName: suiteName,
        };
        props.writeData(saveData);
    }, [suiteName, suiteId]);

    useEffect(() => {
        if (showModal) {
            loadSuiteInfoList();
        }
    }, [showModal, curPage])

    return (
        <ErrorBoundary>
            <EditorWrap onChange={() => props.removeSelf()}>
                <div>
                    <MacCommandOutlined />&nbsp;&nbsp;服务端脚本:
                    <a style={{ minWidth: "40px", marginRight: "20px" }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (suiteId != "") {
                            linkAuxStore.goToLink(new LinkScriptSuiteInfo("", projectStore.curProjectId, suiteId, false, 0), history);
                        }
                    }}>{suiteName}</a>
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
                    <Modal title="选择服务端脚本" open footer={null}
                        onCancel={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowModal(false);
                            setSuiteInfoList([]);
                            setTotalCount(0);
                            setCurPage(0);
                        }} bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}>
                        <List rowKey="script_suite_id" dataSource={suiteInfoList}
                            pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1) }}
                            renderItem={item => (
                                <List.Item key={item.script_suite_id}>
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setSuiteName(item.script_suite_name);
                                        setSuiteId(item.script_suite_id);
                                        setShowModal(false);
                                        setSuiteInfoList([]);
                                        setTotalCount(0);
                                        setCurPage(0);
                                    }}>{item.script_suite_name}</a>
                                </List.Item>
                            )} />
                    </Modal>
                )}
            </EditorWrap>
        </ErrorBoundary>
    );
};


const ViewServerScript: React.FC<WidgetProps> = (props) => {
    const widgetData = props.initData as WidgetData;

    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [suiteName, setSuiteName] = useState(widgetData.scriptSuiteName);
    const [suiteInfo, setSuiteInfo] = useState<ScriptSuiteInfo | null>(null);
    const [showExecModal, setShowExecModal] = useState(false);

    const getSuiteInfoKey = async () => {
        const res = await request(get_script_suite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: widgetData.scriptSuiteId,
            use_history_script: false,
            script_time: 0,
        }));
        setSuiteName(res.script_suite_info.script_suite_name);
        setSuiteInfo(res.script_suite_info);
    };

    useEffect(() => {
        if (widgetData.scriptSuiteId != "") {
            getSuiteInfoKey();
        }
    }, [widgetData.scriptSuiteId]);

    return (
        <ErrorBoundary>
            <EditorWrap>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, lineHeight: "32px" }}>
                        <MacCommandOutlined />&nbsp;&nbsp;服务端脚本:
                        <a style={{ minWidth: "40px", marginRight: "20px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToLink(new LinkScriptSuiteInfo("", projectStore.curProjectId, widgetData.scriptSuiteId, false, 0), history);
                        }}>{suiteName}</a>
                    </div>
                    <Button type="primary" style={{ flex: 0, width: "100px", padding: "0px 10px" }}
                        disabled={suiteInfo == null}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowExecModal(true);
                        }}>
                        执行脚本
                    </Button>
                </div>
                {showExecModal == true && suiteInfo != null && (
                    <ExecModal scriptSuiteId={widgetData.scriptSuiteId} scriptSuiteName={widgetData.scriptSuiteName}
                        execParamDef={suiteInfo.exec_param_def}
                        onCancel={() => setShowExecModal(false)}
                        onOk={(execId: string) => {
                            setShowExecModal(false);
                            linkAuxStore.goToLink(new LinkScriptExecInfo("", projectStore.curProjectId, widgetData.scriptSuiteId, execId), history);
                        }} />
                )}
            </EditorWrap>
        </ErrorBoundary>
    );
}

export const ServerScriptWidget: React.FC<WidgetProps> = (props) => {
    if (props.editMode) {
        return <EditServerScript {...props} />;
    } else {
        return <ViewServerScript {...props} />;
    }
};