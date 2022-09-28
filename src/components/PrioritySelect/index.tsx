import { taskPriority } from '@/utils/constant';
import type { FormItemProps, SelectProps } from 'antd';
import { Form } from 'antd';
import type { FC } from 'react';
import React from 'react';
import SelectOptList from '../SelectOptList/indext';

type PrioritySelectProps = FormItemProps & SelectProps;

const PrioritySelect: FC<PrioritySelectProps> = (props) => {
  return (
    <Form.Item {...props}>
      <SelectOptList
        style={{ width: 150 }}
        placeholder="请选择"
        {...props}
        allowClear
        list={taskPriority}
      />
    </Form.Item>
  );
};

export default PrioritySelect;
