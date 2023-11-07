import React, { useEffect, useRef, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import NodeWrap from "./NodeWrap";
import { start_update_content, type Node as BoardNode, keep_update_content, end_update_content, update_content } from "@/api/project_board";
import { useStores } from "@/hooks";
import { Empty, Modal, Select, Tabs } from "antd";
import mermaid from 'mermaid';
import { uniqId } from "@/utils/utils";
import { classDemo, erDemo, flowDemo, ganttDemo, gitDemo, journeyDemo, pieDemo, seqDemo, stateDemo } from '@/utils/mermaid';
import { QuestionCircleOutlined } from "@ant-design/icons";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { request } from "@/utils/request";


interface EditMermaidModalProps {
    data: string;
    nodeId: string;
    onClose: () => void;
}

const EditMermaidModal = (props: EditMermaidModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const graphRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

    const [data, setData] = useState(props.data);
    const [activeKey, setActiveKey] = useState('code');

    const setDemo = (demoName: string) => {
        let value = '';
        switch (demoName) {
            case 'flow': {
                value = flowDemo;
                break;
            }
            case 'seq': {
                value = seqDemo;
                break;
            }
            case 'class': {
                value = classDemo;
                break;
            }
            case 'state': {
                value = stateDemo;
                break;
            }
            case 'gantt': {
                value = ganttDemo;
                break;
            }
            case 'pie': {
                value = pieDemo;
                break;
            }
            case 'er': {
                value = erDemo;
                break;
            }
            case 'journey': {
                value = journeyDemo;
                break;
            }
            case 'git': {
                value = gitDemo;
                break;
            }
            default:
                value = '';
        }
        setData(value);
    };


    const saveContent = async () => {
        await request(update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
            node_data: {
                NodeMermaidData: {
                    data: data,
                },
            },
        }));
        boardStore.updateNode(props.nodeId);
        props.onClose();
    };

    useEffect(() => {
        if (activeKey == 'preview') {
            try {
                mermaid.parse(data);
                mermaid.render('__inEditor', data, (svgCode) => {
                    setTimeout(() => {
                        if (graphRef.current != null) {
                            graphRef.current.innerHTML = svgCode;
                        }
                    }, 200);
                });
            } catch (e) {
                if (graphRef.current != null) {
                    graphRef.current.innerHTML = '格式错误';
                }
            }
        }
    }, [data, activeKey]);

    useEffect(() => {
        request(start_update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
        }));
        const timer = setInterval(() => {
            request(keep_update_content({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                board_id: entryStore.curEntry?.entry_id ?? "",
                node_id: props.nodeId,
            }));
        }, 30 * 1000);
        return () => {
            clearInterval(timer);
            request(end_update_content({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                board_id: entryStore.curEntry?.entry_id ?? "",
                node_id: props.nodeId,
            }));
        };
    }, []);

    return (
        <Modal open title="编辑Mermaid"
            okText="保存" width="calc(100vw - 400px)"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                saveContent();
            }}>
            <Tabs activeKey={activeKey} onChange={value => setActiveKey(value)}
                tabBarExtraContent={
                    <>
                        <Select
                            style={{ width: 150 }}
                            placeholder="请选择图表类型"
                            onChange={(value) => {
                                setDemo(value);
                            }}
                        >
                            <Select.Option key="flow" value="flow">
                                流程图
                            </Select.Option>
                            <Select.Option key="seq" value="seq">
                                时序图
                            </Select.Option>
                            <Select.Option key="class" value="class">
                                类图
                            </Select.Option>
                            <Select.Option key="state" value="state">
                                状态图
                            </Select.Option>
                            <Select.Option key="gantt" value="gantt">
                                甘特图
                            </Select.Option>
                            <Select.Option key="pie" value="pie">
                                圆饼图
                            </Select.Option>
                            <Select.Option key="er" value="er">
                                ER图
                            </Select.Option>
                            <Select.Option key="journey" value="journey">
                                用户体验图
                            </Select.Option>
                            <Select.Option key="git" value="git">
                                GIT历史
                            </Select.Option>
                        </Select>
                        <a href="https://mermaid-js.github.io/mermaid/#/" target="_blank" rel="noreferrer"><QuestionCircleOutlined style={{ marginLeft: "10px" }} /></a>
                    </>
                } items={[
                    {
                        key: "code",
                        label: "代码",
                        children: (
                            <div style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}>
                                <CodeEditor
                                    value={data}
                                    language="mermaid"
                                    minHeight={200}
                                    onChange={(e) => {
                                        setData(e.target.value);
                                    }}
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            </div>
                        ),
                    },
                    {
                        key: "preview",
                        label: "预览",
                        children: (
                            <div style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}>
                                <div ref={graphRef} />
                            </div>
                        ),
                    }
                ]} />
        </Modal>
    );
};

const MermaidNode = (props: NodeProps<BoardNode>) => {
    const entryStore = useStores('entryStore');

    const graphRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [renderId] = useState('mermaid' + uniqId());


    useEffect(() => {
        if (graphRef.current == null || props.data.node_data.NodeMermaidData?.data == "") {
            return;
        }
        try {
            mermaid.parse(props.data.node_data.NodeMermaidData?.data ?? "");
            mermaid.render(renderId, props.data.node_data.NodeMermaidData?.data ?? "", (svgCode) => {
                if (graphRef.current != null) {
                    graphRef.current.innerHTML = svgCode;
                }
            });
        } catch (e) {
            if (graphRef.current != null) {
                graphRef.current.innerHTML = '格式错误';
            }
        }
    }, [props.data.node_data.NodeMermaidData?.data, graphRef.current]);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="Mermaid" onEdit={() => setShowModal(true)} bgColor={props.data.bg_color == "" ? "white" : props.data.bg_color}>
            {props.data.node_data.NodeMermaidData?.data == "" && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: "0px 0px" }} />}
            {props.data.node_data.NodeMermaidData?.data != "" && <div ref={graphRef} />}
            {showModal == true && (
                <EditMermaidModal nodeId={props.data.node_id} data={props.data.node_data.NodeMermaidData?.data ?? ""} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(MermaidNode);