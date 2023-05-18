import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { IssueInfo } from '@/api/project_issue';
import { ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE, ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS, ISSUE_TYPE_TASK } from '@/api/project_issue';
import { SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC } from '@/api/project_issue';
import { list as list_issue } from '@/api/project_issue';
import type { SpritInfo } from '@/api/project_sprit';
import { list as list_sprit, get as get_sprit } from '@/api/project_sprit';
import type { ColumnsType } from 'antd/lib/table';
import { useStores } from '@/hooks';
import { Card, Select, Table, Tag, message } from 'antd';
import { request } from '@/utils/request';
import { issueState, ISSUE_STATE_COLOR_ENUM } from '@/utils/constant';
import moment from 'moment';
import s from './IssueRefWidget.module.less';
import Button from '@/components/Button';
import { LinkOutlined, SyncOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { LinkBugInfo, LinkSpritInfo, LinkTaskInfo } from '@/stores/linkAux';

// 为了防止编辑器出错，WidgetData结构必须保存稳定

export interface WidgetData {
    spritId: string;
}

export const spritRefWidgetInitData: WidgetData = {
    spritId: "",
}

const listIssueBySprit = async (sessionId: string, projectId: string, spritId: string): Promise<IssueInfo[]> => {
    const res = await request(list_issue({
        session_id: sessionId,
        project_id: projectId,
        list_param: {
            filter_by_issue_type: false,
            issue_type: 0,
            filter_by_state: false,
            state_list: [],
            filter_by_create_user_id: false,
            create_user_id_list: [],
            filter_by_assgin_user_id: false,
            assgin_user_id_list: [],
            assgin_user_type: 0,
            filter_by_sprit_id: true,
            sprit_id_list: [spritId],
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
        limit: 999,
    }));
    return res.info_list;
}

const getColor = (v: number) => {
    switch (v) {
        case ISSUE_STATE_PLAN:
            return ISSUE_STATE_COLOR_ENUM.规划中颜色;
        case ISSUE_STATE_PROCESS:
            return ISSUE_STATE_COLOR_ENUM.处理颜色;
        case ISSUE_STATE_CHECK:
            return ISSUE_STATE_COLOR_ENUM.验收颜色;
        case ISSUE_STATE_CLOSE:
            return ISSUE_STATE_COLOR_ENUM.关闭颜色;
        default:
            return ISSUE_STATE_COLOR_ENUM.规划中颜色;
    }
};

const renderState = (val: number) => {
    const v = issueState[val];
    return (
        <div
            style={{
                background: `rgb(${getColor(val)} / 20%)`,
                width: '50px',
                margin: '0 auto',
                borderRadius: '50px',
                textAlign: 'center',
                color: `rgb(${getColor(val)})`,
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

const EditSpritRef: React.FC<WidgetProps> = (props) => {
    const data = props.initData as WidgetData;
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [curSpritId, setCurSpritId] = useState(data.spritId);
    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [spritList, setSpritList] = useState<SpritInfo[]>([]);

    const loadSpritInfo = async () => {
        const res = await request(list_sprit(userStore.sessionId, projectStore.curProjectId, false, false, 0, 999));
        setSpritList(res.info_list);
    };

    const loadIssue = async () => {
        setIssueList([]);
        if (curSpritId == "") {
            return;
        }
        const tmpList = await listIssueBySprit(userStore.sessionId, projectStore.curProjectId, curSpritId);
        setIssueList(tmpList);
    };

    const columns: ColumnsType<IssueInfo> = [
        {
            "title": "ID",
            dataIndex: 'issue_index',
            width: 70,
        },
        {
            "title": "类型",
            width: 50,
            render: (_, record: IssueInfo) => <span>{record.issue_type == ISSUE_TYPE_TASK ? "任务" : "缺陷"}</span>
        },
        {
            "title": "名称",
            dataIndex: ["basic_info", "title"],
            width: 100,
        },
        {
            title: "阶段",
            dataIndex: 'state',
            width: 100,
            align: 'center',
            render: (val: number) => renderState(val),
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
            title: '预估开始成时间',
            dataIndex: 'start_time',
            width: 120,
            align: 'center',
            render: (_, record: IssueInfo) => <>
                {record.has_start_time == true && <span>{moment(record.start_time).format("YYYY-MM-DD")}</span>}
                {record.has_start_time == false && <span>-</span>}
            </>
        },
        {
            title: '预估完成时间',
            dataIndex: 'end_time',
            width: 120,
            align: 'center',
            render: (_, record) => <>
                {record.has_end_time == true && <span>{moment(record.end_time).format("YYYY-MM-DD")}</span>}
                {record.has_end_time == false && <span>-</span>}
            </>
        },
        {
            title: '预估工时',
            dataIndex: 'estimate_minutes',
            width: 100,
            align: 'center',
            render: (_, record: IssueInfo) => <>
                {record.has_estimate_minutes == true && <span>{(record.estimate_minutes / 60).toFixed(1)}小时</span>}
                {record.has_estimate_minutes == false && <span>-</span>}
            </>
        },
        {
            title: '剩余工时',
            dataIndex: 'remain_minutes',
            width: 100,
            align: 'center',
            render: (_, record: IssueInfo) => <>
                {record.has_remain_minutes == true && <span>{(record.remain_minutes / 60).toFixed(1)}小时</span>}
                {record.has_remain_minutes == false && <span>-</span>}
            </>
        },
    ];

    useEffect(() => {
        loadSpritInfo();
    }, []);

    useEffect(() => {
        loadIssue();
    }, [curSpritId]);

    return (
        <ErrorBoundary>
            <EditorWrap onChange={() => props.removeSelf()}>
                <Card extra={
                    <Select style={{ width: 200 }}
                        placeholder="请选择工作计划" value={curSpritId} onChange={(spritId: string) => {
                            setCurSpritId(spritId);
                            const saveData: WidgetData = {
                                spritId: spritId,
                            };
                            props.writeData(saveData);
                        }}>
                        {spritList.map(sprit => (<Select.Option key={sprit.sprit_id} value={sprit.sprit_id}>{sprit.basic_info.title}</Select.Option>))}
                    </Select>
                }>
                    <Table
                        rowKey="issue_id"
                        className={s.EditIssueRef_table}
                        dataSource={issueList}
                        columns={columns}
                        pagination={false}
                    />
                </Card>
            </EditorWrap>
        </ErrorBoundary>
    );
}

const ViewSpritRef: React.FC<WidgetProps> = (props) => {
    const data = props.initData as WidgetData;
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [spritInfo, setSprintInfo] = useState<SpritInfo | null>(null);
    const [loading, setLoading] = useState(false);

    const loadSpritInfo = async () => {
        const res = await request(get_sprit(userStore.sessionId, projectStore.curProjectId, data.spritId));
        setSprintInfo(res.info);
    };

    const loadIssue = async () => {
        const tmpList = await listIssueBySprit(userStore.sessionId, projectStore.curProjectId, data.spritId);
        setIssueList(tmpList);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            await loadSpritInfo();
            await loadIssue();
            setLoading(false);
        } catch (_) {
            message.error("出错了");
            setLoading(false);
        }
    }

    const columns: ColumnsType<IssueInfo> = [
        {
            "title": "ID",
            dataIndex: 'issue_index',
            width: 70,
        },
        {
            "title": "类型",
            width: 50,
            render: (_, record: IssueInfo) => <span>{record.issue_type == ISSUE_TYPE_TASK ? "任务" : "缺陷"}</span>
        },
        {
            "title": "名称",
            width: 100,
            render: (_, record: IssueInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (record.issue_type == ISSUE_TYPE_TASK) {
                        linkAuxStore.goToLink(new LinkTaskInfo("", record.project_id, record.issue_id), history);
                    } else {
                        linkAuxStore.goToLink(new LinkBugInfo("", record.project_id, record.issue_id), history);
                    }
                }}>
                    <LinkOutlined />{record.basic_info.title}
                </a>
            ),
        },
        {
            title: "阶段",
            dataIndex: 'state',
            width: 100,
            align: 'center',
            render: (val: number) => renderState(val),
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
            title: '预估开始成时间',
            dataIndex: 'start_time',
            width: 120,
            align: 'center',
            render: (_, record: IssueInfo) => <>
                {record.has_start_time == true && <span>{moment(record.start_time).format("YYYY-MM-DD")}</span>}
                {record.has_start_time == false && <span>-</span>}
            </>
        },
        {
            title: '预估完成时间',
            dataIndex: 'end_time',
            width: 120,
            align: 'center',
            render: (_, record) => <>
                {record.has_end_time == true && <span>{moment(record.end_time).format("YYYY-MM-DD")}</span>}
                {record.has_end_time == false && <span>-</span>}
            </>
        },
        {
            title: '预估工时',
            dataIndex: 'estimate_minutes',
            width: 100,
            align: 'center',
            render: (_, record: IssueInfo) => <>
                {record.has_estimate_minutes == true && <span>{(record.estimate_minutes / 60).toFixed(1)}小时</span>}
                {record.has_estimate_minutes == false && <span>-</span>}
            </>
        },
        {
            title: '剩余工时',
            dataIndex: 'remain_minutes',
            width: 100,
            align: 'center',
            render: (_, record: IssueInfo) => <>
                {record.has_remain_minutes == true && <span>{(record.remain_minutes / 60).toFixed(1)}小时</span>}
                {record.has_remain_minutes == false && <span>-</span>}
            </>
        },
    ];


    useEffect(() => {
        loadData();
    }, []);
    return (
        <ErrorBoundary>
            <EditorWrap>
                <div className={s.sync_wrap}>
                    <Button
                        className={s.sync}
                        disabled={loading}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            loadData();
                        }} icon={<SyncOutlined />}>
                        &nbsp;&nbsp;刷新
                    </Button>
                </div>
                {spritInfo != null && (
                    <div className={s.sprit_info_wrap}>
                        <div className={s.sprit_info}>
                            <div className={s.label}>工作计划名称:</div>
                            <div><a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                linkAuxStore.goToLink(new LinkSpritInfo("", spritInfo.project_id, spritInfo.sprit_id), history);
                            }}><LinkOutlined />{spritInfo.basic_info.title}</a></div>
                        </div>
                        <div className={s.sprit_info}>
                            <div className={s.label}>时间区间:</div>
                            <div>{moment(spritInfo.basic_info.start_time).format("YYYY-MM-DD")}&nbsp;至&nbsp;{moment(spritInfo.basic_info.end_time).format("YYYY-MM-DD")}</div>
                        </div>
                        {spritInfo.basic_info.non_work_day_list.length > 0 && (
                            <div className={s.sprit_info}>
                                <div className={s.label}>非工作日:</div>
                                <div>{spritInfo.basic_info.non_work_day_list.map(item => (
                                    <Tag key={item} style={{ marginRight: "10px" }}>{moment(item).format("YYYY-MM-DD")}</Tag>
                                ))}</div>
                            </div>
                        )}
                    </div>
                )}
                <Table
                    rowKey="issue_id"
                    className={s.EditIssueRef_table}
                    dataSource={issueList}
                    columns={columns}
                    pagination={false}
                />

            </EditorWrap>
        </ErrorBoundary>
    );
}


export const SpritRefWidget: React.FC<WidgetProps> = (props) => {
    if (props.editMode) {
        return <EditSpritRef {...props} />
    } else {
        return <ViewSpritRef {...props} />
    }
}