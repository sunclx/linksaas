import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { start_update_content, type Node as BoardNode, keep_update_content, end_update_content, update_content, NODE_REF_TYPE_API_COLL } from "@/api/project_board";
import NodeWrap from "./NodeWrap";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { get as get_apicoll, list as list_apicoll, type ApiCollInfo, API_COLL_GRPC, API_COLL_OPENAPI, API_COLL_CUSTOM } from "@/api/api_collection";
import { Modal, Table } from "antd";
import Pagination from "@/components/Pagination";
import type { ColumnsType } from "antd/lib/table";

const PAGE_SIZE = 10;

interface SelectApiCollModalProps {
    nodeId: string;
    onClose: () => void;
}

const SelectApiCollModal = (props: SelectApiCollModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const [apiCollList, setApiCollList] = useState<ApiCollInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);


    const loadApiCollList = async () => {
        const res = await request(list_apicoll({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: false,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setApiCollList(res.info_list);
    };

    const updateApiCollId = async (apiCollId: string) => {
        await request(update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
            node_data: {
                NodeRefData: {
                    ref_type: NODE_REF_TYPE_API_COLL,
                    ref_target_id: apiCollId,
                },
            },
        }));
        boardStore.updateNode(props.nodeId);
        props.onClose();
    };

    const columns: ColumnsType<ApiCollInfo> = [
        {
            title: "名称",
            width: 200,
            render: (_, row: ApiCollInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateApiCollId(row.api_coll_id);
                }}>{row.name}</a>
            ),
        },
        {
            title: "接口类型",
            render: (_, row: ApiCollInfo) => (
                <>
                    {row.api_coll_type == API_COLL_GRPC && "GRPC"}
                    {row.api_coll_type == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                    {row.api_coll_type == API_COLL_CUSTOM && "自定义接口"}
                </>
            ),
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
        loadApiCollList();
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
                rowKey={'api_coll_id'}
                columns={columns}
                scroll={{ x: 600 }}
                dataSource={apiCollList}
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

const RefApiCollNode = (props: NodeProps<BoardNode>) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');

    const [showModal, setShowModal] = useState(false);
    const [apiCollInfo, setApiCollInfo] = useState<ApiCollInfo | null>(null);

    const loadApiCollInfo = async (apiCollId: string) => {
        const res = await request(get_apicoll({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: apiCollId,
        }));
        setApiCollInfo(res.info);
    };

    useEffect(() => {
        if ((props.data.node_data.NodeRefData?.ref_target_id ?? "") != "") {
            loadApiCollInfo(props.data.node_data.NodeRefData?.ref_target_id ?? "");
        }
    }, [props.data.node_data.NodeRefData?.ref_target_id]);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="引用接口" onEdit={() => setShowModal(true)}>
            {apiCollInfo?.name ?? ""}
            {showModal == true && (
                <SelectApiCollModal nodeId={props.data.node_id} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(RefApiCollNode);