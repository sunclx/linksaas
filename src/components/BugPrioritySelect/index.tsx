import { bugPriority } from '@/utils/constant';
import type { FormItemProps, SelectProps } from 'antd';
import { Form } from 'antd';
import type { FC } from 'react';
import React from 'react';
import SelectOptList from '../SelectOptList/indext';

type BugPrioritySelectProps = FormItemProps & SelectProps;

const BugPrioritySelect: FC<BugPrioritySelectProps> = (props) => {
  return (
    <Form.Item {...props}>
      <SelectOptList
        style={{ width: 150 }}
        placeholder="请选择"
        {...props}
        allowClear
        list={bugPriority}
      />
    </Form.Item>
  );
};

export default BugPrioritySelect;
