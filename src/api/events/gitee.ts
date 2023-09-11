import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo,
  LinkExterneInfo,
} from '@/stores/linkAux';

export type User = {
    id: number[];
    name: string;
    email: string;
    username: string[];
    url: string[];
    login: string[];
    avatar_url: string[];
    html_url: string[];
    type_str: string[];
    site_admin: boolean;
    time: number[];
    remark: string[];
  };
  export type Project = {
    id: number;
    name: string;
    path: string;
    full_name: string;
    owner: User[];
    private_flag: boolean;
    html_url: string;
    url: string;
    description: string;
    fork: boolean;
    created_at: number;
    updated_at: number;
    pushed_at: number;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    git_http_url: string;
    git_ssh_url: string;
    git_svn_url: string;
    homepage: string[];
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    language: string;
    has_issues: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    license: string[];
    open_issues_count: number;
    default_branch: string;
    namespace: string;
    name_with_namespace: string;
    path_with_namespace: string;
  };
  export type Commit = {
    id: string;
    tree_id: string;
    parent_ids: string[];
    msg: string;
    timestamp: number;
    url: string;
    author: User[];
    committer: User[];
    distinct: boolean;
    added: string[];
    removed: string[];
    modified: string[];
  };
  export type Enterprise = {
    name: string;
    url: string;
  };
  export type Label = {
    id: number;
    name: string;
    color: string;
  };
  export type Milestone = {
    html_url: string;
    id: number;
    number: number;
    title: string;
    description: string;
    open_issues: number;
    closed_issues: number;
    state: string;
    created_at: number;
    updated_at: number;
    due_on: number[];
  };
  export type Issue = {
    html_url: string;
    id: number;
    number: string;
    title: string;
    user: User[];
    labels: Label[];
    state: string;
    state_name: string;
    type_name: string;
    assignee: User[];
    collaborators: User[];
    milestone: Milestone[];
    comments: number;
    created_at: number;
    updated_at: number;
    body: string;
  };
  export type Note = {
    id: number;
    body: string;
    user: User[];
    created_at: number;
    updated_at: number;
    html_url: string;
    position: string[];
    commit_id: string[];
  };
  export type PullRequest = {
    id: number;
    number: number;
    state: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    title: string;
    body: string[];
    created_at: number;
    updated_at: number;
    closed_at: number[];
    merged_at: number[];
    merge_commit_sha: string;
    merge_reference_name: string;
    user: User[];
    assignee: User[];
    assignees: User[];
    tester: User[];
    testers: User[];
    need_test: boolean;
    need_review: boolean;
    milestone: Milestone[];
    head: Branch[];
    base: Branch[];
    merged: boolean;
    mergeable: boolean;
    merge_status: string;
    updated_by: User[];
    comments: number;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
  };
  export type Branch = {
    label: string;
    ref: string;
    sha: string;
    user: string;
    repo: Project[];
  };
  export type PushEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    ref: string;
    before: string;
    after: string;
    total_commits_count: number;
    commits_more_than_ten: boolean;
    created: boolean;
    deleted: boolean;
    compare: string;
    commits: Commit[];
    head_commit: null | Commit;
    project: Project[];
    user_id: number;
    user_name: string;
    user: User[];
    pusher: User[];
    sender: User[];
    enterprise: Enterprise[];
  };
  function get_push_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PushEvent,
  ): LinkInfo[] {
    let repo_url = "";
    if (inner.project.length > 0) {
      repo_url = inner.project[0].url;
    }
    let project_name = '';
    if (inner.project.length > 0) {
      project_name = inner.project[0].full_name;
    }
    let src_user = '';
    if (inner.sender.length > 0) {
      src_user = inner.sender[0].name;
    }
    const ret_list = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${src_user})推送`),
      new LinkExterneInfo(project_name, repo_url),
      new LinkNoneInfo(`包含${inner.total_commits_count}次提交`),
      new LinkNoneInfo(`最后提交内容:${inner.commits.pop()?.msg}`),

    ];
    if (inner.head_commit != null) {
      ret_list.push(new LinkNoneInfo(`最新提交内容:${inner.head_commit.msg}`));
    }
    return ret_list;
  }
  export type IssueEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    action: string;
    issue: Issue[];
    project: Project[];
    sender: User[];
    target_user: User[];
    user: User[];
    assignee: User[];
    updated_by: User[];
    iid: string;
    title: string;
    description: string;
    state: string;
    milestone: string;
    url: string;
    enterprise: Enterprise[];
  };
  function get_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueEvent,
  ): LinkInfo[] {
    let action_str = '';
    if (inner.action == 'open') {
      action_str = '新建工单';
    } else if (inner.action == 'state_change') {
      action_str = '修改工单状态';
    } else if (inner.action == 'delete') {
      action_str = '删除工单';
    }
    let issue_title = "";
    let issue_url = "";
    if (inner.issue.length > 0) {
      issue_title = inner.issue[0].title;
      issue_url = inner.issue[0].html_url;
    }
    let src_user = '';
    if (inner.sender.length > 0) {
      src_user = inner.sender[0].name;
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${src_user}) ${action_str}`),
      new LinkExterneInfo(issue_title, issue_url),
    ];
  }

  export type PullRequestEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    action: string;
    pull_request: PullRequest[];
    number: number;
    iid: number;
    title: string;
    body: string[];
    state: string;
    merge_status: string;
    merge_commit_sha: string;
    url: string;
    source_branch: string[];
    source_repo: Project[];
    target_branch: string;
    target_repo: Project[];
    project: Project[];
    author: User[];
    updated_by: User[];
    sender: User[];
    target_user: User[];
    enterprise: Enterprise[];
  };

  function get_pr_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PullRequestEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type NoteEvent = {
    hook_id: number;
    hook_url: string;
    hook_name: string;
    timestamp: number;
    sign: string;
    action: string;
    comment: null | Note;
    project: Project[];
    author: User[];
    sender: User[];
    url: string;
    note: string;
    noteable_type: string;
    noteable_id: number;
    issue: Issue[];
    pull_request: PullRequest[];
    title: string;
    per_iid: string;
    short_commit_id: string[];
    enterprise: Enterprise[];
  };

  function get_note_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: NoteEvent,
  ): LinkInfo[] {
    let comment_url = '';
    if (inner.comment !== null) {
      comment_url = inner.comment.html_url;
    }
    let issue_url = '';
    if (inner.issue.length > 0) {
      issue_url = inner.issue[0].html_url;
    }
    let src_user = '';
    if (inner.sender.length > 0) {
      src_user = inner.sender[0].name;
    }
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${src_user}) 对工单`),
      new LinkExterneInfo(inner.title, issue_url),
      new LinkNoneInfo('发表评论'),
      new LinkExterneInfo(inner.comment?.body || "", comment_url),
    ];
  }

  export class AllGiteeEvent {
    PushEvent?: PushEvent;
    IssueEvent?: IssueEvent;
    PullRequestEvent?: PullRequestEvent;
    NoteEvent?: NoteEvent;
  }

  export function get_gitee_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllGiteeEvent,
  ): LinkInfo[] {
    if (inner.PushEvent !== undefined) {
      return get_push_simple_content(ev, skip_prj_name, inner.PushEvent);
    } else if (inner.IssueEvent !== undefined) {
      return get_issue_simple_content(ev, skip_prj_name, inner.IssueEvent);
    } else if (inner.PullRequestEvent !== undefined) {
      return get_pr_simple_content(ev, skip_prj_name, inner.PullRequestEvent);
    } else if (inner.NoteEvent !== undefined) {
      return get_note_simple_content(ev, skip_prj_name, inner.NoteEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }