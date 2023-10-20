import { makeAutoObservable, runInAction } from 'mobx';
import type { ExecResult } from "@/api/project_cicd";
import { get_exec_result, calc_req_sign, REQ_ACTION_READ } from "@/api/project_cicd";
import { get_session } from '@/api/user';
import type { PipeLineExecState } from "@/api/cicd_runner";
import { get_exec_state } from "@/api/cicd_runner";
import { request } from '@/utils/request';

export class ResultStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _execResult: ExecResult | null = null;
    private _execState: PipeLineExecState | null = null;

    get execResult(): ExecResult | null {
        return this._execResult;
    }

    get execState(): PipeLineExecState | null {
        return this._execState;
    }

    reset() {
        runInAction(() => {
            this._execResult = null;
            this._execState = null;
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

    async loadExecState(projectId: string, pipeLineId: string) {
        if (this._execResult == null) {
            return;
        }
        const sessionId = await get_session();
        const signRes = await request(calc_req_sign({
            session_id: sessionId,
            project_id: projectId,
            req_action: REQ_ACTION_READ,
        }));
        try {
            const stateRes = await request(get_exec_state(this._execResult.runner_serv_addr, {
                project_id: projectId,
                pipe_line_id: pipeLineId,
                exec_id: this._execResult.exec_id,
                random_str: signRes.random_str,
                time_stamp: signRes.time_stamp,
                sign: signRes.sign,
            }));
            runInAction(() => {
                this._execState = stateRes.exec_state
            });
        } catch (e) {
            console.log(e)
        }
    }
}