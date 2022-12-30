import React, { useEffect, useState } from "react";
import style from '@/components/Editor/extensions/common.module.less';
import { getFileType, FILE_TYPE } from '@/utils/file_type';
import { Progress } from "antd";
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { get_cache_file, download_file } from '@/api/fs';
import { open as shell_open } from '@tauri-apps/api/shell';
import { useStores } from "@/hooks";

interface FsFileProps {
    itemId: string;
    fsId: string;
    fileId: string;
    fileName: string;
    fileSize: number;
    download: boolean;
    onRemove?: () => void;
};

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

const FsFile: React.FC<FsFileProps> = (props) => {
    const userStore = useStores('userStore');

    const [progress, setProgress] = useState(0);
    const [download, setDownload] = useState(false);

    //process upload
    useEffect(() => {
        if (props.download) {
            return;
        }
        if (props.fileId != "") {
            setProgress(100);
            return;
        }
        const unListenFn = listen('uploadFile_' + props.itemId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
            }
            if (payload.cur_step >= payload.total_step) {
                setProgress(100);
            } else {
                setProgress(Math.floor((payload.cur_step * 100) / payload.total_step));
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, []);

    //process download
    useEffect(() => {
        if (!download) {
            return;
        }
        let opened = false;
        const unListenFn = listen('downloadFile_' + props.itemId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
            }
            if (payload.cur_step >= payload.total_step) {
                setProgress(100);
                get_cache_file(props.fsId, props.fileId, props.fileName).then((res) => {
                    if (res.exist_in_local) {
                        if (!opened) {
                            opened = true;
                            shell_open(res.local_dir);
                        }
                    }
                });
            } else {
                setProgress(Math.floor((payload.cur_step * 100) / payload.total_step));
            }
        });
        download_file(userStore.sessionId, props.fsId, props.fileId, props.itemId).then((res) => {
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

    return (
        <div className={style.fileUpload}
            style={{ cursor: props.download ? 'pointer' : "default" }}
            onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.download) {
                    setDownload(true);
                }
            }}>
            <FileIcon name={props.fileName} />

            <div className={style.name}>{props.fileName}</div>
            <div className={style.size}>{props.fileSize != 0 && <span>{getFileSizeStr(props.fileSize)}</span>}</div>
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
                <>
                    {props.onRemove !== undefined && (
                        <div
                            className={style.delete}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (props.onRemove !== undefined) {
                                    props.onRemove();
                                }
                            }}
                        >
                            <Deletesvg />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FsFile;