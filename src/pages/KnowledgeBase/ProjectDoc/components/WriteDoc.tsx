import { useStores } from '@/hooks';
import React, { useEffect } from 'react';
import { Input, message, Space } from 'antd';
import { useCommonEditor, change_file_fs } from '@/components/Editor';
import { FILE_OWNER_TYPE_PROJECT_DOC } from '@/api/fs';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { useState } from 'react';
import s from './EditDoc.module.less';
import { observer } from 'mobx-react';
import Button from '@/components/Button';
import type { TocInfo } from '@/components/Editor/extensions/index';
import DocTocPanel from './DocTocPanel';
import classNames from 'classnames';
import { update_title } from "@/api/project_entry"

const WriteDoc: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');

  const [newTitle, setNewTitle] = useState(''); //新建文档时有空
  const [tocList, setTocList] = useState<TocInfo[]>([]);

  const { editor, editorRef } = useCommonEditor({
    content: '',
    fsId: projectStore.curProject?.doc_fs_id ?? '',
    ownerType: FILE_OWNER_TYPE_PROJECT_DOC,
    ownerId: projectStore.curEntry?.entry_id ?? "",
    historyInToolbar: true,
    clipboardInToolbar: true,
    widgetInToolbar: true,
    showReminder: true,
    tocCallback: (result) => setTocList(result),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      request(
        docApi.keep_update_doc({
          session_id: userStore.sessionId,
          doc_id: projectStore.curEntry?.entry_id ?? "",
        }),
      ).catch((e) => {
        console.log(e);
        message.error('无法维持编辑状态');
        docStore.inEdit = false;
      });
    }, 10 * 1000);
    request(
      docApi.start_update_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: projectStore.curEntry?.entry_id ?? "",
      }),
    ).catch((e) => {
      console.log(e);
      message.error('无法获得编辑权限');
      docStore.inEdit = false;
    });
    //获取内容
    request(
      docApi.get_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: projectStore.curEntry?.entry_id ?? "",
      }),
    ).then((res) => {
      editorRef.current?.setContent(res.doc.base_info.content);
    });
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectStore.curEntry]);

  //更新文档
  const updateDoc = async () => {
    const content = editorRef.current?.getContent() ?? {
      type: 'doc',
    };
    await change_file_fs(
      content,
      projectStore.curProject?.doc_fs_id ?? '',
      userStore.sessionId,
      FILE_OWNER_TYPE_PROJECT_DOC,
      projectStore.curEntry?.entry_id ?? "",
    );
    if (newTitle != (projectStore.curEntry?.entry_title ?? "")) {
      await request(update_title({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        entry_id: projectStore.curEntry?.entry_id ?? "",
        title: newTitle,
      }));
      await projectStore.loadEntry(projectStore.curEntry?.entry_id ?? "");
    }
    await request(
      docApi.update_doc_content({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: projectStore.curEntry?.entry_id ?? "",
        content: JSON.stringify(content),
      }),
    );
    await docStore.loadDoc();
    docStore.inEdit = false;
  };

  return (
    <div className={s.editdoc_wrap}>
      <div className={s.editdoc_title_wrap}>
        <Input
          placeholder="请输入新文档名称"
          defaultValue={projectStore.curEntry?.entry_title ?? ""}
          bordered={false}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setNewTitle(e.target.value.trim());
          }}
        />
        <div className={s.save}>
          <Space size="large">
            <Button
              type="default"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                docStore.inEdit = false;
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
          </Space>
        </div>
      </div>
      <div className={s.doc_wrap}>
        <div className={classNames(s.read_doc, "_docContext")} >{editor}</div>
        {tocList.length > 0 && (
          <DocTocPanel tocList={tocList} />
        )}
      </div>
    </div>
  );
};

export default observer(WriteDoc);
