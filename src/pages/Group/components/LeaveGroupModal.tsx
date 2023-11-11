import React from "react";
import { observer } from 'mobx-react';
import type { GroupInfo } from "@/api/group";
import { leave as leave_group } from "@/api/group_member";
import { Modal, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";

export interface LeaveGroupModalProps {
    groupInfo: GroupInfo;
    onCancel: () => void;
    onOk: () => void;
}

const LeaveGroupModal = (props: LeaveGroupModalProps) => {
    const userStore = useStores('userStore');

    const leaveGroup = async () => {
        await request(leave_group({
            session_id: userStore.sessionId,
            group_id: props.groupInfo.group_id,
        }));
        message.info("退出兴趣组成功");
        props.onOk();
    };

    return (
        <Modal open title="退出兴趣组"
            okText="退出" okButtonProps={{ danger: true }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                leaveGroup();
            }}>
            是否退出兴趣组&nbsp;{props.groupInfo.group_name}&nbsp;?
        </Modal>
    );
};

export default observer(LeaveGroupModal);