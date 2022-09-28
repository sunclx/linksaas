import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import * as docApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { APP_PROJECT_DOC_PRO_PATH, APP_PROJECT_PATH, FILTER_DOC_ENUM } from '@/utils/constant';
import type { LocationDescriptor, UnregisterCallback } from 'history';
export default class DocStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  rootStore: RootStore;
  private _curDocSpaceId: string = '';
  private _curDocKeyList: docApi.DocKey[] = [];
  private _recycleDocKeyList: docApi.DocKey[] = [];
  showProDoc = true;
  filterDocType: FILTER_DOC_ENUM = FILTER_DOC_ENUM.ALL;
  // 文档是否下在编辑
  editing = false;
  nextLocation = '' as LocationDescriptor<unknown>;
  unblock: UnregisterCallback | undefined;
  CurrenDocEditItem: docApi.DocKey | undefined;
  project_id: string | undefined;
  // const [unblock, setUnblock] = useState<UnregisterCallback>();
  // const [currentItem, setcurrentItem] = useState<docApi.DocKey>();
  setEditing(b: boolean) {
    this.editing = b;
  }
  showleavePage = false;
  setShowleavePage(b: boolean) {
    this.showleavePage = b;
  }
  setNextLocation(url: LocationDescriptor<unknown>) {
    this.nextLocation = url;
  }
  setUnblock(block: UnregisterCallback) {
    this.unblock = block;
  }
  setCurrenDocEditItem(item?: docApi.DocKey) {
    this.CurrenDocEditItem = item;
  }
  setCurProjectId(id?: string) {
    this.project_id = id;
  }
  handleLeavePage(history: any) {
    if (this.unblock) {
      this.unblock();
    }

    this.setEditing(false);
    this.setShowleavePage(false);
    history.push(this.nextLocation!);
    if (this.nextLocation === APP_PROJECT_PATH) {
      this.rootStore.projectStore.setShowChannel(true);
    }
    if (this.project_id) {
      this.rootStore.projectStore.setCurProjectId(this.project_id);
      this.setCurProjectId(undefined);
    }
    if (this.CurrenDocEditItem) {
      this.setCurDoc(this.CurrenDocEditItem.doc_id, false, false);
      history.push(APP_PROJECT_DOC_PRO_PATH);
      this.setShowProDoc(true);
      this.setCurrenDocEditItem(undefined);
    }
  }

  get curDocSpaceId(): string {
    return this._curDocSpaceId;
  }

  get curDocKeyList(): docApi.DocKey[] {
    return this._curDocKeyList;
  }

  get curDocKeyListWithFilter(): docApi.DocKey[] {
    return this._curDocKeyList.filter((item) => {
      if (this.filterDocType == FILTER_DOC_ENUM.ALL) {
        return true;
      } else if (this.filterDocType == FILTER_DOC_ENUM.CONCERN) {
        return item.my_watch;
      } else if (this.filterDocType == FILTER_DOC_ENUM.NOT_CONCERN) {
        return !item.my_watch;
      }
      return true;
    });
  }

  get recycleDocKeyList(): docApi.DocKey[] {
    return this._recycleDocKeyList;
  }
  setfilterDocType(type: FILTER_DOC_ENUM) {
    runInAction(() => {
      this.filterDocType = type;
    });
  }
  setShowProDoc(bool: boolean) {
    this.showProDoc = bool;
  }

  async loadDocKey(docSpaceId: string) {
    runInAction(() => {
      this._curDocKeyList = [];
      this._curDocSpaceId = docSpaceId;
      this._curDocId = '';
      this._isWriteDoc = false;
      this._curDocInRecycle = false;
    });
    //获取最后阅读文档
    const lastViewRes = await request(
      docApi.get_last_view_doc({
        session_id: this.rootStore.userStore.sessionId,
        project_id: this.rootStore.projectStore.curProjectId,
      }),
    );
    console.log(lastViewRes);
    if (!lastViewRes) {
      return;
    }
    const listRes = await request(
      docApi.list_doc_key({
        session_id: this.rootStore.userStore.sessionId,
        project_id: this.rootStore.projectStore.curProjectId,
        filter_by_doc_space_id: true,
        doc_space_id: docSpaceId,
        list_param: {
          filter_by_tag: false,
          tag_list: [],
          filter_by_watch: false,
          watch: false,
        },
        offset: 0,
        limit: 999,
      }),
    );
    if (!listRes) {
      return;
    }
    runInAction(() => {
      this._curDocKeyList = listRes.doc_key_list;
      this._curDocSpaceId = docSpaceId;
      if (lastViewRes.doc_space_id == docSpaceId) {
        this._curDocId = lastViewRes.doc_id;
      }
    });
  }

  async loadDocKeyInRecycle() {
    runInAction(() => {
      this._recycleDocKeyList = [];
    });
    const res = await request(
      docApi.list_doc_key_in_recycle({
        session_id: this.rootStore.userStore.sessionId,
        project_id: this.rootStore.projectStore.curProjectId,
        offset: 0,
        limit: 999,
      }),
    );
    if (!res) {
      return;
    }
    runInAction(() => {
      this._recycleDocKeyList = res.doc_key_list;
    });
  }

  async addDocKey(docId: string) {
    this.updateDocKey(docId);
  }

  removeDocKey(docId: string) {
    const tmpList = this._curDocKeyList.filter((item) => item.doc_id != docId);
    runInAction(() => {
      this._curDocKeyList = tmpList;
      if (docId == this._curDocId) {
        this._curDocId = '';
        this._isWriteDoc = false;
      }
    });
  }

  async updateDocKey(docId: string) {
    const res = await request(
      docApi.get_doc_key({
        session_id: this.rootStore.userStore.sessionId,
        project_id: this.rootStore.projectStore.curProjectId,
        doc_space_id: this._curDocSpaceId,
        doc_id: docId,
      }),
    );
    if (!res) {
      return;
    }
    const index = this._curDocKeyList.findIndex((item) => item.doc_id == docId);
    runInAction(() => {
      const tmpList = this._curDocKeyList.slice();
      if (index == -1) {
        tmpList.unshift(res.doc_key);
      } else {
        tmpList[index] = res.doc_key;
      }
      this._curDocKeyList = tmpList;
    });
  }

  async addToRecycle(docId: string) {
    const res = await request(
      docApi.get_doc_key_in_recycle({
        session_id: this.rootStore.userStore.sessionId,
        project_id: this.rootStore.projectStore.curProjectId,
        doc_space_id: this._curDocSpaceId,
        doc_id: docId,
      }),
    );
    if (!res) {
      return;
    }
    const index = this._recycleDocKeyList.findIndex((item) => item.doc_id == docId);
    if (index != -1) {
      return;
    }
    runInAction(() => {
      const tmpList = this._recycleDocKeyList.slice();
      tmpList.unshift(res.doc_key);
      this._recycleDocKeyList = tmpList;
    });
  }

  removeFromRecycle(docId: string) {
    const tmpList = this._recycleDocKeyList.filter((item) => item.doc_id != docId);
    runInAction(() => {
      this._recycleDocKeyList = tmpList;
      if (docId == this._curDocId) {
        this._curDocId = '';
        this._isWriteDoc = false;
      }
    });
  }

  setMyWatch(docId: string, watchValue: boolean) {
    const index = this._curDocKeyList.findIndex((item) => item.doc_id == docId);
    if (index == -1) {
      return;
    }
    runInAction(() => {
      this._curDocKeyList[index].my_watch = watchValue;
    });
  }

  setDocTitle(docId: string, title: string) {
    const index = this._curDocKeyList.findIndex((item) => item.doc_id == docId);
    if (index == -1) {
      return;
    }
    runInAction(() => {
      this._curDocKeyList[index].title = title;
    });
  }

  //当前打开文档
  private _isWriteDoc: boolean = false;
  private _curDocId: string = '';
  private _curDocInRecycle: boolean = false;

  get isWriteDoc(): boolean {
    return this._isWriteDoc;
  }
  get curDocKey(): docApi.DocKey | undefined {
    if (this._curDocInRecycle) {
      return this._recycleDocKeyList.find((item) => item.doc_id == this._curDocId);
    } else {
      return this._curDocKeyList.find((item) => item.doc_id == this._curDocId);
    }
  }
  get curDocId(): string {
    return this._curDocId;
  }
  get curDocInRecycle(): boolean {
    return this._curDocInRecycle;
  }

  setCurDoc(curDocId: string, writeDoc: boolean, inRecycle: boolean) {
    runInAction(() => {
      this._curDocId = curDocId;
      this._isWriteDoc = writeDoc;
      this._curDocInRecycle = inRecycle;
    });
  }

  //文档历史
  private _curDocHsitoryList: docApi.DocKeyHistory[] = [];

  get curDocHsitoryList(): docApi.DocKeyHistory[] {
    return this._curDocHsitoryList;
  }
  clearDocHistory() {
    runInAction(() => {
      this._curDocHsitoryList = [];
    });
  }

  async loadDocHistory() {
    const res = await request(
      docApi.list_doc_key_history({
        session_id: this.rootStore.userStore.sessionId,
        project_id: this.rootStore.projectStore.curProjectId,
        doc_space_id: this.rootStore.projectStore.curProject?.default_doc_space_id ?? '',
        doc_id: this._curDocId,
      }),
    );
    if (res) {
      runInAction(() => {
        this._curDocHsitoryList = res.history_list;
      });
    }
  }
  //文档评论
  private _curDocCommentCount = 0;
  private _curDocCommentPage = 0;
  private _curDocCommentTotalPage = 0;
  private _curDocCommentList: docApi.Comment[] = [];

  get curDocCommentCount(): number {
    return this._curDocCommentCount;
  }
  get curDocCommentPage(): number {
    return this._curDocCommentPage;
  }

  get curDocCommentTotalPage(): number {
    return this._curDocCommentTotalPage;
  }

  get curDocCommentList(): docApi.Comment[] {
    return this._curDocCommentList;
  }

  clearDocComment() {
    runInAction(() => {
      this._curDocCommentCount = 0;
      this._curDocCommentPage = 0;
      this._curDocCommentTotalPage = 0;
      this._curDocCommentList = [];
    });
  }

  async loadDocComment(pageIndex: number) {
    const res = await request(
      docApi.list_comment({
        session_id: this.rootStore.userStore.sessionId,
        project_id: this.rootStore.projectStore.curProjectId,
        doc_space_id: this.rootStore.projectStore.curProject?.default_doc_space_id ?? '',
        doc_id: this._curDocId,
        offset: pageIndex * 10,
        limit: 10,
      }),
    );
    if (res) {
      runInAction(() => {
        this._curDocCommentCount = res.total_count;
        this._curDocCommentPage = pageIndex;
        this._curDocCommentTotalPage = Math.ceil(res.total_count / 10);
        this._curDocCommentList = res.comment_list;
      });
    }
  }
}
