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

  private _showCreateOrJoinProject: boolean = false;

  get showCreateOrJoinProject(): boolean {
    return this._showCreateOrJoinProject;
  }

  set showCreateOrJoinProject(val: boolean) {
    runInAction(() => {
      this._showCreateOrJoinProject = val;
    });
  }

  private _simpleMode: boolean = false;

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
}

export default AppStore;
