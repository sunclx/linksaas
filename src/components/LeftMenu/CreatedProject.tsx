import { Form, Input, Radio, message, Modal } from 'antd';
import type { FC } from 'react';
import React, { useState } from 'react';
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

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const [prjName, setPrjName] = useState("");
  const [simpleMode, setSimpleMode] = useState(true);

  const { editor, editorRef } = useSimpleEditor("请输入项目描述");

  const createProject = async () => {
    let content = { type: "doc" };
    if (simpleMode == false) {
      content = editorRef.current?.getContent() ?? { type: "doc" };
    }

    const data: BasicProjectInfo = {
      project_name: prjName,
      project_desc: JSON.stringify(content),
    };
    try {
      const res = await request(create(userStore.sessionId, data));
      message.success('创建项目成功');
      if (simpleMode) {
        await request(update_setting({
          session_id: userStore.sessionId,
          project_id: res.project_id,
          setting: {
            disable_member_appraise: true,
            // disable_test_case: true,
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
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <Modal open={visible} title="创建项目" width={800}
      okText="创建" okButtonProps={{ disabled: prjName == "" }}
      onCancel={e => {
        e.stopPropagation();
        e.preventDefault();
        onChange(false);
      }}
      onOk={e => {
        e.stopPropagation();
        e.preventDefault();
        createProject();
      }}>
      <Form labelCol={{ span: 3 }}>
        <Form.Item label="项目名称">
          <Input allowClear placeholder={`请输入项目名称`} style={{ borderRadius: '6px' }} value={prjName} onChange={e => {
            e.stopPropagation();
            e.preventDefault();
            setPrjName(e.target.value.trim());
          }} />
        </Form.Item>
        <Form.Item label="模式" >
          <Radio.Group value={simpleMode} onChange={e => {
            e.stopPropagation();
            setSimpleMode(e.target.value);
          }}>
            <Radio value={true}>简单模式</Radio>
            <Radio value={false}>专家模式</Radio>
          </Radio.Group>
        </Form.Item>
        {simpleMode == false && (
          <Form.Item label="项目介绍">
            <div className="_projectEditContext" style={{ marginTop: '-12px' }}>
              {editor}
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreatedProject;
