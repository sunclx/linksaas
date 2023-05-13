import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Checkbox, Form, Input, Modal, Select, Space, Switch, Tabs, Tooltip, message } from "antd";
import { useStores } from "@/hooks";
import { update_setting, set_ai_gateway } from "@/api/project";
import { request } from "@/utils/request";
import { useHistory, useLocation } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_KB_PATH, APP_PROJECT_OVERVIEW_PATH, PROJECT_SETTING_TAB } from "@/utils/constant";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { get_config as get_alarm_config, set_config as set_alarm_config } from "@/api/project_alarm";


const ProjectSettingModal = () => {
    const location = useLocation();
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [activeKey, setActiveKey] = useState("layout");

    //界面设置相关参数
    const [disableWorkPlan, setDisableWorkPlan] = useState(projectStore.curProject?.setting.disable_work_plan ?? false);
    const [disableChat, setDisableChat] = useState(projectStore.curProject?.setting.disable_chat ?? false);
    const [disableKb, setDisableKb] = useState(projectStore.curProject?.setting.disable_kb ?? false);

    const [disableMemberAppraise, setDisableMemberAppraise] = useState(projectStore.curProject?.setting.disable_member_appraise ?? false);
    const [disableTestCase, setDisableTestCase] = useState(projectStore.curProject?.setting.disable_test_case ?? false);
    const [disableServerAgent, setDisableServerAgent] = useState(projectStore.curProject?.setting.disable_server_agent ?? false);
    const [disableExtEvent, setDisableExtEvent] = useState(projectStore.curProject?.setting.disable_ext_event ?? false);
    const [disableAppStore, setDisableAppStore] = useState(projectStore.curProject?.setting.disable_app_store ?? false);

    //AI助理相关设置
    const [aiGatewayAddr, setAiGatewayAddr] = useState(projectStore.curProject?.ai_gateway_addr ?? "");
    const [aiGatewaySecret, setAiGatewaySecret] = useState("");

    //预警相关设置
    const [alarmCfgChange, setAlarmCfgChange] = useState(false);
    const [enableIssueDependCheck, setEnableIssueDependCheck] = useState(false);
    const [issueDependHitValue, setIssueDependHitValue] = useState(0);
    const [issueDependAlertValue, setIssueDependAlertValue] = useState(0);
    const [enableIssueDelayCheck, setEnableIssueDelayCheck] = useState(false);
    const [issueDelayHitValue, setIssueDelayHitValue] = useState(0);
    const [issueDelayAlertValue, setIssueDelayAlertValue] = useState(0);
    const [enableIssueReOpenCheck, setEnableIssueReOpenCheck] = useState(false);
    const [issueReOpenHitValue, setIssueReOpenHitValue] = useState(0);
    const [issueReOpenAlertValue, setIssueReOpenAlertValue] = useState(0);
    const [enableScriptErrorCheck, setEnableScriptErrorCheck] = useState(false);
    const [enableEarthlyErrorCheck, setEnableEarthlyErrorCheck] = useState(false);

    const loadAlarmConfig = async () => {
        const res = await request(get_alarm_config({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setEnableIssueDependCheck(res.config.enable_issue_depend_check);
        setIssueDependHitValue(res.config.issue_depend_hit_value);
        setIssueDependAlertValue(res.config.issue_depend_alert_value);
        setEnableIssueDelayCheck(res.config.enable_issue_delay_check);
        setIssueDelayHitValue(res.config.issue_delay_hit_value);
        setIssueDelayAlertValue(res.config.issue_delay_alert_value);
        setEnableIssueReOpenCheck(res.config.enable_issue_re_open_check);
        setIssueReOpenHitValue(res.config.issue_re_open_hit_value);
        setIssueReOpenAlertValue(res.config.issue_re_open_alert_value);
        setEnableScriptErrorCheck(res.config.enable_script_error_check);
        setEnableEarthlyErrorCheck(res.config.enable_earthly_error_check);
    };

    const updateSetting = async () => {
        //设置项目预警
        if (alarmCfgChange) {
            if (enableIssueDependCheck) {
                if (issueDependHitValue == 0) {
                    message.error("任务依赖预警提示阈值未设置");
                    return;
                } else if (issueDependAlertValue == 0) {
                    message.error("任务依赖预警警告阈值未设置");
                    return;
                } else if (issueDependHitValue >= issueDependAlertValue) {
                    message.error("任务依赖预警提示阈值必须小于警告阈值");
                    return;
                }
            }
            if (enableIssueDelayCheck) {
                if (issueDelayHitValue == 0) {
                    message.error("任务延期预警提示阈值未设置");
                    return;
                } else if (issueDelayAlertValue == 0) {
                    message.error("任务延期预警警告阈值未设置");
                    return;
                } else if (issueDelayHitValue >= issueDelayAlertValue) {
                    message.error("任务延期预警提示阈值必须小于警告阈值");
                    return;
                }
            }
            if (enableIssueReOpenCheck) {
                if (issueReOpenHitValue == 0) {
                    message.error("任务重新打开预警提示阈值未设置");
                    return;
                } else if (issueReOpenAlertValue == 0) {
                    message.error("任务重新打开预警警告阈值未设置");
                    return;
                } else if (issueReOpenHitValue >= issueReOpenAlertValue) {
                    message.error("任务重新打开预警提示阈值必须小于警告阈值");
                    return;
                }
            }
            await request(set_alarm_config({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                config: {
                    enable_issue_depend_check: enableIssueDependCheck,
                    issue_depend_hit_value: issueDependHitValue,
                    issue_depend_alert_value: issueDependAlertValue,
                    enable_issue_delay_check: enableIssueDelayCheck,
                    issue_delay_hit_value: issueDelayHitValue,
                    issue_delay_alert_value: issueDelayAlertValue,
                    enable_issue_re_open_check: enableIssueReOpenCheck,
                    issue_re_open_hit_value: issueReOpenHitValue,
                    issue_re_open_alert_value: issueReOpenAlertValue,
                    enable_script_error_check: enableScriptErrorCheck,
                    enable_earthly_error_check: enableEarthlyErrorCheck,
                },
            }));
        }
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
                disable_work_plan: disableWorkPlan,
                disable_chat: disableChat,
                disable_kb: disableKb,
                disable_member_appraise: disableMemberAppraise,
                disable_test_case: disableTestCase,
                disable_server_agent: disableServerAgent,
                disable_ext_event: disableExtEvent,
                disable_app_store: disableAppStore,

                layout_type: 0,
                disable_sprit: false,
            },
        }));
        await projectStore.updateProject(projectStore.curProjectId);
        projectStore.showProjectSetting = null;
        message.info("修改项目设置成功");
        //特殊处理
        if (location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
            //do nothing
        } else if (!disableChat && !location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
            history.push(APP_PROJECT_CHAT_PATH);
        } else if (!disableKb && !location.pathname.startsWith(APP_PROJECT_KB_PATH)) {
            history.push(APP_PROJECT_KB_DOC_PATH);
        } else if (!location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
            history.push(APP_PROJECT_OVERVIEW_PATH);
        }
    };

    useEffect(() => {
        if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT) {
            setActiveKey("layout");
        } else if (projectStore.showProjectSetting == PROJECT_SETTING_TAB.PROJECT_SETTING_AI) {
            setActiveKey("ai");
        }
    }, [projectStore.showProjectSetting]);

    useEffect(() => {
        loadAlarmConfig();
    }, []);

    return (
        <Modal open mask={false}
            title={`${projectStore.curProject?.basic_info.project_name ?? ""} 项目设置`}
            bodyStyle={{ paddingTop: 0, maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
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
            <Tabs activeKey={activeKey}
                type="card" onChange={key => setActiveKey(key)}>
                <Tabs.TabPane key="layout" tab="界面布局">
                    <Form labelCol={{ span: 4 }}>
                        <Form.Item label="主界面">
                            <Space direction="vertical">
                                <Checkbox checked={disableWorkPlan} onChange={e => {
                                    e.stopPropagation();
                                    setDisableWorkPlan(e.target.checked);
                                }}>关闭工作计划</Checkbox>
                                <Checkbox checked={disableKb} onChange={e => {
                                    e.stopPropagation();
                                    setDisableKb(e.target.checked);
                                }}>关闭知识库</Checkbox>
                                <Checkbox checked={disableChat} onChange={e => {
                                    e.stopPropagation();
                                    setDisableChat(e.target.checked);
                                }}>关闭沟通</Checkbox>
                            </Space>
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
                <Tabs.TabPane key="alarm" tab="项目预警">
                    <Card bordered={false} title="任务依赖过多预警" extra={
                        <Switch checked={enableIssueDependCheck} onChange={checked => {
                            setEnableIssueDependCheck(checked);
                            setAlarmCfgChange(true);
                        }} />
                    }>
                        <Form>
                            <Form.Item label="提示阈值" help={
                                <>
                                    {enableIssueDependCheck == true && (
                                        <span style={{ color: "red" }}>
                                            {issueDependHitValue == 0 && "请设置提示阈值"}
                                            {issueDependHitValue > 0 && issueDependHitValue >= issueDependAlertValue && "提示阈值必须小于警告阈值"}
                                        </span>
                                    )}
                                </>
                            }>
                                <Select disabled={!enableIssueDependCheck} value={issueDependHitValue}
                                    onChange={value => {
                                        setIssueDependHitValue(value);
                                        setAlarmCfgChange(true);
                                    }}>
                                    <Select.Option value={0}>未设置</Select.Option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                        <Select.Option key={value} value={value}>被{value}个以上任务/缺陷依赖</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="警告阈值" help={
                                <>
                                    {enableIssueDependCheck == true && (
                                        <span style={{ color: "red" }}>
                                            {issueDependAlertValue == 0 && "请设置警告阈值"}
                                            {issueDependAlertValue > 0 && issueDependHitValue >= issueDependAlertValue && "警告阈值必须大于提示阈值"}
                                        </span>
                                    )}
                                </>
                            }>
                                <Select disabled={!enableIssueDependCheck} value={issueDependAlertValue}
                                    onChange={value => {
                                        setIssueDependAlertValue(value);
                                        setAlarmCfgChange(true);
                                    }}>
                                    <Select.Option value={0}>未设置</Select.Option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                        <Select.Option key={value} value={value}>被{value}个以上任务/缺陷依赖</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Card bordered={false} title="任务延期预警" extra={
                        <Switch checked={enableIssueDelayCheck} onChange={checked => {
                            setEnableIssueDelayCheck(checked);
                            setAlarmCfgChange(true);
                        }} />
                    }>
                        <Form>
                            <Form.Item label="提示阈值" help={
                                <>
                                    {enableIssueDelayCheck == true && (
                                        <span style={{ color: "red" }}>
                                            {issueDelayHitValue == 0 && "请设置提示阈值"}
                                            {issueDelayHitValue > 0 && issueDelayHitValue >= issueDelayAlertValue && "提示阈值必须小于警告阈值"}
                                        </span>
                                    )}
                                </>
                            }>
                                <Select disabled={!enableIssueDelayCheck} value={issueDelayHitValue}
                                    onChange={value => {
                                        setIssueDelayHitValue(value);
                                        setAlarmCfgChange(true);
                                    }}>
                                    <Select.Option value={0}>未设置</Select.Option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                        <Select.Option key={value} value={value}>延期{value}天以上</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="警告阈值" help={
                                <>
                                    {enableIssueDelayCheck == true && (
                                        <span style={{ color: "red" }}>
                                            {issueDelayAlertValue == 0 && "请设置警告阈值"}
                                            {issueDelayAlertValue > 0 && issueDelayHitValue >= issueDelayAlertValue && "警告阈值必须大于提示阈值"}
                                        </span>
                                    )}
                                </>
                            }>
                                <Select disabled={!enableIssueDelayCheck} value={issueDelayAlertValue}
                                    onChange={value => {
                                        setIssueDelayAlertValue(value);
                                        setAlarmCfgChange(true);
                                    }}>
                                    <Select.Option value={0}>未设置</Select.Option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                        <Select.Option key={value} value={value}>延期{value}天以上</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Card bordered={false} title="任务/缺陷重新打开预警" extra={
                        <Switch checked={enableIssueReOpenCheck} onChange={checked => {
                            setEnableIssueReOpenCheck(checked);
                            setAlarmCfgChange(true);
                        }} />
                    }>
                        <Form>
                            <Form.Item label="提示阈值" help={
                                <>
                                    {enableIssueReOpenCheck == true && (
                                        <span style={{ color: "red" }}>
                                            {issueReOpenHitValue == 0 && "请设置提示阈值"}
                                            {issueReOpenHitValue > 0 && issueReOpenHitValue >= issueReOpenAlertValue && "提示阈值必须小于警告阈值"}
                                        </span>
                                    )}
                                </>
                            }>
                                <Select disabled={!enableIssueReOpenCheck} value={issueReOpenHitValue}
                                    onChange={value => {
                                        setIssueReOpenHitValue(value);
                                        setAlarmCfgChange(true);
                                    }}>
                                    <Select.Option value={0}>未设置</Select.Option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                        <Select.Option key={value} value={value}>重新打开{value}次以上</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="警告阈值" help={
                                <>
                                    {enableIssueReOpenCheck == true && (
                                        <span style={{ color: "red" }}>
                                            {issueReOpenAlertValue == 0 && "请设置警告阈值"}
                                            {issueReOpenAlertValue > 0 && issueReOpenHitValue >= issueReOpenAlertValue && "警告阈值必须大于提示阈值"}
                                        </span>
                                    )}
                                </>
                            }>
                                <Select disabled={!enableIssueReOpenCheck} value={issueReOpenAlertValue}
                                    onChange={value => {
                                        setIssueReOpenAlertValue(value);
                                        setAlarmCfgChange(true);
                                    }}>
                                    <Select.Option value={0}>未设置</Select.Option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                        <Select.Option key={value} value={value}>重新打开{value}次以上</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Card bordered={false} title="其他预警">
                        <Space direction="vertical">
                            <Checkbox checked={enableScriptErrorCheck} onChange={e => {
                                e.stopPropagation();
                                setEnableScriptErrorCheck(e.target.checked);
                                setAlarmCfgChange(true);
                            }}>服务端脚本执行失败预警</Checkbox>
                            <Checkbox checked={enableEarthlyErrorCheck} onChange={e => {
                                e.stopPropagation();
                                setEnableEarthlyErrorCheck(e.target.checked);
                                setAlarmCfgChange(true);
                            }}>Earthly执行失败预警</Checkbox>
                        </Space>
                    </Card>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default observer(ProjectSettingModal);