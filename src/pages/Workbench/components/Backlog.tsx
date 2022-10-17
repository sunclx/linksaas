import type { ExtraBugInfo, ExtraTaskInfo, IssueInfo, ListResponse } from '@/api/project_issue';
import { list_my_todo } from '@/api/project_issue';
import {
  SORT_KEY_UPDATE_TIME,
  SORT_TYPE_DSC,
  ISSUE_STATE_PLAN,
  ISSUE_STATE_PROCESS,
  ISSUE_STATE_CHECK,
  ISSUE_STATE_CLOSE,
  ISSUE_TYPE_TASK,
} from '@/api/project_issue';
import RenderSelectOpt from '@/components/RenderSelectOpt';
import {
  bugPriority,
  issueState,
  ISSUE_STATE_COLOR_ENUM,
  taskPriority,
} from '@/utils/constant';
import { issueTypeIsTask, timeToDateString, getIssueViewUrl } from '@/utils/utils';
import { Empty, Table } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import Pagination from '@/components/Pagination';
import { request } from '@/utils/request';
import msgIcon from '@/assets/allIcon/msg-icon.png';
import type { PageOptType } from '@/pages/Project/Task';
import { debounce } from 'lodash';
import { get_issue_type_str } from '@/api/event_type';
import type { ColumnsType } from 'antd/lib/table';
import { useStores } from '@/hooks';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import type { LinkIssueState } from '@/stores/linkAux';
import { observer } from 'mobx-react';
import { showShortNote } from '@/utils/short_note';
import { SHORT_NOTE_TASK, SHORT_NOTE_BUG } from '@/api/short_note';
import { ExportOutlined, LinkOutlined } from '@ant-design/icons/lib/icons';


type BacklogProps = {
  pageOpt: Partial<PageOptType>;
  setPageOpt: (querys: Partial<PageOptType>) => void;
};

const Backlog: FC<BacklogProps> = ({ pageOpt, setPageOpt }) => {
  const [dataSource, setDataSource] = useState<IssueInfo[]>([]);
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const { push } = useHistory();
  const { pathname } = useLocation();

  const getList = async (size?: number) => {
    const pageSize = size || pageOpt.pageSize;
    const data = {
      session_id: userStore.sessionId,
      sort_type: SORT_TYPE_DSC, // SORT_TYPE_DSC SORT_TYPE_ASC
      sort_key: SORT_KEY_UPDATE_TIME,
      offset: (pageOpt.pageNum! - 1) * pageSize!,
      limit: pageSize!,
    };

    try {
      const res = await request<ListResponse>(list_my_todo(data));
      setPageOpt({
        total: res.total_count,
      });
      setDataSource(res.info_list);
    } catch (error) { }
  };

  const getListType = () => {
    const node: HTMLElement = document.getElementById('backlog')!;
    if (node) {
      const size = Math.floor(node.parentElement!.clientHeight / 46 - 2);
      if (size < 1) return;
      setPageOpt({
        pageSize: size,
      });
      getList(size);
      return;
    }
  };

  useEffect(() => {
    getListType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOpt?.pageNum]);

  useEffect(() => {
    window.addEventListener('resize', debounce(getListType, 1000));
    return () => {
      removeEventListener('resize', debounce(getListType, 1000));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const renderTitle = (row: IssueInfo) => {
    return (
      <div>
        <a onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          projectStore.setCurProjectId(row.project_id);
          push(getIssueViewUrl(pathname), {
            issueId: row.issue_id,
            mode: "details",
            content: "",
          } as LinkIssueState);
        }}><span><LinkOutlined />{row.basic_info?.title}</span></a>
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
        {v.label}
      </div>
    );
  };

  const renderName = (id: string, name: string) => {
    if (!id) return '-';
    const isCurrentUser = id === userStore.userInfo.userId;
    return isCurrentUser ? <span style={{ color: 'red' }}>{name}</span> : <span>{name}</span>;
  };

  const renderManHour = (has: boolean, v: number) => {
    return has ? v / 60 + 'h' : '-';
  };

  const renderEndTime = (has: boolean, v: number) => {
    if (!has) return '-';
    const isPast = v < moment().startOf('days').valueOf();
    return isPast ? (
      <span style={{ color: 'red' }}>{timeToDateString(v, 'YYYY-MM-DD')}</span>
    ) : (
      <span>{timeToDateString(v, 'YYYY-MM-DD')}</span>
    );
  };

  const getExtraInfoType = (row: IssueInfo): ExtraTaskInfo | ExtraBugInfo | undefined => {
    const isTack = issueTypeIsTask(row);
    return isTack ? row.extra_info.ExtraTaskInfo : row.extra_info.ExtraBugInfo;
  };

  const columns: ColumnsType<IssueInfo> = [
    {
      title: `类别`,
      dataIndex: 'issue_type',
      width: 100,
      render: (v: number) => {
        return get_issue_type_str(v);
      },
    },
    {
      title: `名称`,
      ellipsis: true,
      dataIndex: ['basic_info', 'title'],
      width: 150,
      render: (v: string, row: IssueInfo) => renderTitle(row),
    },
    {
      title: "桌面便签",
      width: 70,
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
      title: '优先级',
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
      title: `阶段`,
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
      render: (v: string, row: IssueInfo) => renderName(row.exec_user_id, v),
    },
    {
      title: '验收人',
      dataIndex: 'check_display_name',
      width: 100,
      align: 'center',
      render: (v: string, row: IssueInfo) => renderName(row.check_user_id, v),
    },
    {
      title: '剩余工时',
      dataIndex: 'remain_minutes',
      width: 100,
      align: 'center',
      render: (v: number, record: IssueInfo) => renderManHour(record.has_remain_minutes, v),
    },
    {
      title: '预估工时',
      dataIndex: 'estimate_minutes',
      width: 100,
      align: 'center',
      render: (v: number, record: IssueInfo) => renderManHour(record.has_estimate_minutes, v),
    },
    {
      title: '预估完成时间',
      dataIndex: 'end_time',
      width: 120,
      align: 'center',
      render: (v: number, record: IssueInfo) => renderEndTime(record.has_end_time, v),
    },
    {
      title: '所属项目',
      dataIndex: 'create_display_name',
      width: 150,
      align: 'center',
    },
  ];

  return (
    <div id="backlog">
      {dataSource.length ? (
        <>
          <Table
            style={{ marginTop: '8px' }}
            rowKey={'issue_id'}
            columns={columns}
            scroll={{ x: 100 }}
            dataSource={dataSource}
            pagination={false}
          />
          <Pagination
            total={pageOpt.total!}
            pageSize={pageOpt.pageSize!}
            current={pageOpt.pageNum}
            onChange={(page: number) => setPageOpt({ pageNum: page })}
          />
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default observer(Backlog);
