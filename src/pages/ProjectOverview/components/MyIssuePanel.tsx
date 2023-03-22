import { Card, Space, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from "./MyIssue.module.less";
import { useHistory } from "react-router-dom";
import { useStores } from "@/hooks";
import type { IssueInfo, ISSUE_TYPE } from "@/api/project_issue";
import {
    ASSGIN_USER_ALL, ISSUE_STATE_CHECK, ISSUE_STATE_PROCESS, ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC,
    list as list_issue
} from "@/api/project_issue";
import { request } from "@/utils/request";
import type { ColumnType } from 'antd/lib/table';
import { LinkBugInfo, LinkRequirementInfo, LinkTaskInfo } from "@/stores/linkAux";
import { EditOutlined, ExportOutlined, LinkOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { showShortNote } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { awardSelectItems, bugLvSelectItems, bugPrioritySelectItems, hourSelectItems, taskPrioritySelectItems } from "@/pages/Issue/components/constant";
import { EditText } from "@/components/EditCell/EditText";
import { issueState } from "@/utils/constant";
import { getMemberSelectItems, getStateColor } from "@/pages/Issue/components/utils";
import { EditDate } from "@/components/EditCell/EditDate";
import Button from "@/components/Button";

type ColumnsTypes = ColumnType<IssueInfo> & {
    issueType?: ISSUE_TYPE;
};

const MyTaskPanel = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const memberStore = useStores('memberStore');

    const [taskList, setTaskList] = useState<IssueInfo[]>([]);
    const [bugList, setBugList] = useState<IssueInfo[]>([]);

    const loadMyIssue = async () => {
        const res = await request(list_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_issue_type: false,
                issue_type: 0,
                filter_by_state: true,
                state_list: [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
                filter_by_create_user_id: false,
                create_user_id_list: [],
                filter_by_assgin_user_id: true,
                assgin_user_id_list: [userStore.userInfo.userId],
                assgin_user_type: ASSGIN_USER_ALL,
                filter_by_sprit_id: false,
                sprit_id_list: [],
                filter_by_create_time: false,
                from_create_time: 0,
                to_create_time: 0,
                filter_by_update_time: false,
                from_update_time: 0,
                to_update_time: 0,
                filter_by_title_keyword: false,
                title_keyword: "",
                ///任务相关
                filter_by_task_priority: false,
                task_priority_list: [],
                ///缺陷相关
                filter_by_software_version: false,
                software_version_list: [],
                filter_by_bug_priority: false,
                bug_priority_list: [],
                filter_by_bug_level: false,
                bug_level_list: [],
            },
            sort_type: SORT_TYPE_DSC,
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: 0,
            limit: 99,
        }));
        const tmpTaskList: IssueInfo[] = [];
        const tmpBugList: IssueInfo[] = [];
        res.info_list.forEach(item => {
            if (item.issue_type == ISSUE_TYPE_TASK) {
                tmpTaskList.push(item);
            } else if (item.issue_type == ISSUE_TYPE_BUG) {
                tmpBugList.push(item);
            }
        });
        setTaskList(tmpTaskList);
        setBugList(tmpBugList);
    };

    const memberSelectItems = getMemberSelectItems(memberStore.memberList.map(item => item.member));

    const columnsList: ColumnsTypes[] = [
        {
            title: '名称',
            ellipsis: true,
            width: 300,
            fixed: true,
            render: (_, record: IssueInfo) => {
                return (
                    <span
                        style={{ cursor: 'pointer', display: "inline-block", paddingTop: "5px", paddingBottom: "5px" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (record.issue_type == ISSUE_TYPE_TASK) {
                                linkAuxStore.goToLink(new LinkTaskInfo("", record.project_id, record.issue_id, taskList.map(item => item.issue_id)), history);
                            } else if (record.issue_type == ISSUE_TYPE_BUG) {
                                linkAuxStore.goToLink(new LinkBugInfo("", record.project_id, record.issue_id, bugList.map(item => item.issue_id)), history);
                            }
                        }}
                    >
                        <a><LinkOutlined />&nbsp;{record.basic_info.title}</a>
                    </span>
                );
            },
        },
        {
            title: "相关需求",
            dataIndex: "requirement_id",
            width: 150,
            ellipsis: true,
            issueType: ISSUE_TYPE_TASK,
            render: (_, record: IssueInfo) => (
                <>
                    {record.requirement_id == "" && "-"}
                    {record.requirement_id != "" && (
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToLink(new LinkRequirementInfo("", record.project_id, record.requirement_id), history);
                        }}><LinkOutlined />&nbsp;{record.requirement_title}</a>
                    )}
                </>
            ),
        },
        {
            title: "桌面便签",
            dataIndex: "issue_index",
            width: 70,
            render: (_, record: IssueInfo) => {
                let projectName = "";
                projectStore.projectList.forEach(prj => {
                    if (prj.project_id == record.project_id) {
                        projectName = prj.basic_info.project_name;
                    }
                })
                return (<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    showShortNote(userStore.sessionId, {
                        shortNoteType: record.issue_type == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
                        data: record,
                    }, projectName);
                }}><ExportOutlined style={{ fontSize: "16px" }} /></a>);
            }
        },
        {
            title: `级别`,
            width: 100,
            align: 'center',
            dataIndex: ['extra_info', 'ExtraBugInfo', 'level'],
            render: (v: number) => <EditSelect
                allowClear={false}
                editable={false}
                curValue={v}
                itemList={bugLvSelectItems}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />,
            issueType: ISSUE_TYPE_BUG,
        },
        {
            title: '优先级',
            width: 120,
            align: 'center',
            render: (_, record: IssueInfo) => {
                const val = record.issue_type == ISSUE_TYPE_TASK ? record.extra_info.ExtraTaskInfo?.priority : record.extra_info.ExtraBugInfo?.priority;
                const items = record.issue_type == ISSUE_TYPE_TASK ? taskPrioritySelectItems : bugPrioritySelectItems;
                return <EditSelect
                    allowClear={false}
                    editable={false}
                    curValue={val!}
                    itemList={items}
                    onChange={async () => {
                        return false;
                    }} showEditIcon={false} />
            },

        },
        {
            title: `软件版本`,
            width: 150,
            align: 'center',
            ellipsis: true,
            dataIndex: ['extra_info', 'ExtraBugInfo', 'software_version'],
            issueType: ISSUE_TYPE_BUG,
            render: (_, record: IssueInfo) => <EditText editable={false} content={record.extra_info.ExtraBugInfo?.software_version ?? ""} showEditIcon={false} onChange={async () => {
                return false;
            }} />,
        },
        {
            title: '当前阶段',
            dataIndex: 'state',
            width: 100,
            align: 'center',
            render: (val: number, row: IssueInfo) => {
                const v = issueState[val];
                let tips = "";
                if (row.user_issue_perm.next_state_list.length == 0) {
                    if ([ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK].includes(row.state) && (
                        (userStore.userInfo.userId == row.exec_user_id) || (userStore.userInfo.userId == row.check_user_id)
                    )) {
                        tips = "请等待同事更新状态"
                    }
                }
                return (
                    <div
                        tabIndex={0}
                        style={{
                            background: `rgb(${getStateColor(val)} / 20%)`,
                            width: '60px',
                            borderRadius: '50px',
                            textAlign: 'center',
                            color: `rgb(${getStateColor(val)})`,
                            margin: '0 auto',
                        }}
                    >
                        <Tooltip title={tips}>{v.label}</Tooltip>
                    </div>
                );
            },
        },
        {
            title: '处理人',
            dataIndex: 'exec_display_name',
            width: 100,
            align: 'center',
            render: (_, row: IssueInfo) => <EditSelect
                allowClear={false}
                editable={false}
                curValue={row.exec_user_id}
                itemList={memberSelectItems}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />,
        },
        {
            title: '验收人',
            dataIndex: 'check_display_name',
            width: 100,
            align: 'center',
            render: (_, row: IssueInfo) => <EditSelect
                allowClear={false}
                editable={false}
                curValue={row.check_user_id}
                itemList={memberSelectItems}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />,
        },
        {
            title: (<span>
                处理贡献&nbsp;
                <Tooltip title={`当前事项关闭后，会给处理人增加的项目贡献值`} trigger="click">
                    <a><QuestionCircleOutlined /></a>
                </Tooltip>
            </span>),
            dataIndex: 'exec_award_point',
            width: 100,
            align: 'center',
            render: (v: number, row: IssueInfo) => <EditSelect
                allowClear={false}
                editable={row.user_issue_perm.can_set_award}
                curValue={v}
                itemList={awardSelectItems}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />
        },
        {
            title: (<span>
                验收贡献&nbsp;
                <Tooltip title={`当前事项关闭后，会给验收人增加的项目贡献值`} trigger="click">
                    <a><QuestionCircleOutlined /></a>
                </Tooltip>
            </span>),
            dataIndex: 'check_award_point',
            width: 100,
            align: 'center',
            render: (v: number) => <EditSelect
                allowClear={false}
                editable={false}
                curValue={v}
                itemList={awardSelectItems}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />
        },
        {
            title: '预估开始时间',
            dataIndex: 'start_time',
            width: 120,
            align: 'center',
            render: (_, record) => <EditDate
                editable={false}
                hasTimeStamp={record.has_start_time}
                timeStamp={record.start_time}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />,
        },
        {
            title: '预估完成时间',
            dataIndex: 'end_time',
            width: 120,
            align: 'center',
            render: (_, record) => <EditDate
                editable={false}
                hasTimeStamp={record.has_end_time}
                timeStamp={record.end_time}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />,
        },
        {
            title: '预估工时',
            dataIndex: 'estimate_minutes',
            width: 100,
            align: 'center',
            render: (_, record: IssueInfo) => <EditSelect
                allowClear={false}
                editable={false}
                curValue={record.has_estimate_minutes ? record.estimate_minutes : -1}
                itemList={hourSelectItems}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />
        },
        {
            title: '剩余工时',
            dataIndex: 'remain_minutes',
            width: 100,
            align: 'center',
            render: (_, record: IssueInfo) => <EditSelect
                allowClear={true}
                editable={false}
                curValue={record.has_remain_minutes ? record.remain_minutes : -1}
                itemList={hourSelectItems}
                onChange={async () => {
                    return false;
                }} showEditIcon={false} />
        },
        {
            title: '创建者',
            dataIndex: 'create_display_name',
            width: 100,
            align: 'center',
            render: (v) => {
                return v ? v : '-';
            },
        },
    ];
    const taskColumns: ColumnsTypes[] = columnsList.filter((item: ColumnsTypes) => (item.issueType == undefined || item.issueType == ISSUE_TYPE_TASK));
    const bugColumns: ColumnsTypes[] = columnsList.filter((item: ColumnsTypes) => (item.issueType == undefined || item.issueType == ISSUE_TYPE_BUG));

    useEffect(() => {
        loadMyIssue();
    }, [projectStore.curProjectId, memberStore.myUnDoneIssueCount]);

    return (
        <>
            <Card title={<h1 className={s.head}>我的待处理任务</h1>} className={s.content_wrap} headStyle={{ backgroundColor: "#f5f5f5" }}
                extra={
                    <Space size="large">
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToTaskList({
                                stateList: [],
                                execUserIdList: [],
                                checkUserIdList: [],
                            }, history);
                        }}>查看全部任务</Button>
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToCreateTask("", projectStore.curProjectId, history);
                        }}>创建任务</Button>
                    </Space>
                }>
                <Table rowKey="issue_id" dataSource={taskList} columns={taskColumns} pagination={false} scroll={{ x: 1300 }} />
            </Card>
            <Card title={<h1 className={s.head}>我的待处理缺陷</h1>} className={s.content_wrap} headStyle={{ backgroundColor: "#f5f5f5" }}
                extra={
                    <Space size="large">
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToBugList({
                                stateList: [],
                                execUserIdList: [],
                                checkUserIdList: [],
                            }, history);
                        }}>查看全部缺陷</Button>
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToCreateBug("", projectStore.curProjectId, history);
                        }}>创建缺陷</Button>
                    </Space>
                }>
                <Table rowKey="issue_id" dataSource={bugList} columns={bugColumns} pagination={false} scroll={{ x: 1300 }} />
            </Card>
        </>
    );
};

export default observer(MyTaskPanel);