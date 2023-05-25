import { useStores } from "@/hooks";
import { Input, Modal } from "antd";
import { observer } from 'mobx-react';
import React, { useState } from "react";
import { create as create_issue, ISSUE_TYPE_TASK, TASK_PRIORITY_LOW } from '@/api/project_issue';
import { request } from "@/utils/request";
import { link_issue } from '@/api/project_requirement';

interface BatchCreateTaskProps {
    requirementId: string;
    onCancel: () => void;
    onOk: () => void;
}

const BatchCreateTask: React.FC<BatchCreateTaskProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [titles, setTitles] = useState("");
    const [disabled, setDisabled] = useState(true);

    const batchCreate = async () => {
        const titleList = titles.split("\n");
        for (let title of titleList) {
            title = title.trim();
            if (title.length == 0) {
                continue;
            }
            try {
                const res = await request(create_issue({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    issue_type: ISSUE_TYPE_TASK,
                    basic_info: {
                        title: title,
                        content: JSON.stringify({ type: "doc" }),
                        tag_id_list: [],
                    },
                    extra_info: {
                        ExtraTaskInfo: {
                            priority: TASK_PRIORITY_LOW,
                        },
                        ExtraBugInfo: undefined,
                    }
                }));
                await request(link_issue({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    requirement_id: props.requirementId,
                    issue_id: res.issue_id,
                }));
            } catch (e) {
                console.log(e);
            }
        }
        props.onOk();
    };

    return (
        <Modal
            title="批量创建任务"
            open
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            okButtonProps={{ disabled: disabled }}
            okText="创建"
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                batchCreate();
            }}>
            <p>下面每一行将作为一个任务标题</p>
            <Input.TextArea rows={10} onChange={e => {
                e.stopPropagation();
                e.preventDefault();
                setTitles(e.target.value);
                if (e.target.value.trim().length == 0) {
                    setDisabled(true);
                } else {
                    setDisabled(false);
                }
            }} />
        </Modal>
    );
};

export default observer(BatchCreateTask);