import React, { useEffect, useState } from 'react';
import { useCommands } from '@remirror/react';
import type { NodeViewComponentProps } from '@remirror/react';
import { Progress, Switch } from 'antd';
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent, FILE_OWNER_TYPE } from '@/api/fs';
import { save_tmp_file_base64, write_thumb_image_file, set_file_owner, write_file } from '@/api/fs';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import style from './common.module.less';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { request } from '@/utils/request';
import AsyncImage from '@/components/AsyncImage';

export type EditImageProps = NodeViewComponentProps & {
  trackId: string;
  thumbTrackId: string;
  fsId: string;
  fileName: string;
  fileId: string;
  thumbFileId: string;
  //复制图片时使用
  imageSrc?: string;
  thumbWidth?: number;
  thumbHeight?: number;
  ownerType?: FILE_OWNER_TYPE;
  ownerId?: string;

  showRawImage?: boolean;
};

export const EditImage: React.FC<EditImageProps> = observer((props) => {
  const userStore = useStores('userStore');
  const appStore = useStores('appStore');


  const { deleteImageUpload } = useCommands();
  const removeNode = () => {
    deleteImageUpload((props.getPosition as () => number)());
  };

  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbImgUrl, setThumbImgUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [thumbFileId, setThumbFileId] = useState('');
  const [fileId, setFileId] = useState('');
  const [showRawImage, setShowRawImage] = useState(props.showRawImage ?? false);


  //处理imageSrc数据
  const uploadImageSrc = async () => {
    if (props.imageSrc == undefined || props.imageSrc == null) {
      return;
    }
    //保持临时文件
    const filePath = await save_tmp_file_base64(props.fileName, props.imageSrc);
    //上传缩略图
    const thumbRes = await request(
      write_thumb_image_file(
        userStore.sessionId,
        props.fsId,
        filePath,
        props.thumbTrackId,
        props.thumbWidth ?? 200,
        props.thumbHeight ?? 150,
      ),
    );
    await request(
      set_file_owner({
        session_id: userStore.sessionId,
        fs_id: props.fsId,
        file_id: thumbRes.file_id,
        owner_type: props.ownerType ?? 0,
        owner_id: props.ownerId ?? "",
      }),
    );
    //上传正式图片
    const res = await request(
      write_file(userStore.sessionId, props.fsId, filePath, props.trackId),
    );
    await request(
      set_file_owner({
        session_id: userStore.sessionId,
        fs_id: props.fsId,
        file_id: res.file_id,
        owner_type: props.ownerType ?? 0,
        owner_id: props.ownerId ?? "",
      }),
    );
  };

  useEffect(() => {
    if (props.imageSrc == undefined || props.imageSrc == null) {
      return;
    }
    uploadImageSrc();
  }, [props.imageSrc]);

  useEffect(() => {
    if (props.fileId !== '' && props.thumbFileId !== '') {
      if (appStore.isOsWindows) {
        setThumbImgUrl(`https://fs.localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`);
        setImgUrl(`https://fs.localhost/${props.fsId}/${props.fileId}/${props.fileName}`);
      } else {
        setThumbImgUrl(`fs://localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`);
        setImgUrl(`fs://localhost/${props.fsId}/${props.fileId}/${props.fileName}`);
      }
      props.updateAttributes({
        fileName: props.fileName,
        fsId: props.fsId,
        fileId: props.fileId,
        thumbFileId: props.thumbFileId,
        showRawImage: showRawImage,
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
            setThumbImgUrl(`https://fs.localhost/${props.fsId}/${payload.file_id}/${props.fileName}`);
          } else {
            setThumbImgUrl(`fs://localhost/${props.fsId}/${payload.file_id}/${props.fileName}`);
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
          setFileId(payload.file_id);
          setTimeout(() => setProgress(100), 200); setTimeout(() => {
            if (appStore.isOsWindows) {
              setImgUrl(`https://fs.localhost/${props.fsId}/${payload.file_id}/${props.fileName}`);
            } else {
              setImgUrl(`fs://localhost/${props.fsId}/${payload.file_id}/${props.fileName}`);
            }
          }, 200);
        }
      } else {
        setProgress((payload.cur_step * 100) / payload.total_step);
      }
    });
    return () => {
      unListenFn.then((unListen) => unListen());
      unListenFn2.then((unListen) => unListen());
    };
  }, [props]);

  useEffect(() => {
    if (fileId != "") {
      props.updateAttributes({
        fileName: props.fileName,
        fsId: props.fsId,
        fileId: fileId,
        thumbFileId: thumbFileId,
        showRawImage: showRawImage,
      });
    }
  }, [thumbFileId, fileId, showRawImage]);

  return (
    <ErrorBoundary>
      <div className={style.imgUpload} onMouseEnter={e => {
        e.stopPropagation();
        e.preventDefault();
        setHover(true);
      }} onMouseLeave={e => {
        e.stopPropagation();
        e.preventDefault();
        setHover(false);
      }}>
        {hover && imgUrl != "" && (
          <Switch checkedChildren="原图" unCheckedChildren="缩略图" className={style.switch} checked={showRawImage}
            onClick={checked => setShowRawImage(checked)} />
        )}
        {showRawImage == false && (
          <div className={style.img}>
            <AsyncImage src={thumbImgUrl} preview={false} useRawImg={false}/>
          </div>
        )}
        {showRawImage == true && (
          <div style={{ maxWidth: "100%" }}>
            <AsyncImage src={imgUrl} preview={false} useRawImg={false}/>
          </div>
        )}

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
  showRawImage?: boolean;
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
        {props.showRawImage != true && (
          <div className={style.img}>
            <AsyncImage
              preview={{
                src: imageUrl,
                bodyStyle: {
                  margin: "40px 60px 0px 200px"
                },
                maskStyle:{
                  margin: "40px 60px 0px 200px"
                },
                zIndex: 9999,
              }}
              src={thumbImageUrl}
              useRawImg={false}
            />
          </div>
        )}
        {props.showRawImage == true && (
          <div style={{ maxWidth: "100%" }}>
            <AsyncImage src={imageUrl} preview={false} useRawImg={false}/>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
};
