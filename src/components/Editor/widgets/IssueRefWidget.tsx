import React, { useMemo, useState } from 'react';
import type { WidgetProps } from './common';
import type { ExtraBugInfo, ExtraTaskInfo, IssueInfo, ISSUE_TYPE } from '@/api/project_issue';
import {
  ISSUE_STATE_CHECK,
  ISSUE_STATE_CLOSE,
  ISSUE_STATE_PLAN,
  ISSUE_STATE_PROCESS,
} from '@/api/project_issue';
import { ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, get as get_issue, list_by_id } from '@/api/project_issue';
import EditorWrap from '../components/EditorWrap';
import RenderSelectOpt from '@/components/RenderSelectOpt';
import { issueTypeIsTask } from '@/utils/utils';
import { bugPriority, issueState, ISSUE_STATE_COLOR_ENUM, taskPriority } from '@/utils/constant';
import type { ColumnsType } from 'antd/lib/table';
import { Table } from 'antd';
import { useStores } from '@/hooks';
import msgIcon from '@/assets/allIcon/msg-icon.png';
import s from './IssueRefWidget.module.less';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkTaskInfo, LinkBugInfo } from '@/stores/linkAux';
import { request } from '@/utils/request';
import { useHistory } from 'react-router-dom';
import type LinkAuxStore from '@/stores/linkAux';
import type { History } from 'history';
import Button from '@/components/Button';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as Deliconsvg } from '@/assets/svg/delicon.svg';
import AddTaskOrBug from '../components/AddTaskOrBug';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// 为了防止编辑器出错，WidgetData结构必须保存稳定

export interface WidgetData {
  issueType: ISSUE_TYPE;
  title?: string; //标题，可选
  issueIdList: string[]; //工单ID列表
}

export const taskRefWidgetInitData: WidgetData = {
  issueType: ISSUE_TYPE_TASK,
  issueIdList: [],
};

export const bugRefWidgetInitData: WidgetData = {
  issueType: ISSUE_TYPE_BUG,
  issueIdList: [],
};

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

const renderTitle = (
  row: IssueInfo,
  projectId: string,
  linkAuxStore: LinkAuxStore | undefined,
  history: History | undefined,
) => {
  return (
    <div>
      <Button
        type="link"
        disabled={linkAuxStore == undefined}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (linkAuxStore !== undefined && history != undefined) {
            if (row.issue_type == ISSUE_TYPE_TASK) {
              linkAuxStore.goToLink(new LinkTaskInfo('', projectId, row.issue_id), history);
            } else if (row.issue_type == ISSUE_TYPE_BUG) {
              linkAuxStore.goToLink(new LinkBugInfo('', projectId, row.issue_id), history);
            }
          }
        }}
      >
        {row.basic_info?.title}
      </Button>
      {row.msg_count > 0 && (
        <span
          style={{
            padding: '0px 5px',
            display: 'inline-block',
            height: ' 20px',
            background: '#F4F4F7',
            borderRadius: '9px',
            marginLeft: '4px',
            color: '#A7A9B6',
          }}
        >
          <img src={msgIcon} alt="" style={{ verticalAlign: 'sub' }} />
          {row.msg_count > 999 ? `999+` : row.msg_count}
        </span>
      )}
    </div>
  );
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

const renderManHour = (has: boolean, v: number) => {
  return has ? v / 60 + 'h' : '-';
};

const getExtraInfoType = (row: IssueInfo): ExtraTaskInfo | ExtraBugInfo | undefined => {
  const isTack = issueTypeIsTask(row);
  return isTack ? row.extra_info?.ExtraTaskInfo : row.extra_info?.ExtraBugInfo;
};

