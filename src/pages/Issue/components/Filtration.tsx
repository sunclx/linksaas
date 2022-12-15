import { issueState } from '@/utils/constant';
import { Form, Input, Select } from 'antd';
import type { FC } from 'react';
import React from 'react';
import s from './Filtration.module.less';
import { observer } from 'mobx-react';
import Button from '../../../components/Button';
import clearFilter from '@/assets/image/clearFilter.png';
import MemberSelect from '../../../components/MemberSelect';
import PrioritySelect from '../../../components/PrioritySelect';
import { useLocation } from 'react-router-dom';
import { getIsTask } from '@/utils/utils';
import BugPrioritySelect from '../../../components/BugPrioritySelect';
import BugLevelSelect from '../../../components/BugLevelSelect';
import { ISSUE_TAB_LIST_TYPE } from './constant';

export interface FilterDataType {
  priority_list?: number[];
  state_list?: number[];
  exec_user_id_list?: string[];
  check_user_id_list?: string[];
  software_version_list: string[];
  level_list?: number[];
};

type FiltrationProps = {
  setFilterData: (val: FilterDataType) => void;
  activeVal: ISSUE_TAB_LIST_TYPE;
  filterData: FilterDataType;
};

const { Option } = Select;

const Filtration: FC<FiltrationProps> = observer((props) => {
  const { pathname } = useLocation();
  const { setFilterData, filterData, activeVal } = props;
  const [form] = Form.useForm();

  let execUserId: string | undefined = undefined;
  if ((filterData?.exec_user_id_list?.length ?? 0) > 0) {
    execUserId = filterData!.exec_user_id_list![0];
  }
  let checkUserId: string | undefined = undefined;
  if ((filterData?.check_user_id_list?.length ?? 0) > 0) {
    checkUserId = filterData!.check_user_id_list![0];
  }

  let defaultStage: number | undefined = undefined;
  if ((filterData?.state_list?.length ?? 0) > 0) {
    defaultStage = filterData!.state_list![0];
  }

  const removalFilter = () => {
    setFilterData({
      priority_list: [],
      state_list: [],
      exec_user_id_list: [],
      check_user_id_list: [],
      software_version_list: [],
      level_list: [],
    });
    form.setFieldsValue({
      priority: null,
      stage: null,
      exec_user: null,
      check_user: null,
      version: null,
    });
  };

  return (
    <div className={s.filtration_wrap}>
      <span className={s.triangle} />
      <Form
        layout="inline"
        form={form}
        onFieldsChange={() => {
          const { priority, stage, exec_user, check_user, version, level } = form.getFieldsValue();
          setFilterData({
            priority_list: priority != null ? [priority] : [],
            state_list: stage != null ? [stage] : [],
            exec_user_id_list: exec_user ? [exec_user] : [],
            check_user_id_list: check_user ? [check_user] : [],
            software_version_list: version ? [version] : [],
            level_list: level != null ? [level] : [],
          });
        }}
      >
        {!getIsTask(pathname) && (
          <BugLevelSelect name={'level'} style={{ width: 120 }} placeholder="级别:" />
        )}
        {getIsTask(pathname) ? (
          <PrioritySelect name={'priority'} style={{ width: 120 }} placeholder="优先级:" />
        ) : (
          <BugPrioritySelect name={'priority'} style={{ width: 120 }} placeholder="优先级:" />
        )}
        <Form.Item name="stage">
          <Select style={{ width: 120 }} placeholder="阶段：" allowClear defaultValue={defaultStage}>
            {Object.entries(issueState).map((item) => (
              <Option key={item[1]?.value} value={item[1]?.value}>
                {item[1].label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <MemberSelect
          name={'exec_user'}
          style={{ width: 120 }}
          placeholder="处理人："
          memberUserId={execUserId}
          disabled={activeVal !== ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL}
        />
        <MemberSelect
          name={'check_user'}
          style={{ width: 120 }}
          placeholder="验收人："
          memberUserId={checkUserId}
          disabled={activeVal !== ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL}
        />
        {!getIsTask(pathname) && (
          <Form.Item name="version">
            <Input placeholder="软件版本：" style={{ width: 120 }} allowClear />
          </Form.Item>
        )}
      </Form>

      <Button
        type="primary"
        ghost
        style={{
          border: '1px solid #C7CAD0',
          color: '#2F3338 ',
          height: '26px',
          lineHeight: 0,
        }}
        onClick={() => removalFilter()}
      >
        <img src={clearFilter} alt="" />
        清除筛选
      </Button>
    </div>
  );
});

export default Filtration;
