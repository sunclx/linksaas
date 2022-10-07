import { makeAutoObservable, runInAction } from 'mobx';

import type { MemberInfo } from '@/api/project_member';
import type { PluginEvent } from '@/api/events';
import { list_event_by_id, get_event } from '@/api/events';
import type { MemberState as IssueMemberState } from '@/api/project_issue';
import { list_member, get_member } from '@/api/project_member';
import { list_member_state as list_member_issue_state } from '@/api/project_issue';
import { request } from '@/utils/request';
import type { RootStore } from '.';

/*
 * 只保存当前项目的成员列表
 */

export class WebMemberInfo {
  constructor(member: MemberInfo) {
    this.member = member;
    makeAutoObservable(this);
  }
  member: MemberInfo;
  last_event?: PluginEvent = undefined;
  issue_member_state?: IssueMemberState = undefined;
}

class MemberStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  rootStore: RootStore;
  private _memberList: WebMemberInfo[] = [];
  private _memberMap: Map<string, WebMemberInfo> = new Map();


  async loadMemberList(projectId: string) {
    const res = await request(
      list_member(this.rootStore.userStore.sessionId, projectId, false, []),
    );
    if (!res) {
      return;
    }
    let memberList = res.member_list.map((item) => new WebMemberInfo(item));
    const ownerIndex = memberList.findIndex((item) => item.member.is_project_owner);
    if (ownerIndex != -1) {
      const ownerObj = memberList[ownerIndex];
      memberList.splice(ownerIndex, 1);
      memberList.unshift(ownerObj);
    }
    runInAction(() => {
      this._memberList = memberList;
      this.syncToMap();
    });

    //获取最后事件
    const eventIdList = memberList.filter(item => item.member.last_event_id != "").map(item => item.member.last_event_id);
    if (eventIdList.length > 0) {
      const res2 = await request(list_event_by_id(this.rootStore.userStore.sessionId, projectId, eventIdList));
      if (res2) {
        const tmpMap: Map<string, PluginEvent> = new Map();
        res2.event_list.forEach(item => tmpMap.set(item.event_id, item));
        memberList = memberList.map(item => {
          item.last_event = tmpMap.get(item.member.last_event_id);
          return item;
        });
        runInAction(() => {
          this._memberList = memberList;
          this.syncToMap();
        });
      }
    }

    //获取用户的工单状态
    const issueStateRes = await request(list_member_issue_state(this.rootStore.userStore.sessionId, projectId, false, []));
    if (issueStateRes) {
      const tmpMap2: Map<string, IssueMemberState> = new Map();
      issueStateRes.member_state_list.forEach(item => tmpMap2.set(item.member_user_id, item));
      memberList = memberList.map(item => {
        item.issue_member_state = tmpMap2.get(item.member.member_user_id);
        return item;
      });
      this._memberList = memberList;
      this.syncToMap();
    }
  }

  private syncToMap() {
    const tmpMap: Map<string, WebMemberInfo> = new Map();
    this._memberList.forEach(item => tmpMap.set(item.member.member_user_id, item));
    this._memberMap = tmpMap;
  }

  get memberList(): WebMemberInfo[] {
    return this._memberList
  }

  getMember(userId: string): WebMemberInfo | undefined {
    return this._memberMap.get(userId);
  }

  updateOnline(userId: string, online: boolean) {
    runInAction(() => {
      const index = this._memberList.findIndex((item) => item.member.member_user_id == userId);
      if (index != -1) {
        this._memberList[index].member.online = online;
      }
      const member = this._memberMap.get(userId);
      if (member !== undefined) {
        member.member.online = online;
        this._memberMap.set(userId, member);
      }
    });
  }

  updateSnapShot(userId: string, enable: boolean) {
    runInAction(() => {
      const index = this._memberList.findIndex((item) => item.member.member_user_id == userId);
      if (index != -1) {
        this._memberList[index].member.work_snap_shot_info.enable = enable;
      }
      const member = this._memberMap.get(userId);
      if (member !== undefined) {
        member.member.work_snap_shot_info.enable = enable;
        this._memberMap.set(userId, member);
      }
    });
  }

  async updateLastEvent(projectId: string, memberUserId: string, lastEventId: string) {
    const res = await request(get_event(this.rootStore.userStore.sessionId, projectId, lastEventId));
    if (!res) {
      return;
    }
    runInAction(() => {
      const index = this._memberList.findIndex((item) => item.member.project_id == projectId && item.member.member_user_id == memberUserId)
      if (index != -1) {
        this._memberList[index].member.last_event_id = res.event.event_id;
        this._memberList[index].last_event = res.event;
      }
      const memberInfo = this._memberMap.get(memberUserId);
      if (memberInfo !== undefined) {
        memberInfo.member.last_event_id = res.event.event_id;
        memberInfo.last_event = res.event;
        this._memberMap.set(memberUserId, memberInfo);
      }
    });
  }

  async updateIssueState(projectId: string, memberUserId: string) {
    const res = await request(list_member_issue_state(this.rootStore.userStore.sessionId, projectId, true, [memberUserId]));
    if (res && res.member_state_list.length == 1) {
      const index = this._memberList.findIndex((item) => item.member.project_id == projectId && item.member.member_user_id == memberUserId)
      if (index != -1) {
        this._memberList[index].issue_member_state = res.member_state_list[0];
      }
      const memberInfo = this._memberMap.get(memberUserId);
      if (memberInfo !== undefined) {
        memberInfo.issue_member_state = res.member_state_list[0];
        this._memberMap.set(memberUserId, memberInfo);
      }
    }
  }

  async updateMemberInfo(projectId: string, memberUserId: string) {
    const res = await request(get_member(this.rootStore.userStore.sessionId, projectId, memberUserId));
    if (!res) {
      return;
    }
    runInAction(() => {
      const index = this._memberList.findIndex((item) => item.member.project_id == projectId && item.member.member_user_id == memberUserId);
      if (index == -1) {
        this._memberList.push({ member: res.member });
        this._memberMap.set(memberUserId, { member: res.member });
      } else {
        this._memberList[index].member = res.member;
        const memberInfo = this._memberMap.get(memberUserId);
        if (memberInfo !== undefined && memberInfo.member.project_id == projectId) {
          memberInfo.member = res.member;
          this._memberMap.set(memberUserId, memberInfo);
        }
      }
    });
  }
}

export default MemberStore;
