import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import type { Node as BoardNode } from "@/api/project_board";
import NodeWrap from "./NodeWrap";
import { useStores } from "@/hooks";
import SelectIssueModal from "../components/SelectIssueModal";
import { ISSUE_TYPE_TASK, get as get_issue, type IssueInfo } from "@/api/project_issue";
import { request } from "@/utils/request";
import { Empty } from "antd";
import IssueCard from "../components/IssueCard";
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type';

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

    useEffect(() => {
        const unListenFn = listen<NoticeType.AllNotice>("notice", ev => {
            const notice = ev.payload;
            if(notice.IssueNotice?.UpdateIssueNotice?.issue_id == props.data.node_data.NodeRefData?.ref_target_id){
                loadIssueInfo(props.data.node_data.NodeRefData?.ref_target_id ?? "");
            }else if(notice.IssueNotice?.UpdateIssueStateNotice?.issue_id == props.data.node_data.NodeRefData?.ref_target_id){
                loadIssueInfo(props.data.node_data.NodeRefData?.ref_target_id ?? "");
            }else if(notice.IssueNotice?.RemoveIssueNotice?.issue_id == props.data.node_data.NodeRefData?.ref_target_id){
                setIssueInfo(null);
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, []);

    return (
        <NodeWrap minWidth={150} minHeight={150} canEdit={entryStore.curEntry?.can_update ?? false} width={props.data.w} height={props.data.h}
            nodeId={props.data.node_id} title="引用任务" onEdit={() => setShowModal(true)} bgColor={props.data.bg_color == "" ? "white" : props.data.bg_color}>
            {issueInfo == null && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: "0px 0px" }} />}
            {issueInfo != null && <IssueCard issueInfo={issueInfo}/>}
            {showModal == true && (
                <SelectIssueModal nodeId={props.data.node_id} disableLinkReq={false} type={ISSUE_TYPE_TASK} onClose={() => setShowModal(false)} />
            )}
        </NodeWrap>
    );
};

export default observer(RefTaskNode);