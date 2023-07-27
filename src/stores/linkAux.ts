import type { RootStore } from '.';
import { makeAutoObservable, runInAction } from 'mobx';
import * as linkAuxApi from '@/api/link_aux';
import { request } from '@/utils/request';
import { message } from 'antd';
import type { History } from 'history';
import { CHANNEL_STATE } from './channel';
import type { ISSUE_STATE } from '@/api/project_issue';
import {
  APP_PROJECT_CHAT_PATH,
  APP_PROJECT_KB_BOOK_SHELF_PATH,
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_OVERVIEW_PATH,
  APP_PROJECT_PATH,
  APP_PROJECT_WORK_PLAN_PATH,
  BUG_CREATE_SUFFIX,
  BUG_DETAIL_SUFFIX,
  REPO_ACTION_ACTION_DETAIL_SUFFIX,
  REPO_ACTION_EXEC_RESULT_SUFFIX,
  REQUIRE_MENT_CREATE_SUFFIX,
  REQUIRE_MENT_DETAIL_SUFFIX,
  ROBOT_METRIC_SUFFIX,
  SCRIPT_CREATE_SUFFIX,
  SCRIPT_EXEC_RESULT_SUFFIX,
  TASK_CREATE_SUFFIX,
  TASK_DETAIL_SUFFIX,
} from '@/utils/constant';
import { open } from '@tauri-apps/api/shell';
import { uniqId } from '@/utils/utils';
import { openBook } from '@/pages/Book/utils';

/*
 * 用于统一管理链接跳转以及链接直接传递数据
 */

export enum LINK_TARGET_TYPE {
  LINK_TARGET_PROJECT = 0,
  LINK_TARGET_CHANNEL = 1,
  LINK_TARGET_EVENT = 2,
  LINK_TARGET_DOC = 3,
  LINK_TARGET_APP = 4,
  LINK_TARGET_SPRIT = 5,
  LINK_TARGET_TASK = 6,
  LINK_TARGET_BUG = 7,
  LINK_TARGET_APPRAISE = 8,
  LINK_TARGET_USER_KB = 9,
  LINK_TARGET_ROBOT_METRIC = 10,
  LINK_TARGET_EARTHLY_ACTION = 11,
  LINK_TARGET_EARTHLY_EXEC = 12,
  LINK_TARGET_BOOK_MARK = 13,
  LINK_TARGET_TEST_CASE_ENTRY = 14,
  LINK_TARGET_SCRIPT_SUITE = 15,
  LINK_TARGET_SCRIPT_EXEC = 16,
  LINK_TARGET_REQUIRE_MENT = 17,
  LINK_TARGET_CODE_COMMENT = 18,
  // LINK_TARGET_BOOK_MARK_CATE = 19,
  LINK_TARGET_IDEA_PAGE = 20,

  LINK_TARGET_NONE = 100,
  LINK_TARGET_IMAGE = 101,
  LINK_TARGET_EXTERNE = 102,
}

export interface LinkInfo {
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
}

export class LinkProjectInfo {
  constructor(content: string, projectId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_PROJECT;
    this.linkContent = content;
    this.projectId = projectId;
  }

  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
}

