import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import type { EntryInfo, ENTRY_TYPE } from "@/api/project_entry";
import { get as get_entry } from "@/api/project_entry";
import { request } from '@/utils/request';

export default class EntryStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _curEntry: EntryInfo | null = null;
    private _editEntryId = "";
    private _entryList: EntryInfo[] = [];
    private _sysEntryList: EntryInfo[] = [];
    private _createEntryType: ENTRY_TYPE | null = null;
    private _curFolderId = "";
    private _dataVersion = 0;

    reset() {
        runInAction(() => {
            this._curEntry = null;
            this._editEntryId = "";
            this._createEntryType = null;
        });
    }

    get curFolderId() {
        return this._curFolderId;
    }

    set curFolderId(val: string) {
        runInAction(() => {
            this._curFolderId = val;
        });
    }

    get curEntry(): EntryInfo | null {
        return this._curEntry;
    }

    set curEntry(val: EntryInfo | null) {
        runInAction(() => {
            this._curEntry = val;
        });
    }

    get editEntryId(): string {
        return this._editEntryId;
    }

    set editEntryId(val: string) {
        runInAction(() => {
            this._editEntryId = val;
        });
    }

    get entryList(): EntryInfo[] {
        return this._entryList;
    }

    set entryList(val: EntryInfo[]) {
        runInAction(() => {
            this._entryList = val;
        });
    }

    get sysEntryList(): EntryInfo[] {
        return this._sysEntryList;
    }

    set sysEntryList(val: EntryInfo[]) {
        runInAction(() => {
            this._sysEntryList = val;
        });
    }

    get createEntryType(): ENTRY_TYPE | null {
        return this._createEntryType;
    }

    set createEntryType(val: ENTRY_TYPE | null) {
        runInAction(() => {
            this._createEntryType = val;
        });
    }

    get dataVersion(): number {
        return this._dataVersion;
    }
    incDataVersion() {
        runInAction(() => {
            this._dataVersion += 1;
        });
    }

    async loadEntry(entryId: string) {
        const res = await request(get_entry({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            entry_id: entryId,
        }));

        runInAction(() => {
            this._curEntry = res.entry;
        });
    }

    async updateEntry(entryId: string) {
        const res = await request(get_entry({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            entry_id: entryId,
        }));
        runInAction(() => {
            if (entryId == (this._curEntry?.entry_id ?? "")) {
                this._curEntry = res.entry;
            }
            const tmpList = this._entryList.slice();
            const index = tmpList.findIndex(item => item.entry_id == entryId);
            if (index != -1) {
                tmpList[index] = res.entry;
                this._entryList = tmpList;
            }

            const tmpList2 = this._sysEntryList.slice();
            const index2 = tmpList2.findIndex(item => item.entry_id == entryId);
            if (index2 != -1) {
                tmpList2[index] = res.entry;
                this._sysEntryList = tmpList2;
            }
        });
    }
}