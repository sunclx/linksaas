import Button from "@/components/Button";
import { Breadcrumb, Card, Form, Input, Modal, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { PlusOutlined } from "@ant-design/icons";
import type { MajorCate, MinorCate, SubMinorCate } from '@/api/appstore';
import { list_major_cate, list_minor_cate, list_sub_minor_cate } from '@/api/appstore';
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import {
    create_major_cate, create_minor_cate, create_sub_minor_cate,
    update_major_cate, update_minor_cate, update_sub_minor_cate,
    remove_major_cate, remove_minor_cate, remove_sub_minor_cate
} from '@/api/appstore_admin';



const AppCateList = () => {
    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [majorCateList, setMajorCateList] = useState<MajorCate[]>([]);
    const [minorCateList, setMinorCateList] = useState<MinorCate[]>([]);
    const [subMinorCateList, setSubMinorCateList] = useState<SubMinorCate[]>([]);

    const [curMajorCate, setCurMajorCate] = useState<MajorCate | null>(null);
    const [curMinorCate, setCurMinorCate] = useState<MinorCate | null>(null);

    const [cateName, setCateName] = useState("");
    const [updateCateId, setUpdateCateId] = useState("");
    const [removeCateId, setRemoveCateId] = useState("");

    const loadMajorCateList = async () => {
        const res = await request(list_major_cate({}));
        setMajorCateList(res.cate_info_list);
    };

    const loadMinorCateList = async () => {
        if (curMajorCate == null) {
            setMinorCateList([]);
            setCurMinorCate(null);
        } else {
            const res = await request(list_minor_cate({
                major_cate_id: curMajorCate.cate_id,
            }));
            setMinorCateList(res.cate_info_list);
        }
    };

    const loadSubMinorCateList = async () => {
        if (curMinorCate == null) {
            setSubMinorCateList([]);
        } else {
            const res = await request(list_sub_minor_cate({
                minor_cate_id: curMinorCate.cate_id,
            }));
            setSubMinorCateList(res.cate_info_list);
        }
    };

    const createCate = async () => {
        const sessionId = await get_admin_session();
        if (curMajorCate == null) {
            await request(create_major_cate({
                admin_session_id: sessionId,
                cate_name: cateName,
            }));
            await loadMajorCateList();
        } else if (curMinorCate == null) {
            await request(create_minor_cate({
                admin_session_id: sessionId,
                major_cate_id: curMajorCate.cate_id,
                cate_name: cateName,
            }));
            await loadMinorCateList();
        } else {
            await request(create_sub_minor_cate({
                admin_session_id: sessionId,
                minor_cate_id: curMinorCate.cate_id,
                cate_name: cateName,
            }));
            await loadSubMinorCateList();
        }
        setCateName("");
        setShowAddModal(false);
    };

    const updateCate = async () => {
        const sessionId = await get_admin_session();
        if (curMajorCate == null) {
            await request(update_major_cate({
                admin_session_id: sessionId,
                cate_id: updateCateId,
                cate_name: cateName,
            }));
            await loadMajorCateList();
        } else if (curMinorCate == null) {
            await request(update_minor_cate({
                admin_session_id: sessionId,
                cate_id: updateCateId,
                cate_name: cateName,
            }));
            await loadMinorCateList();
        } else {
            await request(update_sub_minor_cate({
                admin_session_id: sessionId,
                cate_id: updateCateId,
                cate_name: cateName,
            }));
            await loadSubMinorCateList();
        }
        setCateName("");
        setUpdateCateId("");
    };

    const removeCate = async () => {
        const sessionId = await get_admin_session();
        if (curMajorCate == null) {
            await request(remove_major_cate({
                admin_session_id: sessionId,
                cate_id: removeCateId,
            }));
            await loadMajorCateList();
        } else if (curMinorCate == null) {
            await request(remove_minor_cate({
                admin_session_id: sessionId,
                cate_id: removeCateId,
            }));
            await loadMinorCateList();
        } else {
            await request(remove_sub_minor_cate({
                admin_session_id: sessionId,
                cate_id: removeCateId,
            }));
            await loadSubMinorCateList();
        }
        setCateName("");
        setRemoveCateId("");
    };

    const majorColumns: ColumnsType<MajorCate> = [
        {
            title: "类别名称",
            render: (_, row: MajorCate) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurMajorCate(row);
                }}>{row.cate_name}</a>
            ),
        },
        {
            title: "子类别数量",
            dataIndex: "minor_cate_count",
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: MajorCate) => (
                <Space>
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={!(permInfo?.app_store_perm.update_cate ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCateName(row.cate_name);
                            setUpdateCateId(row.cate_id);
                        }}>修改名称</Button>
                    <Button type="link" danger
                        disabled={!((row.minor_cate_count == 0) && (permInfo?.app_store_perm.remove_cate ?? false))}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCateName(row.cate_name);
                            setRemoveCateId(row.cate_id);
                        }}>删除</Button>
                </Space>
            ),
        }
    ];

    const minorColumns: ColumnsType<MinorCate> = [
        {
            title: "类别名称",
            render: (_, row: MinorCate) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurMinorCate(row);
                }}>{row.cate_name}</a>
            ),
        },
        {
            title: "子类别数量",
            dataIndex: "sub_minor_cate_count",
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: MinorCate) => (
                <Space>
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={!(permInfo?.app_store_perm.update_cate ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCateName(row.cate_name);
                            setUpdateCateId(row.cate_id);
                        }}>修改名称</Button>
                    <Button type="link" danger
                        disabled={!((row.sub_minor_cate_count == 0) && (permInfo?.app_store_perm.remove_cate ?? false))}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCateName(row.cate_name);
                            setRemoveCateId(row.cate_id);
                        }}>删除</Button>
                </Space>
            ),
        }
    ];

    const subMinorColumns: ColumnsType<SubMinorCate> = [
        {
            title: "类别名称",
            dataIndex: "cate_name",
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: SubMinorCate) => (
                <Space>
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={!(permInfo?.app_store_perm.update_cate ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCateName(row.cate_name);
                            setUpdateCateId(row.cate_id);
                        }}>修改名称</Button>
                    <Button type="link" danger
                        disabled={!(permInfo?.app_store_perm.remove_cate ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCateName(row.cate_name);
                            setRemoveCateId(row.cate_id);
                        }}>删除</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadMajorCateList();
    }, []);

    useEffect(() => {
        loadMinorCateList();
    }, [curMajorCate]);

    useEffect(() => {
        loadSubMinorCateList();
    }, [curMinorCate]);

    return (
        <Card title="应用类别"
            style={{ height: "calc(100vh - 40px)", overflowY: "scroll" }}
            extra={
                <Button
                    disabled={!(permInfo?.app_store_perm.add_cate ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCateName("");
                        setShowAddModal(true);
                    }}><PlusOutlined />&nbsp;&nbsp;添加类别</Button>
            }>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCurMajorCate(null);
                        loadMajorCateList();
                    }}>根目录</a>
                </Breadcrumb.Item>
                {curMajorCate != null && (
                    <Breadcrumb.Item>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCurMinorCate(null);
                            loadMinorCateList();
                        }}>{curMajorCate.cate_name}</a>
                    </Breadcrumb.Item>
                )}
                {curMinorCate != null && (
                    <Breadcrumb.Item>{curMinorCate.cate_name}</Breadcrumb.Item>
                )}
            </Breadcrumb>
            {curMajorCate == null && (
                <Table rowKey="cate_id" dataSource={majorCateList} columns={majorColumns} pagination={false} />
            )}
            {curMajorCate != null && curMinorCate == null && (
                <Table rowKey="cate_id" dataSource={minorCateList} columns={minorColumns} pagination={false} />
            )}
            {curMajorCate != null && curMinorCate != null && (
                <Table rowKey="cate_id" dataSource={subMinorCateList} columns={subMinorColumns} pagination={false} />
            )}
            {showAddModal == true && (
                <Modal open title="增加类别"
                    okText="增加"
                    okButtonProps={{ disabled: !((permInfo?.app_store_perm.add_cate ?? false) && (cateName.trim().length > 0)) }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
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
                <Modal open title="修改名称"
                    okText="修改"
                    okButtonProps={{ disabled: !((permInfo?.app_store_perm.update_cate ?? false) && (cateName.trim().length > 0)) }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUpdateCateId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateCate();
                    }}
                >
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
            {removeCateId != "" && (
                <Modal open title="删除类别"
                okText="删除"
                okButtonProps={{ disabled: !((permInfo?.app_store_perm.remove_cate ?? false) && (cateName.trim().length > 0)),danger:true }}
                onCancel={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveCateId("");
                }}
                onOk={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeCate();
                }}
                >
                    是否删除类别&nbsp;{cateName}&nbsp;?
                </Modal>
            )}
        </Card>
    );
};

export default AppCateList;