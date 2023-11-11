import { makeAutoObservable, runInAction } from 'mobx';
import { platform } from '@tauri-apps/api/os';
import * as clientCfgApi from '@/api/client_cfg';
import type { RootStore } from '.';

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

  //专注模式
  private _focusMode = false;

  get focusMode(): boolean {
    return this._focusMode;
  }

  set focusMode(val: boolean) {
    runInAction(() => {
      this._focusMode = val;
    });
  }

  //离开编辑状态提示
  private _inEdit = false;
  private _checkLeave = false;
  private _onLeave: (() => void) | null = null;

  get inEdit(): boolean {
    return this._inEdit;
  }

  set inEdit(val: boolean) {
    runInAction(() => {
      this._inEdit = val;
    });
  }

  get checkLeave(): boolean {
    return this._checkLeave;
  }
  get onLeave(): (() => void) | null {
    return this._onLeave;
  }

  showCheckLeave(fn: () => void) {
    runInAction(() => {
      this._checkLeave = true;
      this._onLeave = fn;
    });
  }

  clearCheckLeave() {
    runInAction(() => {
      this._checkLeave = false;
      this._onLeave = null;
    });
  }
}

export default AppStore;
