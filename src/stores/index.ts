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
import DocSpaceStore from './docSpace';
import SpritStore from './sprit';
import IssueStore from './issue';
import IdeaStore from './idea';

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
  docSpaceStore: DocSpaceStore;
  spritStore: SpritStore;
  issueStore: IssueStore;
  ideaStore: IdeaStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.projectStore = new ProjectStore(this);
    this.appStore = new AppStore(this);
    this.memberStore = new MemberStore(this);
    this.noticeStore = new NoticeStore(this);
    this.channelStore = new ChannelStore(this);
    this.channelMemberStore = new ChannelMemberStore(this);
    this.appraiseStore = new AppraiseStore(this);
    this.chatMsgStore = new ChatMsgStore(this);
    this.linkAuxStore = new LinkAuxStore(this);
    this.docSpaceStore = new DocSpaceStore(this);
    this.spritStore = new SpritStore(this);
    this.issueStore = new IssueStore(this);
    this.ideaStore = new IdeaStore(this);
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
  docSpaceStore: rootStore.docSpaceStore,
  spritStore: rootStore.spritStore,
  issueStore: rootStore.issueStore,
  ideaStore: rootStore.ideaStore,
};

export type StoreType = typeof _store;

export default _store;
