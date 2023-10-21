import React, { useState } from 'react';
import { useCommands } from '@remirror/react';

import { FloatingWrapper } from '@remirror/react';
import { useStores } from '@/hooks';
import { Select } from 'antd';
import s from './Reminder.module.less';
import classNames from 'classnames';
import UserPhoto from '@/components/Portrait/UserPhoto';

interface ReminderProps {
  enabled: boolean;
}

export const Reminder: React.FC<ReminderProps> = (props) => {
  const memberStore = useStores('memberStore');
  const commands = useCommands();

  const [searchValue, setSearchValue] = useState("");

  const memberList = () => {
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
        autoFocus
        suffixIcon={false}
        onSearch={value => setSearchValue(value ?? "")}
        autoClearSearchValue
        style={{ width: 200, padding: 0 }}
        popupClassName={s.reminder_dropdown}
        dropdownRender={() => {
          return (
            <div className={s.reminder_modal}>
              <div className={s.user_wrap}>
                {memberList().filter(item => item.member.display_name.includes(searchValue)).map((item) => {
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
      />
    </FloatingWrapper>
  );
};
