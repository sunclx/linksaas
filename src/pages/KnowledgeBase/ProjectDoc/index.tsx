import React from 'react';
import s from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import ReadDoc from './components/ReadDoc';
import WriteDoc from './components/WriteDoc';
import ActionModal from '@/components/ActionModal';

const ProjectDoc = () => {
  const docStore = useStores('docStore');

  return (
    <div className={s.doc_wrap} style={{ width: "100%" }}>
      {docStore.inEdit && <WriteDoc />}
      {!docStore.inEdit && <ReadDoc />}
      {docStore.checkLeave && <ActionModal
        open={docStore.checkLeave}
        title="离开页面"
        width={330}
        okText="离开"
        onCancel={() => docStore.clearCheckLeave()}
        onOK={() => {
          const onLeave = docStore.onLeave;
          docStore.clearCheckLeave();
          docStore.reset();
          if (onLeave != undefined) {
            onLeave();
          }
        }}
      >
        <h1 style={{ textAlign: 'center', fontWeight: 550, fontSize: '14px' }}>
          页面有未保存内容，是否确认离开此页面？
          <br /> 系统将不会记住未保存内容
        </h1>
      </ActionModal>}
    </div>
  );
};

export default observer(ProjectDoc);
