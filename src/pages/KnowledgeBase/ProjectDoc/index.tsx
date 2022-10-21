import React from 'react';
import s from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import ReadDoc from './components/ReadDoc';
import WriteDoc from './components/WriteDoc';
import { PAGE_TYPE } from '@/stores/docSpace';
import DocList from './components/DocList';
import ActionModal from '@/components/ActionModal';

const ProjectDoc = () => {
  const docSpaceStore = useStores('docSpaceStore');

  return (
    <div className={s.doc_wrap}>
      {docSpaceStore.pageType == PAGE_TYPE.PAGE_DOC_LIST && <DocList />}
      {docSpaceStore.pageType == PAGE_TYPE.PAGE_DOC && (
        <>
          {docSpaceStore.inEdit && <WriteDoc />}
          {!docSpaceStore.inEdit && <ReadDoc />}
        </>
      )}
      {docSpaceStore.checkLeave && <ActionModal
        open={docSpaceStore.checkLeave}
        title="离开页面"
        width={330}
        okText="离开"
        onCancel={() => docSpaceStore.clearCheckLeave()}
        onOK={() => {
          const onLeave = docSpaceStore.onLeave;
          docSpaceStore.clearCheckLeave();
          docSpaceStore.reset();
          if (onLeave != undefined){
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
