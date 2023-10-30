import { makeAutoObservable, runInAction } from 'mobx';
import type { ReactFlowInstance } from 'reactflow';

export class ParamStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _projectId = "";
    private _fsId = "";
    private _userId = "";

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

    get userId(): string {
        return this._userId;
    }

    set userId(val: string) {
        runInAction(() => {
            this._userId = val;
        });
    }

    //==================================权限==========================
    private _canUpdate = false;
    private _canExec = false;
    private _canAdmin = false;

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

    get canAdmin() {
        return this._canAdmin;
    }

    set canAdmin(val: boolean) {
        runInAction(() => {
            this._canAdmin = val;
        });
    }

    //==========================reactFlow相关===========================
    private _flowInstance: ReactFlowInstance | null = null;

    get flowInstance(): ReactFlowInstance | null {
        return this._flowInstance;
    }

    set flowInstance(val: ReactFlowInstance | null) {
        runInAction(() => {
            this._flowInstance = val;
        });
    }
}