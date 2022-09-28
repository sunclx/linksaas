import Button from '@/components/Button';
import type { ModalProps } from 'antd';
import { Form, message, Modal } from 'antd';
import type { FC } from 'react';
import React from 'react';
import s from './StageModel.module.less';
import { useStores } from '@/hooks';
import type { IssueInfo } from '@/api/project_issue';
import StageFormItem, { STAGE_FORM_TYPE_ENUM } from '@/components/StageFormItem';
import { formConfig } from '@/config/form';
import { observer } from 'mobx-react';
import { updateIssue } from './common';
import { useSimpleEditor } from '@/components/Editor';


type StageModelProps = ModalProps & {
  details: IssueInfo;
  handleOk?: () => void;
  handleCancel: (boo: boolean) => void;
  onSuccess: () => void;
};

const StageModel: FC<StageModelProps> = observer((props) => {
  const { handleCancel, onSuccess, details } = props;
  const [form] = Form.useForm();
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const session_id = userStore.sessionId || '';
  const project_id = projectStore.curProjectId;

  const { editor, editorRef } = useSimpleEditor("请输入备注");

  const handleOk = async () => {
    form.submit();
    const { stage_item_select_user, stage_item_status } = form.getFieldsValue();
    const commentJson = editorRef.current?.getContent() || {
      type: "doc",
    };
    await updateIssue({
      session_id,
      project_id,
      issue_id: details?.issue_id || '',
      state: stage_item_status,
    }, stage_item_select_user, commentJson, details);
    message.success('阶段更新成功');
    onSuccess();
    handleCancel(false);
  };

  return (
    <Modal
      {...props}
      width={'540px'}
      bodyStyle={{
        minHeight: '150px',
        position: 'relative',
        padding: '20px 30px 50px 0px',
      }}
      footer={false}
      onCancel={() => handleCancel(false)}
    >
      <Form
        form={form}
        {...formConfig.layout}
      // initialValues={{ stage_item_select_user: details?.check_user_id }}
      >
        <StageFormItem form={form} details={details!} type={STAGE_FORM_TYPE_ENUM.MODEL} editor={editor} />
        <div className={s.foooter}>
          <Button key="cancel" ghost onClick={() => handleCancel(false)}>
            取消
          </Button>
          <Button onClick={handleOk}>确定</Button>
        </div>
      </Form>
    </Modal>
  );
});

export default StageModel;
