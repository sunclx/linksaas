import { makeAutoObservable, runInAction } from 'mobx';

import { login, logout as user_logout } from '@/api/user';
import { request } from '@/utils/request';

import type { RootStore } from './index';
import { showMyShortNote } from '@/utils/short_note';

type UserInfo = {
  userId: string;
  userName: string;
  displayName: string;
  logoUri: string;
  userFsId: string;
};

class UserStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.sessionId = sessionStorage.getItem('sessionId') || '';
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) this.userInfo = JSON.parse(userInfo);
    makeAutoObservable(this);
  }

  connectServerSuccess = false;
  rootStore: RootStore;
  sessionId: string;
  adminSessionId = "";
  userInfo: UserInfo = {
    userId: '',
    userName: '',
    displayName: '',
    logoUri: '',
    userFsId: '',
  };

  // 帐号管理弹窗
  private _accountsModal = false;

  // 用户登录弹窗
  private _showUserLogin: null | (() => void) = null;
  // 管理员登录弹窗
  private _showAdminUserLogin = false;

  // 重置密码
  private _isResetPassword = false;

  async logout() {
    this.rootStore.projectStore.reset();
    this.rootStore.appStore.reset();
    const tmpSessionId = this.sessionId;
    runInAction(() => {
      this.sessionId = '';
      this.userInfo = {
        userId: '',
        userName: '',
        displayName: '',
        logoUri: '',
        userFsId: '',
      };
    });
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('userInfo');
    await request(user_logout(tmpSessionId));
  }

  async callLogin(username: string, password: string) {
    const res = await request(login(username, password));

    if (res) {
      runInAction(() => {
        this.sessionId = res.session_id;
        sessionStorage.setItem('sessionId', res.session_id);
        this.userInfo = {
          userId: res.user_info.user_id,
          userName: res.user_info.user_name,
          displayName: res.user_info.basic_info.display_name,
          logoUri: res.user_info.basic_info.logo_uri,
          userFsId: res.user_info.user_fs_id,
        };
        sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        this.rootStore.projectStore.initLoadProjectList();
      });
      await showMyShortNote(res.session_id);
    }
    if (this._showUserLogin != null) {
      this._showUserLogin();
      runInAction(() => {
        this._showUserLogin = null;
      });
    }
  }

  get accountsModal() {
    return this._accountsModal;
  }

  set accountsModal(val: boolean) {
    runInAction(() => {
      this._accountsModal = val;
    });
  }

  get showUserLogin() {
    return this._showUserLogin;
  }

  set showUserLogin(val: (() => void) | null) {
    runInAction(() => {
      this._showUserLogin = val;
    });
  }

  get showAdminUserLogin() {
    return this._showAdminUserLogin;
  }

  set showAdminUserLogin(val: boolean) {
    runInAction(() => {
      this._showAdminUserLogin = val;
    });
  }

  get isResetPassword() {
    return this._isResetPassword;
  }

  set isResetPassword(val: boolean) {
    runInAction(() => {
      this._isResetPassword = val;
    });
  }

  updateDisplayName(val: string) {
    if (this.sessionId && this.userInfo) {
      runInAction(() => {
        this.userInfo.displayName = val;
      });
    }
  }

  updateLogoUri(val: string) {
    if (this.sessionId && this.userInfo) {
      runInAction(() => {
        this.userInfo.logoUri = val;
      });
    }
  }
}

export default UserStore;
