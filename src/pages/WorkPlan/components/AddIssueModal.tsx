import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Form, Input, Modal, Select, Space, message } from "antd";
import type { ISSUE_TYPE } from "@/api/project_issue";
import { ISSUE_TYPE_TASK, ISSUE_TYPE_BUG, create as create_issue, TASK_PRIORITY_LOW, BUG_LEVEL_MINOR, BUG_PRIORITY_LOW, assign_exec_user, assign_check_user, link_sprit, list_by_id } from "@/api/project_issue";
import { useStores } from "@/hooks";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { request } from "@/utils/request";


export interface AddIssueModalProps {
    onClose: () => void;
}

const AddIssueModal = (props: AddIssueModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');
    const spritStore = useStores('spritStore');

    const [issueType, setIssueType] = useState<ISSUE_TYPE>(ISSUE_TYPE_TASK);
    const [title, setTitle] = useState("");
    const [execUserId, setExecUserId] = useState("");
    const [checkUserId, setCheckUserId] = useState("");


    const addIssue = async () => {
        const createRes = await request(create_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_type: issueType,
            basic_info: {
                title: title,
                content: JSON.stringify({ type: "doc" }),
                tag_id_list: [],
            },
            extra_info: {
                ExtraTaskInfo: issueType == ISSUE_TYPE_TASK ? {
                    priority: TASK_PRIORITY_LOW,
                } : undefined,
                ExtraBugInfo: issueType == ISSUE_TYPE_TASK ? undefined : {
                    software_version: "",
                    level: BUG_LEVEL_MINOR,
                    priority: BUG_PRIORITY_LOW,
                },
            }
        }));
        if (execUserId != "") {
            await request(assign_exec_user(userStore.sessionId, projectStore.curProjectId, createRes.issue_id, execUserId));
        }
        if (checkUserId != "") {
            await request(assign_check_user(userStore.sessionId, projectStore.curProjectId, createRes.issue_id, checkUserId));
        }
        await request(link_sprit(userStore.sessionId, projectStore.curProjectId, createRes.issue_id, spritStore.curSpritId));
        const listRes = await request(list_by_id({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id_list: [createRes.issue_id],
        }));
        spritStore.addIssueList(listRes.info_list);
        props.onClose();
        message.info(`增加${issueType == ISSUE_TYPE_TASK ? "任务" : "缺陷"}成功`);
    };

    return (
        <Modal open title="增加任务/缺陷"
            okText="增加" okButtonProps={{ disabled: title == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addIssue();
            }}>
            <Form labelCol={{ span: 3 }}>
                <Form.Item label="类型">
                    <Select value={issueType} onChange={value => setIssueType(value)}>
                        <Select.Option value={ISSUE_TYPE_TASK}>任务</Select.Option>
                        <Select.Option value={ISSUE_TYPE_BUG}>缺陷</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="标题">
                    <Input value={title} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="执行人">
                    <Select value={execUserId} onChange={value => setExecUserId(value)}>
                        <Select.Option value="">未指定</Select.Option>
                        {memberStore.memberList.filter(item => item.member.member_user_id != checkUserId).map(item => (
                            <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                                <Space>
                                    <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                                    {item.member.display_name}
                                </Space>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="检查人">
                    <Select value={checkUserId} onChange={value => setCheckUserId(value)}>
                        <Select.Option value="">未指定</Select.Option>
                        {memberStore.memberList.filter(item => item.member.member_user_id != execUserId).map(item => (
                            <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                                <Space>
                                    <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
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
export default observer(AddIssueModal);
