import type { RootStore } from '.';
import { makeAutoObservable, runInAction } from 'mobx';
import * as linkAuxApi from '@/api/link_aux';
import { request } from '@/utils/request';
import { message } from 'antd';
import type { History } from 'history';
import { CHANNEL_STATE } from './channel';
import type { ISSUE_STATE } from '@/api/project_issue';
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_CB_PATH, APP_PROJECT_KB_DOC_PATH, BUG_CREATE_SUFFIX, BUG_DETAIL_SUFFIX, ROBOT_METRIC_SUFFIX, TASK_CREATE_SUFFIX, TASK_DETAIL_SUFFIX } from '@/utils/constant';
import { open } from '@tauri-apps/api/shell';

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
  constructor(content: string, projectId: string, issueId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_TASK;
    this.linkContent = content;
    this.projectId = projectId;
    this.issueId = issueId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  issueId: string;
}

export class LinkBugInfo {
  constructor(content: string, projectId: string, issueId: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_BUG;
    this.linkContent = content;
    this.projectId = projectId;
    this.issueId = issueId;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
  projectId: string;
  issueId: string;
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


export class LinkNoneInfo {
  constructor(content: string) {
    this.linkTargeType = LINK_TARGET_TYPE.LINK_TARGET_NONE;
    this.linkContent = content;
  }
  linkTargeType: LINK_TARGET_TYPE;
  linkContent: string;
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

export type LinkRobotState = {
  robotId: string
};


class LinkAuxStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  rootStore: RootStore;

  async goToLink(link: LinkInfo, history: History, remoteCheck: boolean = true) {
    const pathname = history.location.pathname;
    if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_CHANNEL) {
      const channelLink = link as LinkChannelInfo;
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
      await this.rootStore.projectStore.setCurProjectId(channelLink.projectId);
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
      history.push(this.genUrl(pathname, "/record"), {
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

      history.push(this.genUrl(pathname, TASK_DETAIL_SUFFIX), {
        issueId: taskLink.issueId,
        content: '',
      } as LinkIssueState);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_BUG) {
      const taskLink = link as LinkBugInfo;
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
          message.warn('没有权限查看对应缺陷');
          return;
        }
      }
      if (this.rootStore.projectStore.curProjectId != taskLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(taskLink.projectId);
      }
      history.push(this.genUrl(pathname, BUG_DETAIL_SUFFIX), {
        issueId: taskLink.issueId,
        content: '',
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
      if (this.rootStore.projectStore.curProjectId != docLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(docLink.projectId);
      }
      await this.rootStore.docSpaceStore.showDoc(docLink.docId, false);
      history.push(APP_PROJECT_KB_DOC_PATH);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_ROBOT_METRIC) {
      const robotLink = link as LinkRobotMetricInfo;
      if (remoteCheck) {
        //TODO
      }
      if (this.rootStore.projectStore.curProjectId != robotLink.projectId) {
        await this.rootStore.projectStore.setCurProjectId(robotLink.projectId);
      }
      history.push(this.genUrl(pathname, ROBOT_METRIC_SUFFIX), {
        robotId: robotLink.robotId,
      } as LinkRobotState);
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EXTERNE) {
      const externLink = link as LinkExterneInfo;
      await open(externLink.destUrl);
    }
  }

  //跳转到创建文档
  goToCreateDoc(content: string, history: History) {
    this.rootStore.docSpaceStore.showDoc("", true);
    history.push(APP_PROJECT_KB_DOC_PATH, {
      writeDoc: true,
      content: content,
      docId: '',
    } as LinkDocState);
  }

  //跳转到创建任务
  goToCreateTask(content: string, history: History) {
    history.push(this.genUrl(history.location.pathname, TASK_CREATE_SUFFIX), {
      issueId: '',
      content: content,
    } as LinkIssueState);
  }
  //跳转到创建缺陷
  goToCreateBug(content: string, history: History) {
    history.push(this.genUrl(history.location.pathname, BUG_CREATE_SUFFIX), {
      issueId: '',
      content: content,
    } as LinkIssueState);
  }

  //跳转到任务列表
  goToTaskList(state: LinkIssueListState, history: History) {
    history.push(this.genUrl(history.location.pathname, "/task"), state);
  }

  //跳转到缺陷列表
  goToBugList(state: LinkIssueListState, history: History) {
    history.push(this.genUrl(history.location.pathname, "/bug"), state);
  }

  private genUrl(pathname: string, suffix: string): string {
    if (pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
      return APP_PROJECT_CHAT_PATH + suffix;
    } else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
      return APP_PROJECT_KB_DOC_PATH + suffix;
    } else if (pathname.startsWith(APP_PROJECT_KB_CB_PATH)) {
      return APP_PROJECT_KB_CB_PATH + suffix;
    }
    return APP_PROJECT_CHAT_PATH + suffix;
  }
}

export default LinkAuxStore;
