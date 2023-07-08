import { Form, InputNumber, Modal, message } from "antd";
import React, { useState } from "react";
import type { MemberInfo } from "@/api/data_anno_task";
import { set_task_count } from "@/api/data_anno_task";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";

export interface AssignTaskModalProps {
    projectId: string;
    annoProjectId: string;
    memberInfo: MemberInfo;
    resourceCount: number;
    onCancel: () => void;
    onOk: () => void;
}

const AssignTaskModal = (props: AssignTaskModalProps) => {
    const [taskCount, setTaskCount] = useState(props.memberInfo.task_count);

    const assginTask = async () => {
        const sessionId = await get_session();
        await request(set_task_count({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
            member_user_id: props.memberInfo.member_user_id,
            task_count: taskCount,
        }));
        message.info("分配任务成功");
        props.onOk();
    };

    return (
        <Modal open title="分配任务" okText="分配" okButtonProps={{ disabled: taskCount <= props.memberInfo.task_count }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                assginTask();
            }}>
            <Form labelCol={{ span: 4 }}>
                <Form.Item label="标注成员">
                    {props.memberInfo.display_name}
                </Form.Item>
                <Form.Item label="最大任务数">
                    {props.resourceCount}
                </Form.Item>
                <Form.Item label="已完成任务">
                    {props.memberInfo.done_count}
                </Form.Item>
                <Form.Item label="当前任务数">
                    <InputNumber value={taskCount} controls={false} precision={0} min={props.memberInfo.task_count} max={props.resourceCount}
                        onChange={value => setTaskCount(value as number)} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AssignTaskModal;