import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { start_update_content, type Node as BoardNode, keep_update_content, end_update_content, update_content, NODE_REF_TYPE_PIPE_LINE } from "@/api/project_board";
import NodeWrap from "./NodeWrap";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { get_pipe_line, list_pipe_line, PLATFORM_TYPE_LINUX, type PipeLine, PLATFORM_TYPE_DARWIN, PLATFORM_TYPE_WINDOWS } from "@/api/project_cicd";
import { Descriptions, Empty, Modal, Table } from "antd";
import Pagination from "@/components/Pagination";
import type { ColumnsType } from "antd/lib/table";
import { useHistory } from "react-router-dom";
import { LinkPipeLineInfo } from "@/stores/linkAux";

const PAGE_SIZE = 10;

interface SelectPipeLineModalProps {
    nodeId: string;
    onClose: () => void;
}


const SelectPipeLineModal = (props: SelectPipeLineModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const [pipeLineList, setPipeLineList] = useState<PipeLine[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadPipeLineList = async () => {
        const res = await request(list_pipe_line({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: false,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setPipeLineList(res.pipe_line_list);
    };

    const updatePipeLineId = async (pipeLineId: string) => {
        await request(update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
            node_data: {
                NodeRefData: {
                    ref_type: NODE_REF_TYPE_PIPE_LINE,
                    ref_target_id: pipeLineId,
                },
            },
        }));
        boardStore.updateNode(props.nodeId);
        props.onClose();
    };

    const columns: ColumnsType<PipeLine> = [
        {
            title: "名称",
            width: 200,
            render: (_, row: PipeLine) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    updatePipeLineId(row.pipe_line_id);
                }}>{row.pipe_line_name}</a>
            ),
        },
        {
            title: "运行平台",
            width: 100,
            render: (_, row: PipeLine) => (
                <>
                    {row.plat_form == PLATFORM_TYPE_LINUX && "LINUX"}
                    {row.plat_form == PLATFORM_TYPE_DARWIN && "MAC"}
                    {row.plat_form == PLATFORM_TYPE_WINDOWS && "WINDOWS"}
                </>
            ),
        },
        {
            title: "GIT地址",
            width: 300,
            dataIndex: ["gitsource_job", "git_url"]
        }
    ];

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

    useEffect(() => {
        loadPipeLineList();
    }, [projectStore.curProjectId, curPage]);

    return (
        <Modal open title="选择流水线" footer={null}
            width={800}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Table
                style={{ marginTop: '8px', maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
                rowKey={'pipe_line_id'}
                columns={columns}
                scroll={{ x: 600 }}
                dataSource={pipeLineList}
                pagination={false}
            />
            <Pagination
                total={totalCount}
                pageSize={PAGE_SIZE}
                current={curPage + 1}
                onChange={(page: number) => setCurPage(page - 1)}
            />
        </Modal>
    );
};


const RefPipeLineNode = (props: NodeProps<BoardNode>) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [showModal, setShowModal] = useState(false);
    const [pipeLineInfo, setPipeLineInfo] = useState<PipeLine | null>(null);

    const loadPipeLineInfo = async (pipeLineId: string) => {
        const res = await request(get_pipe_line({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            pipe_line_id: pipeLineId,
            with_update_time: false,
            update_time: 0,
        }));
        setPipeLineInfo(res.pipe_line);
    };

    useEffect(() => {
        if ((props.data.node_data.NodeRefData?.ref_target_id ?? "") != "") {
            loadPipeLineInfo(props.data.node_data.NodeRefData?.ref_target_id ?? "");
        }
    }, [props.data.node_data.NodeRefData?.ref_target_id]);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="引用流水线" onEdit={() => setShowModal(true)} bgColor={props.data.bg_color == "" ? "white" : props.data.bg_color}>
            {pipeLineInfo == null && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: "0px 0px" }} />}
            {pipeLineInfo != null && (
                <div>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(new LinkPipeLineInfo("", projectStore.curProjectId, pipeLineInfo.pipe_line_id), history);
                    }} style={{ fontSize: "16px", fontWeight: 600 }}>{pipeLineInfo.pipe_line_name}</a>
                    <Descriptions column={1} labelStyle={{ width: "90px" }}>
                        <Descriptions.Item label="运行平台">
                            {pipeLineInfo.plat_form == PLATFORM_TYPE_LINUX && "LINUX"}
                            {pipeLineInfo.plat_form == PLATFORM_TYPE_DARWIN && "MAC"}
                            {pipeLineInfo.plat_form == PLATFORM_TYPE_WINDOWS && "WINDOWS"}
                        </Descriptions.Item>
                        <Descriptions.Item label="GIT地址">
                            {pipeLineInfo.gitsource_job.git_url}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
            {showModal == true && (
                <SelectPipeLineModal nodeId={props.data.node_id} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(RefPipeLineNode);