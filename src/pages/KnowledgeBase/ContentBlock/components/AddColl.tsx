import React, { useState } from 'react';
import { Input, message } from 'antd';
import { useStores } from '@/hooks';
import * as vcApi from '@/api/project_vc';
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import ActionModal from '@/components/ActionModal';

export interface AddCollProps {
  onOk: () => void;
  onCancel: () => void;
}

const AddColl: React.FC<AddCollProps> = (props) => {
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');

  const [collName, setCollName] = useState('');

  const addColl = async (onOk: () => void) => {
    if (collName.length < 2) {
      message.warn('组名必须两个字以上长度');
      return;
    }
    const res = await request(
      vcApi.create_block_coll({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        base_info: {
          title: collName,
        },
      }),
    );
    if (res) {
      message.success(`创建内容组 ${collName} 成功`);
      onOk();
    } else {
      message.warn('创建内容组失败');
    }
  };

  return (
    <ActionModal
      visible={true}
      title="新增内容块组"
      width={416}
      onOK={() => addColl(props.onOk)}
      onCancel={() => props.onCancel()}
      okText={'完成'}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ width: '70px', fontWeight: '500', color: '#2F3338', lineHeight: '17px' }}>
          <span style={{ color: 'red' }}>*</span> 组名称
        </label>
        <Input
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setCollName(e.target.value);
          }}
        />
      </div>
    </ActionModal>
  );
};

export default observer(AddColl);
