import type { PluginEvent } from '@/api/events';
import * as API from '@/api/event_type';
import { useStores } from '@/hooks';
// import { runInAction } from 'mobx';
import type { FC } from 'react';
import React from 'react';
import { Image } from 'antd';
import { useHistory } from 'react-router-dom';
import type { LinkInfo, LinkImageInfo, LinkExterneInfo } from '@/stores/linkAux';
import { LINK_TARGET_TYPE, LinkEventlInfo } from '@/stores/linkAux';

type EventComProps = {
  item: PluginEvent;
  skipProjectName: boolean;
  skipLink: boolean;
  showMoreLink: boolean;
  className?: string;
  children?: React.ReactNode;
  onLinkClick?: () => void;
};

const EventCom: FC<EventComProps> = ({
  item,
  skipProjectName,
  skipLink,
  showMoreLink,
  className,
  children,
  onLinkClick,
}) => {
  const contentList = API.get_simple_content(item, skipProjectName);
  const appStore = useStores('appStore');
  const linkAuxStore = useStores('linkAuxStore');
  const history = useHistory();

  const getTypeLink = (v: LinkInfo, index: number) => {
    if (skipLink) {
      return <span>{v.linkContent + ' '}</span>;
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
            <Image
              preview={{
                src: imgUrl,
                width: 200,
              }}
              src={thumbImgUrl}
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
    </div>
  );
};

export default EventCom;
