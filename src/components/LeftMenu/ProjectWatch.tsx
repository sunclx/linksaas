import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Badge } from "antd";
import s from "./ProjectWatch.module.less";
import classNames from 'classnames';
import { PROJECT_CHAT_TYPE } from "@/utils/constant";
import { LinkChannelInfo, LinkDocInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";
import { CommentOutlined, FileOutlined } from "@ant-design/icons";

const ProjectWatch = () => {
    const history = useHistory();

    const channelStore = useStores('channelStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const docSpaceStore = useStores('docSpaceStore');

    return (
        <div className={s.content_wrap}>
            {channelStore.channelList.filter(item => item.channelInfo.my_watch).map(item => (
                <div key={item.channelInfo.channel_id} style={{ position: "relative" }}>
                    <Badge count={item.unreadMsgCount} dot={true} style={{ position: "absolute", left: 0, top: -4 }} />
                    <span className={classNames(s.title, (projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_CHANNEL && channelStore.curChannelId == item.channelInfo.channel_id) ? s.title_active : "")}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, item.channelInfo.channel_id), history);
                        }}><span className={s.collect}/><CommentOutlined />&nbsp;{item.channelInfo.basic_info.channel_name}</span>
                </div>
            ))}
            {docSpaceStore.curWatchDocList.map(item => (
                <div key={item.doc_id}>
                    <span className={classNames(s.title, docSpaceStore.curDocId == item.doc_id ? s.title_active : "")}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToLink(new LinkDocInfo("", projectStore.curProjectId, "", item.doc_id), history);
                        }}><span className={s.collect}/><FileOutlined />&nbsp;{item.title}</span>
                </div>
            ))}
        </div>
    )
};

export default observer(ProjectWatch);