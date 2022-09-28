import React, { useEffect, useMemo, useState } from 'react';
import { useCommands } from '@remirror/react';
import type { NodeViewComponentProps } from '@remirror/react';
import { Progress } from 'antd';
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { download_file, get_cache_file } from '@/api/fs';
import { uniqId } from '@/utils/utils';
import { getFileType, FILE_TYPE } from '@/utils/file_type';
import { useStores } from '@/hooks';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { open as shell_open } from '@tauri-apps/api/shell';
import style from './common.module.less';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';

const getFileSizeStr = (size: number): string => {
  let s = size;
  if (s < 1024) {
    return s.toFixed(0) + 'B';
  }
  s = s / 1024;
  if (s < 1024) {
    return s.toFixed(1) + 'K';
  }
  s = s / 1024;
  if (s < 1024) {
    return s.toFixed(1) + 'M';
  }
  s = s / 1024;
  if (s < 1024) {
    return s.toFixed(1) + 'G';
  }
  s = s / 1024;
  if (s < 1024) {
    return s.toFixed(1) + 'T';
  }
  return '未知大小';
};

export type EditFileProps = NodeViewComponentProps & {
  trackId: string;
  fsId: string;
  fileName: string;
  fileId: string;
  fileSize: number;
};

const FileIcon: React.FC<{ name: string }> = (props) => {
  const type = getFileType(props.name);

  switch (type) {
    case FILE_TYPE.FILE_TYPE_IMAGE:
      return <div className={style.imgIcon} />;
    case FILE_TYPE.FILE_TYPE_AUDIO:
      return <div className={style.audioIcon} />;
    case FILE_TYPE.FILE_TYPE_VIDEO:
      return <div className={style.videoIcon} />;
    case FILE_TYPE.FILE_TYPE_DOC:
      return <div className={style.docIcon} />;
    default:
      return <div className={style.othersIcon} />;
  }
};

export const EditFile: React.FC<EditFileProps> = (props) => {
  const { deleteFileUpload } = useCommands();
  const removeNode = () => {
    deleteFileUpload((props.getPosition as () => number)());
  };

  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(props.fileSize);

  useEffect(() => {
    if (props.fileId !== '' && progress !== 100) {
      props.updateAttributes({
        fileName: props.fileName,
        fsId: props.fsId,
        fileId: props.fileId,
        fileSize: props.fileSize,
      });
      setProgress(100);
      return;
    }
    const unListenFn = listen('uploadFile_' + props.trackId, (ev) => {
      const payload = ev.payload as FsProgressEvent;
      if (payload.total_step <= 0) {
        payload.total_step = 1;
      }
      if (payload.cur_step >= payload.total_step && payload.file_id != '') {
        props.updateAttributes({
          fileName: props.fileName,
          fsId: props.fsId,
          fileId: payload.file_id,
          fileSize: payload.file_size,
        });
        setTimeout(() => {
          setProgress(100);
          setFileSize(payload.file_size);
        }, 100);
      } else {
        setProgress(Math.floor((payload.cur_step * 100) / payload.total_step));
        if (payload.file_size != fileSize) {
          setFileSize(payload.file_size);
        }
      }
    });
    return () => {
      unListenFn.then((unListen) => unListen());
    };
  }, [progress, props]);

  return (
    <ErrorBoundary>
      <div className={style.fileUpload}>
        <FileIcon name={props.fileName} />

        <div className={style.name}>{props.fileName}</div>
        <div className={style.size}>{fileSize != 0 && <span>{getFileSizeStr(fileSize)}</span>}</div>
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
};

export type ViewFileProps = NodeViewComponentProps & {
  fsId: string;
  fileName: string;
  fileId: string;
  fileSize: number;
};

export const ViewFile: React.FC<ViewFileProps> = (props) => {
  const userStore = useStores('userStore');
  const [download, setDownload] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!download) {
      return;
    }
    let opened = false;
    const trackId = uniqId();
    const unListenFn = listen('downloadFile_' + trackId, (ev) => {
      const payload = ev.payload as FsProgressEvent;
      if (payload.total_step <= 0) {
        payload.total_step = 1;
      }
      setProgress(Math.floor(payload.cur_step * 100) / payload.total_step);
      if (payload.cur_step >= payload.total_step) {
        get_cache_file(props.fsId, props.fileId, props.fileName).then((res) => {
          if (res.exist_in_local) {
            if (!opened) {
              opened = true;
              shell_open(res.local_dir);
            }
          }
        });
        setDownload(false);
      }
    });
    download_file(userStore.sessionId, props.fsId, props.fileId, trackId).then((res) => {
      if (res.exist_in_local) {
        opened = true;
        setDownload(false);
        shell_open(res.local_dir);
      }
    });
    return () => {
      unListenFn.then((unListen) => unListen());
    };
  }, [download]);

  useMemo(() => {
    get_cache_file(props.fsId, props.fileId, props.fileName).then((v) => {
      if (v.exist_in_local) {
        setProgress(100);
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <div
        className={style.fileUpload}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setDownload(true);
        }}
      >
        <FileIcon name={props.fileName} />
        <div className={style.name}>{props.fileName}</div>
        <div className={style.size}>
          {props.fileSize != 0 && <span>{getFileSizeStr(props.fileSize)}</span>}
        </div>
        {download && progress < 100 && (
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
        )}
      </div>
    </ErrorBoundary>
  );
};
