import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Descriptions, Modal, Progress, message } from "antd";
import { listen } from '@tauri-apps/api/event';
import { pack_min_app } from '@/api/min_app';
import { uniqId } from "@/utils/utils";
import type { FsProgressEvent } from '@/api/fs';
import { write_file } from '@/api/fs';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";

interface UploadProgressModalProps {
    localPath: string;
    onCancel: () => void;
    onOk: (fileId: string) => void;
}

type STEP = number;
const STEP_UNSTART: STEP = 1;
const STEP_PACK: STEP = 2;
const STEP_UPLOAD: STEP = 3;
const STEP_FINISH: STEP = 4;


const UploadProgressModal: React.FC<UploadProgressModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [step, setStep] = useState(STEP_UNSTART);
    const [curPackFile, setCurPackFile] = useState("");
    const [packResultFile, setPackResultFile] = useState("");
    const [uploadRatio, setUploadRatio] = useState(0);

    const runPack = async (traceName: string) => {
        setStep(STEP_PACK);
        try {
            const fileName = await pack_min_app(props.localPath, traceName);
            setPackResultFile(fileName);
            setStep(STEP_UPLOAD);
        } catch (e) {
            console.log(e);
            message.error("打包出现错误");
            props.onCancel();
        }
    };

    const runUpload = async (trackId: string) => {
        console.log(projectStore.curProject?.min_app_fs_id ?? "", packResultFile, trackId);
        try {
            const res = await request(
                write_file(userStore.sessionId, projectStore.curProject?.min_app_fs_id ?? "",
                    packResultFile, trackId));
            setStep(STEP_FINISH);
            props.onOk(res.file_id);
        } catch (e) {
            console.log(e);
            message.error("上传文件出现错误");
            props.onCancel();
        }
    }

    useEffect(() => {
        if (props.localPath == "") {
            message.error("未选择本地目录");
            props.onCancel();
            return;
        }
        const traceName = "uploadMinApp_" + uniqId();
        runPack(traceName);
        const unListenFn = listen(traceName, (ev) => {
            const payload = ev.payload as string;
            setCurPackFile(payload);
        })
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, []);

    useEffect(() => {
        if (packResultFile == "") {
            return;
        }
        const trackId = uniqId();
        runUpload(trackId);
        const unListenFn = listen('uploadFile_' + trackId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
              }
            if (payload.cur_step >= payload.total_step) {
                setUploadRatio(100);
            } else {
                setUploadRatio(Math.floor((payload.cur_step * 100) / payload.total_step));
            }
        })
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, [packResultFile])

    return (
        <Modal open title="上传进度"
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Descriptions bordered>
                <Descriptions.Item label="打包文件" span={2}>
                    <div style={{ width: "200px", height: "50px" }}>
                        {curPackFile}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                    <span>
                        {step == STEP_UNSTART && "未开始"}
                        {step == STEP_PACK && "进行中"}
                        {step >= STEP_UPLOAD && "完成"}
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="上传进度" span={2}>
                    <Progress percent={uploadRatio} showInfo={false} />
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                    <span>
                        {step <= STEP_PACK && "未开始"}
                        {step == STEP_UPLOAD && "进行中"}
                        {step == STEP_FINISH && "完成"}
                    </span>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default observer(UploadProgressModal);