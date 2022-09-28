import { useStores } from '@/hooks';
import { Table } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import React from 'react';
import type { ProjectInfo } from '@/api/project';
import { useHistory } from 'react-router-dom';
import { APP_PROJECT_PATH } from '@/utils/constant';
import type { ColumnsType } from 'antd/lib/table';
import { observer } from 'mobx-react';

const Myproject: FC = () => {
  const projectStore = useStores('projectStore');
  const { push } = useHistory();

  useEffect(() => {
    // projectStore.callProjectList();
  }, []);

  const columns: ColumnsType<ProjectInfo> = [
    {
      title: `类别`,
      dataIndex: ['basic_info', 'project_name'],
      ellipsis: true,
      width: 160,
    },
    {
      title: `项目状态`,
      dataIndex: ['closed'],
      sorter: {
        compare: (a: { closed: boolean }, b: { closed: boolean }) => {
          return (a.closed ? 0 : 1) - (b.closed ? 0 : 1);
        },
      },
      width: 100,
      align: 'center',

      render: (v: boolean) => (
        <div
          style={{
            color: `${v ? '#ccc' : '#38CB80'}`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              background: `${v ? '#ccc' : '#38CB80'}`,
              borderRadius: ' 50%',
              marginRight: '5px',
            }}
          />
          {v ? '已结束' : '进行中'}
        </div>
      ),
    },
    {
      title: `操作`,
      width: 80,
      align: 'center',
      render: (record: ProjectInfo) => {
        return (
          <a
            onClick={() => {
              projectStore.setCurProjectId(record.project_id);
              push(APP_PROJECT_PATH);
            }}
          >
            查看
          </a>
        );
      },
    },
  ];
  return (
      <Table
        style={{ marginTop: '8px' }}
        rowKey={'project_id'}
        columns={columns}
        dataSource={projectStore.projectList}
        pagination={false}
      />
  );
};

export default observer(Myproject);
