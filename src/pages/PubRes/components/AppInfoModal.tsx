import { Form, Modal, Descriptions, Space, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import type { AppInfo, InstallInfo } from "@/api/appstore";
import { get_install_info } from "@/api/appstore";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import AppPermPanel from "@/pages/Admin/AppAdmin/components/AppPermPanel";
import { ReadOnlyEditor } from "@/components/Editor";
import { add as add_user_app, set_user_app_perm, get_user_app_perm, query_in_store as query_user_app_in_store, remove as remove_user_app } from "@/api/user_app";
import { check_unpark, get_min_app_path, start as start_app } from '@/api/min_app';
import { get_cache_file } from '@/api/fs';
import DownloadProgressModal from "@/pages/Project/AppStore/components/DownloadProgressModal";
import { OPEN_TYPE_MIN_APP_IN_STORE, add as add_project_app, set_min_app_perm, query_in_store as query_project_app_in_store, remove as remove_project_app, get_min_app_perm, get_token_url } from "@/api/project_app";

interface AppInfoModalProps {
    appInfo: AppInfo;
    onCancel: () => void;
}

interface DownloadInfo {
    fsId: string;
    fileId: string;
    projectId: string;
    projectName: string;
}

const AppInfoModal: React.FC<AppInfoModalProps> = (props) => {
    const userStore = useStores("userStore");
    const appStore = useStores("appStore");

    const [installInfo, setInstallInfo] = useState<InstallInfo | null>(null);
    const [showDownload, setShowDownload] = useState<DownloadInfo | null>(null);

    const loadInstallInfo = async () => {
        const res = await request(get_install_info({
            session_id: userStore.sessionId,
            app_id: props.appInfo.app_id,
        }));
        setInstallInfo(res.install_info);
    };

    const installUserApp = async () => {
        const addRes = await request(add_user_app({
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
        if (installInfo != null) {
            setInstallInfo({ ...installInfo, user_install: true });
        }
    };


    const openUserApp = async (fsId: string, fileId: string) => {
        const queryRes = await request(query_user_app_in_store({
            session_id: userStore.sessionId,
            app_id_in_store: props.appInfo.app_id,
        }));
        if (queryRes.app_id_list.length == 0) {
            message.error("应用不存在");
            return;
        }
        const permRes = await request(get_user_app_perm({
            session_id: userStore.sessionId,
            app_id: queryRes.app_id_list[0],
        }));

        const path = await get_min_app_path(fsId, fileId);
        await start_app({
            project_id: "",
            project_name: "",
            member_user_id: userStore.userInfo.userId,
            member_display_name: userStore.userInfo.displayName,
            token_url: "",
            label: "minApp:" + queryRes.app_id_list[0],
            title: `${props.appInfo.base_info.app_name}(微应用)`,
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
        //检查文件是否已经下载
        const res = await get_cache_file(appStore.clientCfg?.app_store_fs_id ?? "", props.appInfo.file_id, "content.zip");
        if (res.exist_in_local == false) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: props.appInfo.file_id,
                projectId: "",
                projectName: "",
            });
            return;
        }
        //检查是否已经解压zip包
        const ok = await check_unpark(appStore.clientCfg?.app_store_fs_id ?? "", props.appInfo.file_id);
        if (!ok) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: props.appInfo.file_id,
                projectId: "",
                projectName: "",
            });
            return;
        }
        //打开微应用
        await openUserApp(appStore.clientCfg?.app_store_fs_id ?? "", props.appInfo.file_id);
    }

    const removeUserApp = async () => {
        const queryRes = await request(query_user_app_in_store({
            session_id: userStore.sessionId,
            app_id_in_store: props.appInfo.app_id,
        }));
        for (const appId of queryRes.app_id_list) {
            await request(remove_user_app({
                session_id: userStore.sessionId,
                app_id: appId,
            }));
        }
        if (installInfo != null) {
            setInstallInfo({ ...installInfo, user_install: false });
        }
    };

    const installProjectApp = async (projectId: string) => {
        const addRes = await request(add_project_app({
            session_id: userStore.sessionId,
            basic_info: {
                project_id: projectId,
                app_name: props.appInfo.base_info.app_name,
                app_icon_url: `fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${props.appInfo.base_info.icon_file_id}/x.png`,
                app_url: props.appInfo.app_id,
                app_open_type: OPEN_TYPE_MIN_APP_IN_STORE,
            },
        }));
        await request(set_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectId,
            app_id: addRes.app_id,
            perm: {
                net_perm: props.appInfo.app_perm.net_perm,
                member_perm: props.appInfo.app_perm.member_perm,
                issue_perm: props.appInfo.app_perm.issue_perm,
                event_perm: props.appInfo.app_perm.event_perm,
                fs_perm: props.appInfo.app_perm.fs_perm,
                extra_perm: props.appInfo.app_perm.extra_perm,
            },
        }));
        if (installInfo != null) {
            const tmpList = installInfo.project_list.slice();
            const index = tmpList.findIndex(item => item.project_id == projectId);
            if (index != -1) {
                tmpList[index].has_install = true;
                setInstallInfo({ ...installInfo, project_list: tmpList });
            }
        }
    }

    const removeProjectApp = async (projectId: string) => {
        const queryRes = await request(query_project_app_in_store({
            session_id: userStore.sessionId,
            project_id: projectId,
            app_id_in_store: props.appInfo.app_id,
        }));
        for (const appId of queryRes.app_id_list) {
            await request(remove_project_app({
                session_id: userStore.sessionId,
                project_id: projectId,
                app_id: appId,
            }));
        }
        if (installInfo != null) {
            const tmpList = installInfo.project_list.slice();
            const index = tmpList.findIndex(item => item.project_id == projectId);
            if (index != -1) {
                tmpList[index].has_install = false;
                setInstallInfo({ ...installInfo, project_list: tmpList });
            }
        }
    }

    const openProjectApp = async (projectId: string, projectName: string, fsId: string, fileId: string) => {
        const queryRes = await request(query_project_app_in_store({
            session_id: userStore.sessionId,
            project_id: projectId,
            app_id_in_store: props.appInfo.app_id,
        }));
        if (queryRes.app_id_list.length == 0) {
            message.error("应用不存在");
            return;
        }

        const permRes = await request(get_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectId,
            app_id: queryRes.app_id_list[0],
        }));
        const tokenRes = await request(
            get_token_url({
                session_id: userStore.sessionId,
                project_id: projectId,
                app_id: queryRes.app_id_list[0],
            }),
        );
        const path = await get_min_app_path(fsId, fileId);
        await start_app({
            project_id: projectId,
            project_name: projectName,
            member_user_id: userStore.userInfo.userId,
            member_display_name: userStore.userInfo.displayName,
            token_url: tokenRes.url,
            label: "minApp:" + queryRes.app_id_list[0],
            title: `${props.appInfo.base_info.app_name}(微应用)`,
            path: path,
        }, permRes.perm);
    };

    const preOpenProjectApp = async (projectId: string, projectName: string) => {
        //检查文件是否已经下载
        const res = await get_cache_file(appStore.clientCfg?.app_store_fs_id ?? "", props.appInfo.file_id, "content.zip");
        if (res.exist_in_local == false) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: props.appInfo.file_id,
                projectId: projectId,
                projectName: projectName,
            });
            return;
        }
        //检查是否已经解压zip包
        const ok = await check_unpark(appStore.clientCfg?.app_store_fs_id ?? "", props.appInfo.file_id);
        if (!ok) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: props.appInfo.file_id,
                projectId: projectId,
                projectName: projectName,
            });
            return;
        }
        //打开微应用
        await openProjectApp(projectId, projectName, appStore.clientCfg?.app_store_fs_id ?? "", props.appInfo.file_id);
    }

    useEffect(() => {
        loadInstallInfo();
    }, []);

    return (
        <>
            <Modal title={props.appInfo.base_info.app_name} open={showDownload == null} footer={null} onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }} bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                <Descriptions bordered>
                    <Descriptions.Item label="一级分类">{props.appInfo.major_cate.cate_name}</Descriptions.Item>
                    <Descriptions.Item label="二级分类">{props.appInfo.minor_cate.cate_name}</Descriptions.Item>
                    <Descriptions.Item label="三级分类">{props.appInfo.sub_minor_cate.cate_name}</Descriptions.Item>
                    <Descriptions.Item span={3} label="应用权限">
                        <AppPermPanel disable={true} showTitle={false} onChange={() => { }} perm={props.appInfo.app_perm} />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="应用描述">
                        <ReadOnlyEditor content={props.appInfo.base_info.app_desc} />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="操作">
                        {installInfo != null && (
                            <Form labelCol={{ span: 6 }}>
                                <Form.Item label="工作台">
                                    <Space size="large">
                                        {installInfo.user_install == true && (
                                            <>
                                                <Button type="link" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    preOpenUserApp();
                                                }}>打开应用</Button>
                                                <Button type="link" danger onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    removeUserApp();
                                                }}>删除应用</Button>
                                            </>
                                        )}
                                        {installInfo.user_install == false && (
                                            <Button type="link" disabled={!props.appInfo.user_app} onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                installUserApp();
                                            }}>安装应用</Button>
                                        )}
                                    </Space>
                                </Form.Item>
                                {installInfo.project_list.map(prj => (
                                    <Form.Item label={`${prj.project_name}`} key={prj.project_id}>
                                        <Space size="large">
                                            {prj.has_install == true && (
                                                <>
                                                    <Button type="link" onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        preOpenProjectApp(prj.project_id, prj.project_name);
                                                    }}>打开应用</Button>
                                                    <Button type="link" danger disabled={!prj.can_install} onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        removeProjectApp(prj.project_id);
                                                    }}>删除应用</Button>
                                                </>
                                            )}
                                            {prj.has_install == false && (
                                                <Button type="link" disabled={!(props.appInfo.project_app && prj.can_install)} onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    installProjectApp(prj.project_id);
                                                }}>安装应用</Button>
                                            )}
                                        </Space>
                                    </Form.Item>
                                ))}
                            </Form>
                        )}

                    </Descriptions.Item>
                </Descriptions>
            </Modal>
            {showDownload != null && (
                <DownloadProgressModal fsId={showDownload.fsId} fileId={showDownload.fileId}
                    onCancel={() => setShowDownload(null)}
                    onOk={() => {
                        setShowDownload(null);
                        if (showDownload.projectId == "") {
                            openUserApp(showDownload.fsId, showDownload.fileId);
                        } else {
                            openProjectApp(showDownload.projectId, showDownload.projectName, showDownload.fsId, showDownload.fileId);
                        }
                    }} />
            )}
        </>
    )
};


export default AppInfoModal;