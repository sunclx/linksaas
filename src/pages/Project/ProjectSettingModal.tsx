import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Checkbox, Form, Input, Modal, Radio, Space, Tabs, Tooltip, message } from "antd";
import { useStores } from "@/hooks";
import { LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_CHAT, LAYOUT_TYPE_KB, LAYOUT_TYPE_NONE } from "@/api/project";
import type { LAYOUT_TYPE } from "@/api/project";
import { update_setting, set_ai_gateway } from "@/api/project";
import { request } from "@/utils/request";
import { useHistory, useLocation } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_KB_PATH, APP_PROJECT_OVERVIEW_PATH, PROJECT_SETTING_TAB } from "@/utils/constant";
import { QuestionCircleOutlined } from "@ant-design/icons";


const ProjectSettingModal = () => {
    const location = useLocation();
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    //界面设置相关参数
    const [layoutType, setLayoutType] = useState<LAYOUT_TYPE>(projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB);
    const [disableMemberAppraise, setDisableMemberAppraise] = useState(projectStore.curProject?.setting.disable_member_appraise ?? false);
    const [disableTestCase, setDisableTestCase] = useState(projectStore.curProject?.setting.disable_test_case ?? false);
    const [disableSprit, setDisableSprit] = useState(projectStore.curProject?.setting.disable_sprit ?? false);
    const [disableServerAgent, setDisableServerAgent] = useState(projectStore.curProject?.setting.disable_server_agent ?? false);
    const [disableExtEvent, setDisableExtEvent] = useState(projectStore.curProject?.setting.disable_ext_event ?? false);
    const [disableAppStore, setDisableAppStore] = useState(projectStore.curProject?.setting.disable_app_store ?? false);

    //AI助理相关设置
    const [aiGatewayAddr, setAiGatewayAddr] = useState(projectStore.curProject?.ai_gateway_addr ?? "");
    const [aiGatewaySecret, setAiGatewaySecret] = useState("");

    const updateSetting = async () => {
        //设置AI相关设置
        if (aiGatewaySecret != "" && aiGatewayAddr != "") {
            if (!(aiGatewayAddr.startsWith("http://") || aiGatewayAddr.startsWith("https://"))) {
                message.error("算法网关必须是http://或者https://协议")
                return;
            }
            if (aiGatewaySecret.length < 32) {
                message.error("共享密钥必须32位以上长度")
                return;
            }
            await request(set_ai_gateway({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                addr: aiGatewayAddr,
                secret: aiGatewaySecret,
            }));
        }
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
        projectStore.showProjectSetting = null;
        message.info("修改项目设置成功");
        //特殊处理
        if (location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
            //do nothing
        } else if (layoutType == LAYOUT_TYPE_CHAT && !location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
            history.push(APP_PROJECT_CHAT_PATH);
        } else if (layoutType == LAYOUT_TYPE_KB && !location.pathname.startsWith(APP_PROJECT_KB_PATH)) {
            history.push(APP_PROJECT_KB_DOC_PATH);
        } else if (layoutType == LAYOUT_TYPE_NONE && !location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
            history.push(APP_PROJECT_OVERVIEW_PATH);
        }
    };

    return (
        <Modal open mask={false}
            title={`${projectStore.curProject?.basic_info.project_name ?? ""} 项目设置`}
            bodyStyle={{ paddingTop: 0 }}
            okText="更新"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                projectStore.showProjectSetting = null;
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateSetting();
            }}>
            <Tabs activeKey={projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT ? "layout" : "ai"}
                type="card" onChange={key => {
                    if (key == "layout") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT;
                    } else if (key == "ai") {
                        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_AI;
                    }
                }}>
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
                                    <Radio value={LAYOUT_TYPE_NONE}>只保留项目概览</Radio>
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
                <Tabs.TabPane key="ai" tab="AI助理">
                    <Form labelCol={{ span: 4 }}>
                        <Form.Item label="AI网关地址" help={
                            <>
                                {!(aiGatewayAddr.startsWith("http://".substring(0, aiGatewayAddr.length)) || aiGatewayAddr.startsWith("https://".substring(0, aiGatewayAddr.length))) && (
                                    <span style={{ color: "red" }}>网关地址必须以http://或者https://开始</span>
                                )}
                            </>
                        }>
                            <Input value={aiGatewayAddr} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setAiGatewayAddr(e.target.value);
                            }} />
                        </Form.Item>
                        <Form.Item label="共享密钥" help={
                            <>
                                {aiGatewaySecret.length >= 1 && aiGatewaySecret.length < 32 && (
                                    <span style={{ color: "red" }}>共享密钥必须32位以上长度</span>
                                )}
                            </>
                        }>
                            <Input.Password value={aiGatewaySecret}
                                placeholder="请输入共享密钥" onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setAiGatewaySecret(e.target.value);
                                }} />
                        </Form.Item>
                    </Form>
                    <div style={{ position: "relative", height: "24px" }}>
                        <div style={{ position: "absolute", right: "20px" }}>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setAiGatewayAddr("https://aidemo.linksaas.pro");
                                setAiGatewaySecret("use_linksaas_ai_gateway_for_great_develop_teams");
                            }}>使用测试网关</a>
                            <Tooltip title={
                                <div style={{ padding: "10px 10px" }}>
                                    我们开源了AI网关，大家可以参考
                                    <a href="https://github.com/linksaas/ai-gateway" target="_blank" rel="noreferrer">https://github.com/linksaas/ai-gateway</a>进行私有部署。
                                </div>
                            }>
                                <QuestionCircleOutlined style={{ marginLeft: "10px" }} />
                            </Tooltip>
                        </div>
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default observer(ProjectSettingModal);