import type { WebMemberInfo } from '@/stores/member';
import { remove_member } from '@/api/project_member';
import ActionModal from '@/components/ActionModal';
import Button from '@/components/Button';
import { request } from '@/utils/request';
import { message } from 'antd';

import type { FC } from 'react';
import React from 'react';
import { useStores } from '@/hooks';

type RemoveMemberProps = {
  visible: boolean;
  params?: WebMemberInfo;
  onChange: (boo: boolean) => void;
};

const RemoveMember: FC<RemoveMemberProps> = (props) => {
  const { visible, params, onChange } = props;
  const userStore = useStores("userStore");
  const projectStore = useStores("projectStore");

  const submit = async () => {
    const res = await request(
      remove_member(userStore.sessionId, projectStore.curProjectId, params?.member.member_user_id || ''),
    );
    if (res) {
      message.success('移除成功');
      onChange(false);
    }
  };

  return (
    <ActionModal visible={visible} title="移除成员" width={320} onCancel={() => onChange(false)}>
      <div
        style={{
          textAlign: 'center',
          fontSize: '14px',
          lineHeight: '20px',
          marginBottom: '20px',
          color: ' #2C2D2E',
        }}
      >
        是否确认移除成员 用户昵称？
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button type="primary" ghost onClick={() => onChange(false)}>
          取消
        </Button>
        <Button type="primary" onClick={submit}>
          确定
        </Button>
      </div>
    </ActionModal>
  );
};

export default RemoveMember;
