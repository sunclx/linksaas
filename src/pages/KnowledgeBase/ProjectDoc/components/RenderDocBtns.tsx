import React from 'react';
import s from './EditDoc.module.less';
import { ReactComponent as Historysvg } from '@/assets/svg/history.svg';
import { ReactComponent as Permsvg } from "@/assets/svg/perm.svg"
import RemoveDocBtn from './RemoveDocBtn';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { Popover } from 'antd';
import DocHistory from './DocHistory';
import { SwapOutlined } from '@ant-design/icons';
import SwitchDocSpace from './SwitchDocSpace';
import Button from '@/components/Button';
import EditPermBtn from "./SetPermBtn";


const RenderDocBtns = () => {
  const projectStore = useStores('projectStore');
  const docSpaceStore = useStores('docSpaceStore');


  return (
    <div className={s.docbtns_wrap}>
      {!docSpaceStore.recycleBin && (
        <>
          <div style={{ flex: 1 }}>
            <Popover
              placement="bottom"
              trigger="click"
              content={() => <EditPermBtn />}
            >
              <span title='文档权限'><Permsvg style={{ marginLeft: "15px" }} /></span>
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
