import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from '.';
import { request } from '@/utils/request';
import type { AppraiseInfo, UserScoreInfo } from '@/api/project_appraise';
import {
  list as list_all,
  list_by_vote_state,
  list_score,
  get as get_appraise,
  MY_VOTE_STATE_DONE,
  MY_VOTE_STATE_UNDONE
} from '@/api/project_appraise';

export type WebUserScoreInfo = UserScoreInfo & {
  avg_score: number;
};

class AppraiseStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  static readonly pageSize = 10;

  rootStore: RootStore;
  private _myRecordList: AppraiseInfo[] = [];
  private _myTotalCount: number = 0;
  private _myCurPage: number = 0;

  private _allRecordList: AppraiseInfo[] = [];
  private _allTotalCount: number = 0;
  private _allCurPage: number = 0;

  private _userScoreList: WebUserScoreInfo[] = [];

  get myRecordList(): AppraiseInfo[] {
    return this._myRecordList;
  }

  get myTotalCount(): number {
    return this._myTotalCount
  }

  get myCurPage(): number {
    return this._myCurPage;
  }

  get myPageCount(): number {
    const pageCount = Math.floor(this._myTotalCount / AppraiseStore.pageSize);
    if (this._myTotalCount % AppraiseStore.pageSize != 0) {
      return pageCount + 1;
    }
    return pageCount;
  }

  get allrecordList(): AppraiseInfo[] {
    return this._allRecordList;
  }

  get allTotalCount(): number {
    return this._allTotalCount;
  }

  get allCurPage(): number {
    return this._allCurPage;
  }

  get allPageCount(): number {
    const pageCount = Math.floor(this._allTotalCount / AppraiseStore.pageSize);
    if (this._allTotalCount % AppraiseStore.pageSize != 0) {
      return pageCount + 1;
    }
    return pageCount;
  }

  get userScoreList(): WebUserScoreInfo[] {
    return this._userScoreList;
  }

  async updateAppraise(appraiseId: string) {
    const res = await request(get_appraise(this.rootStore.userStore.sessionId, this.rootStore.projectStore.curProjectId, appraiseId));
    if (res) {
      runInAction(() => {
        const myIndex = this._myRecordList.findIndex(item => item.appraise_id == appraiseId);
        if (myIndex != -1) {
          this._myRecordList[myIndex] = res.info;
        }
        const allIndex = this._allRecordList.findIndex(item => item.appraise_id == appraiseId);
        if (allIndex != -1) {
          this._allRecordList[allIndex] = res.info;
        }
      });
    }
  }

  async loadMyRecord(page: number) {
    const res = await request(list_by_vote_state({
      session_id: this.rootStore.userStore.sessionId,
      project_id: this.rootStore.projectStore.curProjectId,
      my_vote_state_list: [MY_VOTE_STATE_DONE, MY_VOTE_STATE_UNDONE],
      offset: page * AppraiseStore.pageSize,
      limit: AppraiseStore.pageSize,
    }));
    if (res) {
      runInAction(() => {
        this._myTotalCount = res.total_count;
        this._myRecordList = res.info_list;
        this._myCurPage = page;
      });
    }
  }

  async loadAllRecord(page: number) {
    const res = await request(list_all({
      session_id: this.rootStore.userStore.sessionId,
      project_id: this.rootStore.projectStore.curProjectId,
      offset: page * AppraiseStore.pageSize,
      limit: AppraiseStore.pageSize,
    }));
    if (res) {
      runInAction(() => {
        this._allTotalCount = res.total_count;
        this._allRecordList = res.info_list;
        this._allCurPage = page;
      });
    }
  }

  async loadUserScore() {
    const res = await request(list_score({
      session_id: this.rootStore.userStore.sessionId,
      project_id: this.rootStore.projectStore.curProjectId,
      use_appraise_id: false,
      appraise_id: "",
    }));
    if (res) {
      runInAction(() => {
        this._userScoreList = res.score_info_list.map(item => {
          if (item.min_score > item.max_score) {
            item.min_score = 0;
          }
          let avgScore = 0;
          if (item.vote_count > 0) {
            avgScore = Math.round(item.total_score / item.vote_count * 10) / 10;
          }
          return {
            ...item,
            avg_score: avgScore,
          }
        });
      });
    }
  }

  clearData() {
    this._myTotalCount = 0
    this._myRecordList = [];
    this._myCurPage = 0;

    this._allTotalCount = 0;
    this._allRecordList = [];
    this._allCurPage = 0;

    this._userScoreList = [];
  }
}

export default AppraiseStore;
