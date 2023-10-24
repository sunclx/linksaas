import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import type { EntryInfo } from "@/api/project_entry";
import { get as get_entry } from "@/api/project_entry";
import { request } from '@/utils/request';
import React from 'react';

export default class EntryStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _curEntry: EntryInfo | null = null;
    private _editEntryId = "";
    private _entryList: EntryInfo[] = [];
    private _entryExtra: React.ReactNode | null = null;

    reset() {
        runInAction(() => {
            this._curEntry = null;
            this._editEntryId = "";
            this._entryExtra = null;
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

    get entryExtra(): React.ReactNode | null {
        return this._entryExtra;
    }

    set entryExtra(val: React.ReactNode | null) {
        runInAction(()=>{
            this._entryExtra = val;
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
        });
    }
}