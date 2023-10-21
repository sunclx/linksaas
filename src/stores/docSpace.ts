import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import * as prjDocApi from '@/api/project_doc';
import { request } from '@/utils/request';


export enum PAGE_TYPE {
    PAGE_DOC_LIST,
    PAGE_DOC,
};

export default class DocSpaceStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;
    private _docSpaceList: prjDocApi.DocSpace[] = [];
    private _docSpaceMap: Map<string, prjDocApi.DocSpace> = new Map();
    private _curDocSpaceId = "";
    private _pageType = PAGE_TYPE.PAGE_DOC_LIST;
    private _curDocId = "";
    private _curDoc: prjDocApi.Doc | undefined = undefined;
    private _recycleBin = false;
    private _inEdit = false;
    private _fromLink = false;

    get fromLink(): boolean {
        return this._fromLink;
    }
    set fromLink(val: boolean) {
        runInAction(() => {
            this._fromLink = val;
        });
    }
    get docSpaceList(): prjDocApi.DocSpace[] {
        return this._docSpaceList;
    }

    get curDocSpaceId(): string {
        return this._curDocSpaceId;
    }

    set curDocSpaceId(val: string) {
        const index = this.docSpaceList.findIndex(item => item.doc_space_id == val);
        if (index != -1) {
            this._curDocSpaceId = val;
        }
    }

    get pageType(): PAGE_TYPE {
        return this._pageType;
    }

    get curDocId(): string {
        return this._curDocId;
    }

    get curDoc(): prjDocApi.Doc | undefined {
        return this._curDoc;
    }

    get recycleBin(): boolean {
        return this._recycleBin;
    }
    set recycleBin(val: boolean) {
        runInAction(() => {
            this._recycleBin = val;
        });
    }

    get inEdit(): boolean {
        return this._inEdit;
    }

    get curDocSpace(): prjDocApi.DocSpace | undefined {
        if (this._recycleBin || this._curDocSpaceId == "") {
            return undefined;
        }
        return this._docSpaceMap.get(this._curDocSpaceId);
    }

    async loadDocSpace() {
        if (this._docSpaceList.length > 0 && this._docSpaceList[0].project_id == this.rootStore.projectStore.curProjectId) {
            return;
        }
        const res = await request(prjDocApi.list_doc_space({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
        }));
        if (res) {
            runInAction(() => {
                this._docSpaceList = res.doc_space_list;
                const tmpMap: Map<string, prjDocApi.DocSpace> = new Map();
                res.doc_space_list.forEach(docSpace => tmpMap.set(docSpace.doc_space_id, docSpace));
                this._docSpaceMap = tmpMap;
                this._curDocSpaceId = "";
                this._pageType = PAGE_TYPE.PAGE_DOC_LIST;
                this._curDocId = "";
                this._recycleBin = false;
            });
        }
    }

    removeDocSpace(docSpaceId: string) {
        runInAction(() => {
            if (docSpaceId == this._curDocSpaceId) {
                this._curDocSpaceId = "";
            }
            const tmpList = this._docSpaceList.filter(item => item.doc_space_id != docSpaceId);
            this._docSpaceList = tmpList;
        });
    }

    async updateDocSpace(docSpaceId: string) {
        if (this._docSpaceList.length == 0) {
            return;
        }
        const res = await request(prjDocApi.get_doc_space({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            doc_space_id: docSpaceId,
        }));
        if (res) {
            runInAction(() => {
                const tmpList = this._docSpaceList.slice();
                const index = tmpList.findIndex(item => item.doc_space_id == docSpaceId);
                if (index == -1) {
                    tmpList.push(res.doc_space);
                } else {
                    tmpList[index] = res.doc_space;
                }
                this._docSpaceList = tmpList;
                this._docSpaceMap.set(res.doc_space.doc_space_id, res.doc_space);
            });
        }
    }

    showDocList(docSpaceId: string, recycleBin: boolean) {
        runInAction(() => {
            this._curDocSpaceId = docSpaceId;
            this._recycleBin = recycleBin;
            this._pageType = PAGE_TYPE.PAGE_DOC_LIST;
            this._curDocId = "";
            this._curDoc = undefined;
        });
    }

    clearCurDoc() {
        runInAction(() => {
            this._curDoc = undefined;
            this._inEdit = false;
        });
    }

    async loadDoc(docId: string): Promise<prjDocApi.Doc | undefined> {
        if (docId == "") {
            return;
        }
        if (this._recycleBin) {
            const res = await request(
                prjDocApi.get_doc_in_recycle({
                    session_id: this.rootStore.userStore.sessionId,
                    project_id: this.rootStore.projectStore.curProjectId,
                    doc_space_id: this.curDocSpaceId,
                    doc_id: docId,
                }),
            );
            if (res) {
                return res.doc;
            }
        } else {
            const res = await request(
                prjDocApi.get_doc({
                    session_id: this.rootStore.userStore.sessionId,
                    project_id: this.rootStore.projectStore.curProjectId,
                    doc_space_id: this.curDocSpaceId,
                    doc_id: docId,
                }),
            );
            if (res) {
                return res.doc;
            }
        }
        return undefined;
    }

    async updateCurDoc() {
        if (this._curDocId != "" && this._recycleBin == false && this.inEdit == false) {
            const doc = await this.loadDoc(this._curDocId);
            if (doc != undefined) {
                runInAction(() => {
                    this._curDoc = doc;
                });
            }
        }
    }

    async showDoc(docId: string, inEdit: boolean, forceReload: boolean = false) {
        if (this._docSpaceList.length == 0) {
            await this.loadDocSpace();
        }
        let newDoc: prjDocApi.Doc | undefined = undefined;
        if (forceReload) {
            newDoc = await this.loadDoc(docId);
        } else {
            if (this._curDoc == undefined) {
                if (docId != "") {
                    newDoc = await this.loadDoc(docId);
                }
            } else {
                if (this._curDoc.doc_id == docId) {
                    newDoc = this._curDoc;
                } else {
                    if (docId != "") {
                        newDoc = await this.loadDoc(docId);
                    }
                }
            }
        }
        runInAction(() => {
            this._curDocId = docId;
            this._curDoc = newDoc;
            this._inEdit = inEdit;
            this._pageType = PAGE_TYPE.PAGE_DOC;
            if (inEdit && this._curDocSpaceId == "" && this._curDocId == "") { //新建文档
                this._curDocSpaceId = this.rootStore.projectStore.curProject?.default_doc_space_id ?? "";
            }
        });
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

    //离开编辑状态提示
    private _checkLeave = false;
    private _onLeave: (() => void) | undefined = undefined;

    get checkLeave(): boolean {
        return this._checkLeave;
    }
    get onLeave(): (() => void) | undefined {
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
            this._onLeave = undefined;
        });
    }

    reset() {
        runInAction(() => {
            this._pageType = PAGE_TYPE.PAGE_DOC_LIST;
            this._curDocId = "";
            this._curDoc = undefined;
            this._recycleBin = false;
            this._inEdit = false;
            this._showDocHistory = false;
        });
    }
}