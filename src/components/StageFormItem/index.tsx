import Button from '@/components/Button';
import type { FormInstance, FormProps } from 'antd';
import { Form, Select } from 'antd';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import s from './index.module.less';
import selectDispose from '@/assets/image/selectDispose.png';
import selectCheck from '@/assets/image/selectCheck.png';
import selectClose from '@/assets/image/selectClose.png';
import type { ISSUE_STATE } from '@/api/project_issue';
import {
  ISSUE_STATE_PROCESS,
  ISSUE_STATE_PLAN,
  ISSUE_STATE_CHECK,
  ISSUE_STATE_CLOSE,
} from '@/api/project_issue';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import type { IssueInfo } from '@/api/project_issue';

const { Option } = Select;

export enum STAGE_FORM_TYPE_ENUM {
  MODEL = 'model',
  DETAILS = 'details',
}

type StageFormItemProps = FormProps & {
  form: FormInstance<any>;
  type: STAGE_FORM_TYPE_ENUM;
  details: IssueInfo;
  editor: JSX.Element;
};

const StageFormItem: FC<StageFormItemProps> = observer((props) => {
  const { form, type, details, editor } = props;

  let defaultNextStatus = ISSUE_STATE_PROCESS;
  if (details.user_issue_perm.next_state_list.length > 0) {
    defaultNextStatus = details.user_issue_perm.next_state_list[0];
  }

  const [nextStatus, setNextStatus] = useState(defaultNextStatus);
  const memberStore = useStores('memberStore');

  const getSelectImg = (key: ISSUE_STATE) => {
    switch (nextStatus) {
      case key:
        return s.active;
      default:
        return '';
    }
  };

  useEffect(() => {
    form?.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    form?.setFieldsValue({
      stage_item_status: nextStatus,
      stage_item_select_user:
        nextStatus === ISSUE_STATE_PROCESS ? details.exec_user_id : details.check_user_id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextStatus]);

  const clickSetStatus = (st: ISSUE_STATE) => {
    setNextStatus(st);
  };
  const getLabelText = () => {
    if (nextStatus === ISSUE_STATE_PROCESS) {
      return '处理人';
    }
    return '验收人';
  };

  const isMemberDisable = () => {
    let disabled = false;
    if (nextStatus === ISSUE_STATE_PROCESS) {
      disabled = !details.user_issue_perm.can_assign_exec_user;
    } else if (nextStatus === ISSUE_STATE_CHECK) {
      disabled = !details.user_issue_perm.can_assign_check_user;
    }
    return disabled;
  }

  const execUserIdRender = () => (
    <Form.Item
      name="stage_item_select_user"
      label={getLabelText()}
      rules={[{ required: true, message: `${getLabelText()}必选` }]}
      style={{ width: type === STAGE_FORM_TYPE_ENUM.DETAILS ? '186px' : '' }}
    >
      <Select placeholder={`${getLabelText()}选择`} disabled={isMemberDisable()}>
        {memberStore.memberList.map((item) => (
          <Option key={item.member.member_user_id} value={item.member.member_user_id}>
            {item.member.display_name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );


  return (
    <>
      <div
        style={{
          display: details.user_issue_perm.next_state_list.length == 0 ? "none" : (type === STAGE_FORM_TYPE_ENUM.DETAILS ? 'flex' : 'block'),
          flexWrap: 'wrap',
        }}
        className={s.stage_form_item_wrap}
      >
        <Form.Item name="stage_item_status" label="更新状态" style={{ display: details.user_issue_perm.next_state_list.length > 0 ? "auto" : "none" }}>
          <div className={s.statusBtn}>
            {details.user_issue_perm.next_state_list.map(status => {
              if (status == ISSUE_STATE_PROCESS) {
                return (<Button key={status} className={s.dispose} onClick={() => clickSetStatus(ISSUE_STATE_PROCESS)}>
                  <img className={getSelectImg(ISSUE_STATE_PROCESS)} src={selectDispose} alt="" />
                  处理
                </Button>);
              } else if (status == ISSUE_STATE_CHECK) {
                return (<Button key={status}
                  className={s.check}
                  onClick={() => clickSetStatus(ISSUE_STATE_CHECK)}
                  disabled={details.state === ISSUE_STATE_PLAN || details.state === ISSUE_STATE_CLOSE}
                >
                  <img className={getSelectImg(ISSUE_STATE_CHECK)} src={selectCheck} alt="" />
                  验收
                </Button>);
              } else if (status == ISSUE_STATE_CLOSE) {
                return (<Button key={status} className={s.close} onClick={() => clickSetStatus(ISSUE_STATE_CLOSE)}>
                  <img className={getSelectImg(ISSUE_STATE_CLOSE)} src={selectClose} alt="" />
                  关闭
                </Button>);
              } else {
                return <span key="" />
              }
            })}

          </div>
        </Form.Item>
        {nextStatus !== ISSUE_STATE_CLOSE && execUserIdRender()}
      </div>
      <Form.Item labelCol={{ span: 2 }} label="">
        <div style={{ marginLeft: type === STAGE_FORM_TYPE_ENUM.DETAILS ? "0px" : "30px", width: type === STAGE_FORM_TYPE_ENUM.DETAILS ? "auto" : "480px" }}>
          {editor}
        </div>
      </Form.Item>
    </>
  );
});

export default StageFormItem;
