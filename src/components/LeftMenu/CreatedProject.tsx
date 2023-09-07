import ActionModal from '@/components/ActionModal';
import { Form, Input, Radio, message } from 'antd';
import type { FC } from 'react';
import React from 'react';
import Button from '../Button';
import type { BasicProjectInfo } from '@/api/project';
import { create, update_setting } from '@/api/project';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { useSimpleEditor } from '@/components/Editor';
import { useHistory } from 'react-router-dom';
import { APP_PROJECT_OVERVIEW_PATH, PROJECT_SETTING_TAB } from '@/utils/constant';

type CreatedProjectProps = {
  visible: boolean;
  onChange: (boo: boolean) => void;
};

const CreatedProject: FC<CreatedProjectProps> = (props) => {
  const { visible, onChange } = props;

  const history = useHistory();

  const [form] = Form.useForm();
  form.setFieldsValue({ project_name: "", simple_mode: true })

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const { editor, editorRef } = useSimpleEditor("请输入项目描述");

  const submit = async (values: { project_name: string, simple_mode: boolean }) => {
    const content = editorRef.current?.getContent() ?? { type: "doc" };

    const data: BasicProjectInfo = {
      project_name: values.project_name,
      project_desc: JSON.stringify(content),
    };
    try {
      const res = await request(create(userStore.sessionId, data));
      message.success('创建项目成功');
      if (values.simple_mode) {
        await request(update_setting({
          session_id: userStore.sessionId,
          project_id: res.project_id,
          setting: {
            disable_member_appraise: true,
            disable_test_case: true,
            disable_server_agent: true,
            disable_ext_event: true,
            disable_app_store: true,
            disable_data_anno: true,
            disable_api_collection: true,
            disable_code_comment: true,

            disable_chat: true,
            disable_kb: true,
            disable_work_plan: false,

            min_pure_text_len_in_chat: 0,
            disable_widget_in_chat: true,

            layout_type: 0, //后续删除字段
            disable_sprit: true,//后续删除字段

            hide_custom_event: true,
            hide_custom_event_for_admin: false,

            hide_project_info: true,
            hide_bulletin: true,
            hide_user_goal: true,
            hide_user_award: true,
            hide_my_todo_task: true,
            hide_my_todo_bug: true,
            hide_extra_info: true,
          },
        }));
      }
      await projectStore.updateProject(res.project_id);
      onChange(false);
      projectStore.setCurProjectId(res.project_id).then(() => {
        history.push(APP_PROJECT_OVERVIEW_PATH);
        projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_LAYOUT;
      });
    } catch (error) { }
  };


  return (
    <ActionModal open={visible} title="创建项目" width={800} onCancel={() => onChange(false)}>
      <Form form={form} onFinish={submit} labelCol={{ span: 3 }}>
        <Form.Item
          name="project_name"
          label="项目名称"
          rules={[{ required: true, message: '项目名称必填' }]}
        >
          <Input allowClear placeholder={`请输入项目名称`} style={{ borderRadius: '6px' }} />
        </Form.Item>
        <Form.Item label="模式" name="simple_mode"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={true}>简单模式</Radio>
            <Radio value={false}>专家模式</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="project_desc" label="项目介绍">
          <div className="_projectEditContext" style={{ marginTop: '-12px' }}>
            {editor}
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button ghost onClick={() => onChange(false)}>
              取消
            </Button>
            &nbsp; &nbsp;
            <Button htmlType="submit">创建</Button>
          </div>
        </Form.Item>
      </Form>
    </ActionModal>
  );
};

export default CreatedProject;
