import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { start_update_content, type Node as BoardNode, keep_update_content, end_update_content, update_content, NODE_REF_TYPE_REQUIRE_MENT } from "@/api/project_board";
import NodeWrap from "./NodeWrap";
import { useStores } from "@/hooks";
import { type RequirementInfo, get_requirement, list_requirement, REQ_SORT_UPDATE_TIME } from "@/api/project_requirement";
import { request } from "@/utils/request";
import { Descriptions, Empty, Modal, Table } from "antd";
import type { ColumnsType } from "antd/lib/table";
import Pagination from '@/components/Pagination';
import { useHistory } from "react-router-dom";
import { LinkRequirementInfo } from "@/stores/linkAux";

const PAGE_SIZE = 10;

interface SelectRequireMentModalProps {
    nodeId: string;
    onClose: () => void;
}

const SelectRequireMentModal = (props: SelectRequireMentModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const [requireMentList, setRequireMentList] = useState<RequirementInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadRequireMentList = async () => {
        const res = await request(list_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_keyword: false,
            keyword: "",
            filter_by_has_link_issue: false,
            has_link_issue: false,
            filter_by_closed: false,
            closed: false,
            filter_by_tag_id_list: false,
            tag_id_list: [],
            filter_by_watch: false,

            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
            sort_type: REQ_SORT_UPDATE_TIME,
        }));
        setTotalCount(res.total_count);
        setRequireMentList(res.requirement_list);
    };

    const updateRequireMentId = async (requireMentId: string) => {
        await request(update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
            node_data: {
                NodeRefData: {
                    ref_type: NODE_REF_TYPE_REQUIRE_MENT,
                    ref_target_id: requireMentId,
                },
            },
        }));
        boardStore.updateNode(props.nodeId);
        props.onClose();
    };

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "标题",
            render: (_, row: RequirementInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateRequireMentId(row.requirement_id);
                }}>{row.base_info.title}</a>
            ),
        },
        {
            title: "关联任务数量",
            width: 100,
            dataIndex: "issue_link_count",
        },
        {
            title: "创建者",
            width: 150,
            dataIndex: "create_display_name",
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
        loadRequireMentList();
    }, [projectStore.curProjectId, curPage]);

    return (
        <Modal open title="选择需求" footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Table
                style={{ marginTop: '8px', maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
                rowKey={'requirement_id'}
                columns={columns}
                dataSource={requireMentList}
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

const RefRequireMentNode = (props: NodeProps<BoardNode>) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [showModal, setShowModal] = useState(false);
    const [requireMentInfo, setRequireMentInfo] = useState<RequirementInfo | null>(null);

    const loadRequireMentInfo = async (requireMentId: string) => {
        const res = await request(get_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: requireMentId,
        }));
        setRequireMentInfo(res.requirement);
    };

    useEffect(() => {
        if ((props.data.node_data.NodeRefData?.ref_target_id ?? "") != "") {
            loadRequireMentInfo(props.data.node_data.NodeRefData?.ref_target_id ?? "");
        }
    }, [props.data.node_data.NodeRefData?.ref_target_id]);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="引用需求" onEdit={() => setShowModal(true)}>
            {requireMentInfo == null && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: "0px 0px" }} />}
            {requireMentInfo != null && (
                <div>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(new LinkRequirementInfo("", projectStore.curProjectId, requireMentInfo.requirement_id), history);
                    }}>{requireMentInfo.base_info.title}</a>
                    <Descriptions column={1} labelStyle={{ width: "90px" }}>
                        <Descriptions.Item label="关联任务">
                            {requireMentInfo.issue_link_count}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
            {showModal == true && (
                <SelectRequireMentModal nodeId={props.data.node_id} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(RefRequireMentNode);