import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Modal, Tabs, message } from "antd";
import { useStores } from "@/hooks";
import { PROJECT_SETTING_TAB } from "@/utils/constant";
import LayoutSettingPanel from "./components/LayoutSettingPanel";
import ChatSettingPanel from "./components/ChatSettingPanel";
import AiSettingPanel from "./components/AiSettingPanel";
import AlarmSettingPanel from "./components/AlarmSettingPanel";
import TipListSettingPanel from "./components/TipListSettingPanel";


const ProjectSettingModal = () => {
    const projectStore = useStores('projectStore');

    const [activeKey, setActiveKey] = useState("layout");
    const [disableTabs, setDisableTabs] = useState(false);

    useEffect(() => {
        if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT) {
            setActiveKey("layout");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_CHAT) {
            setActiveKey("chat");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_AI) {
            setActiveKey("ai");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_ALARM) {
            setActiveKey("alarm");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_TIPLIST) {
            setActiveKey("tips");
        }
    }, [projectStore.showProjectSetting]);


    return (
        <Modal open mask={false} footer={null}
            title={`${projectStore.curProject?.basic_info.project_name ?? ""} 项目设置`}
            bodyStyle={{ paddingTop: 0, overflowY: "hidden" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                if (disableTabs) {
                    message.warn("配置未保存");
                } else {
                    projectStore.showProjectSetting = null;
                }
            }}
        >
            <Tabs activeKey={activeKey} tabPosition="left"
                onChange={key => {
                    if (key == "layout") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT;
                    } else if (key == "chat") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_CHAT;
                    } else if (key == "ai") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_AI;
                    } else if (key == "alarm") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_ALARM;
                    } else if(key == "tips") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_TIPLIST;
                    }
                }}>
                <Tabs.TabPane key="layout" tab="界面布局" disabled={disableTabs}>
                    {activeKey == "layout" && <LayoutSettingPanel onChange={value => setDisableTabs(value)} title="界面布局" />}
                </Tabs.TabPane>
                {projectStore.curProject?.setting.disable_chat === false && (
                    <Tabs.TabPane key="chat" tab="沟通设置" disabled={disableTabs}>
                        {activeKey == "chat" && <ChatSettingPanel onChange={value => setDisableTabs(value)} title="沟通设置" />}
                    </Tabs.TabPane>
                )}
                {projectStore.curProject?.setting.disable_chat === false && (
                    <Tabs.TabPane key="ai" tab="AI助理" disabled={disableTabs}>
                        {activeKey == "ai" && <AiSettingPanel onChange={value => setDisableTabs(value)} title="AI助理" />}
                    </Tabs.TabPane>
                )}
                <Tabs.TabPane key="alarm" tab="项目预警" disabled={disableTabs}>
                    {activeKey == "alarm" && <AlarmSettingPanel onChange={value => setDisableTabs(value)} title="项目预警" />}
                </Tabs.TabPane>
                <Tabs.TabPane key="tips" tab="经验集锦" disabled={disableTabs}>
                    {activeKey == "tips" && <TipListSettingPanel onChange={value => setDisableTabs(value)} title="经验集锦" />}
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default observer(ProjectSettingModal);