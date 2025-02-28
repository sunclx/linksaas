import React from "react";
import { makeAutoObservable, runInAction } from 'mobx';
import type { CommitGraphInfo, LocalRepoInfo, LocalRepoFileDiffInfo, GitInfo } from "@/api/local_repo";
import { list_repo } from "@/api/local_repo";

export type MainMenuItem = {
    menuType: "none" | "gitGraph" | "commitProcess" | "stashList" | "remote";
    menuValue: string;
    menuExtraValue?: string;
};

class StateStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _repoInfo: LocalRepoInfo | null = null;
    private _gitInfo: GitInfo | null = null;
    private _dataVersion = 0;

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

    get gitInfo() {
        return this._gitInfo;
    }

    set gitInfo(val: GitInfo | null) {
        runInAction(() => {
            this._gitInfo = val;
        });
    }

    get dataVersion() {
        return this._dataVersion;
    }

    incDataVersion() {
        runInAction(() => {
            this._dataVersion += 1;
        });
    }

    private _mainItem: MainMenuItem = { menuType: "none", menuValue: "" };

    get mainItem() {
        return this._mainItem;
    }

    set mainItem(val: MainMenuItem) {
        runInAction(() => {
            this._mainItem = val;
        });
    }

    private _curCommit: CommitGraphInfo | string | null = null;
    private _curDiffFile: LocalRepoFileDiffInfo | null = null;

    get curCommit() {
        return this._curCommit;
    }

    set curCommit(val: CommitGraphInfo | string | null) {
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