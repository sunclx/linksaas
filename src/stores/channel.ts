import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from '.';
import { request } from '@/utils/request';
import {
  list as list_channel,
  list_by_admin as list_channel_by_admin,
  get_channel,
  list_read_msg_stat,
  get_read_msg_stat
} from '@/api/project_channel';
import type { ChannelInfo, LIST_CHAN_SCOPE } from '@/api/project_channel';
import { LIST_CHAN_SCOPE_INCLUDE_ME, LIST_CHAN_SCOPE_WITHOUT_ME, LIST_CHAN_SCOPE_ORPHAN } from '@/api/project_channel';

/*
 * 只保存当前项目的频道列表
 */

export enum CHANNEL_STATE {
  CHANNEL_STATE_ALL,
  CHANNEL_STATE_OPEN,
  CHANNEL_STATE_CLOSE,
}

export class WebChannelInfo {
  channelInfo: ChannelInfo;
  unreadMsgCount: number;
  constructor(channelInfo: ChannelInfo, unreadMsgCount: number) {
    this.channelInfo = channelInfo;
    this.unreadMsgCount = unreadMsgCount;
    makeAutoObservable(this);
  }
};

class ChannelStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  rootStore: RootStore;
  //当前频道
  private _curChannelId: string = '';
  //当前项目全部频道
  private _channelList: WebChannelInfo[] = [];
  private _channelMap: Map<string, WebChannelInfo> = new Map();
  private _channelScope: LIST_CHAN_SCOPE = LIST_CHAN_SCOPE_INCLUDE_ME;
  filterChanelState = CHANNEL_STATE.CHANNEL_STATE_ALL;


  get channelScope(): LIST_CHAN_SCOPE {
    return this._channelScope;
  }

  get channelList(): WebChannelInfo[] {
    return this._channelList;
  }

  set curChannelId(val: string) {
    if (val != "" && val != this._curChannelId) {
      runInAction(() => {
        this._curChannelId = val;
        this.rootStore.channelMemberStore.loadChannelMemberList(this.rootStore.projectStore.curProjectId, val);
        this.rootStore.chatMsgStore.loadMsg(this.rootStore.projectStore.curProjectId, val);
      });
    }
  }
  get curChannelId(): string {
    return this._curChannelId;
  }

  get curChannel(): WebChannelInfo | undefined {
    return this._channelMap.get(this._curChannelId);
  }

  get filterChannelList(): WebChannelInfo[] {
    let retList: WebChannelInfo[] = [];
    if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_ALL) {
      retList = this._channelList.map(item => item);
    } else if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_OPEN) {
      retList = this._channelList.filter(item => item.channelInfo.closed == false)
    } else if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_CLOSE) {
      retList = this._channelList.filter(item => item.channelInfo.closed)
    }
    //检查当前频道是否存在
    const index = retList.findIndex(item => item.channelInfo.channel_id == this._curChannelId);
    if (index == -1) {
      runInAction(() => {
        this._curChannelId = "";
        this.rootStore.channelMemberStore.loadChannelMemberList(this.rootStore.projectStore.curProjectId, "");
        this.rootStore.chatMsgStore.loadMsg(this.rootStore.projectStore.curProjectId, "");
      });
    }
    return retList;
  }

  getChannel(channelId: string): WebChannelInfo | undefined {
    return this._channelMap.get(channelId);
  }

  async updateUnReadMsgCount(channelId: string) {
    const chanInfo = this._channelMap.get(channelId);
    if (chanInfo === undefined) {
      return;
    }
    const statRes = await request(get_read_msg_stat(this.rootStore.userStore.sessionId, this.rootStore.projectStore.curProjectId, channelId));
    if (!statRes) {
      return;
    }
    runInAction(() => {
      const tmpList = this._channelList.slice();
      const index = tmpList.findIndex(item => item.channelInfo.channel_id == channelId);
      if (index != -1) {
        chanInfo.unreadMsgCount = statRes.stat!.unread_msg_count;
        tmpList[index] = chanInfo;
        this._channelMap.set(channelId, chanInfo);
        this._channelList = tmpList;
      }
    });
  }

  async updateChannel(channelId: string) {
    let unReadMsgCount = 0;
    if (this._channelScope == LIST_CHAN_SCOPE_INCLUDE_ME) {
      const statRes = await request(get_read_msg_stat(this.rootStore.userStore.sessionId, this.rootStore.projectStore.curProjectId, channelId));
      if (!statRes) {
        return;
      }
      unReadMsgCount = statRes.stat?.unread_msg_count ?? 0;
    }
    const res = await request(
      get_channel(this.rootStore.userStore.sessionId, this.rootStore.projectStore.curProjectId, channelId)
    );
    if (!res) {
      return;
    }
    if (res.info.project_id != this.rootStore.projectStore.curProjectId) {
      return;
    }
    const webChan: WebChannelInfo = new WebChannelInfo(res.info, unReadMsgCount);
    runInAction(() => {
      this._channelMap.set(webChan.channelInfo.channel_id, webChan);
      const defaultChan = this._channelList.find((item) => item.channelInfo.system_channel && item.channelInfo.basic_info.pub_channel);
      const reminderChan = this._channelList.find((item) => item.channelInfo.system_channel && !item.channelInfo.basic_info.pub_channel);
      const tmpList = this._channelList.filter((item) => !item.channelInfo.system_channel);
      const index = tmpList.findIndex((item) => item.channelInfo.channel_id == channelId);
      if (index == -1) {
        tmpList.push(webChan);
      } else {
        tmpList[index] = webChan;
      }
      tmpList.sort((a, b) => {
        if (a.channelInfo.top_weight < b.channelInfo.top_weight) {
          return -1;
        } else if (a.channelInfo.top_weight > b.channelInfo.top_weight) {
          return 1;
        }
        return a.channelInfo.update_time - b.channelInfo.update_time;
      });
      tmpList.reverse();
      if (reminderChan !== undefined) {
        tmpList.unshift(reminderChan);
      }
      if (defaultChan !== undefined) {
        tmpList.unshift(defaultChan);
      }
      this._channelList = tmpList;
    });
  }

  removeChannel(channelId: string) {
    const tmpList = this._channelList.filter((item) => item.channelInfo.channel_id != channelId);
    let curChannelId: string = '';
    tmpList.forEach((item: WebChannelInfo) => {
      if (curChannelId != "") {
        return;
      }
      if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_ALL) {
        curChannelId = item.channelInfo.channel_id;
      } else if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_OPEN && item.channelInfo.closed == false) {
        curChannelId = item.channelInfo.channel_id;
      } else if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_CLOSE && item.channelInfo.closed) {
        curChannelId = item.channelInfo.channel_id;
      }
    });
    runInAction(() => {
      this._channelList = tmpList;
      this._channelMap.delete(channelId);
      this._curChannelId = curChannelId;
      this.rootStore.channelMemberStore.loadChannelMemberList(this.rootStore.projectStore.curProjectId, curChannelId);
      this.rootStore.chatMsgStore.loadMsg(this.rootStore.projectStore.curProjectId, curChannelId);
    });
  }

  async loadChannelList(projectId: string, filterScope: LIST_CHAN_SCOPE = LIST_CHAN_SCOPE_INCLUDE_ME) {
    const statMap: Map<string, number> = new Map();
    if (filterScope == LIST_CHAN_SCOPE_INCLUDE_ME) {
      const statRes = await request(list_read_msg_stat(this.rootStore.userStore.sessionId || '', projectId));
      if (statRes) {
        statRes.stat_list.forEach(item => statMap.set(item.channel_id, item.unread_msg_count));
      }
    }
    let chInfoList: ChannelInfo[] = [];
    if (filterScope == LIST_CHAN_SCOPE_INCLUDE_ME) {
      const res = await request(
        list_channel({
          session_id: this.rootStore.userStore.sessionId || '',
          project_id: projectId,
          filter_by_closed: false,
          closed: false,
        }),
      );
      chInfoList = res.info_list;
    } else if (filterScope == LIST_CHAN_SCOPE_WITHOUT_ME || filterScope == LIST_CHAN_SCOPE_ORPHAN) {
      const res = await request(list_channel_by_admin({
        session_id: this.rootStore.userStore.sessionId || '',
        project_id: projectId,
        filter_by_closed: false,
        closed: false,
        filter_by_scope: true,
        scope_list: [filterScope],
      }
      ));
      chInfoList = res.info_list;
    }

    const channelList: WebChannelInfo[] = chInfoList.map((item) => {
      let unreadCount = 0;
      const stat = statMap.get(item.channel_id);
      if (stat !== undefined) {
        unreadCount = stat;
      }
      return new WebChannelInfo(item, unreadCount);
    });
    const channelMap: Map<string, WebChannelInfo> = new Map();
    let curChannelId: string = '';
    channelList.forEach((item: WebChannelInfo) => {
      channelMap.set(item.channelInfo.channel_id, item);
      if (item.channelInfo.system_channel && item.channelInfo.basic_info.pub_channel) {
        curChannelId = item.channelInfo.channel_id;
      }
    });
    if (curChannelId == "") {
      channelList.forEach((item: WebChannelInfo) => {
        if (curChannelId != "") {
          return;
        }
        if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_ALL) {
          curChannelId = item.channelInfo.channel_id;
        } else if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_OPEN && item.channelInfo.closed == false) {
          curChannelId = item.channelInfo.channel_id;
        } else if (this.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_CLOSE && item.channelInfo.closed) {
          curChannelId = item.channelInfo.channel_id;
        }
      });
    }
    runInAction(() => {
      this._channelList = channelList;
      this._channelMap = channelMap;
      this._curChannelId = curChannelId;
      this._channelScope = filterScope;
      this.rootStore.channelMemberStore.loadChannelMemberList(projectId, curChannelId);
      this.rootStore.chatMsgStore.loadMsg(projectId, curChannelId);
    });
  }

  //显示创建频道界面
  private _showCreateChannel = false;

  get showCreateChannel(): boolean {
    return this._showCreateChannel;
  }
  set showCreateChannel(val: boolean) {
    runInAction(() => {
      this._showCreateChannel = val;
    });
  }

  //设置频道关注
  setWatch(channelId: string, watch: boolean) {
    const tmpList = this._channelList.slice();
    const index = tmpList.findIndex(item => item.channelInfo.channel_id == channelId);
    if (index != -1) {
      tmpList[index].channelInfo.my_watch = watch;
      runInAction(() => {
        this._channelList = tmpList;
      });
    }
  }

  //更新和退出频道
  private _updateChannelId = "";
  private _exitChannelId = "";
  private _showDetailChannelId = "";

  get updateChannelId(): string {
    return this._updateChannelId;
  }

  get exitChannelId(): string {
    return this._exitChannelId;
  }

  get showDetailChannelId(): string {
    return this._showDetailChannelId;
  }

  set updateChannelId(val: string) {
    runInAction(() => {
      this._updateChannelId = val;
    });
  }

  set exitChannelId(val: string) {
    runInAction(() => {
      this._exitChannelId = val;
    });
  }

  set showDetailChannelId(val: string) {
    runInAction(() => {
      this._showDetailChannelId = val;
    });
  }
}

export default ChannelStore;