export class LinkChannelInfo {
  constructor(content: string, projectId: string, channelId: string, msgId: string = '') {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_CHANNEL;
    this.linkContent = content;
    this.projectId = projectId;
    this.channelId = channelId;
    this.msgId = msgId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  channelId: string;
  msgId: string;
}

export class LinkEventlInfo {
  constructor(
    content: string,
    projectId: string,
    eventId: string,
    userId: string,
    eventTime: number,
  ) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_EVENT;
    this.linkContent = content;
    this.projectId = projectId;
    this.eventId = eventId;
    this.userId = userId;
    this.eventTime = eventTime;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  eventId: string;
  userId: string;
  eventTime: number;
}

export class LinkDocInfo {
  constructor(content: string, projectId: string, docSpaceId: string, docId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_DOC;
    this.linkContent = content;
    this.projectId = projectId;
    this.docSpaceId = docSpaceId;
    this.docId = docId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  docSpaceId: string;
  docId: string;
}

export class LinkSpritInfo {
  constructor(content: string, projectId: string, spritId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_SPRIT;
    this.linkContent = content;
    this.projectId = projectId;
    this.spritId = spritId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  spritId: string;
}

export class LinkTaskInfo {
  constructor(content: string, projectId: string, issueId: string, contextIssueIdList: string[] = []) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_TASK;
    this.linkContent = content;
    this.projectId = projectId;
    this.issueId = issueId;
    this.contextIssueIdList = contextIssueIdList;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  issueId: string;
  contextIssueIdList: string[];
}

export class LinkBugInfo {
  constructor(content: string, projectId: string, issueId: string, contextIssueIdList: string[] = []) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_BUG;
    this.linkContent = content;
    this.projectId = projectId;
    this.issueId = issueId;
    this.contextIssueIdList = contextIssueIdList;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  issueId: string;
  contextIssueIdList: string[];
}

export class LinkAppraiseInfo {
  constructor(content: string, projectId: string, appraiseId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_APPRAISE;
    this.linkContent = content;
    this.projectId = projectId;
    this.appraiseId = appraiseId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  appraiseId: string;
}

export class LinkUserKbInfo {
  constructor(content: string, userId: string, spaceId: string, docId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_APPRAISE;
    this.linkContent = content;
    this.userId = userId;
    this.spaceId = spaceId;
    this.docId = docId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  userId: string;
  spaceId: string;
  docId: string;
}

export class LinkAppInfo {
  constructor(content: string, projectId: string, appId: string, appUrl: string, openType: number) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_APP;
    this.linkContent = content;
    this.projectId = projectId;
    this.appId = appId;
    this.appUrl = appUrl;
    this.openType = openType;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  appId: string;
  appUrl: string;
  openType: number;
}

export class LinkRobotMetricInfo {
  constructor(content: string, projectId: string, robotId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_ROBOT_METRIC;
    this.linkContent = content;
    this.projectId = projectId;
    this.robotId = robotId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  robotId: string;
}

export class LinkEarthlyActionInfo {
  constructor(content: string, projectId: string, repoId: string, actionId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_EARTHLY_ACTION;
    this.linkContent = content;
    this.projectId = projectId;
    this.repoId = repoId;
    this.actionId = actionId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  repoId: string;
  actionId: string;
}

export class LinkEarthlyExecInfo {
  constructor(content: string, projectId: string, repoId: string, actionId: string, execId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_EARTHLY_EXEC;
    this.linkContent = content;
    this.projectId = projectId;
    this.repoId = repoId;
    this.actionId = actionId;
    this.execId = execId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  repoId: string;
  actionId: string;
  execId: string;
}

export class LinkScriptSuiteInfo {
  constructor(content: string, projectId: string, scriptSuiteId: string, useHistoryScript: boolean, scriptTime: number, tab: string | undefined = undefined) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_SCRIPT_SUITE;
    this.linkContent = content;
    this.projectId = projectId;
    this.scriptSuiteId = scriptSuiteId;
    this.useHistoryScript = useHistoryScript;
    this.scriptTime = scriptTime;
    this.tab = tab;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  scriptSuiteId: string;
  useHistoryScript: boolean;
  scriptTime: number;
  tab?: string;
}

export class LinkScriptExecInfo {
  constructor(content: string, projectId: string, scriptSuiteId: string, execId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_SCRIPT_EXEC;
    this.linkContent = content;
    this.projectId = projectId;
    this.scriptSuiteId = scriptSuiteId;
    this.execId = execId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  scriptSuiteId: string;
  execId: string;
}

export class LinkBookMarkInfo {
  constructor(content: string, projectId: string, bookId: string, markId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_BOOK_MARK;
    this.linkContent = content;
    this.projectId = projectId;
    this.bookId = bookId;
    this.markId = markId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  bookId: string;
  markId: string;
}


export class LinkNoneInfo {
  constructor(content: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_NONE;
    this.linkContent = content;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
}

export class LinkTestCaseEntryInfo {
  constructor(content: string, projectId: string, entryId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_TEST_CASE_ENTRY;
    this.linkContent = content;
    this.projectId = projectId;
    this.entryId = entryId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  entryId: string;
}

export class LinkRequirementInfo {
  constructor(content: string, projectId: string, requirementId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_REQUIRE_MENT;
    this.linkContent = content;
    this.projectId = projectId;
    this.requirementId = requirementId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  requirementId: string;
}

export class LinkCodeCommentInfo {
  constructor(content: string, projectId: string, threadId: string, commentId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_CODE_COMMENT;
    this.linkContent = content;
    this.projectId = projectId;
    this.threadId = threadId;
    this.commentId = commentId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  threadId: string;
  commentId: string;
}

export class LinkIdeaPageInfo {
  constructor(content: string, projectId: string, tagId: string, keywordList: string[], ideaId: string = "") {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_IDEA_PAGE;
    this.linkContent = content;
    this.projectId = projectId;
    this.tagId = tagId;
    this.keywordList = keywordList;
    this.ideaId = ideaId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  tagId: string;
  keywordList: string[];
  ideaId: string;
}

export class LinkImageInfo {
  constructor(content: string, imgUrl: string, thumbImgUrl: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_IMAGE;
    this.linkContent = content;
    this.imgUrl = imgUrl;
    this.thumbImgUrl = thumbImgUrl;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  imgUrl: string;
  thumbImgUrl: string;
}

export class LinkExterneInfo {
  constructor(content: string, destUrl: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_EXTERNE;
    this.linkContent = content;
    this.destUrl = destUrl;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  destUrl: string;
}

export type LinkEventState = {
  eventTime: number;
  memberUserId: string;
};

export type LinkIssueState = {
  issueId: string;
  content: string;
  contextIssueIdList?: string[];
  spritId?: string;
};

export enum ISSUE_TAB_LIST_TYPE {
  ISSUE_TAB_LIST_ALL, //全部
  ISSUE_TAB_LIST_ASSGIN_ME, //指派给我
  ISSUE_TAB_LIST_MY_CREATE, //由我创建
}

export type LinkIssueListState = {
  stateList: ISSUE_STATE[];
  execUserIdList: string[];
  checkUserIdList: string[];
  tabType?: ISSUE_TAB_LIST_TYPE;
  priorityList?: number[];
  softwareVersionList?: string[];
  levelList?: number[];
  tagId?: string;
  curPage?: number;
};

export type LinkDocState = {
  writeDoc: boolean;
  content: string;
  docSpaceId: string;
  docId: string;
};

export type LinkRequirementState = {
  cateId: string;
  requirementId: string;
  content: string;
}

export type LinkRobotState = {
  robotId: string
};

export type LinkEarthlyActionState = {
  repoId: string;
  actionId: string;
};

export type LinkEarthlyExecState = {
  repoId: string;
  actionId: string;
  execId: string;
}

export type LinkTestCaseEntryState = {
  entryId: string;
}

export type LinkScriptSuiteSate = {
  scriptSuiteId: string;
  useHistoryScript: boolean;
  scriptTime: number;
  tab?: string;
}

export type LinkScriptExecState = {
  scriptSuiteId: string;
  execId: string;
}

export type LinkIdeaPageState = {
  keywordList: string[];
  tagId: string;
  ideaId: string;
}

class LinkAuxStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  rootStore: RootStore;

