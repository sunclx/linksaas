import { useStores } from '@/hooks';
import type { FormItemProps, SelectProps } from 'antd';
import { Select } from 'antd';
import { observer } from 'mobx-react';
import type { FC } from 'react';
import React from 'react';

const { Option } = Select;

type ProjectSelectProps = FormItemProps &
  SelectProps & {
    all?: boolean;
  };

const ProjectSelect: FC<ProjectSelectProps> = observer(({ all, ...props }) => {
  const projectStore = useStores('projectStore');

  return (
    <Select style={{ width: 110 }} placeholder="请选择" defaultValue={''} allowClear {...props}>
      <Option value={''}>全部项目</Option>
      {projectStore.projectList.map((item) => (
        <Option key={item.project_id} value={item.project_id}>
          {item.basic_info.project_name}
        </Option>
      ))}
    </Select>
  );
});

export default ProjectSelect;
