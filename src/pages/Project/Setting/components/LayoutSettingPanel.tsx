
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Checkbox, Form, Space, message } from "antd";
import { useStores } from "@/hooks";
import { update_setting } from "@/api/project";
import { request } from "@/utils/request";
import { PROJECT_SETTING_TAB } from "@/utils/constant";
import type { PanelProps } from "./common";

const LayoutSettingPanel: React.FC<PanelProps> = (props) => {


    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');


    const [disableExtEvent, setDisableExtEvent] = useState(projectStore.curProject?.setting.disable_ext_event ?? false);
    const [disableDataAnno, setDisableDataAnno] = useState(projectStore.curProject?.setting.disable_data_anno ?? false);
    const [disableApiCollection, setDisableApiCollection] = useState(projectStore.curProject?.setting.disable_api_collection ?? false);

    const [hideProjectInfo, setHideProjectInfo] = useState(projectStore.curProject?.setting.hide_project_info ?? false);
    const [hideBulletin, setHideBulletin] = useState(projectStore.curProject?.setting.hide_bulletin ?? false);
    const [hideExtraInfo, setHideExtraInfo] = useState(projectStore.curProject?.setting.hide_extra_info ?? false);

    const [hideWatchTask, setHideWatchTask] = useState(projectStore.curProject?.setting.hide_watch_task ?? false);
    const [hideWatchBug, setHideWatchBug] = useState(projectStore.curProject?.setting.hide_watch_bug ?? false);

    const [hasChange, setHasChange] = useState(false);

    const resetConfig = () => {
        setDisableExtEvent(projectStore.curProject?.setting.disable_ext_event ?? false);
        setDisableDataAnno(projectStore.curProject?.setting.disable_data_anno ?? false);
        setDisableApiCollection(projectStore.curProject?.setting.disable_api_collection ?? false);

        setHideProjectInfo(projectStore.curProject?.setting.hide_project_info ?? false);
        setHideBulletin(projectStore.curProject?.setting.hide_bulletin ?? false);
        setHideExtraInfo(projectStore.curProject?.setting.hide_extra_info ?? false);
        setHasChange(false);
    };

    const updateConfig = async () => {
        if(projectStore.curProject == undefined){
            return;
        }
        await request(update_setting({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            setting: {
                ...projectStore.curProject.setting,
                disable_ext_event: disableExtEvent,
                disable_data_anno: disableDataAnno,
                disable_api_collection: disableApiCollection,
                hide_project_info: hideProjectInfo,
                hide_bulletin: hideBulletin,
                hide_extra_info: hideExtraInfo,
                hide_watch_task: hideWatchTask,
                hide_watch_bug: hideWatchBug,
            },
        }));
        message.info("保存成功");
        await projectStore.updateProject(projectStore.curProjectId);
        setHasChange(false);

        projectStore.showProjectSetting = null;
        setTimeout(() => {
            projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT;
        }, 200);
    };

    useEffect(() => {
        props.onChange(hasChange);
    }, [hasChange]);

    return (
        <Card bordered={false} title={props.title} bodyStyle={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
            extra={
                <Space>
                    <Button disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        resetConfig();
                    }}>取消</Button>
                    <Button type="primary" disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateConfig();
                    }}>保存</Button>
                </Space>
            }>
            <Form labelCol={{ span: 5 }} disabled={projectStore.isClosed || !projectStore.isAdmin}>
                <Form.Item label="右侧工具栏">
                    <Space direction="vertical">
                        <Checkbox checked={disableApiCollection} onChange={e => {
                            e.stopPropagation();
                            setDisableApiCollection(e.target.checked);
                            setHasChange(true);
                        }}>关闭接口集合入口</Checkbox>
                        <Checkbox checked={disableDataAnno} onChange={e => {
                            e.stopPropagation();
                            setDisableDataAnno(e.target.checked);
                            setHasChange(true);
                        }}>关闭数据标注入口</Checkbox>
                        <Checkbox checked={disableExtEvent} onChange={e => {
                            e.stopPropagation();
                            setDisableExtEvent(e.target.checked);
                            setHasChange(true);
                        }}>关闭第三方接入入口</Checkbox>
                    </Space>
                </Form.Item>
                <Form.Item label="我的工作">
                    <Space direction="vertical">
                        <Checkbox checked={hideWatchTask} onChange={e => {
                            e.stopPropagation();
                            setHideWatchTask(e.target.checked);
                            setHasChange(true);
                        }}>隐藏关注任务</Checkbox>
                        <Checkbox checked={hideWatchBug} onChange={e => {
                            e.stopPropagation();
                            setHideWatchBug(e.target.checked);
                            setHasChange(true);
                        }}>隐藏关注缺陷</Checkbox>
                    </Space>
                </Form.Item>
                <Form.Item label="项目概览">
                    <Space direction="vertical">
                        <Checkbox checked={hideProjectInfo} onChange={e => {
                            e.stopPropagation();
                            setHideProjectInfo(e.target.checked);
                            setHasChange(true);
                        }}>隐藏项目详情</Checkbox>
                        <Checkbox checked={hideBulletin} onChange={e => {
                            e.stopPropagation();
                            setHideBulletin(e.target.checked);
                            setHasChange(true);
                        }}>隐藏项目公告</Checkbox>



                        <Checkbox checked={hideExtraInfo} onChange={e => {
                            e.stopPropagation();
                            setHideExtraInfo(e.target.checked);
                            setHasChange(true);
                        }}>隐藏项目其他信息</Checkbox>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default observer(LayoutSettingPanel);