  async goToLink(link: LinkInfo, history: History, remoteCheck: boolean = true) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    const pathname = history.location.pathname;
    if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_CHANNEL) {
      const channelLink = link as LinkChannelInfo;
      if (this.rootStore.projectStore.getProject(channelLink.projectId)?.setting.disable_chat) {
        return;
      }
      if (remoteCheck) {
        const res = await request(
          linkAuxApi.check_access_channel(
            this.rootStore.userStore.sessionId,
            channelLink.projectId,
            channelLink.channelId,
          ),
        );
        if (!res) {
          return;
        }
        if (res.can_access == false) {
          message.warn('不是目标频道的成员');
          return;
        }
      }
      if (this.rootStore.projectStore.curProjectId != channelLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(channelLink.projectId);
      }
      runInAction(() => {
        this.rootStore.channelStore.filterChanelState = CHANNEL_STATE.CHANNEL_STATE_ALL;
      });
      if (channelLink.msgId != '') {
        this.rootStore.chatMsgStore.listRefMsgId = channelLink.msgId;
      }
      this.rootStore.channelStore.curChannelId = channelLink.channelId;
      history.push(APP_PROJECT_CHAT_PATH);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EVENT) {
      const eventLink = link as LinkEventlInfo;
      if (remoteCheck) {
        const res = await request(
          linkAuxApi.check_access_event(
            this.rootStore.userStore.sessionId,
            eventLink.projectId,
            eventLink.eventId,
          ),
        );
        if (!res) {
          return;
        }
        if (res.can_access == false) {
          message.warn('没有权限查看对应工作记录');
          return;
        }
      }
      history.push(this.genUrl(eventLink.projectId, pathname, "/record"), {
        eventTime: eventLink.eventTime,
        memberUserId: eventLink.userId,
      } as LinkEventState);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_TASK) {
      const taskLink = link as LinkTaskInfo;
      if (remoteCheck) {
        const res = await request(
          linkAuxApi.check_access_issue(
            this.rootStore.userStore.sessionId,
            taskLink.projectId,
            taskLink.issueId,
          ),
        );
        if (!res) {
          return;
        }
        if (res.can_access == false) {
          message.warn('没有权限查看对应任务');
          return;
        }
      }
      if (this.rootStore.projectStore.curProjectId != taskLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(taskLink.projectId);
      }
      history.push(this.genUrl(taskLink.projectId, pathname, TASK_DETAIL_SUFFIX), {
        issueId: taskLink.issueId,
        content: '',
        contextIssueIdList: taskLink.contextIssueIdList,
      } as LinkIssueState);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_BUG) {
      const bugLink = link as LinkBugInfo;
      if (remoteCheck) {
        const res = await request(
          linkAuxApi.check_access_issue(
            this.rootStore.userStore.sessionId,
            bugLink.projectId,
            bugLink.issueId,
          ),
        );
        if (!res) {
          return;
        }
        if (res.can_access == false) {
          message.warn('没有权限查看对应缺陷');
          return;
        }
      }
      if (this.rootStore.projectStore.curProjectId != bugLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(bugLink.projectId);
      }
      history.push(this.genUrl(bugLink.projectId, pathname, BUG_DETAIL_SUFFIX), {
        issueId: bugLink.issueId,
        content: '',
        contextIssueIdList: bugLink.contextIssueIdList,
      } as LinkIssueState);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_DOC) {
      const docLink = link as LinkDocInfo;
      if (this.rootStore.projectStore.getProject(docLink.projectId)?.setting.disable_kb) {
        return;
      }
      if (remoteCheck) {
        const res = await request(
          linkAuxApi.check_access_doc(
            this.rootStore.userStore.sessionId,
            docLink.projectId,
            docLink.docId,
          ));
        if (!res) {
          return;
        }
        if (res.can_access == false) {
          message.warn('没有权限查看对应文档');
          return;
        }
      }
      if (this.rootStore.projectStore.curProjectId != docLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(docLink.projectId);
      }
      if (this.rootStore.docSpaceStore.curDocSpaceId != docLink.docSpaceId) {
        await this.rootStore.docSpaceStore.showDocList(docLink.docSpaceId, false);
      }
      this.rootStore.docSpaceStore.fromLink = true;
      await this.rootStore.docSpaceStore.showDoc(docLink.docId, false);
      history.push(APP_PROJECT_KB_DOC_PATH);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_ROBOT_METRIC) {
      const robotLink = link as LinkRobotMetricInfo;
      if (this.rootStore.projectStore.getProject(robotLink.projectId)?.setting.disable_server_agent == true) {
        return;
      }
      if (remoteCheck) {
        const res = await request(
          linkAuxApi.check_access_robot_metric(
            this.rootStore.userStore.sessionId,
            robotLink.projectId,
            robotLink.robotId,
          ));
        if (!res) {
          return;
        }
        if (res.can_access == false) {
          message.warn('没有权限对应服务器代理监控');
          return;
        }
      }
      if (this.rootStore.projectStore.curProjectId != robotLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(robotLink.projectId);
      }
      const state: LinkRobotState = {
        robotId: robotLink.robotId,
      };
      history.push(this.genUrl(robotLink.projectId, pathname, ROBOT_METRIC_SUFFIX), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EARTHLY_ACTION) {
      const actionLink = link as LinkEarthlyActionInfo;
      if (this.rootStore.projectStore.getProject(actionLink.projectId)?.setting.disable_server_agent == true) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != actionLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(actionLink.projectId);
      }
      const state: LinkEarthlyActionState = {
        repoId: actionLink.repoId,
        actionId: actionLink.actionId,
      };
      history.push(this.genUrl(actionLink.projectId, pathname, REPO_ACTION_ACTION_DETAIL_SUFFIX), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EARTHLY_EXEC) {
      const execLink = link as LinkEarthlyExecInfo;
      if (this.rootStore.projectStore.getProject(execLink.projectId)?.setting.disable_server_agent == true) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != execLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(execLink.projectId);
      }
      const state: LinkEarthlyExecState = {
        repoId: execLink.repoId,
        actionId: execLink.actionId,
        execId: execLink.execId,
      };
      history.push(this.genUrl(execLink.projectId, pathname, REPO_ACTION_EXEC_RESULT_SUFFIX), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_BOOK_MARK) {
      const bookMarkLink = link as LinkBookMarkInfo;
      let canShare = false;
      if (this.rootStore.projectStore.getProject(bookMarkLink.projectId)?.setting.disable_chat == false && bookMarkLink.projectId != "") {
        canShare = true;
      }
      if (this.rootStore.projectStore.curProjectId != bookMarkLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(bookMarkLink.projectId);
      }
      openBook(this.rootStore.userStore.userInfo.userId, bookMarkLink.projectId, bookMarkLink.bookId, bookMarkLink.markId,
        this.rootStore.appStore.clientCfg?.book_store_fs_id ?? "", this.rootStore.projectStore.curProject?.ebook_fs_id ?? "",
        canShare);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_SPRIT) {
      const spritLink = link as LinkSpritInfo;
      if (this.rootStore.projectStore.getProject(spritLink.projectId)?.setting.disable_work_plan == true) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != spritLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(spritLink.projectId);
      }
      await this.rootStore.spritStore.setCurSpritId(spritLink.spritId);
      history.push(APP_PROJECT_WORK_PLAN_PATH);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_TEST_CASE_ENTRY) {
      const entryLink = link as LinkTestCaseEntryInfo;
      if (this.rootStore.projectStore.getProject(entryLink.projectId)?.setting.disable_test_case == true) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != entryLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(entryLink.projectId);
      }
      const state: LinkTestCaseEntryState = {
        entryId: entryLink.entryId,
      };
      history.push(this.genUrl(entryLink.entryId, pathname, "/testcase"), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_SCRIPT_SUITE) {
      const scriptSuiteLink = link as LinkScriptSuiteInfo;
      if (this.rootStore.projectStore.getProject(scriptSuiteLink.projectId)?.setting.disable_server_agent == true) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != scriptSuiteLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(scriptSuiteLink.projectId);
      }
      const state: LinkScriptSuiteSate = {
        scriptSuiteId: scriptSuiteLink.scriptSuiteId,
        useHistoryScript: scriptSuiteLink.useHistoryScript,
        scriptTime: scriptSuiteLink.scriptTime,
        tab: scriptSuiteLink.tab,
      };
      history.push(this.genUrl(scriptSuiteLink.projectId, pathname, "/script/detail"), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_SCRIPT_EXEC) {
      const scriptExecLink = link as LinkScriptExecInfo;
      if (this.rootStore.projectStore.getProject(scriptExecLink.projectId)?.setting.disable_server_agent == true) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != scriptExecLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(scriptExecLink.projectId);
      }
      const state: LinkScriptExecState = {
        scriptSuiteId: scriptExecLink.scriptSuiteId,
        execId: scriptExecLink.execId,
      };
      history.push(this.genUrl(scriptExecLink.projectId, pathname, SCRIPT_EXEC_RESULT_SUFFIX), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_REQUIRE_MENT) {
      const reqLink = link as LinkRequirementInfo;
      if (this.rootStore.projectStore.curProjectId != reqLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(reqLink.projectId);
      }
      const state: LinkRequirementState = {
        cateId: "",
        requirementId: reqLink.requirementId,
        content: "",
      };
      history.push(this.genUrl(reqLink.projectId, pathname, REQUIRE_MENT_DETAIL_SUFFIX), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_CODE_COMMENT) {
      const commentLink = link as LinkCodeCommentInfo;
      if (this.rootStore.projectStore.curProjectId != commentLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(commentLink.projectId);
      }
      this.rootStore.projectStore.setCodeCommentInfo(commentLink.threadId, commentLink.commentId);
      if (!history.location.pathname.startsWith(APP_PROJECT_PATH)) {
        //TODO work plan
        if (this.rootStore.projectStore.getProject(commentLink.projectId)?.setting.disable_kb == false) {
          history.push(APP_PROJECT_KB_DOC_PATH);
        } else if (this.rootStore.projectStore.getProject(commentLink.projectId)?.setting.disable_chat == false) {
          history.push(APP_PROJECT_CHAT_PATH);
        } else {
          history.push(APP_PROJECT_OVERVIEW_PATH);
        }
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_IDEA_PAGE) {
      const ideaPageLink = link as LinkIdeaPageInfo;
      if (this.rootStore.projectStore.curProjectId != ideaPageLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(ideaPageLink.projectId);
      }
      const state: LinkIdeaPageState = {
        keywordList: ideaPageLink.keywordList,
        tagId: ideaPageLink.tagId,
        ideaId: ideaPageLink.ideaId,
      };
      history.push(this.genUrl(ideaPageLink.projectId, pathname, "/idea"), state);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EXTERNE) {
      const externLink = link as LinkExterneInfo;
      let destUrl = externLink.destUrl;
      if (!destUrl.includes("://")) {
        destUrl = "https://" + destUrl;
      }
      await open(destUrl);
    }
  }

  //跳转到创建文档
  async goToCreateDoc(content: string, projectId: string, docSpaceId: string, history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    if (this.rootStore.projectStore.getProject(projectId)?.setting.disable_kb) {
      return;
    }
    if (projectId != this.rootStore.projectStore.curProjectId) {
      await this.rootStore.projectStore.setCurProjectId(projectId);
    }
    if (docSpaceId != "") {
      await this.rootStore.docSpaceStore.loadDocSpace();
      this.rootStore.docSpaceStore.showDocList(docSpaceId, false);
    }
    await this.rootStore.docSpaceStore.showDoc("", true);
    history.push(APP_PROJECT_KB_DOC_PATH, {
      writeDoc: true,
      content: content,
      docSpaceId: docSpaceId,
      docId: '',
    } as LinkDocState);
  }

  //跳转到创建任务
  async goToCreateTask(content: string, projectId: string, history: History, spritId: string | undefined = undefined) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    if (projectId != this.rootStore.projectStore.curProjectId) {
      await this.rootStore.projectStore.setCurProjectId(projectId);
    }
    history.push(this.genUrl(projectId, history.location.pathname, TASK_CREATE_SUFFIX), {
      issueId: '',
      content: content,
      contextIssueIdList: [],
      spritId: spritId,
    } as LinkIssueState);
  }

