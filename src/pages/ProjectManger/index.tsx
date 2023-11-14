import { Button, Card, Modal, Space, Table, message } from "antd";
import React, { useMemo, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_HOME_PATH } from "@/utils/constant";
import type { ColumnsType } from 'antd/lib/table';
import type { WebProjectInfo } from "@/stores/project";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { request } from "@/utils/request";
import { open as open_project, close as close_project, update as update_project } from "@/api/project";
import { leave as leave_project } from "@/api/project_member";
import RemoveProjectModal from "./RemoveProjectModal";
import { EditText } from "@/components/EditCell/EditText";

const ProjectManager = () => {
    const history = useHistory();

    const appStore = useStores('appStore');
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [leaverProjectInfo, setLeaverProjectInfo] = useState<WebProjectInfo | null>(null);
    const [removeProjectInfo, setRemoveProjectInfo] = useState<WebProjectInfo | null>(null);


    const closeProject = async (projectId: string) => {
        await request(close_project(userStore.sessionId, projectId));
        message.info("进入只读模式成功");
    };

    const openProject = async (projectId: string) => {
        await request(open_project(userStore.sessionId, projectId));
        message.info("退出只读模式成功");
    };

    const leaveProject = async () => {
        if (leaverProjectInfo == null) {
            return;
        }
        const projectId = leaverProjectInfo.project_id;
        await request(leave_project(userStore.sessionId, projectId));
        projectStore.removeProject(projectId);
        setLeaverProjectInfo(null);
        message.info("退出项目成功");
    };

    const columns: ColumnsType<WebProjectInfo> = [
        {
            title: "项目名称",
            render: (_, row: WebProjectInfo) => (
                <Space>
                    <EditText editable={row.user_project_perm.can_update && !row.closed}
                        content={row.basic_info.project_name} onChange={async value => {
                            if (value.trim() == "") {
                                return false;
                            }
                            try {
                                await request(update_project(userStore.sessionId, row.project_id, {
                                    project_name: value,
                                    project_desc: row.basic_info.project_desc,
                                }));
                                return true;
                            } catch (e) {
                                console.log(e);
                                return false;
                            }
                        }} showEditIcon={true} onClick={() => {
                            projectStore.setCurProjectId(row.project_id);
                            history.push(APP_PROJECT_HOME_PATH);
                        }} />
                </Space>
            ),
        },
        {
            title: "只读模式",
            width: 100,
            render: (_, row: WebProjectInfo) => row.closed ? "是" : "",
        },
        {
            title: "超级管理员",
            width: 150,
            render: (_, row: WebProjectInfo) => (
                <Space style={{ overflow: "hidden", textOverflow: "clip", whiteSpace: "nowrap" }}>
                    <UserPhoto logoUri={row.owner_logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                    <span>{row.owner_display_name}</span>
                </Space>
            ),
        },
        {
            title: "操作",
            width: 250,
            render: (_, row: WebProjectInfo) => (
                <Space>
                    {row.user_project_perm.can_leave && (
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setLeaverProjectInfo(row);
                        }}>退出项目</a>
                    )}
                    {row.user_project_perm.can_close && (
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            closeProject(row.project_id);
                        }}>进入只读模式</a>
                    )}
                    {row.user_project_perm.can_open && (
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            openProject(row.project_id);
                        }}>退出只读模式</a>
                    )}
                    {row.user_project_perm.can_remove && (
                        <Button type="link" danger style={{ marginLeft: "40px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoveProjectInfo(row);
                        }}>删除项目</Button>
                    )}
                </Space>
            ),
        }
    ];

    useMemo(() => {
        projectStore.setCurProjectId('');
    }, []);

    return (
        <Card title="项目列表" extra={
            <Button type="primary" onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                appStore.showCreateOrJoinProject = true;
            }}>创建/加入项目</Button>
        }
            headStyle={{ fontSize: "18px" }}
            bodyStyle={{ height: "calc(100vh - 90px)", overflowY: "scroll" }}>
            <Table rowKey="project_id" dataSource={projectStore.projectList} columns={columns} pagination={false} />
            {leaverProjectInfo !== null && (
                <Modal open title={`退出项目 ${leaverProjectInfo.basic_info.project_name}`}
                    okText="退出" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLeaverProjectInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        leaveProject();
                    }}>
                    <p>是否退出项目&nbsp;{leaverProjectInfo.basic_info.project_name}&nbsp;?</p>
                    <p>退出项目需要重新邀请才能进入项目</p>
                </Modal>
            )}
            {removeProjectInfo !== null && (
                <RemoveProjectModal projectInfo={removeProjectInfo} onClose={() => setRemoveProjectInfo(null)} />
            )}
        </Card>
    );
};

export default observer(ProjectManager);