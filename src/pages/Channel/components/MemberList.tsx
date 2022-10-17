import React, { useState } from 'react';
import { useStores } from '@/hooks';
import styles from './MemberList.module.less';
import MemberInfo from './MemberInfo';
import { observer, useLocalObservable } from 'mobx-react';
import type { ChannelMemberInfo } from '@/api/project_channel';
import { runInAction } from 'mobx';
import ActionMember, { ActionMemberType } from './ActionMember';
import { Modal, Popover } from 'antd';
import { getTimeDescFromNow } from '@/utils/time';
import EventCom from '@/components/EventCom';
import { leave as leave_channel } from '@/api/project_channel';
import { request } from '@/utils/request';
import UserPhoto from '@/components/Portrait/UserPhoto';


export type MemberItem = ChannelMemberInfo;

interface MemberListProps {
  handlePopover: (isShow: boolean) => void;
}

const MemberList: React.FC<MemberListProps> = (props) => {
  const channelStore = useStores('channelStore');
  const channelMemberStore = useStores('channelMemberStore');
  const memberStore = useStores("memberStore");
  const userStore = useStores("userStore");
  const projectStore = useStores('projectStore');
  const [visible, setVisible] = useState(false);
  const [visibleKey, setVisibleKey] = useState('');

  const localStore = useLocalObservable(() => ({
    showModalExit: false,
    showActionMember: false,
    actionMemberType: 0,
    actionMemberTitle: '',
    setShowModalExit(isShow: boolean): void {
      this.showModalExit = isShow;
    }
  }))

  // 退出频道
  const exitChannel = () => {
    // if (!channelStore.channelList[channelStore.channelIndex]?.user_channel_perm?.can_leave) return;
    localStore.setShowModalExit(true);
  }

  // 添加成员
  const addMember = () => {
    runInAction(() => {
      localStore.showActionMember = true;
      localStore.actionMemberType = ActionMemberType.ADD;
      localStore.actionMemberTitle = '添加频道成员';
    })
  }

  // 删除成员
  const reduceMember = () => {
    runInAction(() => {
      localStore.showActionMember = true;
      localStore.actionMemberType = ActionMemberType.DELETE;
      localStore.actionMemberTitle = '删除频道成员';
    })
  }

  const completeMember = () => {
    // channelStore.getMemberList();
  }

  const handleMemberInfo = (isShow: boolean, key?: string) => {
    setVisible(isShow);
    setVisibleKey(isShow && key ? key : '');
  }

  const hideMemberInfo = () => {
    props.handlePopover(false);
    handleMemberInfo(false);
  }



  return (
    <div>
      <div className={styles.list}>
        <header className={styles.header}>
          <h3 className={styles.title}>频道成员<span className={styles.count}>（{channelMemberStore.onlineCount}/{channelMemberStore.channelMemberList.length}）</span></h3>

          {channelStore.curChannel?.channelInfo.user_channel_perm?.can_add_member &&
            !(channelStore.curChannel?.channelInfo.basic_info.pub_channel) &&
            !(channelStore.curChannel?.channelInfo.system_channel) &&
            <a className={styles.add_member} onClick={() => addMember()}>
              <i className={styles.icon} />
            </a>}

          {channelStore.curChannel?.channelInfo.user_channel_perm?.can_remove_member &&
            !(channelStore.curChannel?.channelInfo.basic_info.pub_channel) &&
            !(channelStore.curChannel?.channelInfo.system_channel) &&
            <a className={styles.reduce_member} onClick={() => reduceMember()}>
              <i className={styles.icon} />
            </a>}
        </header>
        <div className={styles.member_list}>
          {channelMemberStore.channelMemberList && channelMemberStore.channelMemberList.length > 0 && channelMemberStore.channelMemberList.map((memberItem) => {
            const member = memberStore.getMember(memberItem.member_user_id);
            return (
              <Popover
                placement="leftBottom"
                content={<MemberInfo memberId={memberItem.member_user_id} hideMemberInfo={() => hideMemberInfo()} showLink />}
                key={memberItem.member_user_id}
                transitionName=''
                overlayClassName="popover"
                open={visibleKey === memberItem.member_user_id ? visible : false}
                trigger="hover"
                onOpenChange={e => {
                  handleMemberInfo(e, memberItem.member_user_id)
                }
                }
              >
                <div
                  className={styles.member_item}
                >
                  <div className={styles.cover}>
                    <UserPhoto logoUri={member?.member.logo_uri ?? ""} className={styles.avatar} />
                    <div className={member?.member.online ? styles.icon_online : styles.icon_offline} />
                  </div>
                  <div className={styles.member_bd}>
                    <div className={styles.member_title}>
                      <div className={styles.member_name}>{member?.member.display_name}</div>
                      <div className={styles.member_time}>{getTimeDescFromNow(member?.last_event?.event_time)}</div>
                    </div>
                    <div className={styles.member_state}>
                      {member?.last_event && <EventCom key={member.last_event.event_id} item={member.last_event!} skipProjectName={true} skipLink={true} showMoreLink={true} onLinkClick={() => hideMemberInfo()} />}
                    </div>
                  </div>
                </div>
              </Popover>
            );

          })}
        </div>
        <footer className={styles.footer}>
          <a
            className={styles.link + ' ' + (channelStore.curChannel?.channelInfo.user_channel_perm?.can_leave ? '' : styles.disabled)}
            onClick={() => exitChannel()}
          >
            退出频道
          </a>
        </footer>
      </div>

      {localStore.showActionMember && (<ActionMember
        visible={localStore.showActionMember}
        type={localStore.actionMemberType}
        title={localStore.actionMemberTitle}
        channelId={channelStore.curChannelId}
        onChange={(value: boolean) => runInAction(() => {
          localStore.showActionMember = value;
        })
        }
        onComplete={() => completeMember()}
      />)}

      <Modal
        title='警告'
        visible={localStore.showModalExit}
        onOk={async (): Promise<void> => {
          const res = await request(leave_channel(userStore.sessionId, projectStore.curProjectId, channelStore.curChannelId));
          if (res) {
            channelStore.removeChannel(channelStore.curChannelId);
          }
          localStore.setShowModalExit(false);
        }}
        onCancel={() => {
          localStore.setShowModalExit(false);
        }}
        okText='退出频道'
      >
        <p>是否确认退出当前频道？</p>
      </Modal>
    </div>
  );
};

export default observer(MemberList);
