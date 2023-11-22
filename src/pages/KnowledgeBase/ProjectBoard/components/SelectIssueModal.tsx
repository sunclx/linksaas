import {
    ASSGIN_USER_ALL,
    ISSUE_STATE_CHECK,
    ISSUE_STATE_PLAN,
    ISSUE_STATE_PROCESS,
    ISSUE_TYPE_BUG,
    ISSUE_TYPE_TASK,
    SORT_KEY_UPDATE_TIME,
    SORT_TYPE_DSC,
} from '@/api/project_issue';
import { useStores } from '@/hooks';
import { bugPriority, issueState, taskPriority } from '@/utils/constant';
import { issueTypeIsTask } from '@/utils/utils';
import { SearchOutlined } from '@ant-design/icons';
import type { ModalProps } from 'antd';
import { Checkbox, Form, Modal, Tabs } from 'antd';
import { Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import Table from 'antd/lib/table';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import RenderSelectOpt from '@/components/RenderSelectOpt';
import { request } from '@/utils/request';
import type {
    ListParam as ListIssueParam,
    ExtraBugInfo,
    ExtraTaskInfo,
    IssueInfo,
    ISSUE_TYPE
} from '@/api/project_issue';
import { list as list_issue, list_by_id as list_issue_by_id } from '@/api/project_issue';
import Pagination from '@/components/Pagination';
import { getStateColor } from '@/pages/Issue/components/utils';
import { REQ_SORT_UPDATE_TIME } from '@/api/project_requirement';
import { list_requirement, list_multi_issue_link } from '@/api/project_requirement';
import { start_update_content, keep_update_content, end_update_content, update_content, NODE_REF_TYPE_TASK, NODE_REF_TYPE_BUG } from "@/api/project_board";


const PAGE_SIZE = 10;

type SelectIssueModalProps = Omit<ModalProps, 'onOk'> & {
    nodeId: string;
    onClose: () => void;
    disableLinkReq?: boolean; //关联到项目需求
    type: ISSUE_TYPE;
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
            {v?.label}
        </div>
    );
};

const renderName = (id: string, name: string, userId: string) => {
    if (!id) return '-';
    const isCurrentUser = id === userId;
    return isCurrentUser ? <span style={{ color: 'red' }}>{name}</span> : <span>{name}</span>;
};

const renderManHour = (has: boolean, v: number) => {
    return has ? v / 60 + 'h' : '-';
};

const getExtraInfoType = (row: IssueInfo): ExtraTaskInfo | ExtraBugInfo | undefined => {
    const isTack = issueTypeIsTask(row);
    return isTack ? row.extra_info?.ExtraTaskInfo : row.extra_info?.ExtraBugInfo;
};

