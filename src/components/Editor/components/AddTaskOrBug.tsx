import {
  ASSGIN_USER_ALL,
  ISSUE_TYPE_BUG,
  ISSUE_TYPE_TASK,
  SORT_KEY_UPDATE_TIME,
  SORT_TYPE_DSC,
} from '@/api/project_issue';
import {
  ISSUE_STATE_CHECK,
  ISSUE_STATE_CLOSE,
  ISSUE_STATE_PLAN,
  ISSUE_STATE_PROCESS,
} from '@/api/project_issue';
import ActionModal from '@/components/ActionModal';
import { useStores } from '@/hooks';
import { bugPriority, issueState, ISSUE_STATE_COLOR_ENUM, taskPriority } from '@/utils/constant';
import { issueTypeIsTask } from '@/utils/utils';
import { SearchOutlined } from '@ant-design/icons';
import type { ModalProps } from 'antd';
import { Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import Table from 'antd/lib/table';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import RenderSelectOpt from '@/components/RenderSelectOpt';
import msgIcon from '@/assets/allIcon/msg-icon.png';
import { request } from '@/utils/request';
import type { WidgetData } from '../widgets/IssueRefWidget';
import type {
  ListParam as ListIssueParam,
  ExtraBugInfo,
  ExtraTaskInfo,
  IssueInfo,
} from '@/api/project_issue';
import { list as list_issue } from '@/api/project_issue';
import { LinkTaskInfo, LinkBugInfo, LinkNoneInfo } from '@/stores/linkAux';
import type { LinkInfo } from '@/stores/linkAux';
import Pagination from '@/components/Pagination';
import { useSetState } from 'ahooks';
import type { PageOptType } from '@/pages/Project/Task';

type AddTaskOrBugProps = Omit<ModalProps, 'onOk'> & {
  onOK?: (link: LinkInfo | LinkInfo[]) => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  data: WidgetData;
  type: 'task' | 'bug';
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
  // projectId: string,
  // linkAuxStore: LinkAuxStore | undefined,
  // history: History | undefined,
) => {
  return (
    <div>
      {row.basic_info?.title}

      {row.msg_count && (
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

const AddTaskOrBug: FC<AddTaskOrBugProps> = (props) => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const [dataSource, setDataSource] = useState<IssueInfo[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedRowKeys, setselectedRowKeys] = useState<React.Key[]>([]);

  const [pageOpt, setPageOpt] = useSetState<Partial<PageOptType>>({
    pageSize: 10,
    pageNum: 1,
    total: 0,
  });

  useEffect(() => {
    const listIssueParam: ListIssueParam = {
      filter_by_issue_type: true,
      issue_type: ISSUE_TYPE_TASK,
      filter_by_state: false,
      state_list: [],
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
    };

    request(
      list_issue({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        list_param: {
          ...listIssueParam,
          issue_type: props.type === 'task' ? ISSUE_TYPE_TASK : ISSUE_TYPE_BUG,
        },
        sort_type: SORT_TYPE_DSC,
        sort_key: SORT_KEY_UPDATE_TIME,
        offset: (pageOpt.pageNum! - 1) * pageOpt.pageSize!,
        limit: pageOpt.pageSize!,
      }),
    ).then((res) => {
      setDataSource(res.info_list);
      setPageOpt({
        total: res.total_count,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, props.type, pageOpt.pageNum]);

  const rowSelection = {
    onChange: (keys: React.Key[]) => {
      setselectedRowKeys(keys);
    },
  };

  const columns: ColumnsType<IssueInfo> = [
    {
      title: `ID`,
      dataIndex: 'issue_index',
      width: 80,
      render: (v: IssueInfo['issue_index']) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <Deliconsvg
              style={{ marginRight: '10px', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                console.log(v);
              }}
            /> */}
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
      render: (v: string, row: IssueInfo) => renderTitle(row),
      // renderTitle(row, projectStore.curProjectId, undefined, undefined),
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

  const okchange = () => {
    const linkList = selectedRowKeys.map((linkId) => {
      if (props.type === 'task') {
        return new LinkTaskInfo('', projectStore.curProjectId, linkId as string);
      } else if (props.type === 'bug') {
        return new LinkBugInfo('', projectStore.curProjectId, linkId as string);
      } else {
        return new LinkNoneInfo('');
      }
    });
    props.onOK?.(linkList);
  };

  return (
    <ActionModal {...props} width={833} onOK={okchange}>
      <div>
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
      </div>
      <Table
        style={{ marginTop: '8px' }}
        rowKey={'issue_id'}
        columns={columns}
        // className={s.EditIssueRef_table}
        scroll={{ x: 100 }}
        dataSource={dataSource}
        pagination={false}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
      <Pagination
        total={pageOpt.total!}
        pageSize={pageOpt.pageSize!}
        current={pageOpt.pageNum}
        onChange={(page: number) => setPageOpt({ pageNum: page })}
      />
    </ActionModal>
  );
};

export default AddTaskOrBug;
