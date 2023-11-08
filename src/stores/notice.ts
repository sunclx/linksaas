import { makeAutoObservable, runInAction } from 'mobx';
import type * as NoticeType from '@/api/notice_type'
import { listen } from '@tauri-apps/api/event';
import type { UnlistenFn } from '@tauri-apps/api/event';
import type { RootStore } from '.';
import type { ShortNoteEvent } from '@/utils/short_note';
import { showShortNote } from '@/utils/short_note';
import { SHORT_NOTE_TASK, SHORT_NOTE_BUG, SHORT_NOTE_MODE_DETAIL, SHORT_NOTE_MODE_SHOW } from '@/api/short_note';
import { LinkBugInfo, LinkTaskInfo } from './linkAux';
import { isString } from 'lodash';
import type { History } from 'history';
import { createBrowserHistory } from 'history';
import { appWindow, getAll as getAllWindow } from '@tauri-apps/api/window';
import { request } from '@/utils/request';
import { get as get_issue } from '@/api/project_issue';
import { APP_PROJECT_HOME_PATH, USER_LOGIN_PATH } from '@/utils/constant';
import { message } from 'antd';
import { COMMENT_TARGET_API_COLL, COMMENT_TARGET_CI_CD, COMMENT_TARGET_DATA_ANNO, type COMMENT_TARGET_TYPE } from '@/api/project_comment';

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
        } else if (notice.IssueNotice !== undefined) {
          this.processIssueNotice(notice.IssueNotice);
        } else if (notice.ClientNotice !== undefined) {
          this.processClientNotice(notice.ClientNotice);
        } else if (notice.IdeaNotice !== undefined) {
          this.processIdeaNotice(notice.IdeaNotice);
        } else if (notice.CommentNotice !== undefined) {
          this.processCommentNotice(notice.CommentNotice);
        } else if (notice.BoardNotice !== undefined) {
          this.processBoardNotice(notice.BoardNotice);
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

  private async forwardCommentNotice(targetType: COMMENT_TARGET_TYPE, targetId: string, notice: NoticeType.comment.AllNotice) {
    let forward = false;
    if (targetType == COMMENT_TARGET_CI_CD) {
      forward = true;
    } else if (targetType == COMMENT_TARGET_API_COLL) {
      forward = true;
    } else if (targetType == COMMENT_TARGET_DATA_ANNO) {
      forward = true;
    }
    if (forward == false) {
      return;
    }
    const winList = await getAllWindow();
    for (const win of winList) {
      if (win.label.includes(targetId)) {
        win.emit("notice", { CommentNotice: notice });
      }
    }
  }

  private processCommentNotice(notice: NoticeType.comment.AllNotice) {
    if (notice.AddCommentNotice !== undefined) {
      this.forwardCommentNotice(notice.AddCommentNotice.target_type, notice.AddCommentNotice.target_id, notice);
      this.rootStore.projectStore.updateUnReadCommentStatus(notice.AddCommentNotice.project_id);
    } else if (notice.UpdateCommentNotice !== undefined) {
      this.forwardCommentNotice(notice.UpdateCommentNotice.target_type, notice.UpdateCommentNotice.target_id, notice);
    } else if (notice.RemoveCommentNotice !== undefined) {
      this.forwardCommentNotice(notice.RemoveCommentNotice.target_type, notice.RemoveCommentNotice.target_id, notice);
    } else if (notice.RemoveUnReadNotice !== undefined) {
      this.rootStore.projectStore.updateUnReadCommentStatus(notice.RemoveUnReadNotice.project_id);
    }
  }

  private processBoardNotice(notice: NoticeType.board.AllNotice) {
    if(notice.CreateNodeNotice !== undefined){
      if(notice.CreateNodeNotice.board_id == this.rootStore.entryStore.curEntry?.entry_id){
        this.rootStore.boardStore.updateNode(notice.CreateNodeNotice.node_id);
      }
    }else if(notice.UpdateNodeNotice !== undefined){
      if(notice.UpdateNodeNotice.board_id == this.rootStore.entryStore.curEntry?.entry_id){
        this.rootStore.boardStore.updateNode(notice.UpdateNodeNotice.node_id);
      }
    }else if(notice.RemoveNodeNotice !== undefined){
      if(notice.RemoveNodeNotice.board_id == this.rootStore.entryStore.curEntry?.entry_id){
        this.rootStore.boardStore.removeNode(notice.RemoveNodeNotice.node_id);
      }
    }else if(notice.CreateEdgeNotice !== undefined){
      if(notice.CreateEdgeNotice.board_id == this.rootStore.entryStore.curEntry?.entry_id){
        this.rootStore.boardStore.updateEdge({
          from_node_id: notice.CreateEdgeNotice.from_node_id,
          from_handle_id: notice.CreateEdgeNotice.from_handle_id,
          to_node_id: notice.CreateEdgeNotice.to_node_id,
          to_handle_id: notice.CreateEdgeNotice.to_handle_id,
        });
      }
    }else if(notice.UpdateEdgeNotice !== undefined){
      if(notice.UpdateEdgeNotice.board_id == this.rootStore.entryStore.curEntry?.entry_id){
        this.rootStore.boardStore.updateEdge({
          from_node_id: notice.UpdateEdgeNotice.from_node_id,
          from_handle_id: notice.UpdateEdgeNotice.from_handle_id,
          to_node_id: notice.UpdateEdgeNotice.to_node_id,
          to_handle_id: notice.UpdateEdgeNotice.to_handle_id,
        });
      }
    }else if(notice.RemoveEdgeNotice !== undefined){
      if(notice.RemoveEdgeNotice.board_id == this.rootStore.entryStore.curEntry?.entry_id){
        this.rootStore.boardStore.removeEdge({
          from_node_id: notice.RemoveEdgeNotice.from_node_id,
          from_handle_id: notice.RemoveEdgeNotice.from_handle_id,
          to_node_id: notice.RemoveEdgeNotice.to_node_id,
          to_handle_id: notice.RemoveEdgeNotice.to_handle_id,
        });
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
        // this.rootStore.userStore.logout();
        message.warn("会话失效");
      }
    } else if (notice.SwitchUserNotice !== undefined) {
      this.rootStore.userStore.logout();
    } else if (notice.GitPostHookNotice !== undefined) {
      await appWindow.show();
      await appWindow.unminimize();
      await appWindow.setAlwaysOnTop(true);
      setTimeout(() => {
        appWindow.setAlwaysOnTop(false);
      }, 200);
      const projectId = notice.GitPostHookNotice.project_id;
      if (projectId != this.rootStore.projectStore.curProjectId) {
        if (this.rootStore.docStore.inEdit) {
          this.rootStore.docStore.showCheckLeave(() => {
            this.rootStore.projectStore.setCurProjectId(projectId).then(() => {
              this.rootStore.projectStore.showPostHookModal = true;
              this.history.push(APP_PROJECT_HOME_PATH);
            });
          });
        } else {
          await this.rootStore.projectStore.setCurProjectId(projectId);
          this.rootStore.projectStore.showPostHookModal = true;
          this.history.push(APP_PROJECT_HOME_PATH);
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
    } else if (notice.UpdateShortNoteNotice !== undefined) {
      if (notice.UpdateShortNoteNotice.project_id == this.rootStore.projectStore.curProjectId) {
        this.rootStore.memberStore.updateShortNote(notice.UpdateShortNoteNotice.project_id, notice.UpdateShortNoteNotice.member_user_id);
      }
    } else if (notice.UpdateAlarmStatNotice !== undefined) {
      this.rootStore.projectStore.updateAlarmStatus(notice.UpdateAlarmStatNotice.project_id);
    } else if (notice.CreateBulletinNotice !== undefined) {
      this.rootStore.projectStore.updateBulletinStatus(notice.CreateBulletinNotice.project_id);
    } else if (notice.UpdateBulletinNotice !== undefined) {
      this.rootStore.projectStore.updateBulletinStatus(notice.UpdateBulletinNotice.project_id);
    } else if (notice.RemoveBulletinNotice !== undefined) {
      this.rootStore.projectStore.updateBulletinStatus(notice.RemoveBulletinNotice.project_id);
    } else if (notice.AddTagNotice !== undefined) {
      this.rootStore.projectStore.updateTagList(notice.AddTagNotice.project_id);
    } else if (notice.UpdateTagNotice !== undefined) {
      this.rootStore.projectStore.updateTagList(notice.UpdateTagNotice.project_id);
    } else if (notice.RemoveTagNotice !== undefined) {
      this.rootStore.projectStore.updateTagList(notice.RemoveTagNotice.project_id);
    } else if (notice.UpdateSpritNotice !== undefined) {
      if (notice.UpdateSpritNotice.project_id == this.rootStore.projectStore.curProjectId && notice.UpdateSpritNotice.sprit_id == (this.rootStore.entryStore.curEntry?.entry_id ?? "")) {
        this.rootStore.spritStore.incCurSpritVersion();
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
      await this.rootStore.spritStore.updateIssue(notice.SetExecUserNotice.issue_id);
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
      await this.rootStore.spritStore.updateIssue(notice.SetCheckUserNotice.issue_id);
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
      await this.rootStore.spritStore.updateIssue(notice.UpdateIssueNotice.issue_id);
      if (notice.UpdateIssueNotice.project_id == this.rootStore.projectStore.curProjectId) {
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
      }
    } else if (notice.RemoveIssueNotice !== undefined) {
      await this.rootStore.projectStore.updateProjectIssueCount(notice.RemoveIssueNotice.project_id);
      await this.rootStore.spritStore.removeIssue(notice.RemoveIssueNotice.issue_id);
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
      }
    } else if (notice.SetSpritNotice !== undefined) {
      if ((this.rootStore.entryStore.curEntry?.entry_id ?? "") == notice.SetSpritNotice.old_sprit_id) {
        await this.rootStore.spritStore.removeIssue(notice.SetSpritNotice.issue_id);
      }
      if ((this.rootStore.entryStore.curEntry?.entry_id ?? "") == notice.SetSpritNotice.new_sprit_id) {
        await this.rootStore.spritStore.onNewIssue(notice.SetSpritNotice.issue_id);
      }
    }
  }

  private async processShortNoteEvent(ev: ShortNoteEvent) {
    if (ev.shortNoteType == SHORT_NOTE_TASK) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        if (this.rootStore.appStore.focusMode && ev.projectId != this.rootStore.projectStore.curProjectId) {
          return;
        }
        this.rootStore.linkAuxStore.goToLink(new LinkTaskInfo("", ev.projectId, ev.targetId), this.history);
      } else if (ev.shortNoteModeType == SHORT_NOTE_MODE_SHOW) {
        const res = await request(get_issue(this.rootStore.userStore.sessionId, ev.projectId, ev.targetId));
        if (res) {
          await showShortNote(this.rootStore.userStore.sessionId, {
            shortNoteType: ev.shortNoteType,
            data: res.info,
          }, this.rootStore.projectStore.getProject(ev.projectId)?.basic_info.project_name ?? "");
        }
      }
    } else if (ev.shortNoteType == SHORT_NOTE_BUG) {
      if (ev.shortNoteModeType == SHORT_NOTE_MODE_DETAIL) {
        if (this.rootStore.appStore.focusMode && ev.projectId != this.rootStore.projectStore.curProjectId) {
          return;
        }
        this.rootStore.linkAuxStore.goToLink(new LinkBugInfo("", ev.projectId, ev.targetId), this.history);
      } else if (ev.shortNoteModeType == SHORT_NOTE_MODE_SHOW) {
        const res = await request(get_issue(this.rootStore.userStore.sessionId, ev.projectId, ev.targetId));
        if (res) {
          await showShortNote(this.rootStore.userStore.sessionId, {
            shortNoteType: ev.shortNoteType,
            data: res.info,
          }, this.rootStore.projectStore.getProject(ev.projectId)?.basic_info.project_name ?? "");
        }
      }
    }

    await appWindow.show();
    await appWindow.unminimize();
    await appWindow.setAlwaysOnTop(true);
    setTimeout(() => {
      appWindow.setAlwaysOnTop(false);
    }, 200);
  }

}



export default NoticeStore;
