import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import type { IssueInfo, ISSUE_TYPE } from '@/api/project_issue';
import { SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC } from '@/api/project_issue';
import { ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, list as list_issue, get as get_issue } from '@/api/project_issue';
import { request } from '@/utils/request';

export default class SpritStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _curSpritVersion: number = 0;
    private _taskList: IssueInfo[] = [];
    private _bugList: IssueInfo[] = [];

    get taskList(): IssueInfo[] {
        return this._taskList;
    }

    get bugList(): IssueInfo[] {
        return this._bugList;
    }

    get curSpritVersion(): number {
        return this._curSpritVersion;
    }

    incCurSpritVersion() {
        runInAction(() => {
            this._curSpritVersion += 1;
        });
    }

    async loadCurSprit() {
        runInAction(() => {
            this._curSpritVersion = 0;
            this._taskList = [];
            this._bugList = [];
        });
        await this.loadIssue(ISSUE_TYPE_TASK);
        await this.loadIssue(ISSUE_TYPE_BUG);
    }

    private async loadIssue(issueType: ISSUE_TYPE) {
        if (this.rootStore.projectStore.curEntry == null) {
            return;
        }
        const res = await request(list_issue({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            list_param: {
                filter_by_issue_type: true,
                issue_type: issueType,
                filter_by_state: false,
                state_list: [],
                filter_by_create_user_id: false,
                create_user_id_list: [],
                filter_by_assgin_user_id: false,
                assgin_user_id_list: [],
                assgin_user_type: 0,
                filter_by_sprit_id: true,
                sprit_id_list: [this.rootStore.projectStore.curEntry.entry_id],
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
            sort_type: SORT_TYPE_DSC,
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: 0,
            limit: 999,
        }));
        runInAction(() => {
            if (issueType == ISSUE_TYPE_TASK) {
                this._taskList = res.info_list;
            } else if (issueType == ISSUE_TYPE_BUG) {
                this._bugList = res.info_list;
            }
        });
    }

    addIssueList(issueList: IssueInfo[]) {
        if (issueList.length == 0) {
            return;
        }
        const tmpTaskList = this._taskList.slice();
        const tmpBugList = this._bugList.slice();
        for (const issue of issueList) {
            if ((issue.issue_type == ISSUE_TYPE_TASK) && (tmpTaskList.findIndex(item => item.issue_id == issue.issue_id) == -1)) {
                tmpTaskList.unshift(issue);
            } else if ((issue.issue_type == ISSUE_TYPE_BUG) && (tmpBugList.findIndex(item => item.issue_id == issue.issue_id) == -1)) {
                tmpBugList.unshift(issue);
            }
        }
        tmpTaskList.sort((a, b) => b.update_time - a.update_time);
        tmpBugList.sort((a, b) => b.update_time - a.update_time);
        runInAction(() => {
            this._taskList = tmpTaskList;
            this._bugList = tmpBugList;
        });
    }

    removeIssue(issueId: string) {
        const tmpTaskList = this._taskList.filter(item => item.issue_id != issueId);
        const tmpBugList = this._bugList.filter(item => item.issue_id != issueId);
        runInAction(() => {
            this._taskList = tmpTaskList;
            this._bugList = tmpBugList;
        });
    }

    async onNewIssue(issueId: string) {
        const res = await request(get_issue(this.rootStore.userStore.sessionId, this.rootStore.projectStore.curProjectId, issueId));
        if (res.info.issue_type == ISSUE_TYPE_TASK) {
            const tmpList = this._taskList.slice();
            const index = tmpList.findIndex(item => item.issue_id == issueId);
            if (index != -1) {
                tmpList[index] = res.info;
            } else {
                tmpList.unshift(res.info);
            }
            runInAction(() => {
                this._taskList = tmpList;
            });
        } else if (res.info.issue_type == ISSUE_TYPE_BUG) {
            const tmpList = this._bugList.slice();
            const index = tmpList.findIndex(item => item.issue_id == issueId);
            if (index != -1) {
                tmpList[index] = res.info;
            } else {
                tmpList.unshift(res.info);
            }
            runInAction(() => {
                this._bugList = tmpList;
            })
        }
    }

    async updateIssue(issueId: string) {
        const res = await request(get_issue(this.rootStore.userStore.sessionId, this.rootStore.projectStore.curProjectId, issueId));
        const taskIndex = this._taskList.findIndex(item => item.issue_id == issueId);
        const bugIndex = this._bugList.findIndex(item => item.issue_id == issueId);
        if (taskIndex == -1 && bugIndex == -1) {
            return;
        }
        runInAction(() => {
            if (taskIndex != -1) {
                const tmpList = this._taskList.slice();
                tmpList[taskIndex] = res.info;
                this._taskList = tmpList;
            }
            if (bugIndex != -1) {
                const tmpList = this._bugList.slice();
                tmpList[bugIndex] = res.info;
                this._bugList = tmpList;
            }
        });
    }


    get allTimeReady(): boolean {
        if (this._bugList.length == 0 && this._taskList.length == 0) {
            return false;
        }
        for (const bug of this._bugList) {
            if (bug.exec_user_id == "" || bug.has_start_time == false || bug.has_end_time == false || bug.has_estimate_minutes == false || bug.has_remain_minutes == false) {
                return false;
            }
            if (bug.has_start_time && bug.has_end_time && bug.start_time > bug.end_time) {
                return false;
            }
            if (bug.has_estimate_minutes && bug.has_remain_minutes && bug.remain_minutes > bug.estimate_minutes) {
                return false;
            }
        }
        for (const task of this._taskList) {
            if (task.exec_user_id == "" || task.has_start_time == false || task.has_end_time == false || task.has_estimate_minutes == false || task.has_remain_minutes == false) {
                return false;
            }
            if (task.has_start_time && task.has_end_time && task.start_time > task.end_time) {
                return false;
            }
            if (task.has_estimate_minutes && task.has_remain_minutes && task.remain_minutes > task.estimate_minutes) {
                return false;
            }
        }
        return true;
    }

    //创建工作计划标记
    private _showCreateSprit = false;

    get showCreateSprit(): boolean {
        return this._showCreateSprit;
    }
    set showCreateSprit(val: boolean) {
        runInAction(() => {
            this._showCreateSprit = val;
        });
    }
}