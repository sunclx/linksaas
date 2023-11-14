import MemberStore from './member';
import AppStore from './app';
import ProjectStore from './project';
import UserStore from './user';
import NoticeStore from './notice';
import LinkAuxStore from './linkAux';
import DocStore from './doc';
import SpritStore from './sprit';
import IssueStore from './issue';
import IdeaStore from './idea';
import PubResStore from './pubRes';
import EntryStore from './entry';
import BoardStore from './board';
import GroupStore from './group';
import EditorStore from './editor';

export class RootStore {
  userStore: UserStore;
  projectStore: ProjectStore;
  appStore: AppStore;
  memberStore: MemberStore;
  noticeStore: NoticeStore;
  linkAuxStore: LinkAuxStore;
  docStore: DocStore;
  spritStore: SpritStore;
  issueStore: IssueStore;
  ideaStore: IdeaStore;
  pubResStore: PubResStore;
  entryStore: EntryStore;
  boardStore: BoardStore;
  groupStore: GroupStore;
  editorStore: EditorStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.projectStore = new ProjectStore(this);
    this.appStore = new AppStore(this);
    this.memberStore = new MemberStore(this);
    this.noticeStore = new NoticeStore(this);
    this.linkAuxStore = new LinkAuxStore(this);
    this.docStore = new DocStore(this);
    this.spritStore = new SpritStore(this);
    this.issueStore = new IssueStore(this);
    this.ideaStore = new IdeaStore(this);
    this.pubResStore = new PubResStore();
    this.entryStore = new EntryStore(this);
    this.boardStore = new BoardStore(this);
    this.groupStore = new GroupStore();
    this.editorStore = new EditorStore();
  }
}

const rootStore = new RootStore();
const _store = {
  userStore: rootStore.userStore,
  projectStore: rootStore.projectStore,
  appStore: rootStore.appStore,
  memberStore: rootStore.memberStore,
  noticeStore: rootStore.noticeStore,
  linkAuxStore: rootStore.linkAuxStore,
  docStore: rootStore.docStore,
  spritStore: rootStore.spritStore,
  issueStore: rootStore.issueStore,
  ideaStore: rootStore.ideaStore,
  pubResStore: rootStore.pubResStore,
  entryStore: rootStore.entryStore,
  boardStore: rootStore.boardStore,
  groupStore: rootStore.groupStore,
  editorStore: rootStore.editorStore,
};

export type StoreType = typeof _store;

export default _store;
