import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import * as issueApi from '@/api/project_issue';
import { request } from '@/utils/request';

export default class IssueStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _prjTodoTaskList: issueApi.IssueInfo[] = [];
    private _prjTodoBugList: issueApi.IssueInfo[] = [];

    get prjTodoTaskList(): issueApi.IssueInfo[] {
        return this._prjTodoTaskList;
    }

    get prjTodoBugList(): issueApi.IssueInfo[] {
        return this._prjTodoBugList;
    }

    async loadPrjTodoIssue(projectId: string, issueType: issueApi.ISSUE_TYPE) {
        const req: issueApi.ListRequest = {
            session_id: this.rootStore.userStore.sessionId,
            project_id: projectId,
            list_param: {
                filter_by_issue_type: true,
                issue_type: issueType,
                filter_by_state: true,
                state_list: [issueApi.ISSUE_STATE_PROCESS, issueApi.ISSUE_STATE_CHECK],
                filter_by_create_user_id: false,
                create_user_id_list: [],
                filter_by_assgin_user_id: true,
                assgin_user_id_list: [this.rootStore.userStore.userInfo.userId],
                assgin_user_type: issueApi.ASSGIN_USER_ALL,
                filter_by_sprit_id: false,
                sprit_id_list: [],
                filter_by_create_time: false,
                from_create_time: 0,
                to_create_time: 0,
                filter_by_update_time: false,
                from_update_time: 0,
                to_update_time: 0,
                filter_by_title_keyword: false,
                title_keyword: "",
                filter_by_tag_id_list: false,
                tag_id_list: [],
                filter_by_watch: false,
                watch: false,
                ///任务相关
                filter_by_task_priority: false,
                task_priority_list: [],
                ///缺陷相关
                filter_by_software_version: false,
                software_version_list: [],
                filter_by_bug_priority: false,
                bug_priority_list: [],
                filter_by_bug_level: false,
                bug_level_list: [],
            },
            sort_type: issueApi.SORT_TYPE_DSC,
            sort_key: issueApi.SORT_KEY_UPDATE_TIME,
            offset: 0,
            limit: 99,
        };
        const res = await request(issueApi.list(req));
        runInAction(() => {
            if (issueType == issueApi.ISSUE_TYPE_TASK) {
                this._prjTodoTaskList = res.info_list;
            } else if (issueType == issueApi.ISSUE_TYPE_BUG) {
                this._prjTodoBugList = res.info_list;
            }
        });
    }
}