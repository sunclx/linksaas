import React, { useEffect, useState } from "react";
import type { AdminPermInfo } from '@/api/admin_auth';
import type { ExtraMenuItem } from '@/api/client_cfg';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { list_extra_menu, set_extra_menu_weight, add_extra_menu, remove_extra_menu } from '@/api/client_cfg_admin';
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import { EditNumber } from "@/components/EditCell/EditNumber";
import { Card, Modal, Table, Form, Input, InputNumber, message } from "antd";
import Button from "@/components/Button";
import { PlusOutlined } from "@ant-design/icons";

const URL_REGEX = /^https*:\/\/.+/;

interface AddFormValue {
    title?: string;
    url?: string;
    weight?: number;
}

const MenuAdmin = () => {
    const [form] = Form.useForm();

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [menuList, setMenuList] = useState<ExtraMenuItem[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [removeMenuItem, setRemoveMenuItem] = useState<ExtraMenuItem | null>(null);

    const loadMenuList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_extra_menu({
            admin_session_id: sessionId,
        }));
        setMenuList(res.menu_list);
    };

    const addMenu = async () => {
        const values = form.getFieldsValue() as AddFormValue;
        if (values.title == undefined || values.title == "") {
            message.error("请输入菜单标题");
            return;
        }
        if (values.title.length < 2) {
            message.error("菜单标题过短");
            return;
        }
        if (values.url == undefined || !values.url.startsWith("https://")) {
            message.error("内容链接必须以https://开头");
            return;
        }
        const sessionId = await get_admin_session();
        await request(add_extra_menu({
            admin_session_id: sessionId,
            name: values.title,
            url: values.url,
            weight: values.weight ?? 0,
        }));
        setShowAddModal(false);
        await loadMenuList();
        message.info("添加成功");
    };

    const removeMenu = async () => {
        const sessionId = await get_admin_session();
        await request(remove_extra_menu({
            admin_session_id: sessionId,
            menu_id: removeMenuItem?.menu_id ?? "",
        }));
        setRemoveMenuItem(null);
        await loadMenuList();
        message.info("删除成功");

    };

    const columns: ColumnsType<ExtraMenuItem> = [
        {
            title: "菜单标题",
            width: 150,
            dataIndex: "name",
        },
        {
            title: "目标地址",
            render: (_, row: ExtraMenuItem) => (
                <a href={row.url} target="_blank" rel="noreferrer">{row.url}</a>
            ),
        },
        {
            title: "权重",
            width: 150,
            render: (_, row: ExtraMenuItem) => (
                <EditNumber editable={permInfo?.menu_perm.set_weight ?? false} value={row.weight} fixedLen={0} onChange={async (value: number) => {
                    try {
                        const sessionId = await get_admin_session();
                        await request(set_extra_menu_weight({
                            admin_session_id: sessionId,
                            menu_id: row.menu_id,
                            weight: value,
                        }));
                        loadMenuList();
                        return true;
                    } catch (e) {
                        console.log(e)
                    }
                    return false;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: ExtraMenuItem) => (
                <Button type="link"
                    disabled={!(permInfo?.menu_perm.remove ?? false)}
                    danger style={{ minWidth: 0, paddingLeft: 0 }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveMenuItem(row);
                    }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        loadMenuList();
    }, []);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card title="公共资源扩展菜单"
            style={{ height: "calc(100vh - 40px)", overflowY: "scroll" }}
            extra={
                <Button
                    disabled={!(permInfo?.menu_perm.add ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }}><PlusOutlined />&nbsp;&nbsp;增加菜单项</Button>
            }>
            <Table rowKey="menu_id" columns={columns} dataSource={menuList} pagination={false} />
            {showAddModal == true && (
                <Modal open title="添加菜单项"
                    okText="添加"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addMenu();
                    }}>
                    <Form form={form} labelCol={{ span: 4 }} initialValues={{
                        url: "https://",
                        weight: 0,
                    }}>
                        <Form.Item label="菜单标题" name="title" rules={[{ required: true, min: 2, max: 10 }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="内容链接" name="url" rules={[{ required: true, pattern: URL_REGEX }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="权重" name="weight" rules={[{ required: true }]}>
                            <InputNumber controls={false} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeMenuItem != null && (
                <Modal open title="删除菜单项"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveMenuItem(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMenu();
                    }}>
                    是否删除&nbsp;{removeMenuItem.name}&nbsp;?
                </Modal>
            )}
        </Card>
    );
};

export default MenuAdmin;