import { makeAutoObservable, runInAction } from 'mobx';
import type * as NoticeType from '@/api/notice_type'
import { listen } from '@tauri-apps/api/event';
import type { UnlistenFn } from '@tauri-apps/api/event';
import type { RootStore } from '.';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { MSG_LINK_TASK, MSG_LINK_BUG, MSG_LINK_CHANNEL } from '@/api/project_channel';
import type { ShortNoteEvent } from '@/utils/short_note';
import { showShortNote } from '@/utils/short_note';
import { SHORT_NOTE_TASK, SHORT_NOTE_BUG, SHORT_NOTE_DOC, SHORT_NOTE_CHANNEL, SHORT_NOTE_MODE_DETAIL, SHORT_NOTE_MODE_SHOW, SHORT_NOTE_MEMBER, SHORT_NOTE_MODE_CREATE, SHORT_NOTE_TEST_CASE } from '@/api/short_note';
import { LinkBugInfo, LinkDocInfo, LinkTaskInfo, LinkChannelInfo } from './linkAux';
import { isString } from 'lodash';
import type { History } from 'history';
import { createBrowserHistory } from 'history';
import { appWindow } from '@tauri-apps/api/window';
import { request } from '@/utils/request';
import { ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, get as get_issue } from '@/api/project_issue';
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_OVERVIEW_PATH, USER_LOGIN_PATH } from '@/utils/constant';


class NoticeStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  private rootStore: RootStore;
  private unlistenFn: UnlistenFn | null = null;
  private unlistenShortNoteFn: UnlistenFn | null = null;

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
      try {
        const notice = ev.payload
        console.log("notice", notice);
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
        } else if (notice.IdeaNotice !== undefined) {
          this.processIdeaNotice(notice.IdeaNotice);
        }
      } catch (e) {
        console.log(e);
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
      try {
        if (isString(ev.payload)) {
          this.processShortNoteEvent(JSON.parse(ev.payload));
        } else {
          this.processShortNoteEvent(ev.payload);
        }
      } catch (e) {
        console.log(e);
      }

    });
    runInAction(() => {
      this.unlistenShortNoteFn = unlistenShortNoteFn;
    });

  }

  private async processProjectDocNotice(notice: NoticeType.project_doc.AllNotice) {
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
      if (notice.UpdateDocNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (notice.UpdateDocNotice.doc_id == this.rootStore.docSpaceStore.curDocId) {
          this.rootStore.docSpaceStore.updateCurDoc();
        }
      }
    } else if (notice.RemoveDocNotice !== undefined) {
      //skip
    } else if (notice.RecoverDocInRecycleNotice !== undefined) {
      //skip
    } else if (notice.RemoveDocInRecycleNotice !== undefined) {
      //skip
    } else if (notice.LinkSpritNotice !== undefined) {
      if (notice.LinkSpritNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (this.rootStore.spritStore.curSpritId == notice.LinkSpritNotice.sprit_id) {
          await this.rootStore.spritStore.onLinkDoc(notice.LinkSpritNotice.doc_id);
        }
      }
    } else if (notice.CancelLinkSpritNotice !== undefined) {
      if (notice.CancelLinkSpritNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (this.rootStore.spritStore.curSpritId == notice.CancelLinkSpritNotice.sprit_id) {
          this.rootStore.spritStore.onCancelLinkDoc(notice.CancelLinkSpritNotice.doc_id);
        }
      }
    }
  }

  private processAppraiseNotice(notice: NoticeType.appraise.AllNotice) {
    if (notice.NewAppraiseNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.NewAppraiseNotice.project_id) {
        this.rootStore.appraiseStore.loadAllRecord(this.rootStore.appraiseStore.allCurPage);
        this.rootStore.appraiseStore.loadMyRecord(this.rootStore.appraiseStore.myCurPage);
        this.rootStore.projectStore.updateProjectAppraiseCount(notice.NewAppraiseNotice.project_id);
      }
    } else if (notice.UpdateAppraiseNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.UpdateAppraiseNotice.project_id) {
        this.rootStore.appraiseStore.loadAllRecord(this.rootStore.appraiseStore.allCurPage);
        this.rootStore.appraiseStore.loadMyRecord(this.rootStore.appraiseStore.myCurPage);
      }
    } else if (notice.RemoveAppraiseNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.RemoveAppraiseNotice.project_id) {
        this.rootStore.appraiseStore.loadAllRecord(this.rootStore.appraiseStore.allCurPage);
        this.rootStore.appraiseStore.loadMyRecord(this.rootStore.appraiseStore.myCurPage);
        this.rootStore.appraiseStore.loadUserScore();
        this.rootStore.projectStore.updateProjectAppraiseCount(notice.RemoveAppraiseNotice.project_id);
      }
    } else if (notice.NewVoteNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.NewVoteNotice.project_id) {
        this.rootStore.appraiseStore.loadAllRecord(this.rootStore.appraiseStore.allCurPage);
        this.rootStore.appraiseStore.loadMyRecord(this.rootStore.appraiseStore.myCurPage);
        this.rootStore.appraiseStore.loadUserScore();
        this.rootStore.projectStore.updateProjectAppraiseCount(notice.NewVoteNotice.project_id);
      }
    } else if (notice.RevokeVoteNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.RevokeVoteNotice.project_id) {
        this.rootStore.appraiseStore.loadAllRecord(this.rootStore.appraiseStore.allCurPage);
        this.rootStore.appraiseStore.loadMyRecord(this.rootStore.appraiseStore.myCurPage);
        this.rootStore.appraiseStore.loadUserScore();
      }
    }
  }

  private async processIdeaNotice(notice: NoticeType.idea.AllNotice) {
    if (notice.KeywordChangeNotice !== undefined) {
      if (this.rootStore.projectStore.curProjectId === notice.KeywordChangeNotice.project_id) {
        this.rootStore.ideaStore.updateKeyword(notice.KeywordChangeNotice.add_keyword_list, notice.KeywordChangeNotice.remove_keyword_list);
      }
    }
  }

  private async processClientNotice(notice: NoticeType.client.AllNotice) {
    if (notice.WrongSessionNotice !== undefined) {
      if (this.rootStore.userStore.adminSessionId != "") {
        runInAction(() => {
          this.rootStore.userStore.adminSessionId = "";
        });
        this.history.push(USER_LOGIN_PATH);
      } else {
        this.rootStore.userStore.logout();
      }
    } else if (notice.SwitchUserNotice !== undefined) {
      this.rootStore.userStore.logout();
    } else if (notice.GitPostHookNotice !== undefined) {
      const projectId = notice.GitPostHookNotice.project_id;
      if (projectId != this.rootStore.projectStore.curProjectId) {
        if (this.rootStore.docSpaceStore.inEdit) {
          this.rootStore.docSpaceStore.showCheckLeave(() => {
            this.rootStore.projectStore.setCurProjectId(projectId).then(() => {
              this.rootStore.projectStore.showPostHookModal = true;
              //TODO work plan
              if (this.rootStore.projectStore.curProject?.setting.disable_kb == false) {
                this.history.push(APP_PROJECT_KB_DOC_PATH);
              } else if (this.rootStore.projectStore.curProject?.setting.disable_chat == false) {
                this.history.push(APP_PROJECT_CHAT_PATH);
              } else {
                this.history.push(APP_PROJECT_OVERVIEW_PATH);
              }
            });
          });
        } else {
          await this.rootStore.projectStore.setCurProjectId(projectId);
          this.rootStore.projectStore.showPostHookModal = true;
          //TODO work plan
          if (this.rootStore.projectStore.curProject?.setting.disable_kb == false) {
            this.history.push(APP_PROJECT_KB_DOC_PATH);
          } else if (this.rootStore.projectStore.curProject?.setting.disable_chat == false) {
            this.history.push(APP_PROJECT_CHAT_PATH);
          } else {
            this.history.push(APP_PROJECT_OVERVIEW_PATH);
          }
        }
      } else {
        this.rootStore.projectStore.showPostHookModal = true;
      }
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
      } else {
        const projectId = notice.AddMemberNotice.project_id;
        const index = this.rootStore.projectStore.projectList.findIndex(item => item.project_id == projectId);
        if (index == -1) {
          await this.rootStore.projectStore.updateProject(projectId);
        }
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
    } else if (notice.UpdateAlarmStatNotice !== undefined) {
      if (notice.UpdateAlarmStatNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.projectStore.addAlarmVersion();
      }
    } else if (notice.CreateBulletinNotice !== undefined) {
      this.rootStore.projectStore.incBulletinVersion(notice.CreateBulletinNotice.project_id);
    } else if (notice.UpdateBulletinNotice !== undefined) {
      this.rootStore.projectStore.incBulletinVersion(notice.UpdateBulletinNotice.project_id);
    } else if (notice.RemoveBulletinNotice !== undefined) {
      this.rootStore.projectStore.incBulletinVersion(notice.RemoveBulletinNotice.project_id);
    } else if (notice.AddTagNotice !== undefined) {
      this.rootStore.projectStore.incTagVersion(notice.AddTagNotice.project_id);
    } else if (notice.UpdateTagNotice !== undefined) {
      this.rootStore.projectStore.incTagVersion(notice.UpdateTagNotice.project_id);
    } else if (notice.RemoveTagNotice !== undefined) {
      this.rootStore.projectStore.incTagVersion(notice.RemoveTagNotice.project_id);
    } else if (notice.UpdateSpritNotice !== undefined) {
      if (notice.UpdateSpritNotice.project_id == this.rootStore.projectStore.curProjectId && notice.UpdateSpritNotice.sprit_id == this.rootStore.spritStore.curSpritId) {
        this.rootStore.spritStore.incCurSpritVersion();
      }
    }
  }

  private async processIssueNotice(notice: NoticeType.issue.AllNotice) {
    if (notice.NewIssueNotice !== undefined) {
      await this.rootStore.projectStore.updateProjectIssueCount(notice.NewIssueNotice.project_id);
      if (notice.NewIssueNotice.project_id == this.rootStore.projectStore.curProjectId) {
        await this.rootStore.memberStore.updateIssueState(notice.NewIssueNotice.project_id, notice.NewIssueNotice.create_user_id);
        if (this.rootStore.appStore.simpleMode) {
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_TASK);
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_BUG);
        }
      }
    } else if (notice.SetExecUserNotice !== undefined) {
      await this.rootStore.projectStore.updateProjectIssueCount(notice.SetExecUserNotice.project_id);
      await this.rootStore.spritStore.updateIssue(notice.SetExecUserNotice.issue_id);
      if (notice.SetExecUserNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (notice.SetExecUserNotice.exec_user_id != notice.SetExecUserNotice.old_exec_user_id) {
          if (notice.SetExecUserNotice.exec_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetExecUserNotice.project_id, notice.SetExecUserNotice.exec_user_id);
          }
          if (notice.SetExecUserNotice.old_exec_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetExecUserNotice.project_id, notice.SetExecUserNotice.old_exec_user_id);
          }
          if (this.rootStore.appStore.simpleMode) {
            await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_TASK);
            await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_BUG);
          }
        }
      }
    } else if (notice.SetCheckUserNotice !== undefined) {
      this.rootStore.projectStore.updateProjectIssueCount(notice.SetCheckUserNotice.project_id);
      await this.rootStore.spritStore.updateIssue(notice.SetCheckUserNotice.issue_id);
      if (notice.SetCheckUserNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (notice.SetCheckUserNotice.check_user_id != notice.SetCheckUserNotice.old_check_user_id) {
          if (notice.SetCheckUserNotice.check_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetCheckUserNotice.project_id, notice.SetCheckUserNotice.check_user_id);
          }
          if (notice.SetCheckUserNotice.old_check_user_id != "") {
            await this.rootStore.memberStore.updateIssueState(notice.SetCheckUserNotice.project_id, notice.SetCheckUserNotice.old_check_user_id);
          }
          if (this.rootStore.appStore.simpleMode) {
            await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_TASK);
            await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_BUG);
          }
        }
      }
    } else if (notice.UpdateIssueNotice !== undefined) {
      await this.rootStore.spritStore.updateIssue(notice.UpdateIssueNotice.issue_id);
      if (notice.UpdateIssueNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (this.rootStore.appStore.simpleMode) {
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_TASK);
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_BUG);
        }
      }
    }
    else if (notice.UpdateIssueStateNotice !== undefined) {
      this.rootStore.projectStore.updateProjectIssueCount(notice.UpdateIssueStateNotice.project_id);
      await this.rootStore.spritStore.updateIssue(notice.UpdateIssueStateNotice.issue_id);
      if (notice.UpdateIssueStateNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (notice.UpdateIssueStateNotice.exec_user_id != "") {
          await this.rootStore.memberStore.updateIssueState(notice.UpdateIssueStateNotice.project_id, notice.UpdateIssueStateNotice.exec_user_id);
        }
        if (notice.UpdateIssueStateNotice.check_user_id != "") {
          await this.rootStore.memberStore.updateIssueState(notice.UpdateIssueStateNotice.project_id, notice.UpdateIssueStateNotice.check_user_id);
        }
        if (this.rootStore.appStore.simpleMode) {
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_TASK);
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_BUG);
        }
      }
    } else if (notice.RemoveIssueNotice !== undefined) {
      this.rootStore.projectStore.updateProjectIssueCount(notice.RemoveIssueNotice.project_id);
      this.rootStore.spritStore.removeIssue(notice.RemoveIssueNotice.issue_id);
      if (notice.RemoveIssueNotice.create_user_id != "") {
        await this.rootStore.memberStore.updateIssueState(notice.RemoveIssueNotice.project_id, notice.RemoveIssueNotice.create_user_id);
      }
      if (notice.RemoveIssueNotice.exec_user_id != "") {
        await this.rootStore.memberStore.updateIssueState(notice.RemoveIssueNotice.project_id, notice.RemoveIssueNotice.exec_user_id);
      }
      if (notice.RemoveIssueNotice.check_user_id != "") {
        await this.rootStore.memberStore.updateIssueState(notice.RemoveIssueNotice.project_id, notice.RemoveIssueNotice.check_user_id);
      }
      if (notice.RemoveIssueNotice.project_id == this.rootStore.projectStore.curProjectId) {
        if (this.rootStore.appStore.simpleMode) {
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_TASK);
          await this.rootStore.issueStore.loadPrjTodoIssue(this.rootStore.projectStore.curProjectId, ISSUE_TYPE_BUG);
        }
      }
    } else if (notice.SetSpritNotice !== undefined) {
      if (this.rootStore.spritStore.curSpritId == notice.SetSpritNotice.old_sprit_id) {
        this.rootStore.spritStore.removeIssue(notice.SetSpritNotice.issue_id);
      }
      if (this.rootStore.spritStore.curSpritId != "" && this.rootStore.spritStore.curSpritId == notice.SetSpritNotice.new_sprit_id) {
        await this.rootStore.spritStore.onNewIssue(notice.SetSpritNotice.issue_id);
      }
    }
  }

  private async processShortNoteEvent(ev: ShortNoteEvent) {
    if (ev.shortNoteType == SHORT_NOTE_TASK) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        this.rootStore.linkAuxStore.goToLink(new LinkTaskInfo("", ev.projectId, ev.targetId), this.history);
      } else if (ev.shortNoteModeType == SHORT_NOTE_MODE_SHOW) {
        const res = await request(get_issue(this.rootStore.userStore.sessionId, ev.projectId, ev.targetId));
        if (res) {
          await showShortNote(this.rootStore.userStore.sessionId, {
            shortNoteType: ev.shortNoteType,
            data: res.info,
          }, this.rootStore.projectStore.getProject(ev.projectId)?.basic_info.project_name ?? "");
        }
      } else if (ev.shortNoteModeType == SHORT_NOTE_MODE_CREATE) {
        await this.rootStore.linkAuxStore.goToCreateTask("", ev.projectId, this.history);
      }
    } else if (ev.shortNoteType == SHORT_NOTE_BUG) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        this.rootStore.linkAuxStore.goToLink(new LinkBugInfo("", ev.projectId, ev.targetId), this.history);
      } else if (ev.shortNoteModeType == SHORT_NOTE_MODE_SHOW) {
        const res = await request(get_issue(this.rootStore.userStore.sessionId, ev.projectId, ev.targetId));
        if (res) {
          await showShortNote(this.rootStore.userStore.sessionId, {
            shortNoteType: ev.shortNoteType,
            data: res.info,
          }, this.rootStore.projectStore.getProject(ev.projectId)?.basic_info.project_name ?? "");
        }
      } else if (ev.shortNoteModeType == SHORT_NOTE_MODE_CREATE) {
        await this.rootStore.linkAuxStore.goToCreateBug("", ev.projectId, this.history);
      }
    } else if (ev.shortNoteType == SHORT_NOTE_DOC) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        this.rootStore.linkAuxStore.goToLink(new LinkDocInfo("", ev.projectId, ev.extraTargetValue, ev.targetId), this.history);
      } else if (ev.shortNoteModeType == SHORT_NOTE_MODE_CREATE) {
        await this.rootStore.linkAuxStore.goToCreateDoc("", ev.projectId, ev.targetId, this.history);
      }
    } else if (ev.shortNoteType == SHORT_NOTE_CHANNEL) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        this.rootStore.linkAuxStore.goToLink(new LinkChannelInfo("", ev.projectId, ev.extraTargetValue, ev.targetId), this.history);
      }
    } else if (ev.shortNoteType == SHORT_NOTE_MEMBER) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        if (this.rootStore.projectStore.curProjectId != ev.projectId) {
          if (this.rootStore.projectStore.curProjectId == "") {
            await this.rootStore.projectStore.setCurProjectId(ev.projectId);
            this.rootStore.memberStore.floatMemberUserId = ev.targetId;
            this.history.push(APP_PROJECT_CHAT_PATH);
          } else {
            await this.rootStore.projectStore.setCurProjectId(ev.projectId);
            this.rootStore.memberStore.floatMemberUserId = ev.targetId;
          }
        } else {
          this.rootStore.memberStore.floatMemberUserId = ev.targetId;
        }
      }
    } else if (ev.shortNoteType == SHORT_NOTE_TEST_CASE) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        if (ev.projectId != this.rootStore.projectStore.curProjectId) {
          await this.rootStore.projectStore.setCurProjectId(ev.projectId);
        }
        this.rootStore.linkAuxStore.goToTestCaseList({ entryId: ev.targetId }, this.history);
      }
    }
    await appWindow.setAlwaysOnTop(true);
    await appWindow.show();
    await appWindow.unminimize();
    if (ev.shortNoteModeType != SHORT_NOTE_MODE_SHOW) {
      if (this.rootStore.appStore.simpleMode) {
        this.rootStore.appStore.simpleMode = false;
      }
    }
    setTimeout(() => {
      appWindow.setAlwaysOnTop(false);
    }, 500);
  }

}



export default NoticeStore;
