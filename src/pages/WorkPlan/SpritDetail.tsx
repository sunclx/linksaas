import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useHistory, useLocation } from "react-router-dom";
import type { LinkInfo, LinkTaskInfo, LinkBugInfo } from "@/stores/linkAux";
import { LINK_TARGET_TYPE } from "@/stores/linkAux";
import { get as get_sprit } from "@/api/project_sprit";
import type { SpritInfo } from "@/api/project_sprit";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { Card, Dropdown, Form, Select, Space, Tabs } from 'antd';
import IssuePanel from "./components/IssuePanel";
import StatPanel from "./components/StatPanel";
import GanttPanel from "./components/GanttPanel";
import KanbanPanel from "./components/KanbanPanel";
import BurnDownPanel from "./components/BurnDownPanel";
import SummaryPanel from "./components/SummaryPanel";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { ISSUE_TYPE_TASK, type ISSUE_TYPE, ISSUE_TYPE_BUG, link_sprit, list_by_id } from "@/api/project_issue";
import AddTaskOrBug from "@/components/Editor/components/AddTaskOrBug";
import AddIssueModal from "./components/AddIssueModal";
import { PlusOutlined } from "@ant-design/icons";
import { ISSUE_LIST_KANBAN, ISSUE_LIST_LIST } from "@/api/project_entry";


const SpritDetail = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');
    const memberStore = useStores('memberStore');
    const entryStore = useStores('entryStore');


    const location = useLocation();
    const tabStr = new URLSearchParams(location.search).get('tab') ?? "";

    const history = useHistory();

    const [activeKey, setActiveKey] = useState("");
    const [spritInfo, setSpritInfo] = useState<SpritInfo | null>(null);
    const [selMemberUserId, setSelMemberUserId] = useState("");
    const [refIssueType, setRefIssueType] = useState<ISSUE_TYPE | null>(null);
    const [showAddIssueModal, setShowAddIssueModal] = useState(false);

    const loadSpritInfo = async () => {
        const res = await request(get_sprit(userStore.sessionId, projectStore.curProjectId, entryStore.curEntry?.entry_id ?? ""));
        setSpritInfo(res.info);
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
            await request(link_sprit(userStore.sessionId, projectStore.curProjectId, issueId, entryStore.curEntry?.entry_id ?? ""));
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
        if (entryStore.curEntry != null) {
            loadSpritInfo();
        }
    }, [entryStore.curEntry]);

    useEffect(() => {
        if (entryStore.curEntry != null) {
            loadSpritInfo();
        }
    }, [spritStore.curSpritVersion]);

    useEffect(() => {
        if (entryStore.curEntry != null) {
            let needChange = false;
            if (activeKey == "issue" && entryStore.curEntry.extra_info.ExtraSpritInfo?.issue_list_type == ISSUE_LIST_KANBAN) {
                needChange = true;
            } else if (activeKey == "kanban" && entryStore.curEntry.extra_info.ExtraSpritInfo?.issue_list_type == ISSUE_LIST_LIST) {
                needChange = true;
            } else if (activeKey == "gantt" && entryStore.curEntry.extra_info.ExtraSpritInfo?.hide_gantt_panel == true) {
                needChange = true;
            } else if (activeKey == "burnDown" && entryStore.curEntry.extra_info.ExtraSpritInfo?.hide_burndown_panel == true) {
                needChange = true;
            } else if (activeKey == "statistics" && entryStore.curEntry.extra_info.ExtraSpritInfo?.hide_stat_panel == true) {
                needChange = true;
            } else if (activeKey == "summary" && entryStore.curEntry.extra_info.ExtraSpritInfo?.hide_summary_panel) {
                needChange = true;
            } else if (tabStr == "") {
                needChange = true;
            }
            if (needChange) {
                if (entryStore.curEntry.extra_info.ExtraSpritInfo?.issue_list_type == ISSUE_LIST_KANBAN) {
                    setActiveKey("kanban");
                } else {
                    setActiveKey("issue");
                }
            } else {
                if (tabStr != "") {
                    setActiveKey(tabStr);
                }
            }
        }
    }, [entryStore.curEntry, tabStr]);

    return (
        <Card bordered={false}
            style={{ marginRight: "60px" }}
            bodyStyle={{ height: "calc(100vh - 90px)", overflowY: "scroll", overflowX: "hidden", padding: "0px 0px" }}>
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
                                            <Dropdown.Button type="primary"
                                                disabled={(projectStore.isClosed || !(entryStore.curEntry?.can_update ?? false))}
                                                menu={{
                                                    items: [
                                                        {
                                                            key: "refTask",
                                                            label: "引用任务",
                                                            disabled: (projectStore.isClosed || !(entryStore.curEntry?.can_update ?? false)),
                                                            onClick: () => setRefIssueType(ISSUE_TYPE_TASK),
                                                        },
                                                        {
                                                            key: "refBug",
                                                            label: "引用缺陷",
                                                            disabled: (projectStore.isClosed || !(entryStore.curEntry?.can_update ?? false)),
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
                        {entryStore.curEntry?.extra_info.ExtraSpritInfo?.issue_list_type != ISSUE_LIST_KANBAN && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>列表</span>} key="issue">
                                {activeKey == "issue" && (
                                    <IssuePanel spritId={entryStore.curEntry?.entry_id ?? ""} startTime={entryStore.curEntry?.extra_info.ExtraSpritInfo?.start_time ?? 0}
                                        endTime={entryStore.curEntry?.extra_info.ExtraSpritInfo?.end_time ?? 0}
                                        memberId={selMemberUserId} />
                                )}
                            </Tabs.TabPane>
                        )}
                        {entryStore.curEntry?.extra_info.ExtraSpritInfo?.issue_list_type != ISSUE_LIST_LIST && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>看板</span>} key="kanban">
                                {activeKey == "kanban" && <KanbanPanel memberId={selMemberUserId} spritInfo={spritInfo} entryInfo={entryStore.curEntry} />}
                            </Tabs.TabPane>
                        )}

                        {entryStore.curEntry?.extra_info.ExtraSpritInfo?.hide_gantt_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>甘特图</span>} key="gantt" disabled={!spritStore.allTimeReady}>
                                {activeKey == "gantt" && <GanttPanel spritName={entryStore.curEntry?.entry_title ?? ""}
                                    startTime={entryStore.curEntry?.extra_info.ExtraSpritInfo?.start_time ?? 0}
                                    endTime={entryStore.curEntry?.extra_info.ExtraSpritInfo?.end_time ?? 0} />}
                            </Tabs.TabPane>
                        )}
                        {entryStore.curEntry?.extra_info.ExtraSpritInfo?.hide_burndown_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>燃尽图</span>} key="burnDown" disabled={!spritStore.allTimeReady}>
                                {activeKey == "burnDown" && <BurnDownPanel spritInfo={spritInfo} />}
                            </Tabs.TabPane>
                        )}
                        {entryStore.curEntry?.extra_info.ExtraSpritInfo?.hide_stat_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>统计信息</span>} key="statistics" disabled={!spritStore.allTimeReady}>
                                {activeKey == "statistics" && <StatPanel />}
                            </Tabs.TabPane>
                        )}
                        {entryStore.curEntry?.extra_info.ExtraSpritInfo?.hide_summary_panel == false && (
                            <Tabs.TabPane tab={<span style={{ fontSize: "16px", fontWeight: 500 }}>工作总结</span>} key="summary">
                                {activeKey == "summary" && <SummaryPanel state={spritInfo.summary_state} />}
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                )}
            </div>
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