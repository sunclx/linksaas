import { makeAutoObservable, runInAction } from 'mobx';

import type { MemberInfo } from '@/api/project_member';
import type { PluginEvent } from '@/api/events';
import { list_event_by_id, get_event } from '@/api/events';
import type { MemberState as IssueMemberState } from '@/api/project_issue';
import { list_member, get_member } from '@/api/project_member';
import { list_member_state as list_member_issue_state } from '@/api/project_issue';
import { request } from '@/utils/request';
import type { RootStore } from '.';
import type { ShortNote } from '@/api/short_note';
import { list_by_project as listShortNoteByproject, list_by_member as listShortNoteByMember } from '@/api/short_note';


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
  short_note_list: ShortNote[] = [];
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
    //跳转member列表顺序
    const tmpMemberList = res.member_list.filter(item => item.member_user_id == this.rootStore.userStore.userInfo.userId);
    res.member_list.filter(item => item.member_user_id != this.rootStore.userStore.userInfo.userId).forEach(item => tmpMemberList.push(item));

    let memberList = tmpMemberList.map((item) => new WebMemberInfo(item));

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
    }

    //获取用户便签
    const shortNoteRes = await request(listShortNoteByproject({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
    }));
    if (shortNoteRes) {
      const tmpMap3: Map<string, ShortNote[]> = new Map();
      shortNoteRes.short_note_list.forEach(item => {
        let tmpList = tmpMap3.get(item.member_user_id);
        if (tmpList == undefined) {
          tmpList = [];
        }
        tmpList.push(item);
        tmpMap3.set(item.member_user_id, tmpList);
      });
      memberList = memberList.map(item => {
        let tmpList = tmpMap3.get(item.member.member_user_id);
        if (tmpList == undefined) {
          tmpList = [];
        }
        item.short_note_list = tmpList;
        return item;
      });
    }
    console.log("xxxxxx", memberList);
    runInAction(() => {
      this._memberList = memberList;
      this.syncToMap();
    });
  }

  private syncToMap() {
    const tmpMap: Map<string, WebMemberInfo> = new Map();
    this._memberList.forEach(item => tmpMap.set(item.member.member_user_id, item));
    this._memberMap = tmpMap;
  }

  get memberList(): WebMemberInfo[] {
    return this._memberList;
  }

  getMember(userId: string): WebMemberInfo | undefined {
    return this._memberMap.get(userId);
  }

  updateOnline(userId: string, online: boolean) {
    runInAction(() => {
      const memberList = this._memberList.slice();
      const index = memberList.findIndex((item) => item.member.member_user_id == userId);
      if (index != -1) {
        memberList[index].member.online = online;
      }
      this._memberList = memberList;
      const member = this._memberMap.get(userId);
      if (member !== undefined) {
        member.member.online = online;
        this._memberMap.set(userId, member);
      }
    });
  }

  updateMemberRole(userId: string, roleId: string) {
    runInAction(() => {
      const memberList = this._memberList.slice();
      const index = memberList.findIndex((item) => item.member.member_user_id == userId);
      if (index != -1) {
        memberList[index].member.role_id = roleId;
      }
      this._memberList = memberList;
      const member = this._memberMap.get(userId);
      if (member !== undefined) {
        member.member.role_id = roleId;
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
      const memberList = this._memberList.slice();
      const index = memberList.findIndex((item) => item.member.project_id == projectId && item.member.member_user_id == memberUserId)
      if (index != -1) {
        memberList[index].member.last_event_id = res.event.event_id;
        memberList[index].last_event = res.event;
      }
      this._memberList = memberList;

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

  async updateShortNote(projectId: string, memberUserId: string) {
    const res = await request(listShortNoteByMember({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
      member_user_id: memberUserId,
    }));
    if (res) {
      const index = this._memberList.findIndex((item) => item.member.project_id == projectId && item.member.member_user_id == memberUserId)
      if (index != -1) {
        this._memberList[index].short_note_list = res.short_note_list;
      }
      const memberInfo = this._memberMap.get(memberUserId);
      if (memberInfo !== undefined) {
        memberInfo.short_note_list = res.short_note_list;
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
      const memberList = this._memberList.slice();
      const index = memberList.findIndex((item) => item.member.project_id == projectId && item.member.member_user_id == memberUserId);
      if (index == -1) {
        memberList.push({ member: res.member, short_note_list: [] });
        this._memberMap.set(memberUserId, { member: res.member, short_note_list: [] });
      } else {
        memberList[index].member = res.member;
        const memberInfo = this._memberMap.get(memberUserId);
        if (memberInfo !== undefined && memberInfo.member.project_id == projectId) {
          memberInfo.member = res.member;
          this._memberMap.set(memberUserId, memberInfo);
        }
      }
      this._memberList = memberList;
    });
  }

  //浮动显示项目成员信息
  private _floatMemberUserId = "";

  set floatMemberUserId(val: string) {
    runInAction(() => {
      this._floatMemberUserId = val;
    });
  }

  get floatMemberUserId(): string {
    return this._floatMemberUserId;
  }

  //显示邀请成员modal
  private _showInviteMember = false;

  get showInviteMember(): boolean {
    return this._showInviteMember;
  }

  set showInviteMember(val: boolean) {
    runInAction(() => {
      this._showInviteMember = val;
    });
  }
  //我未完成的issue数量
  get myUnDoneIssueCount(): number {
    const member = this.getMember(this.rootStore.userStore.userInfo.userId);
    if (member == undefined) {
      return 0;
    }
    const state = member.issue_member_state;
    if (state == undefined) {
      return 0;
    }
    return state.bug_un_exec_count + state.bug_un_check_count + state.task_un_exec_count + state.task_un_check_count;
  }
}

export default MemberStore;
