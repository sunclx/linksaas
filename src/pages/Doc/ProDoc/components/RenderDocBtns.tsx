import React from 'react';
import s from './EditDoc.module.less';
import { ReactComponent as Historysvg } from '@/assets/svg/history.svg';
import { ReactComponent as Msgsvg } from '@/assets/svg/msg.svg';
import RemoveDocBtn from '@/components/DocMenu/components/RemoveDocBtn';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { Button, message, Popover } from 'antd';
import DocHistory from './DocHistory';
import DocComment from './DocComment';

const RenderDocBtns: React.FC = () => {
  const userStore = useStores('userStore');
  const docStore = useStores('docStore');

  const setWatch = async (docKey: docApi.DocKey, watchValue: boolean) => {
    if (watchValue) {
      const res = await request(
        docApi.watch_doc({
          session_id: userStore.sessionId,
          project_id: docKey.project_id,
          doc_space_id: docKey.doc_space_id,
          doc_id: docKey.doc_id,
        }),
      );
      message.success('已关注此文档');
      if (!res) {
        return;
      }
    } else {
      const res = await request(
        docApi.un_watch_doc({
          session_id: userStore.sessionId,
          project_id: docKey.project_id,
          doc_space_id: docKey.doc_space_id,
          doc_id: docKey.doc_id,
        }),
      );
      message.success('已取消关注此文档');

      if (!res) {
        return;
      }
    }
    docStore.setMyWatch(docKey.doc_id, watchValue);
  };

  return (
    <div className={s.docbtns_wrap}>
      {!docStore.curDocInRecycle && (
        <>
          <span
            className={docStore.curDocKey!.my_watch ? s.isCollect : s.no_Collect}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setWatch(docStore.curDocKey!, !docStore.curDocKey!.my_watch);
            }}
          />
          <Popover
            placement="bottom"
            content={() => <DocComment />}
            onVisibleChange={(v) => {
              if (v) {
                docStore.loadDocComment(0);
              } else {
                docStore.clearDocComment();
              }
            }}
            // visible={true}
            trigger="hover"
          >
            <Msgsvg />
          </Popover>
          <Popover
            placement="bottom"
            content={() => <DocHistory />}
            onVisibleChange={(v) => {
              if (v) {
                docStore.loadDocHistory();
              } else {
                docStore.clearDocHistory();
              }
            }}
            trigger="hover"
          >
            <Historysvg />
          </Popover>

          <RemoveDocBtn docKey={docStore.curDocKey!} recycleBin={docStore.curDocInRecycle} />
          <Button
            type="primary"
            style={{ marginLeft: '40px' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              docStore.setCurDoc(docStore.curDocId, true, false);
            }}
          >
            编辑
          </Button>
        </>
      )}
    </div>
  );
};

export default observer(RenderDocBtns);
