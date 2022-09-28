import React, { useEffect } from 'react';
import styles from './MemberInfo.module.less';
import { useStores } from "@/hooks";
import { getTimeDescFromNow } from '@/utils/time';
import EventCom from '@/components/EventCom';
import { useHistory } from 'react-router-dom';
import { ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK } from '@/api/project_issue';
import UserPhoto from '@/components/Portrait/UserPhoto';


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

  useEffect(() => {
  }, []);


  const member = memberStore.getMember(memberId);

  return (
    <div className={styles.member_info}>
      <div className={styles.info}>
        <div className={styles.cover}>
        <UserPhoto logoUri={member?.member.logo_uri ?? ""} className={styles.avatar}/>
          <div className={member?.member.online ? styles.icon_online : styles.icon_offline} />
        </div>
        <div className={styles.bd}>
          <div className={styles.title}>
            <div className={styles.name}>{member?.member.display_name}</div>
          </div>
          <div className={styles.state}>{member?.member.online ? '在线' : '离线'}</div>
        </div>
      </div>

      <ul>
        <li className={styles.item}>
          <div className={styles.title}>工作状态</div>
          <div className={styles.cont}>
            <div className={styles.member_time}>{getTimeDescFromNow(member?.last_event?.event_time)}</div>
          </div>
        </li>
        <li>
          <div className={styles.member_state}>
            {member?.last_event && <EventCom key={member.last_event.event_id} item={member.last_event!} skipProjectName={true} skipLink={true} showMoreLink={props.showLink} onLinkClick={()=>props.hideMemberInfo()} />}
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
    </div>
  );
};

export default MemberInfo;
