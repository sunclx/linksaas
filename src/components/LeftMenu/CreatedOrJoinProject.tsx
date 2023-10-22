import { Form, Input, Radio, message, Modal, Tabs } from 'antd';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { BasicProjectInfo } from '@/api/project';
import { add_tag, create, update_setting, update_tip_list } from '@/api/project';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { useSimpleEditor } from '@/components/Editor';
import { useHistory } from 'react-router-dom';
import { APP_PROJECT_OVERVIEW_PATH, PROJECT_SETTING_TAB } from '@/utils/constant';
import { join } from '@/api/project_member';
import { unixTipList } from '@/pages/Project/Setting/components/TipListSettingPanel';
import randomColor from 'randomcolor';

type CreatedProjectProps = {
  visible: boolean;
  onChange: (boo: boolean) => void;
};

const CreatedOrJoinProject: FC<CreatedProjectProps> = (props) => {
  const { visible, onChange } = props;

  const history = useHistory();

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const [prjName, setPrjName] = useState("");
  const [simpleMode, setSimpleMode] = useState(true);
  const [activeKey, setActiveKey] = useState("create");
  const [linkText, setLinkText] = useState('');

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
            disable_ext_event: true,
            disable_data_anno: true,
            disable_api_collection: true,
            disable_code_comment: true,
            disable_ci_cd: false,

            disable_kb: true,
            disable_work_plan: false,

            hide_custom_event: true,
            hide_custom_event_for_admin: false,

            hide_project_info: true,
            hide_bulletin: true,
            hide_extra_info: true,

            hide_watch_task: true,
            hide_watch_bug: true,
          },
        }));
      }
      //设置经验集锦
      const tipList = unixTipList.split("\n").map(tip => tip.trim()).filter(tip => tip != "");
      await request(update_tip_list({
        session_id: userStore.sessionId,
        project_id: res.project_id,
        tip_list: tipList,
      }));

      //设置标签
      for (const tag of ["干的不错", "待改进"]) {
        await request(add_tag({
          session_id: userStore.sessionId,
          project_id: res.project_id,
          tag_name: tag,
          bg_color: randomColor({ luminosity: "light", format: "rgba", alpha: 0.8 }),
          use_in_doc: false,
          use_in_task: false,
          use_in_bug: false,
          use_in_req: false,
          use_in_idea: false,
          use_in_sprit_summary: true,
          use_in_entry: false,
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

  const joinProject = async () => {
    const res = await request(join(userStore.sessionId, linkText));
    message.success('加入成功');
    await projectStore.updateProject(res.project_id);
    onChange(false);
  };

  const checkValid = () => {
    if (activeKey == "create") {
      return prjName != "";
    } else if (activeKey == "join") {
      return linkText.trim().length != 0;
    }
    return false;
  };


  return (
    <Modal open={visible} title="创建/加入项目" width={800}
      okText={activeKey == "create" ? "创建" : "加入"} okButtonProps={{ disabled: !checkValid() }}
      onCancel={e => {
        e.stopPropagation();
        e.preventDefault();
        onChange(false);
      }}
      onOk={e => {
        e.stopPropagation();
        e.preventDefault();
        if (activeKey == "create") {
          createProject();
        } else if (activeKey == "join") {
          joinProject();
        }
      }}>
      <Tabs type="card" activeKey={activeKey} onChange={value => setActiveKey(value)}
        items={[
          {
            key: "create",
            label: "创建项目",
            children: (
              <Form labelCol={{ span: 3 }} style={{ height: simpleMode ? "100px" : "280px", overflowY: "scroll", paddingRight: "20px" }}>
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
            ),
          },
          {
            key: "join",
            label: "加入项目",
            children: (
              <div style={{ height: simpleMode ? "100px" : "280px", overflowY: "scroll" }}>
                <Input.TextArea
                  placeholder="请输入项目邀请码"
                  allowClear
                  autoSize={{ minRows: 4, maxRows: 4 }}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </div>
            ),
          }
        ]} />
    </Modal>
  );
};

export default CreatedOrJoinProject;
