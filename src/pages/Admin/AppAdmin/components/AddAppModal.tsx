import { Form, Input, Modal, Button, Card, Progress, message, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import s from "./AddAppModal.module.less";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import SelectAppCate from "./SelectAppCate";
import { get_admin_session } from '@/api/admin_auth';
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { write_file, set_file_owner, FILE_OWNER_TYPE_APP_STORE, GLOBAL_APPSTORE_FS_ID } from "@/api/fs";
import { useStores } from "@/hooks";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useCommonEditor } from '@/components/Editor';
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import type { FsProgressEvent } from '@/api/fs';
import { add_app } from "@/api/appstore_admin";
import AppPermPanel from "./AppPermPanel";
import type { AppPerm } from "@/api/appstore";
import AsyncImage from "@/components/AsyncImage";
import { flushEditorContent } from "@/components/Editor/common";

interface AddAppModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const AddAppModal: React.FC<AddAppModalProps> = (props) => {
    const appStore = useStores('appStore');

    const [uploadId] = useState(uniqId());

    const [appName, setAppName] = useState("");
    const [curMajorCateId, setCurMajorCateId] = useState("");
    const [curMinorCateId, setCurMinorCateId] = useState("");
    const [curSubMinorCateId, setSubCurMinorCateId] = useState("");
    const [appPerm, setAppPerm] = useState<AppPerm>({
        net_perm: {
            cross_domain_http: false,
            proxy_redis: false,
            proxy_mysql: false,
            proxy_post_gres: false,
            proxy_mongo: false,
            proxy_ssh: false,
            net_util: false,
        },
        fs_perm: {
            read_file: false,
            write_file: false,
        },
        extra_perm: {
            cross_origin_isolated: false,
            open_browser: false,
        }
    });

    const [iconFileId, setIconFileId] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [srcUrl, setSrcUrl] = useState("");

    const [localPath, setLocalPath] = useState("");
    const [uploadRatio, setUploadRatio] = useState(0);
    const [osWindows, setOsWindows] = useState(false);
    const [osMac, setOsMac] = useState(false);
    const [osLinux, setOsLinux] = useState(false);

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: "",
        ownerType: 0,
        ownerId: "",
        projectId: "",
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: true,
        widgetInToolbar: false,
        showReminder: false,
    });

    const changeIcon = async () => {
        const selectd = await open_dialog({
            title: "更换应用图标",
            filters: [{
                name: "图标",
                extensions: ["ico", "png", "jpg", "jpeg"],
            }],
        });
        if (selectd == null || Array.isArray(selectd)) {
            return;
        } else {
            const sessionId = await get_admin_session();
            const res = await request(write_file(sessionId, GLOBAL_APPSTORE_FS_ID, selectd, ""));
            setIconFileId(res.file_id);
            if (appStore.isOsWindows) {
                setIconUrl(`https://fs.localhost/${GLOBAL_APPSTORE_FS_ID}/${res.file_id}/image`);
            } else {
                setIconUrl(`fs://localhost/${GLOBAL_APPSTORE_FS_ID}/${res.file_id}/image`);
            }
        }
    };

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

    const addApp = async () => {
        const appNameValue = appName.trim();
        if (appNameValue.length == 0) {
            message.error("请输入应用名称");
            return;
        }
        if (localPath == "") {
            message.error("请选择要上传的应用文件");
            return;
        }
        //上传文件
        const sessionId = await get_admin_session();
        const uploadRes = await request(write_file(sessionId, GLOBAL_APPSTORE_FS_ID, localPath, uploadId));
        //上传应用信息
        await flushEditorContent();
        const content = editorRef.current?.getContent() ?? { type: 'doc' };
        const addRes = await request(add_app({
            admin_session_id: sessionId,
            base_info: {
                app_name: appNameValue,
                app_desc: JSON.stringify(content),
                icon_file_id: iconFileId,
                src_url: srcUrl.startsWith("https://") ? srcUrl : "",
            },
            major_cate_id: curMajorCateId,
            minor_cate_id: curMinorCateId,
            sub_minor_cate_id: curSubMinorCateId,
            app_perm: appPerm,
            file_id: uploadRes.file_id,
            os_windows: osWindows,
            os_mac: osMac,
            os_linux: osLinux,
            user_app: true,
        }));
        //设置文件owner
        if (iconFileId != "") {
            await request(set_file_owner({
                session_id: sessionId,
                fs_id: GLOBAL_APPSTORE_FS_ID,
                file_id: iconFileId,
                owner_type: FILE_OWNER_TYPE_APP_STORE,
                owner_id: addRes.app_id,
            }));
        }
        await request(set_file_owner({
            session_id: sessionId,
            fs_id: GLOBAL_APPSTORE_FS_ID,
            file_id: uploadRes.file_id,
            owner_type: FILE_OWNER_TYPE_APP_STORE,
            owner_id: addRes.app_id,
        }));
        props.onOk();
    }


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
        <Modal open title="增加应用"
            width={720}
            bodyStyle={{ height: "calc(100vh - 250px)", overflow: "scroll" }}
            okText="增加"
            okButtonProps={{ disabled: (appName.trim().length == 0 || localPath.trim().length == 0) }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addApp();
            }}>
            <div className={s.head}>
                <div className={s.left}>
                    <AsyncImage style={{ width: "80px", cursor: "pointer" }}
                        src={iconUrl}
                        preview={false}
                        fallback={defaultIcon}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            changeIcon();
                        }}
                        useRawImg={false}
                    />
                </div>
                <div className={s.right}>
                    <Form labelCol={{ span: 5 }}>
                        <Form.Item label="应用名称">
                            <Input value={appName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setAppName(e.target.value);
                            }} />
                        </Form.Item>
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
                        <Form.Item label="源代码地址">
                            <Input value={srcUrl} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSrcUrl(e.target.value.trim());
                            }} />
                        </Form.Item>
                        <Form.Item label="发布系统">
                            <Checkbox checked={osWindows} onChange={e => {
                                e.stopPropagation();
                                setOsWindows(e.target.checked);
                            }}>windows</Checkbox>
                            <Checkbox checked={osMac} onChange={e => {
                                e.stopPropagation();
                                setOsMac(e.target.checked);
                            }}>mac</Checkbox>
                            <Checkbox checked={osLinux} onChange={e => {
                                e.stopPropagation();
                                setOsLinux(e.target.checked);
                            }}>linux</Checkbox>
                        </Form.Item>
                    </Form>
                    <SelectAppCate
                        onChange={(majorCateId: string, minorCateId: string, subMinorCateId: string) => {
                            setCurMajorCateId(majorCateId);
                            setCurMinorCateId(minorCateId);
                            setSubCurMinorCateId(subMinorCateId);
                        }} />
                </div>
            </div>
            <AppPermPanel disable={false} showTitle onChange={(perm: AppPerm) => setAppPerm(perm)} />
            <Card title={<h2 style={{ fontSize: "14px", fontWeight: 800 }}>应用描述</h2>} bordered={false}>
                <div className="_projectEditContext">
                    {editor}
                </div>
            </Card>

        </Modal>
    );
};

export default observer(AddAppModal);