import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Form, Input, Radio, Space } from "antd";
import { useStores } from "@/hooks";
import { open as open_project, close as close_project, remove as remove_project } from "@/api/project";
import { request } from "@/utils/request";
import { useHistory } from "react-router-dom";


const DangerPanel: React.FC = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [prjName, setPrjName] = useState("");


    const openProject = async () => {
        await request(open_project(userStore.sessionId, projectStore.curProjectId));
        projectStore.updateProject(projectStore.curProjectId);
    };

    const closeProject = async () => {
        await request(close_project(userStore.sessionId, projectStore.curProjectId));
        projectStore.updateProject(projectStore.curProjectId);
    };

    const removeProject = async () => {
        await request(remove_project(userStore.sessionId, projectStore.curProjectId));
        projectStore.showProjectSetting = null;
        projectStore.removeProject(projectStore.curProjectId, history);
    };

    return (
        <Card bordered={false} title="项目模式" extra={
            <Radio.Group value={projectStore.curProject?.closed ?? false} onChange={e => {
                e.stopPropagation();
                setPrjName("");
                if (e.target.value) {
                    closeProject();
                } else {
                    openProject();
                }
            }}>
                <Radio value={false}>正常模式</Radio>
                <Radio value={true}>只读模式</Radio>
            </Radio.Group>
        }>
            {(projectStore.curProject?.closed ?? false) == true && (
                <Form>
                    <Form.Item label="删除项目" help={
                        <span style={{ color: "red" }}>
                            项目被删除后，将无法再访问该项目的任何内容
                        </span>
                    }>
                        <Space>
                            <Input style={{ width: "410px" }} placeholder="请输入项目名称" value={prjName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setPrjName(e.target.value);
                            }} />
                            <Button type="primary" danger disabled={prjName !== (projectStore.curProject?.basic_info.project_name ?? "")}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeProject();
                                }}>删除项目</Button>
                        </Space>
                    </Form.Item>
                </Form>
            )}

        </Card>
    );
};

export default observer(DangerPanel);