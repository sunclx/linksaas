import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import type { ProjectInfo } from '@/api/project';
import { list as listProject, get_project as getProject } from '@/api/project';
import { request } from '@/utils/request';
import { APP_PROJECT_CHAT_PATH, FILTER_PROJECT_ENUM } from '@/utils/constant';
import { list_read_msg_stat } from '@/api/project_channel';
import { get_member_state as get_my_appraise_state } from '@/api/project_appraise';
import { ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, get_member_state as get_my_issue_state } from '@/api/project_issue';
import type { History } from 'history';


export class WebProjectStatus {
  constructor() {
    makeAutoObservable(this);
  }
  unread_msg_count: number = 0;
  undone_task_count: number = 0;
  undone_bug_count: number = 0;
  undone_appraise_count: number = 0;
  new_event_count: number = 0; //启动软件以来的新事件数

  get total_count(): number {
    return (
      this.unread_msg_count +
      this.undone_task_count +
      this.undone_bug_count +
      this.undone_appraise_count +
      this.new_event_count
    );
  }
}

export type WebProjectInfo = ProjectInfo & {
  project_status: WebProjectStatus;
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

  filterProjectType: FILTER_PROJECT_ENUM = FILTER_PROJECT_ENUM.ALL;

  async setCurProjectId(val: string) {
    const oldProjectId = this._curProjectId;
    runInAction(() => {
      this._curProjectId = val;
    });
    if (val !== '' && val != oldProjectId) {
      await this.rootStore.memberStore.loadMemberList(val);
      await this.rootStore.channelStore.loadChannelList(val);
      if (this.rootStore.appStore.simpleMode) {
        this.rootStore.issueStore.loadPrjTodoIssue(this.curProjectId, ISSUE_TYPE_TASK);
        this.rootStore.issueStore.loadPrjTodoIssue(this.curProjectId, ISSUE_TYPE_BUG);
      }
      this.rootStore.appraiseStore.clearData();
    }
  }

  get curProjectId(): string {
    return this._curProjectId;
  }

  get projectList(): WebProjectInfo[] {
    return this._projectList;
  }

  get filterProjectList(): WebProjectInfo[] {
    switch (this.filterProjectType) {
      case FILTER_PROJECT_ENUM.UNDERWAY:
        return this._projectList.filter((item) => !item.closed);
      case FILTER_PROJECT_ENUM.CLOSE:
        return this._projectList.filter((item) => item.closed);
      default:
        return this._projectList;
    }
  }

  get curProject(): WebProjectInfo | undefined {
    return this._projectMap.get(this._curProjectId);
  }

  getProject(projectId: string): WebProjectInfo | undefined {
    return this._projectMap.get(projectId);
  }

  async initLoadProjectList() {
    const prjListRes = await request(listProject(this.rootStore.userStore.sessionId, false, false));
    const prjList: WebProjectInfo[] = prjListRes.info_list.map((info) => {
      return {
        ...info,
        project_status: new WebProjectStatus(),
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
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      const status = await this.clacProjectStatus(projectId);
      runInAction(() => {
        const index = this._projectList.findIndex((item) => item.project_id == projectId);
        if (index != -1) {
          this._projectList[index].project_status = status;
        }
        const value = this._projectMap.get(projectId);
        if (value !== undefined) {
          value.project_status = status;
          this._projectMap.set(projectId, value);
        }
      });
    });
  }

  private async clacProjectStatus(projectId: string): Promise<WebProjectStatus> {
    const status = new WebProjectStatus();
    const msgStatRes = await request(
      list_read_msg_stat(this.rootStore.userStore.sessionId, projectId),
    );
    if (msgStatRes) {
      msgStatRes.stat_list.forEach((item) => {
        status.unread_msg_count += item.unread_msg_count;
      });
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
    const appraiseStateRes = await request(
      get_my_appraise_state(this.rootStore.userStore.sessionId, projectId),
    );
    if (appraiseStateRes) {
      status.undone_appraise_count = appraiseStateRes.un_done_count;
    }
    return new Promise((resolve) => {
      resolve(status);
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

  async updateProjectUnreadMsgCount(projectId: string) {
    const msgStatRes = await request(
      list_read_msg_stat(this.rootStore.userStore.sessionId, projectId),
    );
    let totalUnread = 0;
    if (msgStatRes) {
      msgStatRes.stat_list.forEach((item) => {
        totalUnread += item.unread_msg_count;
      });
      runInAction(() => {
        const index = this._projectList.findIndex((item) => item.project_id == projectId);
        if (index != -1) {
          this._projectList[index].project_status.unread_msg_count = totalUnread;
        }
        const prj = this._projectMap.get(projectId);
        if (prj !== undefined) {
          prj.project_status.unread_msg_count = totalUnread;
          this._projectMap.set(projectId, prj);
        }
      });
    }
  }

  async updateProjectAppraiseCount(projectId: string) {
    const res = await request(
      get_my_appraise_state(this.rootStore.userStore.sessionId, projectId),
    );
    runInAction(() => {
      const index = this._projectList.findIndex((item) => item.project_id == projectId);
      if (index != -1) {
        this._projectList[index].project_status.undone_appraise_count = res.un_done_count;
      }
      const prj = this._projectMap.get(projectId);
      if (prj !== undefined) {
        prj.project_status.undone_appraise_count = res.un_done_count;
        this._projectMap.set(projectId, prj);
      }
    });
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
      if (index != -1) {
        this._projectList[index].project_status.new_event_count = oldCount + 1;
      }
      const prjItem = this._projectMap.get(projectId);
      if (prjItem !== undefined) {
        prjItem.project_status.new_event_count = oldCount + 1;
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
      const prj = { ...res.info, project_status: status };
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

  removeProject(projecId: string, history: History) {
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
    if (newProjectId == "") {
      history.push('/app/workbench');
    } else {
      this.setCurProjectId(newProjectId);
      history.push(APP_PROJECT_CHAT_PATH);
    }
  }

  get isAdmin(): boolean {
    const curProject = this.curProject;
    if (curProject !== undefined) {
      if (curProject.owner_user_id == this.rootStore.userStore.userInfo.userId) {
        return true
      }
    }
    const member = this.rootStore.memberStore.getMember(this.rootStore.userStore.userInfo.userId);
    if (member !== undefined) {
      return member.member.can_admin
    }
    return false;
  }
}
