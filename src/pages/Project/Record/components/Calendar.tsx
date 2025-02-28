import React, { useEffect, useState } from 'react';
import style from './calendar.module.less';
import { Calendar as AntdCalendar, DatePicker, Space } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import * as API from '@/api/events';
import { request } from '@/utils/request';
import { observer, useLocalObservable } from 'mobx-react';
import { EVENT_ICON_LIST } from '../common';

const Calendar: React.FC<{
  type?: string;
  sessionId: string;
  projectId: string;
  memberUserId: string;
  currentDate: Moment;
  onChange: (date: Moment) => void;
}> = (props) => {
  const [updater, setUpdater] = useState(0);
  const localStore = useLocalObservable(() => ({
    sessionId: '',
    projectId: '',
    memberUserId: '',
    currentDate: moment(),
    isShowCalendar: false,
    //  currentDate: props.value,
    statusList: {} as Record<string, { count: number; event_type: number }[]>,
    updateProps(nextProps: {
      sessionId: string;
      projectId: string;
      memberUserId: string;
      currentDate: Moment;
    }) {
      this.sessionId = nextProps.sessionId;
      this.projectId = nextProps.projectId;
      this.memberUserId = nextProps.memberUserId;
      this.currentDate = nextProps.currentDate;
    },
    toggleCalendar() {
      this.isShowCalendar = !this.isShowCalendar;
    },
    //列出项目维度额事件
    async listProjectEvent(date?: Moment) {
      const pDate = date || this.currentDate;
      if (date) props.onChange(date);

      const fromDay = moment(pDate).startOf('month').subtract(1, 'months').format('YYYYMMDD');
      const toDay = moment(pDate).endOf('month').subtract(-1, 'months').format('YYYYMMDD');

      const resp = await request(
        API.list_project_day_status({
          from_day: Number(fromDay),
          to_day: Number(toDay),
          session_id: this.sessionId,
          project_id: this.projectId,
          filter_by_member_user_id: this.memberUserId === '' ? false : true,
          member_user_id: this.memberUserId,
        }),
      );
      if (resp) this.updateStatusList(resp.status_item_list);
    },
    selectDate(date: Moment) {
      this.toggleCalendar();
      props.onChange(date);
    },
    updateStatusList(list: API.DayEventStatusItem[]) {
      const map: Record<string, { count: number; event_type: number }[]> = {};
      list.forEach(({ count, day, event_type }) => {
        if (map[day]) {
          map[day].push({ count, event_type });

        } else {
          map[day] = [{ count, event_type }];
        }
      });

      this.statusList = map;
      setUpdater((prev) => prev + 1);
    },
    updateDate(n: 1 | -1 | -7 | 7) {
      props.onChange(this.currentDate.add(n, 'days'));
    },
  }));

  useEffect(() => {
    localStore.updateProps(props);
  }, [props, localStore]);

  useEffect(() => {
    if (localStore.isShowCalendar) localStore.listProjectEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStore.isShowCalendar]);

  return (
    <div className={style.component}>
      <div className={style.canlendarBtn}>
        <div
          className={style.prev}
          onClick={() => {
            localStore.updateDate(-1);
          }}
        />
        <div
          className={style.value}
          onClick={() => {
            localStore.toggleCalendar();
          }}
        >
          {localStore.currentDate.format('YYYY年MM月DD日')}
        </div>
        {localStore.currentDate.isAfter(Date.now()) ? (
          <div className={style.next} style={{ opacity: '0.5', cursor: "default" }} />
        ) : (
          <div
            className={style.next}
            onClick={() => {
              localStore.updateDate(1);
            }}
          />
        )}
      </div>
      {localStore.isShowCalendar && (
        <div
          className={style.modelMask}
          onClick={() => {
            localStore.toggleCalendar();
          }}
        >
          <div
            className={style.model}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <AntdCalendar
              key={updater}
              value={localStore.currentDate}
              disabledDate={(date) => {
                const day = date.format("YYYY-MM-DD");
                const curDay = moment().format("YYYY-MM-DD");
                return day > curDay;
              }}
              onPanelChange={(date) => {
                localStore.listProjectEvent(date);
              }}
              mode='month'
              headerRender={() => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Space style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <DatePicker value={localStore.currentDate} picker="month"
                      onChange={value => {
                        if (value != null) {
                          localStore.listProjectEvent(value);
                        }
                      }} />
                  </Space>
                </div>
              )}
              dateFullCellRender={(date) => {
                // if (date.get('month') != currentDate.get('month')) {
                //   return null;
                // }

                const fData = localStore.statusList[date.format('YYYYMMDD')];

                return (
                  <div
                    className="ant-picker-cell-inner ant-picker-calendar-date"
                    onClick={() => {
                      localStore.selectDate(date);
                    }}
                  >
                    <div className="ant-picker-calendar-date-value">{date.get('date')}</div>
                    <div className="ant-picker-calendar-date-content">
                      {fData?.map((item) => (
                        <div key={item.event_type} className={style.event}>
                          <img src={EVENT_ICON_LIST[item.event_type]?.icon} alt="" />
                          {item.count}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(Calendar);
