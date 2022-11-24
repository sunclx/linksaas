import { Modal, Progress } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { uniqId } from "@/utils/utils";
import { useStores } from "@/hooks";
import { download_file, get_cache_file } from '@/api/fs';
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';


interface DownloadBookModalProps {
    title: string;
    fileId: string;
    onOk: (localPath: string) => void;
    onErr: (errMsg: string) => void;
}

const DownloadBookModal: React.FC<DownloadBookModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [progress, setProgress] = useState(0);
    const [trackId] = useState(uniqId());

    const downloadBook = async () => {
        try {
            const res = await download_file(userStore.sessionId, projectStore.curProject?.ebook_fs_id ?? "", props.fileId, trackId, "book.epub");
            if (res.exist_in_local) {
                setProgress(100);
                props.onOk(res.local_path);
            }
        } catch (e) {
            props.onErr(`${e}`);
        }
    };

    useEffect(() => {
        const unListenFn = listen('uploadFile_' + trackId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
            }
            if (payload.cur_step >= payload.total_step && payload.file_id != '') {
                setProgress(100);
                setTimeout(()=>{
                    get_cache_file(projectStore.curProject?.ebook_fs_id ?? "",props.fileId,"book.epub").then(res=>{
                        if(res.exist_in_local){
                            props.onOk(res.local_path);
                        }
                    })
                },200);
            } else {
                console.log(Math.floor((payload.cur_step * 100) / payload.total_step));
                setProgress(Math.floor((payload.cur_step * 100) / payload.total_step));
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, []);

    useEffect(() => {
        downloadBook();
    }, []);

    return (
        <Modal
            title={`下载 ${props.title}`}
            footer={null}
            closable={false}
            open>
            <Progress percent={progress} />
        </Modal>
    );
};

export default observer(DownloadBookModal);