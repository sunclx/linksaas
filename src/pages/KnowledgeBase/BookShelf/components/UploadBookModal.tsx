import { Modal, Progress } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import type {FsProgressEvent } from '@/api/fs';
import { useStores } from "@/hooks";
import { write_file,set_file_owner,FILE_OWNER_TYPE_PROJECT_EBOOK } from '@/api/fs';
import { add_book } from '@/api/project_book_shelf';


interface UploadBookModalProps {
    filePath: string;
    title: string;
    onOk: () => void;
    onErr: (errMsg: string) => void;
}

const UploadBookModal: React.FC<UploadBookModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [progress, setProgress] = useState(0);
    const [trackId] = useState(uniqId());

    const uploadFile = async () => {
        try {
            //上传文件
            const uploadRes = await write_file(userStore.sessionId, projectStore.curProject?.ebook_fs_id ?? "", props.filePath, trackId);
            if (uploadRes.code != 0) {
                props.onErr(uploadRes.err_msg);
                return;
            }
            //增加书籍
            const addRes = await add_book({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                book_title: props.title,
                book_desc: "",
                file_id: uploadRes.file_id,
            });
            console.log(addRes);
            if(addRes.code != 0){
                props.onErr(addRes.err_msg);
                return;
            }
            //设置文件owner
            const setRes = await set_file_owner({
                session_id: userStore.sessionId,
                fs_id: projectStore.curProject?.ebook_fs_id ?? "",
                file_id: uploadRes.file_id,
                owner_type: FILE_OWNER_TYPE_PROJECT_EBOOK,
                owner_id: addRes.book_id,
            });
            console.log(setRes);
            if(setRes.code != 0){
                props.onErr(setRes.err_msg);
                return ;
            }
            props.onOk();
        } catch (e) {
            console.log(e);
            props.onErr(`${e}`);
        }
    };

    useEffect(() => {
        const unListenFn = listen('uploadFile_' + trackId, (ev) => {
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

    useEffect(() => {
        uploadFile();
    }, []);

    return (
        <Modal
            title={`上传 ${props.title}`}
            footer={null}
            closable={false}
            open>
            <Progress percent={progress} />
        </Modal>
    );
}

export default observer(UploadBookModal);