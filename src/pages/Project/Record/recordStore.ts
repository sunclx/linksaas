import * as API from '@/api/events';
import { makeAutoObservable, runInAction } from 'mobx';
import { request } from '@/utils/request';
import { get_simple_content } from '@/api/event_type';

class AccessStore {
  constructor() {
    makeAutoObservable(this);
  }
  // sessionId: string;
  totalCount = 0;
  eventList: string[] = [];
  //列出项目维度额事件
  async listProjectEvent(req: API.ListProjectEventRequest) {
    const resp = await request(API.list_project_event(req));
    if (resp) {
      runInAction(() => {
        this.totalCount = resp.total_count;
        this.eventList = resp.event_list.map((item) => {
          const eventCont = get_simple_content(item, true);
          console.log(eventCont);
          return '1111';
        });
      });
    }
  }
  updateList() // newList: [
  //   {
  //     time: number;
  //     name: string;
  //     title: string;
  //   },
  // ],
  {
    // this.list = this.list.concat(newList);
  }
}

export default new AccessStore();
