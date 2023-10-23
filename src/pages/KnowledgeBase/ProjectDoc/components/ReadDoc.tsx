import { useStores } from '@/hooks';
import React, { useState } from 'react';
import { ReadOnlyEditor } from '@/components/Editor';
import { observer } from 'mobx-react';
import s from './EditDoc.module.less';
import RenderDocBtns from './RenderDocBtns';
import { Button, Popover } from 'antd';
import leftArrow from '@/assets/image/leftArrow.png';
import { useHistory } from 'react-router-dom';
import { LinkIdeaPageInfo } from '@/stores/linkAux';
import { BulbFilled } from '@ant-design/icons';
import type { TocInfo } from '@/components/Editor/extensions/index';
import DocTocPanel from './DocTocPanel';


const ReadDoc: React.FC = () => {
  const [matchKeywordList, setMatchKeywordList] = useState<string[]>([]);
  const [tocList, setTocList] = useState<TocInfo[]>([]);

  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const ideaStore = useStores('ideaStore');
  const linkAuxStore = useStores("linkAuxStore");

  const history = useHistory();


  return (
    <div className={s.editdoc_wrap}>

      <div className={s.editdoc_title_wrap}>
        <h1>
          <a onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (docStore.fromLink) {
              docStore.fromLink = false;
            }
            history.goBack();

          }}>
            <img src={leftArrow} />
          </a>
          {projectStore.curEntry?.entry_title ?? ""}
          {matchKeywordList.length > 0 && (
            <Popover placement='right'
              title="相关知识点"
              overlayStyle={{ width: 150 }}
              content={
                <div style={{ maxHeight: "calc(100vh - 300px)", padding: "10px 10px" }}>
                  {matchKeywordList.map(keyword => (
                    <Button key={keyword} type="link" style={{ minWidth: 0 }} onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", [keyword]), history);
                    }}>{keyword}</Button>
                  ))}
                </div>
              }>
              <BulbFilled style={{ color: "orange", paddingRight: "10px", marginLeft: "10px" }} />
            </Popover>
          )}
        </h1>
        <RenderDocBtns />
      </div>
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
    </div>
  );
};

export default observer(ReadDoc);
