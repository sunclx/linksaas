import React from 'react';
import s from './EditDoc.module.less';
import { ReactComponent as Historysvg } from '@/assets/svg/history.svg';
import { ReactComponent as Msgsvg } from '@/assets/svg/msg.svg';
import RemoveDocBtn from './RemoveDocBtn';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { Button, message, Popover } from 'antd';
import DocHistory from './DocHistory';
import DocComment from './DocComment';
import { runInAction } from 'mobx';
import { SwapOutlined } from '@ant-design/icons';
import SwitchDocSpace from './SwitchDocSpace';



const RenderDocBtns: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docSpaceStore = useStores('docSpaceStore');

  const toggleWatch = async () => {
    if (docSpaceStore.curDoc == undefined) {
      return;
    }
    const nextValue = !docSpaceStore.curDoc.my_watch;
    if (nextValue) {
      const res = await request(
        docApi.watch_doc({
          session_id: userStore.sessionId,
          project_id: docSpaceStore.curDoc.project_id,
          doc_space_id: docSpaceStore.curDoc.doc_space_id,
          doc_id: docSpaceStore.curDocId,
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
          project_id: docSpaceStore.curDoc.project_id,
          doc_space_id: docSpaceStore.curDoc.doc_space_id,
          doc_id: docSpaceStore.curDocId,
        }),
      );
      message.success('已取消关注此文档');

      if (!res) {
        return;
      }
    }
    runInAction(() => {
      if (docSpaceStore.curDoc != undefined) {
        docSpaceStore.curDoc.my_watch = nextValue;
      }
    });
  };

  return (
    <div className={s.docbtns_wrap}>
      {!docSpaceStore.recycleBin && (
        <>
          <span
            className={(docSpaceStore.curDoc?.my_watch ?? false) ? s.isCollect : s.no_Collect}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleWatch();
            }}
          />
          <Popover
            placement="bottom"
            content={() => <DocComment />}
            onOpenChange={(v) => {
              docSpaceStore.showDocComment = v;
            }}
            trigger="hover"
          >
            <Msgsvg />
          </Popover>
          <Popover
            placement="bottom"
            content={() => <DocHistory />}
            onOpenChange={(v) => {
              docSpaceStore.showDocHistory = v;
            }}
            trigger="hover"
          >
            <Historysvg />
          </Popover>

          <RemoveDocBtn />

          {projectStore.isAdmin && (
            <Popover
              placement="bottom"
              content={() => <SwitchDocSpace />}
              trigger="hover"
            >
              <SwapOutlined />
            </Popover>
          )}

          <Button
            type="primary"
            style={{ marginLeft: '40px' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              docSpaceStore.showDoc(docSpaceStore.curDocId, true);
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
