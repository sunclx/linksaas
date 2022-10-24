import React, { useState, useEffect } from "react";
import { Table } from 'antd';
import { request } from '@/utils/request';
import type { IssueInfo } from '@/api/project_issue';
import { list_depend_me } from '@/api/project_issue';
import type { ColumnsType } from 'antd/lib/table';
import { useStores } from "@/hooks";
import { get_issue_type_str } from '@/api/event_type';
import { renderState, renderTitle } from "./dependComon";
import { getIssueDetailUrl } from '@/utils/utils';
import { useHistory, useLocation } from "react-router-dom";
import type { LinkIssueState } from '@/stores/linkAux';
import { LinkOutlined } from '@ant-design/icons/lib/icons';



interface DependMePanelProps {
    issueId: string;
}

export const DependMePanel: React.FC<DependMePanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);

    const { pathname } = useLocation();
    const { push } = useHistory();

    const loadIssue = async () => {
        const res = await request(list_depend_me({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
        }));
        if (res) {
            setIssueList(res.issue_list);
        }
    };

    const issueColums: ColumnsType<IssueInfo> = [
        {
            title: 'ID',
            dataIndex: 'issue_index',
            ellipsis: true,
            width: 60,
            render: (v, record: IssueInfo) => {
                return (
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            push(
                                getIssueDetailUrl(pathname), {
                                    issueId: record.issue_id,
                                    content: "",
                                } as LinkIssueState
                            );
                        }}
                    >
                        <a><LinkOutlined />&nbsp;&nbsp;{v}</a>
                    </span>
                );
            },
        },
        {
            title: '类别',
            dataIndex: 'issue_type',
            width: 60,
            render: (v: number) => {
                return get_issue_type_str(v);
            },
        },
        {
            title: '名称',
            ellipsis: true,
            dataIndex: ['basic_info', 'title'],
            width: 150,
            render: (v: string, row: IssueInfo) => renderTitle(row),
        },
        {
            title: '阶段',
            dataIndex: 'state',
            width: 100,
            align: 'center',
            render: (val: number) => renderState(val),
        }
    ];

    useEffect(() => {
        loadIssue();
    }, [props.issueId])

    return (
        <Table dataSource={issueList} columns={issueColums} pagination={false} />
    );
};