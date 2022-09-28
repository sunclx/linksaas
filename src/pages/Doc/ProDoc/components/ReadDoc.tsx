import { useStores } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { ReadOnlyEditor } from '@/components/Editor';
import * as docApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import s from './EditDoc.module.less';
import RenderDocBtns from './RenderDocBtns';
import { Button, message } from 'antd';
import RemoveModal from '@/components/DocMenu/components/RemoveModal';

const ReadDoc: React.FC = () => {
  const [doc, setDoc] = useState<docApi.Doc | null>(null);
  const [showModal, setShowModal] = useState(false);

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');

  const recoverDoc = async (docKey: docApi.DocKey) => {
    const res = await request(
      docApi.recover_doc_in_recycle({
        session_id: userStore.sessionId,
        project_id: docKey.project_id,
        doc_space_id: docKey.doc_space_id,
        doc_id: docKey.doc_id,
      }),
    );
    if (res) {
      message.success(`恢复文档 ${docKey.title}`);
      docStore.removeFromRecycle(docKey.doc_id);
      docStore.addDocKey(docKey.doc_id);
    }
  };

  useEffect(() => {
    if (docStore.curDocId == '') {
      return;
    }
    if (docStore.curDocInRecycle) {
      request(
        docApi.get_doc_in_recycle({
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          doc_space_id: docStore.curDocSpaceId,
          doc_id: docStore.curDocId,
        }),
      ).then((res) => {
        setDoc(res.doc);
      });
    } else {
      request(
        docApi.get_doc({
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          doc_space_id: docStore.curDocSpaceId,
          doc_id: docStore.curDocId,
        }),
      ).then((res) => {
        setDoc(res.doc);
      });
    }
    return () => {
      setDoc(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docStore.curDocId, docStore.curDocKey?.update_time]);

  return (
    <div className={s.editdoc_wrap}>
      {docStore.curDocInRecycle && (
        <div className={s.docInRecycle}>
          <div className={s.text_wrap}>
            <span>!</span>
            当前文档已被删除
          </div>
          <div className={s.btn_wrap}>
            <Button
              type="primary"
              ghost
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                recoverDoc(docStore.curDocKey!);
              }}
            >
              恢复文档
            </Button>
            <Button
              type="ghost"
              danger
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowModal(true);
              }}
            >
              彻底删除
            </Button>
          </div>
          {showModal && (
            <RemoveModal
              onCancel={() => setShowModal(false)}
              docKey={docStore.curDocKey!}
              recycleBin={docStore.curDocInRecycle}
            />
          )}
        </div>
      )}
      <div className={s.editdoc_title_wrap}>
        <h1>{doc && doc.base_info.title}</h1>
        <RenderDocBtns />
      </div>

      {/* <hr /> */}
      {doc != null && <ReadOnlyEditor content={doc.base_info.content} />}
    </div>
  );
};

export default observer(ReadDoc);