const EditIssueRef: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const [dataSource, setDataSource] = useState<IssueInfo[]>([]);
  const [showAddIssue, setShowAddIssue] = useState(false);

  const addIssue = async (link: LinkInfo | LinkInfo[]) => {
    const linkList = link as LinkInfo[];
    const issueIdList = [] as string[];
    for (const curLink of linkList) {
      if (data.issueType == ISSUE_TYPE_TASK) {
        issueIdList.push((curLink as unknown as LinkTaskInfo).issueId);
      } else if (data.issueType == ISSUE_TYPE_BUG) {
        issueIdList.push((curLink as unknown as LinkBugInfo).issueId);
      }
    }
    const issueList = dataSource.slice();
    for (const issueId of issueIdList) {
      const index = issueList.findIndex((issue) => issue.issue_id == issueId);
      if (index != -1) {
        continue;
      }
      const res = await request(get_issue(userStore.sessionId, projectStore.curProjectId, issueId));
      if (res) {
        issueList.push(res.info);
      }
    }
    if (issueList.length != dataSource.length) {
      setDataSource(issueList);
    }
    const saveData: WidgetData = {
      issueType: data.issueType,
      issueIdList: issueList.map((item) => item.issue_id),
    };
    props.writeData(saveData);
  };

  const removeIssue = (issueIndex: number) => {
    const tmpList = dataSource.filter(item => item.issue_index != issueIndex);
    setDataSource(tmpList);
  }

  const columns: ColumnsType<IssueInfo> = [
    {
      title: `ID`,
      dataIndex: 'issue_index',
      width: 70,
      render: (v: number) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Deliconsvg
              style={{ marginRight: '10px', cursor: 'pointer', color: '#0E83FF' }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeIssue(v);
              }}
            />
            {v}
          </div>
        );
      },
    },
    {
      title: `名称`,
      ellipsis: true,
      dataIndex: ['basic_info', 'title'],
      width: 200,
      render: (v: string, row: IssueInfo) =>
        renderTitle(row, projectStore.curProjectId, undefined, undefined),
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

  useMemo(() => {
    const linkList = data.issueIdList.map((issueId) => {
      if (data.issueType == ISSUE_TYPE_TASK) {
        return new LinkTaskInfo('', projectStore.curProjectId, issueId);
      } else {
        return new LinkBugInfo('', projectStore.curProjectId, issueId);
      }
    });
    addIssue(linkList);
  }, []);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <div className={s.add}>
          <Button
            ghost
            style={{ minWidth: '60px', borderRadius: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowAddIssue(true);
            }}
          >
            <PlusOutlined />
            添加
          </Button>
        </div>
        <Table
          style={{ marginTop: '8px' }}
          rowKey={'issue_id'}
          columns={columns}
          className={s.EditIssueRef_table}
          scroll={{ x: 100 }}
          dataSource={dataSource}
          pagination={false}
        />

        <AddTaskOrBug
          title={data.issueType == ISSUE_TYPE_TASK ? '引用任务' : '引用缺陷'}
          visible={showAddIssue}
          onCancel={() => setShowAddIssue(false)}
          okText="完成"
          onOK={(link) => {
            addIssue(link);
            setShowAddIssue(false);
          }}
          data={props.initData as WidgetData}
          type={data.issueType == ISSUE_TYPE_TASK ? 'task' : 'bug'}
        />
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewIssueRef: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const linkAuxStore = useStores('linkAuxStore');
  const history = useHistory();
  const [dataSource, setDataSource] = useState<IssueInfo[]>([]);

  const columns: ColumnsType<IssueInfo> = [
    {
      title: `ID`,
      dataIndex: 'issue_index',
      width: 80,
      render: (v: IssueInfo['issue_index']) => {
        return <div style={{ display: 'flex', alignItems: 'center' }}>{v}</div>;
      },
    },
    {
      title: `名称`,
      ellipsis: true,
      dataIndex: ['basic_info', 'title'],
      width: 150,
      render: (v: string, row: IssueInfo) =>
        renderTitle(row, projectStore.curProjectId, linkAuxStore, history),
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

  const loadData = async () => {
    const res = await request(
      list_by_id({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        issue_id_list: data.issueIdList,
      }),
    );
    if (res) {
      setDataSource(res.info_list);
    }
  };

  useMemo(() => {
    loadData();
  }, []);

  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        {data.title && <span>标题:${data.title}</span>}
        <Table
          style={{ marginTop: '8px' }}
          rowKey={'issue_id'}
          columns={columns}
          className={s.EditIssueRef_table}
          scroll={{ x: 100 }}
          dataSource={dataSource}
          pagination={false}
        />
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const IssueRefWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditIssueRef {...props} />;
  } else {
    return <ViewIssueRef {...props} />;
  }
};
