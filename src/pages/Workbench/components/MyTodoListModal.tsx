import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { ExtraBugInfo, ExtraTaskInfo, IssueInfo, ListResponse } from '@/api/project_issue';
import { list_my_todo, SORT_TYPE_DSC, SORT_KEY_UPDATE_TIME, ISSUE_TYPE_TASK, ISSUE_TYPE_BUG, ISSUE_STATE_PROCESS, PROCESS_STAGE_TODO, PROCESS_STAGE_DOING, PROCESS_STAGE_DONE } from '@/api/project_issue';
import { request } from "@/utils/request";
import { LinkBugInfo, LinkRequirementInfo, LinkTaskInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";
import { ExportOutlined, LinkOutlined } from "@ant-design/icons";
import {
    bugPriority,
    issueState,
    taskPriority,
} from '@/utils/constant';
import { getStateColor } from '@/pages/Issue/components/utils';
import moment from "moment";
import { issueTypeIsTask, timeToDateString } from '@/utils/utils';
import type { ColumnsType } from 'antd/lib/table';
import { get_issue_type_str } from '@/api/event_type';
import { showShortNote } from '@/utils/short_note';
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import RenderSelectOpt from '@/components/RenderSelectOpt';

const PAGE_SIZE = 10;

export interface MyTodoListModalProps {
    onCount: (count: number) => void;
    onClose: () => void;
}

const MyTodoListModal = (props: MyTodoListModalProps) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadIssueList = async () => {
        const data = {
            session_id: userStore.sessionId,
            sort_type: SORT_TYPE_DSC,
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        };

        const res = await request<ListResponse>(list_my_todo(data));
        props.onCount(res.total_count);
        setTotalCount(res.total_count);
        setIssueList(res.info_list);
    };


    const renderTitle = (row: IssueInfo) => {
        return (
            <div>
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (row.issue_type == ISSUE_TYPE_TASK) {
                        linkAuxStore.goToLink(new LinkTaskInfo("", row.project_id, row.issue_id), history);
                        props.onClose();
                    } else if (row.issue_type == ISSUE_TYPE_BUG) {
                        linkAuxStore.goToLink(new LinkBugInfo("", row.project_id, row.issue_id), history);
                        props.onClose();
                    }
                }} title={row.basic_info?.title}><span><LinkOutlined />&nbsp;{row.basic_info?.title}</span></a>
            </div>
        );
    };

    const renderState = (val: number) => {
        const v = issueState[val];
        return (
            <div
                style={{
                    background: `rgb(${getStateColor(val)} / 20%)`,
                    width: '50px',
                    margin: '0 auto',
                    borderRadius: '50px',
                    textAlign: 'center',
                    color: `rgb(${getStateColor(val)})`,
                }}
            >
                {v.label}
            </div>
        );
    };

    const renderName = (id: string, name: string) => {
        if (!id) return '-';
        const isCurrentUser = id === userStore.userInfo.userId;
        return isCurrentUser ? <span style={{ color: 'red' }}>{name}</span> : <span>{name}</span>;
    };

    const renderManHour = (has: boolean, v: number) => {
        return has ? v / 60 + 'h' : '-';
    };

    const renderEndTime = (has: boolean, v: number) => {
        if (!has) return '-';
        const isPast = v < moment().startOf('days').valueOf();
        return isPast ? (
            <span style={{ color: 'red' }}>{timeToDateString(v, 'YYYY-MM-DD')}</span>
        ) : (
            <span>{timeToDateString(v, 'YYYY-MM-DD')}</span>
        );
    };

    const getExtraInfoType = (row: IssueInfo): ExtraTaskInfo | ExtraBugInfo | undefined => {
        const isTask = issueTypeIsTask(row);
        return isTask ? row.extra_info.ExtraTaskInfo : row.extra_info.ExtraBugInfo;
    };

    const columns: ColumnsType<IssueInfo> = [
        {
            title: `类别`,
            dataIndex: 'issue_type',
            width: 100,
            render: (v: number) => {
                return get_issue_type_str(v);
            },
        },
        {
            title: '所属项目',
            width: 100,
            render: (_, record: IssueInfo) => projectStore.getProject(record.project_id)?.basic_info.project_name ?? "",
        },
        {
            title: `名称`,
            ellipsis: true,
            dataIndex: ['basic_info', 'title'],
            width: 250,
            render: (_, row: IssueInfo) => renderTitle(row),
        },
        {
            title: "关联需求",
            ellipsis: true,
            width: 250,
            render: (_, row: IssueInfo) => (
                <>
                    {row.requirement_id == "" && "-"}
                    {row.requirement_id != "" && (
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToLink(new LinkRequirementInfo("", row.project_id, row.requirement_id), history);
                            props.onClose();
                        }}><LinkOutlined />&nbsp;{row.requirement_title}</a>
                    )}
                </>
            )
        },
        {
            title: "桌面便签",
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
            title: `状态`,
            dataIndex: 'state',
            width: 100,
            align: 'center',
            render: (val: number) => renderState(val),
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
            title: '优先级',
            width: 100,
            render: (_, row: IssueInfo) => {
                return RenderSelectOpt(
                    issueTypeIsTask(row)
                        ? taskPriority[getExtraInfoType(row)?.priority || 0]
                        : bugPriority[getExtraInfoType(row)?.priority || 0],
                );
            },
        },
        {
            title: '处理人',
            dataIndex: 'exec_display_name',
            width: 100,
            render: (v: string, row: IssueInfo) => renderName(row.exec_user_id, v),
        },
        {
            title: '验收人',
            dataIndex: 'check_display_name',
            width: 100,
            render: (v: string, row: IssueInfo) => renderName(row.check_user_id, v),
        },
        {
            title: '剩余工时',
            dataIndex: 'remain_minutes',
            width: 100,
            render: (v: number, record: IssueInfo) => renderManHour(record.has_remain_minutes, v),
        },
        {
            title: '预估工时',
            dataIndex: 'estimate_minutes',
            width: 100,
            render: (v: number, record: IssueInfo) => renderManHour(record.has_estimate_minutes, v),
        },
        {
            title: '预估完成时间',
            dataIndex: 'end_time',
            width: 120,
            render: (v: number, record: IssueInfo) => renderEndTime(record.has_end_time, v),
        },
    ];

    useEffect(() => {
        loadIssueList();
    }, [curPage]);

    return (
        <Modal open title="我的待办" footer={null}
            width="calc(100vw - 200px)" bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Table
                style={{ marginTop: '8px' }}
                rowKey={'issue_id'}
                columns={columns}
                scroll={{ x: 1300 }}
                dataSource={issueList}
                pagination={{
                    total: totalCount,
                    pageSize: PAGE_SIZE,
                    current: curPage + 1,
                    onChange: page => setCurPage(page - 1),
                    hideOnSinglePage: true,
                }}
            />
        </Modal>
    )
};

export default observer(MyTodoListModal);