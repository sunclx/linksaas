import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Checkbox, Form, Modal, Radio, Space, Tabs ,message} from "antd";
import { useStores } from "@/hooks";
import { LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_CHAT, LAYOUT_TYPE_KB } from "@/api/project";
import type { LAYOUT_TYPE } from "@/api/project";
import { update_setting } from "@/api/project";
import { request } from "@/utils/request";
import { useHistory, useLocation } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_KB_PATH } from "@/utils/constant";


const ProjectSettingModal = () => {
    const location = useLocation();
    const history = useHistory();

    const appStore = useStores('appStore');
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [layoutType, setLayoutType] = useState<LAYOUT_TYPE>(projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB);
    const [disableMemberAppraise, setDisableMemberAppraise] = useState(projectStore.curProject?.setting.disable_member_appraise ?? false);
    const [disableTestCase, setDisableTestCase] = useState(projectStore.curProject?.setting.disable_test_case ?? false);
    const [disableSprit, setDisableSprit] = useState(projectStore.curProject?.setting.disable_sprit ?? false);
    const [disableServerAgent, setDisableServerAgent] = useState(projectStore.curProject?.setting.disable_server_agent ?? false);
    const [disableExtEvent, setDisableExtEvent] = useState(projectStore.curProject?.setting.disable_ext_event ?? false);
    const [disableAppStore, setDisableAppStore] = useState(projectStore.curProject?.setting.disable_app_store ?? false);

    const updateSetting = async () => {
        await request(update_setting({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            setting: {
                layout_type: layoutType,
                disable_member_appraise: disableMemberAppraise,
                disable_test_case: disableTestCase,
                disable_sprit: disableSprit,
                disable_server_agent: disableServerAgent,
                disable_ext_event: disableExtEvent,
                disable_app_store: disableAppStore,
            },
        }));
        await projectStore.updateProject(projectStore.curProjectId);
        appStore.showProjectSetting = false;
        message.info("修改项目设置成功");
        //特殊处理
        if(layoutType == LAYOUT_TYPE_CHAT && !location.pathname.startsWith(APP_PROJECT_CHAT_PATH)){
            history.push(APP_PROJECT_CHAT_PATH);
        }else if(layoutType == LAYOUT_TYPE_KB && !location.pathname.startsWith(APP_PROJECT_KB_PATH)){
            history.push(APP_PROJECT_KB_DOC_PATH);
        }
    };

    return (
        <Modal open title={`${projectStore.curProject?.basic_info.project_name ?? ""} 项目设置`}
            bodyStyle={{ paddingTop: 0 }}
            okText="更新"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                appStore.showProjectSetting = false;
            }}
            onOk={e=>{
                e.stopPropagation();
                e.preventDefault();
                updateSetting();
            }}>
            <Tabs defaultActiveKey="layout" type="card">
                <Tabs.TabPane key="layout" tab="界面布局">
                    <Form labelCol={{ span: 4 }}>
                        <Form.Item label="主界面">
                            <Radio.Group value={layoutType} onChange={e => {
                                e.stopPropagation();
                                setLayoutType(e.target.value);
                            }}>
                                <Space direction="vertical">
                                    <Radio value={LAYOUT_TYPE_CHAT_AND_KB}>显示沟通和知识库</Radio>
                                    <Radio value={LAYOUT_TYPE_KB_AND_CHAT}>显示知识库和沟通</Radio>
                                    <Radio value={LAYOUT_TYPE_CHAT}>只显示沟通</Radio>
                                    <Radio value={LAYOUT_TYPE_KB}>只显示知识库</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="右侧工具栏">
                            <Space direction="vertical">
                                <Checkbox checked={disableMemberAppraise} onChange={e => {
                                    e.stopPropagation();
                                    setDisableMemberAppraise(e.target.checked);
                                }}>关闭成员互评入口</Checkbox>
                                <Checkbox checked={disableTestCase} onChange={e => {
                                    e.stopPropagation();
                                    setDisableTestCase(e.target.checked);
                                }}>关闭测试用例入口</Checkbox>
                                <Checkbox checked={disableSprit} onChange={e => {
                                    e.stopPropagation();
                                    setDisableSprit(e.target.checked);
                                }}>关闭迭代入口</Checkbox>
                                <Checkbox checked={disableServerAgent} onChange={e => {
                                    e.stopPropagation();
                                    setDisableServerAgent(e.target.checked);
                                }}>关闭自动化入口</Checkbox>
                                <Checkbox checked={disableExtEvent} onChange={e => {
                                    e.stopPropagation();
                                    setDisableExtEvent(e.target.checked);
                                }}>关闭第三方接入入口</Checkbox>
                                <Checkbox checked={disableAppStore} onChange={e => {
                                    e.stopPropagation();
                                    setDisableAppStore(e.target.checked);
                                }}>关闭应用市场入口</Checkbox>
                            </Space>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default observer(ProjectSettingModal);