import React from "react";
import { observer } from 'mobx-react';
import type { GroupInfo } from "@/api/group";
import { remove as remove_group } from "@/api/group";
import { Modal, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";

export interface RemoveGroupModalProps {
    groupInfo: GroupInfo;
    onCancel: () => void;
    onOk: () => void;
}

const RemoveGroupModal = (props: RemoveGroupModalProps) => {
    const userStore = useStores('userStore');

    const removeGroup = async () => {
        await request(remove_group({
            session_id: userStore.sessionId,
            group_id: props.groupInfo.group_id,
        }));
        message.info("删除兴趣组成功");
        props.onOk();
    };

    return (
        <Modal open title="删除兴趣组"
            okText="删除" okButtonProps={{ danger: true }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                removeGroup();
            }}>
            是否删除兴趣组&nbsp;{props.groupInfo.group_name}&nbsp;?
        </Modal>
    );
};

export default observer(RemoveGroupModal);