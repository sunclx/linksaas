import React from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { useStores } from '@/hooks';

export type ReminderUserProps = NodeViewComponentProps & {
  all: boolean;
  memberUserId?: string;
  displayName?: string;
};

export const ReminderUser: React.FC<ReminderUserProps> = (props) => {
  const memberStore = useStores('memberStore');
  const member = memberStore.getMember(props.memberUserId ?? '');

  return (
    <span style={{ paddingLeft: 10, paddingRight: 10 }}>
      {props.all && <span style={{ color: '#0E83FF' }}>@全部</span>}
      {!props.all && (
        <span style={{ color: '#0E83FF' }}>
          @{member?.member.display_name ?? props.displayName}
        </span>
      )}
    </span>
  );
};