const SelectIssueModal: FC<SelectIssueModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');
    const boardStore = useStores('boardStore');

    const [activeKey, setActiveKey] = useState('task');

    const [dataSource, setDataSource] = useState<IssueInfo[]>([]);
    const [keyword, setKeyword] = useState('');
    const [includeClose, setIncludeClose] = useState(true);

    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const loadIssue = async () => {
        const listIssueParam: ListIssueParam = {
            filter_by_issue_type: true,
            issue_type: ISSUE_TYPE_TASK,
            filter_by_state: includeClose == false,
            state_list: includeClose ? [] : [ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
            filter_by_create_user_id: false,
            create_user_id_list: [],
            filter_by_assgin_user_id: false,
            assgin_user_id_list: [],
            assgin_user_type: ASSGIN_USER_ALL,
            filter_by_sprit_id: false,
            sprit_id_list: [],
            filter_by_create_time: false,
            from_create_time: 0,
            to_create_time: 0,
            filter_by_update_time: false,
            from_update_time: 0,
            to_update_time: 0,
            filter_by_task_priority: false,
            task_priority_list: [],
            filter_by_software_version: false,
            software_version_list: [],
            filter_by_bug_priority: false,
            bug_priority_list: [],
            filter_by_bug_level: false,
            bug_level_list: [],
            filter_by_title_keyword: keyword != '',
            title_keyword: keyword,
            filter_by_tag_id_list: false,
            tag_id_list: [],
            filter_by_watch: false,
        };

        const res = await request(
            list_issue({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                list_param: {
                    ...listIssueParam,
                    issue_type: props.type,
                },
                sort_type: SORT_TYPE_DSC,
                sort_key: SORT_KEY_UPDATE_TIME,
                offset: curPage * PAGE_SIZE,
                limit: PAGE_SIZE,
            }),
        )
        setDataSource(res.info_list);
        setTotalCount(res.total_count);
    };

    const loadIssueByReq = async () => {
        const reqRes = await request(list_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_keyword: keyword.trim() != "",
            keyword: keyword.trim(),
            filter_by_has_link_issue: true,
            has_link_issue: true,
            filter_by_closed: false,//FIXME
            closed: false,//FIXME
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            sort_type: REQ_SORT_UPDATE_TIME,//FIXME
            filter_by_tag_id_list: false,
            tag_id_list: [],
            filter_by_watch: false,
        }));
        if (reqRes.total_count == 0) {
            setDataSource([]);
            setTotalCount(0);
            return;
        }
        const issueIdRes = await request(list_multi_issue_link({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id_list: reqRes.requirement_list.map(item => item.requirement_id),
        }));
        const res = await request(list_issue_by_id({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id_list: issueIdRes.issue_id_list,
        }));
        setDataSource(res.info_list);
        setTotalCount(reqRes.total_count);
    };

    const updateIssueId = async (issueId: string) => {
        await request(update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
            node_data: {
                NodeRefData: {
                    ref_type: props.type == ISSUE_TYPE_TASK ? NODE_REF_TYPE_TASK : NODE_REF_TYPE_BUG,
                    ref_target_id: issueId,
                },
            },
        }));
        boardStore.updateNode(props.nodeId);
        props.onClose();
    };

    useEffect(() => {
        if (props.type == ISSUE_TYPE_BUG) {
            loadIssue();
        } else if (props.type == ISSUE_TYPE_TASK && activeKey == "task") {
            loadIssue();
        }
    }, [keyword, props.type, curPage, activeKey, includeClose]);

    useEffect(() => {
        if (props.type == ISSUE_TYPE_TASK && activeKey == "requirement") {
            loadIssueByReq();
        }
    }, [keyword, props.type, curPage, activeKey]);

    useEffect(() => {
        request(start_update_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            board_id: entryStore.curEntry?.entry_id ?? "",
            node_id: props.nodeId,
        }));
        const timer = setInterval(() => {
            request(keep_update_content({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                board_id: entryStore.curEntry?.entry_id ?? "",
                node_id: props.nodeId,
            }));
        }, 30 * 1000);
        return () => {
            clearInterval(timer);
            request(end_update_content({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                board_id: entryStore.curEntry?.entry_id ?? "",
                node_id: props.nodeId,
            }));
        };
    }, []);

    const columns: ColumnsType<IssueInfo> = [
        {
            title: `ID`,
            dataIndex: 'issue_index',
            width: 80,
            render: (v: IssueInfo['issue_index']) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {v}
                    </div>
                );
            },
        },
        {
            title: `名称`,
            ellipsis: true,
            dataIndex: ['basic_info', 'title'],
            width: 150,
            render: (_, row: IssueInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateIssueId(row.issue_id);
                }}>{row.basic_info?.title}</a>
            ),
        },
        {
            title: '优先级',
            sorter: {
                compare: (a: IssueInfo, b: IssueInfo) => {
                    return (getExtraInfoType(a)?.priority || 0) - (getExtraInfoType(b)?.priority || 1);
                },
                multiple: 1,
            },
            width: 100,
            align: 'center',
            render: (row: IssueInfo) => {
                return RenderSelectOpt(
                    issueTypeIsTask(row)
                        ? taskPriority[getExtraInfoType(row)?.priority || 0]
                        : bugPriority[getExtraInfoType(row)?.priority || 0],
                );
            },
        },
        {
            title: `任务阶段`,
            dataIndex: 'state',
            sorter: {
                compare: (a: { state: number }, b: { state: number }) => {
                    return a.state - b.state;
                },
            },
            width: 100,
            align: 'center',
            render: (val: number) => renderState(val),
        },
        {
            title: "关联需求",
            width: 150,
            dataIndex: "requirement_title",
        },
        {
            title: '处理人',
            dataIndex: 'exec_display_name',
            width: 100,
            align: 'center',
            render: (v: string, row: IssueInfo) =>
                renderName(row.exec_user_id, v, userStore.userInfo.userId),
        },
        {
            title: '验收人',
            dataIndex: 'check_display_name',
            width: 100,
            align: 'center',
            render: (v: string, row: IssueInfo) =>
                renderName(row.check_user_id, v, userStore.userInfo.userId),
        },
        {
            title: '剩余工时',
            dataIndex: 'remain_minutes',
            width: 100,
            align: 'center',
            sorter: {
                compare: (a: { remain_minutes: number }, b: { remain_minutes: number }) => {
                    return a.remain_minutes - b.remain_minutes;
                },
            },
            render: (v: number, record: IssueInfo) => renderManHour(record.has_remain_minutes, v),
        },
        {
            title: '预估工时',
            dataIndex: 'estimate_minutes',
            width: 100,
            align: 'center',
            sorter: {
                compare: (a: { estimate_minutes: number }, b: { estimate_minutes: number }) => {
                    return a.estimate_minutes - b.estimate_minutes;
                },
            },
            render: (v: number, record: IssueInfo) => renderManHour(record.has_estimate_minutes, v),
        },
    ];


    return (
        <Modal open width={833} footer={null} onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            props.onClose();
        }}>
            <div style={{ borderBottom: "1px solid #e4e4e8", paddingBottom: "15px" }}>
                {props.type == ISSUE_TYPE_TASK && (
                    <Tabs activeKey={activeKey} onChange={key => {
                        setKeyword("");
                        setCurPage(0);
                        setActiveKey(key);
                    }}>
                        <Tabs.TabPane tab="任务视角" key="task">
                            <Form layout="inline" style={{ paddingLeft: "10px" }}>
                                <Form.Item label="任务标题">
                                    <Input
                                        placeholder="输入关键词"
                                        prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
                                        style={{ width: '350px', borderRadius: ' 6px' }}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setKeyword(e.target.value);
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="包含已关闭任务">
                                    <Checkbox checked={includeClose} onChange={e => {
                                        e.stopPropagation();
                                        setIncludeClose(e.target.checked);
                                    }} />
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="需求视角" key='requirement'>
                            <Form layout="inline" style={{ paddingLeft: "10px" }}>
                                <Form.Item label="需求标题">
                                    <Input
                                        placeholder="输入关键词"
                                        prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
                                        style={{ width: '350px', borderRadius: ' 6px' }}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setKeyword(e.target.value);
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane>
                    </Tabs>
                )}
                {props.type == ISSUE_TYPE_BUG && (
                    <Form layout="inline" style={{ paddingLeft: "10px" }}>
                        <Form.Item label="缺陷标题">
                            <Input
                                placeholder="输入关键词"
                                prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
                                style={{ width: '350px', borderRadius: ' 6px' }}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setKeyword(e.target.value);
                                }}
                            />
                        </Form.Item>
                    </Form>
                )}
            </div>
            <Table
                style={{ marginTop: '8px', maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
                rowKey={'issue_id'}
                columns={columns}
                scroll={{ x: 950 }}
                dataSource={dataSource}
                pagination={false}
            />
            <Pagination
                total={totalCount}
                skipShowTotal={props.type == ISSUE_TYPE_TASK && activeKey == "requirement"}
                pageSize={PAGE_SIZE}
                current={curPage + 1}
                onChange={(page: number) => setCurPage(page - 1)}
            />
        </Modal>
    );
};

export default SelectIssueModal;
