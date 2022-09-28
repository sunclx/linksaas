import React from 'react';
import { useCommands } from '@remirror/react';

import { FloatingWrapper } from '@remirror/react';
import { useStores } from '@/hooks';
import { Select } from 'antd';
import s from './Reminder.module.less';
import classNames from 'classnames';
import UserPhoto from '@/components/Portrait/UserPhoto';

interface ReminderProps {
  enabled: boolean;
  channelMember: boolean;
}

export const Reminder: React.FC<ReminderProps> = (props) => {
  const memberStore = useStores('memberStore');
  const channelMemberStore = useStores('channelMemberStore');
  const commands = useCommands();

  const memberList = () => {
    if (props.channelMember) {
      const memberUserIdLsit = channelMemberStore.channelMemberList.map(
        (item) => item.member_user_id,
      );
      return memberStore.memberList.filter((item) =>
        memberUserIdLsit.includes(item.member.member_user_id),
      );
    }
    return memberStore.memberList;
  };

  const changeUser = (all: boolean, memberUserId: string, displayName: string) => {
    commands.insertReminderUser(all, memberUserId, displayName);

    commands.insertText(' ');
  };
  return (
    <FloatingWrapper
      displayArrow={true}
      enabled={props.enabled}
      positioner="always"
      placement="right"
    >
      <Select
        showSearch
        defaultOpen
        suffixIcon={false}
        bordered={false}
        style={{ width: 200, padding: 0 }}
        dropdownClassName={s.reminder_dropdown}
        dropdownRender={() => {
          return (
            <div className={s.reminder_modal}>
              <div className={s.user_wrap}>
                {memberList().map((item) => {
                  return (
                    <div
                      className={s.reminder_item}
                      key={item.member.member_user_id}
                      onClick={() =>
                        changeUser(false, item.member.member_user_id, item.member.display_name)
                      }
                    >
                      <UserPhoto logoUri={item.member.logo_uri} />
                      <span className={s.name}>{item.member.display_name}</span>
                      {item.member.is_cur_user && (
                        <span className={s.tag}>{item.member.is_cur_user ? '创建人' : ''}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className={s.hr} />
              <div
                className={classNames(s.reminder_item, s.channel_all)}
                onClick={() => changeUser(true, 'all', '频道全员')}
              >
                频道全员
              </div>
            </div>
          );
        }}
      >
        {/* <Select.OptGroup label="指定@成员" className="bbbbb">
        {memberList().map((item) => {
          return (
            <Select.Option
              className={s.reminder_item}
              key={item.member.member_user_id}
              value={item.member.display_name}
            >
              {item.member.display_name}
            </Select.Option>
          );
        })}
        </Select.OptGroup>
        <Select.Option key="all" value="全部" className="ccccc">
          全部
      </Select.Option*/}
      </Select>
    </FloatingWrapper>
  );
};
