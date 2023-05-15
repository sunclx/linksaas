import type { IssueInfo } from '@/api/project_issue';
import {
  ISSUE_STATE_CHECK, ISSUE_STATE_PROCESS, ISSUE_TYPE_TASK, ISSUE_TYPE_BUG,
} from '@/api/project_issue';

import { useStores } from '@/hooks';
import { getIssueText, getIsTask } from '@/utils/utils';
import { EditOutlined, ExportOutlined, LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib/icons';
import { Table, Tooltip } from 'antd';

import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import type { ColumnType } from 'antd/lib/table';
import { LinkBugInfo, LinkRequirementInfo, LinkTaskInfo } from '@/stores/linkAux';
import { showShortNote } from '@/utils/short_note';
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from '@/api/short_note';
import { issueState } from '@/utils/constant';
import msgIcon from '@/assets/allIcon/msg-icon.png';
import { EditSelect } from '../../../components/EditCell/EditSelect';
import { awardSelectItems, bugLvSelectItems, bugPrioritySelectItems, hourSelectItems, taskPrioritySelectItems } from './constant';
import { EditText } from '@/components/EditCell/EditText';
import { cancelDeadLineTime, cancelEndTime, cancelEstimateMinutes, cancelRemainMinutes, cancelStartTime, getMemberSelectItems, getStateColor, updateCheckAward, updateCheckUser, updateDeadLineTime, updateEndTime, updateEstimateMinutes, updateExecAward, updateExecUser, updateExtraInfo, updateRemainMinutes, updateStartTime, updateTitle } from './utils';
import { EditDate } from '@/components/EditCell/EditDate';

type ColumnsTypes = ColumnType<IssueInfo> & {
  dataIndex: string | string[];
  hideInTable?: boolean;
};


type IssueEditListProps = {
  isFilter: boolean;
  dataSource: IssueInfo[];
  issueIdList: string[];
  onChange: (issueId: string) => void;
  showStage: (issueId: string) => void;
};

const IssueEditList: React.FC<IssueEditListProps> = ({
  isFilter,
  dataSource,
  issueIdList,
  onChange,
  showStage,
}) => {
  const userStore = useStores("userStore");
  const projectStore = useStores("projectStore");
  const memberStore = useStores("memberStore");
  const linkAuxStore = useStores("linkAuxStore");

  const { pathname } = useLocation();
  const history = useHistory();

  const memberSelectItems = getMemberSelectItems(memberStore.memberList.map(item => item.member));

  const columnsList: ColumnsTypes[] = [
    {
      title: 'ID',
      dataIndex: 'issue_index',
      ellipsis: true,
      width: 40,
      fixed: true,
    },
    {
      title: `${getIssueText(pathname)}名称`,
      width: 340,
      ellipsis: true,
      dataIndex: ['basic_info', 'title'],
      fixed: true,
      render: (v: string, record: IssueInfo) => {
        return (
          <div style={{ lineHeight: "28px" }}>
            <EditText editable={true} content={v} showEditIcon={true} onChange={async (value) => {
              return await updateTitle(userStore.sessionId, record.project_id, record.issue_id, value);
            }} onClick={() => {
              if (record.issue_type == ISSUE_TYPE_TASK) {
                linkAuxStore.goToLink(new LinkTaskInfo("", record.project_id, record.issue_id, issueIdList), history);
              } else if (record.issue_type == ISSUE_TYPE_BUG) {
                linkAuxStore.goToLink(new LinkBugInfo("", record.project_id, record.issue_id, issueIdList), history);
              }
            }} />
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
                e.preventDefault();
                if (record.issue_type == ISSUE_TYPE_TASK) {
                  linkAuxStore.goToLink(new LinkTaskInfo("", record.project_id, record.issue_id, issueIdList), history);
                } else if (record.issue_type == ISSUE_TYPE_BUG) {
                  linkAuxStore.goToLink(new LinkBugInfo("", record.project_id, record.issue_id, issueIdList), history);
                }
              }}
            >
              <img src={msgIcon} alt="" />
              {record.msg_count > 999 ? `999+` : record.msg_count}
            </a>
          </div>
        );
      },
    },
    {
      title: "相关需求",
      dataIndex: "requirement_id",
      width: 150,
      ellipsis: true,
      hideInTable: getIsTask(pathname) == false,
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
      title: "便签",
      dataIndex: "issue_index",
      width: 40,
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
      title: "截止时间",
      dataIndex: "dead_line_time",
      width: 120,
      align: 'center',
      render: (_, record) => <EditDate
        editable={projectStore.isAdmin}
        hasTimeStamp={record.has_dead_line_time}
        timeStamp={record.dead_line_time}
        onChange={async (value) => {
          if (value === undefined) {
            return await cancelDeadLineTime(userStore.sessionId, record.project_id, record.issue_id);
          }
          return await updateDeadLineTime(userStore.sessionId, record.project_id, record.issue_id, value);
        }} showEditIcon={true} />,
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
              cursor: `${cursor}`,
              margin: '0 auto',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (row.user_issue_perm.next_state_list.length > 0) {
                showStage(row.issue_id);
              }
            }}
          >
            <Tooltip title={tips}>{v.label}</Tooltip>
            {row.user_issue_perm.next_state_list.length > 0 && <a><EditOutlined /></a>}
          </div>
        );
      },
    },
    {
      title: `级别`,
      width: 100,
      align: 'center',
      dataIndex: ['extra_info', 'ExtraBugInfo', 'level'],
      render: (v: number, record: IssueInfo) => <EditSelect
        allowClear={false}
        editable={true}
        curValue={v}
        itemList={bugLvSelectItems}
        onChange={async (value) => {
          return await updateExtraInfo(userStore.sessionId, record.project_id, record.issue_id, {
            ExtraBugInfo: {
              ...record.extra_info.ExtraBugInfo!,
              level: value as number,
            },
          });
        }} showEditIcon={true} />,
      hideInTable: getIsTask(pathname),
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
      render: (val: number, record: IssueInfo) => <EditSelect
        allowClear={false}
        editable={true}
        curValue={val}
        itemList={getIsTask(pathname) ? taskPrioritySelectItems : bugPrioritySelectItems}
        onChange={async (value) => {
          if (getIsTask(pathname)) {
            return await updateExtraInfo(userStore.sessionId, record.project_id, record.issue_id, {
              ExtraTaskInfo: {
                priority: value as number,
              }
            });
          } else {
            return await updateExtraInfo(userStore.sessionId, record.project_id, record.issue_id, {
              ExtraBugInfo: {
                ...record.extra_info.ExtraBugInfo!,
                priority: value as number,
              }
            });
          }
        }} showEditIcon={true} />

    },
    {
      title: `软件版本`,
      width: 150,
      align: 'center',
      ellipsis: true,
      dataIndex: ['extra_info', 'ExtraBugInfo', 'software_version'],
      hideInTable: getIsTask(pathname),
      render: (_, record: IssueInfo) => <EditText editable={true} content={record.extra_info.ExtraBugInfo?.software_version ?? ""} showEditIcon={true} onChange={async (value) => {
        return await updateExtraInfo(userStore.sessionId, record.project_id, record.issue_id, {
          ExtraBugInfo: {
            ...record.extra_info.ExtraBugInfo!,
            software_version: value,
          },
        });
      }} />,
    },
    {
      title: '处理人',
      dataIndex: 'exec_display_name',
      width: 100,
      align: 'center',
      render: (_, row: IssueInfo) => <EditSelect
        allowClear={false}
        editable={row.user_issue_perm.can_assign_exec_user}
        curValue={row.exec_user_id}
        itemList={memberSelectItems}
        onChange={async (value) => {
          const res = await updateExecUser(userStore.sessionId, row.project_id, row.issue_id, value as string);
          if (res) {
            onChange(row.issue_id);
          }
          return res;
        }} showEditIcon={true} />,
    },
    {
      title: '验收人',
      dataIndex: 'check_display_name',
      width: 100,
      align: 'center',
      render: (_, row: IssueInfo) => <EditSelect
        allowClear={false}
        editable={row.user_issue_perm.can_assign_check_user}
        curValue={row.check_user_id}
        itemList={memberSelectItems}
        onChange={async (value) => {
          const res = await updateCheckUser(userStore.sessionId, row.project_id, row.issue_id, value as string);
          if (res) {
            onChange(row.issue_id);
          }
          return res;
        }} showEditIcon={true} />,
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
      render: (v: number, row: IssueInfo) => <EditSelect
        allowClear={false}
        editable={row.user_issue_perm.can_set_award}
        curValue={v}
        itemList={awardSelectItems}
        onChange={async (value) => {
          return await updateExecAward(userStore.sessionId, row.project_id, row.issue_id, value as number);
        }} showEditIcon={true} />
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
      render: (v: number, row: IssueInfo) => <EditSelect
        allowClear={false}
        editable={row.user_issue_perm.can_set_award}
        curValue={v}
        itemList={awardSelectItems}
        onChange={async (value) => {
          return await updateCheckAward(userStore.sessionId, row.project_id, row.issue_id, value as number);
        }} showEditIcon={true} />
    },
    {
      title: '预估开始时间',
      dataIndex: 'start_time',
      width: 120,
      align: 'center',
      render: (_, record) => <EditDate
        editable={record.exec_user_id == userStore.userInfo.userId && record.state == ISSUE_STATE_PROCESS}
        hasTimeStamp={record.has_start_time}
        timeStamp={record.start_time}
        onChange={async (value) => {
          if (value === undefined) {
            return await cancelStartTime(userStore.sessionId, record.project_id, record.issue_id);
          }
          return await updateStartTime(userStore.sessionId, record.project_id, record.issue_id, value);
        }} showEditIcon={true} />,
    },
    {
      title: '预估完成时间',
      dataIndex: 'end_time',
      width: 120,
      align: 'center',
      render: (_, record) => <EditDate
        editable={record.exec_user_id == userStore.userInfo.userId && record.state == ISSUE_STATE_PROCESS}
        hasTimeStamp={record.has_end_time}
        timeStamp={record.end_time}
        onChange={async (value) => {
          if (value === undefined) {
            return await cancelEndTime(userStore.sessionId, record.project_id, record.issue_id);
          }
          return await updateEndTime(userStore.sessionId, record.project_id, record.issue_id, value);
        }} showEditIcon={true} />,
    },
    {
      title: '预估工时',
      dataIndex: 'estimate_minutes',
      width: 100,
      align: 'center',
      render: (_, record: IssueInfo) => <EditSelect
        allowClear={false}
        editable={record.exec_user_id == userStore.userInfo.userId && record.state == ISSUE_STATE_PROCESS}
        curValue={record.has_estimate_minutes ? record.estimate_minutes : -1}
        itemList={hourSelectItems}
        onChange={async (value) => {
          if (value === undefined) {
            return await cancelEstimateMinutes(userStore.sessionId, record.project_id, record.issue_id);
          }
          return await updateEstimateMinutes(userStore.sessionId, record.project_id, record.issue_id, value as number);
        }} showEditIcon={true} />
    },
    {
      title: '剩余工时',
      dataIndex: 'remain_minutes',
      width: 100,
      align: 'center',
      render: (_, record: IssueInfo) => <EditSelect
        allowClear={true}
        editable={record.exec_user_id == userStore.userInfo.userId && record.state == ISSUE_STATE_PROCESS}
        curValue={record.has_remain_minutes ? record.remain_minutes : -1}
        itemList={hourSelectItems}
        onChange={async (value) => {
          if (value === undefined) {
            return await cancelRemainMinutes(userStore.sessionId, record.project_id, record.issue_id);
          }
          return await updateRemainMinutes(userStore.sessionId, record.project_id, record.issue_id, value as number);
        }} showEditIcon={true} />
    },
    {
      title: "重复打开次数",
      dataIndex: "re_open_count",
      width: 100,
    },
    {
      title: "依赖我的任务数",
      dataIndex: "depend_me_count",
      width: 120,
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

  return (
    <Table
      style={{ marginTop: '8px' }}
      rowKey={'issue_id'}
      columns={columns}
      scroll={{ x: 1450, y: `${isFilter ? 'calc(100vh - 360px)' : 'calc(100vh - 302px)'}` }}
      dataSource={dataSource}
      pagination={false}
    />
  );
};

export default IssueEditList;
