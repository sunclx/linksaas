import React, { useEffect } from 'react';
import { Table, Select } from 'antd';
import { useStores } from '@/hooks';
import type { ColumnsType } from 'antd/es/table';
//import style from '../index.module.less';
import { runInAction } from 'mobx';
import * as API from '@/api/external_events';
import { request } from '@/utils/request';
import { observer, useLocalObservable } from 'mobx-react';
const { Option } = Select;

const UserTable: React.FC<{
  eventSourceId: string;
}> = (props) => {
  const { eventSourceId } = props;
  const memberStore = useStores('memberStore');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const localStore = useLocalObservable(() => ({
    list: [] as API.SourceUserInfo[],
    async getData(session_id: string, project_id: string, event_source_id: string) {
      const listSourceUser = await request(
        API.list_source_user(session_id, project_id, event_source_id),
      );

      runInAction(() => {
        this.list = listSourceUser.info_list || [];
      });
    },
    async seSourceUserPolicy(res: API.SetSourceUserPolicyRequest) {
      const resp = await request(API.set_source_user_policy(res));
      if (resp) this.getData(userStore.sessionId, projectStore.curProjectId, eventSourceId);
    },
  }));

  const columns: ColumnsType<API.SourceUserInfo> = [
    {
      title: '序号',
      key: 'order',
      render: (_text, _record, index: number) => index + 1,
      width: 100,
    },
    {
      title: '账号',
      dataIndex: 'source_display_name',
      key: 'source_display_name',
    },
    {
      title: '内部账号关联',
      dataIndex: 'map_user_display_name',
      key: 'map_user_display_name',
      render: (text, record) => {
        let dValue: string | number = record.user_policy;
        if (record.user_policy === API.SOURCE_USER_POLICY_MAPPING)
          dValue = `${API.SOURCE_USER_POLICY_MAPPING},${record.map_user_id}`;

        return (
          <Select
            value={dValue}
            disabled={projectStore.isClosed}
            onChange={(value: number | string) => {
              console.log(typeof value);
              if (typeof value === 'string') {
                console.log(value);
                console.log(value.split(','));
                const valueAry = value.split(',');
                localStore.seSourceUserPolicy({
                  session_id: userStore.sessionId,
                  project_id: projectStore.curProjectId,
                  event_source_id: eventSourceId as string,
                  source_user_name: record.source_user_name,
                  user_policy: Number(valueAry[0]),
                  map_user_id: valueAry[1],
                });
              } else {
                localStore.seSourceUserPolicy({
                  session_id: userStore.sessionId,
                  project_id: projectStore.curProjectId,
                  event_source_id: eventSourceId as string,
                  source_user_name: record.source_user_name,
                  user_policy: value,
                  map_user_id: '',
                });
              }
            }}
            style={{ width: '110px' }}
          >
            <Option value={API.SOURCE_USER_POLICY_NONE}>未设置策略</Option>
            <Option value={API.SOURCE_USER_POLICY_SKIP_MAPPING}>不记名</Option>
            <Option value={API.SOURCE_USER_POLICY_DISCARD}>丢弃</Option>
            {memberStore.memberList.map((item) => (
              <Option
                key={item.member.member_user_id}
                value={`${API.SOURCE_USER_POLICY_MAPPING},${item.member.member_user_id}`}
              >
                {item.member.display_name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '消息数',
      dataIndex: 'total_event_count',
      key: 'total_event_count',
      render: (text, record) => {
        if (record.user_policy === API.SOURCE_USER_POLICY_DISCARD) {
          return '*记录丢弃不存';
        }
        return text;
      },
    },
  ];

  useEffect(() => {
    if (eventSourceId) {
      (async () => {
        await localStore.getData(userStore.sessionId, projectStore.curProjectId, eventSourceId);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSourceId, userStore.sessionId, projectStore.curProjectId]);

  return (
    <Table
      rowKey="source_display_name"
      columns={columns}
      dataSource={localStore.list}
      pagination={false}
    />
  );
};
export default observer(UserTable);
