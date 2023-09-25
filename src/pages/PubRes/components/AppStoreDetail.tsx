import React, { useEffect, useState } from "react";
import type { AppInfo, InstallInfo, AppComment } from "@/api/appstore";
import { agree_app, cancel_agree_app, get_app, get_install_info, list_comment, add_comment, remove_comment } from "@/api/appstore";
import { Button, Card, Descriptions, Input, List, Modal, Popover, Space, message } from "antd";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { CommentOutlined, DownloadOutlined, HeartTwoTone, LeftOutlined, MoreOutlined } from "@ant-design/icons";
import AppPermPanel from "@/pages/Admin/AppAdmin/components/AppPermPanel";
import { ReadOnlyEditor } from "@/components/Editor";
import { get_cache_file } from '@/api/fs';
import { check_unpark, get_min_app_path, start as start_app } from '@/api/min_app';
import { add as add_user_app, set_user_app_perm, get_user_app_perm, query_in_store as query_user_app_in_store, remove as remove_user_app } from "@/api/user_app";
import { OPEN_TYPE_MIN_APP_IN_STORE, add as add_project_app, set_min_app_perm, query_in_store as query_project_app_in_store, remove as remove_project_app, get_min_app_perm, get_token_url } from "@/api/project_app";
import DownloadProgressModal from "@/pages/Project/AppStore/components/DownloadProgressModal";
import { open as open_shell } from '@tauri-apps/api/shell';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";
import { useHistory } from "react-router-dom";

const PAGE_SIZE = 10;

interface DownloadInfo {
    fsId: string;
    fileId: string;
    projectId: string;
    projectName: string;
}

