import type { RootStore } from '.';
import { makeAutoObservable } from 'mobx';
import * as linkAuxApi from '@/api/link_aux';
import { request } from '@/utils/request';
import { message } from 'antd';
import type { History } from 'history';
import type { ISSUE_STATE } from '@/api/project_issue';
import {
  APP_PROJECT_HOME_PATH,
  APP_PROJECT_KB_BOARD_PATH,
  APP_PROJECT_KB_DOC_PATH,
  APP_PROJECT_MY_WORK_PATH,
  APP_PROJECT_OVERVIEW_PATH,
  APP_PROJECT_PATH,
  APP_PROJECT_WORK_PLAN_PATH,
  BUG_CREATE_SUFFIX,
  BUG_DETAIL_SUFFIX,
  REQUIRE_MENT_CREATE_SUFFIX,
  REQUIRE_MENT_DETAIL_SUFFIX,
  TASK_CREATE_SUFFIX,
  TASK_DETAIL_SUFFIX,
} from '@/utils/constant';
import { open } from '@tauri-apps/api/shell';
import { uniqId } from '@/utils/utils';
import type { API_COLL_TYPE } from '@/api/api_collection';
import { API_COLL_CUSTOM, API_COLL_GRPC, API_COLL_OPENAPI } from '@/api/api_collection';
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';
import { OpenPipeLineWindow } from '@/pages/Project/CiCd/utils';
import { get as get_entry, ENTRY_TYPE_SPRIT, ENTRY_TYPE_DOC } from "@/api/project_entry";
import { get as get_api_coll } from "@/api/api_collection";
/*
 * 用于统一管理链接跳转以及链接直接传递数据
 */

