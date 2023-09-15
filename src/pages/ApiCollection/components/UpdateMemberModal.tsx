import { Form, Modal, Select, Space } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { update_edit_member } from "@/api/api_collection";
import { request } from "@/utils/request";

export interface UpdateMemberModalProps {
    apiCollId: string;
    memberIdList: string[];
    onCancel: () => void;
    onOk: () => void;
}

const UpdateMemberModal = (props: UpdateMemberModalProps) => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");
    const memberStore = useStores("memberStore");

    const [memberIdList, setMemberIdList] = useState(props.memberIdList);
    const [hasChange, setHasChange] = useState(false);

    const updateMemberList = async () => {
        await request(update_edit_member({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: props.apiCollId,
            member_user_id_list: memberIdList,
        }));
        props.onOk();
    };

    return (
        <Modal open title="更新可编辑用户列表"
            okText="更新" okButtonProps={{ disabled: !hasChange }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateMemberList();
            }}>
            <Form>
                <Form.Item label="可编辑用户">
                    <Select mode="multiple" value={memberIdList} onChange={value => {
                        setMemberIdList(value);
                        setHasChange(true);
                    }}>
                        {memberStore.memberList.map(item => (
                            <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                                <Space>
                                    <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px" }} />
                                    {item.member.display_name}
                                </Space>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(UpdateMemberModal);