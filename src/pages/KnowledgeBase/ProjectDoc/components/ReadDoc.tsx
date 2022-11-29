import { useStores } from '@/hooks';
import React, { useState } from 'react';
import { ReadOnlyEditor } from '@/components/Editor';
import * as docApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import s from './EditDoc.module.less';
import RenderDocBtns from './RenderDocBtns';
import { Button, message } from 'antd';
import RemoveModal from './RemoveModal';
import leftArrow from '@/assets/image/leftArrow.png';
import { useHistory } from 'react-router-dom';

const ReadDoc: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const userStore = useStores('userStore');
  const docSpaceStore = useStores('docSpaceStore');

  const history = useHistory();

  const recoverDoc = async () => {
    const res = await request(
      docApi.recover_doc_in_recycle({
        session_id: userStore.sessionId,
        project_id: docSpaceStore.curDoc?.project_id ?? "",
        doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? "",
        doc_id: docSpaceStore.curDocId,
      }),
    );
    if (res) {
      message.success(`恢复文档 ${docSpaceStore.curDoc?.base_info.title ?? ""}`);
      docSpaceStore.recycleBin = false;
    }
  };


  return (
    <div className={s.editdoc_wrap}>
      {docSpaceStore.recycleBin && (
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
                recoverDoc();
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
              onOk={() => docSpaceStore.showDocList(docSpaceStore.curDocSpaceId, docSpaceStore.recycleBin)}
            />
          )}
        </div>
      )}
      <div className={s.editdoc_title_wrap}>
        <h1>
          <a onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (docSpaceStore.fromLink) {
              docSpaceStore.fromLink = false;
              history.goBack();
            }
            docSpaceStore.showDocList(docSpaceStore.curDocSpaceId, docSpaceStore.recycleBin);
          }}>
            <img src={leftArrow} />
          </a>
          {docSpaceStore.curDoc?.base_info.title ?? ""}
        </h1>
        <RenderDocBtns />
      </div>

      {<ReadOnlyEditor content={docSpaceStore.curDoc?.base_info.content ?? ""} />}
    </div>
  );
};

export default observer(ReadDoc);
