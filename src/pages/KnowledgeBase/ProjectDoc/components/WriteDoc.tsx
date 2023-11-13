import { useStores } from '@/hooks';
import React, { useEffect } from 'react';
import { Card, message, Space } from 'antd';
import { useCommonEditor } from '@/components/Editor';
import { FILE_OWNER_TYPE_PROJECT_DOC } from '@/api/fs';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { useState } from 'react';
import { observer } from 'mobx-react';
import Button from '@/components/Button';
import type { TocInfo } from '@/components/Editor/extensions/index';
import DocTocPanel from './DocTocPanel';
import classNames from 'classnames';
import s from "./EditDoc.module.less";
import ActionModal from '@/components/ActionModal';
import { flushEditorContent } from '@/components/Editor/common';

const WriteDoc: React.FC = () => {
  const appStore = useStores('appStore');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const entryStore = useStores('entryStore');

  const [tocList, setTocList] = useState<TocInfo[]>([]);

  const { editor, editorRef } = useCommonEditor({
    content: '',
    fsId: projectStore.curProject?.doc_fs_id ?? '',
    ownerType: FILE_OWNER_TYPE_PROJECT_DOC,
    ownerId: entryStore.curEntry?.entry_id ?? "",
    projectId: projectStore.curProjectId,
    historyInToolbar: true,
    clipboardInToolbar: true,
    commonInToolbar: true,
    widgetInToolbar: true,
    showReminder: false,
    tocCallback: (result) => setTocList(result),
  });

  //更新文档
  const updateDoc = async () => {
    await flushEditorContent();
    const content = editorRef.current?.getContent() ?? {
      type: 'doc',
    };
    await request(
      docApi.update_doc_content({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: entryStore.curEntry?.entry_id ?? "",
        content: JSON.stringify(content),
      }),
    );
    await docStore.loadDoc();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      request(
        docApi.keep_update_doc({
          session_id: userStore.sessionId,
          doc_id: entryStore.curEntry?.entry_id ?? "",
        }),
      ).catch((e) => {
        console.log(e);
        message.error('无法维持编辑状态');
      });
    }, 10 * 1000);
    request(
      docApi.start_update_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: entryStore.curEntry?.entry_id ?? "",
      }),
    ).catch((e) => {
      console.log(e);
      message.error('无法获得编辑权限');
    });
    //获取内容
    request(
      docApi.get_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: entryStore.curEntry?.entry_id ?? "",
      }),
    ).then((res) => {
      editorRef.current?.setContent(res.doc.base_info.content);
    });
    return () => {
      clearInterval(timer);
      request(docApi.end_update_doc({
        session_id: userStore.sessionId,
        doc_id: entryStore.curEntry?.entry_id ?? "",
      }));
    };
  }, [entryStore.curEntry]);

  useEffect(() => {
    return () => {
      appStore.inEdit = false;
      appStore.clearCheckLeave();
    };
  }, []);

  return (
    <Card bordered={false} extra={
      <Space size="large">
        <Button
          type="default"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            appStore.inEdit = false;
          }}>取消</Button>
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            updateDoc();
          }}
        >
          保存
        </Button>
      </Space>}>
      <div className={s.doc_wrap}>
        <div className={classNames(s.read_doc, "_docContext")}>{editor}</div>
        {tocList.length > 0 && (
          <DocTocPanel tocList={tocList} />
        )}
      </div>
      {appStore.checkLeave && <ActionModal
        open={appStore.checkLeave}
        title="离开页面"
        width={330}
        okText="离开"
        okButtonProps={{ danger: true }}
        onCancel={() => appStore.clearCheckLeave()}
        onOK={() => {
          const onLeave = appStore.onLeave;
          appStore.clearCheckLeave();
          docStore.reset();
          if (onLeave != null) {
            onLeave();
          }
        }}
      >
        <h1 style={{ textAlign: 'center', fontWeight: 550, fontSize: '14px' }}>
          页面有未保存内容，是否确认离开此页面？
          <br /> 系统将不会记住未保存内容
        </h1>
      </ActionModal>
      }
    </Card>
  );
};

export default observer(WriteDoc);
