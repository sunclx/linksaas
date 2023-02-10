import React from "react";
import cls from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Popover, } from "antd";
import { filterProjectItemList } from "@/utils/constant";

import ProjectItem from "./ProjectItem";
import { runInAction } from "mobx";
import JoinProject from "./JoinProject";
import CreatedProject from "./CreatedProject";
import AddMember from "./AddMember";


const AddMenu: React.FC = observer(() => {
    const appStore = useStores('appStore');

    return (
        <div className={cls.moremenu}
            onClick={(e) => e.stopPropagation()}>
            {appStore.clientCfg?.can_invite && (
                <div
                    className={cls.item}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        appStore.showJoinProject = true;
                    }}
                >
                    加入项目
                </div>
            )}
            <div
                className={cls.item}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    appStore.showCreateProject = true;
                }}
            >
                创建新项目
            </div>
        </div>
    );
});

const FilterMenu = () => {
    const projectStore = useStores('projectStore');

    return (
        <div className={cls.moremenu} onClick={(e) => e.stopPropagation()}>
            {filterProjectItemList.map((item) => (
                <div
                    key={item.value}
                    className={
                        cls.item + ' ' + (item.value === projectStore.filterProjectType ? cls.selected : '')
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        runInAction(() => {
                            projectStore.filterProjectType = item.value;
                        });
                    }}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};

const ProjectList = () => {
    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    return (
        <div className={cls.project_menu}>
            <div className={cls.menu_title}>
                项目

                <div className={cls.menu_icon_wrap}>
                    {appStore.simpleMode == false && (
                        <Popover
                            placement="bottomLeft"
                            content={<AddMenu />}
                            trigger="click"
                            overlayClassName="popover"
                        >
                            <a className={cls.icon_wrap}>
                                <i className={cls.add} />
                            </a>
                        </Popover>
                    )}
                    <Popover
                        placement="bottomLeft"
                        content={<FilterMenu />}
                        trigger="click"
                        overlayClassName="popover"
                    >
                        <a className={cls.icon_wrap}>
                            <i className={cls.more} />
                        </a>
                    </Popover>
                </div>

            </div>
            <div style={{ height: appStore.simpleMode ? "calc(100vh - 125px)" : undefined, maxHeight: appStore.simpleMode ? undefined : "300px", overflowY: "scroll" }}>
                {projectStore.filterProjectList.map(item => (
                    <div key={item.project_id} className={cls.project_child_menu}>
                        <ProjectItem item={item} />
                    </div>
                ))}
            </div>
            {projectStore.projectList.length == 0 && appStore.simpleMode == false && (<div className={cls.zero_project_tips}>
                您的项目列表为空，您可以通过上方的<i className={cls.add} />加入或创建新项目。
            </div>)}
            {appStore.showJoinProject && <JoinProject
                visible={appStore.showJoinProject}
                onChange={(val) => (appStore.showJoinProject = val)}
            />}
            {appStore.showCreateProject && <CreatedProject
                visible={appStore.showCreateProject}
                onChange={(val) => (appStore.showCreateProject = val)}
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