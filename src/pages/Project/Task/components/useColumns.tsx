import type { IssueInfo } from '@/api/project_issue';
import RenderSelectOpt from '@/components/RenderSelectOpt';
import {
  bugLevel,
  bugPriority,
  issueState,
  ISSUE_STATE_COLOR_ENUM,
  taskPriority,
} from '@/utils/constant';
import React from 'react';
import msgIcon from '@/assets/allIcon/msg-icon.png';
import { useHistory, useLocation } from 'react-router-dom';
import { TASK_INSIDE_PAGES_ENUM } from '../CreateTask';
import type { ColumnType } from 'antd/lib/table';
import { getIssueText, getIsTask, timeToDateString, getIssueViewUrl } from '@/utils/utils';
import { ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE } from '@/api/project_issue';
import type { LinkIssueState } from '@/stores/linkAux';
import { Tooltip } from 'antd';
import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib/icons';

type useTableProps = {
  setStageModelData: (boo: boolean, v: IssueInfo) => void;
  dataSource: IssueInfo[];
  setDataSource: React.Dispatch<React.SetStateAction<IssueInfo[]>>;
  onSuccess: () => void;
  userId: string;
};

export enum TABLE_FORM_TYPE_ENUM {
  TITLE = 'title', // 名称
  PRIORITY = 'priority', // 优先级
  EXEC_USER = 'exec_user_id', // 处理人
  CHECK_USER = 'check_user_id', // 验收人
  EXEC_USER_AWARD = 'exec_award_point', //处理贡献
  CHECK_USER_AWARD = 'check_award_point',//验收贡献
  REMAIN = 'remain_minutes', // 剩余工时
  ESTIMATE = 'estimate_minutes', // 预估工时
  END = 'end_time', // 预估完成时间
  LEVEL = 'level', // 级别
  VERSION = 'software_version', // 软件版本
}

type ColumnsTypes = ColumnType<IssueInfo> & {
  editable?: (row: IssueInfo) => boolean;
  dataIndex: string | string[];
  formtype?: TABLE_FORM_TYPE_ENUM;
  hideInTable?: boolean;
};