  //跳转到创建缺陷
  async goToCreateBug(content: string, projectId: string, history: History, spritId: string | undefined = undefined) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    if (projectId != this.rootStore.projectStore.curProjectId) {
      await this.rootStore.projectStore.setCurProjectId(projectId);
    }
    history.push(this.genUrl(projectId, history.location.pathname, BUG_CREATE_SUFFIX), {
      issueId: '',
      content: content,
      contextIssueIdList: [],
      spritId: spritId,
    } as LinkIssueState);
  }

  //跳转到创建需求
  async goToCreateRequirement(content: string, projectId: string, cateId: string, history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    if (projectId != this.rootStore.projectStore.curProjectId) {
      await this.rootStore.projectStore.setCurProjectId(projectId);
    }
    const state: LinkRequirementState = {
      content: content,
      requirementId: '',
      cateId: cateId,
    };
    history.push(this.genUrl(projectId, history.location.pathname, REQUIRE_MENT_CREATE_SUFFIX), state);
  }

  //跳转到任务列表
  goToTaskList(state: LinkIssueListState | undefined, history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    if (state != undefined && state?.tabType == undefined) {
      state.tabType = ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME;
    }
    if (state != undefined && state.priorityList == undefined) {
      state.priorityList = [];
    }
    if (state != undefined && state.curPage == undefined) {
      state.curPage = 0;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/task"), state);
  }

  //跳转到缺陷列表
  goToBugList(state: LinkIssueListState | undefined, history: History) {
    console.log("22222222222222222", state);
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    if (state != undefined && state?.tabType == undefined) {
      state.tabType = ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME;
    }
    if (state != undefined && state.priorityList == undefined) {
      state.priorityList = [];
    }
    if (state != undefined && state.softwareVersionList == undefined) {
      state.softwareVersionList = [];
    }
    if (state != undefined && state.levelList == undefined) {
      state.levelList = [];
    }
    if (state != undefined && state.curPage == undefined) {
      state.curPage = 0;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/bug"), state);
  }

  //跳转到服务器代理列表
  goToRobotList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_server_agent == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/robot"));
  }

  //跳转到测试用例列表页
  goToTestCaseList(state: LinkTestCaseEntryState, history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_test_case == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/testcase"), state);
  }

  //跳转到测试结果列表页
  goToTestCaseResultList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_test_case == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/testcase/result"));
  }

