import Button from '@/components/Button';
import type { ModalProps } from 'antd';
import { Form, message, Modal } from 'antd';
import type { FC } from 'react';
import React from 'react';
import s from './StageModel.module.less';
import { useStores } from '@/hooks';
import StageFormItem, { STAGE_FORM_TYPE_ENUM } from '@/components/StageFormItem';
import { formConfig } from '@/config/form';
import { observer } from 'mobx-react';
import type { ChangeStateRequest, IssueInfo } from '@/api/project_issue';
import { request } from '@/utils/request';
import { assign_check_user, assign_exec_user, change_state } from '@/api/project_issue';
import { ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK } from '@/api/project_issue';


type StageModelProps = ModalProps & {
  issue: IssueInfo;
  onCancel: (boo: boolean) => void;
  onOk: () => void;
};

const StageModel: FC<StageModelProps> = observer((props) => {
  const { onCancel, onOk, issue } = props;
  const [form] = Form.useForm();
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const session_id = userStore.sessionId || '';
  const project_id = projectStore.curProjectId;

  const updateIssue = async (changeStateReq: ChangeStateRequest, destUserId: string, issueInfo: IssueInfo) => {
    if (issueInfo.state != changeStateReq.state) {
      const changeStatRes = await request(change_state(changeStateReq));
      if (!changeStatRes) {
        return;
      }
    }
    // 处理人接口
    if (
      changeStateReq.state === ISSUE_STATE_PROCESS &&
      destUserId !== issueInfo.exec_user_id
    ) {
      const assginRes = await request(assign_exec_user(changeStateReq.session_id, changeStateReq.project_id, changeStateReq.issue_id, destUserId));
      if (!assginRes) {
        return;
      }
    }

    // 验收人接口
    if (
      changeStateReq.state === ISSUE_STATE_CHECK &&
      destUserId !== issueInfo.check_user_id
    ) {
      const assginRes = await request(assign_check_user(changeStateReq.session_id, changeStateReq.project_id, changeStateReq.issue_id, destUserId));
      if (!assginRes) {
        return;
      }
    }
  }

  const handleOk = async () => {
    form.submit();
    const { stage_item_select_user, stage_item_status } = form.getFieldsValue();

    await updateIssue({
      session_id,
      project_id,
      issue_id: issue.issue_id || '',
      state: stage_item_status,
    }, stage_item_select_user, issue);
    message.success('阶段更新成功');
    onOk();
  };

  return (
    <Modal
      open={true}
      width={'540px'}
      bodyStyle={{
        minHeight: '150px',
        position: 'relative',
        padding: '20px 30px 50px 0px',
      }}
      footer={false}
      onCancel={() => onCancel(false)}
    >
      <Form
        form={form}
        {...formConfig.layout}
      // initialValues={{ stage_item_select_user: details?.check_user_id }}
      >
        <StageFormItem form={form} details={issue} type={STAGE_FORM_TYPE_ENUM.MODEL} />
        <div className={s.foooter}>
          <Button key="cancel" ghost onClick={() => onCancel(false)}>
            取消
          </Button>
          <Button onClick={handleOk}>确定</Button>
        </div>
      </Form>
    </Modal>
  );
});

export default StageModel;
