import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import style from './index.module.less';
import * as API from '@/api/events';
import { request } from '@/utils/request';
import CardWrap from '@/components/CardWrap';
import EventCom from '@/components/EventCom';
import MemberSelect from '@/components/MemberSelect';
import Calendar from './components/Calendar';
import { timeToDateString } from '@/utils/utils';
import moment from 'moment';
import { Collapse, Modal, Input, message, Space, Popover } from 'antd';
import { CaretRightOutlined, MoreOutlined } from '@ant-design/icons';
import { PLATFORM } from './common';
import { useStores } from '@/hooks';
import { runInAction } from 'mobx';
import { useHistory, useLocation } from 'react-router-dom';
import type { LinkEventState } from '@/stores/linkAux';
import UserPhoto from '@/components/Portrait/UserPhoto';
import Button from '@/components/Button';

const { Panel } = Collapse;

interface RecordListItem
  extends Pick<
    API.PluginEvent,
    'user_id' | 'cur_user_display_name' | 'cur_logo_uri'
  > {
  subList: API.PluginEvent[];
}

type RecordType = RecordListItem & {
  count: Record<number, number>;
  addonInfo?: API.DayAddonInfo;
};

const ProjectRecord: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const linkAuxStore = useStores('linkAuxStore');

  const history = useHistory();
  const location = useLocation();
  const state: LinkEventState | undefined = location.state as LinkEventState | undefined;

  const localStore = useLocalObservable(() => ({
    totalCount: 0,
    showAddon: false,
    date: state === undefined ? moment() : moment(state.eventTime),
    memberUserId: state === undefined ? '' : state.memberUserId,
    myDayAddonContent: '',
    myDayAddonVersion: 0,
    activeKey: [] as string[],
    recordList: [] as RecordType[],
    setActiveKey(user_id: string) {
      const index = this.activeKey.findIndex((value) => value === user_id);

      if (index === -1) {
        this.activeKey.push(user_id);
      } else {
        this.activeKey.splice(index, 1);
      }

      this.activeKey = [...this.activeKey];
    },
    initRecord() {
      this.totalCount = 0;
      this.recordList = [];
    },
    mapUserRecordList(data: API.PluginListProjectEventResponse) {
      this.totalCount = data.total_count;
      this.activeKey = [];
      const map: Record<string, API.PluginEvent[]> = {};
      const eventTypeMap: Record<string, Record<number, number>> = {};
      data.event_list.forEach((item) => {
        if (map[item.user_id]) {
          map[item.user_id].push(item);
          if (item.event_type < 99) {
            eventTypeMap[item.user_id][0] = eventTypeMap[item.user_id][0]
              ? eventTypeMap[item.user_id][0] + 1
              : 1;
          } else {
            eventTypeMap[item.user_id][item.event_type] = eventTypeMap[item.user_id][
              item.event_type
            ]
              ? eventTypeMap[item.user_id][item.event_type] + 1
              : 1;
          }
        } else {
          map[item.user_id] = [item];
          eventTypeMap[item.user_id] = {
            [item.event_type < 99 ? 0 : item.event_type]: 1,
          };

          this.activeKey.push(item.user_id);
        }
      });
      const addonMap: Record<string, API.DayAddonInfo> = {};
      data.day_addon_list.forEach((item) => {
        addonMap[item.user_id] = item;
      });
      Object.keys(map).forEach((key) => {
        this.recordList.push({
          subList: map[key],
          user_id: map[key][0].user_id,
          cur_user_display_name: map[key][0].cur_user_display_name,
          cur_logo_uri: map[key][0].cur_logo_uri,
          count: eventTypeMap[key],
          addonInfo: addonMap[key],
        });
      });
      //处理只有补充内容的用户
      data.day_addon_list.forEach(item => {
        if (this.recordList.findIndex(r => r.user_id == item.user_id) == -1) {
          this.recordList.push({
            subList: [],
            user_id: item.user_id,
            cur_user_display_name: item.user_display_name,
            cur_logo_uri: item.user_logo_uri,
            count: {},
            addonInfo: item,
          });
          this.activeKey.push(item.user_id);
        }
      });
    },
    //列出项目维度事件
    async getRecordList() {
      this.initRecord();
      const resp = await request(
        API.list_project_event({
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          member_user_id: localStore.memberUserId,
          filter_by_member_user_id: localStore.memberUserId !== '',
          from_time: localStore.date.startOf('day').valueOf(),
          to_time: localStore.date.endOf('day').valueOf(),
          offset: 0,
          limit: 999,
        }),
      );
      if (resp) {
        this.mapUserRecordList(resp);
      }
    },
  }));

  useEffect(() => {
    localStore.getRecordList();
    projectStore.clearNewEventCount(projectStore.curProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStore.memberUserId, localStore.date, localStore.myDayAddonVersion]);

  return (
    <CardWrap title='工作记录' extra={
      <Space>
        <Button
          type="primary"
          disabled={moment().diff(localStore.date) > 7 * 24 * 3600 * 1000}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            request(
              API.get_day_addon_info({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                day: parseInt(localStore.date.format('YYYYMMDD')),
              }),
            ).then((res) => {
              localStore.myDayAddonContent = res.info.content;
              localStore.showAddon = true;
            });
          }}
        >
          补充工作记录
        </Button>
        {projectStore.isAdmin && (
          <Popover trigger="click" placement='bottom' content={
            <div style={{ padding: "10px 10px" }}>
              <Button className={style.subscribe_btn} type="link" onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                linkAuxStore.goToEventSubscribeList(history);
              }}>研发事件订阅</Button>
            </div>
          }>
            <MoreOutlined />
          </Popover>
        )}

      </Space>
    }>
      <div style={{ margin: "0px 20px" }}>
        <div className={style.header}>
          <Calendar
            sessionId={userStore.sessionId}
            projectId={projectStore.curProjectId}
            currentDate={localStore.date}
            memberUserId={localStore.memberUserId}
            onChange={(date) => {
              runInAction(() => {
                localStore.date = moment(date);
              });
            }}
          />

          <MemberSelect
            all
            onChange={(e) => {
              runInAction(() => {
                localStore.memberUserId = e;
              });
            }}
            label={'操作用户'}
          />
        </div>

        <Collapse
          activeKey={localStore.activeKey}
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined style={{ color: '#A8ACB3' }} rotate={isActive ? 90 : 0} />
          )}
          className={style.recordList}
        >
          {localStore.recordList.map((item) => (
            <Panel
              header={
                <div
                  onClick={() => {
                    localStore.setActiveKey(item.user_id);
                  }}
                  className={style.userInfo}
                >
                  <UserPhoto logoUri={item.cur_logo_uri ?? ''} />
                  <span className={style.name}>{item.cur_user_display_name}</span>
                  <span className={style.countList}>
                    {Object.keys(item.count).map((key) => (
                      <span key={key}>
                        <img
                          className={style.icon}
                          src={Number(key) > 99 ? PLATFORM[key]?.icon : PLATFORM[0]?.icon}
                          alt=""
                        />
                        {item.count[key]}
                      </span>
                    ))}
                  </span>
                </div>
              }
              key={item.user_id}
            >
              <div className={style.record}>
                {item.subList.map((item2) => (
                  <div className={style.recordItem} key={item2.event_id}>
                    <EventCom
                      key={item2.event_id}
                      item={item2}
                      skipProjectName={true}
                      skipLink={false}
                      showMoreLink={false}
                      showSource={true}
                    >
                      <img
                        className={style.icon}
                        src={
                          item2.event_type > 99
                            ? PLATFORM[item2.event_type]?.icon
                            : PLATFORM[0]?.icon
                        }
                        alt=""
                      />
                      <span className={style.time}>{timeToDateString(item2.event_time)}</span>
                      <span>{item2.user_display_name}</span>
                    </EventCom>
                  </div>
                ))}
                {item.addonInfo && (
                  <div className={style.extInfo}>
                    <h3 className={style.title}>补充工作记录:</h3>
                    <div className={style.content}>
                      <pre>
                        {item.addonInfo.content}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
      {localStore.showAddon && (
        <Modal
          title={`补充${localStore.date.format('YYYY年MM月DD日')}工作记录`}
          open
          onOk={(e) => {
            e.stopPropagation();
            e.preventDefault();
            request(
              API.set_day_addon_info({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                day: parseInt(localStore.date.format('YYYYMMDD')),
                content: localStore.myDayAddonContent,
              }),
            ).then(() => {
              message.success('补充工作记录成功');
              localStore.showAddon = false;
              localStore.myDayAddonVersion += 1;
            });
          }}
          onCancel={(e) => {
            e.stopPropagation();
            e.preventDefault();
            localStore.showAddon = false;
          }}
        >
          <Input.TextArea
            rows={10}
            defaultValue={localStore.myDayAddonContent}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              localStore.myDayAddonContent = e.target.value;
            }}
          />
        </Modal>
      )}
    </CardWrap>
  );
};
export default observer(ProjectRecord);
