import { Form, Input, message, Modal, Select } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import React from 'react';
import { writeText } from '@tauri-apps/api/clipboard';
import { gen_invite } from '@/api/project_member';
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';


const { TextArea } = Input;

type AddMemberProps = {
  visible: boolean;
  onChange: (boo: boolean) => void;
};

const AddMember: FC<AddMemberProps> = (props) => {
  const { visible, onChange } = props;

  const appStore = useStores('appStore');
  const userStore = useStores("userStore");
  const projectStore = useStores("projectStore");

  const [linkText, setLinkText] = useState('');
  const [ttl, setTtl] = useState(1);

  const getTtlStr = () => {
    if (ttl < 24) {
      return `${ttl}小时`;
    } else {
      return `${(ttl / 24).toFixed(0)}天`;
    }
  };

  const genInvite = async () => {
    const res = await request(gen_invite(userStore.sessionId, projectStore.curProjectId, ttl));
    if (res) {
      if (appStore.clientCfg?.can_register == true) {
        setLinkText(`${userStore.userInfo.displayName} 邀请您加入 ${projectStore.curProject?.basic_info.project_name ?? ""} 项目，您的邀请码 ${res.invite_code} (有效期${getTtlStr()}),请在软件内输入邀请码加入项目。如您尚未安装【凌鲨】，可直接点击链接下载 https://www.linksaas.pro`);
      } else {
        setLinkText(`${userStore.userInfo.displayName} 邀请您加入 ${projectStore.curProject?.basic_info.project_name ?? ""} 项目，您的邀请码 ${res.invite_code} (有效期${getTtlStr()}),请在软件内输入邀请码加入项目。`);
      }
    }
  };

  const copyAndClose = async () => {
    await writeText(linkText);
    onChange(false);
    message.success('复制成功');
  };

  return (
    <Modal
      open={visible}
      title="邀请项目成员"
      width={600}
      okText={linkText == "" ? "生成邀请码" : "复制并关闭"}
      onCancel={e => {
        e.stopPropagation();
        e.preventDefault();
        onChange(false);
      }}
      onOk={e => {
        e.stopPropagation();
        e.preventDefault();
        if (linkText == "") {
          genInvite();
        } else {
          copyAndClose();
        }
      }}
    >
      {linkText == "" && (
        <Form>
          <Form.Item label="有效期">
            <Select value={ttl} onChange={value => setTtl(value)}>
              <Select.Option value={1}>1小时</Select.Option>
              <Select.Option value={3}>3小时</Select.Option>
              <Select.Option value={24}>1天</Select.Option>
              <Select.Option value={24 * 3}>3天</Select.Option>
              <Select.Option value={24 * 7}>1周</Select.Option>
              <Select.Option value={24 * 14}>2周</Select.Option>
              <Select.Option value={24 * 30}>1月</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      )}
      {linkText != "" && (
        <>
          <div
            style={{
              textAlign: 'left',
              fontSize: '14px',
              lineHeight: '20px',
              color: ' #2C2D2E',
            }}
          >
            请发送邀请链接给需要邀请的成员
          </div>

          <div style={{ margin: '10px 0' }}>
            <TextArea placeholder="请输入" value={linkText} autoSize={{ minRows: 2, maxRows: 5 }} readOnly />
          </div>
        </>
      )}

    </Modal>
  );
};

export default observer(AddMember);
