import { list_all_keyword, list_tag, get_tag } from '@/api/project_idea';
import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import { request } from '@/utils/request';
import type { IdeaTag } from "@/api/project_idea";

export default class IdeaStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _keywordList: string[] = [];
    private _tagList: IdeaTag[] = [];

    get keywordList(): string[] {
        return this._keywordList;
    }

    get tagList(): IdeaTag[] {
        return this._tagList;
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

    async loadTagList(projectId: string) {
        runInAction(() => {
            this._tagList = [];
        });
        const res = await request(list_tag({
            session_id: this.rootStore.userStore.sessionId,
            project_id: projectId,
        }));
        runInAction(() => {
            this._tagList = res.tag_list;
        });
    }

    updateKeyword(addList: string[], removeList: string[]) {
        const tmpList = this._keywordList.filter(item => removeList.includes(item));
        runInAction(() => {
            this._keywordList = tmpList.concat(addList);
        });
    }

    async updateTag(tagId: string) {
        const res = await request(get_tag({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            tag_id: tagId,
        }));
        const tmpList = this._tagList.filter(item => item.tag_id != tagId);
        tmpList.unshift(res.tag);
        runInAction(() => {
            this._tagList = tmpList;
        });
    }

    removeTag(tagId: string) {
        const tmpList = this._tagList.filter(item => item.tag_id != tagId);
        runInAction(() => {
            this._tagList = tmpList;
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