import type { RootStore } from '.';
import { makeAutoObservable, runInAction } from 'mobx';
import type { ChannelMemberInfo } from '@/api/project_channel';
import { list_channel_member } from '@/api/project_channel';
import { request } from '@/utils/request';



class ChannelMemberStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _channelMemberList: ChannelMemberInfo[] = [];
    private _channelMemberMap: Map<string, ChannelMemberInfo> = new Map();

    get channelMemberList(): ChannelMemberInfo[] {
        return this._channelMemberList;
    }

    get onlineCount(): number {
        const tmpList = this._channelMemberList.filter((item) => {
            const member = this.rootStore.memberStore.getMember(item.member_user_id);
            if (member === undefined) {
                return false;
            }
            return member.member.online;
        });
        return tmpList.length;
    }

    getMember(memberUserId: string): ChannelMemberInfo | undefined {
        return this._channelMemberMap.get(memberUserId);
    }

    async loadChannelMemberList(projectId: string, channelId: string) {
        if(projectId == "" || channelId == "") {
            runInAction(()=>{
                this._channelMemberList = [];
                this._channelMemberMap = new Map();
            });
            return;
        }
        const res = await request(
            list_channel_member(this.rootStore.userStore.sessionId || '', projectId, channelId),
        );
        if (res) {
            runInAction(() => {
                const memberMap: Map<string, ChannelMemberInfo> = new Map();
                res.info_list.forEach((item: ChannelMemberInfo) => {
                    memberMap.set(item.member_user_id, item);
                });
                this._channelMemberList = res.info_list;
                this._channelMemberMap = memberMap;
            });
        }
    }
}

export default ChannelMemberStore;
