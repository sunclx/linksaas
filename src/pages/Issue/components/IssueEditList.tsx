import type { ISSUE_TYPE, IssueInfo, PROCESS_STAGE } from '@/api/project_issue';
import {
  ISSUE_STATE_CHECK, ISSUE_STATE_PROCESS, ISSUE_TYPE_TASK, ISSUE_TYPE_BUG, PROCESS_STAGE_TODO, PROCESS_STAGE_DOING, PROCESS_STAGE_DONE,
} from '@/api/project_issue';
import { useStores } from '@/hooks';
import { getIssueText, getIsTask } from '@/utils/utils';
import { EditOutlined, ExportOutlined, LinkOutlined } from '@ant-design/icons/lib/icons';
import { Space, Table, Tooltip } from 'antd';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import type { ColumnType } from 'antd/lib/table';
import { LinkBugInfo, LinkRequirementInfo, LinkTaskInfo } from '@/stores/linkAux';
import { showShortNote } from '@/utils/short_note';
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from '@/api/short_note';
import { issueState } from '@/utils/constant';
import msgIcon from '@/assets/allIcon/msg-icon.png';
import { EditSelect } from '../../../components/EditCell/EditSelect';
import { bugLvSelectItems, bugPrioritySelectItems, hourSelectItems, taskPrioritySelectItems } from './constant';
import { EditText } from '@/components/EditCell/EditText';
import {
  cancelDeadLineTime, cancelEndTime, cancelEstimateMinutes, cancelRemainMinutes,
  cancelStartTime, getMemberSelectItems, getStateColor, updateCheckUser,
  updateDeadLineTime, updateEndTime, updateEstimateMinutes, updateExecUser,
  updateExtraInfo, updateProcessStage, updateRemainMinutes, updateStartTime, updateTitle
} from './utils';
import { EditDate } from '@/components/EditCell/EditDate';
import type { TagInfo } from "@/api/project";
import { EditTag } from '@/components/EditCell/EditTag';
import { update_tag_id_list } from "@/api/project_issue";
import { watch, unwatch, WATCH_TARGET_TASK, WATCH_TARGET_BUG } from "@/api/project_watch";
import { request } from '@/utils/request';
import s from "./IssueEditList.module.less";
import UserPhoto from '@/components/Portrait/UserPhoto';

type ColumnsTypes = ColumnType<IssueInfo> & {
  dataIndex: string | string[];
  hideInTable?: boolean;
};


type IssueEditListProps = {
  isFilter: boolean;
  dataSource: IssueInfo[];
  issueIdList: string[];
  tagDefList: TagInfo[];
  onChange: (issueId: string) => void;
  showStage: (issueId: string) => void;
};

