import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { download_file, get_cache_file } from '@/api/fs';
import { Descriptions, Modal, Progress, message } from "antd";
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { open as shell_open } from '@tauri-apps/api/shell';

export interface FileModalProps {
    fileId: string;
    fileName: string;
    onClose: () => void;
}

const FileModal = (props: FileModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [downloadRatio, setDownloadRatio] = useState(0);

    const runDownload = async (trackId: string) => {
        const fsId = projectStore.curProject?.file_fs_id ?? "";
        try {
            const res = await get_cache_file(fsId, props.fileId, props.fileName);
            if (res.exist_in_local) {
                setDownloadRatio(100);
                shell_open(res.local_dir);
                props.onClose();
                return;
            }
            await download_file(userStore.sessionId,
                fsId,
                props.fileId, trackId, props.fileName);
        } catch (e) {
            console.log(e);
            props.onClose();
            message.error("下载文件失败");
        }
    };

    useEffect(() => {
        const trackId = uniqId();
        let hasOpen = false;
        runDownload(trackId);
        const unListenFn = listen('downloadFile_' + trackId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
            }
            setDownloadRatio(Math.floor(payload.cur_step * 100) / payload.total_step);
            if (payload.cur_step >= payload.total_step) {
                get_cache_file(projectStore.curProject?.file_fs_id ?? "", props.fileId, props.fileName).then(res => {
                    if (res.exist_in_local) {
                        setDownloadRatio(100);
                        if (!hasOpen) {
                            shell_open(res.local_dir);
                            hasOpen = true;
                            props.onClose();
                        }

                        return;
                    }
                });
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, []);

    return (
        <Modal open footer={null} title="下载文件"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Descriptions bordered column={1} labelStyle={{ width: "100px" }}>
                <Descriptions.Item label="文件名">
                    {props.fileName}
                </Descriptions.Item>
                <Descriptions.Item label="下载进度">
                    <Progress percent={downloadRatio} showInfo={false} />
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default observer(FileModal);
