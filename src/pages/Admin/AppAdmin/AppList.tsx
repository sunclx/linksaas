import Button from "@/components/Button";
import { Card, Space, Table, Modal } from "antd";
import React, { useEffect, useState } from "react";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { request } from "@/utils/request";
import SelectAppCate from "./components/SelectAppCate";
import AddAppModal from "./components/AddAppModal";
import type { AppInfo } from "@/api/appstore";
import { SORT_KEY_UPDATE_TIME, list_app } from "@/api/appstore";
import type { ColumnsType } from 'antd/es/table';
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import Pagination from "@/components/Pagination";
import moment from 'moment';
import UpdateAppBaseInfoModal from "./components/UpdateAppBaseInfoModal";
import { EditOutlined } from "@ant-design/icons";
import UpdateAppFileModal from "./components/UpdateAppFileModal";
import UpdateAppOsModal from "./components/UpdateAppOsModal";
import UpdateAppScopeModal from "./components/UpdateAppScopeModal";
import { remove_app } from "@/api/appstore_admin";
import SelectAppCateModal from "./components/SelectAppCateModal";
import UpdateAppPermModal from "./components/UpdateAppPermModal";
import AsyncImage from "@/components/AsyncImage";
import CommentListModal from "./components/CommentListModal";

const PAGE_SIZE = 10;

