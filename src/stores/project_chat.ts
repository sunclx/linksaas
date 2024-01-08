import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import type { ChatGroupInfo, ChatGroupMemberInfo, ChatMsgInfo, LIST_MSG_TYPE } from "@/api/project_chat";
import { list_group, get_group, list_group_member, list_all_group_member, list_all_last_msg, get_msg, list_msg, LIST_MSG_BEFORE, LIST_MSG_AFTER } from "@/api/project_chat";
import { request } from '@/utils/request';

const MAC_MSG_CACHE_SIZE = 60;

export class ChatGroupWithMember {
    constructor(groupInfo: ChatGroupInfo) {
        makeAutoObservable(this);
        this._groupInfo = groupInfo;
    }
    private _groupInfo: ChatGroupInfo;
    private _memberList: ChatGroupMemberInfo[] = [];
    private _lastMsg: ChatMsgInfo | undefined = undefined;

    get groupInfo() {
        return this._groupInfo;
    }

    set groupInfo(val: ChatGroupInfo) {
        runInAction(() => {
            this._groupInfo = val;
        });
    }

    get memberList() {
        return this._memberList;
    }

    set memberList(val: ChatGroupMemberInfo[]) {
        runInAction(() => {
            this._memberList = val;
        });
    }

    get lastMsg() {
        return this._lastMsg;
    }

    set lastMsg(val: ChatMsgInfo | undefined) {
        runInAction(() => {
            this._lastMsg = val;
        });
    }

    get sortValue() {
        if (this._lastMsg != undefined && this._lastMsg.send_time > this._groupInfo.sort_value) {
            return this._lastMsg.send_time;
        } else {
            return this._groupInfo.sort_value;
        }
    }
}

export default class ProjectChatStore {
    constructor(rootStore: RootStore, projectId: string) {
        this.rootStore = rootStore;
        this.curProjectId = projectId;
        makeAutoObservable(this);
        this.loadChatGroupList();
    }
    private rootStore: RootStore;
    private curProjectId: string;
    private _chatGroupList: ChatGroupWithMember[] = [];
    private hasInitMember = false;
    private hasInitLastMsg = false;

    get chatGroupList() {
        return this._chatGroupList;
    }

    get totalUnread() {
        let count = 0;
        for (const cgm of this._chatGroupList) {
            count += cgm.groupInfo.unread_count;
        }
        return count;
    }

    async loadChatGroupList() {
        const res = await request(list_group({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.curProjectId,
            skip_system_group: false,
        }));

        let tmpList = res.chat_group_list.map(item => new ChatGroupWithMember(item));
        tmpList = tmpList.sort((a, b) => b.sortValue - a.sortValue);
        runInAction(() => {
            this._chatGroupList = tmpList;
        });
    }

    async loadGroupMember() {
        if (this.hasInitMember) {
            return;
        }
        const res = await request(list_all_group_member({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.curProjectId,
        }));
        const tmpMap: Map<string, ChatGroupMemberInfo[]> = new Map();
        for (const member of res.member_list) {
            let oldList = tmpMap.get(member.chat_group_id);
            if (oldList == undefined) {
                oldList = [];
            }
            oldList.push(member);
            tmpMap.set(member.chat_group_id, oldList);
        }
        let tmpList = this._chatGroupList.slice();
        for (const cgm of tmpList) {
            const memberList = tmpMap.get(cgm.groupInfo.chat_group_id);
            if (memberList == undefined) {
                continue;
            }
            cgm.memberList = memberList;
        }
        tmpList = tmpList.sort((a, b) => b.sortValue - a.sortValue);
        runInAction(() => {
            this._chatGroupList = tmpList;
            this.hasInitMember = true;
        });
    }

