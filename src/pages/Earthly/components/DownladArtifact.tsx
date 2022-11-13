import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Progress } from 'antd';
import { download_file, get_cache_file } from '@/api/fs';
import { uniqId } from '@/utils/utils';
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { open as shell_open } from '@tauri-apps/api/shell';
import { useStores } from "@/hooks";


interface DownladArtifactProps {
    fileId: string;
    fileName: string;
}

const DownladArtifact: React.FC<DownladArtifactProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

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
                get_cache_file(projectStore.curProject?.artifact_fs_id ?? "", props.fileId, props.fileName).then((res) => {
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
        download_file(userStore.sessionId, projectStore.curProject?.artifact_fs_id ?? "", props.fileId, trackId).then((res) => {
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
        <div>
            <a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setDownload(true);
            }}>{props.fileName}</a>
            {download && progress < 100 && <Progress percent={Math.ceil(progress)} size="small" />}
        </div>
    );
};

export default observer(DownladArtifact);