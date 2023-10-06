import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Empty, Form, Select, Space, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { update_state_desc, update_need_help_desc } from "@/api/project_member";
import moment from "moment";
import { ReadOnlyEditor, useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_NONE } from "@/api/fs";

const EDITOR_PARAM = {
    content: '',
    fsId: "",
    ownerType: FILE_OWNER_TYPE_NONE,
    ownerId: "",
    historyInToolbar: false,
    clipboardInToolbar: false,
    widgetInToolbar: false,
    showReminder: false,
    channelMember: false,
};

const MemberStatePanel = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [remainHour, setRemainHour] = useState(0);
    const [editState, setEditState] = useState(false);

    const [editHelp, setEditHelp] = useState(false);

    const descEditor = useCommonEditor(EDITOR_PARAM);
    const helpEditor = useCommonEditor(EDITOR_PARAM);

    const updateStateDesc = async () => {
        const content = descEditor.editorRef.current?.getContent() ?? { type: "doc" };
        await request(update_state_desc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            state_desc: JSON.stringify(content),
            state_remain_hour: remainHour,
        }));
        await memberStore.updateMemberInfo(projectStore.curProjectId, userStore.userInfo.userId);
        message.info("更新成功");
        setEditState(false);
    };

    const updateHelpDesc = async () => {
        const content = helpEditor.editorRef.current?.getContent() ?? { type: "doc" };
        await request(update_need_help_desc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            need_help_desc: JSON.stringify(content),
        }));
        await memberStore.updateMemberInfo(projectStore.curProjectId, userStore.userInfo.userId);
        message.info("更新成功");
        setEditHelp(false);
    };

    const isEmptyDesc = () => {
        const memberInfo = memberStore.getMember(userStore.userInfo.userId);
        if (memberInfo == undefined) {
            return true;
        }
        if ((memberInfo.member.extra_state_info?.state_desc ?? "") == "") {
            return true;
        }
        if ((memberInfo.member.extra_state_info?.state_end_time ?? 0) <= moment().valueOf()) {
            return true;
        }
        return false;
    };

    return (
        <>
            <Card title="工作备注" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }} extra={
                <>
                    {editState == false && (
                        <Button type="primary"
                            disabled={projectStore.isClosed}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                descEditor.editorRef.current?.setContent(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_desc ?? "");
                                setRemainHour(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_remain_hour ?? 0);
                                setEditState(true);
                            }}>编辑</Button>
                    )}
                    {editState == true && (
                        <Space>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setEditState(false);
                            }}>取消</Button>

                            <Button type="primary" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateStateDesc();
                            }} >
                                保存
                            </Button>
                        </Space>
                    )}
                </>
            }>
                {editState == false && (
                    <>
                        {isEmptyDesc() == true && (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                        {isEmptyDesc() == false && (
                            <ReadOnlyEditor content={memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.state_desc ?? ""} />
                        )}
                    </>
                )}
                <Form style={{ display: editState == true ? "inherit" : "none" }}>
                    <Form.Item label="状态描述">
                        {descEditor.editor}
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
            </Card>
            <Card title="需要帮助" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }} extra={
                <>
                    {editHelp == false && (
                        <Button type="primary"
                            disabled={projectStore.isClosed}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                helpEditor.editorRef.current?.setContent(memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.need_help_desc ?? "");
                                setEditHelp(true);
                            }}>编辑</Button>
                    )}
                    {editHelp == true && (
                        <Space>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setEditHelp(false);
                            }}>取消</Button>

                            <Button type="primary" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateHelpDesc();
                            }} >
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
                        <ReadOnlyEditor content={memberStore.getMember(userStore.userInfo.userId)?.member.extra_state_info?.need_help_desc ?? ""} />
                    </>
                )}
                <div style={{ display: editHelp == true ? "inherit" : "none" }}>
                    {helpEditor.editor}
                </div>
            </Card>
        </>
    );
};

export default observer(MemberStatePanel);