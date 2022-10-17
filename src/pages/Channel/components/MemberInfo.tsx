import React from 'react';
import styles from './MemberInfo.module.less';
import { useStores } from "@/hooks";
import { getTimeDescFromNow } from '@/utils/time';
import EventCom from '@/components/EventCom';
import { useHistory } from 'react-router-dom';
import { ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK } from '@/api/project_issue';
import UserPhoto from '@/components/Portrait/UserPhoto';
import type { ShortNote, SHORT_NOTE_TYPE } from '@/api/short_note';
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK, SHORT_NOTE_DOC } from '@/api/short_note';
import { LinkDocInfo, LinkTaskInfo, LinkBugInfo } from '@/stores/linkAux';
import { observer } from 'mobx-react';


export type MemberInfoProps = {
  memberId: string;
  showLink: boolean;
  hideMemberInfo: () => void;
};

const MemberInfo: React.FC<MemberInfoProps> = (props) => {
  const { memberId } = props;
  const memberStore = useStores("memberStore");
  const linkAuxStore = useStores('linkAuxStore');
  const history = useHistory();

  const getShortNoteTypeName = (shortNoteType: SHORT_NOTE_TYPE): string => {
    if (shortNoteType == SHORT_NOTE_TASK) {
      return "任务";
    } else if (shortNoteType == SHORT_NOTE_BUG) {
      return "缺陷";
    } else if (shortNoteType == SHORT_NOTE_DOC) {
      return "文档";
    }
    return "";
  }

  const goToTarget = (shortNote: ShortNote) => {
    if (shortNote.short_note_type == SHORT_NOTE_TASK) {
      linkAuxStore.goToLink(new LinkTaskInfo(shortNote.title, shortNote.project_id, shortNote.target_id), history);
    } else if (shortNote.short_note_type == SHORT_NOTE_BUG) {
      linkAuxStore.goToLink(new LinkBugInfo(shortNote.title, shortNote.project_id, shortNote.target_id), history);
    } else if (shortNote.short_note_type == SHORT_NOTE_DOC) {
      linkAuxStore.goToLink(new LinkDocInfo(shortNote.title, shortNote.project_id, shortNote.target_id), history);
    }
  };


  const member = memberStore.getMember(memberId);

  return (
    <div className={styles.member_info}>
      <div className={styles.info}>
        <div className={styles.cover}>
          <UserPhoto logoUri={member?.member.logo_uri ?? ""} className={styles.avatar} />
          <div className={member?.member.online ? styles.icon_online : styles.icon_offline} />
        </div>
        <div className={styles.bd}>
          <div className={styles.title}>
            <div className={styles.name}>{member?.member.display_name}</div>
          </div>
          <div className={styles.state}>{member?.member.online ? '在线' : '离线'}</div>
        </div>
      </div>

      <ul className={styles.task_list}>
        <li className={styles.item}>
          <div className={styles.title}>工作状态</div>
          <div className={styles.cont}>
            <div className={styles.member_time}>{getTimeDescFromNow(member?.last_event?.event_time)}</div>
          </div>
        </li>
        <li>
          <div className={styles.member_state}>
            {member?.last_event && <EventCom key={member.last_event.event_id} item={member.last_event!} skipProjectName={true} skipLink={true} showMoreLink={props.showLink} onLinkClick={() => props.hideMemberInfo()} />}
          </div>
        </li>
      </ul>

      <ul className={styles.task_list}>
        <li className={styles.item}>
          <div className={styles.title}>未执行任务</div>
          <div className={styles.cont}><span className={styles.issue_count}>{member?.issue_member_state ? member?.issue_member_state.task_un_exec_count : 0}</span>
            {props.showLink && (member?.issue_member_state?.task_un_exec_count ?? 0) > 0 && (<a onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              linkAuxStore.goToTaskList({
                stateList: [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
                execUserIdList: [member?.member.member_user_id ?? ""],
                checkUserIdList: [],
              }, history);
              props.hideMemberInfo();
            }}>查看详情</a>)}
          </div>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>未检查任务</div>
          <div className={styles.cont}><span className={styles.issue_count}>{member?.issue_member_state ? member?.issue_member_state.task_un_check_count : 0}</span>
            {props.showLink && (member?.issue_member_state?.task_un_check_count ?? 0) > 0 && (<a onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              linkAuxStore.goToTaskList({
                stateList: [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
                execUserIdList: [],
                checkUserIdList: [member?.member.member_user_id ?? ""],
              }, history);
            }}>查看详情</a>)}
          </div>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>创建任务</div>
          <div className={styles.cont}>{member?.issue_member_state ? member?.issue_member_state.task_create_count : 0}</div>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>已执行任务</div>
          <div className={styles.cont}>{member?.issue_member_state ? member?.issue_member_state.task_exec_done_count : 0}</div>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>已检查任务</div>
          <div className={styles.cont}>{member?.issue_member_state ? member?.issue_member_state.task_check_done_count : 0}</div>
        </li>
      </ul>
      <ul className={styles.task_list}>
        <li className={styles.item}>
          <div className={styles.title}>未处理缺陷</div>
          <div className={styles.cont}><span className={styles.issue_count}>{member?.issue_member_state ? member?.issue_member_state.bug_un_exec_count : 0}</span>
            {props.showLink && (member?.issue_member_state?.bug_un_exec_count ?? 0) > 0 && (<a onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              linkAuxStore.goToBugList({
                stateList: [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
                execUserIdList: [member?.member.member_user_id ?? ""],
                checkUserIdList: [],
              }, history);
            }}>查看详情</a>)}
          </div>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>未检查缺陷</div>
          <div className={styles.cont}><span className={styles.issue_count}>{member?.issue_member_state ? member?.issue_member_state.bug_un_check_count : 0}</span>
            {props.showLink && (member?.issue_member_state?.bug_un_check_count ?? 0) > 0 && (<a onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              linkAuxStore.goToBugList({
                stateList: [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
                execUserIdList: [],
                checkUserIdList: [member?.member.member_user_id ?? ""],
              }, history);
            }}>查看详情</a>)}
          </div>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>创建缺陷</div>
          <div className={styles.cont}>{member?.issue_member_state ? member?.issue_member_state.bug_create_count : 0}</div>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>已处理缺陷</div>
          <div className={styles.cont}>{member?.issue_member_state ? member?.issue_member_state.bug_exec_done_count : 0}</div>
        </li>

        <li className={styles.item}>
          <div className={styles.title}>已检查缺陷</div>
          <div className={styles.cont}>{member?.issue_member_state ? member?.issue_member_state.bug_check_done_count : 0}</div>
        </li>
      </ul>
      {(member?.short_note_list.length  ?? 0 )> 0 && (
        <ul className={styles.task_list}>
          <li className={styles.item}>
            <div className={styles.title}>桌面便签</div>
          </li>
          {member?.short_note_list.map(shortNote => (
            <li className={styles.item} key={shortNote.target_id}>
              <div className={styles.title}>{getShortNoteTypeName(shortNote.short_note_type)}</div>
              <div className={styles.cont}><a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                goToTarget(shortNote);
              }}>{shortNote.title}</a></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default observer(MemberInfo);
