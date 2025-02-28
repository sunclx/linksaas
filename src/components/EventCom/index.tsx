import type { PluginEvent } from '@/api/events';
import * as API from '@/api/event_type';
import { useStores } from '@/hooks';
import { useState } from 'react';
import React from 'react';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import type { LinkInfo, LinkImageInfo, LinkExterneInfo } from '@/stores/linkAux';
import { LINK_TARGET_TYPE, LinkEventlInfo } from '@/stores/linkAux';
import CodeEditor from '@uiw/react-textarea-code-editor';
import AsyncImage from '../AsyncImage';

type EventComProps = {
  item: PluginEvent;
  skipProjectName: boolean;
  skipLink: boolean;
  showMoreLink: boolean;
  showSource?: boolean;
  className?: string;
  children?: React.ReactNode;
  onLinkClick?: () => void;
};

const EventCom: React.FC<EventComProps> = ({
  item,
  skipProjectName,
  skipLink,
  showMoreLink,
  showSource,
  className,
  children,
  onLinkClick,
}) => {
  const contentList = API.get_simple_content(item, skipProjectName);
  const appStore = useStores('appStore');
  const linkAuxStore = useStores('linkAuxStore');
  const history = useHistory();

  const [showSourceModal, setShowSourceModal] = useState(false);

  const getTypeLink = (v: LinkInfo, index: number) => {
    if (skipLink) {
      return <span key={index}>{v.linkContent + ' '}</span>;
    }
    switch (v.linkTargeType) {
      case LINK_TARGET_TYPE.LINK_TARGET_IMAGE: // 查看图片
        const imgLink = v as LinkImageInfo;
        let imgUrl = imgLink.imgUrl || '';
        let thumbImgUrl = imgLink.thumbImgUrl || '';
        if (appStore.isOsWindows) {
          imgUrl = imgUrl.replace(/^fs:\/\/localhost\//, 'https://fs.localhost/') || '';
          thumbImgUrl = thumbImgUrl.replace(/^fs:\/\/localhost\//, 'https://fs.localhost/') || '';
        }
        return (
          <div key={index}>
            <AsyncImage
              preview={{
                src: imgUrl,
                mask: false,
                wrapStyle: {
                  margin: "60px 60px 60px 60px",
                },
              }}
              src={thumbImgUrl}
              useRawImg={false}
            />
          </div>
        );
      case LINK_TARGET_TYPE.LINK_TARGET_EXTERNE: // 外部链接
        const extLink = v as LinkExterneInfo;
        return (
          <a key={index} href={extLink.destUrl} target="_blank" rel="noreferrer">
            {v.linkContent + ' '}
          </a>
        );
      default:
        return (
          <a
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              linkAuxStore.goToLink(v, history);
            }}
          >
            {v.linkContent + ' '}
          </a>
        );
    }
  };

  return (
    <div className={className}>
      {children}
      {contentList.map((v, index) => {
        if (v.linkTargeType != LINK_TARGET_TYPE.LINK_TARGET_NONE) {
          return getTypeLink(v, index);
        }
        return <span key={index}>{v.linkContent + ' '}</span>;
      })}
      {showMoreLink && (
        <a
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            linkAuxStore.goToLink(
              new LinkEventlInfo('', item.project_id, item.event_id, item.user_id, item.event_time),
              history,
            );
            onLinkClick?.();
          }}
        >
          查看更多
        </a>
      )}
      {showSource == true && (
        <a onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setShowSourceModal(true);
        }}>查看源信息</a>
      )}
      {showSourceModal == true && (
        <Modal title="事件源信息"
          open
          footer={null}
          onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            setShowSourceModal(false);
          }}>
          <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll", paddingRight: "10px" }}>
            <CodeEditor
              value={JSON.stringify(item, null, 2)}
              language="json"
              disabled
              style={{
                fontSize: 14,
                backgroundColor: '#f5f5f5',
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventCom;
