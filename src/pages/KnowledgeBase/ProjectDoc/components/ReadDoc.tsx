import { useStores } from '@/hooks';
import React, { useState } from 'react';
import { ReadOnlyEditor } from '@/components/Editor';
import { observer } from 'mobx-react';
import RenderDocBtns from './RenderDocBtns';
import DocTocPanel from './DocTocPanel';
import s from "./EditDoc.module.less";
import { Card } from 'antd';


const ReadDoc: React.FC = () => {
  const [matchKeywordList, setMatchKeywordList] = useState<string[]>([]);

  const docStore = useStores('docStore');
  const ideaStore = useStores('ideaStore');
  const editorStore = useStores('editorStore');
  const projectStore = useStores('projectStore');

  return (
    <Card extra={<RenderDocBtns keyWordList={matchKeywordList} />} bordered={false}
      bodyStyle={{ paddingBottom: "0px", width: projectStore.showChatAndComment ? "calc(100vw - 560px)" : "calc(100vw - 260px)" }}>
      <div className={s.doc_wrap}>
        {editorStore.tocList.length > 0 && <DocTocPanel />}
        <div className={s.read_doc}>
          {<ReadOnlyEditor content={docStore.curDoc?.base_info.content ?? ""} keywordList={ideaStore.keywordList}
            keywordCallback={(kwList) => setMatchKeywordList(kwList)}
            tocCallback={(result) => editorStore.tocList = result} />}
        </div>
      </div>
    </Card>
  );
};

export default observer(ReadDoc);