  //跳转到研发行为列表页
  goToEventList(history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/record"));
  }

  //跳转到研发行为订阅页面
  goToEventSubscribeList(history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/record/subscribe"));
  }

  //跳转到成员互评页面
  goToAppriaseList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_member_appraise == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/appraise"));
  }

  //跳转到CI/CD代码仓库
  goToRepoList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_server_agent == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/repo"));
  }

  //跳转到第三方接入列表
  goToExtEventList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_ext_event == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/access"));
  }

  //跳转到项目应用
  goToAppList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_app_store == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/appstore"));
  }

  //跳转到数据标注
  goToDataAnnoList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_data_anno == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/dataanno"));
  }

  //跳转到接口集合
  goToApiCollectionList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_api_collection == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/apicoll"));
  }

  //跳转到知识点列表
  goToIdeaList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_chat == true && this.rootStore.projectStore.curProject?.setting.disable_kb == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/idea"));
  }

  //跳转到创建服务端脚本页面
  goToCreateScript(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_server_agent == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, SCRIPT_CREATE_SUFFIX));
  }

  //跳转到服务端脚本列表页面
  goToScriptList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_server_agent == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/script"));
  }

  //跳转到项目需求列表页面
  goToRequirementList(history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/req"));
  }

