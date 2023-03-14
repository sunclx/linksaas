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
  APP_PROJECT_PATH,
  BUG_CREATE_SUFFIX,
  BUG_DETAIL_SUFFIX,
  REPO_ACTION_ACTION_DETAIL_SUFFIX,
  REPO_ACTION_EXEC_RESULT_SUFFIX,
  REQUIRE_MENT_CREATE_SUFFIX,
  REQUIRE_MENT_DETAIL_SUFFIX,
  ROBOT_METRIC_SUFFIX,
  SCRIPT_CREATE_SUFFIX,
  SCRIPT_EXEC_RESULT_SUFFIX,
  SPRIT_DETAIL_SUFFIX,
  TASK_CREATE_SUFFIX,
  TASK_DETAIL_SUFFIX,
} from '@/utils/constant';
import { open } from '@tauri-apps/api/shell';
import { LAYOUT_TYPE_CHAT, LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB, LAYOUT_TYPE_KB_AND_CHAT } from '@/api/project';

/*
 * 用于统一管理链接跳转以及链接直接传递数据
 */

export enum LINK_TARGET_TYPE {
  LINK_TARGET_PROJECT,
  LINK_TARGET_CHANNEL,
  LINK_TARGET_EVENT,
  LINK_TARGET_DOC,
  LINK_TARGET_APP,
  LINK_TARGET_SPRIT,
  LINK_TARGET_TASK,
  LINK_TARGET_BUG,
  LINK_TARGET_APPRAISE,
  LINK_TARGET_USER_KB,
  LINK_TARGET_ROBOT_METRIC,
  LINK_TARGET_EARTHLY_ACTION,
  LINK_TARGET_EARTHLY_EXEC,
  LINK_TARGET_BOOK_MARK,
  LINK_TARGET_TEST_CASE_ENTRY,
  LINK_TARGET_SCRIPT_SUITE,
  LINK_TARGET_SCRIPT_EXEC,
  LINK_TARGET_REQUIRE_MENT,
  LINK_TARGET_CODE_COMMENT,

  LINK_TARGET_NONE,
  LINK_TARGET_IMAGE,
  LINK_TARGET_EXTERNE,
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
};

export type LinkIssueListState = {
  stateList: ISSUE_STATE[];
  execUserIdList: string[];
  checkUserIdList: string[];
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

export type LinkSpritState = {
  spritId: string;
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
      if (this.rootStore.projectStore.getProject(channelLink.projectId)?.setting.layout_type == LAYOUT_TYPE_KB) {
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
      if (this.rootStore.projectStore.getProject(docLink.projectId)?.setting.layout_type == LAYOUT_TYPE_CHAT) {
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
      if (this.rootStore.projectStore.getProject(bookMarkLink.projectId)?.setting.layout_type == LAYOUT_TYPE_CHAT) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != bookMarkLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(bookMarkLink.projectId);
      }
      this.rootStore.bookShelfStore.setShowBook(bookMarkLink.bookId, bookMarkLink.markId);
      history.push(APP_PROJECT_KB_BOOK_SHELF_PATH);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_SPRIT) {
      const spritLink = link as LinkSpritInfo;
      if (this.rootStore.projectStore.getProject(spritLink.projectId)?.setting.disable_sprit == true) {
        return;
      }
      if (this.rootStore.projectStore.curProjectId != spritLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(spritLink.projectId);
      }
      const state: LinkSpritState = {
        spritId: spritLink.spritId,
      };
      history.push(this.genUrl(spritLink.projectId, pathname, SPRIT_DETAIL_SUFFIX), state);
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
        if ([LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_KB].includes(this.rootStore.projectStore.getProject(commentLink.projectId)?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB)) {
          history.push(APP_PROJECT_KB_DOC_PATH);
        } else {
          history.push(APP_PROJECT_CHAT_PATH);
        }
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EXTERNE) {
      const externLink = link as LinkExterneInfo;
      await open(externLink.destUrl);
    }
  }

  //跳转到创建文档
  async goToCreateDoc(content: string, projectId: string, docSpaceId: string, history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    if (this.rootStore.projectStore.getProject(projectId)?.setting.layout_type == LAYOUT_TYPE_CHAT) {
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
  async goToCreateTask(content: string, projectId: string, history: History) {
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
    } as LinkIssueState);
  }

  //跳转到创建缺陷
  async goToCreateBug(content: string, projectId: string, history: History) {
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
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/task"), state);
  }

  //跳转到缺陷列表
  goToBugList(state: LinkIssueListState | undefined, history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
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

  //跳转到迭代列表
  goToSpritList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_sprit == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/sprit"));
  }

  //跳转到测试用例列表页
  goToTestCaseList(state: LinkTestCaseEntryState, history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_sprit == true) {
      return;
    }
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/testcase"), state);
  }

  //跳转到测试结果列表页
  goToTestCaseResultList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_sprit == true) {
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

  //跳转到项目信息页面
  goToHome(tab: string, history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, `/home?tab=${tab}`));
  }

  //跳转到项目成员页面
  goToMemberList(tab: string, history: History) {
    if (this.rootStore.appStore.simpleMode) {
      this.rootStore.appStore.simpleMode = false;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, `/member?tab=${tab}`));
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

  //跳转到代码仓库列表
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
    if (pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
      return APP_PROJECT_CHAT_PATH + suffix;
    } else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
      return APP_PROJECT_KB_DOC_PATH + suffix;
    } else if (pathname.startsWith(APP_PROJECT_KB_BOOK_SHELF_PATH)) {
      return APP_PROJECT_KB_BOOK_SHELF_PATH + suffix;
    }
    const projectInfo = this.rootStore.projectStore.getProject(projectId);
    if (projectInfo == undefined) {
      return APP_PROJECT_CHAT_PATH + suffix;
    }
    if ([LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_KB].includes(projectInfo.setting.layout_type)) {
      return APP_PROJECT_KB_DOC_PATH + suffix;
    } else {
      return APP_PROJECT_CHAT_PATH + suffix;
    }
  }
}

export default LinkAuxStore;
