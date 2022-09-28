import { useStores } from '@/hooks';
import type { FormItemProps, SelectProps } from 'antd';
import { Form, Select } from 'antd';
import React from 'react';
import { observer } from 'mobx-react';

const { Option } = Select;

type MemberSelectProps = FormItemProps &
  SelectProps & {
    all?: boolean;
    memberUserId?: string;
    disable?: boolean;
  };

const MemberSelect: React.FC<MemberSelectProps> = observer(({ all, memberUserId, ...props }) => {
  const memberStore = useStores('memberStore');
  console.log("333333333",props.disable)
  return (
    <Form.Item {...props}>
      <Select
        disabled={props.disable ?? false}
        style={{ width: 150 }}
        placeholder="请选择"
        defaultValue={all ? undefined : (memberUserId ? memberUserId : '')}
        allowClear
        {...props}
      >
        {all && <Option value={''}>全部</Option>}
        {memberStore.memberList.map((item) => (
          <Option key={item.member.member_user_id} value={item.member.member_user_id}>
            {item.member.display_name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
});

export default MemberSelect;
