import type { PluginEvent } from './events';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';
import * as pi from './project_issue';

import { type AllProjectEvent, get_project_simple_content } from './events/project';
import { type AllProjectDocEvent, get_project_doc_simple_content } from './events/project_doc';
import { type AllSpritEvent, get_sprit_simple_content } from './events/sprit';
import { type AllIssueEvent, get_issue_simple_content } from './events/issue';
import { type AllExtEvEvent, get_ext_event_simple_content } from './events/ext_event';
import { type AllGitlabEvent, get_gitlab_simple_content } from './events/gitlab';
import { type AllGogsEvent, get_gogs_simple_content } from './events/gogs';
import { type AllGiteeEvent, get_gitee_simple_content } from './events/gitee';
import { type AllCodeEvent, get_code_simple_content } from './events/code';
import { type AllRequirementEvent, get_requirement_simple_content } from './events/requirement';
import { type AllDataAnnoEvent, get_data_anno_simple_content } from './events/data_anno';
import { type AllIdeaEvent, get_idea_simple_content } from './events/idea';
import { type AllApiCollectionEvent, get_api_collection_simple_content } from './events/api_collection';
import { type AllAtomgitEvent, get_atomgit_simple_content } from './events/atomgit';

export function get_issue_type_str(issue_type: number): string {
  if (issue_type == pi.ISSUE_TYPE_BUG) {
    return '缺陷';
  } else if (issue_type == pi.ISSUE_TYPE_TASK) {
    return '任务';
  } else {
    return '';
  }
}

export class AllEvent {
  ProjectEvent?: AllProjectEvent;
  ProjectDocEvent?: AllProjectDocEvent;
  SpritEvent?: AllSpritEvent;
  IssueEvent?: AllIssueEvent;
  ExtEvEvent?: AllExtEvEvent;
  GitlabEvent?: AllGitlabEvent;
  GogsEvent?: AllGogsEvent;
  GiteeEvent?: AllGiteeEvent;
  RequirementEvent?: AllRequirementEvent;
  CodeEvent?: AllCodeEvent;
  IdeaEvent?: AllIdeaEvent;
  DataAnnoEvent?: AllDataAnnoEvent;
  ApiCollectionEvent?: AllApiCollectionEvent;
  AtomgitEvent?: AllAtomgitEvent;
}

export function get_simple_content(ev: PluginEvent, skip_prj_name: boolean): LinkInfo[] {
  if (ev.event_data.ProjectEvent !== undefined) {
    return get_project_simple_content(ev, skip_prj_name, ev.event_data.ProjectEvent);
  } else if (ev.event_data.ProjectDocEvent !== undefined) {
    return get_project_doc_simple_content(ev, skip_prj_name, ev.event_data.ProjectDocEvent);
  } else if (ev.event_data.SpritEvent !== undefined) {
    return get_sprit_simple_content(ev, skip_prj_name, ev.event_data.SpritEvent);
  } else if (ev.event_data.IssueEvent !== undefined) {
    return get_issue_simple_content(ev, skip_prj_name, ev.event_data.IssueEvent);
  } else if (ev.event_data.ExtEvEvent !== undefined) {
    return get_ext_event_simple_content(ev, skip_prj_name, ev.event_data.ExtEvEvent);
  } else if (ev.event_data.GitlabEvent !== undefined) {
    return get_gitlab_simple_content(ev, skip_prj_name, ev.event_data.GitlabEvent);
  } else if (ev.event_data.GogsEvent !== undefined) {
    return get_gogs_simple_content(ev, skip_prj_name, ev.event_data.GogsEvent);
  } else if (ev.event_data.GiteeEvent !== undefined) {
    return get_gitee_simple_content(ev, skip_prj_name, ev.event_data.GiteeEvent);
  } else if (ev.event_data.RequirementEvent !== undefined) {
    return get_requirement_simple_content(ev, skip_prj_name, ev.event_data.RequirementEvent);
  } else if (ev.event_data.CodeEvent !== undefined) {
    return get_code_simple_content(ev, skip_prj_name, ev.event_data.CodeEvent);
  } else if (ev.event_data.IdeaEvent !== undefined) {
    return get_idea_simple_content(ev, skip_prj_name, ev.event_data.IdeaEvent);
  } else if (ev.event_data.DataAnnoEvent !== undefined) {
    return get_data_anno_simple_content(ev, skip_prj_name, ev.event_data.DataAnnoEvent);
  } else if (ev.event_data.ApiCollectionEvent !== undefined) {
    return get_api_collection_simple_content(ev, skip_prj_name, ev.event_data.ApiCollectionEvent);
  } else if (ev.event_data.AtomgitEvent !== undefined) {
    return get_atomgit_simple_content(ev, skip_prj_name, ev.event_data.AtomgitEvent);
  }
  return [new LinkNoneInfo('未知事件')];
}
