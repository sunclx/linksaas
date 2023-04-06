import React, { useState } from 'react';
import s from './EditDoc.module.less';
import { ReactComponent as Historysvg } from '@/assets/svg/history.svg';
import { ReactComponent as Msgsvg } from '@/assets/svg/msg.svg';
import RemoveDocBtn from './RemoveDocBtn';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { Dropdown, message, Popover } from 'antd';
import DocHistory from './DocHistory';
import DocComment from './DocComment';
import { runInAction } from 'mobx';
import { SwapOutlined } from '@ant-design/icons';
import SwitchDocSpace from './SwitchDocSpace';
import SetPermModal from './SetPermModal';



const RenderDocBtns = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docSpaceStore = useStores('docSpaceStore');

  const [showPermModal, setShowPermModal] = useState(false);

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
      if (!res) {
        return;
      }
      message.success('已关注此文档');
      docSpaceStore.loadCurWatchDocList(docSpaceStore.curDoc.project_id);
    } else {
      const res = await request(
        docApi.un_watch_doc({
          session_id: userStore.sessionId,
          project_id: docSpaceStore.curDoc.project_id,
          doc_space_id: docSpaceStore.curDoc.doc_space_id,
          doc_id: docSpaceStore.curDocId,
        }),
      );
      if (!res) {
        return;
      }
      message.success('已取消关注此文档');
      docSpaceStore.loadCurWatchDocList(docSpaceStore.curDoc.project_id);
    }
    runInAction(() => {
      if (docSpaceStore.curDoc != undefined) {
        docSpaceStore.curDoc.my_watch = nextValue;
      }
    });
  };

  const updatePerm = async (newPerm: docApi.DocPerm) => {
    await request(docApi.update_doc_perm({
      session_id: userStore.sessionId,
      project_id: docSpaceStore?.curDoc?.project_id ?? "",
      doc_space_id: docSpaceStore?.curDoc?.doc_space_id ?? "",
      doc_id: docSpaceStore.curDocId,
      doc_perm: newPerm,
    }));
  };

  return (
    <div className={s.docbtns_wrap}>
      {!docSpaceStore.recycleBin && (
        <>
          <div style={{ flex: 1 }}>
            <span
              style={{ marginLeft: "15px" }}
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
              <Msgsvg style={{ marginLeft: "15px" }} />
            </Popover>
            <Popover
              placement="bottom"
              content={() => <DocHistory />}
              onOpenChange={(v) => {
                docSpaceStore.showDocHistory = v;
              }}
              trigger="hover"
            >
              <Historysvg style={{ marginLeft: "15px" }} />
            </Popover>

            <RemoveDocBtn />

            {projectStore.isAdmin && (
              <Popover
                placement="bottom"
                content={() => <SwitchDocSpace />}
                trigger="hover"
              >
                <SwapOutlined style={{ marginLeft: "15px" }} />
              </Popover>
            )}
          </div>
          <div style={{ flex: 0, display: "block" }}>
            <Dropdown.Button
              type="primary"
              style={{ marginLeft: '40px' }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                docSpaceStore.showDoc(docSpaceStore.curDocId, true);
              }}
              menu={{
                items: [
                  {
                    key: "setDocPerm",
                    label: "设置权限",
                    disabled: !projectStore.isAdmin,
                    onClick: () => setShowPermModal(true),
                  },
                ]
              }}
            >
              编辑
            </Dropdown.Button>
          </div>
        </>
      )}
      {showPermModal == true && (
        <SetPermModal docPerm={docSpaceStore.curDoc?.base_info.doc_perm ?? {
          read_for_all: true,
          extra_read_user_id_list: [],
          write_for_all: true,
          extra_write_user_id_list: [],
        }} onCancel={() => setShowPermModal(false)} onOk={(perm) => {
          if (perm != null) {
            updatePerm(perm);
          }
          setShowPermModal(false);
        }} />
      )}
    </div>
  );
};

export default observer(RenderDocBtns);
