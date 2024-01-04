import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import type { ProjectInfo, TagInfo } from '@/api/project';
import { list as listProject, get_project as getProject, list_tag, TAG_SCOPRE_ALL } from '@/api/project';
import { request } from '@/utils/request';
import type { PROJECT_SETTING_TAB } from '@/utils/constant';
import { APP_PROJECT_OVERVIEW_PATH } from '@/utils/constant';
import { get_member_state as get_my_issue_state } from '@/api/project_issue';
import type { History } from 'history';
import { get_alarm_state } from "@/api/project_alarm";
import { list_key as list_bulletin_key } from "@/api/project_bulletin";
import { get_un_read_state } from "@/api/project_comment";

export class WebProjectStatus {
  constructor() {
    makeAutoObservable(this);
  }
  undone_task_count: number = 0;
  undone_bug_count: number = 0;
  new_event_count: number = 0; //启动软件以来的新事件数
  alarm_hit_count: number = 0;
  alarm_alert_count: number = 0;
  bulletin_count: number = 0;
  unread_comment_count: number = 0;

  get total_count(): number {
    return (
      this.undone_task_count +
      this.undone_bug_count +
      this.new_event_count +
      this.alarm_hit_count +
      this.alarm_alert_count +
      this.bulletin_count
      // this.unread_comment_count
    );
  }
}

export type WebProjectInfo = ProjectInfo & {
  project_status: WebProjectStatus;
  tag_list: TagInfo[];
};

