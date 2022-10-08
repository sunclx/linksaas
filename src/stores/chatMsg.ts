
import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from '.';
import { request } from '@/utils/request';
import {
    list_msg,
    get_msg,
    clear_un_read_count,
    LIST_MSG_TYPE_BEFORE,
    LIST_MSG_TYPE_AFTER,
} from '@/api/project_channel';
import type { LIST_MSG_TYPE } from '@/api/project_channel';
import type { Msg } from '@/api/project_channel';


export class WebMsg {
    msg: Msg;
    hovered: boolean = false;
    checked: boolean = false;

    constructor(msg: Msg) {
        this.msg = msg;
        makeAutoObservable(this);
    }
}

class ChatMsgStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;
    private _msgList: WebMsg[] = [];
    replayRefMsgId: string = "";
    private _lastMsgId = "";
    private _listRefMsgId = "";
    skipNewMsgByUi = false;

    get msgList(): WebMsg[] {
        return this._msgList;
    }

    get checkedMsgList(): WebMsg[] {
        return this._msgList.filter(item => item.checked);
    }

    set listRefMsgId(val: string) {
        runInAction(() => {
            this._listRefMsgId = val;
        });
    }

    get listRefMsgId(): string {
        return this._listRefMsgId;
    }

    get containLastMsg(): boolean {
        const result = this._msgList.filter(item => item.msg.msg_id == this._lastMsgId).length > 0;
        console.log(`contain last msg result ${result}`);
        return result;
    }

    async loadMsg(projectId: string, channelId: string) {
        if (projectId == "" || channelId == "") {
            runInAction(() => {
                this._msgList = [];
                this.skipNewMsgByUi = false;
            });
            return;
        }
        if (projectId != this.rootStore.projectStore.curProjectId || channelId != this.rootStore.channelStore.curChannelId) {
            return;
        }
        runInAction(() => {
            this._msgList = [];
            this.skipNewMsgByUi = false;
        });

        const res = await request(list_msg({
            session_id: this.rootStore.userStore.sessionId,
            project_id: projectId,
            channel_id: channelId,
            refer_msg_id: this._listRefMsgId,
            list_msg_type: LIST_MSG_TYPE_BEFORE,
            limit: 20,
            include_ref_msg: true,
        }));
        if (res) {
            runInAction(() => {
                this._msgList = res.msg_list.map(item => new WebMsg(item));
                this._lastMsgId = res.last_msg_id;
            });
        }
        //清空当前频道未读状态
        if (this._msgList.filter(item => item.msg.msg_id == this._lastMsgId).length > 0 &&
            (this.rootStore.channelStore.curChannel?.unreadMsgCount || 0) > 0) {
            await request(clear_un_read_count(this.rootStore.userStore.sessionId, projectId, channelId));
            this.rootStore.channelStore.updateUnReadMsgCount(channelId);
            this.rootStore.projectStore.updateProjectUnreadMsgCount(projectId);
        }
    }

    async onNewMsg(projectId: string, channelId: string) {
        if (projectId != this.rootStore.projectStore.curProjectId || channelId != this.rootStore.channelStore.curChannelId) {
            return;
        }
        //检查当前是否包含最后最后一条消息
        if ((this._msgList.length > 0) && (this._msgList.filter(item => item.msg.msg_id == this._lastMsgId).length == 0)) {
            return;
        }
        if (this.skipNewMsgByUi) {
            return;
        }
        //找到最新的msgId
        let mostNewMsgId = "";
        if (this._msgList.length > 0) {
            mostNewMsgId = this._msgList[this._msgList.length - 1].msg.msg_id;
        }
        const res = await request(list_msg({
            session_id: this.rootStore.userStore.sessionId,
            project_id: projectId,
            channel_id: channelId,
            refer_msg_id: mostNewMsgId,
            list_msg_type: LIST_MSG_TYPE_AFTER,
            limit: 10,
            include_ref_msg: false,
        }));

        if (res) {
            const curMsgIdSet: Set<string> = new Set();
            this._msgList.forEach(item => curMsgIdSet.add(item.msg.msg_id));
            runInAction(() => {
                //去除重复的id
                res.msg_list.forEach(item => {
                    if (!(curMsgIdSet.has(item.msg_id))) {
                        this._msgList.push(new WebMsg(item));
                    }
                })
                //保持最多40条数据
                while (this._msgList.length > 40) {
                    this._msgList.shift();
                }
                this._lastMsgId = res.last_msg_id;
            });
        }
        //清空当前频道未读状态
        if (this._msgList.filter(item => item.msg.msg_id == this._lastMsgId).length > 0 &&
            (this.rootStore.channelStore.curChannel?.unreadMsgCount || 0) > 0) {
            await request(clear_un_read_count(this.rootStore.userStore.sessionId, projectId, channelId));
            this.rootStore.channelStore.updateUnReadMsgCount(channelId);
            this.rootStore.projectStore.updateProjectUnreadMsgCount(projectId);
        }
    }

    async loadMoreMsg(projectId: string, channelId: string, listMsgType: LIST_MSG_TYPE) {
        if (projectId == "" || channelId == "") {
            return;
        }
        if (projectId != this.rootStore.projectStore.curProjectId || channelId != this.rootStore.channelStore.curChannelId) {
            return;
        }
        let curRefMsgId = "";
        if (this._msgList.length > 0) {
            if (listMsgType == LIST_MSG_TYPE_AFTER) {
                curRefMsgId = this._msgList[this._msgList.length - 1].msg.msg_id;
            } else if (listMsgType == LIST_MSG_TYPE_BEFORE) {
                curRefMsgId = this._msgList[0].msg.msg_id;
            }
        }

        const res = await request(list_msg({
            session_id: this.rootStore.userStore.sessionId,
            project_id: projectId,
            channel_id: channelId,
            refer_msg_id: curRefMsgId,
            list_msg_type: listMsgType,
            limit: 10,
            include_ref_msg: false,
        }));
        if (res) {
            const curMsgIdSet: Set<string> = new Set();
            this._msgList.forEach(item => curMsgIdSet.add(item.msg.msg_id));
            if (listMsgType == LIST_MSG_TYPE_BEFORE) {
                res.msg_list.reverse();
            }
            runInAction(() => {
                //去除重复的id
                res.msg_list.forEach(item => {
                    if (!(curMsgIdSet.has(item.msg_id))) {
                        if (listMsgType == LIST_MSG_TYPE_BEFORE) {
                            this._msgList.unshift(new WebMsg(item));
                        } else if (listMsgType == LIST_MSG_TYPE_AFTER) {
                            this._msgList.push(new WebMsg(item));
                        }
                    }
                });
                //保持最多40条数据
                while (this._msgList.length > 40) {
                    if (listMsgType == LIST_MSG_TYPE_BEFORE) {
                        this._msgList.pop();
                    } else if (listMsgType == LIST_MSG_TYPE_AFTER) {
                        this._msgList.shift();
                    } else {
                        break;
                    }
                }
                this._lastMsgId = res.last_msg_id;
            });
        }
        //清空当前频道未读状态
        if (this._msgList.filter(item => item.msg.msg_id == this._lastMsgId).length > 0 &&
            (this.rootStore.channelStore.curChannel?.unreadMsgCount || 0) > 0) {
            await request(clear_un_read_count(this.rootStore.userStore.sessionId, projectId, channelId));
            this.rootStore.channelStore.updateUnReadMsgCount(channelId);
            this.rootStore.projectStore.updateProjectUnreadMsgCount(projectId);
        }
    }

    private _editMsg: WebMsg | undefined = undefined;

    getEditMsg(): WebMsg | undefined {
        return this._editMsg;
    }

    setEditMsg(val: WebMsg | undefined) {
        runInAction(() => {
            this._editMsg = val;
        });
    }

    async updateMsg(msgId: string) {
        const msgIndex = this._msgList.findIndex(item => item.msg.msg_id == msgId);
        if (msgIndex == -1) {
            return;
        }
        const res = await request(get_msg(this.rootStore.userStore.sessionId,
            this.rootStore.projectStore.curProjectId,
            this.rootStore.channelStore.curChannelId,
            msgId));
        if (res) {
            const index = this._msgList.findIndex(item => item.msg.msg_id == msgId);
            if (index != -1) {
                runInAction(() => {
                    this._msgList[index].msg = res.msg;
                });
            }
        }
    }
};

export default ChatMsgStore;