const AppStoreDetail = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const appStore = useStores("appStore");
    const projectStore = useStores("projectStore");
    const pubResStore = useStores('pubResStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
    const [installInfo, setInstallInfo] = useState<InstallInfo | null>(null);
    const [showDownload, setShowDownload] = useState<DownloadInfo | null>(null);
    const [commentContent, setCommentContent] = useState("");

    const [commentList, setCommentList] = useState<AppComment[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [removeCommentInfo, setRemoveCommentInfo] = useState<AppComment | null>(null);

    const loadAppInfo = async () => {
        const res = await request(get_app({
            app_id: pubResStore.showAppId,
            session_id: userStore.sessionId,
        }));
        setAppInfo(res.app_info);
    };

    const loadInstallInfo = async () => {
        const res = await request(get_install_info({
            session_id: userStore.sessionId,
            app_id: pubResStore.showAppId,
        }));
        setInstallInfo(res.install_info);
    };

    const loadCommentList = async () => {
        const res = await request(list_comment({
            app_id: pubResStore.showAppId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));

        setTotalCount(res.total_count);
        setCommentList(res.comment_list);
    };

    const addComment = async () => {
        if (commentContent.trim() == "") {
            return;
        }
        await request(add_comment({
            session_id: userStore.sessionId,
            app_id: pubResStore.showAppId,
            comment: commentContent,
        }));
        message.info("增加评论成功");
        setCommentContent("");
        if (curPage == 0) {
            await loadCommentList();
        } else {
            setCurPage(0);
        }
    };

    const removeComment = async () => {
        if (removeCommentInfo == null) {
            return;
        }
        await request(remove_comment({
            session_id: userStore.sessionId,
            app_id: pubResStore.showAppId,
            comment_id: removeCommentInfo.comment_id,
        }));
        message.info("删除评论成功");
        setRemoveCommentInfo(null);
        if (curPage == 0) {
            await loadCommentList();
        } else {
            setCurPage(0);
        }
    };

    const installUserApp = async () => {
        if (appInfo == null) {
            return;
        }
        const addRes = await request(add_user_app({
            session_id: userStore.sessionId,
            basic_info: {
                app_name: appInfo?.base_info.app_name ?? "",
                icon_file_id: appInfo?.base_info.icon_file_id ?? "",
                app_id_in_store: appInfo?.app_id ?? "",
            },
        }));
        await request(set_user_app_perm({
            session_id: userStore.sessionId,
            app_id: addRes.app_id,
            perm: {
                net_perm: appInfo.app_perm.net_perm,
                fs_perm: appInfo.app_perm.fs_perm,
                extra_perm: appInfo.app_perm.extra_perm,
            },
        }));
        if (installInfo != null) {
            setInstallInfo({ ...installInfo, user_install: true });
        }
        setAppInfo({ ...appInfo, install_count: appInfo.install_count + 1 });
    };

    const openUserApp = async (fsId: string, fileId: string) => {
        const queryRes = await request(query_user_app_in_store({
            session_id: userStore.sessionId,
            app_id_in_store: appInfo?.app_id ?? "",
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
            title: `${appInfo?.base_info.app_name ?? ""}(微应用)`,
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
        const res = await get_cache_file(appStore.clientCfg?.app_store_fs_id ?? "", appInfo?.file_id ?? "", "content.zip");
        if (res.exist_in_local == false) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: appInfo?.file_id ?? "",
                projectId: "",
                projectName: "",
            });
            return;
        }
        //检查是否已经解压zip包
        const ok = await check_unpark(appStore.clientCfg?.app_store_fs_id ?? "", appInfo?.file_id ?? "");
        if (!ok) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: appInfo?.file_id ?? "",
                projectId: "",
                projectName: "",
            });
            return;
        }
        //打开微应用
        await openUserApp(appStore.clientCfg?.app_store_fs_id ?? "", appInfo?.file_id ?? "");
    }

    const removeUserApp = async () => {
        const queryRes = await request(query_user_app_in_store({
            session_id: userStore.sessionId,
            app_id_in_store: appInfo?.app_id ?? "",
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
        if (appInfo == null) {
            return;
        }
        const addRes = await request(add_project_app({
            session_id: userStore.sessionId,
            basic_info: {
                project_id: projectId,
                app_name: appInfo.base_info.app_name,
                app_icon_url: `fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${appInfo.base_info.icon_file_id}/x.png`,
                app_url: appInfo.app_id,
                app_open_type: OPEN_TYPE_MIN_APP_IN_STORE,
            },
        }));
        await request(set_min_app_perm({
            session_id: userStore.sessionId,
            project_id: projectId,
            app_id: addRes.app_id,
            perm: {
                net_perm: appInfo.app_perm.net_perm,
                member_perm: appInfo.app_perm.member_perm,
                issue_perm: appInfo.app_perm.issue_perm,
                event_perm: appInfo.app_perm.event_perm,
                fs_perm: appInfo.app_perm.fs_perm,
                extra_perm: appInfo.app_perm.extra_perm,
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
        if (appInfo == null) {
            return;
        }
        const queryRes = await request(query_project_app_in_store({
            session_id: userStore.sessionId,
            project_id: projectId,
            app_id_in_store: appInfo.app_id,
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
        if (appInfo == null) {
            return;
        }
        const queryRes = await request(query_project_app_in_store({
            session_id: userStore.sessionId,
            project_id: projectId,
            app_id_in_store: appInfo.app_id,
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
            title: `${appInfo.base_info.app_name}(微应用)`,
            path: path,
        }, permRes.perm);
    };

    const preOpenProjectApp = async (projectId: string, projectName: string) => {
        if (appInfo == null) {
            return;
        }
        //检查文件是否已经下载
        const res = await get_cache_file(appStore.clientCfg?.app_store_fs_id ?? "", appInfo.file_id, "content.zip");
        if (res.exist_in_local == false) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: appInfo.file_id,
                projectId: projectId,
                projectName: projectName,
            });
            return;
        }
        //检查是否已经解压zip包
        const ok = await check_unpark(appStore.clientCfg?.app_store_fs_id ?? "", appInfo.file_id);
        if (!ok) {
            setShowDownload({
                fsId: appStore.clientCfg?.app_store_fs_id ?? "",
                fileId: appInfo.file_id,
                projectId: projectId,
                projectName: projectName,
            });
            return;
        }
        //打开微应用
        await openProjectApp(projectId, projectName, appStore.clientCfg?.app_store_fs_id ?? "", appInfo.file_id);
    };

    const agreeApp = async (appId: string, newAgree: boolean) => {
        if (appInfo == null) {
            return;
        }
        if (newAgree) {
            await request(agree_app({
                session_id: userStore.sessionId,
                app_id: appId,
            }));
        } else {
            await request(cancel_agree_app({
                session_id: userStore.sessionId,
                app_id: appId,
            }));
        }
        let newAgreeCount = appInfo.agree_count;
        if (newAgree) {
            newAgreeCount = appInfo.agree_count + 1;
        } else {
            if (appInfo.agree_count > 0) {
                newAgreeCount = appInfo.agree_count - 1;
            }
        }

        setAppInfo({ ...appInfo, agree_count: newAgreeCount, my_agree: newAgree });
    };

    useEffect(() => {
        loadAppInfo();
        loadInstallInfo();
        if (curPage != 0) {
            setCurPage(0);
        } else {
            loadCommentList();
        }
    }, [pubResStore.showAppId]);


    return (
        <Card title={
            <Space>
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        pubResStore.showAppId = "";
                    }}><LeftOutlined style={{ fontSize: "16px" }} /></Button>
                <h2>{appInfo?.base_info.app_name ?? ""}</h2>
            </Space>
        } bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <>
                    {appInfo != null && (
                        <Space style={{ fontSize: "18px" }} size="middle">
                            <div><DownloadOutlined />&nbsp;{appInfo.install_count}</div>
                            <div><CommentOutlined />&nbsp;{totalCount}</div>
                            <div style={{ width: "20px" }} />
                            <div onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                agreeApp(appInfo.app_id, !appInfo.my_agree);
                            }}>
                                <a>
                                    <HeartTwoTone twoToneColor={appInfo.my_agree ? ["red", "red"] : ["#e4e4e8", "#e4e4e8"]} />
                                </a>
                                &nbsp;{appInfo.agree_count}
                            </div>
                        </Space>

                    )}

                </>
            }>
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>安装情况</h2>
            {installInfo != null && appInfo != null && (
                <div style={{ display: "flex", marginBottom: "10px", flexWrap: "wrap" }}>
                    <Card title={<Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            history.push("/app/workbench?tab=userApp&userAction=true");
                        }}>工作台</Button>} style={{ width: "200px", marginRight: "10px", marginBottom: "10px" }} extra={
                            <>
                                {installInfo.user_install && (
                                    <Popover trigger="click" placement="bottom" content={
                                        <div style={{ padding: "10px 10px" }}>
                                            <Button type="link" danger onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                removeUserApp();
                                            }}>删除应用</Button>
                                        </div>
                                    }>
                                        <MoreOutlined />
                                    </Popover>
                                )}
                            </>
                        }>
                        {installInfo.user_install == true && (
                            <Button type="default" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                preOpenUserApp();
                            }}>打开应用</Button>
                        )}
                        {installInfo.user_install == false && (
                            <Button type="primary" disabled={!appInfo.user_app} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                installUserApp();
                            }}>安装应用</Button>
                        )}
                    </Card>
                    {installInfo.project_list.filter(prj => prj.can_install).map(prj => (
                        <Card key={prj.project_id} title={<Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                projectStore.setCurProjectId(prj.project_id).then(() => {
                                    linkAuxStore.goToAppList(history);
                                });
                            }}>项目:{prj.project_name}</Button>} style={{ width: "200px", marginRight: "10px", marginBottom: "10px" }}
                            extra={
                                <>
                                    {prj.has_install == true && (
                                        <Popover trigger="click" placement="bottom" content={
                                            <div style={{ padding: "10px 10px" }}>
                                                <Button type="link" danger disabled={!prj.can_install} onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    removeProjectApp(prj.project_id);
                                                }}>删除应用</Button>
                                            </div>
                                        }>
                                            <MoreOutlined />
                                        </Popover>
                                    )}
                                </>
                            }>
                            {prj.has_install == true && (
                                <Button type="default" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    preOpenProjectApp(prj.project_id, prj.project_name);
                                }}>打开应用</Button>
                            )}
                            {prj.has_install == false && (
                                <Button type="primary" disabled={!(appInfo.project_app && prj.can_install)} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    installProjectApp(prj.project_id);
                                }}>安装应用</Button>
                            )}
                        </Card>
                    ))}
                </div>
            )}
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>应用信息</h2>
            {appInfo != null && (
                <Descriptions bordered>
                    <Descriptions.Item label="一级分类">{appInfo.major_cate.cate_name}</Descriptions.Item>
                    <Descriptions.Item label="二级分类">{appInfo.minor_cate.cate_name}</Descriptions.Item>
                    <Descriptions.Item label="三级分类">{appInfo.sub_minor_cate.cate_name}</Descriptions.Item>
                    <Descriptions.Item span={3} label="应用描述">
                        <ReadOnlyEditor content={appInfo.base_info.app_desc} />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="应用权限">
                        <AppPermPanel disable={true} showTitle={false} onChange={() => { }} perm={appInfo.app_perm} />
                    </Descriptions.Item>
                    {appInfo.base_info.src_url !== "" && (
                        <Descriptions.Item label="源代码">
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                open_shell(appInfo?.base_info.src_url ?? "");
                            }}>{appInfo.base_info.src_url}</a>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            )}
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginTop: "10px" }}>评论列表</h2>
            <div>
                <Input.TextArea
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    value={commentContent}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCommentContent(e.target.value);
                    }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" style={{ margin: "10px 10px" }} disabled={commentContent.trim() == ""}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addComment();
                    }}>发送</Button>
            </div>
            <List rowKey="comment_id" dataSource={commentList} renderItem={item => (
                <List.Item>
                    <Card style={{ width: "100%" }} bordered={false} title={
                        <Space>
                            <UserPhoto logoUri={item.create_logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                            <span>{item.create_display_name}</span>
                            <span>{moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>
                        </Space>
                    } extra={
                        <>
                            {item.create_user_id == userStore.userInfo.userId && (
                                <Button type="link" danger onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setRemoveCommentInfo(item);
                                }}>删除</Button>
                            )}
                        </>
                    }>
                        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{item.comment}</pre>
                    </Card>
                </List.Item>
            )} pagination={{ current: curPage + 1, pageSize: PAGE_SIZE, total: totalCount, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
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
            {removeCommentInfo != null && (
                <Modal open title="删除评论"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveCommentInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeComment();
                    }}>
                    是否删除评论？
                </Modal>
            )}
        </Card>
    );
};

export default observer(AppStoreDetail);