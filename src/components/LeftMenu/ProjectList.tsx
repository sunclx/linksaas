import React from "react";
import cls from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";

import ProjectItem from "./ProjectItem";
import CreatedOrJoinProject from "./CreatedOrJoinProject";
import AddMember from "./AddMember";
import { PlusOutlined, ProjectOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { useHistory, useLocation } from "react-router-dom";
import { APP_PROJECT_MANAGER_PATH } from "@/utils/constant";


const ProjectList = () => {
    const location = useLocation();
    const history = useHistory();

    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');
    const docStore = useStores('docStore');

    return (
        <div className={cls.project_menu}>
            <div className={classNames(cls.menu_title, location.pathname.startsWith(APP_PROJECT_MANAGER_PATH) ? cls.active_menu : "")}>
                <div style={{ width: "120px", cursor: "pointer" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (docStore.inEdit) {
                        docStore.showCheckLeave(() => {
                            history.push(APP_PROJECT_MANAGER_PATH);
                        });
                    } else {
                        history.push(APP_PROJECT_MANAGER_PATH);
                    }
                }}>
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
            <div style={{ maxHeight: "calc(50vh - 200px)", overflowY: "scroll"}}>
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