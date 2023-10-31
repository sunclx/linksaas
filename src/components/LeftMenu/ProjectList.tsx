import React from "react";
import cls from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";

import ProjectItem from "./ProjectItem";
import CreatedOrJoinProject from "./CreatedOrJoinProject";
import AddMember from "./AddMember";
import { PlusOutlined, ProjectOutlined } from "@ant-design/icons";


const ProjectList = () => {
    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    return (
        <div className={cls.project_menu}>
            <div className={cls.menu_title}>
                <div>
                    <ProjectOutlined style={{ width: "20px" }} />项目
                </div>
                <div className={cls.menu_icon_wrap}>
                    <a className={cls.icon_wrap} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        appStore.showCreateOrJoinProject = true;
                    }}>
                        <i><PlusOutlined /></i>
                    </a>
                </div>

            </div>
            <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
                {projectStore.projectList.map(item => (
                    <div key={item.project_id} className={cls.project_child_menu}>
                        <ProjectItem item={item} />
                    </div>
                ))}
            </div>
            {projectStore.projectList.length == 0 && (<div className={cls.zero_project_tips}>
                您可以通过上方的&nbsp;<PlusOutlined />&nbsp;加入或创建新项目。
            </div>)}

            {appStore.showCreateOrJoinProject && <CreatedOrJoinProject
                visible={appStore.showCreateOrJoinProject}
                onChange={(val) => (appStore.showCreateOrJoinProject = val)}
            />}
            {
                memberStore.showInviteMember && <AddMember
                    visible={memberStore.showInviteMember}
                    onChange={(val) => memberStore.showInviteMember = val} />
            }
        </div>
    )
};

export default observer(ProjectList);