    async loadLastMsg() {
        if (this.hasInitLastMsg) {
            return;
        }
        const res = await request(list_all_last_msg({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.curProjectId,
        }));
        const tmpMap: Map<string, ChatMsgInfo> = new Map();
        for (const msg of res.msg_list) {
            tmpMap.set(msg.chat_group_id, msg);
        }
        let tmpList = this._chatGroupList.slice();
        for (const cgm of tmpList) {
            cgm.lastMsg = tmpMap.get(cgm.groupInfo.chat_group_id);
        }
        tmpList = tmpList.sort((a, b) => b.sortValue - a.sortValue);
        runInAction(() => {
            this._chatGroupList = tmpList;
            this.hasInitLastMsg = true;
        });
    }

    async onUpdateGroup(groupId: string) {
        const tmpList = this._chatGroupList.slice();
        const index = tmpList.findIndex(item => item.groupInfo.chat_group_id == groupId);
        if (index == -1) {
            return;
        }
        const groupRes = await request(get_group({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.curProjectId,
            chat_group_id: groupId,
        }));
        tmpList[index].groupInfo = groupRes.chat_group;
        runInAction(() => {
            this._chatGroupList = tmpList;
        });
    }

    async onUpdateMember(groupId: string) {
        const groupRes = await request(get_group({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.curProjectId,
            chat_group_id: groupId,
        }));
        const newGroup = new ChatGroupWithMember(groupRes.chat_group);
        if (this.hasInitMember) {
            const memberRes = await request(list_group_member({
                session_id: this.rootStore.userStore.sessionId,
                project_id: this.curProjectId,
                chat_group_id: groupId,
            }));
            newGroup.memberList = memberRes.member_list;
        }

        let tmpList = this._chatGroupList.slice();
        const index = tmpList.findIndex(item => item.groupInfo.chat_group_id == groupId);
        if (index == -1) {
            tmpList.push(newGroup);
        } else {
            tmpList[index] = newGroup;
        }
        tmpList = tmpList.sort((a, b) => b.sortValue - a.sortValue);
        runInAction(() => {
            this._chatGroupList = tmpList;
        });
    }

    async onLeaveGroup(groupId: string) {
        const tmpList = this._chatGroupList.filter(item => item.groupInfo.chat_group_id != groupId);
        runInAction(() => {
            this._chatGroupList = tmpList;
        });
    }

    //=============================================沟通消息相关=================================
    private _curGroupId = "";
    private _curGroupMsgList: ChatMsgInfo[] = [];
    private _curRefMsgId = "";

    get curGroupMsgList() {
        return this._curGroupMsgList;
    }

    get curRefMsgId() {
        return this._curRefMsgId;
    }

    resetCurRefMsgId() {
        runInAction(() => {
            this._curRefMsgId = "";
        });
    }

    private async loadMsgList(groupId: string) {
        runInAction(() => {
            this._curGroupMsgList = [];
            this._curRefMsgId = "";
        });
        const res = await request(list_msg({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.curProjectId,
            chat_group_id: groupId,
            list_msg_type: LIST_MSG_BEFORE,
            ref_chat_msg_id: "",
            limit: 20,
        }));
        runInAction(() => {
            this._curGroupMsgList = res.msg_list;
            if (res.msg_list.length > 0) {
                this._curRefMsgId = res.msg_list[res.msg_list.length - 1].chat_msg_id;
            }
        });
    }

