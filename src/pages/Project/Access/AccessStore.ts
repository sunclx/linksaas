import * as API from '@/api/external_events';
import { makeAutoObservable, runInAction } from 'mobx';
import { request } from '@/utils/request';

class AccessStore {
  constructor() {
    makeAutoObservable(this);
  }
  // sessionId: string;
  externalList: API.EventSourceInfo[] = [];

  async createExternal(req: {
    eventSource: number;
    title: string;
    eventSourceId: string;
    secret: string;
    sessionId: string;
    projectId: string;
  }) {
    const resp = await API.create({
      session_id: req.sessionId,
      project_id: req.projectId,
      event_source: req.eventSource,
      title: req.title,
      event_source_id: req.eventSourceId,
      secret: req.secret,
    });
    if (resp) {
      alert('添加成功');
    }
  }
  //列出所有的第三方接入
  async getExternalList(sessionId: string, projectId: string) {
    const resp = await request(API.list(sessionId, projectId));
    runInAction(() => {
      if (resp.info_list) this.externalList = resp.info_list;
    });
  }
}

export default new AccessStore();
