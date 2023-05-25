import { useStores } from '@/hooks';
import React, { useEffect } from 'react';
import { Input, message, Space } from 'antd';
import { useCommonEditor, change_file_fs, change_file_owner } from '@/components/Editor';
import { FILE_OWNER_TYPE_PROJECT_DOC, FILE_OWNER_TYPE_PROJECT } from '@/api/fs';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { LinkDocState } from '@/stores/linkAux';
import s from './EditDoc.module.less';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import Button from '@/components/Button';
import type { TocInfo } from '@/components/Editor/extensions/index';
import DocTocPanel from './DocTocPanel';
import classNames from 'classnames';

const WriteDoc: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docSpaceStore = useStores('docSpaceStore');

  const [newTitle, setNewTitle] = useState(''); //新建文档时有空
  const [tocList, setTocList] = useState<TocInfo[]>([]);

  const location = useLocation();

  const { editor, editorRef } = useCommonEditor({
    content: '',
    fsId: projectStore.curProject?.doc_fs_id ?? '',
    ownerType: docSpaceStore.curDocId == '' ? FILE_OWNER_TYPE_PROJECT : FILE_OWNER_TYPE_PROJECT_DOC,
    ownerId: docSpaceStore.curDocId == '' ? projectStore.curProjectId : docSpaceStore.curDocId,
    historyInToolbar: true,
    clipboardInToolbar: true,
    widgetInToolbar: true,
    showReminder: true,
    channelMember: false,
    tocCallback: (result) => setTocList(result),
  });

  useEffect(() => {
    if (docSpaceStore.curDocId == '') {
      //新增文档模式
      if (location.state != undefined) {
        const state = location.state as LinkDocState;
        editorRef.current?.setContent(state.content);
      }
      return;
    }
    const timer = setInterval(() => {
      request(
        docApi.keep_update_doc({
          session_id: userStore.sessionId,
          doc_id: docSpaceStore.curDocId,
        }),
      ).catch((e) => {
        console.log(e);
        message.error('无法维持编辑状态');
        docSpaceStore.showDoc(docSpaceStore.curDocId, false, true);
      });
    }, 10 * 1000);
    request(
      docApi.start_update_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? "",
        doc_id: docSpaceStore.curDocId,
      }),
    ).catch((e) => {
      console.log(e);
      message.error('无法获得编辑权限');
      docSpaceStore.showDoc(docSpaceStore.curDocId, false, true);
    });
    //获取内容
    request(
      docApi.get_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? "",
        doc_id: docSpaceStore.curDocId,
      }),
    ).then((res) => {
      editorRef.current?.setContent(res.doc.base_info.content);
    });
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docSpaceStore.curDocId]);

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
      docSpaceStore.curDocId,
    );
    await request(
      docApi.update_doc_content({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? "",
        doc_id: docSpaceStore.curDocId,
        title: docSpaceStore.curDoc?.base_info.title ?? '',
        content: JSON.stringify(content),
      }),
    );
    docSpaceStore.showDoc(docSpaceStore.curDocId, false, true);
  };

  const createDoc = async () => {
    if (newTitle.length <= 2) {
      message.error('文档标题必须大于2个字');
      return;
    }
    const content = editorRef.current?.getContent() ?? {
      type: 'doc',
    };
    //更新文件存储
    await change_file_fs(
      content,
      projectStore.curProject?.doc_fs_id ?? '',
      userStore.sessionId,
      FILE_OWNER_TYPE_PROJECT,
      projectStore.curProjectId,
    );
    //创建文档
    let docSpaceId = docSpaceStore.curDocSpaceId == "" ? (projectStore.curProject?.default_doc_space_id ?? "") : docSpaceStore.curDocSpaceId;
    if (location.state !== undefined) {
      const state = location.state as LinkDocState;
      if (state.docSpaceId != "") {
        docSpaceId = state.docSpaceId;
      }
    }
    const res = await request(
      docApi.create_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docSpaceId,
        base_info: {
          title: newTitle,
          content: JSON.stringify(content),
          doc_perm: {
            read_for_all: true,
            extra_read_user_id_list: [],
            write_for_all: true,
            extra_write_user_id_list: [],
          },
          tag_id_list: [],
        },
      }),
    );
    if (!res) {
      return;
    }
    //变更文件Owner
    await change_file_owner(content, userStore.sessionId, FILE_OWNER_TYPE_PROJECT_DOC, res.doc_id);
    //回到阅读模式
    docSpaceStore.showDoc(res.doc_id, false);
  };


  return (
    <div className={s.editdoc_wrap}>
      <div className={s.editdoc_title_wrap}>
        <Input
          placeholder="请输入新文档名称"
          defaultValue={docSpaceStore.curDoc?.base_info.title ?? ''}
          bordered={false}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (docSpaceStore.curDocId == '') {
              setNewTitle(e.target.value);
            } else {
              runInAction(() => {
                if (docSpaceStore.curDoc !== undefined) {
                  docSpaceStore.curDoc.base_info.title = e.target.value;
                }
              });
            }
          }}
        />
        <div className={s.save}>
          <Space size="large">
            <Button
              type="default"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (docSpaceStore.curDocId == "") {
                  docSpaceStore.clearCurDoc();
                  docSpaceStore.showDocList(docSpaceStore.curDocSpaceId, false);
                } else {
                  docSpaceStore.showDoc(docSpaceStore.curDocId, false, true);
                }
              }}>取消</Button>
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (docSpaceStore.curDocId == '') {
                  createDoc();
                } else {
                  updateDoc();
                }
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
