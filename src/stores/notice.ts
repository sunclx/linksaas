import { makeAutoObservable, runInAction } from 'mobx';
import type * as NoticeType from '@/api/notice_type'
import { listen } from '@tauri-apps/api/event';
import type { UnlistenFn } from '@tauri-apps/api/event';
import type { RootStore } from '.';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { MSG_LINK_TASK, MSG_LINK_BUG, MSG_LINK_CHANNEL } from '@/api/project_channel';
import type { ShortNoteEvent } from '@/utils/short_note';
import { SHORT_NOTE_TASK, SHORT_NOTE_BUG, SHORT_NOTE_DOC, SHORT_NOTE_CHANNEL } from '@/api/short_note';
import { LinkBugInfo, LinkDocInfo, LinkTaskInfo, LinkChannelInfo } from './linkAux';
import { isString } from 'lodash';
import type { History } from 'history';
import { createBrowserHistory } from 'history';
import { appWindow } from '@tauri-apps/api/window';
import type { FloatNoticeDetailEvent } from '@/utils/float_notice';



class NoticeStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  private rootStore: RootStore;
  private unlistenFn: UnlistenFn | null = null;
  private unlistenShortNoteFn: UnlistenFn | null = null;
  private unlistenFloatNoticeFn: UnlistenFn | null = null;

  private history: History = createBrowserHistory();

  setHistory(history: History) {
    runInAction(() => {
      this.history = history;
    });
  }

  //成功登录后接收通知
  async initListen() {
    if (this.unlistenFn !== null) {
      this.unlistenFn();
      runInAction(() => {
        this.unlistenFn = null;
      });
    }
    const unlistenFn = await listen<NoticeType.AllNotice>('notice', (ev) => {
      const notice = ev.payload
      if (notice.ProjectNotice !== undefined) {
        this.processProjectNotice(notice.ProjectNotice);
      } else if (notice.ProjectDocNotice !== undefined) {
        this.processProjectDocNotice(notice.ProjectDocNotice);
      } else if (notice.IssueNotice !== undefined) {
        this.processIssueNotice(notice.IssueNotice);
      } else if (notice.AppraiseNotice !== undefined) {
        this.processAppraiseNotice(notice.AppraiseNotice)
      } else if (notice.ClientNotice !== undefined) {
        this.processClientNotice(notice.ClientNotice);
      }
    });
    runInAction(() => {
      this.unlistenFn = unlistenFn;
    });


    if (this.unlistenShortNoteFn !== null) {
      this.unlistenShortNoteFn();
      runInAction(() => {
        this.unlistenShortNoteFn = null;
      });
    }
    const unlistenShortNoteFn = await listen<ShortNoteEvent | string>("shortNote", (ev) => {
      if (isString(ev.payload)) {
        this.processShortNoteEvent(JSON.parse(ev.payload));
      } else {
        this.processShortNoteEvent(ev.payload);
      }

    });
    runInAction(() => {
      this.unlistenShortNoteFn = unlistenShortNoteFn;
    });

    if (this.unlistenFloatNoticeFn != null) {
      this.unlistenFloatNoticeFn();
      runInAction(() => {
        this.unlistenFloatNoticeFn = null;
      });
    }
    const unlistenFloatNoticeFn = await listen<FloatNoticeDetailEvent | string>("floatNoticeDetail", (ev) => {
      if (isString(ev.payload)) {
        this.processFloatNoticeDetailEvent(JSON.parse(ev.payload));
      } else {
        this.processFloatNoticeDetailEvent(ev.payload);
      }
    });
    runInAction(() => {
      this.unlistenFloatNoticeFn = unlistenFloatNoticeFn;
    });
  }

  private processProjectDocNotice(notice: NoticeType.project_doc.AllNotice) {
    if (notice.NewDocSpaceNotice !== undefined) {
      if (notice.NewDocSpaceNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.docSpaceStore.updateDocSpace(notice.NewDocSpaceNotice.doc_space_id);
      }
    } else if (notice.UpdateDocSpaceNotice !== undefined) {
      if (notice.UpdateDocSpaceNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.docSpaceStore.updateDocSpace(notice.UpdateDocSpaceNotice.doc_space_id);
      }
    } else if (notice.RemoveDocSpaceNotice !== undefined) {
      if (notice.RemoveDocSpaceNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.docSpaceStore.removeDocSpace(notice.RemoveDocSpaceNotice.doc_space_id);
      }
    } else if (notice.NewDocNotice !== undefined) {
      //skip
    } else if (notice.UpdateDocNotice !== undefined) {
      //skip
    } else if (notice.RemoveDocNotice !== undefined) {
      //skip
    } else if (notice.RecoverDocInRecycleNotice !== undefined) {
      //skip
    } else if (notice.RemoveDocInRecycleNotice !== undefined) {
      //skip
    }
  }

  private processAppraiseNotice(notice: NoticeType.appraise.AllNotice) {
    if (notice.NewAppraiseNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.NewAppraiseNotice.project_id) {
        this.rootStore.appraiseStore.loadAllRecord(this.rootStore.appraiseStore.allCurPage);
        this.rootStore.appraiseStore.loadMyRecord(this.rootStore.appraiseStore.myCurPage);
        this.rootStore.projectStore.updateProjectAppraiseCount(notice.NewAppraiseNotice.project_id);
      }
    } else if (notice.NewVoteNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.NewVoteNotice.project_id) {
        this.rootStore.appraiseStore.loadAllRecord(this.rootStore.appraiseStore.allCurPage);
        this.rootStore.appraiseStore.loadMyRecord(this.rootStore.appraiseStore.myCurPage);
        this.rootStore.appraiseStore.loadUserScore();
        this.rootStore.projectStore.updateProjectAppraiseCount(notice.NewVoteNotice.project_id);
      }
    }
  }

  private processClientNotice(notice: NoticeType.client.AllNotice) {
    if (notice.UploadSnapShotNotice !== undefined) {
      //TODO
    } else if (notice.WrongSessionNotice !== undefined) {
      if (notice.WrongSessionNotice.name.indexOf("snap") == -1) { //忽略快照相关接口报错
        this.rootStore.userStore.logout();
      }
    } else if (notice.SwitchUserNotice !== undefined) {
      this.rootStore.userStore.logout();
    }
  }

  private async processProjectNotice(notice: NoticeType.project.AllNotice) {
    if (notice.UpdateProjectNotice !== undefined) {
      await this.rootStore.projectStore.updateProject(notice.UpdateProjectNotice.project_id);
    } else if (notice.RemoveProjectNotice !== undefined) {
      this.rootStore.projectStore.removeProject(notice.RemoveProjectNotice.project_id, this.history);
    } else if (notice.AddMemberNotice !== undefined) {
      if (notice.AddMemberNotice.project_id == this.rootStore.projectStore.curProjectId) {
        //更新成员信息
        await this.rootStore.memberStore.updateMemberInfo(notice.AddMemberNotice.project_id, notice.AddMemberNotice.member_user_id);
        const member = this.rootStore.memberStore.getMember(notice.AddMemberNotice.member_user_id);
        if (member != undefined) {
          await this.rootStore.memberStore.updateLastEvent(notice.AddMemberNotice.project_id, notice.AddMemberNotice.member_user_id, member.member.last_event_id);
        }
        await this.rootStore.memberStore.updateIssueState(notice.AddMemberNotice.project_id, notice.AddMemberNotice.member_user_id);
      }
    } else if (notice.UpdateMemberNotice !== undefined) {
      if (notice.UpdateMemberNotice.project_id == this.rootStore.projectStore.curProjectId) {
        await this.rootStore.memberStore.updateMemberInfo(notice.UpdateMemberNotice.project_id, notice.UpdateMemberNotice.member_user_id);
      }
    } else if (notice.RemoveMemberNotice !== undefined) {
      if (notice.RemoveMemberNotice.member_user_id == this.rootStore.userStore.userInfo.userId) {
        this.rootStore.projectStore.removeProject(notice.RemoveMemberNotice.project_id, this.history);
      } else if (notice.RemoveMemberNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.memberStore.loadMemberList(notice.RemoveMemberNotice.project_id);
      }
    } else if (notice.AddChannelNotice !== undefined) {
      if (notice.AddChannelNotice.project_id == this.rootStore.projectStore.curProjectId) {
        await this.rootStore.channelStore.updateChannel(notice.AddChannelNotice.channel_id);
      }
    } else if (notice.UpdateChannelNotice !== undefined) {
      if (notice.UpdateChannelNotice.project_id == this.rootStore.projectStore.curProjectId) {
        await this.rootStore.channelStore.updateChannel(notice.UpdateChannelNotice.channel_id);
      }
    } else if (notice.RemoveChannelNotice !== undefined) {
      if (notice.RemoveChannelNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.channelStore.removeChannel(notice.RemoveChannelNotice.channel_id);
      }
    } else if (notice.AddChannelMemberNotice !== undefined) {
      if (notice.AddChannelMemberNotice.project_id == this.rootStore.projectStore.curProjectId &&
        notice.AddChannelMemberNotice.member_user_id == this.rootStore.userStore.userInfo.userId) {
        await this.rootStore.channelStore.updateChannel(notice.AddChannelMemberNotice.channel_id);
      } else if (notice.AddChannelMemberNotice.project_id == this.rootStore.projectStore.curProjectId &&
        notice.AddChannelMemberNotice.channel_id == this.rootStore.channelStore.curChannelId) {
        await this.rootStore.channelMemberStore.loadChannelMemberList(notice.AddChannelMemberNotice.project_id, notice.AddChannelMemberNotice.channel_id);
      }
    } else if (notice.RemoveChannelMemberNotice !== undefined) {
      if (notice.RemoveChannelMemberNotice.project_id == this.rootStore.projectStore.curProjectId &&
        notice.RemoveChannelMemberNotice.member_user_id == this.rootStore.userStore.userInfo.userId) {
        //重新加载频道列表
        await this.rootStore.channelStore.loadChannelList(this.rootStore.projectStore.curProjectId);
      } else if (notice.RemoveChannelMemberNotice.project_id == this.rootStore.projectStore.curProjectId &&
        notice.RemoveChannelMemberNotice.channel_id == this.rootStore.channelStore.curChannelId) {
        await this.rootStore.channelMemberStore.loadChannelMemberList(notice.RemoveChannelMemberNotice.project_id,
          notice.RemoveChannelMemberNotice.channel_id);
      }
    } else if (notice.NewMsgNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId == notice.NewMsgNotice.project_id) {
        //更新频道消息数量
        await this.rootStore.channelStore.updateUnReadMsgCount(notice.NewMsgNotice.channel_id);
      }
      //更新当前频道消息
      if (this.rootStore.projectStore.curProjectId == notice.NewMsgNotice.project_id && this.rootStore.channelStore.curChannelId == notice.NewMsgNotice.channel_id) {
        await this.rootStore.chatMsgStore.onNewMsg(notice.NewMsgNotice.project_id, notice.NewMsgNotice.channel_id);
      }
      //更新未读消息数量
      this.rootStore.projectStore.updateProjectUnreadMsgCount(notice.NewMsgNotice.project_id);
    } else if (notice.UpdateMsgNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId == notice.UpdateMsgNotice.project_id && this.rootStore.channelStore.curChannelId == notice.UpdateMsgNotice.channel_id) {
        //替换内容
        this.rootStore.chatMsgStore.updateMsg(notice.UpdateMsgNotice.msg_id);
      }
    } else if (notice.SetWorkSnapShotNotice !== undefined) {
      if (notice.SetWorkSnapShotNotice.project_id == this.rootStore.projectStore.curProjectId) {
        await this.rootStore.memberStore.updateSnapShot(notice.SetWorkSnapShotNotice.member_user_id, notice.SetWorkSnapShotNotice.enable);
      }
      if (notice.SetWorkSnapShotNotice.member_user_id == this.rootStore.userStore.userInfo.userId) {
        await this.rootStore.projectStore.updateSnapShot(notice.SetWorkSnapShotNotice.project_id, notice.SetWorkSnapShotNotice.enable);
      }
    } else if (notice.UserOnlineNotice !== undefined) {
      await this.rootStore.memberStore.updateOnline(notice.UserOnlineNotice.user_id, true);
    } else if (notice.UserOfflineNotice !== undefined) {
      await this.rootStore.memberStore.updateOnline(notice.UserOfflineNotice.user_id, false);
    } else if (notice.NewEventNotice !== undefined) {
      if (notice.NewEventNotice.project_id == this.rootStore.projectStore.curProjectId) {
        await this.rootStore.memberStore.updateLastEvent(notice.NewEventNotice.project_id, notice.NewEventNotice.member_user_id, notice.NewEventNotice.event_id);
      }
      this.rootStore.projectStore.addNewEventCount(notice.NewEventNotice.project_id);
    } else if (notice.SetMemberRoleNotice !== undefined) {
      if (notice.SetMemberRoleNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.memberStore.updateMemberRole(notice.SetMemberRoleNotice.member_user_id, notice.SetMemberRoleNotice.role_id);
      }
    } else if (notice.SetMemberFloatNotice !== undefined) {
      if (notice.SetMemberFloatNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.memberStore.updateFloatNoticeCount(notice.SetMemberFloatNotice.member_user_id, notice.SetMemberFloatNotice.float_notice_per_day);
      }
    } else if (notice.ReminderNotice !== undefined) {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        let linkType = "";
        if (notice.ReminderNotice.link_type == MSG_LINK_TASK) {
          linkType = "任务";
        } else if (notice.ReminderNotice.link_type == MSG_LINK_BUG) {
          linkType = "缺陷";
        } else if (notice.ReminderNotice.link_type == MSG_LINK_CHANNEL) {
          linkType = "频道";
        }
        const body = `在项目 ${notice.ReminderNotice.project_name} ${linkType} ${notice.ReminderNotice.link_title} 提到了你`;
        sendNotification({ title: "凌鲨", body: body });
      }
    } else if (notice.UpdateShortNoteNotice !== undefined) {
      if (notice.UpdateShortNoteNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.memberStore.updateShortNote(notice.UpdateShortNoteNotice.project_id, notice.UpdateShortNoteNotice.member_user_id);
      }
    }
  }

  private async processIssueNotice(notice: NoticeType.issue.AllNotice) {
    if (notice.NewIssueNotice !== undefined) {
      await this.rootStore.projectStore.updateProjectIssueCount(notice.NewIssueNotice.project_id);
      if (notice.NewIssueNotice.project_id == this.rootStore.projectStore.curProjectId) {
        await this.rootStore.memberStore.updateIssueState(notice.NewIssueNotice.project_id, notice.NewIssueNotice.create_user_id);
      }
    } else if (notice.SetExecUserNotice !== undefined) {
      await this.rootStore.projectStore.updateProjectIssueCount(notice.SetExecUserNotice.project_id);
      if (notice.SetExecUserNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (notice.SetExecUserNotice.exec_user_id != notice.SetExecUserNotice.old_exec_user_id) {
          if (notice.SetExecUserNotice.exec_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetExecUserNotice.project_id, notice.SetExecUserNotice.exec_user_id);
          }
          if (notice.SetExecUserNotice.old_exec_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetExecUserNotice.project_id, notice.SetExecUserNotice.old_exec_user_id);
          }
        }
      }
    } else if (notice.SetCheckUserNotice !== undefined) {
      this.rootStore.projectStore.updateProjectIssueCount(notice.SetCheckUserNotice.project_id);
      if (notice.SetCheckUserNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (notice.SetCheckUserNotice.check_user_id != notice.SetCheckUserNotice.old_check_user_id) {
          if (notice.SetCheckUserNotice.check_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetCheckUserNotice.project_id, notice.SetCheckUserNotice.check_user_id);
          }
          if (notice.SetCheckUserNotice.old_check_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetCheckUserNotice.project_id, notice.SetCheckUserNotice.old_check_user_id);
          }
        }
      }
    } else if (notice.UpdateIssueNotice !== undefined) {
      //TODO
    }
    else if (notice.UpdateIssueStateNotice !== undefined) {
      this.rootStore.projectStore.updateProjectIssueCount(notice.UpdateIssueStateNotice.project_id);
      if (notice.UpdateIssueStateNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (notice.UpdateIssueStateNotice.exec_user_id != "") {
          await this.rootStore.memberStore.updateIssueState(notice.UpdateIssueStateNotice.project_id, notice.UpdateIssueStateNotice.exec_user_id);
        }
        if (notice.UpdateIssueStateNotice.check_user_id != "") {
          await this.rootStore.memberStore.updateIssueState(notice.UpdateIssueStateNotice.project_id, notice.UpdateIssueStateNotice.check_user_id);
        }
      }
    } else if (notice.RemoveIssueNotice !== undefined) {
      this.rootStore.projectStore.updateProjectIssueCount(notice.RemoveIssueNotice.project_id);
      if (notice.RemoveIssueNotice.create_user_id != "") {
        await this.rootStore.memberStore.updateIssueState(notice.RemoveIssueNotice.project_id, notice.RemoveIssueNotice.create_user_id);
      }
      if (notice.RemoveIssueNotice.exec_user_id != "") {
        await this.rootStore.memberStore.updateIssueState(notice.RemoveIssueNotice.project_id, notice.RemoveIssueNotice.exec_user_id);
      }
      if (notice.RemoveIssueNotice.check_user_id != "") {
        await this.rootStore.memberStore.updateIssueState(notice.RemoveIssueNotice.project_id, notice.RemoveIssueNotice.check_user_id);
      }
    }
  }

  private async processShortNoteEvent(ev: ShortNoteEvent) {
    if (ev.shortNoteType == SHORT_NOTE_TASK) {
      this.rootStore.linkAuxStore.goToLink(new LinkTaskInfo("", ev.projectId, ev.targetId), this.history);
    } else if (ev.shortNoteType == SHORT_NOTE_BUG) {
      this.rootStore.linkAuxStore.goToLink(new LinkBugInfo("", ev.projectId, ev.targetId), this.history);
    } else if (ev.shortNoteType == SHORT_NOTE_DOC) {
      this.rootStore.linkAuxStore.goToLink(new LinkDocInfo("", ev.projectId, ev.extraTargetValue, ev.targetId), this.history);
    } else if (ev.shortNoteType == SHORT_NOTE_CHANNEL) {
      this.rootStore.linkAuxStore.goToLink(new LinkChannelInfo("", ev.projectId, ev.extraTargetValue, ev.targetId), this.history);
    }
    await appWindow.show();
    await appWindow.setAlwaysOnTop(true);
    setTimeout(() => {
      appWindow.setAlwaysOnTop(false);
    }, 500);
  }

  private async processFloatNoticeDetailEvent(ev: FloatNoticeDetailEvent) {
    this.rootStore.linkAuxStore.goToLink(new LinkChannelInfo("", ev.projectId, ev.channelId, ev.msgId), this.history);
  }
}



export default NoticeStore;
