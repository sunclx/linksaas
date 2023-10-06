import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import { runInAction } from 'mobx';
import CardWrap from '@/components/CardWrap';
import DetailsNav from '@/components/DetailsNav';
// import style from './index.module.less';
import UserTable from './components/UserTable';
import * as API from '@/api/external_events';
import { request } from '@/utils/request';
import { Divider, message, Input } from 'antd';
import style from './view.module.less';
import { clipboard } from '@tauri-apps/api';
import { platform } from './common';
import { useStores } from '@/hooks';

const ProjectAccessDetail: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const eventSourceId = urlParams.get('event_source_id');

  const localStore = useLocalObservable(() => ({
    info: {
      event_source_id: '',
      event_source: 0,
      title: '',
      project_id: '',
      project_name: '',
      create_time: 0,
      update_time: 0,
      create_user_id: '',
      event_source_url: '',
      source_user_count: 0,
      map_user_count: 0,
      total_event_count: 0,
    } as API.EventSourceInfo,
    isDisplaySecret: false,
    isEditTitle: false,
    secret: '',
    sourceUrl: '',
    sourceTitle: '',
    changeTitle(value: string) {
      this.info.title = value;
    },
    showSecret(value: boolean) {
      this.isDisplaySecret = value;
    },
    editTitle(value: boolean) {
      this.isEditTitle = value;
    },
    getSourceInfo(eventSource: number) {
      const result = platform.find((item) => item.eventSource === eventSource);
      if (result) {
        this.sourceUrl = result.icon;
        this.sourceTitle = result.title;
      }
    },
    async getData(session_id: string, project_id: string, event_source_id: string) {
      const resp = await request(API.get(session_id, project_id, event_source_id));
      runInAction(() => {
        if (resp.info) {
          this.info = resp.info;
          this.getSourceInfo(resp.info.event_source);
        }
      });
    },
    async getSecret(session_id: string, project_id: string, event_source_id: string) {
      const resp = await request(API.get_secret(session_id, project_id, event_source_id));

      runInAction(() => {
        if (resp) this.secret = resp.secret;
      });
    },
    async updateTitle(session_id: string, project_id: string, event_source_id: string) {
      this.editTitle(false);
      const resp = await request(
        API.update(session_id, project_id, event_source_id, this.info.title),
      );

      if (resp.code === 0) {
        message.success('更新成功!');
      }
    },
  }));

  useEffect(() => {
    if (eventSourceId) {
      localStore.getData(userStore.sessionId, projectStore.curProjectId, eventSourceId);
    } else {
      throw Error('url参数不正确');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardWrap>
      <DetailsNav title="第三方接入" />
      <div className={style.content}>
        <div className={style.info}>
          <div className={style.row}>
            <span className={style.label}>平台</span>
            <span className={style.value}>
              {localStore.sourceUrl && <img src={localStore.sourceUrl} alt="" />}
              {localStore.sourceTitle}
            </span>
          </div>
          <div className={style.row}>
            <span className={style.label}>名称</span>
            {!localStore.isEditTitle ? (
              <span className={style.value}>{localStore.info.title}</span>
            ) : (
              <Input
                style={{ width: '300px' }}
                value={localStore.info.title}
                onChange={(e) => {
                  localStore.changeTitle(e.target.value);

                  console.log(e);
                }}
                onBlur={() => {
                  if (eventSourceId) localStore.updateTitle(userStore.sessionId, projectStore.curProjectId, eventSourceId);
                }}
              />
            )}
            {(!projectStore.isClosed) && (
              <span
                className={style.edit}
                onClick={() => {
                  localStore.editTitle(true);
                }}
              >
                编辑
              </span>
            )}
          </div>
          <div className={style.row}>
            <span className={style.label}>地址</span>
            <span className={style.value}>{localStore.info.event_source_url}</span>
            <span
              className={style.copy}
              onClick={() => {
                clipboard.writeText(localStore.info.event_source_url);
                message.success('复制成功！');
              }}
            >
              复制
            </span>
          </div>
          <div className={style.row}>
            <span className={style.label}>密钥</span>
            {localStore.isDisplaySecret ? (
              <span className={style.value}>{localStore.secret}</span>
            ) : (
              <span className={style.value}>******************************</span>
            )}
            <span
              className={style.copy}
              onClick={() => {
                if (localStore.secret === '') {
                  if (eventSourceId && localStore.secret === '') {
                    localStore.getSecret(userStore.sessionId, projectStore.curProjectId, eventSourceId).then(() => {
                      clipboard.writeText(localStore.secret);
                      message.success('复制成功！');
                    });
                  }
                } else {
                  clipboard.writeText(localStore.secret);
                  message.success('复制成功！');
                }
              }}
            >
              复制
            </span>
            {!localStore.isDisplaySecret ? (
              <span
                className={style.watch}
                onClick={() => {
                  if (eventSourceId && localStore.secret === '')
                    localStore.getSecret(userStore.sessionId, projectStore.curProjectId, eventSourceId);
                  localStore.showSecret(true);
                }}
              >
                查看
              </span>
            ) : (
              <span
                className={style.hide}
                onClick={() => {
                  localStore.showSecret(false);
                }}
              >
                隐藏
              </span>
            )}
          </div>
        </div>
        <Divider />
        <h3>
          用户列表
          <span>
            ({localStore.info.map_user_count}/{localStore.info.source_user_count})
          </span>
        </h3>
        {eventSourceId && <UserTable eventSourceId={eventSourceId} />}
      </div>
    </CardWrap>
  );
};
export default observer(ProjectAccessDetail);
