import { makeAutoObservable, runInAction } from 'mobx';
import type { PipeLine, SimpleCredential, ExecJob } from "@/api/project_cicd";
import { get_pipe_line, list_credential } from "@/api/project_cicd";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";


export class PipeLineStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _initVersion = 0;
    private _hasChange = false;
    private _pipeLine: PipeLine | null = null;

    get initVersion(): number {
        return this._initVersion;
    }

    incInitVersion() {
        runInAction(() => {
            this._initVersion += 1;
        });
    }

    get hasChange(): boolean {
        return this._hasChange;
    }

    set hasChange(val: boolean) {
        runInAction(() => {
            this._hasChange = val;
        });
    }

    get pipeLine(): PipeLine | null {
        return this._pipeLine;
    }

    set pipeLine(val: PipeLine | null) {
        runInAction(() => {
            this._pipeLine = val;
        });
    }
    
    async loadPipeLine(projectId: string, pipeLineId: string, withUpdateTime: boolean, updateTime: number) {
        const sessionId = await get_session();
        const res = await request(get_pipe_line({
            session_id: sessionId,
            project_id: projectId,
            pipe_line_id: pipeLineId,
            with_update_time: withUpdateTime,
            update_time: updateTime,
        }));
        runInAction(() => {
            this._pipeLine = res.pipe_line;
        });
    }

    getExecJob(jobId: string): ExecJob | null {
        if (this._pipeLine == null) {
            return null;
        }
        for (const job of this._pipeLine.exec_job_list) {
            if (job.job_id == jobId) {
                return job;
            }
        }
        return null;
    }

    removeExecJob(jobId: string) {
        if (this._pipeLine == null) {
            return;
        }
        const tmpJobList = this._pipeLine.exec_job_list.filter(item => item.job_id !== jobId);
        for (const tmpJob of tmpJobList) {
            tmpJob.depend_job_list = tmpJob.depend_job_list.filter(item => item !== jobId);
        }
        runInAction(() => {
            if (this._pipeLine !== null) {
                this._pipeLine = {
                    ...(this._pipeLine),
                    exec_job_list: tmpJobList,
                };
            }
        });
    }

    removeJobDepend(jobId: string, dependJobId: string) {
        if (this._pipeLine == null) {
            return;
        }
        const tmpJobList = this._pipeLine.exec_job_list.slice();
        for (const tmpJob of tmpJobList) {
            if (tmpJob.job_id == jobId) {
                tmpJob.depend_job_list = tmpJob.depend_job_list.filter(item => item != dependJobId);
            }
        }
        runInAction(() => {
            if (this._pipeLine !== null) {
                this._pipeLine = {
                    ...(this._pipeLine),
                    exec_job_list: tmpJobList,
                };
            }
        });
    }

    //=================================登录凭证=======================
    private _credList: SimpleCredential[] = [];

    get credList() {
        return this._credList;
    }
    async loadCredList(projectId: string) {
        runInAction(() => {
            this._credList = [];
        });
        const sessionId = await get_session();
        const res = await request(list_credential({
            session_id: sessionId,
            project_id: projectId,
        }));

        runInAction(() => {
            this._credList = res.credential_list;
        });
    }
}