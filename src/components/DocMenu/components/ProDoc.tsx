import { useEffect } from 'react';
import React from 'react';
import s from './ProDoc.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import * as docApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { useHistory, useLocation } from 'react-router-dom';
import { APP_PROJECT_DOC_PRO_PATH } from '@/utils/constant';
import type { LinkDocState } from '@/stores/linkAux';
import RemoveDocBtn from './RemoveDocBtn';
import { Empty } from 'antd';
import ActionModal from '@/components/ActionModal';

type ProDocProps = {};

const ProDoc: React.FC<ProDocProps> = () => {
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');
  const docStore = useStores('docStore');
  const history = useHistory();
  const location = useLocation();

  const loadData = async () => {
    await docStore.loadDocKey(projectStore.curProject?.default_doc_space_id ?? '');
    if (location.state != null) {
      const state = location.state as LinkDocState;
      docStore.setCurDoc(state.docId, state.writeDoc, false);
    }
  };
  useEffect(() => {
    loadData();
  }, [projectStore.curProjectId, docStore.curDocSpaceId]);

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
      if (!res) {
        return;
      }
    }
    docStore.setMyWatch(docKey.doc_id, watchValue);
  };

  useEffect(() => {
    docStore.setShowleavePage(false);
  }, []);

  // const [nextLocation, setNextLocation] = useState<LocationDescriptor<unknown>>();
  // const [unblock, setUnblock] = useState<UnregisterCallback>();
  // const [currentItem, setcurrentItem] = useState<docApi.DocKey>();

  useEffect(() => {
    const block = history.block((next) => {
      if (["/app/project/home",
        "/app/project/member",
        "/app/project/appraise",
        "/app/project/task",
        "/app/project/task/view",
        "/app/project/bug",
        "/app/project/bug/view",
        "/app/project/access",
        "/app/project/access/view",
        "/app/project/appstore"].includes(next.pathname)) {
        return block();
      }
      if (docStore.editing) {
        docStore.setShowleavePage(true);
        docStore.setNextLocation(next);
        return false;
      } else {
        return block();
      }
    });
    docStore.setUnblock(() => block);
    return () => {
      if (docStore.unblock) {
        docStore.unblock();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, docStore.editing]);
  // const handleLeavePage = () => {
  //   if (unblock) {
  //     unblock();
  //   }

  //   docStore.setEditing(false);
  //   docStore.setShowleavePage(false);
  //   history.push(docStore.nextLocation!);
  //   if (currentItem) {
  //     docStore.setCurDoc(currentItem.doc_id, false, false);
  //     history.push(APP_PROJECT_DOC_PRO_PATH);
  //     docStore.setShowProDoc(true);
  //     setcurrentItem(undefined);
  //   }
  // };

  return (
    <div className={s.left_pro_doc_wrap}>
      <ul>
        {docStore.curDocKeyListWithFilter.map((item) => (
          <li
            key={item.doc_id}
            className={
              item.doc_id == docStore.curDocId &&
                location.pathname.includes(APP_PROJECT_DOC_PRO_PATH)
                ? s.li_item + ' ' + s.curDoc
                : s.li_item
            }
            onClick={(e) => {
              if (docStore.editing) {
                docStore.setShowleavePage(true);
                docStore.setCurrenDocEditItem(item);
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              docStore.setCurDoc(item.doc_id, false, false);
              history.push(APP_PROJECT_DOC_PRO_PATH);
              docStore.setShowProDoc(true);
            }}
          >
            <span
              className={item.my_watch ? s.isCollect : s.no_Collect}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setWatch(item, !item.my_watch);
              }}
            />

            <div
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '85%',
              }}
            >
              {item.title}
            </div>
            {item.user_perm.can_remove && (
              <div className={s.btn_wrap}>
                <RemoveDocBtn docKey={item} recycleBin={false} />
              </div>
            )}
          </li>
        ))}
      </ul>
      {docStore.curDocKeyListWithFilter.length == 0 && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      <ActionModal
        visible={docStore.showleavePage}
        title="离开页面"
        width={330}
        okText="离开"
        onCancel={() => docStore.setShowleavePage(false)}
        onOK={() => docStore.handleLeavePage(history)}
      >
        <h1 style={{ textAlign: 'center', fontWeight: 550, fontSize: '14px' }}>
          页面有未保存内容，是否确认离开此页面？
          <br /> 系统将不会记住未保存内容
        </h1>
      </ActionModal>
    </div>
  );
};

export default observer(ProDoc);