export enum LINK_TARGET_TYPE {
  LINK_TARGET_PROJECT = 0,
  // LINK_TARGET_CHANNEL = 1,
  LINK_TARGET_EVENT = 2,
  LINK_TARGET_DOC = 3,
  // LINK_TARGET_APP = 4,
  LINK_TARGET_SPRIT = 5,
  LINK_TARGET_TASK = 6,
  LINK_TARGET_BUG = 7,
  LINK_TARGET_APPRAISE = 8,
  // LINK_TARGET_USER_KB = 9,
  // LINK_TARGET_ROBOT_METRIC = 10,
  // LINK_TARGET_EARTHLY_ACTION = 11,
  // LINK_TARGET_EARTHLY_EXEC = 12,
  // LINK_TARGET_BOOK_MARK = 13,
  // LINK_TARGET_TEST_CASE_ENTRY = 14,
  // LINK_TARGET_SCRIPT_SUITE = 15,
  // LINK_TARGET_SCRIPT_EXEC = 16,
  LINK_TARGET_REQUIRE_MENT = 17,
  LINK_TARGET_CODE_COMMENT = 18,
  // LINK_TARGET_BOOK_MARK_CATE = 19,
  LINK_TARGET_IDEA_PAGE = 20,
  LINK_TARGET_PIPE_LINE = 21,
  LINK_TARGET_ENTRY = 22,
  LINK_TARGET_API_COLL = 23,
  LINK_TARGET_DATA_ANNO = 24,

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
  constructor(content: string, projectId: string, docId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_DOC;
    this.linkContent = content;
    this.projectId = projectId;
    this.docId = docId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
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


export class LinkNoneInfo {
  constructor(content: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_NONE;
    this.linkContent = content;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
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

export class LinkPipeLineInfo {
  constructor(content: string, projectId: string, pipeLineId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_PIPE_LINE;
    this.linkContent = content;
    this.projectId = projectId;
    this.pipeLineId = pipeLineId;
  }

  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  pipeLineId: string;
}

export class LinkEntryInfo {
  constructor(content: string, projectId: string, entryId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_ENTRY;
    this.linkContent = content;
    this.projectId = projectId;
    this.entryId = entryId;
  }

  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  entryId: string;
}

export class LinkApiCollInfo {
  constructor(content: string, projectId: string, apiCollId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_API_COLL;
    this.linkContent = content;
    this.projectId = projectId;
    this.apiCollId = apiCollId;
  }

  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  apiCollId: string;
}

export class LinkDataAnnoInfo {
  constructor(content: string, projectId: string, annoProjectId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_DATA_ANNO;
    this.linkContent = content;
    this.projectId = projectId;
    this.annoProjectId = annoProjectId;
  }

  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  annoProjectId: string;
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
  ISSUE_TAB_LIST_MY_WATCH,  //我的关注
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
  requirementId: string;
  content: string;
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
    const pathname = history.location.pathname;
    if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EVENT) {
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
      if (this.rootStore.docStore.inEdit) {
        this.rootStore.docStore.showCheckLeave(() => {
          this.goToDoc(docLink, history);
        });
      } else {
        await this.goToDoc(docLink, history);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_SPRIT) {
      const spritLink = link as LinkSpritInfo;
      if (this.rootStore.docStore.inEdit) {
        this.rootStore.docStore.showCheckLeave(() => {
          this.goToSprit(spritLink, history);
        });
      } else {
        await this.goToSprit(spritLink, history);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_REQUIRE_MENT) {
      const reqLink = link as LinkRequirementInfo;
      if (this.rootStore.projectStore.curProjectId != reqLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(reqLink.projectId);
      }
      const state: LinkRequirementState = {
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
        history.push(APP_PROJECT_HOME_PATH);
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
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_PIPE_LINE) {
      const pipeLineLink = link as LinkPipeLineInfo;
      if (this.rootStore.projectStore.curProjectId != pipeLineLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(pipeLineLink.projectId);
      }
      await OpenPipeLineWindow(`${pipeLineLink}(只读模式)`, pipeLineLink.projectId,
        this.rootStore.projectStore.curProject?.ci_cd_fs_id ?? "", pipeLineLink.pipeLineId, false, false, this.rootStore.projectStore.isAdmin);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_ENTRY) {
      const entryLink = link as LinkEntryInfo;
      if (this.rootStore.projectStore.curProjectId != entryLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(entryLink.projectId);
      }
      const res = await request(get_entry({
        session_id: this.rootStore.userStore.sessionId,
        project_id: entryLink.projectId,
        entry_id: entryLink.entryId,
      }));
      if (res.entry.entry_type == ENTRY_TYPE_SPRIT) {
        await this.goToLink(new LinkSpritInfo("", entryLink.projectId, entryLink.entryId), history, remoteCheck);
      } else if (res.entry.entry_type == ENTRY_TYPE_DOC) {
        await this.goToLink(new LinkDocInfo("", entryLink.projectId, entryLink.entryId), history, remoteCheck);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_API_COLL) {
      const apiCollLink = link as LinkApiCollInfo;
      if (this.rootStore.projectStore.curProjectId != apiCollLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(apiCollLink.projectId);
      }
      const res = await request(get_api_coll({
        session_id: this.rootStore.userStore.sessionId,
        project_id: apiCollLink.projectId,
        api_coll_id: apiCollLink.apiCollId,
      }));
      await this.openApiCollPage(res.info.api_coll_id, res.info.name + "(只读模式)", res.info.api_coll_type, res.info.default_addr, false, this.rootStore.projectStore.isAdmin);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_DATA_ANNO) {
      const dataAnnoLink = link as LinkDataAnnoInfo;
      if (this.rootStore.projectStore.curProjectId != dataAnnoLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(dataAnnoLink.projectId);
      }
      //TODO 检查访问权限
      await this.openAnnoProjectPage(dataAnnoLink.annoProjectId, dataAnnoLink.linkContent);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EXTERNE) {
      const externLink = link as LinkExterneInfo;
      let destUrl = externLink.destUrl;
      if (!destUrl.includes("://")) {
        destUrl = "https://" + destUrl;
      }
      await open(destUrl);
    }
  }

  private async goToDoc(docLink: LinkDocInfo, history: History) {
    if (this.rootStore.projectStore.curProjectId != docLink.projectId) {
      await this.rootStore.projectStore.setCurProjectId(docLink.projectId);
    }

    this.rootStore.docStore.fromLink = true;
    await this.rootStore.entryStore.loadEntry(docLink.docId);
    await this.rootStore.docStore.loadDoc();
    history.push(APP_PROJECT_KB_DOC_PATH);
  }

  private async goToSprit(spritLink: LinkSpritInfo, history: History) {
    if (this.rootStore.projectStore.curProjectId != spritLink.projectId) {
      await this.rootStore.projectStore.setCurProjectId(spritLink.projectId);
    }
    await this.rootStore.entryStore.loadEntry(spritLink.spritId);
    await this.rootStore.spritStore.loadCurSprit();
    history.push(APP_PROJECT_WORK_PLAN_PATH);
  }

  //跳转到创建任务
  async goToCreateTask(content: string, projectId: string, history: History, spritId: string | undefined = undefined) {
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
  async goToCreateRequirement(content: string, projectId: string, history: History) {
    if (projectId != this.rootStore.projectStore.curProjectId) {
      await this.rootStore.projectStore.setCurProjectId(projectId);
    }
    const state: LinkRequirementState = {
      content: content,
      requirementId: '',
    };
    history.push(this.genUrl(projectId, history.location.pathname, REQUIRE_MENT_CREATE_SUFFIX), state);
  }

  //跳转到任务列表
  goToTaskList(state: LinkIssueListState | undefined, history: History) {
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

  //跳转到研发行为列表页
  goToEventList(history: History) {
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/record"));
  }

  //跳转到研发行为订阅页面
  goToEventSubscribeList(history: History) {
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/record/subscribe"));
  }

  //跳转到成员互评页面
  goToAppriaseList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_member_appraise == true) {
      return;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/appraise"));
  }

  //跳转到第三方接入列表
  goToExtEventList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_ext_event == true) {
      return;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/access"));
  }

  //调整到代码评论会话列表
  goToCodeThreadList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_code_comment == true) {
      return;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/code"));
  }

  //跳转到数据标注
  goToDataAnnoList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_data_anno == true) {
      return;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/dataanno"));
  }

  //跳转到接口集合
  goToApiCollectionList(history: History) {
    if (this.rootStore.projectStore.curProject?.setting.disable_api_collection == true) {
      return;
    }
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/apicoll"));
  }

  //跳转到知识点列表
  goToIdeaList(history: History) {
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/idea"));
  }

  //打开接口集合页面
  async openApiCollPage(apiCollId: string, name: string, apiCollType: API_COLL_TYPE, defaultAddr: string, canEdit: boolean, canAdmin: boolean) {
    const label = `apiColl:${apiCollId}`;
    const pos = await appWindow.innerPosition();
    if (apiCollType == API_COLL_GRPC) {
      new WebviewWindow(label, {
        title: `${name}(GRPC)`,
        url: `api_grpc.html?projectId=${this.rootStore.projectStore.curProjectId}&apiCollId=${apiCollId}&fsId=${this.rootStore.projectStore.curProject?.api_coll_fs_id ?? ""}&remoteAddr=${defaultAddr}&edit=${canEdit}&admin=${canAdmin}`,
        x: pos.x + Math.floor(Math.random() * 200),
        y: pos.y + Math.floor(Math.random() * 200),
      });
    } else if (apiCollType == API_COLL_OPENAPI) {
      new WebviewWindow(label, {
        title: `${name}(OPENAPI/SWAGGER)`,
        url: `api_swagger.html?projectId=${this.rootStore.projectStore.curProjectId}&apiCollId=${apiCollId}&fsId=${this.rootStore.projectStore.curProject?.api_coll_fs_id ?? ""}&remoteAddr=${defaultAddr}&edit=${canEdit}&admin=${canAdmin}`,
        x: pos.x + Math.floor(Math.random() * 200),
        y: pos.y + Math.floor(Math.random() * 200),
      });
    } else if (apiCollType == API_COLL_CUSTOM) {
      new WebviewWindow(label, {
        title: `${name}(自定义接口)`,
        url: `api_custom.html?projectId=${this.rootStore.projectStore.curProjectId}&apiCollId=${apiCollId}&remoteAddr=${defaultAddr}&edit=${canEdit}&admin=${canAdmin}`,
        x: pos.x + Math.floor(Math.random() * 200),
        y: pos.y + Math.floor(Math.random() * 200),
      });
    }
  }

  async openAnnoProjectPage(annoProjectId: string, annoName: string) {
    const label = `dataAnno:${annoProjectId}`
    const view = WebviewWindow.getByLabel(label);
    if (view != null) {
      await view.setAlwaysOnTop(true);
      await view.show();
      await view.unminimize();
      setTimeout(() => {
        view.setAlwaysOnTop(false);
      }, 200);
      return;
    }
    const pos = await appWindow.innerPosition();

    const projectStore = this.rootStore.projectStore;

    new WebviewWindow(label, {
      title: `标注项目(${annoName})`,
      url: `data_anno.html?projectId=${projectStore.curProjectId}&annoProjectId=${annoProjectId}&admin=${projectStore.isAdmin}&fsId=${projectStore.curProject?.data_anno_fs_id ?? ""}`,
      width: 1000,
      minWidth: 800,
      height: 800,
      minHeight: 600,
      resizable: true,
      center: true,
      x: pos.x + Math.floor(Math.random() * 200),
      y: pos.y + Math.floor(Math.random() * 200),
    });
  };

  //跳转到项目需求列表页面
  goToRequirementList(history: History) {
    history.push(this.genUrl(this.rootStore.projectStore.curProjectId, history.location.pathname, "/req"));
  }

  private genUrl(projectId: string, pathname: string, suffix: string): string {
    let newSuffix = suffix;
    if (suffix.indexOf("?") == -1) {
      newSuffix = `${suffix}?v=${uniqId()}`
    }
    if (pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
      return APP_PROJECT_WORK_PLAN_PATH + newSuffix;
    } else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
      return APP_PROJECT_KB_DOC_PATH + newSuffix;
    } else if(pathname.startsWith(APP_PROJECT_KB_BOARD_PATH)){
      return APP_PROJECT_KB_BOARD_PATH + newSuffix;
    } else if (pathname.startsWith(APP_PROJECT_MY_WORK_PATH)) {
      return APP_PROJECT_MY_WORK_PATH + newSuffix;
    } else if (pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
      return APP_PROJECT_OVERVIEW_PATH + newSuffix;
    }
    const projectInfo = this.rootStore.projectStore.getProject(projectId);
    if (projectInfo == undefined) {
      return APP_PROJECT_HOME_PATH + newSuffix;
    }
    return APP_PROJECT_HOME_PATH + newSuffix;
  }
}

export default LinkAuxStore;
