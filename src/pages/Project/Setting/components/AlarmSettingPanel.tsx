import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Form, Select, Space, Switch, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { get_config as get_alarm_config, set_config as set_alarm_config } from "@/api/project_alarm";
import type { PanelProps } from "./common";


const AlarmSettingPanel: React.FC<PanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [enableIssueDependCheck, setEnableIssueDependCheck] = useState(false);
    const [issueDependHitValue, setIssueDependHitValue] = useState(0);
    const [issueDependAlertValue, setIssueDependAlertValue] = useState(0);
    const [enableIssueDelayCheck, setEnableIssueDelayCheck] = useState(false);
    const [issueDelayHitValue, setIssueDelayHitValue] = useState(0);
    const [issueDelayAlertValue, setIssueDelayAlertValue] = useState(0);
    const [enableIssueReOpenCheck, setEnableIssueReOpenCheck] = useState(false);
    const [issueReOpenHitValue, setIssueReOpenHitValue] = useState(0);
    const [issueReOpenAlertValue, setIssueReOpenAlertValue] = useState(0);

    const [hasChange, setHasChange] = useState(false);

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
    };

    const resetConfig = async () => {
        await loadAlarmConfig();
        setHasChange(false);
    };

    const updateConfig = async () => {
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
            },
        }));
        message.info("保存成功");
        setHasChange(false);
    };

    useEffect(() => {
        loadAlarmConfig();
    }, []);

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
            <Card bordered={false} title="任务依赖过多预警" extra={
                <Switch checked={enableIssueDependCheck} disabled={projectStore.isClosed || !projectStore.isAdmin}
                    onChange={checked => {
                        setEnableIssueDependCheck(checked);
                        setHasChange(true);
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
                        <Select disabled={projectStore.isClosed || !projectStore.isAdmin || !enableIssueDependCheck} value={issueDependHitValue}
                            onChange={value => {
                                setIssueDependHitValue(value);
                                setHasChange(true);
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
                        <Select disabled={projectStore.isClosed || !projectStore.isAdmin || !enableIssueDependCheck} value={issueDependAlertValue}
                            onChange={value => {
                                setIssueDependAlertValue(value);
                                setHasChange(true);
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
                <Switch checked={enableIssueDelayCheck} disabled={projectStore.isClosed || !projectStore.isAdmin}
                    onChange={checked => {
                        setEnableIssueDelayCheck(checked);
                        setHasChange(true);
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
                        <Select disabled={projectStore.isClosed || !projectStore.isAdmin || !enableIssueDelayCheck} value={issueDelayHitValue}
                            onChange={value => {
                                setIssueDelayHitValue(value);
                                setHasChange(true);
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
                        <Select disabled={projectStore.isClosed || !projectStore.isAdmin || !enableIssueDelayCheck} value={issueDelayAlertValue}
                            onChange={value => {
                                setIssueDelayAlertValue(value);
                                setHasChange(true);
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
                <Switch checked={enableIssueReOpenCheck} disabled={projectStore.isClosed || !projectStore.isAdmin}
                    onChange={checked => {
                        setEnableIssueReOpenCheck(checked);
                        setHasChange(true);
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
                        <Select disabled={projectStore.isClosed || !projectStore.isAdmin || !enableIssueReOpenCheck} value={issueReOpenHitValue}
                            onChange={value => {
                                setIssueReOpenHitValue(value);
                                setHasChange(true);
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
                        <Select disabled={projectStore.isClosed || !projectStore.isAdmin || !enableIssueReOpenCheck} value={issueReOpenAlertValue}
                            onChange={value => {
                                setIssueReOpenAlertValue(value);
                                setHasChange(true);
                            }}>
                            <Select.Option value={0}>未设置</Select.Option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                <Select.Option key={value} value={value}>重新打开{value}次以上</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
        </Card>
    );
};

export default observer(AlarmSettingPanel);