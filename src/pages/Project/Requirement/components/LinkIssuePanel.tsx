import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Card, Dropdown, Table, message } from 'antd';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';
import AddTaskOrBug from '@/components/Editor/components/AddTaskOrBug';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkTaskInfo } from '@/stores/linkAux';
import { link_issue, unlink_issue, list_issue_link } from '@/api/project_requirement';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import BatchCreateTask from './BatchCreateTask';
import type { IssueInfo } from '@/api/project_issue';
import { list_by_id as list_issue_by_id } from '@/api/project_issue';
import type { ColumnsType } from 'antd/lib/table';
import { issueState } from '@/utils/constant';
import { getStateColor } from '@/pages/Issue/components/utils';
import SingleCreateTask from './SingleCreateTask';
import { useHistory } from 'react-router-dom';

interface LinkIssuePanelProps {
    requirementId: string;
    onUpdate: () => void;
}

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

const LinkIssuePanel: React.FC<LinkIssuePanelProps> = (props) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRefModal, setShowRefModal] = useState(false);

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);

    const loadIssueList = async () => {
        const linkRes = await request(list_issue_link({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: props.requirementId,
        }));
        const res = await request(list_issue_by_id({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id_list: linkRes.issue_id_list,
        }));
        setIssueList(res.info_list);
    };

    const addRefTaskList = async (linkList: LinkInfo[]) => {
        for (const link of linkList) {
            const taskLink = link as LinkTaskInfo;
            if (issueList.map(item => item.issue_id).includes(taskLink.issueId)) {
                continue;
            }
            try {
                await request(link_issue({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    requirement_id: props.requirementId,
                    issue_id: taskLink.issueId,
                }));
            } catch (e) {
                console.log(e);
            }
        }
        setShowRefModal(false);
        props.onUpdate();
        await loadIssueList();
        message.info("关联成功");
    };

    const unlinkIssue = async (issueId: string) => {
        await request(unlink_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: props.requirementId,
            issue_id: issueId,
        }));
        props.onUpdate();
        await loadIssueList();
    };

    const columns: ColumnsType<IssueInfo> = [
        {
            title: "ID",
            width: 70,
            dataIndex: 'issue_index',
        },
        {
            title: "任务名称",
            width: 150,
            render: (_, record: IssueInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkTaskInfo("", record.project_id, record.issue_id, issueList.map(item => item.issue_id)), history);
                }}><LinkOutlined />&nbsp;{record.basic_info.title}</a>
            ),
        },
        {
            title: `阶段`,
            dataIndex: 'state',
            width: 100,
            align: 'center',
            render: (val: number) => renderState(val),
        },
        {
            title: "操作",
            width: 100,
            render: (_, record: IssueInfo) => (
                <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }}
                    disabled={projectStore.isClosed}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        unlinkIssue(record.issue_id);
                    }}>取消关联</Button>
            ),
        },
    ];


    useEffect(() => {
        loadIssueList();
    }, []);

    return (
        <Card title={<h2>相关任务</h2>} bordered={false} extra={
            <Dropdown.Button
                type="primary"
                disabled={projectStore.isClosed}
                menu={{
                    items: [
                        {
                            label: "批量创建",
                            key: "batch",
                        },
                        {
                            label: "引用任务",
                            key: "refTask",
                        },
                    ],
                    onClick: (e) => {
                        if (e.key == "batch") {
                            setShowBatchModal(true);
                        } else if (e.key == "refTask") {
                            setShowRefModal(true);
                        }
                    },
                }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAddModal(true);
                }}>
                <PlusOutlined />创建任务
            </Dropdown.Button>
        }>
            <Table rowKey="issue_id" columns={columns} dataSource={issueList} pagination={false} />
            {showAddModal == true && (
                <SingleCreateTask requirementId={props.requirementId}
                    onCancel={() => setShowAddModal(false)}
                    onOk={() => {
                        setShowAddModal(false);
                        props.onUpdate();
                        loadIssueList();
                        message.info("创建成功");
                    }} />
            )}
            {showRefModal == true && (
                <AddTaskOrBug
                    title="引用任务"
                    type="task"
                    open
                    disableLinkReq={true}
                    onOK={linkList => addRefTaskList(linkList as LinkInfo[])}
                    onCancel={() => setShowRefModal(false)}
                    issueIdList={issueList.map(item => item.issue_id)} />
            )}
            {showBatchModal == true && (
                <BatchCreateTask requirementId={props.requirementId}
                    onCancel={() => setShowBatchModal(false)}
                    onOk={() => {
                        setShowBatchModal(false);
                        props.onUpdate();
                        loadIssueList();
                        message.info("创建成功");
                    }} />
            )}
        </Card>
    );
};

export default observer(LinkIssuePanel);