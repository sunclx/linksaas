import { FILE_OWNER_TYPE_ISSUE, FILE_OWNER_TYPE_PROJECT } from '@/api/fs';
import { change_file_fs, change_file_owner, useCommonEditor } from '@/components/Editor';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { Form, Input, Modal, message } from 'antd';
import { observer } from 'mobx-react';
import React, { useState } from "react";
import { create as create_issue, ISSUE_TYPE_TASK, TASK_PRIORITY_MIDDLE } from '@/api/project_issue';
import { link_issue } from '@/api/project_requirement';

interface SingleCreateTaskProps {
    requirementId: string;
    onCancel: () => void;
    onOk: () => void;
}

const SingleCreateTask: React.FC<SingleCreateTaskProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [title, setTitle] = useState("");

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: projectStore.curProject?.issue_fs_id ?? '',
        ownerType: FILE_OWNER_TYPE_PROJECT,
        ownerId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: true,
        widgetInToolbar: false,
        showReminder: false,
    });

    const createIssue = async () => {
        if (title == "") {
            message.error("标题不能为空");
            return;
        }
        const content = editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        //更新文件存储
        await change_file_fs(
            content,
            projectStore.curProject?.issue_fs_id ?? '',
            userStore.sessionId,
            FILE_OWNER_TYPE_PROJECT,
            projectStore.curProjectId,
        );
        const createRes = await request(create_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_type: ISSUE_TYPE_TASK,
            basic_info: {
                title: title,
                content: JSON.stringify(content),
                tag_id_list: [],
            },
            extra_info: {
                ExtraTaskInfo: {
                    priority: TASK_PRIORITY_MIDDLE,
                },
                ExtraBugInfo: undefined,
            }
        }));
        //变更文件Owner
        await change_file_owner(content, userStore.sessionId, FILE_OWNER_TYPE_ISSUE, createRes.issue_id);
        //关联项目需求
        await request(link_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: props.requirementId,
            issue_id: createRes.issue_id,
        }));
        props.onOk();
    };

    return (
        <Modal
            title="创建任务"
            open
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            okButtonProps={{ disabled: title.trim() == "" }}
            okText="创建"
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createIssue();
            }}>
            <Form>
                <Form.Item label="任务标题">
                    <Input onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }} placeholder='请输入任务标题' />
                </Form.Item>
            </Form>
            <div className="_editChatContext">{editor}</div>
        </Modal>
    );
};

export default observer(SingleCreateTask);