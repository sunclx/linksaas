import { Card, Form, Input, InputNumber, Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { PlusOutlined } from "@ant-design/icons";
import type { SiteCate } from "@/api/pub_search";
import { list_site_cate } from "@/api/pub_search";
import type { ColumnsType } from 'antd/es/table';
import { EditText } from "@/components/EditCell/EditText";
import { EditNumber } from "@/components/EditCell/EditNumber";
import { add_site_cate, update_site_cate, remove_site_cate } from "@/api/pub_search_admin";
import { request } from "@/utils/request";

interface AddCateModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const AddCateModal = (props: AddCateModalProps) => {
    const [name, setName] = useState("");
    const [orderIndex, setOrderIndex] = useState(0);

    const addSiteCate = async () => {
        const sessionId = await get_admin_session();
        await request(add_site_cate({
            admin_session_id: sessionId,
            cate_name: name,
            order_index: orderIndex,
        }));
        props.onOk();
        message.info("增加站点类别成功");
    };

    return (
        <Modal open title="增加站点类别"
            okText="增加" okButtonProps={{ disabled: name == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addSiteCate();
            }}>
            <Form>
                <Form.Item label="名称">
                    <Input value={name} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setName(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="排序">
                    <InputNumber style={{ width: "100%" }}
                        value={orderIndex} precision={0} min={0} max={100} controls={false} onChange={value => {
                            if (value !== null) {
                                setOrderIndex(value);
                            }
                        }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const PubSearchCateList = () => {
    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [cateList, setCateList] = useState<SiteCate[]>([]);
    const [removeCateInfo, setRemoveCateInfo] = useState<SiteCate | null>(null);

    const loadCateList = async () => {
        const res = await list_site_cate({});
        setCateList(res.cate_list);
    };

    const removeSiteCate = async () => {
        if (removeCateInfo == null) {
            return;
        }
        const sessionId = await get_admin_session();
        await request(remove_site_cate({
            admin_session_id: sessionId,
            cate_id: removeCateInfo.cate_id,
        }));
        setRemoveCateInfo(null);
        message.info("删除站点类别成功");
        await loadCateList();
    };

    const columns: ColumnsType<SiteCate> = [
        {
            title: "名称",
            width: 150,
            render: (_, row: SiteCate) => (
                <EditText editable={permInfo?.pub_search_perm.update_cate ?? false} content={row.cate_name} onChange={async value => {
                    if (value.length == 0) {
                        return false;
                    }
                    try {
                        const sessionId = await get_admin_session();
                        await request(update_site_cate({
                            admin_session_id: sessionId,
                            cate_id: row.cate_id,
                            cate_name: value,
                            order_index: row.order_index,
                        }));
                        const tmpList = cateList.slice();
                        const index = tmpList.findIndex(item => item.cate_id == row.cate_id);
                        if (index != -1) {
                            tmpList[index].cate_name = value;
                            setCateList(tmpList);
                        }
                        return true;
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                }} showEditIcon={true} />
            ),
        },
        {
            title: "站点数量",
            width: 80,
            dataIndex: "site_count",
        },
        {
            title: "排序",
            width: 80,
            render: (_, row: SiteCate) => (
                <EditNumber editable={permInfo?.pub_search_perm.update_cate ?? false} value={row.order_index} showEditIcon={true} fixedLen={0} min={0} max={100} onChange={async value => {
                    try {
                        const sessionId = await get_admin_session();
                        await request(update_site_cate({
                            admin_session_id: sessionId,
                            cate_id: row.cate_id,
                            cate_name: row.cate_name,
                            order_index: value,
                        }));
                        const tmpList = cateList.slice();
                        const index = tmpList.findIndex(item => item.cate_id == row.cate_id);
                        if (index != -1) {
                            tmpList[index].order_index = value;
                            setCateList(tmpList);
                        }
                        return true;
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                }} />
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: SiteCate) => (
                <Button type="link" disabled={!((permInfo?.pub_search_perm.remove_cate ?? false) && row.site_count == 0)} danger onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveCateInfo(row);
                }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadCateList();
    }, []);

    return (
        <Card title="搜索站点类别"
            bodyStyle={{ height: "calc(100vh - 90px)", overflowY: "scroll" }}
            extra={
                <Button
                    disabled={!(permInfo?.pub_search_perm.add_cate ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }}>
                    <PlusOutlined />&nbsp;&nbsp;添加类别
                </Button>
            }>
            <Table rowKey="cate_id" dataSource={cateList} columns={columns} pagination={false} />
            {showAddModal == true && (
                <AddCateModal onOk={() => {
                    setShowAddModal(false);
                    loadCateList();
                }} onCancel={() => setShowAddModal(false)} />
            )}
            {removeCateInfo != null && (
                <Modal open title="删除站点类别"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveCateInfo(null);
                    }} onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeSiteCate();
                    }}>
                    是否删除站点类别&nbsp;{removeCateInfo.cate_name}&nbsp;?
                </Modal>
            )}
        </Card>
    );
};

export default PubSearchCateList;