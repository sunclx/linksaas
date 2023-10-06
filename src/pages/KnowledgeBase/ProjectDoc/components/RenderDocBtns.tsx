import React from 'react';
import s from './EditDoc.module.less';
import { ReactComponent as Historysvg } from '@/assets/svg/history.svg';
import { ReactComponent as Msgsvg } from '@/assets/svg/msg.svg';
import { ReactComponent as Permsvg } from "@/assets/svg/perm.svg"
import RemoveDocBtn from './RemoveDocBtn';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import { message, Popover } from 'antd';
import DocHistory from './DocHistory';
import DocComment from './DocComment';
import { runInAction } from 'mobx';
import { SwapOutlined } from '@ant-design/icons';
import SwitchDocSpace from './SwitchDocSpace';
import Button from '@/components/Button';
import EditPermBtn from "./SetPermBtn";


const RenderDocBtns = () => {
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

  return (
    <div className={s.docbtns_wrap}>
      {!docSpaceStore.recycleBin && (
        <>
          <div style={{ flex: 1 }}>
            <span
              style={{ marginLeft: "15px", cursor: projectStore.isClosed ? "default" : "pointer" }}
              className={(docSpaceStore.curDoc?.my_watch ?? false) ? s.isCollect : s.no_Collect}
              title={(docSpaceStore.curDoc?.my_watch ?? false) ? "已关注文档" : "未关注文档"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (projectStore.isClosed) {
                  return;
                }
                toggleWatch();
              }}
            />
            <Popover
              placement="bottom"
              trigger="click"
              content={() => <EditPermBtn />}
            >
              <span title='文档权限'><Permsvg style={{ marginLeft: "15px" }} /></span>
            </Popover>
            <Popover
              placement="bottom"
              content={() => <DocComment />}
              onOpenChange={(v) => {
                docSpaceStore.showDocComment = v;
              }}
              trigger="click"
            >
              <span title="文档评论列表"><Msgsvg style={{ marginLeft: "15px" }} /></span>
            </Popover>
            <Popover
              placement="bottom"
              content={() => <DocHistory />}
              onOpenChange={(v) => {
                docSpaceStore.showDocHistory = v;
              }}
              trigger="click"
            >
              <span title='修改历史'><Historysvg style={{ marginLeft: "15px" }} /></span>
            </Popover>

            <span title="删除文档"><RemoveDocBtn /></span>

            {projectStore.isAdmin && (
              <Popover
                placement="bottom"
                content={() => <SwitchDocSpace />}
                trigger="click"
              >
                <SwapOutlined style={{ marginLeft: "15px" }} />
              </Popover>
            )}
          </div>
          <div style={{ flex: 0, display: "block" }}>
            <Button
              type="primary"
              style={{ marginLeft: '40px', verticalAlign: "top" }}
              disabled={projectStore.isClosed}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                docSpaceStore.showDoc(docSpaceStore.curDocId, true);
              }}
            >
              编辑
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default observer(RenderDocBtns);
