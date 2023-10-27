import { useStores } from "@/hooks";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import { Form, Modal, Popover, Space, Switch, Table, Tag, message } from "antd";
import Button from "@/components/Button";
import addIcon from '@/assets/image/addIcon.png';
import CreateApiCollModal from "./components/CreateApiCollModal";
import type { ApiCollInfo } from "@/api/api_collection";
import { list as list_info, update_name, update_default_addr, remove as remove_info, API_COLL_GRPC, API_COLL_OPENAPI, API_COLL_CUSTOM, get as get_info } from "@/api/api_collection";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import { EditText } from "@/components/EditCell/EditText";
import UpdateGrpcModal from "./components/UpdateGrpcModal";
import UpdateSwaggerModal from "./components/UpdateSwaggerModal";
import UpdateCustomModal from "./components/UpdateCustomModal";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { EditOutlined } from "@ant-design/icons";
import UpdateMemberModal from "./components/UpdateMemberModal";
import s from "./ApiCollectionList.module.less";
import { watch, unwatch, WATCH_TARGET_API_COLL } from "@/api/project_watch";

const PAGE_SIZE = 10;

const ApiCollectionList = () => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");
    const linkAuxStore = useStores("linkAuxStore");
    const memberStore = useStores("memberStore");

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [apiCollInfoList, setApiCollInfoList] = useState<ApiCollInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [removeApiCollInfo, setRemoveApiCollInfo] = useState<ApiCollInfo | null>(null);
    const [updateGrpcApiId, setUpdateGrpcApiId] = useState("");
    const [updateOpenApiId, setUpdateOpenApiId] = useState("");
    const [updateCustomApiId, setUpdateCustomApiId] = useState("");
    const [updateMemberApiCollInfo, setUpdateMemberApiCollInfo] = useState<ApiCollInfo | null>(null);

    const [filterByWatch, setFilterByWatch] = useState(false);

    const loadApiCollInfoList = async () => {
        const res = await request(list_info({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: filterByWatch,
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

    const updateApiCollInfo = async (apiCollId: string) => {
        const res = await request(get_info({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: apiCollId,
        }));
        const tmpList = apiCollInfoList.slice();
        const index = tmpList.findIndex(item => item.api_coll_id == apiCollId);
        if (index != -1) {
            tmpList[index] = res.info;
            setApiCollInfoList(tmpList);
        }
    }
    const unwatchApiColl = async (apiCollId: string) => {
        await request(unwatch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_API_COLL,
            target_id: apiCollId,
        }));
        await updateApiCollInfo(apiCollId);
    };

    const watchApiColl = async (apiCollId: string) => {
        await request(watch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_API_COLL,
            target_id: apiCollId,
        }));
        await updateApiCollInfo(apiCollId);
    };

    const columns: ColumnsType<ApiCollInfo> = [
        {
            title: "",
            dataIndex: "my_watch",
            width: 40,
            render: (_, row: ApiCollInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (row.my_watch) {
                        unwatchApiColl(row.api_coll_id);
                    } else {
                        watchApiColl(row.api_coll_id);
                    }
                }}>
                    <span className={row.my_watch ? s.isCollect : s.noCollect} />
                </a>
            ),
            fixed: true,
        },
        {
            title: "名称",
            width: 200,
            render: (_, row) => (
                <EditText editable={(!projectStore.isClosed) && row.can_update}
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
                        linkAuxStore.openApiCollPage(row.api_coll_id, row.name, row.api_coll_type, row.default_addr, row.can_update);
                    }} />
            ),
        },
        {
            title: "类型",
            width: 150,
            render: (_, row) => (
                <>
                    {row.api_coll_type == API_COLL_GRPC && "GRPC"}
                    {row.api_coll_type == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                    {row.api_coll_type == API_COLL_CUSTOM && "自定义接口"}
                </>
            ),
        },
        {
            title: "服务地址",
            width: 200,
            render: (_, row) => (
                <EditText editable={(!projectStore.isClosed) && row.can_update}
                    content={row.default_addr} showEditIcon={true} onChange={async value => {
                        if (value.trim() == "") {
                            return false;
                        }
                        if (row.api_coll_type == API_COLL_GRPC) {
                            if (value.split(":").length != 2) {
                                message.warn("地址未包含端口信息")
                                return false;
                            }
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
            title: "可编辑权限",
            width: 200,
            render: (_, row) => (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {memberStore.memberList.filter(item => (row.edit_member_user_id_list ?? []).includes(item.member.member_user_id)).map(item => (
                        <Tag key={item.member.member_user_id} style={{ marginBottom: "4px" }}>
                            <Space>
                                <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px" }} />
                                {item.member.display_name}
                            </Space>
                        </Tag>
                    ))}
                    {(!projectStore.isClosed) && projectStore.isAdmin && (
                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setUpdateMemberApiCollInfo(row);
                            }}>
                            <EditOutlined />
                        </Button>
                    )}
                </div>
            ),
        },
        {
            title: "关注人",
            dataIndex: "",
            width: 140,
            align: 'left',
            render: (_, row: ApiCollInfo) => (
                <Popover trigger="hover" placement='top' content={
                    <div style={{ display: "flex", padding: "10px 10px", maxWidth: "300px", flexWrap: "wrap" }}>
                        {(row.watch_user_list ?? []).map(item => (
                            <Space key={item.member_user_id} style={{ margin: "4px 10px" }}>
                                <UserPhoto logoUri={item.logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                                {item.display_name}
                            </Space>
                        ))}
                    </div>
                }>
                    {(row.watch_user_list ?? []).length == 0 && "-"}
                    {(row.watch_user_list ?? []).length > 0 && `${(row.watch_user_list ?? []).length}人`}
                </Popover>
            ),
        },
        {
            title: "操作",
            render: (_, row) => (
                <Space size="large">
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.openApiCollPage(row.api_coll_id, row.name, row.api_coll_type, row.default_addr, row.can_update);
                        }}>打开</Button>
                    {row.api_coll_type == API_COLL_GRPC && (
                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                            disabled={projectStore.isClosed || (!row.can_update)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setUpdateGrpcApiId(row.api_coll_id);
                            }}>更新接口协议</Button>
                    )}
                    {row.api_coll_type == API_COLL_OPENAPI && (
                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                            disabled={projectStore.isClosed || (!row.can_update)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setUpdateOpenApiId(row.api_coll_id);
                            }}>更新接口协议</Button>
                    )}
                    {row.api_coll_type == API_COLL_CUSTOM && (
                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                            disabled={projectStore.isClosed || (!row.can_update)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setUpdateCustomApiId(row.api_coll_id);
                            }}>更新接口协议</Button>
                    )}
                    <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={projectStore.isClosed || (!projectStore.isAdmin)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoveApiCollInfo(row);
                        }}>删除</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadApiCollInfoList();
    }, [curPage, filterByWatch]);

    return (
        <CardWrap title="接口集合列表" extra={
            <Space>
                <Form layout="inline">
                    <Form.Item label="只看我的关注">
                        <Switch checked={filterByWatch} onChange={value => setFilterByWatch(value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            disabled={projectStore.isClosed}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowCreateModal(true);
                            }}>
                            <img src={addIcon} alt="" />&nbsp;创建接口集合
                        </Button>
                    </Form.Item>
                </Form>
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
            {updateGrpcApiId != "" && (
                <UpdateGrpcModal apiCollId={updateGrpcApiId} onClose={() => setUpdateGrpcApiId("")} />
            )}
            {updateOpenApiId != "" && (
                <UpdateSwaggerModal apiCollId={updateOpenApiId} onClose={() => setUpdateOpenApiId("")} />
            )}
            {updateCustomApiId != "" && (
                <UpdateCustomModal apiCollId={updateCustomApiId} onClose={() => setUpdateCustomApiId("")} />
            )}
            {updateMemberApiCollInfo != null && (
                <UpdateMemberModal apiCollId={updateMemberApiCollInfo.api_coll_id} memberIdList={updateMemberApiCollInfo.edit_member_user_id_list ?? []}
                    onCancel={() => setUpdateMemberApiCollInfo(null)} onOk={() => {
                        updateApiCollInfo(updateMemberApiCollInfo.api_coll_id);
                        setUpdateMemberApiCollInfo(null);
                    }} />
            )}
        </CardWrap>
    );
};

export default observer(ApiCollectionList);