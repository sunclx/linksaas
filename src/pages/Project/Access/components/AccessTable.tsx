import React from 'react';
import { Table, Tooltip } from 'antd';
import type * as API from '@/api/external_events';
import type { ColumnsType } from 'antd/es/table';
import { Link, useLocation } from 'react-router-dom';
import style from '../index.module.less';
import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib/icons';
import { APP_PROJECT_HOME_PATH, APP_PROJECT_KB_BOARD_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH, APP_PROJECT_WORK_PLAN_PATH } from '@/utils/constant';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';

const AccessTable: React.FC<{
  data: API.EventSourceInfo[];
  remove: (eventSourceId: string) => void;
}> = (props) => {
  const { pathname } = useLocation();

  const projectStore = useStores('projectStore');

  const columns: ColumnsType<API.EventSourceInfo> = [
    {
      title: '序号',
      key: 'order',
      render: (_text, _record, index: number) => index + 1,
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'title',
      width: 200,
      key: 'title',
      render: (text, record) => {
        let destPath = "";
        if (pathname.startsWith(APP_PROJECT_HOME_PATH)){
          destPath = APP_PROJECT_HOME_PATH + "/access/view";
        }else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
          destPath = APP_PROJECT_KB_DOC_PATH + '/access/view';
        }else if(pathname.startsWith(APP_PROJECT_KB_BOARD_PATH)){
          destPath = APP_PROJECT_KB_BOARD_PATH + '/access/view';
        } else if (pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
          destPath = APP_PROJECT_OVERVIEW_PATH + '/access/view';
        } else if (pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
          destPath = APP_PROJECT_WORK_PLAN_PATH + '/access/view';
        } else if (pathname.startsWith(APP_PROJECT_MY_WORK_PATH)) {
          destPath = APP_PROJECT_MY_WORK_PATH + '/access/view';
        }
        return <Link to={`${destPath}?event_source_id=${record.event_source_id}`}>{text}&nbsp;<LinkOutlined /></Link>;
      },
      ellipsis: false,
    },
    {
      title: '地址',
      dataIndex: 'event_source_url',
      key: 'event_source_url',
      ellipsis: false,
      width: 300,
    },
    {
      title: '用户映射',
      render: (_, record: API.EventSourceInfo) => {
        return (<span>{record.map_user_count}/{record.source_user_count}&nbsp;
          <Tooltip title={`有${record.source_user_count}个第三方系统账号，做了${record.map_user_count}个映射。只有映射后，才会在工作记录里面出现对应记录。`} trigger="click">
            <a><QuestionCircleOutlined /></a>
          </Tooltip></span>);
      }
    },
    {
      title: '消息数',
      dataIndex: 'total_event_count',
      key: 'total_event_count',
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, record) => (
        <div className={style.accessTableAction}>
          {(!projectStore.isClosed) && projectStore.isAdmin && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                props.remove(record.event_source_id);
              }}
            >
              删除
            </a>
          )}
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <Table
      className={style.accessTable}
      rowKey="event_source_id"
      columns={columns}
      dataSource={props.data}
      pagination={false}
    />
  );
};
export default observer(AccessTable);
