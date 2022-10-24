import React, { useState, useEffect } from "react";
import { Table, message } from 'antd';
import { LinkSelect } from "@/components/Editor/components";
import type { LinkInfo, LinkTaskInfo, LinkBugInfo } from '@/stores/linkAux';
import { LINK_TARGET_TYPE } from '@/stores/linkAux';
import { request } from '@/utils/request';
import type { IssueInfo } from '@/api/project_issue';
import { add_dependence, list_my_depend, remove_dependence } from '@/api/project_issue';
import type { ColumnsType } from 'antd/lib/table';
import { useStores } from "@/hooks";
import { get_issue_type_str } from '@/api/event_type';
import { renderState, renderTitle } from "./dependComon";
import { getIssueViewUrl } from '@/utils/utils';
import { useHistory, useLocation } from "react-router-dom";
import type { LinkIssueState } from '@/stores/linkAux';
import { LinkOutlined } from '@ant-design/icons/lib/icons';
import Button from "@/components/Button";



interface MyDependPanelProps {
    issueId: string;
    canOptDependence: boolean;
}

export const MyDependPanel: React.FC<MyDependPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [showSelectLink, setShowSelectLink] = useState(false);

    const { pathname } = useLocation();
    const { push } = useHistory();

    const loadIssue = async () => {
        const res = await request(list_my_depend({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
        }));
        if (res) {
            setIssueList(res.issue_list);
        }
    };

    const addDependIssue = async (dependIssueId: string) => {
        const res = await request(add_dependence({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
            depend_issue_id: dependIssueId,
        }));
        if (res) {
            message.info("设置依赖工单成功");
            setShowSelectLink(false);
            await loadIssue();
        }
    };

    const removeDependIssue = async (dependIssueId: string) => {
        const res = await request(remove_dependence({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
            depend_issue_id: dependIssueId,
        }));
        if (res) {
            message.info("取消依赖工单成功");
            const itemList = issueList.filter(item => item.issue_id != dependIssueId);
            setIssueList(itemList);
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
                                getIssueViewUrl(pathname), {
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
        },
        {
            title: '操作',
            width: 80,
            render: (_, record: IssueInfo) => {
                return (
                    <Button
                        type="link"
                        disabled={!props.canOptDependence}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeDependIssue(record.issue_id);
                        }}>取消依赖</Button>
                );
            }
        }
    ];

    useEffect(() => {
        loadIssue();
    }, [props.issueId])

    return (
        <>
            <div style={{ position: "relative", paddingBottom: "28px" }}>
                <Button
                    style={{ position: "absolute", right: "10px" }}
                    type="primary"
                    disabled={!props.canOptDependence}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowSelectLink(true);
                    }}>新增依赖工单</Button>
            </div>
            <Table dataSource={issueList} columns={issueColums} pagination={false} />
            {showSelectLink == true && (
                <LinkSelect
                    title="选择依赖任务/缺陷"
                    showChannel={false}
                    showDoc={false}
                    showTask={true}
                    showBug={true}
                    showExterne={false}
                    onOk={(link: LinkInfo) => {
                        let dependIssueId = "";
                        if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_TASK) {
                            const taskLink = link as LinkTaskInfo;
                            dependIssueId = taskLink.issueId;
                        } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_BUG) {
                            const bugLink = link as LinkBugInfo;
                            dependIssueId = bugLink.issueId;
                        }
                        addDependIssue(dependIssueId);
                    }}
                    onCancel={() => setShowSelectLink(false)}
                />
            )}
        </>
    );
}