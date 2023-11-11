import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { GroupMemberInfo, GroupMemberPerm } from "@/api/group_member";
import { update_member } from "@/api/group_member";
import { Checkbox, Modal } from "antd";
import { MEMBER_PERM_OPTION_LIST, calcMemberPerm } from "./perm_util";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";

export interface UpdatePermModalProps {
    memberInfo: GroupMemberInfo;
    onCancel: () => void;
    onOk: () => void;
}

const UpdatePermModal = (props: UpdatePermModalProps) => {
    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [permStrList, setPermStrList] = useState(calcMemberPerm(props.memberInfo.perm));

    const updatePerm = async () => {
        const perm: GroupMemberPerm = {
            can_invite: false,
            can_list_member: false,
            can_remove_member: false,
            can_update_member: false,
            can_add_post: false,
            can_update_post: false,
            can_remove_post: false,
            can_mark_essence: false,
            can_add_comment: false,
            can_remove_comment: false,
            can_update_comment: false,
        }
        for (const permStr of permStrList) {
            if (permStr == "can_invite") {
                perm.can_invite = true;
            }
            if (permStr == "can_list_member") {
                perm.can_list_member = true;
            }
            if (permStr == "can_remove_member") {
                perm.can_remove_member = true;
            }
            if (permStr == "can_update_member") {
                perm.can_update_member = true;
            }
            if (permStr == "can_add_post") {
                perm.can_add_post = true;
            }
            if (permStr == "can_update_post") {
                perm.can_update_post = true;
            }
            if (permStr == "can_remove_post") {
                perm.can_remove_post = true;
            }
            if (permStr == "can_mark_essence") {
                perm.can_mark_essence = true;
            }
            if (permStr == "can_add_comment") {
                perm.can_add_comment = true;
            }
            if (permStr == "can_remove_comment") {
                perm.can_remove_comment = true;
            }
            if (permStr == "can_update_comment") {
                perm.can_update_comment = true;
            }
        }
        await request(update_member({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            member_user_id: props.memberInfo.member_user_id,
            perm: perm,
        }));
        props.onOk();
    };

    return (
        <Modal open title="修改成员权限"
            okText="修改"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updatePerm();
            }}>
            <Checkbox.Group options={MEMBER_PERM_OPTION_LIST} value={permStrList}
                onChange={value => setPermStrList(value as string[])} />
        </Modal>
    );
};


export default observer(UpdatePermModal);