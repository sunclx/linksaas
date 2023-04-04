import React, { useEffect, useState } from "react";
import type { AppInfo } from "@/api/appstore";
import { observer } from 'mobx-react';
import { Card, Descriptions, Image, Modal, message } from "antd";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { useStores } from "@/hooks";
import { ReadOnlyEditor } from '@/components/Editor';
import AppPermPanel from "@/pages/Admin/AppAdmin/components/AppPermPanel";
import { OPEN_TYPE_MIN_APP_IN_STORE, add as add_app_to_project, set_min_app_perm } from "@/api/project_app";
import { request } from "@/utils/request";
import { add as add_app_to_user, set_user_app_perm } from "@/api/user_app";

interface AppStoreItemProps {
    appInfo: AppInfo;
    onAddApp: () => void;
}

const AppStoreItem: React.FC<AppStoreItemProps> = (props) => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");
    const appStore = useStores("appStore");

    const [iconUrl, setIconUrl] = useState("");
    const [showDetailModal, setShowDetailModal] = useState(false);

    const addAppToProject = async () => {
        const addRes = await request(add_app_to_project({
            session_id: userStore.sessionId,
            basic_info: {
                project_id: projectStore.curProjectId,
                app_name: props.appInfo.base_info.app_name,
                app_icon_url: iconUrl,
                app_url: props.appInfo.app_id,
                app_open_type: OPEN_TYPE_MIN_APP_IN_STORE,
            },
        }));
        const appPerm = props.appInfo.app_perm;
        await request(set_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            app_id: addRes.app_id,
            perm: {
                ...appPerm,
            },
        }));
        setShowDetailModal(false);
        props.onAddApp();
        message.info(`添加应用${props.appInfo.base_info.app_name}成功`);
    };

    const addAppToUser = async () => {
        const addRes = await request(add_app_to_user({
            session_id: userStore.sessionId,
            basic_info: {
                app_name: props.appInfo.base_info.app_name,
                icon_file_id: props.appInfo.base_info.icon_file_id,
                app_id_in_store: props.appInfo.app_id,
            },
        }));
        await request(set_user_app_perm({
            session_id: userStore.sessionId,
            app_id: addRes.app_id,
            perm: {
                net_perm: props.appInfo.app_perm.net_perm,
                fs_perm: props.appInfo.app_perm.fs_perm,
                extra_perm: props.appInfo.app_perm.extra_perm,
            },
        }));
        setShowDetailModal(false);
        props.onAddApp();
        message.info(`添加应用${props.appInfo.base_info.app_name}成功`);
    };

    useEffect(() => {
        if (props.appInfo.base_info.icon_file_id != "") {
            if (appStore.isOsWindows) {
                setIconUrl(`https://fs.localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${props.appInfo.base_info.icon_file_id}/x.png`);
            } else {
                setIconUrl(`fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${props.appInfo.base_info.icon_file_id}/x.png`);
            }
        }
    }, []);

    return (
        <Card title={props.appInfo.base_info.app_name} bordered={false}>
            <Image
                style={{ width: "80px", cursor: "pointer" }}
                src={iconUrl}
                alt={""}
                preview={false}
                fallback={defaultIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowDetailModal(true);
                }}
            />
            {showDetailModal == true && (
                <Modal open title={`应用 ${props.appInfo.base_info.app_name} 详情`}
                    width={700}
                    okText="添加到项目应用"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowDetailModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (projectStore.curProjectId != "") {
                            addAppToProject();
                        } else {
                            addAppToUser();
                        }
                    }}>
                    <Descriptions bordered>
                        <Descriptions.Item label="一级分类">{props.appInfo.major_cate.cate_name}</Descriptions.Item>
                        <Descriptions.Item label="二级分类">{props.appInfo.minor_cate.cate_name}</Descriptions.Item>
                        <Descriptions.Item label="三级分类">{props.appInfo.sub_minor_cate.cate_name}</Descriptions.Item>
                        <Descriptions.Item label="应用权限" span={3}>
                            <AppPermPanel disable showTitle={false} perm={props.appInfo.app_perm} onChange={() => { }} />
                        </Descriptions.Item>
                        <Descriptions.Item label="应用描述" span={3}><ReadOnlyEditor content={props.appInfo.base_info.app_desc} /></Descriptions.Item>
                    </Descriptions>
                </Modal>
            )}
        </Card>
    );
}

export default observer(AppStoreItem);