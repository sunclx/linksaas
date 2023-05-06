import React, { useEffect, useState } from "react";
import type { CateInfo } from "@/api/bookstore";
import type { AdminPermInfo } from '@/api/admin_auth';
import { Button, Form, Input, Modal, Progress, Select } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import { parse_book_title } from "@/api/project_book_shelf";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { useStores } from "@/hooks";
import { get_admin_session } from '@/api/admin_auth';
import { request } from "@/utils/request";
import { write_file, set_file_owner, FILE_OWNER_TYPE_BOOK_STORE } from "@/api/fs";
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { add_book } from "@/api/bookstore_admin";

interface AddBookModalProps {
    cateList: CateInfo[];
    permInfo: AdminPermInfo | null;
    onCancel: () => void;
    onAdd: (cateId: string) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = (props) => {
    const appStore = useStores('appStore');

    const [uploadId] = useState(uniqId());

    const [uploadRatio, setUploadRatio] = useState(0);
    const [localPath, setLocalPath] = useState("");
    const [cateId, setCateId] = useState("");

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "epub书籍",
            filters: [{
                name: "epub书籍",
                extensions: ["epub"],
            }],
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalPath(selected);
    };

    const addBook = async () => {
        if (cateId == "" || localPath == "") {
            return;
        }
        const title = await parse_book_title(localPath);
        //上传文件
        const sessionId = await get_admin_session();
        const uploadRes = await request(write_file(sessionId, appStore.clientCfg?.book_store_fs_id ?? "", localPath, uploadId));
        //上传书本信息
        const addRes = await request(add_book({
            admin_session_id: sessionId,
            book_title: title,
            cate_id: cateId,
            file_id: uploadRes.file_id,
        }));
        //设置文件owner
        await request(set_file_owner({
            session_id: sessionId,
            fs_id: appStore.clientCfg?.book_store_fs_id ?? "",
            file_id: uploadRes.file_id,
            owner_type: FILE_OWNER_TYPE_BOOK_STORE,
            owner_id: addRes.book_id,
        }));
        props.onAdd(cateId);
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
        <Modal open title="增加书籍"
            okText="增加"
            okButtonProps={{ disabled: !(localPath != "" && cateId != "") }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addBook();
            }}>
            <Form>
                <Form.Item label="书籍文件" help={
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
                <Form.Item label="书籍类别">
                    <Select value={cateId} onChange={value => setCateId(value)}>
                        {props.cateList.map(cate => (
                            <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );

};

export default AddBookModal;