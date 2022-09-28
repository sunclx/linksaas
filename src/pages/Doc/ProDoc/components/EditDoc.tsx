import { useStores } from '@/hooks';
import React, { useEffect } from 'react';
import { Input, Button, message, Space } from 'antd';
import { useCommonEditor, change_file_fs, change_file_owner } from '@/components/Editor';
import { FILE_OWNER_TYPE_PROJECT_DOC, FILE_OWNER_TYPE_PROJECT } from '@/api/fs';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { LinkDocState } from '@/stores/linkAux';
import s from './EditDoc.module.less';
import { observer } from 'mobx-react';

const WriteDoc: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const curDocId = docStore.curDocId;
  const [newTitle, setNewTitle] = useState(''); //新建文档时有空

  const location = useLocation();

  const { editor, editorRef } = useCommonEditor({
    content: '',
    fsId: projectStore.curProject?.doc_fs_id ?? '',
    ownerType: curDocId == '' ? FILE_OWNER_TYPE_PROJECT : FILE_OWNER_TYPE_PROJECT_DOC,
    ownerId: curDocId == '' ? projectStore.curProjectId : curDocId,
    historyInToolbar: true,
    clipboardInToolbar: true,
    widgetInToolbar: true,
    showReminder: true,
    channelMember: false,
  });

  useEffect(() => {
    if (curDocId == '') {
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
          doc_id: curDocId,
        }),
      ).catch((e) => {
        console.log(e);
        message.error('无法维持编辑状态');
        docStore.setCurDoc(curDocId, false, docStore.curDocInRecycle);
      });
    }, 10 * 1000);
    request(
      docApi.start_update_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docStore.curDocSpaceId,
        doc_id: curDocId,
      }),
    ).catch((e) => {
      console.log(e);
      message.error('无法获得编辑权限');
      docStore.setCurDoc(curDocId, false, docStore.curDocInRecycle);
    });
    //获取内容
    request(
      docApi.get_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docStore.curDocSpaceId,
        doc_id: curDocId,
      }),
    ).then((res) => {
      editorRef.current?.setContent(res.doc.base_info.content);
    });
    return () => {
      clearInterval(timer);
      docStore.updateDocKey(curDocId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curDocId]);

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
      curDocId,
    );
    const res = request(
      docApi.update_doc_content({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docStore.curDocSpaceId,
        doc_id: curDocId,
        title: docStore.curDocKey?.title ?? '',
        content: JSON.stringify(content),
      }),
    );
    if (!res) {
      return;
    }
    docStore.setCurDoc(curDocId, false, docStore.curDocInRecycle);
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
    const res = await request(
      docApi.create_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docStore.curDocSpaceId,
        base_info: {
          title: newTitle,
          content: JSON.stringify(content),
          tag_list: [],
          doc_perm: {
            read_for_all: true,
            extra_read_user_id_list: [],
            write_for_all: true,
            extra_write_user_id_list: [],
          },
        },
      }),
    );
    if (!res) {
      return;
    }
    //变更文件Owner
    await change_file_owner(content, userStore.sessionId, FILE_OWNER_TYPE_PROJECT_DOC, res.doc_id);
    //刷新左侧列表
    await docStore.updateDocKey(res.doc_id);
    //回到阅读模式
    docStore.setCurDoc(res.doc_id, false, docStore.curDocInRecycle);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      docStore.setEditing(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={s.editdoc_wrap}>
      <div className={s.editdoc_title_wrap}>
        <Input
          placeholder="新文档"
          defaultValue={docStore.curDocKey?.title ?? ''}
          onChange={(e) => {
            docStore.setEditing(true);
            e.stopPropagation();
            e.preventDefault();
            if (curDocId == '') {
              setNewTitle(e.target.value);
            } else {
              docStore.setDocTitle(docStore.curDocId, e.target.value);
            }
          }}
        />
        {/* <RenderDocBtns /> */}
      </div>
      <div className="_chatContext">{editor}</div>
      <div className={s.save}>
        <Space size="large">
          <Button 
          style={{ width: "80px" }}
          size='large'
          onClick={e=>{
            e.stopPropagation();
            e.preventDefault();
            docStore.setEditing(false);
            docStore.setCurDoc(curDocId, false, docStore.curDocInRecycle);
          }}>取消</Button>
          <Button
            style={{ width: "80px" }}
            type="primary"
            size='large'
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              docStore.setEditing(false);

              if (curDocId == '') {
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
  );
};

export default observer(WriteDoc);
