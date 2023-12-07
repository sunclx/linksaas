import React from "react";
import cls from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Badge } from "antd";
import { APP_PROJECT_HOME_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH } from "@/utils/constant";
import { CaretRightFilled, FolderFilled } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import type { WebProjectInfo } from "@/stores/project";

const ProjectItem: React.FC<{ item: WebProjectInfo }> = ({ item }) => {
    const location = useLocation();
    const history = useHistory();

    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');

    return (
        <div className={cls.project_child_wrap}>
            <div className={`${cls.project_child_title} ${item.closed && cls.close} ${item.project_id == projectStore.curProjectId ? cls.active_menu : ""}`}>
                {item.project_id !== projectStore.curProjectId &&
                    <Badge count={item.project_status.total_count} className={cls.badge} />
                }

                <span className={cls.name} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (appStore.inEdit) {
                        appStore.showCheckLeave(() => {
                            projectStore.setCurProjectId(item.project_id).then(() => {
                                history.push(APP_PROJECT_HOME_PATH);
                            });
                        });
                        return;
                    }
                    projectStore.setCurProjectId(item.project_id).then(() => {
                        history.push(APP_PROJECT_HOME_PATH);
                    });
                }}><FolderFilled style={{ color: item.project_id == projectStore.curProjectId ? "white" : "inherit" }} />&nbsp;{item.basic_info.project_name} </span>
            </div>
            {item.project_id == projectStore.curProjectId && (
                <div>
                    <div className={`${cls.project_sub_menu} ${location.pathname.startsWith(APP_PROJECT_MY_WORK_PATH) ? cls.active_sub_menu : ""}`}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (appStore.inEdit) {
                                appStore.showCheckLeave(() => {
                                    projectStore.setCurProjectId(item.project_id).then(() => {
                                        history.push(APP_PROJECT_MY_WORK_PATH);
                                    });
                                });
                                return;
                            }
                            projectStore.setCurProjectId(item.project_id).then(() => {
                                history.push(APP_PROJECT_MY_WORK_PATH);
                            });
                        }}><CaretRightFilled />我的工作</div>
                    <div className={`${cls.project_sub_menu} ${location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) ? cls.active_sub_menu : ""}`}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (appStore.inEdit) {
                                appStore.showCheckLeave(() => {
                                    projectStore.setCurProjectId(item.project_id).then(() => {
                                        history.push(APP_PROJECT_OVERVIEW_PATH);
                                    });
                                });
                                return;
                            }
                            projectStore.setCurProjectId(item.project_id).then(() => {
                                history.push(APP_PROJECT_OVERVIEW_PATH);
                            });
                        }}><CaretRightFilled />项目概览</div>
                </div>
            )}
        </div>
    );
};

export default observer(ProjectItem);