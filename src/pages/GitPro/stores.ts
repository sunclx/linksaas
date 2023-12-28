import React from "react";
import { makeAutoObservable, runInAction } from 'mobx';
import type { CommitGraphInfo, LocalRepoInfo, LocalRepoFileDiffInfo } from "@/api/local_repo";
import { list_repo } from "@/api/local_repo";


class StateStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _repoInfo: LocalRepoInfo | null = null;

    get repoInfo() {
        return this._repoInfo;
    }

    async loadRepoInfo(repoId: string) {
        const res = await list_repo();
        for (const repo of res) {
            if (repo.id == repoId) {
                runInAction(() => {
                    this._repoInfo = repo;
                });
            }
        }
    }

    private _commitIdForGraph = "";

    get commitIdForGraph() {
        return this._commitIdForGraph;
    }

    set commitIdForGraph(val: string) {
        runInAction(() => {
            this._commitIdForGraph = val;
        });
    }

    private _curCommit: CommitGraphInfo | null = null;
    private _curDiffFile: LocalRepoFileDiffInfo | null = null;

    get curCommit() {
        return this._curCommit;
    }

    set curCommit(val: CommitGraphInfo | null) {
        runInAction(() => {
            this._curCommit = val;
        });
    }

    get curDiffFile() {
        return this._curDiffFile;
    }

    set curDiffFile(val: LocalRepoFileDiffInfo | null) {
        runInAction(() => {
            this._curDiffFile = val;
        });
    }
}

const stores = React.createContext(new StateStore());

export const useGitProStores = () => React.useContext(stores);

export default stores;