const useTable = (props: useTableProps) => {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const { dataSource, setDataSource, onSuccess } = props;

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

  const columnsList: ColumnsTypes[] = [
    {
      title: 'ID',
      dataIndex: 'issue_index',
      ellipsis: true,
      width: 80,
      fixed: true,
      render: (v: IssueInfo['issue_index'], record: IssueInfo) => {
        return (
          <span
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              push(
                getIssueViewUrl(pathname), {
                  issueId: record.issue_id,
                  mode: TASK_INSIDE_PAGES_ENUM.DETAILS,
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
      title: `${getIssueText(pathname)}名称`,
      width: 200,
      ellipsis: true,
      dataIndex: ['basic_info', 'title'],
      fixed: true,
      render: (v: string, record: IssueInfo) => {
        return (
          <div>
            {v}
            <a
              style={{
                padding: '0px 7px',
                display: 'inline-block',
                height: ' 20px',
                background: '#F4F4F7',
                borderRadius: '9px',
                marginLeft: '4px',
                color: '#A7A9B6',
              }}
              onClick={async (e) => {
                e.stopPropagation();
                push(
                  getIssueViewUrl(pathname), {
                    issueId: record.issue_id,
                    mode: TASK_INSIDE_PAGES_ENUM.DETAILS,
                    content: "",
                  } as LinkIssueState
                );
              }}
            >
              <img src={msgIcon} alt="" />
              {record.msg_count > 999 ? `999+` : record.msg_count}
            </a>
          </div>
        );
      },
      editable: () => { return true; },
      formtype: TABLE_FORM_TYPE_ENUM.TITLE,
    },
    {
      title: `级别`,
      width: 100,
      align: 'center',
      dataIndex: ['extra_info', 'ExtraBugInfo', 'level'],
      render: (v: string | number) => {
        return RenderSelectOpt(bugLevel[v]) || '-';
      },
      hideInTable: getIsTask(pathname),
      editable: () => { return true; },
      formtype: TABLE_FORM_TYPE_ENUM.LEVEL,
    },
    {
      title: '优先级',
      dataIndex: [
        'extra_info',
        `${getIsTask(pathname) ? 'ExtraTaskInfo' : 'ExtraBugInfo'}`,
        'priority',
      ],
      width: 120,
      align: 'center',
      render: (val: string | number) =>
        RenderSelectOpt(getIsTask(pathname) ? taskPriority[val] : bugPriority[val]),
      editable: () => { return true; },
      formtype: TABLE_FORM_TYPE_ENUM.PRIORITY,
    },
    {
      title: `软件版本`,
      width: 100,
      align: 'center',
      ellipsis: true,
      dataIndex: ['extra_info', 'ExtraBugInfo', 'software_version'],
      hideInTable: getIsTask(pathname),
      editable: () => { return true; },
      formtype: TABLE_FORM_TYPE_ENUM.VERSION,
      render: (v) => {
        return v || '-';
      },
    },
    {
      title: `${getIsTask(pathname) ? '任务' : '当前'}阶段`,
      dataIndex: 'state',
      width: 100,
      align: 'center',
      render: (val: number, row: IssueInfo) => {
        const v = issueState[val];
        let cursor = "auto";
        let tips = "";
        if (row.user_issue_perm.next_state_list.length > 0) {
          cursor = "pointer";
        } else {
          if ([ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK].includes(row.state) && (
            (props.userId == row.exec_user_id) || (props.userId == row.check_user_id)
          )) {
            tips = "请等待同事更新状态"
          }
        }
        return (
          <div
            tabIndex={0}
            style={{
              background: `rgb(${getColor(val)} / 20%)`,
              width: '50px',
              borderRadius: '50px',
              textAlign: 'center',
              color: `rgb(${getColor(val)})`,
              cursor: `${cursor}`,
              margin: '0 auto',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (row.user_issue_perm.next_state_list.length > 0) {
                props.setStageModelData(true, row);
              }
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
      editable: (issue: IssueInfo) => { return issue.user_issue_perm.can_assign_exec_user },
      formtype: TABLE_FORM_TYPE_ENUM.EXEC_USER,
      render: (v, row: IssueInfo) => {
        return row.exec_user_id ? v : '-';
      },
    },
    {
      title: '验收人',
      dataIndex: 'check_display_name',
      width: 100,
      align: 'center',
      editable: (issue: IssueInfo) => { return issue.user_issue_perm.can_assign_check_user; },
      formtype: TABLE_FORM_TYPE_ENUM.CHECK_USER,
      render: (v, row: IssueInfo) => {
        return row.check_user_id ? v : '-';
      },
    },
    {
      title: (<span>
        处理贡献&nbsp;
        <Tooltip title={`当${getIssueText(pathname)}关闭后，会给处理人增加的项目贡献值`} trigger="click">
          <a><QuestionCircleOutlined /></a>
        </Tooltip>
      </span>),
      dataIndex: 'exec_award_point',
      width: 100,
      align: 'center',
      editable: (issue: IssueInfo) => { return issue.user_issue_perm.can_assign_exec_user },
      formtype: TABLE_FORM_TYPE_ENUM.EXEC_USER_AWARD,
    },
    {
      title: (<span>
        验收贡献&nbsp;
        <Tooltip title={`当${getIssueText(pathname)}关闭后，会给验收人增加的项目贡献值`} trigger="click">
          <a><QuestionCircleOutlined /></a>
        </Tooltip>
      </span>),
      dataIndex: 'check_award_point',
      width: 100,
      align: 'center',
      editable: (issue: IssueInfo) => { return issue.user_issue_perm.can_assign_check_user; },
      formtype: TABLE_FORM_TYPE_ENUM.CHECK_USER_AWARD,
    },
    {
      title: '剩余工时',
      dataIndex: 'remain_minutes',
      width: 100,
      align: 'center',
      editable: (issue: IssueInfo) => { return props.userId == issue.exec_user_id; },
      formtype: TABLE_FORM_TYPE_ENUM.REMAIN,
      render: (v, record: IssueInfo) => {
        return record.has_remain_minutes ? v / 60 + 'h' : '-';
      },
    },
    {
      title: '预估工时',
      dataIndex: 'estimate_minutes',
      width: 100,
      align: 'center',
      editable: (issue: IssueInfo) => { return props.userId == issue.exec_user_id; },
      formtype: TABLE_FORM_TYPE_ENUM.ESTIMATE,
      render: (v, record: IssueInfo) => {
        return record.has_estimate_minutes ? v / 60 + 'h' : '-';
      },
    },
    {
      title: '预估完成时间',
      dataIndex: 'end_time',
      width: 120,
      align: 'center',
      editable: (issue: IssueInfo) => { return props.userId == issue.exec_user_id; },
      formtype: TABLE_FORM_TYPE_ENUM.END,
      render: (v, row) => {
        return row.has_end_time ? timeToDateString(v, 'YYYY-MM-DD') : '-';
      },
    },
    {
      title: `${getIssueText(pathname)}创建者`,
      dataIndex: 'create_display_name',
      width: 100,
      align: 'center',
      render: (v) => {
        return v ? v : '-';
      },
    },
  ];
  const columns: ColumnsTypes[] = columnsList.filter((item: ColumnsTypes) => !item.hideInTable);

  const handleSave = (row: IssueInfo) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.issue_index === item.issue_index);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const columns1 = columns.map((col) => {
    return {
      ...col,
      onCell: (record: IssueInfo) => ({
        record,
        editable: col.editable == undefined ? false : col.editable(record),
        dataIndex: col.dataIndex,
        formtype: col?.formtype,
        title: col.title,
        handleSave: handleSave,
        onSuccess: onSuccess,
      }),
    };
  });

  return {
    columns1,
  };
};

export default useTable;
