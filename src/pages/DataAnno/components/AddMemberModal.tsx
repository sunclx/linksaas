import { Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import type { MemberInfo } from "@/api/project_member";
import { list_member } from "@/api/project_member";
import { get_session } from "@/api/user";
import { request } from "@/utils/request";
import { add_member } from "@/api/data_anno_task";


export interface AddMemberModalProps {
    projectId: string;
    annoProjectId: string;
    curMemberUserIdList: string[];
    onCancel: () => void;
    onOk: () => void;
}


const AddMemberModal = (props: AddMemberModalProps) => {
    const [memberInfoList, setMemberInfoList] = useState<MemberInfo[]>([]);
    const [selMemberUserIdList, setSelMemberUserIdList] = useState<string[]>([]);

    const loadMemberInfoList = async () => {
        const sessionId = await get_session();
        const res = await request(list_member(sessionId, props.projectId, false, []));
        setMemberInfoList(res.member_list);
    };

    const addMember = async () => {
        const sessionId = await get_session();

        for (const memberUserId of selMemberUserIdList) {
            await request(add_member({
                session_id: sessionId,
                project_id: props.projectId,
                anno_project_id: props.annoProjectId,
                member_user_id: memberUserId,
            }));
        }
        props.onOk();
        message.info("增加成功");
    };

    useEffect(() => {
        loadMemberInfoList();
    }, []);

    return (
        <Modal open title="增加标注成员"
            okText="增加" okButtonProps={{ disabled: selMemberUserIdList.length == 0 }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addMember();
            }}>
            <Select value={selMemberUserIdList} style={{ width: "100%" }} mode="multiple"
                onChange={value => setSelMemberUserIdList(value)}>
                {memberInfoList.filter(item => props.curMemberUserIdList.includes(item.member_user_id) == false).map(item => (
                    <Select.Option key={item.member_user_id} value={item.member_user_id}>{item.display_name}</Select.Option>
                ))}
            </Select>
        </Modal>
    );
};

export default AddMemberModal;