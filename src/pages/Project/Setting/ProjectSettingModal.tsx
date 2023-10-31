import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Modal, Tabs, message } from "antd";
import { useStores } from "@/hooks";
import { PROJECT_SETTING_TAB } from "@/utils/constant";
import LayoutSettingPanel from "./components/LayoutSettingPanel";
import AlarmSettingPanel from "./components/AlarmSettingPanel";
import TipListSettingPanel from "./components/TipListSettingPanel";
import TagListSettingPanel from "./components/TagListSettingPanel";
import EventSettingPanel from "./components/EventSettingPanel";


const ProjectSettingModal = () => {
    const projectStore = useStores('projectStore');

    const [activeKey, setActiveKey] = useState("layout");
    const [disableTabs, setDisableTabs] = useState(false);

    useEffect(() => {
        if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT) {
            setActiveKey("layout");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_ALARM) {
            setActiveKey("alarm");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_TIPLIST) {
            setActiveKey("tips");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_TAGLIST) {
            setActiveKey("tags");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_EVENT) {
            setActiveKey("event");
        } 
    }, [projectStore.showProjectSetting]);


    return (
        <Modal open mask={false} footer={null}
            title={`${projectStore.curProject?.basic_info.project_name ?? ""} 项目设置`}
            bodyStyle={{ paddingTop: 0, overflowY: "hidden" }}
            width={"700px"}
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
                    } else if (key == "alarm") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_ALARM;
                    } else if (key == "tips") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_TIPLIST;
                    } else if (key == "tags") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_TAGLIST;
                    } else if (key == "event") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_EVENT;
                    } 
                }}>
                <Tabs.TabPane key="layout" tab="界面布局" disabled={disableTabs}>
                    {activeKey == "layout" && <LayoutSettingPanel onChange={value => setDisableTabs(value)} title="界面布局" />}
                </Tabs.TabPane>
                <Tabs.TabPane key="alarm" tab="项目预警" disabled={disableTabs}>
                    {activeKey == "alarm" && <AlarmSettingPanel onChange={value => setDisableTabs(value)} title="项目预警" />}
                </Tabs.TabPane>
                <Tabs.TabPane key="event" tab="工作记录" disabled={disableTabs}>
                    {activeKey == "event" && <EventSettingPanel onChange={value => setDisableTabs(value)} title="工作记录" />}
                </Tabs.TabPane>

                <Tabs.TabPane key="tips" tab="经验集锦" disabled={disableTabs}>
                    {activeKey == "tips" && <TipListSettingPanel onChange={value => setDisableTabs(value)} title="经验集锦" />}
                </Tabs.TabPane>
                <Tabs.TabPane key="tags" tab="标签设置" disabled={disableTabs}>
                    {activeKey == "tags" && <TagListSettingPanel onChange={value => setDisableTabs(value)} title="标签设置" />}
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default observer(ProjectSettingModal);