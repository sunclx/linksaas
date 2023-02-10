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
  accountsModal = false;

  // 重置密码
  isResetPassword = false;

  logout() {
    request(user_logout(this.sessionId));
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
  }

  setAccountsModal(val: boolean) {
    runInAction(() => {
      this.accountsModal = val;
    });
  }

  setIsResetPassword(boo: boolean) {
    this.isResetPassword = boo;
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
