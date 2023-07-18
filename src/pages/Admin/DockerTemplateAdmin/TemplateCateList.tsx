import React, { useEffect, useState } from "react";
import {Card, Form, Input, Modal, Space, Table } from "antd";
import type { CateInfo } from "@/api/docker_template";
import { list_cate } from "@/api/docker_template";
import { create_cate, update_cate, remove_cate } from "@/api/docker_template_admin";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { PlusOutlined } from "@ant-design/icons";
import Button from "@/components/Button";



const TemplateCateList = () => {
    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [cateInfoList, setCateInfoList] = useState<CateInfo[]>([]);

    const [cateName, setCateName] = useState("");
    const [updateCateId, setUpdateCateId] = useState("");
    const [removeCateInfo, setRemoveCateInfo] = useState<CateInfo | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);

    const loadCateInfoList = async () => {
        const res = await request(list_cate({}));
        setCateInfoList(res.cate_info_list);
    };

    const createCate = async () => {
        if (cateName.trim() == "") {
            return;
        }
        const sessionId = await get_admin_session();
        await request(create_cate({
            admin_session_id: sessionId,
            cate_name: cateName.trim(),
        }));
        setCateName("");
        setShowAddModal(false);
        loadCateInfoList();
    };

    const updateCate = async () => {
        if (cateName.trim() == "") {
            return;
        }
        const sessionId = await get_admin_session();
        await request(update_cate({
            admin_session_id: sessionId,
            cate_id: updateCateId,
            cate_name: cateName.trim(),
        }));
        setCateName("");
        setUpdateCateId("");
        loadCateInfoList();
    };

    const removeCate = async () => {
        if (removeCateInfo == null) {
            return;
        }
        const sessionId = await get_admin_session();
        await request(remove_cate({
            admin_session_id: sessionId,
            cate_id: removeCateInfo.cate_id,
        }));
        setRemoveCateInfo(null);
        loadCateInfoList();
    }

    const columns: ColumnsType<CateInfo> = [
        {
            title: "类别名称",
            dataIndex: "cate_name",
        },
        {
            title: "模板数量",
            dataIndex: "app_count",
        },
        {
            title: "操作",
            render: (_, row) => (
                <Space size="large">
                    <Button type="link"
                        style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={!(permInfo?.docker_template_perm.update_cate ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCateName(row.cate_name);
                            setUpdateCateId(row.cate_id);
                        }}>修改</Button>
                    <Button type="link"
                        style={{ minWidth: 0, padding: "0px 0px" }} danger
                        disabled={!((permInfo?.docker_template_perm.remove_cate ?? false) && row.app_count == 0)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoveCateInfo(row);
                        }}>删除</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadCateInfoList();
    }, []);

    return (
        <Card title="模板类别"
            bodyStyle={{ height: "calc(100vh - 90px)", overflowY: "scroll" }}
            extra={
                <Button
                    disabled={!(permInfo?.docker_template_perm.create_cate ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCateName("");
                        setShowAddModal(true);
                    }}
                >
                    <PlusOutlined />&nbsp;&nbsp;添加类别</Button>
            }>
            <Table rowKey="cate_id" dataSource={cateInfoList} columns={columns} pagination={false} />
            {showAddModal == true && (
                <Modal open title="增加类别"
                    okText="增加"
                    okButtonProps={{ disabled: !((permInfo?.docker_template_perm.create_cate ?? false) && (cateName.trim().length > 0)) }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCateName("");
                        setShowAddModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        createCate();
                    }}>
                    <Form labelCol={{ span: 4 }}>
                        <Form.Item label="类别名称">
                            <Input value={cateName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setCateName(e.target.value);
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {updateCateId != "" && (
                <Modal open title="修改类别"
                    okText="修改"
                    okButtonProps={{ disabled: !((permInfo?.docker_template_perm.update_cate ?? false) && (cateName.trim().length > 0)) }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCateName("");
                        setUpdateCateId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateCate();
                    }}>
                    <Form labelCol={{ span: 4 }}>
                        <Form.Item label="类别名称">
                            <Input value={cateName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setCateName(e.target.value);
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeCateInfo != null && (
                <Modal open title="删除类别"
                    okText="删除"
                    okButtonProps={{ disabled: !(permInfo?.docker_template_perm.remove_cate ?? false), danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveCateInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeCate();
                    }}>
                    是否删除类别 {removeCateInfo.cate_name} ?
                </Modal>
            )}
        </Card>
    );
};

export default TemplateCateList;