import { Modal, Form, Input, Card, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { BaseAppInfo } from "@/api/appstore";
import s from "./AddAppModal.module.less";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { useStores } from "@/hooks";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { get_admin_session } from '@/api/admin_auth';
import { write_file, set_file_owner, FILE_OWNER_TYPE_APP_STORE } from "@/api/fs";
import { request } from "@/utils/request";
import { useCommonEditor } from "@/components/Editor";
import { update_app } from "@/api/appstore_admin";
import AsyncImage from "@/components/AsyncImage";

interface UpdateAppBaseInfoModalProps {
    appId: string;
    baseInfo: BaseAppInfo;
    onCancel: () => void;
    onOk: () => void;
}

const UpdateAppBaseInfoModal: React.FC<UpdateAppBaseInfoModalProps> = (props) => {
    const appStore = useStores('appStore');

    const [iconFileId, setIconFileId] = useState(props.baseInfo.icon_file_id);
    const [iconUrl, setIconUrl] = useState("");
    const [appName, setAppName] = useState(props.baseInfo.app_name);
    const [srcUrl, setSrcUrl] = useState(props.baseInfo.src_url);

    const { editor, editorRef } = useCommonEditor({
        content: props.baseInfo.app_desc,
        fsId: "",
        ownerType: 0,
        ownerId: "",
        historyInToolbar: false,
        clipboardInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
    });

    const changeIcon = async () => {
        const selectd = await open_dialog({
            title: "更好应用图标",
            filters: [{
                name: "图标",
                extensions: ["ico", "png", "jpg", "jpeg"],
            }],
        });
        if (selectd == null || Array.isArray(selectd)) {
            return;
        } else {
            const sessionId = await get_admin_session();
            const res = await request(write_file(sessionId, appStore.clientCfg?.app_store_fs_id ?? "", selectd, ""));
            setIconFileId(res.file_id);
            if (appStore.isOsWindows) {
                setIconUrl(`https://fs.localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${res.file_id}/x.png`);
            } else {
                setIconUrl(`fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${res.file_id}/x.png`);
            }
        }
    };

    const updateBaseInfo = async () => {
        const appNameValue = appName.trim();
        if (appNameValue.length == 0) {
            message.error("请输入应用名称");
            return;
        }
        const sessionId = await get_admin_session();
        if (iconFileId != "" && iconFileId != props.baseInfo.icon_file_id) {
            await request(set_file_owner({
                session_id: sessionId,
                fs_id: appStore.clientCfg?.app_store_fs_id ?? "",
                file_id: iconFileId,
                owner_type: FILE_OWNER_TYPE_APP_STORE,
                owner_id: props.appId,
            }));
        }
        const content = editorRef.current?.getContent() ?? { type: 'doc' };
        await request(update_app({
            admin_session_id: sessionId,
            app_id: props.appId,
            base_info: {
                app_name: appNameValue,
                app_desc: JSON.stringify(content),
                icon_file_id: iconFileId,
                src_url: srcUrl.startsWith("https://") ? srcUrl : props.baseInfo.src_url,
            },
        }));
        props.onOk();
    };

    useEffect(() => {
        if (props.baseInfo.icon_file_id != "") {
            if (appStore.isOsWindows) {
                setIconUrl(`https://fs.localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${props.baseInfo.icon_file_id}/x.png`);
            } else {
                setIconUrl(`fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${props.baseInfo.icon_file_id}/x.png`);
            }
        }
    }, []);

    return (
        <Modal open title="修改应用信息"
            okText="修改"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateBaseInfo();
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
                    <Form labelCol={{ span: 8 }}>
                        <Form.Item label="应用名称">
                            <Input value={appName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setAppName(e.target.value);
                            }} />
                        </Form.Item>
                        <Form.Item label="源代码地址">
                            <Input value={srcUrl} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSrcUrl(e.target.value);
                            }} />
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <Card title={<h2 style={{ fontSize: "14px", fontWeight: 800 }}>应用描述</h2>} bordered={false}>
                <div className="_projectEditContext">
                    {editor}
                </div>
            </Card>
        </Modal>
    );
};

export default observer(UpdateAppBaseInfoModal);