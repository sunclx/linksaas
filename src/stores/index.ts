import MemberStore from './member';
import AppStore from './app';
import ProjectStore from './project';
import UserStore from './user';
import NoticeStore from './notice';
import ChannelStore from './channel';
import AppraiseStore from './appraise';
import ChannelMemberStore from "./channelMember";
import ChatMsgStore from "./chatMsg";
import LinkAuxStore from './linkAux';
import DocStore from './doc';

export class RootStore {
  userStore: UserStore;
  projectStore: ProjectStore;
  appStore: AppStore;
  memberStore: MemberStore;
  noticeStore: NoticeStore;
  channelStore: ChannelStore;
  channelMemberStore: ChannelMemberStore;
  appraiseStore: AppraiseStore;
  chatMsgStore: ChatMsgStore;
  linkAuxStore: LinkAuxStore;
  docStore: DocStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.projectStore = new ProjectStore(this);
    this.appStore = new AppStore();
    this.memberStore = new MemberStore(this);
    this.noticeStore = new NoticeStore(this);
    this.channelStore = new ChannelStore(this);
    this.channelMemberStore = new ChannelMemberStore(this);
    this.appraiseStore = new AppraiseStore(this);
    this.chatMsgStore = new ChatMsgStore(this);
    this.linkAuxStore = new LinkAuxStore(this);
    this.docStore = new DocStore(this);
  }
}

const rootStore = new RootStore();
const _store = {
  userStore: rootStore.userStore,
  projectStore: rootStore.projectStore,
  appStore: rootStore.appStore,
  memberStore: rootStore.memberStore,
  noticeStore: rootStore.noticeStore,
  channelStore: rootStore.channelStore,
  channelMemberStore: rootStore.channelMemberStore,
  appraiseStore: rootStore.appraiseStore,
  chatMsgStore: rootStore.chatMsgStore,
  linkAuxStore: rootStore.linkAuxStore,
  docStore: rootStore.docStore,
};

export type StoreType = typeof _store;

export default _store;
