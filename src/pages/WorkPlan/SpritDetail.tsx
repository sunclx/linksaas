import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useHistory, useLocation } from "react-router-dom";
import type { LinkInfo, LinkTaskInfo, LinkBugInfo } from "@/stores/linkAux";
import { LinkChannelInfo, LINK_TARGET_TYPE } from "@/stores/linkAux";
import { get as get_sprit, remove as remove_sprit, link_channel, cancel_link_channel, watch, un_watch, ISSUE_LIST_KANBAN, ISSUE_LIST_LIST } from "@/api/project_sprit";
import type { SpritInfo } from "@/api/project_sprit";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import Button from "@/components/Button";
import { LeftOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Dropdown, Form, message, Modal, Popover, Select, Space, Tabs, Tag } from 'antd';
import s from './SpritDetail.module.less';
import moment from "moment";
import IssuePanel from "./components/IssuePanel";
import StatPanel from "./components/StatPanel";
import GanttPanel from "./components/GanttPanel";
import LinkDocPanel from "./components/LinkDocPanel";
import { EditSelect } from "@/components/EditCell/EditSelect";
import KanbanPanel from "./components/KanbanPanel";
import BurnDownPanel from "./components/BurnDownPanel";
import { APP_PROJECT_WORK_PLAN_PATH } from "@/utils/constant";
import SummaryPanel from "./components/SummaryPanel";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { ISSUE_TYPE_TASK, type ISSUE_TYPE, ISSUE_TYPE_BUG, link_sprit, list_by_id } from "@/api/project_issue";
import AddTaskOrBug from "@/components/Editor/components/AddTaskOrBug";
import AddIssueModal from "./components/AddIssueModal";


