import React, { useEffect, useState } from 'react';
import CardWrap from '@/components/CardWrap';
import s from './index.module.less';
import { Form, Input, message } from 'antd';
import Button from '@/components/Button';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import type { BasicProjectInfo } from '@/api/project';
import { update } from '@/api/project';
import { request } from '@/utils/request';
import { useCommonEditor, ReadOnlyEditor, change_file_fs } from '@/components/Editor';
import { FILE_OWNER_TYPE_PROJECT } from '@/api/fs';

enum EDIT_OR_DETAILS_ENUM {
  EDIT = 'edit',
  DETAILS = 'details',
}

const Home: React.FC = () => {
  const [form] = Form.useForm();
  const [pageType, setPageType] = useState<EDIT_OR_DETAILS_ENUM>(EDIT_OR_DETAILS_ENUM.DETAILS);
  const [detailsObj, setDetailsObj] = useState({
    title: '',
    content: '',
  });
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');

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
    if (pageType == EDIT_OR_DETAILS_ENUM.EDIT) {
      setTimeout(() => {
        editorRef.current!.setContent(detailsObj.content);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType]);

  useEffect(() => {
    setDetailsObj({
      title: projectStore.curProject?.basic_info.project_name || '',
      content: projectStore.curProject?.basic_info.project_desc || '',
    });
  }, [projectStore]);

  const sumbit = async () => {
    const { title } = form.getFieldsValue();
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
      setPageType(EDIT_OR_DETAILS_ENUM.DETAILS);
      setDetailsObj({
        title: title,
        content: data.project_desc,
      });
      message.success('编辑成功');
      projectStore.updateProject(projectStore.curProjectId);
    }
  };

  const onChangeEdit = () => {
    setPageType(EDIT_OR_DETAILS_ENUM.EDIT);

    form.setFieldsValue({
      title: detailsObj.title,
    });
  };

  return (
    <CardWrap title="项目详情" halfContent>
      <div className={s.pj_detail_wrap}>
        {projectStore.isAdmin && (
          <div className={s.btn_wrap}>
            {pageType === EDIT_OR_DETAILS_ENUM.EDIT ? (
              <>
                <Button
                  ghost
                  className={s.cancel}
                  onClick={() => setPageType(EDIT_OR_DETAILS_ENUM.DETAILS)}
                >
                  取消
                </Button>
                <Button onClick={sumbit}>保存</Button>
              </>
            ) : (
              <Button disabled={projectStore.curProject?.closed} onClick={onChangeEdit}>
                编辑
              </Button>
            )}
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="项目名称">
            {pageType === EDIT_OR_DETAILS_ENUM.EDIT ? (
              <Input allowClear placeholder={`输入项目名称`} />
            ) : (
              <div>{detailsObj?.title}</div>
            )}
          </Form.Item>
          <Form.Item name="content" label="项目介绍">
            {pageType === EDIT_OR_DETAILS_ENUM.EDIT ? (
              <div className="_projectEditContext">{editor}</div>
            ) : (
              <div>
                {(detailsObj?.content ?? '' != "") && <ReadOnlyEditor content={detailsObj?.content ?? ''} />}
              </div>
            )}
          </Form.Item>
        </Form>
      </div>
    </CardWrap>
  );
};
export default observer(Home);
