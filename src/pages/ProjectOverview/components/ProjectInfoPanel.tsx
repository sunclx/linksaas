import React, { useEffect, useState } from 'react';
import s from './ProjectInfoPanel.module.less';
import { Card, Form, Input, Space, message } from 'antd';
import Button from '@/components/Button';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import type { BasicProjectInfo } from '@/api/project';
import { update } from '@/api/project';
import { request } from '@/utils/request';
import { useCommonEditor, ReadOnlyEditor, change_file_fs } from '@/components/Editor';
import { FILE_OWNER_TYPE_PROJECT } from '@/api/fs';

const ProjectInfoPanel = () => {
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');

  const [inEdit, setInEdit] = useState(false);
  const [title, setTitle] = useState(projectStore.curProject?.basic_info.project_name ?? "");

  const { editor, editorRef } = useCommonEditor({
    content: projectStore.curProject?.basic_info.project_desc ?? '',
    fsId: projectStore.curProject?.project_fs_id ?? '',
    ownerType: FILE_OWNER_TYPE_PROJECT,
    ownerId: projectStore.curProjectId,
    historyInToolbar: false,
    clipboardInToolbar: false,
    widgetInToolbar: false,
    showReminder: false,
    channelMember: false,
  });


  useEffect(() => {
    if (inEdit == true) {
      setTimeout(() => {
        editorRef.current!.setContent(projectStore.curProject?.basic_info.project_desc ?? "");
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inEdit]);

  const sumbit = async () => {
    const content = editorRef.current?.getContent() ?? {
      type: 'doc',
    };
    await change_file_fs(
      content,
      projectStore.curProject?.project_fs_id ?? '',
      userStore.sessionId,
      FILE_OWNER_TYPE_PROJECT,
      projectStore.curProjectId,
    );

    const data: BasicProjectInfo = {
      project_name: title || '',
      project_desc: JSON.stringify(content),
    };

    const res = await request(update(userStore.sessionId, projectStore.curProjectId, data));
    if (res) {
      await projectStore.updateProject(projectStore.curProjectId);
      setInEdit(false);
      message.success('编辑成功');
    }
  };

  return (
    <Card
      headStyle={{ backgroundColor: "#f5f5f5" }}
      title={
        <Space>
          <span style={{ fontSize: "16px", fontWeight: 600 }}>项目名称: </span>
          {inEdit == true ? (
            <Input style={{ width: "250px" }} placeholder={`输入项目名称`} value={title} onChange={e => {
              e.stopPropagation();
              e.preventDefault();
              setTitle(e.target.value);
            }} />
          ) : (
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{projectStore.curProject?.basic_info.project_name ?? ""}</div>
          )}
        </Space>
      }
      extra={
        <>
          {projectStore.isAdmin && (
            <div>
              {inEdit == true ? (
                <Space>
                  <Button
                    ghost
                    className={s.cancel}
                    onClick={() => setInEdit(false)}
                  >
                    取消
                  </Button>
                  <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    sumbit();
                  }}>保存</Button>
                </Space>
              ) : (
                <Button disabled={projectStore.curProject?.closed} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setTitle(projectStore.curProject?.basic_info.project_name ?? "");
                  setInEdit(true);
                }}>
                  编辑
                </Button>
              )}
            </div>
          )}
        </>
      }>
      <div className={s.pj_detail_wrap}>
        <Form layout="vertical">
          <Form.Item>
            {inEdit == true ? (
              <div className="_projectEditContext">{editor}</div>
            ) : (
              <div>
                <ReadOnlyEditor content={projectStore.curProject?.basic_info.project_desc ?? ""} />
              </div>
            )}
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default observer(ProjectInfoPanel);