export default class ProjectStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  rootStore: RootStore;
  //当前项目
  private _curProjectId: string = '';
  //全部项目
  private _projectList: WebProjectInfo[] = [];
  private _projectMap: Map<string, WebProjectInfo> = new Map();

  async setCurProjectId(val: string) {
    const oldProjectId = this._curProjectId;
    if (val == oldProjectId) {
      return;
    }
    runInAction(() => {
      this._curProjectId = val;
    });
    if (val !== '' && val != oldProjectId) {
      this.rootStore.entryStore.reset();
      this.rootStore.memberStore.showDetailMemberId = "";
      await Promise.all([
        this.rootStore.memberStore.loadMemberList(val),
        this.rootStore.ideaStore.loadKeyword(val),
      ]);

      this.setCodeCommentInfo("", "");
      this.showProjectSetting = null;
    }
  }

  get curProjectId(): string {
    return this._curProjectId;
  }

  get projectList(): WebProjectInfo[] {
    return this._projectList;
  }

  get curProject(): WebProjectInfo | undefined {
    return this._projectMap.get(this._curProjectId);
  }

  getProject(projectId: string): WebProjectInfo | undefined {
    return this._projectMap.get(projectId);
  }

  reset() {
    runInAction(()=>{
      this._curProjectId = "";
      this._projectList = [];
    });
  }

  async initLoadProjectList() {
    const prjListRes = await request(listProject(this.rootStore.userStore.sessionId, false, false));
    const prjList: WebProjectInfo[] = prjListRes.info_list.map((info) => {
      return {
        ...info,
        project_status: new WebProjectStatus(),
        tag_list: [],
      };
    });
    const prjMap: Map<string, WebProjectInfo> = new Map();
    prjList.forEach((item: WebProjectInfo) => {
      prjMap.set(item.project_id, item);
    });
    runInAction(() => {
      this._projectList = prjList;
      this._projectMap = prjMap;
    });
    //更新项目状态
    const projectIdList = this._projectList.map((item) => item.project_id);
    projectIdList.forEach(async (projectId: string) => {
      const status = await this.clacProjectStatus(projectId);
      const tagList = await this.listTag(projectId);
      runInAction(() => {
        const index = this._projectList.findIndex((item) => item.project_id == projectId);
        if (index != -1) {
          this._projectList[index].project_status = status;
          this._projectList[index].tag_list = tagList;
        }
        const value = this._projectMap.get(projectId);
        if (value !== undefined) {
          value.project_status = status;
          value.tag_list = tagList;
          this._projectMap.set(projectId, value);
        }
      });
    });
  }

  private async clacProjectStatus(projectId: string): Promise<WebProjectStatus> {
    const status = new WebProjectStatus();
    const prjInfo = this.getProject(projectId);
    if (prjInfo !== undefined) {
      status.new_event_count = prjInfo.project_status.new_event_count;
    }
    const issueStateRes = await request(
      get_my_issue_state(this.rootStore.userStore.sessionId, projectId),
    );
    if (issueStateRes) {
      status.undone_bug_count =
        issueStateRes.member_state.bug_un_check_count +
        issueStateRes.member_state.bug_un_exec_count;
      status.undone_task_count =
        issueStateRes.member_state.task_un_check_count +
        issueStateRes.member_state.task_un_exec_count;
    }

    const alarmRes = await request(get_alarm_state({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
    }));
    status.alarm_hit_count = alarmRes.hit_count;
    status.alarm_alert_count = alarmRes.alert_count;

    const bulletinRes = await request(list_bulletin_key({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
      list_un_read: true,
      offset: 0,
      limit: 1,
    }));
    status.bulletin_count = bulletinRes.total_count;

    const unReadRes = await request(get_un_read_state({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
    }));
    status.unread_comment_count = unReadRes.un_read_count;

    return status;
  }

  private async listTag(projectId: string): Promise<TagInfo[]> {
    const res = await request(list_tag({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
      tag_scope_type: TAG_SCOPRE_ALL,
    }));
    return res.tag_info_list;
  }

  async updateTagList(projectId: string) {
    const tagList = await this.listTag(projectId);
    runInAction(() => {
      const index = this._projectList.findIndex((item) => item.project_id == projectId);
      if (index != -1) {
        this._projectList[index].tag_list = tagList;
      }
      const prj = this._projectMap.get(projectId);
      if (prj !== undefined) {
        prj.tag_list = tagList;
        this._projectMap.set(projectId, prj);
      }
    });
  }

  async updateAlarmStatus(projectId: string) {
    const res = await request(get_alarm_state({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
    }));
    runInAction(() => {
      const index = this._projectList.findIndex((item) => item.project_id == projectId);
      if (index != -1) {
        this._projectList[index].project_status.alarm_hit_count = res.hit_count;
        this._projectList[index].project_status.alarm_alert_count = res.alert_count;
      }
      const prj = this._projectMap.get(projectId);
      if (prj !== undefined) {
        prj.project_status.alarm_hit_count = res.hit_count;
        prj.project_status.alarm_alert_count = res.alert_count;
        this._projectMap.set(projectId, prj);
      }
    });
  }

  async updateBulletinStatus(projectId: string) {
    const res = await request(list_bulletin_key({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
      list_un_read: true,
      offset: 0,
      limit: 1,
    }));
    runInAction(() => {
      const index = this._projectList.findIndex((item) => item.project_id == projectId);
      if (index != -1) {
        this._projectList[index].project_status.bulletin_count = res.total_count;
      }
      const prj = this._projectMap.get(projectId);
      if (prj !== undefined) {
        prj.project_status.bulletin_count = res.total_count;
        this._projectMap.set(projectId, prj);
      }
    });
  }

  async updateUnReadCommentStatus(projectId: string) {
    const res = await request(get_un_read_state({
      session_id: this.rootStore.userStore.sessionId,
      project_id: projectId,
    }));
    runInAction(() => {
      const index = this._projectList.findIndex((item) => item.project_id == projectId);
      if (index != -1) {
        this._projectList[index].project_status.unread_comment_count = res.un_read_count;
      }
      const prj = this._projectMap.get(projectId);
      if (prj !== undefined) {
        prj.project_status.unread_comment_count = res.un_read_count;
        this._projectMap.set(projectId, prj);
      }
    });
  }

  async updateProjectIssueCount(projectId: string) {
    const issueStateRes = await request(
      get_my_issue_state(this.rootStore.userStore.sessionId, projectId),
    );
    if (issueStateRes) {
      const undoneBugCount =
        issueStateRes.member_state.bug_un_check_count +
        issueStateRes.member_state.bug_un_exec_count;
      const undoneTaskCount =
        issueStateRes.member_state.task_un_check_count +
        issueStateRes.member_state.task_un_exec_count;
      runInAction(() => {
        const index = this._projectList.findIndex((item) => item.project_id == projectId);
        if (index != -1) {
          this._projectList[index].project_status.undone_bug_count = undoneBugCount;
          this._projectList[index].project_status.undone_task_count = undoneTaskCount;
        }
        const prj = this._projectMap.get(projectId);
        if (prj !== undefined) {
          prj.project_status.undone_bug_count = undoneBugCount;
          prj.project_status.undone_task_count = undoneTaskCount;
          this._projectMap.set(projectId, prj);
        }
      });
    }
  }

  addNewEventCount(projectId: string) {
    let oldCount = 0;
    const prj = this._projectMap.get(projectId);
    if (prj == undefined) {
      return;
    }
    oldCount = prj.project_status.new_event_count;
    runInAction(() => {
      const index = this._projectList.findIndex((item) => item.project_id == projectId);
      const newCount = oldCount + 1;
      if (index != -1) {
        this._projectList[index].project_status.new_event_count = newCount;
      }
      const prjItem = this._projectMap.get(projectId);
      if (prjItem !== undefined) {
        prjItem.project_status.new_event_count = newCount;
        this._projectMap.set(projectId, prjItem);
      }
    });
  }

  clearNewEventCount(projectId: string) {
    runInAction(() => {
      const index = this._projectList.findIndex((item) => item.project_id == projectId);
      if (index != -1) {
        this._projectList[index].project_status.new_event_count = 0;
      }
      const prj = this._projectMap.get(projectId);
      if (prj !== undefined) {
        prj.project_status.new_event_count = 0;
        this._projectMap.set(projectId, prj);
      }
    });
  }

  async updateProject(projectId: string) {
    const res = await request(getProject(this.rootStore.userStore.sessionId, projectId));
    if (res) {
      const status = await this.clacProjectStatus(projectId);
      const tagList = await this.listTag(projectId);
      const prj = { ...res.info, project_status: status, tag_list: tagList };
      runInAction(() => {
        this._projectMap.set(prj.project_id, prj);
        const tmpList = this._projectList.slice()
        const index = tmpList.findIndex((item) => item.project_id == prj.project_id);
        if (index == -1) {
          tmpList.unshift(prj);
        } else {
          tmpList[index] = prj;
        }
        this._projectList = tmpList;
      });
    }
  }


  removeProject(projecId: string, history?: History) {
    const tmpList = this._projectList.filter((item) => item.project_id != projecId);
    let newProjectId = "";
    runInAction(() => {
      this._projectList = tmpList;
      this._projectMap.delete(projecId);
      if (this._curProjectId == projecId) {
        if (tmpList.length > 0) {
          newProjectId = tmpList[0].project_id;
        }
      }
    });
    if (history == undefined) {
      return;
    }
    if (newProjectId == "") {
      history.push('/app/workbench');
    } else {
      this.setCurProjectId(newProjectId);
      history.push(APP_PROJECT_OVERVIEW_PATH);
    }
  }

  get isAdmin(): boolean {
    const curProject = this.curProject;
    if (curProject !== undefined) {
      if (curProject.owner_user_id == this.rootStore.userStore.userInfo.userId) {
        return true;
      }
    }
    const member = this.rootStore.memberStore.getMember(this.rootStore.userStore.userInfo.userId);
    if (member !== undefined) {
      return member.member.can_admin;
    }
    return false;
  }

  get isClosed(): boolean {
    const curProject = this.curProject;
    if (curProject == undefined) {
      return false;
    }
    return curProject.closed;
  }

  //显示代码评论
  private _codeCommentThreadId = "";
  private _codeCommentId = "";

  setCodeCommentInfo(threadId: string, commentId: string) {
    runInAction(() => {
      this._codeCommentThreadId = threadId;
      this._codeCommentId = commentId;
    });
  }

  get codeCommentThreadId(): string {
    return this._codeCommentThreadId;
  }

  get codeCommentId(): string {
    return this._codeCommentId;
  }

  //显示项目设置
  private _showProjectSetting: PROJECT_SETTING_TAB | null = null;

  get showProjectSetting(): PROJECT_SETTING_TAB | null {
    return this._showProjectSetting;
  }

  set showProjectSetting(val: PROJECT_SETTING_TAB | null) {
    runInAction(() => {
      this._showProjectSetting = val;
    });
  }

  //显示小工具
  private _showPostHookModal: boolean = false;

  get showPostHookModal(): boolean {
    return this._showPostHookModal;
  }

  set showPostHookModal(val: boolean) {
    runInAction(() => {
      this._showPostHookModal = val;
    });
  }
}
