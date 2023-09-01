import { useStores } from "@/hooks";
import React, { useEffect, useState } from "react";
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import style from '@/components/Editor/extensions/common.module.less';
import { Progress } from "antd";
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import AsyncImage from "../AsyncImage";


interface FsImageProps {
    itemId: string;
    fsId: string;
    thumbFileId: string;
    fileId: string;
    fileName: string;
    preview: boolean;
    onRemove?: () => void;
}

const FsImage: React.FC<FsImageProps> = (props) => {
    const appStore = useStores('appStore');

    const [progress, setProgress] = useState(0);
    const [thumbUrl, setThumbUrl] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        if (props.thumbFileId != "" && props.fileId != "") {
            setProgress(100);
            if (appStore.isOsWindows) {
                setThumbUrl(`https://fs.localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`);
                setImgUrl(`https://fs.localhost/${props.fsId}/${props.fileId}/${props.fileName}`);
            } else {
                setThumbUrl(`fs://localhost/${props.fsId}/${props.thumbFileId}/${props.fileName}`);
                setImgUrl(`fs://localhost/${props.fsId}/${props.fileId}/${props.fileName}`);
            }
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
    }, [props.thumbFileId, props.fileId]);

    return (
        <div className={style.imgUpload}
            style={{ cursor: props.preview ? 'pointer' : "default" }}>
            <div className={style.img}>
                {imgUrl != "" && thumbUrl != "" && (
                    <>
                        {props.preview == true && <AsyncImage
                            preview={{
                                src: imgUrl,
                                mask: false,
                                wrapStyle: {
                                    margin: "60px 60px 60px 60px"
                                },
                            }}
                            src={thumbUrl}
                            useRawImg={false}
                        />}
                        {props.preview == false && <AsyncImage src={thumbUrl} preview={false} useRawImg={false}/>}
                    </>
                )}
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

export default FsImage;