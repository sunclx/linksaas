import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { GetBlockContentResponse, BlockContent } from '@/api/project_vc';
import { BLOCK_CONTENT_TEXT, BLOCK_CONTENT_HTML, BLOCK_CONTENT_MARKDOWN } from '@/api/project_vc';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, Button, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import '@/styles/global.less';
import './main.css';

interface ContentProps {
  blockContent: BlockContent;
}

const Content: React.FC<ContentProps> = (props) => {
  return (
    <div className="blockContent">
      {props.blockContent.content_type == BLOCK_CONTENT_TEXT && <p>{props.blockContent.content}</p>}
      {props.blockContent.content_type == BLOCK_CONTENT_HTML && (
        <div dangerouslySetInnerHTML={{ __html: props.blockContent.content }} />
      )}
      {props.blockContent.content_type == BLOCK_CONTENT_MARKDOWN && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.blockContent.content}</ReactMarkdown>
      )}
    </div>
  );
};

const Block = () => {
  const [blockInfo, setBlockInfo] = useState<GetBlockContentResponse | null>(null);
  const [index, setIndex] = useState(0);
  const query = new URLSearchParams(window.location.search);
  const projectId = query.get('projectId');
  const blockCollId = query.get('blockCollId');
  const blockId = query.get('blockId');
  const osWin = query.get('osWin');

  useEffect(() => {
    let urlPrefix = 'vc://localhost';
    if (osWin !== null && osWin.toLowerCase() == 'true') {
      urlPrefix = 'https://vc.localhost';
    }
    const url = `${urlPrefix}/${projectId}/${blockCollId}/${blockId}`;
    fetch(url).then(res=>res.json()).then(data=>{
      setBlockInfo(data);
      setIndex(0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockId]);

  return (
    <Card
      title={blockInfo?.base_info.title ?? ''}
      extra={
        blockInfo != null &&
        blockInfo.content_list.length > 0 && (
          <div>
            <Button
              type="text"
              disabled={index <= 0}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIndex(index - 1);
              }}
            >
              上一个
            </Button>
            {index + 1}/{blockInfo?.content_list.length ?? 0}
            <Button
              type="text"
              disabled={index >= (blockInfo?.content_list.length ?? 0) - 1}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIndex(index + 1);
              }}
            >
              下一个
            </Button>
          </div>
        )
      }
    >
      {blockInfo != null && blockInfo.content_list.length > 0 && (
        <Content blockContent={blockInfo.content_list[index]} />
      )}
    </Card>
  );
};

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Block />
    </ConfigProvider>
  );
};
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
