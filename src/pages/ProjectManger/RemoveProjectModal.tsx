import React, { useState } from "react";
import type { WebProjectInfo } from "@/stores/project";
import { observer } from 'mobx-react';
import { Input, Modal,message } from "antd";
import { useStores } from "@/hooks";
import { remove as remove_project } from "@/api/project";
import { request } from "@/utils/request";


export interface RemoveProjectModalProps {
    projectInfo: WebProjectInfo;
    onClose: () => void;
}

const RemoveProjectModal = (props: RemoveProjectModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [name, setName] = useState("");

    const removeProject = async () => {
        await request(remove_project(userStore.sessionId, props.projectInfo.project_id));
        projectStore.removeProject(props.projectInfo.project_id);
        props.onClose();
        message.info("删除项目成功");
    };

    return (
        <Modal open title={`删除项目 ${props.projectInfo.basic_info.project_name}`}
            okText="删除" okButtonProps={{ danger: true, disabled: name != props.projectInfo.basic_info.project_name }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                removeProject();
            }}>
            <p style={{ color: "red" }}>删除项目后，项目内的所有数据均不可访问</p>
            <Input placeholder="请输入要删除的项目名称" value={name} onChange={e => {
                e.stopPropagation();
                e.preventDefault();
                setName(e.target.value.trim());
            }} />
        </Modal>
    );
};

export default observer(RemoveProjectModal);