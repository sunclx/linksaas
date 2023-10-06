import React from "react";
import cls from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Badge } from "antd";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_WORK_PLAN_PATH, } from "@/utils/constant";
import { FolderFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import type { WebProjectInfo } from "@/stores/project";
import ProjectWatch from "./ProjectWatch";

const ProjectItem: React.FC<{ item: WebProjectInfo }> = ({ item }) => {

    const history = useHistory();
    const projectStore = useStores('projectStore');
    const docSpaceStore = useStores('docSpaceStore');

    return (
        <div className={cls.project_child_wrap}>
            <div className={`${cls.project_child_title} ${item.closed && cls.close} ${item.project_id == projectStore.curProjectId ? cls.active_menu : ""}`}>
                {item.project_id !== projectStore.curProjectId &&
                    <Badge count={item.project_status.total_count} className={cls.badge} />
                }

                <span className={cls.name} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (docSpaceStore.inEdit) {
                        docSpaceStore.showCheckLeave(() => {
                            projectStore.setCurProjectId(item.project_id).then(() => {
                                if (!item.setting.disable_chat) {
                                    history.push(APP_PROJECT_CHAT_PATH);
                                } else if (!item.setting.disable_work_plan) {
                                    history.push(APP_PROJECT_WORK_PLAN_PATH);
                                } else if (!item.setting.disable_kb) {
                                    history.push(APP_PROJECT_KB_DOC_PATH);
                                } else if (item.setting.disable_chat && item.setting.disable_kb && item.setting.disable_work_plan) {
                                    history.push(APP_PROJECT_MY_WORK_PATH);
                                }
                            });
                        });
                        return;
                    }
                    projectStore.setCurProjectId(item.project_id).then(() => {
                        if (!item.setting.disable_chat) {
                            history.push(APP_PROJECT_CHAT_PATH);
                        } else if (!item.setting.disable_work_plan) {
                            history.push(APP_PROJECT_WORK_PLAN_PATH);
                        } else if (!item.setting.disable_kb) {
                            history.push(APP_PROJECT_KB_DOC_PATH);
                        } else if (item.setting.disable_chat && item.setting.disable_kb && item.setting.disable_work_plan) {
                            history.push(APP_PROJECT_MY_WORK_PATH);
                        }
                    });
                }}><FolderFilled style={{ color: item.project_id == projectStore.curProjectId ? "white" : "inherit" }} />&nbsp;{item.basic_info.project_name} </span>
                {item.project_id == projectStore.curProjectId && (
                    <div>
                        <ProjectWatch />
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(ProjectItem);