const SpritDetail = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const spritStore = useStores('spritStore');
    const channelStore = useStores('channelStore');
    const memberStore = useStores('memberStore');

    const location = useLocation();
    const tabStr = new URLSearchParams(location.search).get('tab') ?? "";

    const history = useHistory();

    const [activeKey, setActiveKey] = useState("");
    const [spritInfo, setSpritInfo] = useState<SpritInfo | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selMemberUserId, setSelMemberUserId] = useState("");
    const [refIssueType, setRefIssueType] = useState<ISSUE_TYPE | null>(null);
    const [showAddIssueModal, setShowAddIssueModal] = useState(false);

    const loadSpritInfo = async () => {
        const res = await request(get_sprit(userStore.sessionId, projectStore.curProjectId, spritStore.curSpritId));
        setSpritInfo(res.info);
    };

    const removeSprit = async () => {
        await request(remove_sprit(userStore.sessionId, projectStore.curProjectId, spritStore.curSpritId));
        message.info("删除工作计划成功");
        setShowRemoveModal(false);
        await spritStore.setCurSpritId("");
        if (spritInfo?.my_watch) {
            spritStore.loadCurWatchList(projectStore.curProjectId);
        }
    };

    const watchSprit = async () => {
        await request(watch(userStore.sessionId, projectStore.curProjectId, spritStore.curSpritId));
        if (spritInfo != null) {
            setSpritInfo({ ...spritInfo, my_watch: true });
        }
        await spritStore.loadCurWatchList(projectStore.curProjectId);
    };

    const unWatchSprit = async () => {
        await request(un_watch(userStore.sessionId, projectStore.curProjectId, spritStore.curSpritId));
        if (spritInfo != null) {
            setSpritInfo({ ...spritInfo, my_watch: false });
        }
        await spritStore.loadCurWatchList(projectStore.curProjectId);
    };

    const linkSprit = async (links: LinkInfo[]) => {
        let issueIdList: string[] = [];
        for (const link of links) {
            if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_BUG) {
                issueIdList.push((link as LinkBugInfo).issueId);
            } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_TASK) {
                issueIdList.push((link as LinkTaskInfo).issueId);
            }
        }
        issueIdList = issueIdList.filter(issueId => {
            const bugIndex = spritStore.bugList.findIndex(bug => bug.issue_id == issueId);
            if (bugIndex != -1) {
                return false;
            }
            const taskIndex = spritStore.taskList.findIndex(task => task.issue_id == issueId);
            if (taskIndex != -1) {
                return false;
            }
            return true;
        });
        for (const issueId of issueIdList) {
            await request(link_sprit(userStore.sessionId, projectStore.curProjectId, issueId, spritStore.curSpritId));
        }
        const listRes = await request(list_by_id({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id_list: issueIdList,
        }));
        spritStore.addIssueList(listRes.info_list);
        setRefIssueType(null);
    }


    useEffect(() => {
        if (spritStore.curSpritId != "") {
            loadSpritInfo();
        }
    }, [spritStore.curSpritId]);

    useEffect(() => {
        if (spritStore.curSpritId != "") {
            loadSpritInfo();
        }
    }, [spritStore.curSpritVersion]);

    useEffect(() => {
        if (tabStr != "") {
            setActiveKey(tabStr);
        }
    }, [tabStr]);

    useEffect(() => {
        if (spritInfo != null && activeKey == "" && tabStr == "") {
            if (spritInfo.basic_info.issue_list_type == ISSUE_LIST_KANBAN) {
                setActiveKey("kanban");
            } else {
                setActiveKey("issue");
            }
        }
    }, [spritInfo]);

    return (
        <Card bordered={false}
            style={{ marginRight: "60px" }}
            bodyStyle={{ height: "calc(100vh - 130px)", overflowY: "scroll", overflowX: "hidden" }}
            title={
                <h2 className={s.head}>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        spritStore.setCurSpritId("");
                        history.push(APP_PROJECT_WORK_PLAN_PATH);
                    }}><LeftOutlined /></a>
                    &nbsp;{spritInfo?.basic_info.title ?? ""}&nbsp;
                    {spritInfo != null && (
                        <span>
                            (
                            {moment(spritInfo.basic_info.start_time).format("YYYY-MM-DD")}
                            &nbsp;至&nbsp;
                            {moment(spritInfo.basic_info.end_time).format("YYYY-MM-DD")}
                            )
                        </span>
                    )}

                </h2>} extra={
                    <Space>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (spritInfo != null) {
                                if (spritInfo.my_watch) {
                                    unWatchSprit();
                                } else {
                                    watchSprit();
                                }
                            }
                        }}>
                            <i className={spritInfo?.my_watch ? s.isCollect : s.noCollect} />
                        </a>
                        {projectStore.isAdmin && (
                            <Popover trigger="click" placement="bottom" content={
                                <div style={{ padding: "10px 10px" }}>
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowRemoveModal(true);
                                    }}>删除工作计划</Button>
                                </div>
                            }>
                                <MoreOutlined />
                            </Popover>
                        )}
                    </Space>
                }>

            <div className={s.sprit_wrap}>
                {(spritInfo?.basic_info.non_work_day_list.length ?? 0) > 0 && (
                    <div className={s.info_wrap}>
                        <div className={s.label}>非工作日：</div>
                        <div>
                            {spritInfo?.basic_info.non_work_day_list.map(item => (
                                <Tag key={item}>{moment(item).format("YYYY-MM-DD")}</Tag>
                            ))}
                        </div>
                    </div>
                )}
                {projectStore.curProject?.setting.disable_chat === false && (
                    <div className={s.info_wrap}>
                        <div className={s.label} style={{ lineHeight: "28px" }}>关联频道：</div>
                        {spritInfo !== null && (<div>
                            <EditSelect
                                width="150px"
                                editable={projectStore.isAdmin}
                                curValue={spritInfo?.link_channel_id ?? ""}
                                itemList={[
                                    { value: "", label: "-", color: "black" },
                                    ...(channelStore.channelList.filter(ch => ch.channelInfo.system_channel == false).map(ch => {
                                        return { value: ch.channelInfo.channel_id, label: ch.channelInfo.basic_info.channel_name, color: "black" };
                                    })),
                                ]}
                                onChange={async (value) => {
                                    if (value == undefined) {
                                        return false;
                                    }
                                    try {
                                        if (value == "") {
                                            const res = await cancel_link_channel(userStore.sessionId, projectStore.curProjectId, spritInfo?.sprit_id ?? "");
                                            if (res.code != 0) {
                                                return false;
                                            }
                                            if (spritInfo !== null) {
                                                setSpritInfo({
                                                    ...spritInfo,
                                                    link_channel_id: "",
                                                    link_channel_title: "",
                                                });
                                            }
                                        } else {
                                            const res = await link_channel(userStore.sessionId, projectStore.curProjectId, spritInfo?.sprit_id ?? "", value as string);
                                            if (res.code != 0) {
                                                return false;
                                            }
                                            if (spritInfo !== null) {
                                                setSpritInfo({
                                                    ...spritInfo,
                                                    link_channel_id: value as string,
                                                    link_channel_title: channelStore.getChannel(value as string)?.channelInfo.basic_info.channel_name ?? "",
                                                });
                                            }
                                        }
                                        return true;
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    return false;
                                }} showEditIcon={!projectStore.curProject?.setting.disable_chat} allowClear={false} />
                            {((spritInfo?.link_channel_id.length ?? 0) > 0) && (
                                <Button type="link" style={{ marginLeft: "20px" }}
                                    disabled={projectStore.curProject?.setting.disable_chat}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, spritInfo.link_channel_id ?? ""), history);
                                    }}>进入沟通频道</Button>
                            )}
                        </div>
                        )}
                    </div>
                )}
            </div>
            <div>
                {spritInfo != null && (
                    <Tabs
                        activeKey={activeKey}
                        type="card"
                        onChange={value => {
                            history.push(`${location.pathname}?tab=${value}`);
                        }} tabBarExtraContent={
                            <>
                                {(activeKey == "issue" || activeKey == "kanban") && (
                                    <Form layout="inline">
                                        <Form.Item label="过滤成员">
                                            <Select value={selMemberUserId} style={{ width: "120px", marginRight: "20px" }}
                                                onChange={value => setSelMemberUserId(value)}>
                                                <Select.Option value="">
                                                    <Space>
                                                        <UserPhoto logoUri="/default_av.jpg" style={{ width: "20px" }} />
                                                        <span>全部成员</span>
                                                    </Space>
                                                </Select.Option>
                                                {memberStore.memberList.map(item => (
                                                    <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                                                        <Space>
                                                            <UserPhoto logoUri={item.member.logo_uri} style={{ width: "20px" }} />
                                                            <span>{item.member.display_name}</span>
                                                        </Space>
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item>
                                            <Dropdown.Button type="primary" menu={{
                                                items: [
                                                    {
                                                        key: "refTask",
                                                        label: "引用任务",
                                                        onClick: () => setRefIssueType(ISSUE_TYPE_TASK),
                                                    },
                                                    {
                                                        key: "refBug",
                                                        label: "引用缺陷",
                                                        onClick: () => setRefIssueType(ISSUE_TYPE_BUG),
                                                    }
                                                ]
                                            }} onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setShowAddIssueModal(true);
                                            }}><PlusOutlined />增加</Dropdown.Button>
                                        </Form.Item>
                                    </Form>
                                )}
                            </>
                        }>
                        {spritInfo.basic_info.issue_list_type != ISSUE_LIST_KANBAN && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>列表</span>} key="issue">
                                {activeKey == "issue" && (
                                    <IssuePanel spritId={spritStore.curSpritId} startTime={spritInfo.basic_info.start_time} endTime={spritInfo.basic_info.end_time}
                                        memberId={selMemberUserId} />
                                )}
                            </Tabs.TabPane>
                        )}
                        {spritInfo.basic_info.issue_list_type != ISSUE_LIST_LIST && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>看板</span>} key="kanban">
                                {activeKey == "kanban" && <KanbanPanel memberId={selMemberUserId} />}
                            </Tabs.TabPane>
                        )}

                        {!projectStore.curProject?.setting.disable_kb && spritInfo.basic_info.hide_doc_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>相关文档</span>} key="linkDoc">
                                {activeKey == "linkDoc" && <LinkDocPanel />}
                            </Tabs.TabPane>
                        )}
                        {spritInfo.basic_info.hide_gantt_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>甘特图</span>} key="gantt" disabled={!spritStore.allTimeReady}>
                                {activeKey == "gantt" && <GanttPanel spritName={spritInfo.basic_info.title} startTime={spritInfo.basic_info.start_time} endTime={spritInfo.basic_info.end_time} />}
                            </Tabs.TabPane>
                        )}
                        {spritInfo.basic_info.hide_burndown_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>燃尽图</span>} key="burnDown" disabled={!spritStore.allTimeReady}>
                                {activeKey == "burnDown" && <BurnDownPanel spritInfo={spritInfo} />}
                            </Tabs.TabPane>
                        )}
                        {spritInfo.basic_info.hide_stat_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>统计信息</span>} key="statistics" disabled={!spritStore.allTimeReady}>
                                {activeKey == "statistics" && <StatPanel />}
                            </Tabs.TabPane>
                        )}
                        {spritInfo.basic_info.hide_summary_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>工作总结</span>} key="summary">
                                {activeKey == "summary" && <SummaryPanel state={spritInfo.summary_state} />}
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                )}
            </div>
            {showRemoveModal == true && (
                <Modal
                    title="删除工作计划"
                    open
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeSprit();
                    }}>
                    删除工作计划后，相关任务和缺陷会被设置成未关联工作计划状态。
                </Modal>
            )}
            {refIssueType != null && (
                <AddTaskOrBug
                    open
                    title={refIssueType == ISSUE_TYPE_TASK ? "选择任务" : "选择缺陷"}
                    onOK={links => linkSprit(links as LinkInfo[])}
                    onCancel={() => setRefIssueType(null)}
                    issueIdList={refIssueType == ISSUE_TYPE_TASK ?
                        spritStore.taskList.map(item => item.issue_id) : spritStore.bugList.map(item => item.issue_id)}
                    type={refIssueType == ISSUE_TYPE_TASK ? "task" : "bug"}
                />
            )}
            {showAddIssueModal == true && (
                <AddIssueModal onClose={() => setShowAddIssueModal(false)} />
            )}
        </Card>
    );
};

export default observer(SpritDetail);