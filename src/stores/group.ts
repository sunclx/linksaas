import type { GroupInfo } from "@/api/group";
import type { PostKeyInfo } from "@/api/group_post";
import { makeAutoObservable, runInAction } from 'mobx';

export default class GroupStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _curGroup: GroupInfo | null = null;
    private _curPostKey: PostKeyInfo | null = null;

    get curGroup(): GroupInfo | null {
        return this._curGroup;
    }

    set curGroup(val: GroupInfo | null) {
        runInAction(() => {
            this._curGroup = val;
        });
    }

    get curPostKey(): PostKeyInfo | null {
        return this._curPostKey;
    }

    set curPostKey(val: PostKeyInfo | null) {
        runInAction(() => {
            this._curPostKey = val;
        });
    }
}