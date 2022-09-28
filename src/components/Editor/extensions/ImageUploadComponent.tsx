import React, { useEffect, useState } from 'react';
import { useCommands } from '@remirror/react';
import type { NodeViewComponentProps } from '@remirror/react';
import { Progress, Image } from 'antd';
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import style from './common.module.less';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export type EditImageProps = NodeViewComponentProps & {
  trackId: string;
  thumbTrackId: string;
  fsId: string;
  fileName: string;
  fileId: string;
  thumbFileId: string;
};

export const EditImage: React.FC<EditImageProps> = observer((props) => {
  const { deleteImageUpload } = useCommands();
  const removeNode = () => {
    deleteImageUpload((props.getPosition as () => number)());
  };

  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState('');
  const [thumbFileId, setThumbFileId] = useState('');
  const appStore = useStores('appStore');
  
  useEffect(() => {
    if (props.fileId !== '' && props.thumbFileId !== '') {
      if (appStore.isOsWindows) {
        setImgUrl(`https://fs.localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`);
      } else {
        setImgUrl(`fs://localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`);
      }
      props.updateAttributes({
        fileName: props.fileName,
        fsId: props.fsId,
        fileId: props.fileId,
        thumbFileId: props.thumbFileId,
      });
      setProgress(100);
      return;
    }
    const unListenFn = listen('uploadFile_' + props.thumbTrackId, (ev) => {
      const payload = ev.payload as FsProgressEvent;
      if (payload.cur_step >= payload.total_step && payload.file_id != '') {
        setThumbFileId(payload.file_id);
        setTimeout(() => {
          if (appStore.isOsWindows) {
            setImgUrl(`https://fs.localhost/${props.fsId}/${payload.file_id}/${props.fileName}`);
          } else {
            setImgUrl(`fs://localhost/${props.fsId}/${payload.file_id}/${props.fileName}`);
          }
        }, 200);
      }
    });
    const unListenFn2 = listen('uploadFile_' + props.trackId, (ev) => {
      const payload = ev.payload as FsProgressEvent;
      if (payload.total_step <= 0) {
        payload.total_step = 1;
      }
      if (payload.cur_step >= payload.total_step) {
        if (payload.file_id != '') {
          props.updateAttributes({
            fileName: props.fileName,
            fsId: props.fsId,
            fileId: payload.file_id,
            thumbFileId: thumbFileId,
          });
          setTimeout(() => setProgress(100), 200);
        }
      } else {
        setProgress((payload.cur_step * 100) / payload.total_step);
      }
    });
    return () => {
      unListenFn.then((unListen) => unListen());
      unListenFn2.then((unListen) => unListen());
    };
  });

  return (
    <ErrorBoundary>
      <div className={style.imgUpload}>
        <div className={style.img}>
          <Image src={imgUrl} preview={false} />
        </div>

        {progress < 100 ? (
          <div className={style.loading}>
            <Progress
              type="circle"
              percent={progress}
              width={28}
              strokeWidth={14}
              strokeColor="#fff"
              trailColor="#86868B"
              showInfo={false}
            />
          </div>
        ) : (
          <div
            className={style.delete}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeNode();
            }}
          >
            <Deletesvg />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});

export type ViewImageProps = NodeViewComponentProps & {
  fsId: string;
  fileName: string;
  fileId: string;
  thumbFileId: string;
};

export const ViewImage: React.FC<ViewImageProps> = (props) => {
  const appStore = useStores('appStore');

  let thumbImageUrl = `fs://localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`;
  let imageUrl = `fs://localhost/${props.fsId}/${props.fileId}/${props.fileName}`;
  if (appStore.isOsWindows) {
    thumbImageUrl = `https://fs.localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`;
    imageUrl = `https://fs.localhost/${props.fsId}/${props.fileId}/${props.fileName}`;
  }
  return (
    <ErrorBoundary>
      <div className={style.imgUpload}>
        <div className={style.img}>
          <Image
            preview={{
              src: imageUrl,
            }}
            src={thumbImageUrl}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};
