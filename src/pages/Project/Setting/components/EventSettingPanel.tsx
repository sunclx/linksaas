import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { update_setting } from "@/api/project";
import { request } from "@/utils/request";
import type { PanelProps } from "./common";
import { useStores } from "@/hooks";
import { Button, Card, Checkbox, Form, Space, message } from "antd";

const EventSettingPanel: React.FC<PanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [hideCustomEvent, setHideCustomEvent] = useState(projectStore.curProject?.setting.hide_custom_event ?? false);
    const [hideCustomEventForAdmin, setHideCustomEventForAdmin] = useState(projectStore.curProject?.setting.hide_custom_event_for_admin ?? false);

    const [hasChange, setHasChange] = useState(false);

    const resetConfig = () => {
        setHideCustomEvent(projectStore.curProject?.setting.hide_custom_event ?? false);
        setHideCustomEventForAdmin(projectStore.curProject?.setting.hide_custom_event_for_admin ?? false);
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
                hide_custom_event: hideCustomEvent,
                hide_custom_event_for_admin: hideCustomEventForAdmin,
            },
        }));
        message.info("保存成功");
        await projectStore.updateProject(projectStore.curProjectId);
        setHasChange(false);
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
            <Form labelCol={{ span: 9 }} disabled={projectStore.isClosed || !projectStore.isAdmin}>
                <Form.Item label="不显示自定义事件(普通用户)" >
                    <Checkbox checked={hideCustomEvent} onChange={e => {
                        e.stopPropagation();
                        setHideCustomEvent(e.target.checked);
                        setHasChange(true);
                    }} />
                </Form.Item>
                <Form.Item label="不显示自定义事件(管理员)">
                    <Checkbox checked={hideCustomEventForAdmin} onChange={e => {
                        e.stopPropagation();
                        setHideCustomEventForAdmin(e.target.checked);
                        setHasChange(true);
                    }} />
                </Form.Item>
            </Form>
        </Card>
    );

};

export default observer(EventSettingPanel);