import { useStores } from '@/hooks';
import React, { useState } from 'react';
import { ReadOnlyEditor } from '@/components/Editor';
import { observer } from 'mobx-react';
import RenderDocBtns from './RenderDocBtns';
import type { TocInfo } from '@/components/Editor/extensions/index';
import DocTocPanel from './DocTocPanel';
import s from "./EditDoc.module.less";
import { Card } from 'antd';


const ReadDoc: React.FC = () => {
  const [matchKeywordList, setMatchKeywordList] = useState<string[]>([]);
  const [tocList, setTocList] = useState<TocInfo[]>([]);

  const docStore = useStores('docStore');
  const ideaStore = useStores('ideaStore');

  return (
    <Card extra={<RenderDocBtns keyWordList={matchKeywordList} />} bordered={false}
      bodyStyle={{ paddingBottom: "0px" }}>
      <div className={s.doc_wrap}>
        <div className={s.read_doc}>
          {<ReadOnlyEditor content={docStore.curDoc?.base_info.content ?? ""} keywordList={ideaStore.keywordList}
            keywordCallback={(kwList) => setMatchKeywordList(kwList)}
            tocCallback={(result) => setTocList(result)} />}
        </div>
        {tocList.length > 0 && (
          <DocTocPanel tocList={tocList} />
        )}
      </div>
    </Card>
  );
};

export default observer(ReadDoc);
