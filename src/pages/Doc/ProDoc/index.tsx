import React from 'react';
import s from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import ReadDoc from './components/ReadDoc';
import WriteDoc from './components/EditDoc';
import EmptyDoc from './components/EmptyDoc';

const ProDoc = () => {
  const docStore = useStores('docStore');

  return (
    <div className={s.doc_wrap}>
      <div className={s.right_container}>
        {docStore.curDocId == '' && docStore.isWriteDoc && <WriteDoc />}
        {docStore.curDocId == '' && docStore.isWriteDoc == false && <EmptyDoc />}
        {docStore.curDocId != '' && docStore.isWriteDoc == false && <ReadDoc />}
        {docStore.curDocId != '' && docStore.isWriteDoc && <WriteDoc />}
      </div>
    </div>
  );
};

export default observer(ProDoc);
