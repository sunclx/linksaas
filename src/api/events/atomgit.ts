import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo,
  LinkExterneInfo,
} from '@/stores/linkAux';

export type GitUser = {
  email: string;
  name: string;
  username: string;
};

export type User = {
  avatar_url: string;
  html_url: string;
  email: string;
  id: string;
  login: string;
  name: string;
  type: string;
};

export type Repository = {
  allow_forking: boolean;
  archived: boolean;
  clone_url: string;
  created_at: number;
  default_branch: string;
  description: string;
  disabled: boolean;
  fork: boolean;
  forks: number;
  forks_count: number;
  full_name: string;
  git_url: string;
  homepage: string;
  html_url: string;
  id: number;
  is_template: boolean;
  master_branch: string;
  name: string;
  owner: User;
  private: boolean;
  size: number;
  ssh_url: string;
  stargazers_count: number;
  updated_at: number;
  url: string;
  visibility: string;
};

export type Commit = {
  added: string[];
  author: GitUser;
  committer: GitUser;
  distinct: boolean;
  id: string;
  message: string;
  modified: string[];
  removed: string[];
  timestamp: number;
  tree_id: string;
  url: string;
};

export type Issue = {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: string;
  number: string;
  title: string;
  user: User;
  state: string;
  locked: boolean;
  created_at: number;
  updated_at: number;
  body: string;
};

export type PushEvent = {
  after: string;
  before: string;
  commits: Commit[];
  compare: string;
  created: boolean;
  deleted: boolean;
  forced: boolean;
  head_commit: Commit;
  ref: string;
  repository: Repository;
  sender: User;
};

function get_push_simple_content(
  ev: PluginEvent,
  skip_prj_name: boolean,
  inner: PushEvent,
): LinkInfo[] {
  return [
    new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.sender.name}推送`),
    new LinkExterneInfo(inner.repository?.name ?? "", inner.repository?.homepage ?? ""),
    new LinkNoneInfo(`包含${inner.commits.length}次提交`),
    new LinkNoneInfo(`最后提交内容:${inner.commits[inner.commits.length - 1]?.message}`),
    new LinkNoneInfo(`git ref ${inner.ref}`)
  ];
}

export type IssueEvent = {
  action: string;
  issue: Issue;
  repository: Repository;
  sender: User;
};

function get_issue_simple_content(
  ev: PluginEvent,
  skip_prj_name: boolean,
  inner: IssueEvent,
): LinkInfo[] {
  let opt = "创建";
  if (inner?.action == "close") {
    opt = "关闭";
  } else if (inner?.action == "reopen") {
    opt = "重新打开";
  } else if (inner.action == "deleted"){
    opt = "删除";
  }
  const retList = [
    new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.sender?.name ?? ""} ${opt}工单`),
    new LinkExterneInfo(inner?.issue.title ?? "", inner.issue?.url ?? ""),
  ];
  return retList;
}

export class AllAtomgitEvent {
  PushEvent?: PushEvent;
  IssueEvent?: IssueEvent;
}

export function get_atomgit_simple_content(
  ev: PluginEvent,
  skip_prj_name: boolean,
  inner: AllAtomgitEvent,
): LinkInfo[] {

  if (inner.IssueEvent !== undefined) {
    return get_issue_simple_content(ev, skip_prj_name, inner.IssueEvent);
  } else if (inner.PushEvent !== undefined) {
    return get_push_simple_content(ev, skip_prj_name, inner.PushEvent);
  }
  return [new LinkNoneInfo('未知事件')];
}