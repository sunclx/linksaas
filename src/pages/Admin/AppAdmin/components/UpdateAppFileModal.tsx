import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { Form, Input, Modal, Progress, message } from "antd";
import Button from "@/components/Button";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { write_file, set_file_owner, FILE_OWNER_TYPE_APP_STORE, GLOBAL_APPSTORE_FS_ID } from "@/api/fs";
import { request } from "@/utils/request";
import { get_admin_session } from '@/api/admin_auth';
import { update_app_file } from "@/api/appstore_admin";


interface UpdateAppFileModalProps {
    appId: string;
    onCancel: () => void;
    onOk: () => void;
}

const UpdateAppFileModal: React.FC<UpdateAppFileModalProps> = (props) => {
    const appStore = useStores('appStore');
    const [uploadId] = useState(uniqId());
    const [localPath, setLocalPath] = useState("");
    const [uploadRatio, setUploadRatio] = useState(0);

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "本地应用",
            filters: [{
                name: "应用文件",
                extensions: ["zip", "lma"],
            }],
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalPath(selected);
    };

    const updateAppFile = async () => {
        if (localPath == "") {
            message.error("请选择要上传的应用文件");
            return;
        }
        const sessionId = await get_admin_session();
        const uploadRes = await request(write_file(sessionId, GLOBAL_APPSTORE_FS_ID, localPath, uploadId));

        await request(set_file_owner({
            session_id: sessionId,
            fs_id: GLOBAL_APPSTORE_FS_ID,
            file_id: uploadRes.file_id,
            owner_type: FILE_OWNER_TYPE_APP_STORE,
            owner_id: props.appId,
        }));

        await request(update_app_file({
            admin_session_id: sessionId,
            app_id: props.appId,
            file_id: uploadRes.file_id,
        }));
        props.onOk();
    };

    useEffect(() => {
        const unListenFn = listen('uploadFile_' + uploadId, (ev) => {
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
    }, []);

    return (
        <Modal open title="更新应用文件"
            okText="更新"
            okButtonProps={{ disabled: (localPath == "" || uploadRatio > 0) }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateAppFile();
            }}>
            <Form>
                <Form.Item label="应用文件" help={
                    <>
                        {uploadRatio > 0 && (<Progress percent={uploadRatio} />)}
                    </>
                }>
                    <Input value={localPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLocalPath(e.target.value);
                    }}
                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePath();
                        }} />} />
                </Form.Item>
            </Form>
        </Modal>
    );

};

export default observer(UpdateAppFileModal);