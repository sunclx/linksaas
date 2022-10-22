import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Input, message } from 'antd';
import { useStores } from '@/hooks';
import * as vcApi from '@/api/project_vc';
import { request } from '@/utils/request';
import { writeText } from '@tauri-apps/api/clipboard';
import ActionModal from '@/components/ActionModal';
import { ReactComponent as Copysvg } from '@/assets/svg/copy.svg';
import { ReactComponent as Reloadsvg } from '@/assets/svg/reload.svg';
import s from './UpdateCol.module.less';


export interface UpdateCollProps {
  collInfo: vcApi.BlockColl;
  onOk: () => void;
  onCancel: () => void;
}

const UpdateColl: React.FC<UpdateCollProps> = (props) => {
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');

  const [collName, setCollName] = useState(props.collInfo.base_info.title);
  const [accessToken, setAccessToken] = useState(props.collInfo.access_token);

  const updateColl = async (onOk: () => void) => {
    if (collName.length < 2) {
      message.warn('组名必须两个字以上长度');
      return;
    }
    const res = await request(
      vcApi.update_block_coll({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        block_coll_id: props.collInfo.block_coll_id,
        base_info: {
          title: collName,
        },
      }),
    );
    if (res) {
      message.success(`修改内容组 ${props.collInfo.base_info.title} 成功`);
      onOk();
    } else {
      message.warn('修改内容组失败');
    }
  };

  const updateToken = async () => {
    const res = await request(
      vcApi.renew_block_coll_token({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        block_coll_id: props.collInfo.block_coll_id,
      }),
    );
    if (res) {
      message.success('更新密钥成功');
      setAccessToken(res.access_token);
    }
  };

  return (
    <ActionModal
      visible={true}
      title="修改可变内容组"
      onOK={() => updateColl(props.onOk)}
      okText={'完成'}
      width={416}
      onCancel={() => {
        if (accessToken != props.collInfo.access_token) {
          props.onOk();
        } else {
          props.onCancel();
        }
      }}
      className={s.updatecoll}
    >
      <div className={s.item_wrap}>
        <label>
          <span>*</span> 组名称
        </label>
        <div>
          <Input
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCollName(e.target.value);
            }}
            defaultValue={collName}
          />
        </div>
      </div>
      <div className={s.item_wrap}>
        <label>
          <span>*</span> 密钥
        </label>
        <div className={s.btn_wrap}>
          ****************************
          <Copysvg
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              writeText(accessToken).then(() => message.success('复制密钥成功'));
            }}
          />
          <Reloadsvg
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              updateToken();
            }}
          />
        </div>
      </div>
    </ActionModal>
  );
};

export default observer(UpdateColl);
