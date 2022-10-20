import React from 'react';
import s from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import ReadDoc from './components/ReadDoc';
// import WriteDoc from './components/EditDoc';
import { PAGE_TYPE } from '@/stores/docSpace';
import DocList from './components/DocList';

const ProjectDoc = () => {
  const docSpaceStore = useStores('docSpaceStore');

  return (
    <div className={s.doc_wrap}>
      {docSpaceStore.pageType == PAGE_TYPE.PAGE_DOC_LIST && <DocList />}
      {docSpaceStore.pageType == PAGE_TYPE.PAGE_DOC && (
        <>
          {/* {docSpaceStore.inEdit && <WriteDoc />} */}
          {!(docSpaceStore.inEdit) && <span>1111</span>}
          {!docSpaceStore.inEdit && <ReadDoc />}
        </>
      )}
    </div>
  );
};

export default observer(ProjectDoc);
