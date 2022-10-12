import MemberSelect from '@/components/MemberSelect';
import PrioritySelect from '@/components/PrioritySelect';
import { statusText } from '@/utils/constant';
import { DatePicker, Form, Input, Tooltip } from 'antd';
import type { FC } from 'react';
import React from 'react';
import { TASK_INSIDE_PAGES_ENUM } from '../CreateTask';
import s from './BasicsForm.module.less';
import locale from 'antd/es/date-picker/locale/zh_CN';
import type { IssueInfo } from '@/api/project_issue';
import { ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS } from '@/api/project_issue';
import { useStores } from '@/hooks';
import BugPrioritySelect from '@/components/BugPrioritySelect';
import { getIsTask, getIssueText } from '@/utils/utils';
import { useLocation } from 'react-router-dom';
import BugLevelSelect from '@/components/BugLevelSelect';
import InputNumber from '@/components/InputNumber';
import { QuestionCircleOutlined } from '@ant-design/icons/lib/icons';


type BasicsFormProps = {
  pageType: TASK_INSIDE_PAGES_ENUM;

  details: IssueInfo;
};

const BasicsForm: FC<BasicsFormProps> = ({ pageType, details }) => {
  const userStore = useStores('userStore');
  const { pathname } = useLocation();
  const { state, exec_user_id } = details;
  const userId = userStore.userInfo.userId;
  return (
    <>
      <div className={s.add__info_item}>
        <span>当前阶段</span>
        <div>
          {pageType === TASK_INSIDE_PAGES_ENUM.ADD
            ? statusText[ISSUE_STATE_PLAN]
            : statusText[state]}
        </div>
      </div>
      {!getIsTask(pathname) && (
        <>
          <div className={s.add__info_item}>
            <span>软件版本</span>
            <Form.Item className={s.antFormItem} name="software_version">
              <Input style={{ width: 150 }} />
            </Form.Item>
          </div>
          <div className={s.add__info_item}>
            <span>级别</span>
            <BugLevelSelect className={s.antFormItem} name="level" />
          </div>
        </>
      )}

      <div className={s.add__info_item}>
        <span>优先级</span>
        {getIsTask(pathname) ? (
          <PrioritySelect className={s.antFormItem} name="priority" />
        ) : (
          <BugPrioritySelect className={s.antFormItem} name="priority" />
        )}
      </div>
      <div className={s.add__info_item}>
        <span>处理人</span>
        <MemberSelect className={s.antFormItem} name="exec_user_id" disable={!details.user_issue_perm.can_assign_exec_user} memberUserId={details.exec_user_id} />
      </div>

      <div className={s.add__info_item}>
        <span>验收人</span>
        <MemberSelect className={s.antFormItem} name="check_user_id" disable={!details.user_issue_perm.can_assign_check_user} memberUserId={details.check_user_id} />
      </div>
      <div className={s.add__info_item}>
        <span>处理贡献&nbsp;
          <Tooltip title={`当${getIssueText(pathname)}关闭后，会给处理人增加的项目贡献值`} trigger="click">
            <a><QuestionCircleOutlined /></a>
          </Tooltip>
        </span>
        <Form.Item className={s.antFormItem} name="exec_award">
          <InputNumber placeholder="请输入处理贡献" />
        </Form.Item>
      </div>
      <div className={s.add__info_item}>
        <span>验收贡献&nbsp;
          <Tooltip title={`当${getIssueText(pathname)}关闭后，会给验收人增加的项目贡献值`} trigger="click">
            <a><QuestionCircleOutlined /></a>
          </Tooltip>
        </span>
        <Form.Item className={s.antFormItem} name="check_award">
          <InputNumber placeholder="请输入验收贡献" />
        </Form.Item>
      </div>

      {pageType === TASK_INSIDE_PAGES_ENUM.EDIT &&
        state === ISSUE_STATE_PROCESS &&
        userId === exec_user_id && (
          <>
            <div className={s.add__info_item}>
              <span>预估工时</span>
              <Form.Item className={s.antFormItem} name="estimate_minutes">
                <InputNumber placeholder="请输入预估工时" addonAfter='h' />
              </Form.Item>
            </div>
            <div className={s.add__info_item}>
              <span>剩余工时</span>
              <Form.Item className={s.antFormItem} name="remain_minutes">
                <InputNumber placeholder="请输入剩余工时" addonAfter='h' />
              </Form.Item>
            </div>
            <div className={s.add__info_item}>
              <span>预估完成时间</span>
              <Form.Item className={s.antFormItem} name="end_time">
                <DatePicker format={'YYYY-MM-DD'} style={{ width: 150 }} locale={locale} />
              </Form.Item>
            </div>
          </>
        )}
    </>
  );
};

export default BasicsForm;
