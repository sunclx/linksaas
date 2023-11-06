import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import type { Node as BoardNode } from "@/api/project_board";
import NodeWrap from "./NodeWrap";
import { useStores } from "@/hooks";
import SelectIssueModal from "../components/SelectIssueModal";
import { ISSUE_TYPE_TASK, get as get_issue, type IssueInfo } from "@/api/project_issue";
import { request } from "@/utils/request";

const RefTaskNode = (props: NodeProps<BoardNode>) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');

    const [showModal, setShowModal] = useState(false);
    const [issueInfo, setIssueInfo] = useState<IssueInfo | null>(null);

    const loadIssueInfo = async (issueId: string) => {
        const res = await request(get_issue(userStore.sessionId, projectStore.curProjectId, issueId));
        setIssueInfo(res.info);
    };

    useEffect(() => {
        if ((props.data.node_data.NodeRefData?.ref_target_id ?? "") != "") {
            loadIssueInfo(props.data.node_data.NodeRefData?.ref_target_id ?? "");
        }
    }, [props.data.node_data.NodeRefData?.ref_target_id]);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="引用任务" onEdit={() => setShowModal(true)}>
            {issueInfo?.basic_info.title??""}
            {showModal == true && (
                <SelectIssueModal nodeId={props.data.node_id} disableLinkReq={false} type={ISSUE_TYPE_TASK} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(RefTaskNode);