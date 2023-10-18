import { makeAutoObservable, runInAction } from 'mobx';
import type { ExecResult } from "@/api/project_cicd";
import { get_exec_result } from "@/api/project_cicd";
import { get_session } from '@/api/user';


export class ResultStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _execResult: ExecResult | null = null;

    get execResult(): ExecResult | null {
        return this._execResult;
    }

    set execResult(val: ExecResult | null) {
        runInAction(() => {
            this._execResult = val;
        });
    }

    async loadExecResult(projectId: string, pipeLineId: string, execId: string) {
        const sessionId = await get_session();
        const res = await get_exec_result({
            session_id: sessionId,
            project_id: projectId,
            pipe_line_id: pipeLineId,
            exec_id: execId,
        });

        runInAction(() => {
            this._execResult = res.result;
        });
    }
}