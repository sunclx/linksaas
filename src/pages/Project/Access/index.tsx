import React, { useEffect } from 'react';
import AccessTable from './components/AccessTable';
import { observer, useLocalObservable } from 'mobx-react';
import { message, Collapse } from 'antd';
import CardWrap from '@/components/CardWrap';
import style from './index.module.less';
import ExternalList from './components/ExternalList';
import * as API from '@/api/external_events';
import { request } from '@/utils/request';
import { platform } from './common';
import { CaretRightOutlined } from '@ant-design/icons';
import { useStores } from '@/hooks';

const { Panel } = Collapse;

interface ListItem extends Pick<API.EventSourceInfo, 'event_source_id' | 'event_source'> {
  icon: string;
  title: string;
  subList: API.EventSourceInfo[];
}

const ProjectInvite: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const localStore = useLocalObservable(() => ({
    externalList: [] as ListItem[],
    externalListTotal: 0,
    activeKey: [] as string[],
    setActiveKey(event_source_id: string) {
      const index = this.activeKey.findIndex((value) => value === event_source_id);

      if (index === -1) {
        this.activeKey.push(event_source_id);
      } else {
        this.activeKey.splice(index, 1);
      }

      this.activeKey = [...this.activeKey];
    },
    //列出所有的第三方接入
    setExternalList(resp: API.ListResponse) {
      this.externalListTotal = resp.info_list.length;
      this.activeKey = [];
      const map: Record<string, API.EventSourceInfo[]> = {};
      resp.info_list.forEach((item) => {
        if (map[item.event_source]) {
          map[item.event_source].push(item);
        } else {
          map[item.event_source] = [item];
        }
      });
      this.externalList = [];
      Object.keys(map).forEach((key) => {
        const platformItem = platform.find((item) => item.eventSource === Number(key));
        this.activeKey.push(map[key][0].event_source_id);
        this.externalList.push({
          subList: map[key],
          event_source_id: map[key][0].event_source_id,
          event_source: map[key][0].event_source,
          title: platformItem?.title || '',
          icon: platformItem?.icon || '',
        });
      });
    },
    async getExternalList() {
      const resp = await request(API.list(userStore.sessionId, projectStore.curProjectId));

      if (resp.info_list) this.setExternalList(resp);
    },
    async remove(eventSourceId: string) {
      const resp = await request(API.remove(userStore.sessionId, projectStore.curProjectId, eventSourceId));
      if (resp.code === 0) {
        message.success('删除成功');
        this.getExternalList();
      } else {
        message.success('删除失败');
      }
    },
  }));

  useEffect(() => {
    localStore.getExternalList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardWrap title="第三方接入">
      <div className={style.access}>
        <h3>快速接入</h3>
        <ExternalList
          sessionId={userStore.sessionId}
          projectId={projectStore.curProjectId}
          onChange={() => {
            localStore.getExternalList();
          }}
        />
        <h3>已接入（{localStore.externalListTotal}）</h3>
        <Collapse
          activeKey={localStore.activeKey}
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined style={{ color: '#A8ACB3' }} rotate={isActive ? 90 : 0} />
          )}
          className={style.collapse}
        >
          {localStore.externalList.map((item) => (
            <Panel
              header={
                <h4
                  className={style.header}
                  onClick={() => {
                    localStore.setActiveKey(item.event_source_id);
                  }}
                >
                  <img src={item.icon} alt="" />
                  <span className={style.title}>{item.title}</span>
                  <span className={style.count}>{item.subList.length}</span>
                </h4>
              }
              key={item.event_source_id}
              className={style.listBlock}
            >
              <AccessTable
                data={item.subList}
                remove={(eventSourceId) => {
                  localStore.remove(eventSourceId);
                }}
              />
            </Panel>
          ))}
        </Collapse>
      </div>
    </CardWrap>
  );
};
export default observer(ProjectInvite);
