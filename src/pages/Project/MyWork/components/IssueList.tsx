import { Table, Tooltip } from "antd";
import React from "react";
import type { IssueInfo, ISSUE_TYPE } from "@/api/project_issue";
import type { ColumnType } from 'antd/lib/table';
import {
    ISSUE_STATE_CHECK, ISSUE_STATE_PROCESS, ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, PROCESS_STAGE_DOING, PROCESS_STAGE_DONE, PROCESS_STAGE_TODO,
} from "@/api/project_issue";
import { useStores } from "@/hooks";
import { LinkBugInfo, LinkRequirementInfo, LinkTaskInfo } from "@/stores/linkAux";
import { ExportOutlined, LinkOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import { showShortNote } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import { useHistory } from "react-router-dom";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { bugLvSelectItems, bugPrioritySelectItems, hourSelectItems, taskPrioritySelectItems } from "@/pages/Issue/components/constant";
import { EditText } from "@/components/EditCell/EditText";
import { issueState } from "@/utils/constant";
import { getMemberSelectItems, getStateColor } from "@/pages/Issue/components/utils";
import { EditTag } from "@/components/EditCell/EditTag";
import { EditDate } from "@/components/EditCell/EditDate";
import { getIsTask } from "@/utils/utils";

type ColumnsTypes = ColumnType<IssueInfo> & {
    issueType?: ISSUE_TYPE;
};


export interface IssueListProps {
    issueList: IssueInfo[];
    totalCount: number;
    curPage: number;
    pageSize: number;
    issueType: ISSUE_TYPE;
    onChangePage: (page: number) => void;
}

const IssueList = (props: IssueListProps) => {
    const history = useHistory();

    const linkAuxStore = useStores('linkAuxStore');
    const projectStore = useStores('projectStore');
    const userStore = useStores('userStore');
    const memberStore = useStores('memberStore');


    const memberSelectItems = getMemberSelectItems(memberStore.memberList.map(item => item.member));

    const getTagDefList = () => {
        if (projectStore.curProject == undefined) {
            return [];
        }
        return projectStore.curProject.tag_list.filter(item => {
            if (getIsTask(location.pathname)) {
                return item.use_in_task;
            } else {
                return item.use_in_bug;
            }
        });
    };

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
                                linkAuxStore.goToLink(new LinkTaskInfo("", record.project_id, record.issue_id, props.issueList.map(item => item.issue_id)), history);
                            } else if (record.issue_type == ISSUE_TYPE_BUG) {
                                linkAuxStore.goToLink(new LinkBugInfo("", record.project_id, record.issue_id, props.issueList.map(item => item.issue_id)), history);
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
            title: '状态',
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
            title: "处理子阶段",
            width: 100,
            render: (_, row: IssueInfo) => {
                if (row.state == ISSUE_STATE_PROCESS) {
                    if (row.process_stage == PROCESS_STAGE_TODO) {
                        return "未开始";
                    } else if (row.process_stage == PROCESS_STAGE_DOING) {
                        return "执行中";
                    } else if (row.process_stage == PROCESS_STAGE_DONE) {
                        return "待检查";
                    }
                }
                return "";
            }
        },
        {
            title: `级别`,
            width: 100,
            align: 'left',
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
            align: 'left',
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
            align: 'left',
            ellipsis: true,
            dataIndex: ['extra_info', 'ExtraBugInfo', 'software_version'],
            issueType: ISSUE_TYPE_BUG,
            render: (_, record: IssueInfo) => <EditText editable={false} content={record.extra_info.ExtraBugInfo?.software_version ?? ""} showEditIcon={false} onChange={async () => {
                return false;
            }} />,
        },
        {
            title: '处理人',
            dataIndex: 'exec_display_name',
            width: 100,
            align: 'left',
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
            align: 'left',
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
            title: "标签",
            dataIndex: ["basic_info", "tag_id_list"],
            width: 200,
            render: (_, row: IssueInfo) => (
                <EditTag editable={false} tagIdList={row.basic_info.tag_id_list} tagDefList={getTagDefList()} onChange={() => { }} />
            ),
        },
        {
            title: '预估开始时间',
            dataIndex: 'start_time',
            width: 120,
            align: 'left',
            render: (_, record: IssueInfo) => <EditDate
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
            align: 'left',
            render: (_, record: IssueInfo) => <EditDate
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
            align: 'left',
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
            align: 'left',
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
            align: 'left',
            render: (v) => {
                return v ? v : '-';
            },
        },
    ];

    return (
        <Table rowKey="issue_id" dataSource={props.issueList} style={{ minHeight: "200px" }}
            columns={columnsList.filter(item => (item.issueType == undefined || item.issueType == props.issueType))}
            pagination={{
                current: props.curPage + 1,
                pageSize: props.pageSize,
                total: props.totalCount,
                onChange: page => props.onChangePage(page - 1),
                hideOnSinglePage: true,
            }} scroll={{ x: 1300 }} />
    );
};

export default observer(IssueList);