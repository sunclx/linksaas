import React, { useEffect, useState } from "react";
import * as dataAnnoTaskApi from "@/api/data_anno_task";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import AddMemberModal from "./AddMemberModal";
import type { ColumnsType } from 'antd/lib/table';
import Table from "antd/lib/table";
import { Button, Modal, message } from "antd";
import { EditNumber } from "@/components/EditCell/EditNumber";


export interface MemberPanelPrps {
    projectId: string;
    annoProjectId: string;
    showAddModal: boolean;
    resourceCount: number;
    onChange: (memberCount: number) => void;
    onSetTask: () => void;
    onRemove: () => void;
    onCancelAdd: () => void;
}

const MemberPanel = (props: MemberPanelPrps) => {
    const [memberInfoList, setMemberInfoList] = useState<dataAnnoTaskApi.MemberInfo[]>([]);
    const [removeMemberUserId, setRemoveMemberUserId] = useState("");

    const loadMemberList = async () => {
        const sessionId = await get_session();
        const res = await request(dataAnnoTaskApi.list_member({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
        }));
        setMemberInfoList(res.info_list);
        props.onChange(res.info_list.length);
    };

    const removeMember = async () => {
        const sessionId = await get_session();
        await request(dataAnnoTaskApi.remove_member({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
            member_user_id: removeMemberUserId,
        }));
        props.onRemove();
        setRemoveMemberUserId("");
        await loadMemberList();
        message.info("删除成功");
    };

    const columns: ColumnsType<dataAnnoTaskApi.MemberInfo> = [
        {
            title: "成员名称",
            dataIndex: "display_name",
            width: 150,
        },
        {
            title: "完成任务数",
            dataIndex: "done_count",
            width: 100,
        },
        {
            title: "任务数",
            width: 150,
            render: (_, row: dataAnnoTaskApi.MemberInfo) => (
                <EditNumber editable={true} value={row.task_count} showEditIcon={true} fixedLen={0}
                    min={row.task_count}
                    max={props.resourceCount}
                    onChange={async (value) => {
                        const sessionId = await get_session();
                        try {
                            await request(dataAnnoTaskApi.set_task_count({
                                session_id: sessionId,
                                project_id: props.projectId,
                                anno_project_id: props.annoProjectId,
                                member_user_id: row.member_user_id,
                                task_count: value,
                            }));
                            const tmpList = memberInfoList.slice();
                            const index = tmpList.findIndex(item => item.member_user_id == row.member_user_id);
                            if (index != -1) {
                                tmpList[index].task_count = value;
                                setMemberInfoList(tmpList);
                            }
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                        props.onSetTask();
                        return true;
                    }} />
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: dataAnnoTaskApi.MemberInfo) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveMemberUserId(row.member_user_id)
                }}>删除</Button>
            )
        }
    ];

    useEffect(() => {
        loadMemberList();
    }, []);

    return (
        <div>
            <Table rowKey="member_user_id" columns={columns} dataSource={memberInfoList} pagination={false} />
            {props.showAddModal == true && (
                <AddMemberModal projectId={props.projectId}
                    annoProjectId={props.annoProjectId}
                    curMemberUserIdList={memberInfoList.map(item => item.member_user_id)}
                    onCancel={() => props.onCancelAdd()}
                    onOk={() => {
                        loadMemberList();
                    }} />
            )}
            {removeMemberUserId != "" && (
                <Modal open title="删除标注成员" okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveMemberUserId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMember();
                    }}>
                    是否删除标注成员?
                </Modal>
            )}
        </div>
    );
};

export default MemberPanel;