import React from "react";
import { observer } from 'mobx-react';
import { Button, Modal } from "antd";
import { useStores } from "@/hooks";
import { useHistory } from "react-router-dom";
import { LAYOUT_TYPE_CHAT, LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT } from "@/api/project";
import { LinkChannelInfo } from "@/stores/linkAux";

const GitPostHookModal = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    return (
        <Modal open title="git commit后续操作"
            footer={null} onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                projectStore.showPostHookModal = false;
            }} width={250}>
            您刚才运行了git commit,您是否要？
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {[LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_CHAT].includes(projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB) && (
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        projectStore.showPostHookModal = false;
                        linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, projectStore.curProject?.default_channel_id ?? ""), history);
                    }}>通知相关人员</Button>
                )}

                <Button type="link" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    projectStore.showPostHookModal = false;
                    linkAuxStore.goToTaskList({
                        stateList: [],
                        execUserIdList: [userStore.userInfo.userId],
                        checkUserIdList: [userStore.userInfo.userId],
                    }, history);
                }}>更新任务状态</Button>
                <Button type="link" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    projectStore.showPostHookModal = false;
                    linkAuxStore.goToBugList({
                        stateList: [],
                        execUserIdList: [userStore.userInfo.userId],
                        checkUserIdList: [userStore.userInfo.userId],
                    }, history);
                }}>更新缺陷状态</Button>
            </div>
        </Modal>
    );
};

export default observer(GitPostHookModal);