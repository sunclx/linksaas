import { Form, Input, message, Modal, Tabs } from 'antd';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { BasicProjectInfo } from '@/api/project';
import { add_tag, create, update_tip_list } from '@/api/project';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { useCommonEditor } from '@/components/Editor';
import { useHistory } from 'react-router-dom';
import { APP_PROJECT_OVERVIEW_PATH, PROJECT_SETTING_TAB } from '@/utils/constant';
import { join } from '@/api/project_member';
import { unixTipList } from '@/pages/Project/Setting/components/TipListSettingPanel';
import randomColor from 'randomcolor';
import { FILE_OWNER_TYPE_NONE } from '@/api/fs';

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
  const [activeKey, setActiveKey] = useState("create");
  const [linkText, setLinkText] = useState('');

  const { editor, editorRef } = useCommonEditor({
    placeholder: "请输入项目介绍",
    content: "",
    fsId: "",
    ownerType: FILE_OWNER_TYPE_NONE,
    ownerId: "",
    projectId: "",
    historyInToolbar: false,
    clipboardInToolbar: false,
    commonInToolbar: false,
    widgetInToolbar: false,
    showReminder: false,
  });

  const createProject = async () => {
    const content = editorRef.current?.getContent() ?? { type: "doc" };

    const data: BasicProjectInfo = {
      project_name: prjName,
      project_desc: JSON.stringify(content),
    };
    try {
      const res = await request(create(userStore.sessionId, data));
      message.success('创建项目成功');
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
              <Form labelCol={{ span: 3 }} style={{ paddingRight: "20px" }}>
                <Form.Item label="项目名称">
                  <Input allowClear placeholder={`请输入项目名称`} style={{ borderRadius: '6px' }} value={prjName} onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setPrjName(e.target.value.trim());
                  }} />
                </Form.Item>
                <Form.Item label="项目介绍">
                  <div className="_projectEditContext" style={{ marginTop: '-12px' }}>
                    {editor}
                  </div>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "join",
            label: "加入项目",
            children: (
              <div style={{ height: "280px", overflowY: "scroll" }}>
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
