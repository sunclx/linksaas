import React from 'react';
import s from './EditDoc.module.less';
import { ReactComponent as Historysvg } from '@/assets/svg/history.svg';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { Popover } from 'antd';
import DocHistory from './DocHistory';
import Button from '@/components/Button';

const RenderDocBtns = () => {
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');


  return (
    <div className={s.docbtns_wrap}>
      <div style={{ flex: 1 }}>
        <Popover
          placement="bottom"
          content={() => <DocHistory />}
          onOpenChange={(v) => {
            docStore.showDocHistory = v;
          }}
          trigger="click"
        >
          <span title='修改历史'><Historysvg style={{ marginLeft: "15px" }} /></span>
        </Popover>

      </div>
      <div style={{ flex: 0, display: "block" }}>
        <Button
          type="primary"
          style={{ marginLeft: '40px', verticalAlign: "top" }}
          disabled={projectStore.isClosed}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            docStore.inEdit = true;
          }}
        >
          编辑
        </Button>
      </div>
    </div>
  );
};

export default observer(RenderDocBtns);
