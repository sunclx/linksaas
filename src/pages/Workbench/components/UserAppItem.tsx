import React, { useState } from "react";
import { observer } from 'mobx-react';
import { remove as remove_app } from "@/api/user_app";
import { Button, Card, Popover, Modal, message, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { useStores } from "@/hooks";
import { GLOBAL_APPSTORE_FS_ID, get_cache_file } from '@/api/fs';
import { request } from "@/utils/request";
import { get_app as get_app_in_store } from '@/api/appstore';
import { check_unpark, get_min_app_path, start as start_app } from '@/api/min_app';
import StoreStatusModal from "@/components/MinApp/StoreStatusModal";
import AsyncImage from "@/components/AsyncImage";
import DownloadProgressModal from "@/components/MinApp/DownloadProgressModal";
import type { AppInfo } from "@/api/appstore";

interface UserAppItemProps {
    appInfo: AppInfo;
    onRemove: () => void;
}

interface DownloadInfo {
    fsId: string;
    fileId: string;
}

const UserAppItem: React.FC<UserAppItemProps> = (props) => {
    const appStore = useStores("appStore");
    const userStore = useStores('userStore');

    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showDownload, setShowDownload] = useState<DownloadInfo | null>(null);
    const [showStoreStatusModal, setShowStoreStatusModal] = useState(false);

    const getIconUrl = (fileId: string) => {
        if (fileId == "") {
            return "";
        }
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${GLOBAL_APPSTORE_FS_ID}/${fileId}`;
        } else {
            return `fs://localhost/${GLOBAL_APPSTORE_FS_ID}/${fileId}`;
        }
    };

    const removeApp = async () => {
        await remove_app(props.appInfo.app_id);
        setShowRemoveModal(false);
        message.info("卸载应用成功");
        props.onRemove();
    }

    const openUserApp = async (fsId: string, fileId: string) => {
        const path = await get_min_app_path(fsId, fileId);
        await start_app({
            project_id: "",
            project_name: "",
            member_user_id: userStore.userInfo.userId,
            member_display_name: userStore.userInfo.displayName,
            token_url: "",
            label: "minApp:" + props.appInfo.app_id,
            title: `${props.appInfo.base_info.app_name}(微应用)`,
            path: path,
        }, props.appInfo.app_perm);
    };

    const preOpenUserApp = async () => {
        const appRes = await request(get_app_in_store({
            app_id: props.appInfo.app_id,
            session_id: userStore.sessionId,
        }));
        //检查文件是否已经下载
        const res = await get_cache_file(GLOBAL_APPSTORE_FS_ID, appRes.app_info.file_id, "content.zip");
        if (res.exist_in_local == false) {
            setShowDownload({
                fsId: GLOBAL_APPSTORE_FS_ID,
                fileId: appRes.app_info.file_id,
            });
            return;
        }
        //检查是否已经解压zip包
        const ok = await check_unpark(GLOBAL_APPSTORE_FS_ID, appRes.app_info.file_id);
        if (!ok) {
            setShowDownload({
                fsId: GLOBAL_APPSTORE_FS_ID,
                fileId: appRes.app_info.file_id,
            });
            return;
        }
        //打开微应用
        await openUserApp(GLOBAL_APPSTORE_FS_ID, appRes.app_info.file_id);
    }

    return (
        <Card title={props.appInfo.base_info.app_name} bordered={false} extra={
            <Popover content={
                <Space direction="vertical" style={{ padding: "10px 10px" }}>
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowStoreStatusModal(true);
                    }}>存储统计</Button>
                    <Button type="link" danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(true);
                    }}>卸载</Button>
                </Space>
            }
                trigger="click" placement="bottom">
                <MoreOutlined />
            </Popover>
        }>
            <AsyncImage
                style={{ width: "80px", cursor: "pointer" }}
                src={getIconUrl(props.appInfo.base_info.icon_file_id)}
                preview={false}
                fallback={defaultIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    preOpenUserApp();
                }}
                useRawImg={false}
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
                <Modal open title="卸载应用"
                    okButtonProps={{ danger: true }}
                    okText="卸载应用"
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
                    是否卸载应用&nbsp;{props.appInfo.base_info.app_name}&nbsp;?
                </Modal>
            )}
            {showStoreStatusModal == true && (
                <StoreStatusModal minAppId={props.appInfo.app_id} onCancel={() => { setShowStoreStatusModal(false) }} />
            )}
        </Card>
    );
};

export default observer(UserAppItem);