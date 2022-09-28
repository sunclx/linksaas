import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Input, message } from 'antd';
import { useStores } from '@/hooks';
import * as vcApi from '@/api/project_vc';
import { request } from '@/utils/request';
import ActionModal from '@/components/ActionModal';

export interface AddBlockProps {
  collId: string;
  onOk: () => void;
  onCancel: () => void;
}

const AddBlock: React.FC<AddBlockProps> = (props) => {
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');

  const [blockName, setBlockName] = useState('');

  const addBlock = async (onOk: () => void) => {
    if (blockName.length < 4) {
      message.warn('内容块');
      return;
    }
    const res = await request(
      vcApi.create_block({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        block_coll_id: props.collId,
        base_info: {
          title: blockName,
        },
      }),
    );
    if (res) {
      message.success(`创建内容块 ${blockName} 成功`);
      onOk();
    } else {
      message.warn('创建内容块失败');
    }
  };

  return (
    <ActionModal
      visible={true}
      title="增加可变内容块"
      okText={'完成'}
      width={416}
      onOK={() => addBlock(props.onOk)}
      onCancel={() => props.onCancel()}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ width: '100px', fontWeight: '500', color: '#2F3338', lineHeight: '17px' }}>
          <span style={{ color: 'red' }}>*</span> 内容块名称
        </label>
        <Input
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setBlockName(e.target.value);
          }}
        />
      </div>
    </ActionModal>
  );
};

export default observer(AddBlock);