const IssueEditList: React.FC<IssueEditListProps> = ({
  isFilter,
  dataSource,
  issueIdList,
  tagDefList,
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

  const unwatchIssue = async (issueId: string, issueType: ISSUE_TYPE) => {
    await request(unwatch({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      target_type: issueType == ISSUE_TYPE_TASK ? WATCH_TARGET_TASK : WATCH_TARGET_BUG,
      target_id: issueId,
    }));
    onChange(issueId);
  };

  const watchIssue = async (issueId: string, issueType: ISSUE_TYPE) => {
    await request(watch({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      target_type: issueType == ISSUE_TYPE_TASK ? WATCH_TARGET_TASK : WATCH_TARGET_BUG,
      target_id: issueId,
    }));
    onChange(issueId);
  };

  const columnsList: ColumnsTypes[] = [
    {
      title: "",
      dataIndex: "my_watch",
      width: 40,
      render: (_, record: IssueInfo) => (
        <a onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (record.my_watch) {
            unwatchIssue(record.issue_id, record.issue_type);
          } else {
            watchIssue(record.issue_id, record.issue_type);
          }
        }}>
          <span className={record.my_watch ? s.isCollect : s.noCollect} />
        </a>
      ),
      fixed: true,
    },
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
            <EditText editable={(!projectStore.isClosed) && record.user_issue_perm.can_update} content={v} showEditIcon={true} onChange={async (value) => {
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
      align: 'left',
      render: (_, record: IssueInfo) => <EditDate
        editable={(!projectStore.isClosed) && projectStore.isAdmin && record.user_issue_perm.can_update}
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
      title: `${getIsTask(pathname) ? '任务' : '当前'}状态`,
      dataIndex: 'state',
      width: 100,
      align: 'center',
      render: (val: number, row: IssueInfo) => {
        const v = issueState[val];
        let cursor = "default";
        let tips = "";
        if (row.user_issue_perm.next_state_list.length > 0) {
          if (!projectStore.isClosed) {
            cursor = "pointer";
          }
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
              if (projectStore.isClosed) {
                return;
              }
              if (row.user_issue_perm.next_state_list.length > 0) {
                showStage(row.issue_id);
              }
            }}
          >
            <Tooltip title={tips}>{v.label}</Tooltip>
            {(!projectStore.isClosed) && row.user_issue_perm.next_state_list.length > 0 && <a><EditOutlined /></a>}
          </div>
        );
      },
    },
    {
      title: "执行阶段",
      width: 100,
      align: 'left',
      dataIndex: "process_stage",
      render: (_, record: IssueInfo) => (
        <>
          {record.state == ISSUE_STATE_PROCESS && (
            <EditSelect editable={(!projectStore.isClosed) && (record.exec_user_id == userStore.userInfo.userId)}
              curValue={record.process_stage}
              itemList={[
                {
                  value: PROCESS_STAGE_TODO,
                  label: "未开始",
                  color: "black",
                },
                {
                  value: PROCESS_STAGE_DOING,
                  label: "执行中",
                  color: "black",
                },
                {
                  value: PROCESS_STAGE_DONE,
                  label: "待检查",
                  color: "black",
                },
              ]} showEditIcon={true} allowClear={false}
              onChange={async value => {
                return await updateProcessStage(userStore.sessionId, record.project_id, record.issue_id, value as PROCESS_STAGE);
              }} />
          )}
        </>
      ),
    },
    {
      title: `级别`,
      width: 100,
      align: 'left',
      dataIndex: ['extra_info', 'ExtraBugInfo', 'level'],
      render: (v: number, record: IssueInfo) => <EditSelect
        allowClear={false}
        editable={(!projectStore.isClosed) && record.user_issue_perm.can_update}
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
      align: 'left',
      render: (val: number, record: IssueInfo) => <EditSelect
        allowClear={false}
        editable={(!projectStore.isClosed) && record.user_issue_perm.can_update}
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
      align: 'left',
      ellipsis: true,
      dataIndex: ['extra_info', 'ExtraBugInfo', 'software_version'],
      hideInTable: getIsTask(pathname),
      render: (_, record: IssueInfo) => <EditText editable={(!projectStore.isClosed) && record.user_issue_perm.can_update}
        content={record.extra_info.ExtraBugInfo?.software_version ?? ""} showEditIcon={true} onChange={async (value) => {
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
      align: 'left',
      render: (_, row: IssueInfo) => <EditSelect
        allowClear={false}
        editable={(!projectStore.isClosed) && row.user_issue_perm.can_assign_exec_user}
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
      align: 'left',
      render: (_, row: IssueInfo) => <EditSelect
        allowClear={false}
        editable={(!projectStore.isClosed) && row.user_issue_perm.can_assign_check_user}
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
      title: "关注人",
      dataIndex: "",
      width: 140,
      align: 'left',
      render: (_, row: IssueInfo) => (
        <Space>
          {(row.watch_user_list ?? []).length == 0 && "-"}
          {(row.watch_user_list ?? []).map(item => (
            <div key={item.member_user_id} title={item.display_name}>
              <UserPhoto logoUri={item.logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "标签",
      dataIndex: ["basic_info", "tag_id_list"],
      width: 200,
      render: (_, row: IssueInfo) => (
        <EditTag editable={(!projectStore.isClosed) && row.user_issue_perm.can_update} tagIdList={row.basic_info.tag_id_list} tagDefList={tagDefList}
          onChange={(tagIdList: string[]) => {
            request(update_tag_id_list({
              session_id: userStore.sessionId,
              project_id: row.project_id,
              issue_id: row.issue_id,
              tag_id_list: tagIdList,
            })).then(() => {
              onChange(row.issue_id);
            });
          }} />
      ),
    },
    {
      title: '预估开始时间',
      dataIndex: 'start_time',
      width: 120,
      align: 'left',
      render: (_, record) => <EditDate
        editable={(!projectStore.isClosed) && (record.exec_user_id == userStore.userInfo.userId) && (record.state == ISSUE_STATE_PROCESS)}
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
      align: 'left',
      render: (_, record) => <EditDate
        editable={(!projectStore.isClosed) && (record.exec_user_id == userStore.userInfo.userId) && (record.state == ISSUE_STATE_PROCESS)}
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
      align: 'left',
      render: (_, record: IssueInfo) => <EditSelect
        allowClear={false}
        editable={(!projectStore.isClosed) && (record.exec_user_id == userStore.userInfo.userId) && (record.state == ISSUE_STATE_PROCESS)}
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
      align: 'left',
      render: (_, record: IssueInfo) => <EditSelect
        allowClear={true}
        editable={(!projectStore.isClosed) && (record.exec_user_id == userStore.userInfo.userId) && (record.state == ISSUE_STATE_PROCESS)}
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
      align: 'left',
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
      scroll={{ x: 1650, y: `${isFilter ? 'calc(100vh - 400px)' : 'calc(100vh - 340px)'}` }}
      dataSource={dataSource}
      pagination={false}
    />
  );
};

export default IssueEditList;
