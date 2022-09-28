import type { TASK_PRIORITY, BUG_LEVEL, BUG_PRIORITY } from '@/api/project_issue'
import type { FC } from 'react';
import React from 'react';
import RenderSelectOpt from '../RenderSelectOpt';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
const { Option } = Select;

type SelectOptListProps = SelectProps & {
  list: Record<
    number,
    {
      label: string;
      value: TASK_PRIORITY | BUG_LEVEL | BUG_PRIORITY;
      color: string;
    }
  >;
};

const SelectOptList: FC<SelectOptListProps> = ({ list, ...props }) => {
  return (
    <Select style={{ width: 150 }} placeholder="请选择" {...props} allowClear>
      {Object.entries(list).map((item) => (
        <Option key={item[1]?.value} value={item[1]?.value}>
          {RenderSelectOpt(item[1])}
        </Option>
      ))}
    </Select>
  );
};

export default SelectOptList;