  private genUrl(projectId: string, pathname: string, suffix: string): string {
    let newSuffix = suffix;
    if (suffix.indexOf("?") == -1) {
      newSuffix = `${suffix}?v=${uniqId()}`
    }
    if (pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
      return APP_PROJECT_WORK_PLAN_PATH + newSuffix;
    } else if (pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
      return APP_PROJECT_CHAT_PATH + newSuffix;
    } else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
      return APP_PROJECT_KB_DOC_PATH + newSuffix;
    } else if (pathname.startsWith(APP_PROJECT_KB_BOOK_SHELF_PATH)) {
      return APP_PROJECT_KB_BOOK_SHELF_PATH + newSuffix;
    } else if (pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
      return APP_PROJECT_OVERVIEW_PATH + newSuffix;
    }
    const projectInfo = this.rootStore.projectStore.getProject(projectId);
    if (projectInfo == undefined) {
      return APP_PROJECT_CHAT_PATH + newSuffix;
    }

    if (projectInfo.setting.disable_chat == false) {
      return APP_PROJECT_CHAT_PATH + newSuffix;
    } else if (projectInfo.setting.disable_work_plan == false) {
      return APP_PROJECT_WORK_PLAN_PATH + newSuffix;
    } else if (projectInfo.setting.disable_kb == false) {
      return APP_PROJECT_KB_DOC_PATH + newSuffix;
    } else {
      return APP_PROJECT_OVERVIEW_PATH + newSuffix;
    }
  }
}

export default LinkAuxStore;