const AppList = () => {
    const appStore = useStores('appStore');

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [curMajorCateId, setCurMajorCateId] = useState("");
    const [curMinorCateId, setCurMinorCateId] = useState("");
    const [curSubMinorCateId, setSubCurMinorCateId] = useState("");

    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [appList, setAppList] = useState<AppInfo[]>([]);

    const [showUpdateBaseInfo, setShowUpdateBaseInfo] = useState<AppInfo | null>(null);
    const [showUpdateFile, setShowUpdateFile] = useState<AppInfo | null>(null);
    const [showMoveAppInfo, setShowMoveAppInfo] = useState<AppInfo | null>(null);
    const [showUpdateAppOs, setShowUpdateAppOs] = useState<AppInfo | null>(null);
    const [showUpdateAppScope, setShowUpdateAppScope] = useState<AppInfo | null>(null);
    const [showRemoveApp, setShowRemoveApp] = useState<AppInfo | null>(null);
    const [showUpdatePerm, setShowUpdatePerm] = useState<AppInfo | null>(null);
    const [showCommentAppInfo, setShowCommentAppInfo] = useState<AppInfo | null>(null);

    const loadAppList = async () => {
        const res = await request(list_app({
            list_param: {
                filter_by_major_cate_id: curMajorCateId != "",
                major_cate_id: curMajorCateId,
                filter_by_minor_cate_id: curMinorCateId != "",
                minor_cate_id: curMinorCateId,
                filter_by_sub_minor_cate_id: curSubMinorCateId != "",
                sub_minor_cate_id: curSubMinorCateId,
                filter_by_app_scope: false,
                app_scope: 0,
                filter_by_os_scope: false,
                os_scope: 0,
                filter_by_keyword: false,
                keyword: "",
            },
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            sort_key: SORT_KEY_UPDATE_TIME,
            session_id: ""
        }));
        setTotalCount(res.total_count);
        setAppList(res.app_info_list);
    };

    const removeApp = async () => {
        if (showRemoveApp == null) {
            return;
        }
        const sessionId = await get_admin_session();
        await request(remove_app({
            admin_session_id: sessionId,
            app_id: showRemoveApp.app_id,
        }));
        setShowRemoveApp(null);
        if (curPage == 0) {
            loadAppList();
        } else {
            setCurPage(0);
        }
    };

    const columns: ColumnsType<AppInfo> = [
        {
            title: "应用",
            render: (_, row: AppInfo) => {
                let iconUrl = "";
                if (row.base_info.icon_file_id != "") {
                    if (appStore.isOsWindows) {
                        iconUrl = `https://fs.localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${row.base_info.icon_file_id}/x.png`;
                    } else {
                        iconUrl = `fs://localhost/${appStore.clientCfg?.app_store_fs_id ?? ""}/${row.base_info.icon_file_id}/x.png`;
                    }
                }
                return (
                    <div>
                        <AsyncImage style={{ width: "60px", cursor: "pointer", marginRight: "20px" }}
                            src={iconUrl}
                            preview={false}
                            fallback={defaultIcon}
                            useRawImg={false}
                        />
                        <span>{row.base_info.app_name}</span>
                        {(permInfo?.app_store_perm.update_app ?? false) == true && (
                            <Button type="link"
                                style={{ minWidth: 0, paddingLeft: 5 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowUpdateBaseInfo(row);
                                }}><EditOutlined /></Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: "分类",
            render: (_, row: AppInfo) => {
                const cateList = [];
                if (row.major_cate.cate_name != "") {
                    cateList.push(row.major_cate.cate_name);
                }
                if (row.minor_cate.cate_name != "") {
                    cateList.push(row.minor_cate.cate_name);
                }
                if (row.sub_minor_cate.cate_name != "") {
                    cateList.push(row.sub_minor_cate.cate_name);
                }
                return (
                    <div>
                        <span>{cateList.join(" / ")}</span>
                        {(permInfo?.app_store_perm.update_app ?? false) == true && (
                            <Button type="link" style={{ minWidth: 0, paddingLeft: 5 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowMoveAppInfo(row);
                                }}><EditOutlined /></Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: "发布系统",
            render: (_, row: AppInfo) => {
                const osList = [];
                if (row.os_windows) {
                    osList.push("windows");
                }
                if (row.os_mac) {
                    osList.push("mac");
                }
                if (row.os_linux) {
                    osList.push("linux");
                }
                return (
                    <div>
                        <span>{osList.join(",")}</span>
                        {(permInfo?.app_store_perm.update_app ?? false) == true && (
                            <Button type="link" style={{ minWidth: 0, paddingLeft: 5 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowUpdateAppOs(row);
                                }}><EditOutlined /></Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: "应用范围",
            render: (_, row: AppInfo) => {
                const scopeList = [];
                if (row.user_app) {
                    scopeList.push("用户应用");
                }
                if (row.project_app) {
                    scopeList.push("项目应用");
                }
                return (
                    <div>
                        <span>{scopeList.join(",")}</span>
                        {(permInfo?.app_store_perm.update_app ?? false) == true && (
                            <Button type="link" style={{ minWidth: 0, paddingLeft: 5 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowUpdateAppScope(row);
                                }}><EditOutlined /></Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: "操作",
            width: 300,
            render: (_, row: AppInfo) => (
                <>
                    <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowUpdateFile(row);
                        }}>更新应用文件</Button>

                    <Button type="link" style={{ minWidth: "0px", paddingLeft: "20px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowUpdatePerm(row);
                        }}>更新权限</Button>

                    <Button type="link" style={{ minWidth: "0px", paddingLeft: "20px" }}
                        disabled={row.comment_count == 0}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowCommentAppInfo(row);
                        }}>查看评论</Button>

                    <Button type="link" style={{ minWidth: "0px" }} danger
                        disabled={!(permInfo?.app_store_perm.remove_app ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowRemoveApp(row);
                        }}>删除</Button>
                </>
            ),
        },
        {
            title: "安装次数",
            dataIndex: "install_count",
        },
        {
            title: "点赞次数",
            dataIndex: "agree_count",
        },
        {
            title: "评论次数",
            dataIndex: "comment_count",
        },
        {
            title: "创建时间",
            width: 150,
            render: (_, row: AppInfo) => moment(row.create_time).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "修改时间",
            width: 150,
            render: (_, row: AppInfo) => moment(row.update_time).format("YYYY-MM-DD HH:mm:ss"),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadAppList();
    }, [
        curMajorCateId,
        curMinorCateId,
        curSubMinorCateId,
        curPage,
    ]);

    return (
        <Card title="应用列表"
            style={{ height: "calc(100vh - 40px)", overflowY: "hidden" }}
            extra={
                <Space>
                    <SelectAppCate
                        onChange={(majorCateId: string, minorCateId: string, subMinorCateId: string) => {
                            setCurMajorCateId(majorCateId);
                            setCurMinorCateId(minorCateId);
                            setSubCurMinorCateId(subMinorCateId);
                        }} />
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }}>增加应用</Button>
                </Space>
            }>
            <div style={{ height: "calc(100vh - 100px)", overflowY: "scroll" }}>
                <Table rowKey="app_id" columns={columns} dataSource={appList} pagination={false} scroll={{ x: 1500 }} />
                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
            </div>
            {showAddModal == true && (
                <AddAppModal onCancel={() => setShowAddModal(false)}
                    onOk={() => {
                        if (curPage == 0) {
                            loadAppList();
                        } else {
                            setCurPage(0);
                        }
                        setShowAddModal(false);
                    }} />
            )}
            {showUpdateBaseInfo != null && (
                <UpdateAppBaseInfoModal appId={showUpdateBaseInfo.app_id} baseInfo={showUpdateBaseInfo.base_info}
                    onCancel={() => {
                        setShowUpdateBaseInfo(null);
                    }} onOk={() => {
                        if (curPage == 0) {
                            loadAppList();
                        } else {
                            setCurPage(0);
                        }
                        setShowUpdateBaseInfo(null);
                    }} />
            )}
            {showUpdateFile != null && (
                <UpdateAppFileModal appId={showUpdateFile.app_id}
                    onCancel={() => setShowUpdateFile(null)}
                    onOk={() => {
                        if (curPage == 0) {
                            loadAppList();
                        } else {
                            setCurPage(0);
                        }
                        setShowUpdateFile(null);
                    }} />
            )}
            {showUpdateAppOs != null && (
                <UpdateAppOsModal appId={showUpdateAppOs.app_id} osWindows={showUpdateAppOs.os_windows} osMac={showUpdateAppOs.os_mac} osLinux={showUpdateAppOs.os_linux}
                    onCancel={() => setShowUpdateAppOs(null)}
                    onOk={() => {
                        if (curPage == 0) {
                            loadAppList();
                        } else {
                            setCurPage(0);
                        }
                        setShowUpdateAppOs(null);
                    }} />
            )}
            {showUpdateAppScope != null && (
                <UpdateAppScopeModal appId={showUpdateAppScope.app_id} userApp={showUpdateAppScope.user_app} projectApp={showUpdateAppScope.project_app}
                    onCancel={() => setShowUpdateAppScope(null)}
                    onOk={() => {
                        if (curPage == 0) {
                            loadAppList();
                        } else {
                            setCurPage(0);
                        }
                        setShowUpdateAppScope(null);
                    }} />
            )}
            {showRemoveApp != null && (
                <Modal open title={`删除应用 ${showRemoveApp.base_info.app_name}`}
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveApp(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeApp();
                    }}>
                    是否删除应用&nbsp;{showRemoveApp.base_info.app_name}&nbsp;?
                </Modal>
            )}
            {showMoveAppInfo != null && (
                <SelectAppCateModal appId={showMoveAppInfo.app_id} onCancel={() => setShowMoveAppInfo(null)}
                    onOk={() => {
                        if (curPage == 0) {
                            loadAppList();
                        } else {
                            setCurPage(0);
                        }
                        setShowMoveAppInfo(null);
                    }} />
            )}
            {showUpdatePerm != null && (
                <UpdateAppPermModal appId={showUpdatePerm.app_id} appPerm={showUpdatePerm.app_perm}
                    onCancel={() => setShowUpdatePerm(null)}
                    onOk={() => {
                        if (curPage == 0) {
                            loadAppList();
                        } else {
                            setCurPage(0);
                        }
                        setShowUpdatePerm(null);
                    }} />
            )}
            {showCommentAppInfo != null && (
                <CommentListModal appInfo={showCommentAppInfo} onClose={()=>setShowCommentAppInfo(null)}/>
            )}
        </Card>
    );
};


export default observer(AppList);