    async loadMoreMsg(listType: LIST_MSG_TYPE) {
        if (this._curGroupMsgList.length == 0 || this._curGroupId == "") {
            return;
        }
        const tmpList = this._curGroupMsgList.slice();
        let tmpRefMsgId = "";
        if (listType == LIST_MSG_BEFORE) {
            const res = await request(list_msg({
                session_id: this.rootStore.userStore.sessionId,
                project_id: this.curProjectId,
                chat_group_id: this._curGroupId,
                list_msg_type: LIST_MSG_BEFORE,
                ref_chat_msg_id: this._curGroupMsgList[0].chat_msg_id,
                limit: 20,
            }));
            for (const msg of res.msg_list.reverse()) {
                const msgIndex = tmpList.findIndex(item => item.chat_msg_id == msg.chat_msg_id);
                if (msgIndex == -1) {
                    tmpList.unshift(msg);
                }
            }
            while (tmpList.length > MAC_MSG_CACHE_SIZE) {
                tmpList.pop();
            }
            tmpRefMsgId = this._curGroupMsgList[0].chat_msg_id;
        } else if (listType == LIST_MSG_AFTER) {
            const res = await request(list_msg({
                session_id: this.rootStore.userStore.sessionId,
                project_id: this.curProjectId,
                chat_group_id: this._curGroupId,
                list_msg_type: LIST_MSG_AFTER,
                ref_chat_msg_id: this._curGroupMsgList[this._curGroupMsgList.length - 1].chat_msg_id,
                limit: 20,
            }));
            for (const msg of res.msg_list) {
                const msgIndex = tmpList.findIndex(item => item.chat_msg_id == msg.chat_msg_id);
                if (msgIndex == -1) {
                    tmpList.push(msg);
                }
            }
            while (tmpList.length > MAC_MSG_CACHE_SIZE) {
                tmpList.shift();
            }
            tmpRefMsgId = this._curGroupMsgList[this._curGroupMsgList.length - 1].chat_msg_id;
        }
        runInAction(() => {
            this._curGroupMsgList = tmpList;
            this._curRefMsgId = tmpRefMsgId;
        });
    }

    get curGroupId() {
        return this._curGroupId;
    }

    set curGroupId(val: string) {
        runInAction(() => {
            this._curGroupId = val;
        });
        if (val != "") {
            this.loadMsgList(val);
        } else {
            runInAction(() => {
                this._curGroupMsgList = [];
                this._curRefMsgId = "";
            });
        }
    }


    get curGroup(): ChatGroupWithMember | undefined {
        return this._chatGroupList.find(item => item.groupInfo.chat_group_id == this._curGroupId);
    }

    async onNewMsg(groupId: string, msgId: string) {
        await this.onUpdateGroup(groupId);
        if (!this.hasInitLastMsg) {
            return;
        }
        const getRes = await request(get_msg({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.curProjectId,
            chat_group_id: groupId,
            chat_msg_id: msgId,
        }));
        let tmpList = this._chatGroupList.slice();
        const index = tmpList.findIndex(item => item.groupInfo.chat_group_id == groupId);
        let oldLastMsgId = "";
        if (index != -1) {
            if (tmpList[index].lastMsg !== undefined) {
                oldLastMsgId = tmpList[index].lastMsg?.chat_msg_id ?? "";
            }
            tmpList[index].lastMsg = getRes.msg;
            tmpList = tmpList.sort((a, b) => b.sortValue - a.sortValue);
            runInAction(() => {
                this._chatGroupList = tmpList;
            });
        }
        if (this._curGroupId != groupId) {
            return;
        }
        if (oldLastMsgId == "" || this._curGroupMsgList.length == 0) {
            await this.loadMsgList(groupId);
        } else if (this._curGroupMsgList.length > 0 && this._curGroupMsgList[this._curGroupMsgList.length - 1].chat_msg_id == oldLastMsgId) {
            const tmpMsgList = this._curGroupMsgList.slice();
            const msgIndex = tmpMsgList.findIndex(item => item.chat_msg_id == msgId);
            if (msgIndex == -1) {
                tmpMsgList.push(getRes.msg);
                while (tmpMsgList.length > MAC_MSG_CACHE_SIZE) {
                    tmpMsgList.shift();
                }
                runInAction(() => {
                    this._curGroupMsgList = tmpMsgList;
                });
            }

        }
    }

    hasLastMsg(): boolean {
        const index = this._curGroupMsgList.findIndex(item => item.chat_msg_id == this.curGroup?.lastMsg?.chat_msg_id);
        return index != -1;
    }
}