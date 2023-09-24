
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Checkbox, Form, Space, message } from "antd";
import { useStores } from "@/hooks";
import { update_setting } from "@/api/project";
import { request } from "@/utils/request";
import { useHistory, useLocation } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_KB_PATH, APP_PROJECT_OVERVIEW_PATH, APP_PROJECT_WORK_PLAN_PATH, PROJECT_SETTING_TAB } from "@/utils/constant";
import type { PanelProps } from "./common";



const LayoutSettingPanel: React.FC<PanelProps> = (props) => {
    const location = useLocation();
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [disableWorkPlan, setDisableWorkPlan] = useState(projectStore.curProject?.setting.disable_work_plan ?? false);
    const [disableChat, setDisableChat] = useState(projectStore.curProject?.setting.disable_chat ?? false);
    const [disableKb, setDisableKb] = useState(projectStore.curProject?.setting.disable_kb ?? false);

    const [disableMemberAppraise, setDisableMemberAppraise] = useState(projectStore.curProject?.setting.disable_member_appraise ?? false);
    const [disableServerAgent, setDisableServerAgent] = useState(projectStore.curProject?.setting.disable_server_agent ?? false);
    const [disableExtEvent, setDisableExtEvent] = useState(projectStore.curProject?.setting.disable_ext_event ?? false);
    const [disableAppStore, setDisableAppStore] = useState(projectStore.curProject?.setting.disable_app_store ?? false);
    const [disableDataAnno, setDisableDataAnno] = useState(projectStore.curProject?.setting.disable_data_anno ?? false);
    const [disableApiCollection, setDisableApiCollection] = useState(projectStore.curProject?.setting.disable_api_collection ?? false);
    const [disableCodeComment, setDisableCodeComment] = useState(projectStore.curProject?.setting.disable_code_comment ?? false);

    const [hideProjectInfo, setHideProjectInfo] = useState(projectStore.curProject?.setting.hide_project_info ?? false);
    const [hideBulletin, setHideBulletin] = useState(projectStore.curProject?.setting.hide_bulletin ?? false);
    const [hideUserGoal, setHideUserGoal] = useState(projectStore.curProject?.setting.hide_user_goal ?? false);
    const [hideUserAward, setHideUserAward] = useState(projectStore.curProject?.setting.hide_user_award ?? false);
    const [hideMyTodoTask, setHideMyTodoTask] = useState(projectStore.curProject?.setting.hide_my_todo_task ?? false);
    const [hideMyTodoBug, setHideMyTodoBug] = useState(projectStore.curProject?.setting.hide_my_todo_bug ?? false);
    const [hideExtraInfo, setHideExtraInfo] = useState(projectStore.curProject?.setting.hide_extra_info ?? false);

    const [hideWatchDoc, setHideWatchDoc] = useState(projectStore.curProject?.setting.hide_watch_doc ?? false);
    const [hideWatchWorkPlan, setHideWatchWorkPlan] = useState(projectStore.curProject?.setting.hide_watch_walk_plan ?? false);
    const [hideWatchTask, setHideWatchTask] = useState(projectStore.curProject?.setting.hide_watch_task ?? false);
    const [hideWatchBug, setHideWatchBug] = useState(projectStore.curProject?.setting.hide_watch_bug ?? false);

    const [hasChange, setHasChange] = useState(false);

    const resetConfig = () => {
        setDisableWorkPlan(projectStore.curProject?.setting.disable_work_plan ?? false);
        setDisableChat(projectStore.curProject?.setting.disable_chat ?? false);
        setDisableKb(projectStore.curProject?.setting.disable_kb ?? false);

        setDisableMemberAppraise(projectStore.curProject?.setting.disable_member_appraise ?? false);
        setDisableServerAgent(projectStore.curProject?.setting.disable_server_agent ?? false);
        setDisableExtEvent(projectStore.curProject?.setting.disable_ext_event ?? false);
        setDisableAppStore(projectStore.curProject?.setting.disable_app_store ?? false);
        setDisableDataAnno(projectStore.curProject?.setting.disable_data_anno ?? false);
        setDisableApiCollection(projectStore.curProject?.setting.disable_api_collection ?? false);
        setDisableCodeComment(projectStore.curProject?.setting.disable_code_comment ?? false);

        setHideProjectInfo(projectStore.curProject?.setting.hide_project_info ?? false);
        setHideBulletin(projectStore.curProject?.setting.hide_bulletin ?? false);
        setHideUserGoal(projectStore.curProject?.setting.hide_user_goal ?? false);
        setHideUserAward(projectStore.curProject?.setting.hide_user_award ?? false);
        setHideMyTodoTask(projectStore.curProject?.setting.hide_my_todo_task ?? false);
        setHideMyTodoBug(projectStore.curProject?.setting.hide_my_todo_bug ?? false);
        setHideExtraInfo(projectStore.curProject?.setting.hide_extra_info ?? false);
        setHasChange(false);
    };

    const updateConfig = async () => {
        await request(update_setting({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            setting: {
                ...projectStore.curProject!.setting,
                disable_member_appraise: disableMemberAppraise,
                disable_server_agent: disableServerAgent,
                disable_ext_event: disableExtEvent,
                disable_app_store: disableAppStore,
                disable_data_anno: disableDataAnno,
                disable_api_collection: disableApiCollection,
                disable_code_comment: disableCodeComment,
                disable_chat: disableChat,
                disable_kb: disableKb,
                disable_work_plan: disableWorkPlan,
                hide_project_info: hideProjectInfo,
                hide_bulletin: hideBulletin,
                hide_user_goal: hideUserGoal,
                hide_user_award: hideUserAward,
                hide_my_todo_task: hideMyTodoTask,
                hide_my_todo_bug: hideMyTodoBug,
                hide_extra_info: hideExtraInfo,
                hide_watch_doc: hideWatchDoc,
                hide_watch_walk_plan: hideWatchWorkPlan,
                hide_watch_task: hideWatchTask,
                hide_watch_bug: hideWatchBug,
            },
        }));
        message.info("保存成功");
        await projectStore.updateProject(projectStore.curProjectId);
        setHasChange(false);
        //特殊处理
        if (location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
            //do nothing
        } else if (!disableChat && !location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
            history.push(APP_PROJECT_CHAT_PATH);
        } else if (!disableKb && !location.pathname.startsWith(APP_PROJECT_KB_PATH)) {
            history.push(APP_PROJECT_KB_DOC_PATH);
        } else if (!disableWorkPlan && !location.pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
            history.push(APP_PROJECT_WORK_PLAN_PATH);
        } else if (!location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
            history.push(APP_PROJECT_OVERVIEW_PATH);
        }
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
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="主界面">
                    <Space direction="vertical">
                        <Checkbox checked={disableChat} onChange={e => {
                            e.stopPropagation();
                            setDisableChat(e.target.checked);
                            setHasChange(true);
                        }}>关闭沟通</Checkbox>
                        <Checkbox checked={disableWorkPlan} onChange={e => {
                            e.stopPropagation();
                            setDisableWorkPlan(e.target.checked);
                            if (e.target.checked) {
                                setHideWatchWorkPlan(true);
                            }
                            setHasChange(true);
                        }}>关闭工作计划</Checkbox>
                        <Checkbox checked={disableKb} onChange={e => {
                            e.stopPropagation();
                            setDisableKb(e.target.checked);
                            if (e.target.checked) {
                                setHideWatchDoc(true);
                            }
                            setHasChange(true);
                        }}>关闭知识库</Checkbox>
                    </Space>
                </Form.Item>
                <Form.Item label="右侧工具栏">
                    <Space direction="vertical">
                        <Checkbox checked={disableMemberAppraise} onChange={e => {
                            e.stopPropagation();
                            setDisableMemberAppraise(e.target.checked);
                            setHasChange(true);
                        }}>关闭成员互评入口</Checkbox>
                        <Checkbox checked={disableServerAgent} onChange={e => {
                            e.stopPropagation();
                            setDisableServerAgent(e.target.checked);
                            setHasChange(true);
                        }}>关闭自动化入口</Checkbox>
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
                        <Checkbox checked={disableCodeComment} onChange={e => {
                            e.stopPropagation();
                            setDisableCodeComment(e.target.checked);
                            setHasChange(true);
                        }}>关闭代码评论入口</Checkbox>
                        <Checkbox checked={disableAppStore} onChange={e => {
                            e.stopPropagation();
                            setDisableAppStore(e.target.checked);
                            setHasChange(true);
                        }}>关闭应用市场入口</Checkbox>
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
                        <Checkbox checked={hideUserGoal} onChange={e => {
                            e.stopPropagation();
                            setHideUserGoal(e.target.checked);
                            setHasChange(true);
                        }}>隐藏成员目标</Checkbox>
                        <Checkbox checked={hideUserAward} onChange={e => {
                            e.stopPropagation();
                            setHideUserAward(e.target.checked);
                            setHasChange(true);
                        }}>隐藏成员贡献</Checkbox>

                        <Checkbox checked={hideWatchDoc} onChange={e => {
                            e.stopPropagation();
                            setHideWatchDoc(e.target.checked);
                            setHasChange(true);
                        }}>隐藏关注文档</Checkbox>
                        <Checkbox checked={hideWatchWorkPlan} onChange={e => {
                            e.stopPropagation();
                            setHideWatchWorkPlan(e.target.checked);
                            setHasChange(true);
                        }}>隐藏关注工作计划</Checkbox>
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

                        <Checkbox checked={hideMyTodoTask} onChange={e => {
                            e.stopPropagation();
                            setHideMyTodoTask(e.target.checked);
                            setHasChange(true);
                        }}>隐藏待处理任务</Checkbox>
                        <Checkbox checked={hideMyTodoBug} onChange={e => {
                            e.stopPropagation();
                            setHideMyTodoBug(e.target.checked);
                            setHasChange(true);
                        }}>隐藏待处理缺陷</Checkbox>
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