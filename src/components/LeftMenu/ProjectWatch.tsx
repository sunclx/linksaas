import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Badge } from "antd";
import s from "./ProjectWatch.module.less";
import classNames from 'classnames';
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_WORK_PLAN_PATH, PROJECT_CHAT_TYPE } from "@/utils/constant";
import { LinkChannelInfo, LinkDocInfo, LinkSpritInfo } from "@/stores/linkAux";
import { useHistory, useLocation } from "react-router-dom";
import { CommentOutlined, FileOutlined, FlagOutlined } from "@ant-design/icons";

const ProjectWatch = () => {
    const location = useLocation();
    const history = useHistory();

    const channelStore = useStores('channelStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const docSpaceStore = useStores('docSpaceStore');
    const spritStore = useStores('spritStore');

    return (
        <div className={s.content_wrap}>
            {!projectStore.curProject?.setting.disable_chat && (
                <>
                    {
                        channelStore.channelList.filter(item => item.channelInfo.my_watch).map(item => (
                            <div key={item.channelInfo.channel_id} style={{ position: "relative" }}>
                                <Badge count={item.unreadMsgCount} dot={true} style={{ position: "absolute", left: 0, top: -4 }} />
                                <span className={classNames(s.title, (projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_CHANNEL && channelStore.curChannelId == item.channelInfo.channel_id && location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) ? s.title_active : "")}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, item.channelInfo.channel_id), history);
                                    }}><span className={s.collect} /><CommentOutlined />&nbsp;{item.channelInfo.basic_info.channel_name}</span>
                            </div>
                        ))
                    }
                </>
            )}

            {!projectStore.curProject?.setting.disable_work_plan && (
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

            {!projectStore.curProject?.setting.disable_kb && (
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