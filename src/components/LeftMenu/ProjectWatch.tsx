import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import s from "./ProjectWatch.module.less";
import classNames from 'classnames';
import { APP_PROJECT_KB_DOC_PATH, APP_PROJECT_WORK_PLAN_PATH } from "@/utils/constant";
import { LinkDocInfo, LinkSpritInfo } from "@/stores/linkAux";
import { useHistory, useLocation } from "react-router-dom";
import { FileOutlined, FlagOutlined } from "@ant-design/icons";

const ProjectWatch = () => {
    const location = useLocation();
    const history = useHistory();

    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const docSpaceStore = useStores('docSpaceStore');
    const spritStore = useStores('spritStore');

    return (
        <div className={s.content_wrap}>
            {projectStore.curProject?.setting.disable_work_plan == false && projectStore.curProject?.setting.hide_watch_walk_plan == false && (
                <>
                    {
                        spritStore.curWatchList.map(item => (
                            <div key={item.sprit_id}>
                                <span className={classNames(s.title, (spritStore.curSpritId == item.sprit_id && location.pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) ? s.title_active : "")}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        linkAuxStore.goToLink(new LinkSpritInfo("", item.project_id, item.sprit_id), history);
                                    }}><span className={s.collect} /><FlagOutlined />&nbsp;{item.basic_info.title}</span>
                            </div>
                        ))

                    }
                </>
            )}

            {projectStore.curProject?.setting.disable_kb == false && projectStore.curProject.setting.hide_watch_doc == false && (
                <>
                    {docSpaceStore.curWatchDocList.map(item => (
                        <div key={item.doc_id}>
                            <span className={classNames(s.title, (docSpaceStore.curDocId == item.doc_id && location.pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) ? s.title_active : "")}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    linkAuxStore.goToLink(new LinkDocInfo("", projectStore.curProjectId, "", item.doc_id), history);
                                }}><span className={s.collect} /><FileOutlined />&nbsp;{item.title}</span>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
};

export default observer(ProjectWatch);