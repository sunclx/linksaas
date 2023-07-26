import { useStores } from "@/hooks";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import { Modal, Space, Table, message } from "antd";
import Button from "@/components/Button";
import addIcon from '@/assets/image/addIcon.png';
import CreateApiCollModal from "./components/CreateApiCollModal";
import type { ApiCollInfo } from "@/api/api_collection";
import { list as list_info, update_name, update_default_addr, remove as remove_info, API_COLL_GRPC, API_COLL_OPENAPI, API_COLL_CUSTOM } from "@/api/api_collection";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import { EditText } from "@/components/EditCell/EditText";
import { WebviewWindow } from '@tauri-apps/api/window';

const PAGE_SIZE = 10;

const ApiCollectionList = () => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [apiCollInfoList, setApiCollInfoList] = useState<ApiCollInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [removeApiCollInfo, setRemoveApiCollInfo] = useState<ApiCollInfo | null>(null);

    const loadApiCollInfoList = async () => {
        const res = await request(list_info({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setApiCollInfoList(res.info_list);
        setTotalCount(res.total_count);
    };

    const removeApiColl = async () => {
        if (removeApiCollInfo == null) {
            return;
        }
        await request(remove_info({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: removeApiCollInfo.api_coll_id,
        }));
        setRemoveApiCollInfo(null);
        message.info("删除成功");
        await loadApiCollInfoList();
    };

    const openApiWindow = async (info: ApiCollInfo) => {
        const label = `apiColl:${info.api_coll_id}`;
        if (info.api_coll_type == API_COLL_GRPC) {
            new WebviewWindow(label, {
                title: `${info.name}(GRPC)`,
                url: `api_grpc.html?projectId=${projectStore.curProjectId}&apiCollId=${info.api_coll_id}&fsId=${projectStore.curProject?.api_coll_fs_id ?? ""}&remoteAddr=${info.default_addr}`
            });
        } else if (info.api_coll_type == API_COLL_OPENAPI) {
            new WebviewWindow(label, {
                title: `${info.name}(GRPC)`,
                url: `api_swagger.html?projectId=${projectStore.curProjectId}&apiCollId=${info.api_coll_id}&fsId=${projectStore.curProject?.api_coll_fs_id ?? ""}&remoteAddr=${info.default_addr}`
            });
        } else if (info.api_coll_type == API_COLL_CUSTOM) {
            //TODO
        }
    }

    const columns: ColumnsType<ApiCollInfo> = [
        {
            title: "名称",
            render: (_, row) => (
                <EditText editable={projectStore.isAdmin || row.create_user_id == userStore.userInfo.userId}
                    content={row.name} showEditIcon={true} onChange={async value => {
                        if (value.trim() == "") {
                            return false;
                        }
                        try {
                            await request(update_name({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                api_coll_id: row.api_coll_id,
                                name: value.trim(),
                            }));
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                        const tmpList = apiCollInfoList.slice();
                        const index = tmpList.findIndex(item => item.api_coll_id == row.api_coll_id);
                        if (index != -1) {
                            tmpList[index].name = value.trim();
                            setApiCollInfoList(tmpList);
                        }
                        return true;
                    }} onClick={() => {
                        openApiWindow(row);
                    }} />
            ),
        },
        {
            title: "类型",
            render: (_, row) => (
                <>
                    {row.api_coll_type == API_COLL_GRPC && "GRPC"}
                    {row.api_coll_type == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                    {row.api_coll_type == API_COLL_CUSTOM && "自定义"}
                </>
            ),
        },
        {
            title: "服务地址",
            render: (_, row) => (
                <EditText editable={projectStore.isAdmin || row.create_user_id == userStore.userInfo.userId}
                    content={row.default_addr} showEditIcon={true} onChange={async value => {
                        if (value.trim() == "") {
                            return false;
                        }
                        if (value.split(":").length != 2) {
                            message.warn("地址未包含端口信息")
                            return false;
                        }
                        try {
                            await request(update_default_addr({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                api_coll_id: row.api_coll_id,
                                default_addr: value.trim(),
                            }));
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                        const tmpList = apiCollInfoList.slice();
                        const index = tmpList.findIndex(item => item.api_coll_id == row.api_coll_id);
                        if (index != -1) {
                            tmpList[index].default_addr = value.trim();
                            setApiCollInfoList(tmpList);
                        }
                        return true;
                    }} />
            ),
        },
        {
            title: "操作",
            render: (_, row) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveApiCollInfo(row);
                }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        loadApiCollInfoList();
    }, [curPage]);

    return (
        <CardWrap title="接口集合列表" extra={
            <Space size="middle">
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowCreateModal(true);
                }}>
                    <img src={addIcon} alt="" />创建接口集合
                </Button>
            </Space>
        }>
            <Table rowKey="api_coll_id" dataSource={apiCollInfoList} columns={columns} style={{ margin: "0px 20px 0px 20px" }}
                scroll={{ y: "calc(100vh - 270px)" }} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1) }} />
            {showCreateModal == true && (
                <CreateApiCollModal onCancel={() => setShowCreateModal(false)} onOk={() => {
                    if (curPage != 0) {
                        setCurPage(0);
                    } else {
                        loadApiCollInfoList();
                    }
                    setShowCreateModal(false);
                }} />
            )}
            {removeApiCollInfo !== null && (
                <Modal open title={`删除API集合 ${removeApiCollInfo.name}`}
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveApiCollInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeApiColl();
                    }}>
                    是否删除API集合&nbsp;{removeApiCollInfo.name}&nbsp;?
                </Modal>
            )}
        </CardWrap>
    );
};

export default observer(ApiCollectionList);