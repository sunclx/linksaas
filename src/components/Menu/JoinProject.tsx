import ActionModal from '@/components/ActionModal';
import { Input, message } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import React from 'react';
import { join } from '@/api/project_member';
import { useStores } from '@/hooks';
import Button from '../Button';
import { request } from '@/utils/request';

const { TextArea } = Input;

type JoinProjectProps = {
  visible: boolean;
  onChange: (boo: boolean) => void;
};

const JoinProject: FC<JoinProjectProps> = (props) => {
  const { visible, onChange } = props;
  const [linkText, setLinkText] = useState('');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const submit = async () => {
    try {
      const res = await request(join(userStore.sessionId, linkText));
      message.success('加入成功');
      await projectStore.updateProject(res.project_id);
      onChange(false);
    } catch (error) { }
  };

  return (
    <ActionModal visible={visible} title="加入项目" width={500} onCancel={() => onChange(false)}>
      <div
        style={{
          textAlign: 'left',
          fontSize: '14px',
          lineHeight: '30px',
          color: ' #2C2D2E',
        }}
      >
        请输入项目邀请码
      </div>
      <TextArea
        placeholder="请输入邀请码"
        // status="error"
        allowClear
        autoSize={{ minRows: 2, maxRows: 2 }}
        onChange={(e) => setLinkText(e.target.value)}
      />
      {/* <div style={{ color: '#DF0614' }}>邀请码验证失败！请检查邀请码是否正确，或索取新的邀请码</div> */}
      <div>
        <Button
          onClick={submit}
          style={{ margin: '28px auto 0', display: 'block' }}
          disabled={!linkText}
        >
          加入项目
        </Button>
      </div>
    </ActionModal>
  );
};

export default JoinProject;
