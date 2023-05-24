import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Checkbox, Form, InputNumber, Space, message } from "antd";
import { useStores } from "@/hooks";
import { update_setting } from "@/api/project";
import { request } from "@/utils/request";
import type { PanelProps } from "./common";


const ChatSettingPanel: React.FC<PanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [minPureTextLen, setMinPureTextLen] = useState(projectStore.curProject?.setting.min_pure_text_len_in_chat ?? 0);
    const [disableWidget, setDisableWidget] = useState(projectStore.curProject?.setting.disable_widget_in_chat ?? false);
    const [allowReplyInDays, setAllowReplyInDays] = useState(projectStore.curProject?.setting.allow_reply_in_days ?? 0);

    const [hasChange, setHasChange] = useState(false);

    const resetConfig = () => {
        setMinPureTextLen(projectStore.curProject?.setting.min_pure_text_len_in_chat ?? 0);
        setDisableWidget(projectStore.curProject?.setting.disable_widget_in_chat ?? false);
        setAllowReplyInDays(projectStore.curProject?.setting.allow_reply_in_days ?? 0);
        setHasChange(false);
    };

    const updateConfig = async () => {
        await request(update_setting({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            setting: {
                ...projectStore.curProject!.setting,
                min_pure_text_len_in_chat: minPureTextLen,
                disable_widget_in_chat: disableWidget,
                allow_reply_in_days: allowReplyInDays,
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
            <Form labelCol={{ span: 9 }}>
                <Form.Item label="纯文本内容最小长度" help={
                    <div>0&nbsp;表示不做限制。<br />汉字以字符计数。<br />数字和英文累计5个字符算一个计数。</div>
                }>
                    <InputNumber controls={false} value={minPureTextLen} precision={0} min={0}
                        onChange={value => {
                            if (value !== null) {
                                setMinPureTextLen(value);
                                setHasChange(true);
                            }
                        }} />
                </Form.Item>
                <Form.Item label="禁止使用内容组件">
                    <Checkbox checked={disableWidget} onChange={e => {
                        e.stopPropagation();
                        setDisableWidget(e.target.checked);
                        setHasChange(true);
                    }} />
                </Form.Item>
                <Form.Item label="回复消息时间限制" help={
                    <span>0&nbsp;表示不做限制</span>
                }>
                    可回复<InputNumber controls={false} value={allowReplyInDays} precision={0} min={0}
                        style={{ width: "50px", margin: "0px 10px" }}
                        onChange={value => {
                            if (value !== null) {
                                setAllowReplyInDays(value);
                                setHasChange(true);
                            }
                        }} />天内的消息
                </Form.Item>
            </Form>
        </Card>
    );
};

export default observer(ChatSettingPanel);