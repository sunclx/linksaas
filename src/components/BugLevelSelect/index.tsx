import { bugLevel } from '@/utils/constant';
import type { FormItemProps, SelectProps } from 'antd';
import { Form } from 'antd';
import type { FC } from 'react';
import React from 'react';
import SelectOptList from '../SelectOptList/indext';

type BugLevelSelectProps = FormItemProps & SelectProps;

const BugLevelSelect: FC<BugLevelSelectProps> = (props) => {
  return (
    <Form.Item {...props}>
      <SelectOptList
        style={{ width: 150 }}
        placeholder="请选择"
        {...props}
        allowClear
        list={bugLevel}
      />
    </Form.Item>
  );
};

export default BugLevelSelect;
