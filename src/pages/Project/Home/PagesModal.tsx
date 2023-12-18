import { Descriptions, Modal, Progress, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { download_file, get_cache_file } from '@/api/fs';
import { check_unpark, get_min_app_path, unpack_min_app } from '@/api/min_app';
import { start as start_pages } from "@/api/pages";

export interface PagesModalProps {
    entryId: string;
    entryTitle: string;
    fileId: string;
    onClose: () => void;
}

type STEP = number;
const STEP_UNSTART: STEP = 1;
const STEP_DOWNLOAD: STEP = 2;
const STEP_UNPACK: STEP = 3;
const STEP_FINISH: STEP = 4;

const PagesModal = (props: PagesModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [step, setStep] = useState(STEP_UNSTART);
    const [curUnPackFile, setCurUnPackFile] = useState("");
    const [downloadRatio, setDownloadRatio] = useState(0);

    const runDownload = async (trackId: string) => {
        const fsId = projectStore.curProject?.pages_fs_id ?? "";
        try {
            const res = await get_cache_file(fsId, props.fileId, "content.zip");
            if (res.exist_in_local) {
                setStep(STEP_UNPACK);
                setDownloadRatio(100);
                return;
            }
            setStep(STEP_DOWNLOAD);
            await download_file(userStore.sessionId,
                fsId,
                props.fileId, trackId, "content.zip");
        } catch (e) {
            console.log(e);
            props.onClose();
            message.error("下载文件失败");
        }
    };

    const runUnpack = async (traceName: string) => {
        const fsId = projectStore.curProject?.pages_fs_id ?? "";
        const ok = await check_unpark(fsId, props.fileId);
        const path = await get_min_app_path(fsId, props.fileId);

        const label = "pages:" + props.entryId;
        if (ok) {
            setStep(STEP_FINISH);
            props.onClose();
            await start_pages(label, props.entryTitle, path);
            return;
        }
        try {
            await unpack_min_app(fsId, props.fileId, traceName);
            setStep(STEP_FINISH);
            props.onClose();
            await start_pages(label, props.entryTitle, path);
        } catch (e) {
            console.log(e);
            props.onClose();
            message.error("无法解开压缩包");
        }
    };

    useEffect(() => {
        const trackId = uniqId();
        runDownload(trackId);
        const unListenFn = listen('downloadFile_' + trackId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
            }
            setDownloadRatio(Math.floor(payload.cur_step * 100) / payload.total_step);
            if (payload.cur_step >= payload.total_step) {
                setDownloadRatio(100);
                setStep(STEP_UNPACK);
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, []);

    useEffect(() => {
        if (step != STEP_UNPACK) {
            return;
        }
        const traceName = "downloadMinApp_" + uniqId();
        runUnpack(traceName);
        const unListenFn = listen(traceName, (ev) => {
            const payload = ev.payload as string;
            setCurUnPackFile(payload);
        })
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, [step]);

    return (
        <Modal open footer={null}
            title="准备静态网页数据"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Descriptions bordered>
                <Descriptions.Item label="下载进度" span={2}>
                    <Progress percent={downloadRatio} showInfo={false} />
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                    <span>
                        {step == STEP_UNSTART && "未开始"}
                        {step == STEP_DOWNLOAD && "进行中"}
                        {step >= STEP_UNPACK && "完成"}
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="解包文件" span={2}>
                    <div style={{ width: "200px", height: "50px" }}>
                        {curUnPackFile}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                    <span>
                        {step <= STEP_DOWNLOAD && "未开始"}
                        {step == STEP_UNPACK && "进行中"}
                        {step == STEP_FINISH && "完成"}
                    </span>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default observer(PagesModal);