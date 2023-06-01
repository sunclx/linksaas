import { issueState } from '@/utils/constant';
import { Form, Input, Select } from 'antd';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import s from './Filtration.module.less';
import { observer } from 'mobx-react';
import Button from '../../../components/Button';
import clearFilter from '@/assets/image/clearFilter.png';
import MemberSelect from '../../../components/MemberSelect';
import PrioritySelect from '../../../components/PrioritySelect';
import { useHistory, useLocation } from 'react-router-dom';
import { getIsTask } from '@/utils/utils';
import BugPrioritySelect from '../../../components/BugPrioritySelect';
import BugLevelSelect from '../../../components/BugLevelSelect';
import type { TagInfo } from "@/api/project";
import { ISSUE_TAB_LIST_TYPE, type LinkIssueListState } from '@/stores/linkAux';
import { useStores } from '@/hooks';

type FiltrationProps = {
  tagDefList: TagInfo[];
};

const { Option } = Select;

const Filtration: FC<FiltrationProps> = observer((props) => {
  const location = useLocation();
  const history = useHistory();
  const linkAuxStore = useStores('linkAuxStore');

  const [form] = Form.useForm();

  const filterState: LinkIssueListState = location.state as LinkIssueListState ?? {
    stateList: [],
    execUserIdList: [],
    checkUserIdList: [],
    tabType: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME,
    priorityList: [],
    softwareVersionList: [],
    levelList: [],
    tagId: "",
  };

  const removalFilter = () => {
    const newState: LinkIssueListState = {
      stateList: [],
      execUserIdList: [],
      checkUserIdList: [],
      tabType: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL,
      priorityList: [],
      softwareVersionList: [],
      levelList: [],
      tagId: "",
      curPage: 0,
    }
    if (getIsTask(location.pathname)) {
      linkAuxStore.goToTaskList(newState, history);
    } else {
      linkAuxStore.goToBugList(newState, history);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      priority: (filterState.priorityList ?? []).length > 0 ? filterState.priorityList![0] : null,
      stage: filterState.stateList.length > 0 ? filterState.stateList[0] : null,
      exec_user: filterState.execUserIdList.length > 0 ? filterState.execUserIdList[0] : null,
      check_user: filterState.checkUserIdList.length > 0 ? filterState.checkUserIdList[0] : null,
      version: (filterState.softwareVersionList ?? []).length > 0 ? filterState.softwareVersionList![0] : null,
      tag_id: (filterState.tagId ?? "") == "" ? null : filterState.tagId!,
      level: (filterState.levelList ?? []).length > 0 ? filterState.levelList![0] : null,
    });
  }, [filterState.stateList, filterState.execUserIdList,
  filterState.checkUserIdList, filterState.tabType, filterState.priorityList,
  filterState.softwareVersionList, filterState.levelList, filterState.tagId]);

  return (
    <div className={s.filtration_wrap}>
      <span className={s.triangle} />
      <Form
        layout="inline"
        form={form}
        onFieldsChange={() => {
          const { priority, stage, exec_user, check_user, version, level, tag_id } = form.getFieldsValue();
          const newState: LinkIssueListState = {
            stateList: stage != null ? [stage] : [],
            execUserIdList: exec_user ? [exec_user] : [],
            checkUserIdList: check_user ? [check_user] : [],
            tabType: filterState.tabType,
            priorityList: priority != null ? [priority] : [],
            softwareVersionList: version ? [version] : [],
            levelList: level != null ? [level] : [],
            tagId: tag_id ?? "",
            curPage: 0,
          };

          if (getIsTask(location.pathname)) {
            linkAuxStore.goToTaskList(newState, history);
          } else {
            linkAuxStore.goToBugList(newState, history);
          }
        }}
      >
        {!getIsTask(location.pathname) && (
          <BugLevelSelect name={'level'} style={{ width: 100 }} placeholder="级别:" />
        )}
        {getIsTask(location.pathname) ? (
          <PrioritySelect name={'priority'} style={{ width: 100 }} placeholder="优先级:" />
        ) : (
          <BugPrioritySelect name={'priority'} style={{ width: 100 }} placeholder="优先级:" />
        )}
        <Form.Item name="stage">
          <Select style={{ width: 100 }} placeholder="阶段：" allowClear>
            {Object.entries(issueState).map((item) => (
              <Option key={item[1]?.value} value={item[1]?.value}>
                {item[1].label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <MemberSelect
          name={'exec_user'}
          style={{ width: 100 }}
          placeholder="处理人："
          disabled={filterState.tabType !== ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL}
          allowClear
        />
        <MemberSelect
          name={'check_user'}
          style={{ width: 100 }}
          placeholder="验收人："
          disabled={filterState.tabType !== ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL}
          allowClear
        />
        {!getIsTask(location.pathname) && (
          <Form.Item name="version">
            <Input placeholder="软件版本：" style={{ width: 100 }} allowClear />
          </Form.Item>
        )}
        <Form.Item name="tag_id">
          <Select style={{ width: 100 }} placeholder="标签:" allowClear>
            {props.tagDefList.map(tagDef => (
              <Select.Option key={tagDef.tag_id} value={tagDef.tag_id}>
                <span style={{ padding: "2px 4px", backgroundColor: tagDef.bg_color }}>{tagDef.tag_name}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
