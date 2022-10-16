import { makeAutoObservable, runInAction } from 'mobx';
import { platform } from '@tauri-apps/api/os';
import * as clientCfgApi from '@/api/client_cfg';

class AppStore {

  constructor() {
    makeAutoObservable(this);
    platform().then((platName: string) => {
      if (platName.includes("win32")) {
        this._isOsWindows = true;
      }
    })
  }

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
}

export default AppStore;
