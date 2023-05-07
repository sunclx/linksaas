import React, { useEffect, useState } from "react";
import type { CateInfo, TocValue } from "@/api/bookstore";
import type { AdminPermInfo } from '@/api/admin_auth';
import { Button, Form, Input, Modal, Progress, Select } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { useStores } from "@/hooks";
import { get_admin_session } from '@/api/admin_auth';
import { request } from "@/utils/request";
import { write_file, set_file_owner, FILE_OWNER_TYPE_BOOK_STORE, write_file_base64 } from "@/api/fs";
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { add_book, set_book_extra } from "@/api/bookstore_admin";
import Epub from 'epubjs';
import type { NavItem } from 'epubjs';
import { readBinaryFile } from '@tauri-apps/api/fs';

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
    const [inAdd, setInAdd] = useState(false);

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

    const convertToc = (resultList: TocValue[], itemList: NavItem[], lv: number) => {
        for (const item of itemList) {
            resultList.push({
                level: lv,
                value: item.label.trim(),
            });
            if (item.subitems !== undefined) {
                convertToc(resultList, item.subitems, lv + 1);
            }
        }
    }

    const addBook = async () => {
        if (cateId == "" || localPath == "") {
            return;
        }
        setInAdd(true);
        setTimeout(() => setInAdd(false), 10000);
        const data = await readBinaryFile(localPath);
        const book = Epub(data.buffer);
        await book.ready;
        const meta = await book.loaded.metadata;
        const coverUrl = await book.loaded.cover;
        const title = meta.title == "" ? "未知名称" : meta.title;

        //加载toc
        const tocList: TocValue[] = [];
        convertToc(tocList, book.navigation.toc, 0);

        //上传文件
        const sessionId = await get_admin_session();
        let coverFileId = "";
        if ((coverUrl ?? "") != "") {
            let base64Data = await book.archive.getBase64(coverUrl);
            const index = base64Data.indexOf("base64,");
            if (index != -1) {
                base64Data = base64Data.substring(index + "base64,".length);
            }
            const coverRes = await request(write_file_base64(sessionId, appStore.clientCfg?.book_store_fs_id ?? "", "cover.png", base64Data, ""));
            coverFileId = coverRes.file_id;
        }
        const uploadRes = await request(write_file(sessionId, appStore.clientCfg?.book_store_fs_id ?? "", localPath, uploadId));
        //上传书本信息
        const addRes = await request(add_book({
            admin_session_id: sessionId,
            book_title: title,
            cate_id: cateId,
            file_id: uploadRes.file_id,
            cover_file_id: coverFileId,
        }));
        //设置额外信息
        await request(set_book_extra({
            admin_session_id: sessionId,
            book_id: addRes.book_id,
            desc: "",
            toc_list: tocList,
        }));
        //设置文件owner
        if (coverFileId != "") {
            await request(set_file_owner({
                session_id: sessionId,
                fs_id: appStore.clientCfg?.book_store_fs_id ?? "",
                file_id: coverFileId,
                owner_type: FILE_OWNER_TYPE_BOOK_STORE,
                owner_id: addRes.book_id,
            }));
        }
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
            okButtonProps={{ disabled: !(localPath != "" && cateId != "") || inAdd }}
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