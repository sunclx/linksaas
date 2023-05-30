import { list_all_keyword } from '@/api/project_idea';
import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import { request } from '@/utils/request';

export default class IdeaStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _keywordList: string[] = [];

    get keywordList(): string[] {
        return this._keywordList;
    }

    async loadKeyword(projectId: string) {
        runInAction(() => {
            this._keywordList = [];
        });
        const res = await request(list_all_keyword({
            session_id: this.rootStore.userStore.sessionId,
            project_id: projectId,
        }));
        runInAction(() => {
            this._keywordList = res.keyword_list;
        });
    }

    updateKeyword(addList: string[], removeList: string[]) {
        const tmpList = this._keywordList.filter(item => removeList.includes(item));
        runInAction(() => {
            this._keywordList = tmpList.concat(addList);
        });
    }

    private _showCreateIdea = false;
    private _createTitle = "";
    private _createContent = "";

    get showCreateIdea(): boolean {
        return this._showCreateIdea;
    }

    get createTitle(): string {
        return this._createTitle;
    }

    get createContent(): string {
        return this._createContent;
    }

    setShowCreateIdea(title: string, content: string) {
        runInAction(() => {
            this._showCreateIdea = true;
            this._createTitle = title;
            this._createContent = content;
        });
    }

    closeShowCreateIdea() {
        runInAction(() => {
            this._showCreateIdea = false;
            this._createTitle = "";
            this._createContent = "";
        });
    }
}