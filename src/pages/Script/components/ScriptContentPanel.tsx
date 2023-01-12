import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Card, Popover, Space } from "antd";
import { useLocation } from "react-router-dom";
import type { LinkScriptSuiteSate } from "@/stores/linkAux";
import { HistoryOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { update_script } from "@/api/robot_script";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import ContentHistory from "./ContentHistory";

interface ScriptContentPanelProps {
    content: string;
    onUpdate: () => void;
}

const ScriptContentPanel: React.FC<ScriptContentPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const location = useLocation();

    const state = location.state as LinkScriptSuiteSate;

    const [inEdit, setInEdit] = useState(false);
    const [content, setContent] = useState(props.content);

    const updateScriptContent = async () => {
        if (props.content == content) {
            setInEdit(false);
            return;
        }
        await request(update_script({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            script_content: content,
        }));
        props.onUpdate();
        setInEdit(false);
    };
    return (
        <Card bordered={false}
            extra={
                <Space>
                    {state.useHistoryScript == false && (
                        <>
                            <Popover
                                content={<ContentHistory scriptSuiteId={state.scriptSuiteId} onRecover={(value) => {
                                    setContent(value);
                                    props.onUpdate();
                                }} />}
                                placement="bottomLeft"
                                trigger="click"
                                destroyTooltipOnHide={true}>
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}><HistoryOutlined style={{ marginRight: "40px", fontSize: "16px" }} /></a>
                            </Popover>
                            {inEdit == true && (
                                <>
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setInEdit(false);
                                        setContent(props.content);
                                    }}>取消</Button>
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        updateScriptContent();
                                    }}>更新脚本内容</Button>
                                </>
                            )}
                            {inEdit == false && (
                                <Button onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setInEdit(true);
                                }}>修改</Button>
                            )}
                        </>
                    )}
                </Space>}>
            <div style={{ height: "calc(100vh - 290px)",overflowY: "scroll" }}>
                <CodeEditor
                    value={content}
                    language="typescript"
                    minHeight={200}
                    placeholder="请输入代码"
                    disabled={state.useHistoryScript || inEdit == false}
                    onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setContent(e.target.value);
                    }}
                    style={{
                        fontSize: 14,
                        backgroundColor: '#f5f5f5',
                    }}
                />
            </div>
        </Card>
    );
};

export default observer(ScriptContentPanel);