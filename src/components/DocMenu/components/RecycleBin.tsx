import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import * as docApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { useHistory, useLocation } from 'react-router-dom';
import { APP_PROJECT_DOC_PRO_PATH } from '@/utils/constant';
import s from './RecycleBin.module.less';
import { Empty, message } from 'antd';

import { ReactComponent as Backsvg } from '@/assets/svg/back.svg';
import RemoveDocBtn from './RemoveDocBtn';
const RecycleBin: React.FC = () => {
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');
  const docStore = useStores('docStore');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    docStore.loadDocKeyInRecycle();
  }, [projectStore.curProjectId]);

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

  return (
    <div className={s.left_delete_wrap}>
      <ul>
        {docStore.recycleDocKeyList.map((item) => (
          <li
            key={item.doc_id}
            className={
              item.doc_id == docStore.curDocId &&
              location.pathname.includes(APP_PROJECT_DOC_PRO_PATH)
                ? s.li_item + ' ' + s.curDoc
                : s.li_item
            }
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                docStore.setCurDoc(item.doc_id, false, true);
                history.push(APP_PROJECT_DOC_PRO_PATH);
              }}
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '70%',
              }}
            >
              {item.title}
            </div>
            <div className={s.btn_wrap}>
              <Backsvg
                className={s.back}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  recoverDoc(item);
                }}
              />
              <RemoveDocBtn docKey={item} recycleBin={true} />
            </div>
          </li>
        ))}
      </ul>
      {docStore.recycleDocKeyList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  );
};

export default observer(RecycleBin);
