import React from "react";
import { makeAutoObservable, runInAction } from 'mobx';
import type { ApiGroupInfo, ApiItemInfo } from "@/api/http_custom";
import { get_session } from "@/api/user";
import type { ApiCollInfo } from "@/api/api_collection";
import { get as get_coll_info } from "@/api/api_collection";
import { request } from "@/utils/request";
import { list_api_item, list_group, get_custom, get_api_item } from "@/api/http_custom";


class ApiStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _projectId = "";
    private _apiCollId = "";
    private _remoteAddr = "";
    private _canEdit = false;
    private _canAdmin = false;
    private _showComment = false;
    private _userId = "";

    get projectId(): string {
        return this._projectId;
    }
    set projectId(val: string) {
        runInAction(() => {
            this._projectId = val;
        });
    }

    get apiCollId(): string {
        return this._apiCollId;
    }

    set apiCollId(val: string) {
        runInAction(() => {
            this._apiCollId = val;
        });
    }

    get remoteAddr(): string {
        return this._remoteAddr;
    }

    set remoteAddr(val: string) {
        runInAction(() => {
            this._remoteAddr = val;
        });
    }

    get canEdit(): boolean {
        return this._canEdit;
    }

    set canEdit(val: boolean) {
        runInAction(() => {
            this._canEdit = val;
        });
    }

    get canAdmin(): boolean {
        return this._canAdmin;
    }

    set canAdmin(val: boolean) {
        runInAction(() => {
            this._canAdmin = val;
        });
    }

    get showComment(): boolean {
        return this._showComment;
    }

    set showComment(val: boolean) {
        runInAction(() => {
            this._showComment = val;
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

    //=========================================================

    private _sessionId = "";

    get sessionId(): string {
        return this._sessionId;
    }

    async initUser() {
        const tmpSessId = await get_session();
        runInAction(() => {
            this._sessionId = tmpSessId;
        });
    }

    //=======================================================
    private _apiCollInfo: ApiCollInfo | null = null;
    private _protocol = "https"

    get apiCollInfo(): ApiCollInfo | null {
        return this._apiCollInfo;
    }
    get protocol(): string {
        return this._protocol;
    }

    async loadApiCollInfo() {
        const res = await request(get_coll_info({
            session_id: this._sessionId,
            project_id: this._projectId,
            api_coll_id: this._apiCollId,
        }));
        const res2 = await request(get_custom({
            session_id: this._sessionId,
            project_id: this._projectId,
            api_coll_id: this._apiCollId,
        }));
        runInAction(() => {
            this._apiCollInfo = res.info;
            this._protocol = res2.extra_info.net_protocol;
        });
    }
    //==========================================================
    private _tabApiIdList: string[] = [];

    get tabApiIdList(): string[] {
        return this._tabApiIdList;
    }

    set tabApiIdList(val: string[]) {
        runInAction(() => {
            this._tabApiIdList = val;
            console.log(val);
        });
    }
    //==========================================================

    private _groupList: ApiGroupInfo[] = [];
    private _apiItemList: ApiItemInfo[] = [];

    get groupList(): ApiGroupInfo[] {
        return this._groupList;
    }

    get apiItemList(): ApiItemInfo[] {
        return this._apiItemList;
    }

    async loadGroupList() {
        const res = await request(list_group({
            session_id: this._sessionId,
            project_id: this._projectId,
            api_coll_id: this._apiCollId,
        }));
        runInAction(() => {
            this._groupList = res.group_list;
        });
    }

    async loadApiItemList() {
        const res = await request(list_api_item({
            session_id: this._sessionId,
            project_id: this._projectId,
            api_coll_id: this._apiCollId,
            filter_by_group_id: false,
            group_id: "",
        }));
        runInAction(() => {
            this._apiItemList = res.item_list;
        });
    }

    getApiItem(apiItemId: string): ApiItemInfo | null {
        const index = this._apiItemList.findIndex(item => item.api_item_id == apiItemId);
        if (index != -1) {
            return this._apiItemList[index];
        }
        return null;
    }

    removeApiItem(apiItemId: string) {
        const tmpList = this._apiItemList.filter(item => item.api_item_id != apiItemId);
        const tmpIdList = this._tabApiIdList.filter(id => id != apiItemId);
        runInAction(() => {
            this._apiItemList = tmpList;
            this._tabApiIdList = tmpIdList;
        });
    }

    async updateApiItem(apiItemId: string) {
        const res = await request(get_api_item({
            session_id: this._sessionId,
            project_id: this._projectId,
            api_coll_id: this._apiCollId,
            api_item_id: apiItemId,
        }));
        const tmpList = this._apiItemList.slice();
        const index = tmpList.findIndex(item => item.api_item_id == apiItemId);
        if (index != -1) {
            tmpList[index] = res.item_info;
        } else {
            tmpList.push(res.item_info);
        }
        runInAction(() => {
            this._apiItemList = tmpList;
        });
    }
}

const stores = React.createContext({
    api: new ApiStore(),
});

export const useCustomStores = () => React.useContext(stores);

export default stores;
