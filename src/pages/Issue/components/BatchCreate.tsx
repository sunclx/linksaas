import React, { useState } from "react";
import { Input, Modal } from "antd";
import { observer } from 'mobx-react';
import { useLocation } from "react-router-dom";
import { getIssueText, getIsTask } from '@/utils/utils';
import { BUG_LEVEL_MINOR, BUG_PRIORITY_LOW, create as create_issue, ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, TASK_PRIORITY_LOW } from '@/api/project_issue';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";

interface BatchCreateProps {
    onCancel: () => void;
    onOk: () => void;
}

const BatchCreate: React.FC<BatchCreateProps> = (props) => {
    const location = useLocation();

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
                await request(create_issue({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    issue_type: getIsTask(location.pathname) ? ISSUE_TYPE_TASK : ISSUE_TYPE_BUG,
                    basic_info: {
                        title: title,
                        content: JSON.stringify({ type: "doc" }),
                        tag_id_list:[],
                    },
                    extra_info: {
                        ExtraTaskInfo: getIsTask(location.pathname) ? {
                            priority: TASK_PRIORITY_LOW,
                        } : undefined,
                        ExtraBugInfo: getIsTask(location.pathname) ? undefined : {
                            software_version: "",
                            level: BUG_LEVEL_MINOR,
                            priority: BUG_PRIORITY_LOW,
                        },
                    }
                }));
            } catch (e) {
                console.log(e);
            }
        }
        props.onOk();
    }

    return (
        <Modal
            title={`批量创建${getIssueText(location.pathname)}`}
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
            <p>下面每一行将作为一个{getIssueText(location.pathname)}标题</p>
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
}
export default observer(BatchCreate);