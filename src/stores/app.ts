import { makeAutoObservable, runInAction } from 'mobx';
import { platform } from '@tauri-apps/api/os';
import * as clientCfgApi from '@/api/client_cfg';
import type { RootStore } from '.';
import { ISSUE_TYPE_TASK, ISSUE_TYPE_BUG } from '@/api/project_issue';

class AppStore {

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    platform().then((platName: string) => {
      if (platName.includes("win32")) {
        this._isOsWindows = true;
      }
    })
  }
  rootStore: RootStore;
  private _isOsWindows = false;

  get isOsWindows(): boolean {
    return this._isOsWindows;
  }

  private _clientCfg: clientCfgApi.GetCfgResponse | undefined = undefined;

  get clientCfg(): clientCfgApi.GetCfgResponse | undefined {
    return this._clientCfg;
  }

  async loadClientCfg() {
    const res = await clientCfgApi.get_cfg();
    runInAction(() => {
      this._clientCfg = res;
    });
  }

  private _showJoinProject: boolean = false;
  private _showCreateProject: boolean = false;

  get showJoinProject(): boolean {
    return this._showJoinProject;
  }

  get showCreateProject(): boolean {
    return this._showCreateProject;
  }

  set showJoinProject(val: boolean) {
    runInAction(() => {
      this._showJoinProject = val;
    });
  }

  set showCreateProject(val: boolean) {
    runInAction(() => {
      this._showCreateProject = val;
    });
  }

  private _simpleMode: boolean = false;
  private _simpleModeExpand: "task" | "bug" | null = null;

  get simpleMode(): boolean {
    return this._simpleMode;
  }

  set simpleMode(val: boolean) {
    runInAction(() => {
      this._simpleMode = val;
      if (val && this.rootStore.projectStore.curProjectId != "") {
        this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_TASK);
        this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_BUG);
      }
    });
  }

  get simpleModeExpand(): "task" | "bug" | null {
    return this._simpleModeExpand;
  }

  set simpleModeExpand(val: "task" | "bug" | null) {
    runInAction(() => {
      this._simpleModeExpand = val;
    });
  }
}

export default AppStore;
