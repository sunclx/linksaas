import MemberStore from './member';
import AppStore from './app';
import ProjectStore from './project';
import UserStore from './user';
import NoticeStore from './notice';
import AppraiseStore from './appraise';
import LinkAuxStore from './linkAux';
import DocStore from './doc';
import SpritStore from './sprit';
import IssueStore from './issue';
import IdeaStore from './idea';
import PubResStore from './pubRes';
import EntryStore from './entry';
import BoardStore from './board';

export class RootStore {
  userStore: UserStore;
  projectStore: ProjectStore;
  appStore: AppStore;
  memberStore: MemberStore;
  noticeStore: NoticeStore;
  appraiseStore: AppraiseStore;
  linkAuxStore: LinkAuxStore;
  docStore: DocStore;
  spritStore: SpritStore;
  issueStore: IssueStore;
  ideaStore: IdeaStore;
  pubResStore: PubResStore;
  entryStore: EntryStore;
  boardStore: BoardStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.projectStore = new ProjectStore(this);
    this.appStore = new AppStore(this);
    this.memberStore = new MemberStore(this);
    this.noticeStore = new NoticeStore(this);
    this.appraiseStore = new AppraiseStore(this);
    this.linkAuxStore = new LinkAuxStore(this);
    this.docStore = new DocStore(this);
    this.spritStore = new SpritStore(this);
    this.issueStore = new IssueStore(this);
    this.ideaStore = new IdeaStore(this);
    this.pubResStore = new PubResStore();
    this.entryStore = new EntryStore(this);
    this.boardStore = new BoardStore(this);
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
  docStore: rootStore.docStore,
  spritStore: rootStore.spritStore,
  issueStore: rootStore.issueStore,
  ideaStore: rootStore.ideaStore,
  pubResStore: rootStore.pubResStore,
  entryStore: rootStore.entryStore,
  boardStore: rootStore.boardStore,
};

export type StoreType = typeof _store;

export default _store;
