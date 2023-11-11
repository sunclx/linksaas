import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import * as prjDocApi from '@/api/project_doc';
import { request } from '@/utils/request';


export default class DocStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;
    private _curDoc: prjDocApi.Doc | null = null;

    private _fromLink = false;

    get fromLink(): boolean {
        return this._fromLink;
    }
    set fromLink(val: boolean) {
        runInAction(() => {
            this._fromLink = val;
        });
    }

    get curDoc(): prjDocApi.Doc | null {
        return this._curDoc;
    }

    async loadDoc() {
        runInAction(() => {
            this._curDoc = null;
        });
        this.rootStore.appStore.inEdit = false;

        const res = await request(
            prjDocApi.get_doc({
                session_id: this.rootStore.userStore.sessionId,
                project_id: this.rootStore.projectStore.curProjectId,
                doc_id: this.rootStore.entryStore.curEntry?.entry_id ?? "",
            }),
        );
        runInAction(() => {
            this._curDoc = res.doc;
        })
    }

    //文档额外信息
    private _showDocHistory = false;

    get showDocHistory(): boolean {
        return this._showDocHistory;
    }

    set showDocHistory(val: boolean) {
        runInAction(() => {
            this._showDocHistory = val;
        });
    }

    reset() {
        runInAction(() => {
            this._curDoc = null;
            this._showDocHistory = false;
        });
    }
}