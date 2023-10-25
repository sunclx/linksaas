import React from "react";
import cls from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Badge } from "antd";
import { APP_PROJECT_HOME_PATH } from "@/utils/constant";
import { FolderFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import type { WebProjectInfo } from "@/stores/project";

const ProjectItem: React.FC<{ item: WebProjectInfo }> = ({ item }) => {

    const history = useHistory();
    const projectStore = useStores('projectStore');
    const docStore = useStores('docStore');

    return (
        <div className={cls.project_child_wrap}>
            <div className={`${cls.project_child_title} ${item.closed && cls.close} ${item.project_id == projectStore.curProjectId ? cls.active_menu : ""}`}>
                {item.project_id !== projectStore.curProjectId &&
                    <Badge count={item.project_status.total_count} className={cls.badge} />
                }

                <span className={cls.name} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (docStore.inEdit) {
                        docStore.showCheckLeave(() => {
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
        </div>
    );
};

export default observer(ProjectItem);