import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Button, Form, Input, Modal, Radio, message } from "antd";
import type { APP_OPEN_TYPE } from '@/api/project_app';
import { OPEN_TYPE_BROWSER, OPEN_TYPE_MIN_APP, add as add_app, set_min_app_perm } from '@/api/project_app';
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MinAppPerm } from "@/api/project_app";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import MinAppPermPanel from "./MinAppPermPanel";
import UploadProgressModal from "./UploadProgressModal";
import { request } from '@/utils/request';
import { useStores } from "@/hooks";
import { set_file_owner, FILE_OWNER_TYPE_MIN_APP } from "@/api/fs";


interface AddAppModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const AddAppModal: React.FC<AddAppModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [showUpload, setShowUpload] = useState(false);

    const [appName, setAppName] = useState("");
    const [openType, setOpenType] = useState<APP_OPEN_TYPE>(OPEN_TYPE_BROWSER);
    const [webUrl, setWebUrl] = useState("");
    const [localPath, setLocalPath] = useState("");
    const [minAppPerm, setMinAppPerm] = useState<MinAppPerm>({
        net_perm: {
            cross_domain_http: false,
            proxy_redis: false,
            proxy_mysql: false,
            proxy_mongo: false,
            proxy_ssh: false,
        },
        member_perm: {
            list_member: false,
            list_goal_history: false,
        },
        issue_perm: {
            list_my_task: false,
            list_all_task: false,
            list_my_bug: false,
            list_all_bug: false,
        },
        event_perm: {
            list_my_event: false,
            list_all_event: false,
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

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "打开本地应用目录",
            directory: true,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalPath(selected);
    };

    const addWebApp = async () => {
        if (!webUrl.startsWith("https://")) {
            message.error("网站地址必须以https://开头");
            return;
        }
        const url = new URL(webUrl);
        const logoUrl = `${url.protocol}//${url.host}/favicon.ico`;
        await request(
            add_app({
                session_id: userStore.sessionId,
                basic_info: {
                    project_id: projectStore.curProjectId,
                    app_name: appName,
                    app_icon_url: logoUrl,
                    app_url: webUrl,
                    app_open_type: OPEN_TYPE_BROWSER,
                },
            }),
        );
        message.info("添加应用成功");
        props.onOk();
    }

    const addMinApp = async (fileId: string) => {
        const res = await request(
            add_app({
                session_id: userStore.sessionId,
                basic_info: {
                    project_id: projectStore.curProjectId,
                    app_name: appName,
                    app_icon_url: "",
                    app_url: fileId,
                    app_open_type: OPEN_TYPE_MIN_APP,
                },
            }),
        );
        //设置权限
        await request(set_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            app_id: res.app_id,
            perm: minAppPerm,
        }));
        //调整文件owner
        await request(set_file_owner({
            session_id: userStore.sessionId,
            fs_id: projectStore.curProject?.min_app_fs_id ?? "",
            file_id: fileId,
            owner_type: FILE_OWNER_TYPE_MIN_APP,
            owner_id: res.app_id,
        }));
        message.info("添加应用成功");
        props.onOk();
    };

    const addApp = async () => {
        const tmpAppName = appName.trim()
        if (tmpAppName.length < 2 || tmpAppName.length > 6) {
            message.error("只支持2-6个字符作为应用名称");
            return;
        }
        if (openType == OPEN_TYPE_BROWSER) {
            addWebApp();
        } else if (openType == OPEN_TYPE_MIN_APP) {
            setShowUpload(true);
        }
    };

    return (
        <div>
            <Modal open={!showUpload} title="增加应用" onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }} onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addApp();
            }}>
                <Form labelCol={{ span: 4 }}>
                    <Form.Item label="启动方式">
                        <Radio.Group value={openType} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpenType(e.target.value!);
                        }}>
                            <Radio value={OPEN_TYPE_BROWSER}>浏览器</Radio>
                            <Radio value={OPEN_TYPE_MIN_APP}>微应用</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="应用名称" help={
                        <>
                            {(appName.length == 1 || appName.length > 6) && (
                                <span style={{ color: "red" }}>请输入2-6个字符作为应用名称</span>
                            )}
                        </>
                    }>
                        <Input value={appName} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setAppName(e.target.value);
                        }} />
                    </Form.Item>
                    {openType == OPEN_TYPE_BROWSER && (
                        <Form.Item label="网站地址" help={
                            <>
                                {webUrl.startsWith("https://".substring(0, webUrl.length)) == false && (
                                    <span style={{ color: "red" }}>网站地址必须以https://开头</span>
                                )}
                            </>
                        }>
                            <Input value={webUrl} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setWebUrl(e.target.value);
                            }} />
                        </Form.Item>
                    )}
                    {openType == OPEN_TYPE_MIN_APP && (
                        <Form.Item label="本地路径">
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
                    )}
                </Form>
                {openType == OPEN_TYPE_MIN_APP && (
                    <MinAppPermPanel disable={false} onChange={perm => setMinAppPerm(perm)} showTitle />
                )}
            </Modal>
            {showUpload == true && (
                <UploadProgressModal localPath={localPath} onCancel={() => setShowUpload(false)} onOk={(fileId) => {
                    addMinApp(fileId);
                }} />
            )}
        </div>
    );
};

export default observer(AddAppModal);