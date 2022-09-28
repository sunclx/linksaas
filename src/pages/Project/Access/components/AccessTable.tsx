import React from 'react';
import { Table } from 'antd';
import type * as API from '@/api/external_events';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import style from '../index.module.less';
import { APP_PROJECT_PATH } from '@/utils/constant';

const AccessTable: React.FC<{
  data: API.EventSourceInfo[];
  remove: (eventSourceId: string) => void;
}> = (props) => {
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
      key: 'title',
      render: (text, record) => {
        // let destPath = '';
        // if (location.pathname.includes(APP_PROJECT_PATH)) {
        //   destPath = APP_PROJECT_PATH + '/access/view';
        // } else if (location.pathname.includes(APP_PROJECT_DOC_PATH)) {
        //   destPath = APP_PROJECT_DOC_PATH + '/access/view';
        // } else if (location.pathname.includes(APP_PROJECT_DOC_CB_PATH)) {
        //   destPath = APP_PROJECT_DOC_CB_PATH + '/access/view';
        // }
        const destPath = APP_PROJECT_PATH + '/access/view';
        return <Link to={`${destPath}?event_source_id=${record.event_source_id}`}>{text}</Link>;
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
      title: '用户数',
      dataIndex: 'source_user_count',
      key: 'source_user_count',
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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              props.remove(record.event_source_id);
            }}
          >
            删除
          </a>
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
export default AccessTable;
