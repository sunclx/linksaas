import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Empty, Form, Input, Select, Space, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { update_state_desc, update_need_help_desc } from "@/api/project_member";

const MemberStatePanel = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [stateDesc, setStateDesc] = useState("");
    const [remainHour, setRemainHour] = useState(0);
    const [editState, setEditState] = useState(false);

    const [helpDesc, setHelpDesc] = useState("");
    const [editHelp, setEditHelp] = useState(false);

    const updateStateDesc = async () => {
        await request(update_state_desc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            state_desc: stateDesc,
            state_remain_hour: remainHour,
        }));
        await memberStore.updateMemberInfo(projectStore.curProjectId, userStore.userInfo.userId);
        message.info("更新成功");
        setEditState(false);
    };

    const updateHelpDesc = async () => {
        await request(update_need_help_desc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            need_help_desc: helpDesc,
        }));
        await memberStore.updateMemberInfo(projectStore.curProjectId, userStore.userInfo.userId);
        message.info("更新成功");
        setEditHelp(false);
    };

    return (
        <>
            <Card title="当前工作备注" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }} extra={
                <>
                    {editState == false && (
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setStateDesc(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_desc ?? "");
                            setRemainHour(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_remain_hour ?? 0);
                            setEditState(true);
                        }}>编辑</Button>
                    )}
                    {editState == true && (
                        <Space>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setStateDesc(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_desc ?? "");
                                setEditState(false);
                            }}>取消</Button>

                            <Button type="primary" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateStateDesc();
                            }} disabled={((memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_desc ?? "") == stateDesc.trim())}>
                                保存
                            </Button>
                        </Space>
                    )}
                </>
            }>
                {editState == false && (
                    <>
                        {(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_desc ?? "") == "" && (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_desc ?? ""}</pre>
                    </>
                )}
                {editState == true && (
                    <Form>
                        <Form.Item label="状态描述">
                            <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} value={stateDesc} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setStateDesc(e.target.value);
                            }} />
                        </Form.Item>
                        <Form.Item label="持续时间">
                            <Select value={remainHour} onChange={value => setRemainHour(value)}>
                                <Select.Option value={0}>未设置</Select.Option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                                    <Select.Option key={hour} value={hour}>{hour}小时</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>

                )}
            </Card>
            <Card title="需要同事帮忙" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }} extra={
                <>
                    {editHelp == false && (
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setHelpDesc(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.need_help_desc ?? "");
                            setEditHelp(true);
                        }}>编辑</Button>
                    )}
                    {editHelp == true && (
                        <Space>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setHelpDesc(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.need_help_desc ?? "");
                                setEditState(false);
                            }}>取消</Button>

                            <Button type="primary" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateHelpDesc();
                            }} disabled={((memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.need_help_desc ?? "") == helpDesc.trim())}>
                                保存
                            </Button>
                        </Space>
                    )}
                </>
            }>
                {editHelp == false && (
                    <>
                        {(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.need_help_desc ?? "") == "" && (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.need_help_desc ?? ""}</pre>
                    </>
                )}
                {editHelp == true && (
                    <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} value={helpDesc} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setHelpDesc(e.target.value);
                    }} />
                )}
            </Card>
        </>
    );
};

export default observer(MemberStatePanel);