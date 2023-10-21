import MemberStore from './member';
import AppStore from './app';
import ProjectStore from './project';
import UserStore from './user';
import NoticeStore from './notice';
import AppraiseStore from './appraise';
import LinkAuxStore from './linkAux';
import DocSpaceStore from './docSpace';
import SpritStore from './sprit';
import IssueStore from './issue';
import IdeaStore from './idea';
import PubResStore from './pubRes';

export class RootStore {
  userStore: UserStore;
  projectStore: ProjectStore;
  appStore: AppStore;
  memberStore: MemberStore;
  noticeStore: NoticeStore;
  appraiseStore: AppraiseStore;
  linkAuxStore: LinkAuxStore;
  docSpaceStore: DocSpaceStore;
  spritStore: SpritStore;
  issueStore: IssueStore;
  ideaStore: IdeaStore;
  pubResStore: PubResStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.projectStore = new ProjectStore(this);
    this.appStore = new AppStore(this);
    this.memberStore = new MemberStore(this);
    this.noticeStore = new NoticeStore(this);
    this.appraiseStore = new AppraiseStore(this);
    this.linkAuxStore = new LinkAuxStore(this);
    this.docSpaceStore = new DocSpaceStore(this);
    this.spritStore = new SpritStore(this);
    this.issueStore = new IssueStore(this);
    this.ideaStore = new IdeaStore(this);
    this.pubResStore = new PubResStore();
  }
}

const rootStore = new RootStore();
const _store = {
  userStore: rootStore.userStore,
  projectStore: rootStore.projectStore,
  appStore: rootStore.appStore,
  memberStore: rootStore.memberStore,
  noticeStore: rootStore.noticeStore,
  appraiseStore: rootStore.appraiseStore,
  linkAuxStore: rootStore.linkAuxStore,
  docSpaceStore: rootStore.docSpaceStore,
  spritStore: rootStore.spritStore,
  issueStore: rootStore.issueStore,
  ideaStore: rootStore.ideaStore,
  pubResStore: rootStore.pubResStore,
};

export type StoreType = typeof _store;

export default _store;
