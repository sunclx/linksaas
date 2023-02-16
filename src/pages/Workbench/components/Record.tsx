import { list_user_event } from '@/api/events';
import EventCom from '@/components/EventCom';
import { request } from '@/utils/request';
import { timeToDateString } from '@/utils/utils';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import style from './record.module.less';
import moment from 'moment';
import type * as API from '@/api/events';
import { PLATFORM } from '@/pages/Project/Record/common';
import { useStores } from '@/hooks';
import { Empty } from 'antd';

const Record: FC = () => {
  const [, setTotalCount] = useState(0);
  const userStore = useStores('userStore');

  const [recordList, setRecordList] = useState<Record<string, API.PluginEvent[]>>({});
  const getList = async () => {
    const resp = await request(
      list_user_event(
        userStore.sessionId,
        moment().add('days', -3).valueOf(),
        moment().endOf('day').valueOf(),
        0,
        999,
      ),
    );
    if (resp) {
      setTotalCount(resp.total_count);
      const map: Record<string, API.PluginEvent[]> = {};
      resp.event_list.forEach((item) => {
        if (map[item.project_name]) {
          map[item.project_name].push(item);
        } else {
          map[item.project_name] = [item];
        }
      });
      setRecordList(map);
    }
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.recordList}>
      {Object.entries(recordList).length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      {Object.entries(recordList)
        .reverse()
        .map((item) => (
          <div key={item[0]}>
            <div className={style.project_name}>{item[0]}</div>
            <div className={style.record}>
              {item[1].reverse().map((item2) => (
                <div className={style.recordItem} key={item2.event_id}>
                  <EventCom key={item2.event_id} item={item2} skipProjectName={true} skipLink={false} showMoreLink={false}>
                    <img
                      className={style.icon}
                      src={
                        item2.event_type > 99 ? PLATFORM[item2.event_type]?.icon : PLATFORM[0]?.icon
                      }
                      alt=""
                    />
                    <span className={style.time}>{timeToDateString(item2.event_time)}</span>
                  </EventCom>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Record;
