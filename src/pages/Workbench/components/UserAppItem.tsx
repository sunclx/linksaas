import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { App as UserApp, UserAppPerm } from "@/api/user_app";
import { get_user_app_perm, remove as remove_app, set_user_app_perm } from "@/api/user_app";
import { Button, Card, Popover, Image, Modal, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { useStores } from "@/hooks";
import DownloadProgressModal from "@/pages/Project/AppStore/components/DownloadProgressModal";
import { get_cache_file } from '@/api/fs';
import { request } from "@/utils/request";
import { get_app as get_app_in_store } from '@/api/appstore';
import { check_unpark, get_min_app_path, start as start_app } from '@/api/min_app';
import UserAppPermPanel from "./UserAppPermPanel";

interface UserAppItemProps {
    appInfo: UserApp;
    onRemove: () => void;
}

interface DownloadInfo {
    fsId: string;
    fileId: string;
}

const UserAppItem: React.FC<UserAppItemProps> = (props) => {
    const appStore = useStores("appStore");
    const userStore = useStores('userStore');

    const [userAppPerm, setUserAppPerm] = useState<UserAppPerm | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showDownload, setShowDownload] = useState<DownloadInfo | null>(null);


    const getIconUrl = (fileId: string) => {
        if (fileId == "") {
            return "";
        }
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${fileId}`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${fileId}`;
        }
    };

    const loadUserAppPerm = async () => {
        const res = await request(get_user_app_perm({
            session_id: userStore.sessionId,
            app_id: props.appInfo.app_id,
        }));
        setUserAppPerm(res.perm);
    };

    const removeApp = async () => {
        await request(remove_app({
            session_id: userStore.sessionId,
            app_id: props.appInfo.app_id,
        }));
        setShowRemoveModal(false);
        message.info("删除应用成功");
        props.onRemove();
    }

    const updateUserAppPerm = async () => {
        if (userAppPerm == null) {
            return;
        }
        await request(set_user_app_perm({
            session_id: userStore.sessionId,
            app_id: props.appInfo.app_id,
            perm: userAppPerm,
        }));
        setUserAppPerm(null);
        message.info("修改权限成功");
    };

    const openUserApp = async (fsId: string, fileId: string) => {
        const permRes = await request(get_user_app_perm({
            session_id: userStore.sessionId,
            app_id: props.appInfo.app_id,
        }));

        const path = await get_min_app_path(fsId, fileId);
        await start_app({
            project_id: "",
            project_name: "",
            member_user_id: userStore.userInfo.userId,
            member_display_name: userStore.userInfo.displayName,
            token_url: "",
            label: "minApp:" + props.appInfo.app_id,
            title: `${props.appInfo.basic_info.app_name}(微应用)`,
            path: path,
        }, {
            net_perm: permRes.perm.net_perm,
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
            fs_perm: permRes.perm.fs_perm,
            extra_perm: permRes.perm.extra_perm,
        });
    };

    const preOpenUserApp = async () => {
        const appRes = await request(get_app_in_store({
            app_id: props.appInfo.basic_info.app_id_in_store,
        }));
        //检查文件是否已经下载
        const res = await get_cache_file(appStore.clientCfg?.app_store_fs_id ?? "", appRes.app_info.file_id, "content.zip");
        if (res.exist_in_local == false) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: appRes.app_info.file_id,
            });
            return;
        }
        //检查是否已经解压zip包
        const ok = await check_unpark(appStore.clientCfg?.app_store_fs_id ?? "", appRes.app_info.file_id);
        if (!ok) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: appRes.app_info.file_id,
            });
            return;
        }
        //打开微应用
        await openUserApp(appStore.clientCfg?.app_store_fs_id ?? "", appRes.app_info.file_id);
    }

    return (
        <Card title={props.appInfo.basic_info.app_name} bordered={false} extra={
            <Popover content={
                <div style={{ padding: "10px 10px" }}>
                    <div>
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            loadUserAppPerm();
                        }}>修改权限</Button>
                    </div>
                    <Button type="link" danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(true);
                    }}>删除</Button>
                </div>
            }
                trigger="click" placement="bottom">
                <MoreOutlined />
            </Popover>
        }>
            <Image
                style={{ width: "80px", cursor: "pointer" }}
                src={getIconUrl(props.appInfo.basic_info.icon_file_id)}
                alt={""}
                preview={false}
                fallback={defaultIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    preOpenUserApp();
                }}
            />
            {showDownload != null && (
                <DownloadProgressModal fsId={showDownload.fsId} fileId={showDownload.fileId}
                    onCancel={() => setShowDownload(null)}
                    onOk={() => {
                        setShowDownload(null);
                        openUserApp(showDownload.fsId, showDownload.fileId);
                    }} />
            )}
            {showRemoveModal == true && (
                <Modal open title="删除应用"
                    okButtonProps={{ danger: true }}
                    okText="删除应用"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeApp();
                    }}>
                    是否删除应用&nbsp;{props.appInfo.basic_info.app_name}&nbsp;?
                </Modal>
            )}
            {userAppPerm != null && (
                <Modal open
                    title="修改权限"
                    okText="修改权限"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUserAppPerm(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.stopPropagation();
                        updateUserAppPerm();
                    }}>
                    <UserAppPermPanel perm={userAppPerm}
                        onChange={newPerm => {
                            setUserAppPerm(newPerm);
                        }} />
                </Modal>
            )}
        </Card>
    );
};

export default observer(UserAppItem);