import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo,
  LinkExterneInfo,
} from '@/stores/linkAux';
export type Author = {
    name: string;
    email: string;
  };
  export type Variable = {
    key: string;
    value: string;
  };
  export type User = {
    id: number;
    name: string;
    user_name: string;
    avatar_url: string;
    email: string;
  };
  export type BuildCommit = {
    id: number;
    sha: string;
    message: string;
    author_name: string;
    author_email: string;
    status: string;
    duration: number;
    started_at: number[];
    finished_at: number[];
  };
  export type Repository = {
    name: string;
    url: string;
    description: string;
    homepage: string;
    git_ssh_url: string;
    git_http_url: string;
    visibility_level: number;
  };
  export type Runner = {
    id: number;
    description: string;
    active: boolean;
    is_shared: boolean;
  };

  export type Project = {
    id: number;
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
  };
  export type Position = {
    base_sha: string;
    start_sha: string;
    head_sha: string;
    old_path: string;
    new_path: string;
    position_type: string;
    old_line: number;
    new_line: number;
    width: number;
    height: number;
    x: number;
    y: number;
  };
  export type StDiff = {
    diff: string;
    new_path: string;
    old_path: string;
    a_mode: string;
    b_mode: string;
    new_file: boolean;
    renamed_file: boolean;
    deleted_file: boolean;
  };
  export type Source = {
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
  };

  export type Target = {
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
  };

  export type LastCommit = {
    id: string;
    message: string;
    timestamp: number[];
    url: string;
    author: null | Author;
  };

  export type ObjectAttributes = {
    id: number;
    title: string;
    assignee_ids: number[];
    assignee_id: number;
    author_id: number;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    updated_by_id: number;
    last_edited_at: number[];
    last_edited_by_id: number;
    relative_position: number;
    position: null | Position;
    branch_name: string;
    description: string;
    milestone_id: number;
    state: string;
    state_id: number;
    conf_idential: boolean;
    discussion_locked: boolean;
    due_date: number[];
    time_estimate: number;
    total_time_spent: number;
    iid: number;
    url: string;
    action: string;
    target_branch: string;
    source_branch: string;
    source_project_id: number;
    target_project_id: number;
    st_commits: string;
    merge_status: string;
    content: string;
    format: string;
    message: string;
    slug: string;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    status: string;
    stages: string[];
    duration: number;
    note: string;
    notebook_type: string;
    at: number[];
    line_code: string;
    commit_id: string;
    noteable_id: number;
    system: boolean;
    work_in_progress: boolean;
    st_diffs: StDiff[];
    source: null | Source;
    target: null | Target;
    last_commit: null | LastCommit;
    assignee: null | Assignee;
  };
  export type Assignee = {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
    email: string;
  };
  export type MergeRequest = {
    id: number;
    target_branch: string;
    source_branch: string;
    source_project_id: number;
    assignee_id: number;
    author_id: number;
    title: string;
    created_at: number[];
    updated_at: number[];
    milestone_id: number;
    state: string;
    merge_status: string;
    target_project_id: number;
    iid: number;
    description: string;
    position: number;
    locked_at: number[];
    source: null | Source;
    target: null | Target;
    last_commit: null | LastCommit;
    work_in_progress: boolean;
    assignee: null | Assignee;
    url: string;
  };
  export type Commit = {
    id: string;
    message: string;
    title: string;
    timestamp: number[];
    url: string;
    author: null | Author;
    added: string[];
    modified: string[];
    removed: string[];
  };
  export type Issue = {
    id: number;
    title: string;
    assignee_id: number;
    author_id: number;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    position: number;
    branch_name: string;
    description: string;
    milestone_id: number;
    state: string;
    iid: number;
  };
  export type Snippet = {
    id: number;
    title: string;
    content: string;
    author_id: number;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    file_name: string;
    expires_at: number[];
    type: string;
    visibility_level: number;
  };
  export type Label = {
    id: number;
    title: string;
    color: string;
    project_id: number;
    created_at: number[];
    updated_at: number[];
    template: boolean;
    description: string;
    type: string;
    group_id: number;
  };
  export type LabelChanges = {
    previous: Label[];
    current: Label[];
  };
  export type Changes = {
    label_changes: null | LabelChanges;
  };
  export type PipelineObjectAttributes = {
    id: number;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    source: string;
    status: string;
    stages: string[];
    created_at: number[];
    finished_at: number[];
    duration: number;
    variables: Variable[];
  };

  export type ArtifactsFile = {
    filename: string;
    size: string;
  };
  export type Build = {
    id: number;
    stage: string;
    name: string;
    status: string;
    created_at: number[];
    started_at: number[];
    finished_at: number[];
    when: string;
    manual: boolean;
    user: null | User;
    runner: null | Runner;
    artifacts_file: null | ArtifactsFile;
  };
  export type Wiki = {
    web_url: string;
    git_ssh_url: string;
    git_http_url: string;
    path_with_namespace: string;
    default_branch: string;
  };
  export type BuildEvent = {
    object_kind: string;
    ref: string;
    tag: boolean;
    before_sha: string;
    sha: string;
    build_id: number;
    build_name: string;
    build_stage: string;
    build_status: string;
    build_started_at: number[];
    build_finished_at: number[];
    build_duration: number;
    build_allow_failure: boolean;
    project_id: number;
    project_name: string;
    user: null | User;
    commit: null | BuildCommit;
    repository: null | Repository;
    runner: null | Runner;
  };
  function get_build_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: BuildEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type CommentEvent = {
    object_kind: string;
    user: null | User;
    project_id: number;
    project: null | Project;
    repository: null | Repository;
    object_attributes: null | ObjectAttributes;
    merge_request: null | MergeRequest;
    commit: null | Commit;
    issue: null | Issue;
    snippet: null | Snippet;
  };
  function get_comment_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CommentEvent,
  ): LinkInfo[] {
    const retList = [new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name} 评论`)];
    if (inner.commit?.url ?? "" != "") {
      retList.push(new LinkExterneInfo(`Commit(${inner.commit?.id})`, inner.commit?.url ?? ""));
    }
    if (inner.issue?.id ?? 0 != 0) {
      retList.push(new LinkNoneInfo(`工单:${inner.issue?.title ?? ""}`));
    }
    retList.push(new LinkNoneInfo(`内容:${inner.object_attributes?.description}`));
    return retList;
  }
  export type IssueEvent = {
    object_kind: string;
    user: null | User;
    project: null | Project;
    repository: null | Repository;
    object_attributes: null | ObjectAttributes;
    assignee: null | Assignee;
    changes: null | Changes;
  };
  function get_issue_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: IssueEvent,
  ): LinkInfo[] {
    let opt = "创建";
    if (inner.object_attributes?.action == "close") {
      opt = "关闭";
    } else if (inner.object_attributes?.action == "reopen") {
      opt = "重新打开";
    }
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name ?? ""} ${opt}工单`),
      new LinkExterneInfo(inner.object_attributes?.title ?? "", inner.object_attributes?.url ?? ""),
    ];
    return retList;
  }
  export type JobEvent = {
    object_kind: string;
    ref: string;
    tag: boolean;
    before_sha: string;
    sha: string;
    build_id: number;
    build_name: string;
    build_stage: string;
    build_status: string;
    build_started_at: number[];
    build_finished_at: number[];
    build_duration: number;
    build_allow_failure: boolean;
    build_failure_reason: string;
    pipeline_id: number;
    project_id: number;
    project_name: string;
    user: null | User;
    commit: null | BuildCommit;
    repository: null | Repository;
    runner: null | Runner;
  };
  function get_job_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: JobEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }

  export type MergeRequestEvent = {
    object_kind: string;
    user: null | User;
    object_attributes: null | ObjectAttributes;
    changes: null | Changes;
    project: null | Project;
    repository: null | Repository;
    labels: Label[];
    assignees: Assignee[];
  };
  function get_merge_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: MergeRequestEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name}`),
      new LinkNoneInfo(`${inner.object_attributes?.action == "open" ? "打开" : "关闭"} 合并需求`),
      new LinkExterneInfo(inner.object_attributes?.source?.name ?? "", inner.object_attributes?.source?.homepage ?? ""),
      new LinkNoneInfo(inner.object_attributes?.source_branch ?? ""),
      new LinkNoneInfo("至"),
      new LinkExterneInfo(inner.object_attributes?.target?.name ?? "", inner.object_attributes?.target?.homepage ?? ""),
      new LinkNoneInfo(inner.object_attributes?.target_branch ?? ""),
    ];
  }
  export type PipelineEvent = {
    object_kind: string;
    user: null | User;
    project: null | Project;
    commit: null | Commit;
    object_attributes: null | PipelineObjectAttributes;
    merge_request: null | MergeRequest;
    builds: Build[];
  };
  function get_pipe_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PipelineEvent,
  ): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [new LinkNoneInfo('TODO')];
  }
  export type PushEvent = {
    object_kind: string;
    before: string;
    after: string;
    ref: string;
    checkout_sha: string;
    user_id: number;
    user_name: string;
    user_username: string;
    user_email: string;
    user_avatar: string;
    project_id: number;
    project: null | Project;
    repository: null | Repository;
    commits: Commit[];
    total_commits_count: number;
  };
  function get_push_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PushEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user_name}推送`),
      new LinkExterneInfo(inner.project?.name ?? "", inner.project?.homepage ?? ""),
      new LinkNoneInfo(`包含${inner.commits.length}次提交`),
      new LinkNoneInfo(`最后提交内容:${inner.commits[inner.commits.length - 1]?.title}`),
    ];
  }
  export type TagEvent = {
    object_kind: string;
    before: string;
    after: string;
    ref: string;
    checkout_sha: string;
    user_id: number;
    user_name: string;
    user_username: string;
    user_avatar: string;
    project_id: number;
    project: null | Project;
    repository: null | Repository;
    commits: Commit[];
    total_commits_count: number;
  };
  function get_tag_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: TagEvent,
  ): LinkInfo[] {
    let opt = "新增";
    if (inner.commits.length == 0) {
      opt = "删除";
    }
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user_name} ${opt}标签`),
    ];
    if (inner.commits.length > 0) {
      retList.push(new LinkExterneInfo(inner.ref, inner.commits[inner.commits.length - 1]?.url ?? ""));
    } else {
      retList.push(new LinkNoneInfo(inner.ref));
    }
    return retList;
  }
  export type WikiEvent = {
    object_kind: string;
    user: null | User;
    project: null | Project;
    wiki: null | Wiki;
    object_attributes: null | ObjectAttributes;
  };
  function get_wiki_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: WikiEvent,
  ): LinkInfo[] {
    let opt = "创建";
    if (inner.object_attributes?.action == "update") {
      opt = "更新";
    } else if (inner.object_attributes?.action == "delete") {
      opt = "删除";
    }
    const retList = [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户 ${inner.user?.name ?? ""} ${opt}WIKI`),
    ];
    if (inner.object_attributes?.action == "delete") {
      retList.push(new LinkNoneInfo(inner.object_attributes?.title ?? ""));
    } else {
      if (inner.object_attributes?.url ?? "" != "") {
        retList.push(new LinkExterneInfo(inner.object_attributes?.title ?? "", inner.object_attributes?.url ?? ""));
      }
    }
    return retList;
  }

  export class AllGitlabEvent {
    BuildEvent?: BuildEvent;
    CommentEvent?: CommentEvent;
    IssueEvent?: IssueEvent;
    JobEvent?: JobEvent;
    MergeRequestEvent?: MergeRequestEvent;
    PipelineEvent?: PipelineEvent;
    PushEvent?: PushEvent;
    TagEvent?: TagEvent;
    WikiEvent?: WikiEvent;
  }
  export function get_gitlab_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllGitlabEvent,
  ): LinkInfo[] {
    // console.log(JSON.stringify(inner));
    if (inner.BuildEvent !== undefined) {
      return get_build_simple_content(ev, skip_prj_name, inner.BuildEvent);
    } else if (inner.CommentEvent !== undefined) {
      return get_comment_simple_content(ev, skip_prj_name, inner.CommentEvent);
    } else if (inner.IssueEvent !== undefined) {
      return get_issue_simple_content(ev, skip_prj_name, inner.IssueEvent);
    } else if (inner.MergeRequestEvent !== undefined) {
      return get_merge_simple_content(ev, skip_prj_name, inner.MergeRequestEvent);
    } else if (inner.PipelineEvent !== undefined) {
      return get_pipe_simple_content(ev, skip_prj_name, inner.PipelineEvent);
    } else if (inner.PushEvent !== undefined) {
      return get_push_simple_content(ev, skip_prj_name, inner.PushEvent);
    } else if (inner.TagEvent !== undefined) {
      return get_tag_simple_content(ev, skip_prj_name, inner.TagEvent);
    } else if (inner.WikiEvent !== undefined) {
      return get_wiki_simple_content(ev, skip_prj_name, inner.WikiEvent);
    } else if (inner.JobEvent != undefined) {
      return get_job_simple_content(ev, skip_prj_name, inner.JobEvent);
    }
    return [new LinkNoneInfo('未知事件')];
  }