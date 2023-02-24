import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { App as AppInfo, MinAppPerm } from '@/api/project_app';
import {
    OPEN_TYPE_BROWSER,
    OPEN_TYPE_MIN_APP,
    OPEN_TYPE_MIN_APP_IN_STORE,
    get_min_app_perm, set_min_app_perm, remove as remove_app, get_token_url
} from '@/api/project_app';
import { Button, Card, Image, Modal, Popover, message } from "antd";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { MoreOutlined } from "@ant-design/icons";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import MinAppPermPanel from "./MinAppPermPanel";
import { open as open_shell } from '@tauri-apps/api/shell';
import { get_cache_file } from '@/api/fs';
import DownloadProgressModal from "./DownloadProgressModal";
import { check_unpark, get_min_app_path, start as start_app } from '@/api/min_app';
import { get_app } from '@/api/appstore';

interface AppItemProps {
    appInfo: AppInfo;
    onRemove: () => void;
}

interface DownloadInfo {
    fsId: string;
    fileId: string;
}

const AppItem: React.FC<AppItemProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const appStore = useStores('appStore');

    const [minAppPerm, setMinAppPerm] = useState<MinAppPerm | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showDownload, setShowDownload] = useState<DownloadInfo | null>(null);

    const loadMinAppPerm = async () => {
        const res = await request(get_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            app_id: props.appInfo.app_id,
        }));
        setMinAppPerm(res.perm);
    };

    const updateAppPerm = async () => {
        if (minAppPerm == null) {
            return;
        }
        await request(set_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            app_id: props.appInfo.app_id,
            perm: minAppPerm,
        }));
        setMinAppPerm(null);
        message.info("修改权限成功");
    }

    const removeApp = async () => {
        await request(remove_app({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            app_id: props.appInfo.app_id,
        }));
        setShowRemoveModal(false);
        message.info("删除应用成功");
        props.onRemove();
    }

    const openWebApp = async () => {
        const tokenRes = await request(
            get_token_url({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                app_id: props.appInfo.app_id,
            }),
        );
        const url = new URL(props.appInfo.basic_info.app_url);
        url.searchParams.append('_tokenurl', tokenRes.url);
        await open_shell(url.toString());
    }

    const openMinApp = async (fsId: string, fileId: string) => {
        const permRes = await request(get_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            app_id: props.appInfo.app_id,
        }));
        const tokenRes = await request(
            get_token_url({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                app_id: props.appInfo.app_id,
            }),
        );
        const path = await get_min_app_path(fsId, fileId);
        await start_app({
            project_id: projectStore.curProjectId,
            project_name: projectStore.curProject?.basic_info.project_name ?? "",
            member_user_id: userStore.userInfo.userId,
            member_display_name: userStore.userInfo.displayName,
            token_url: tokenRes.url,
            label: "minApp:" + props.appInfo.app_id,
            title: `${props.appInfo.basic_info.app_name}(微应用)`,
            path: path,
        }, permRes.perm);
    };

    const preOpenMinApp = async () => {
        //检查文件是否已经下载
        const res = await get_cache_file(projectStore.curProject?.min_app_fs_id ?? "", props.appInfo.basic_info.app_url, "content.zip");
        if (res.exist_in_local == false) {
            setShowDownload({
                fsId: projectStore.curProject?.min_app_fs_id ?? "",
                fileId: props.appInfo.basic_info.app_url,
            });
            return;
        }
        //检查是否已经解压zip包
        const ok = await check_unpark(projectStore.curProject?.min_app_fs_id ?? "", props.appInfo.basic_info.app_url);
        if (!ok) {
            setShowDownload({
                fsId: projectStore.curProject?.min_app_fs_id ?? "",
                fileId: props.appInfo.basic_info.app_url,
            });
            return;
        }
        //打开微应用
        await openMinApp(projectStore.curProject?.min_app_fs_id ?? "", props.appInfo.basic_info.app_url);
    }

    const preOpenMinAppInStore = async () => {
        const appRes = await request(get_app({
            app_id: props.appInfo.basic_info.app_url,
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
        await openMinApp(appStore.clientCfg?.app_store_fs_id ?? "", appRes.app_info.file_id);
    };

    const adjustUrl = (url: string) => {
        if (appStore.isOsWindows) {
            return url.replace("lcalhost","localhost").replace("fs://localhost/", "https://fs.localhost/");
        } else {
            return url.replace("lcalhost","localhost").replace("https://fs.localhost/", "fs://localhost/");
        }
    }

    return (
        <Card title={props.appInfo.basic_info.app_name} bordered={false} extra={
            <Popover content={
                <div style={{ padding: "10px 10px" }}>
                    {props.appInfo.basic_info.app_open_type == OPEN_TYPE_MIN_APP && (
                        <div>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                loadMinAppPerm();
                            }}>{`${projectStore.isAdmin ? "修改权限" : "查看权限"}`}</Button>
                        </div>
                    )}
                    {projectStore.isAdmin && (
                        <Button type="link" danger onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowRemoveModal(true);
                        }}>删除</Button>
                    )}
                </div>
            }
                trigger="click" placement="bottom">
                <MoreOutlined />
            </Popover>
        }>
            <Image
                style={{ width: "80px", cursor: "pointer" }}
                src={adjustUrl(props.appInfo.basic_info.app_icon_url)}
                alt={""}
                preview={false}
                fallback={defaultIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.appInfo.basic_info.app_open_type == OPEN_TYPE_BROWSER) {
                        openWebApp();
                    } else if (props.appInfo.basic_info.app_open_type == OPEN_TYPE_MIN_APP) {
                        preOpenMinApp();
                    } else if (props.appInfo.basic_info.app_open_type == OPEN_TYPE_MIN_APP_IN_STORE) {
                        preOpenMinAppInStore();
                    }
                }}
            />
            {minAppPerm != null && (
                <Modal open
                    title={`${projectStore.isAdmin ? "修改权限" : "查看权限"}`}
                    okText={`${projectStore.isAdmin ? "修改权限" : "确定"}`}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setMinAppPerm(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.stopPropagation();
                        updateAppPerm();
                    }}>
                    <MinAppPermPanel perm={minAppPerm} disable={!projectStore.isAdmin}
                        showTitle={false}
                        onChange={newPerm => {
                            setMinAppPerm(newPerm);
                        }} />
                </Modal>
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
            {showDownload != null && (
                <DownloadProgressModal fsId={showDownload.fsId} fileId={showDownload.fileId}
                    onCancel={() => setShowDownload(null)}
                    onOk={() => {
                        setShowDownload(null);
                        openMinApp(showDownload.fsId, showDownload.fileId);
                    }} />
            )}
        </Card>
    );
};

export default observer(AppItem);