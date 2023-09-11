
import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
    LinkNoneInfo
} from '@/stores/linkAux';

export type Permission = {
    admin: boolean;
    push: boolean;
    pull: boolean;
};
export type User = {
    id: number;
    user_name: string;
    login: string;
    full_name: string;
    email: string;
    avatar_url: string;
};
export type Repository = {
    id: number;
    owner: User[];
    name: string;
    full_name: string;
    description: string;
    private_flag: boolean;
    unlisted: boolean;
    fork: boolean;
    parent: Repository[];
    empty: boolean;
    mirror: boolean;
    size: number;
    html_url: string;
    ssh_url: string;
    clone_url: string;
    website: string;
    stars: number;
    forks: number;
    watchers: number;
    open_issues: number;
    default_branch: string;
    created: string;
    updated: string;
    permissions: Permission[];
};
export type Label = {
    id: number;
    name: string;
    color: string;
    url: string;
};
export type Milestone = {
    id: number;
    title: string;
    description: string;
    state: string;
    open_issues: number;
    closed_issues: number;
    closed: string[];
    deadline: string[];
};
export type PullRequestMeta = {
    has_merged: boolean;
    merged: string[];
};
export type Issue = {
    id: number;
    index: number;
    poster: User[];
    title: string;
    body: string;
    labels: Label[];
    milestone: Milestone[];
    assignee: User[];
    state: string;
    comments: number;
    created: string;
    updated: string;
    pull_request: PullRequestMeta[];
};
export type Comment = {
    id: number;
    html_url: string;
    poster: User[];
    body: string;
    created: string;
    updated: string;
};
export type ChangesFrom = {
    from_value: string;
};
export type Changes = {
    title: ChangesFrom[];
    body: ChangesFrom[];
};
export type PullRequest = {
    id: number;
    index: number;
    poster: User[];
    title: string;
    body: string;
    labels: Label[];
    milestone: Milestone[];
    assignee: User[];
    state: string;
    comments: number;
    head_branch: string;
    head_repo: Repository[];
    base_branch: string;
    base_repo: Repository[];
    html_url: string;
    mergeable: boolean[];
    has_merged: boolean;
    merged: string[];
    merged_commit_id: string[];
    merged_by: User[];
};
export type CommitUser = {
    name: string;
    email: string;
    user_name: string;
};
export type Commit = {
    id: string;
    message: string;
    url: string;
    author: CommitUser[];
    committer: CommitUser[];
    added: string[];
    removed: string[];
    modified: string[];
    timestamp: number;
};
export type Release = {
    id: number;
    tag_name: string;
    target_commitish: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    author: User[];
    created: string;
};
export type CreateEvent = {
    ref: string;
    ref_type: string;
    sha: string;
    default_branch: string;
    repo: Repository[];
    sender: User[];
};
function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}
export type DeleteEvent = {
    ref: string;
    ref_type: string;
    pusher_type: string;
    repo: Repository[];
    sender: User[];
};
function get_delete_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: DeleteEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}

export type ForkEvent = {
    forkee: Repository[];
    repo: Repository[];
    sender: User[];
};
function get_fork_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ForkEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}
export type IssueCommentEvent = {
    action: string;
    issue: Issue[];
    comment: Comment[];
    changes: Changes[];
    repository: Repository[];
    sender: User[];
};
function get_issue_comment_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueCommentEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}
export type IssueEvent = {
    action: string;
    index: number;
    issue: Issue[];
    changes: Changes[];
    repository: Repository[];
    sender: User[];
};
function get_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}
export type PullRequestEvent = {
    action: string;
    index: number;
    pull_request: PullRequest[];
    changes: Changes[];
    repository: Repository[];
    sender: User[];
};
function get_pr_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PullRequestEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}
export type PushEvent = {
    ref: string;
    before: string;
    after: string;
    compare_url: string;
    commits: Commit[];
    repo: Repository[];
    pusher: User[];
    sender: User[];
};
function get_push_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PushEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}

export type ReleaseEvent = {
    action: string;
    release: Release[];
    repository: Repository[];
    sender: User[];
};
function get_relase_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: ReleaseEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
}

export class AllGogsEvent {
    CreateEvent?: CreateEvent;
    DeleteEvent?: DeleteEvent;
    ForkEvent?: ForkEvent;
    IssueCommentEvent?: IssueCommentEvent;
    IssueEvent?: IssueEvent;
    PullRequestEvent?: PullRequestEvent;
    PushEvent?: PushEvent;
    ReleaseEvent?: ReleaseEvent;
}
export function get_gogs_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllGogsEvent,
): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
        return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.DeleteEvent !== undefined) {
        return get_delete_simple_content(ev, skip_prj_name, inner.DeleteEvent);
    } else if (inner.ForkEvent !== undefined) {
        return get_fork_simple_content(ev, skip_prj_name, inner.ForkEvent);
    } else if (inner.IssueCommentEvent !== undefined) {
        return get_issue_comment_simple_content(ev, skip_prj_name, inner.IssueCommentEvent);
    } else if (inner.IssueEvent !== undefined) {
        return get_issue_simple_content(ev, skip_prj_name, inner.IssueEvent);
    } else if (inner.PullRequestEvent !== undefined) {
        return get_pr_simple_content(ev, skip_prj_name, inner.PullRequestEvent);
    } else if (inner.PushEvent !== undefined) {
        return get_push_simple_content(ev, skip_prj_name, inner.PushEvent);
    } else if (inner.ReleaseEvent !== undefined) {
        return get_relase_simple_content(ev, skip_prj_name, inner.ReleaseEvent);
    }
    return [new LinkNoneInfo('未知事件')];
}