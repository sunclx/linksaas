import { makeAutoObservable, runInAction } from 'mobx';

export class ParamStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _projectId = "";
    private _fsId = "";

    get projectId(): string {
        return this._projectId;
    }

    set projectId(val: string) {
        runInAction(() => {
            this._projectId = val;
        });
    }

    get fsId(): string {
        return this._fsId;
    }

    set fsId(val: string) {
        runInAction(() => {
            this._fsId = val;
        });
    }

    //==================================权限==========================
    private _canUpdate = false;
    private _canExec = false;

    get canUpdate() {
        return this._canUpdate;
    }

    set canUpdate(val: boolean) {
        runInAction(() => {
            this._canUpdate = val;
        });
    }

    get canExec() {
        return this._canExec;
    }

    set canExec(val: boolean) {
        runInAction(() => {
            this._canExec = val;
        });
    }
}