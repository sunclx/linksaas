import { Form, message, Card, Table, Modal, Input, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import type { AdminPermInfo } from '@/api/admin_auth';
import type { AdItem } from '@/api/client_cfg';
import { list_ad, set_ad_weight, add_ad, remove_ad } from '@/api/client_cfg_admin';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import { EditNumber } from "@/components/EditCell/EditNumber";
import Button from "@/components/Button";
import { PlusOutlined } from "@ant-design/icons";
import AsyncImage from "@/components/AsyncImage";

const URL_REGEX = /^https*:\/\/.+/;

interface AddFormValue {
    imgUrl?: string;
    url?: string;
    weight?: number;
}

const AdAdmin = () => {
    const [form] = Form.useForm();

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [adList, setAdList] = useState<AdItem[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [removeAdItem, setRemoveAdItem] = useState<AdItem | null>(null);

    const loadAdList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_ad({
            admin_session_id: sessionId,
        }));
        setAdList(res.ad_list);
    };

    const addAd = async () => {
        const values = form.getFieldsValue() as AddFormValue;
        if (values.imgUrl == undefined || !values.url?.startsWith("https://")) {
            message.error("图片地址必须以https://开头");
            return;
        }
        if (values.url == undefined || !values.url.startsWith("https://")) {
            message.error("目标地址必须以https://开头");
            return;
        }
        const sessionId = await get_admin_session();
        await request(add_ad({
            admin_session_id: sessionId,
            url: values.url,
            img_url: values.imgUrl,
            weight: values.weight ?? 0,
        }));
        setShowAddModal(false);
        await loadAdList();
        message.info("添加成功");
    };

    const removeAd = async () => {
        const sessionId = await get_admin_session();
        await request(remove_ad({
            admin_session_id: sessionId,
            ad_id: removeAdItem?.ad_id ?? "",
        }));
        setRemoveAdItem(null);
        await loadAdList();
        message.info("删除成功");
    };

    const columns: ColumnsType<AdItem> = [
        {
            title: "图片(190x100)",
            width: 120,
            render: (_, row: AdItem) => (
                <AsyncImage width={100} src={row.img_url} preview={false} useRawImg={false} />
            ),
        },
        {
            title: "目标地址",
            render: (_, row: AdItem) => (
                <a href={row.url} target="_blank" rel="noreferrer">{row.url}</a>
            ),
        },
        {
            title: "权重",
            width: 150,
            render: (_, row: AdItem) => (
                <EditNumber editable={permInfo?.ad_perm.set_weight ?? false} value={row.weight} fixedLen={0} onChange={async (value: number) => {
                    try {
                        const sessionId = await get_admin_session();
                        await request(set_ad_weight({
                            admin_session_id: sessionId,
                            ad_id: row.ad_id,
                            weight: value,
                        }));
                        loadAdList();
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
            render: (_, row: AdItem) => (
                <Button type="link"
                    disabled={!(permInfo?.ad_perm.remove ?? false)}
                    danger style={{ minWidth: 0, paddingLeft: 0 }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveAdItem(row);
                    }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        loadAdList();
    }, []);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card title="广告管理"
            style={{ height: "calc(100vh - 40px)", overflowY: "scroll" }}
            extra={
                <Button
                    disabled={!(permInfo?.menu_perm.add ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }}><PlusOutlined />&nbsp;&nbsp;增加广告</Button>
            }>
            <Table rowKey="ad_id" columns={columns} dataSource={adList} pagination={false} />
            {showAddModal == true && (
                <Modal open title="添加广告"
                    okText="添加"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addAd();
                    }}>
                    <Form form={form} labelCol={{ span: 6 }} initialValues={{
                        imgUrl: "https://",
                        url: "https://",
                        weight: 0,
                    }}>
                        <Form.Item label="图片地址(190x100)" name="imgUrl" rules={[{ required: true, pattern: URL_REGEX }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="目标地址" name="url" rules={[{ required: true, pattern: URL_REGEX }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="权重" name="weight" rules={[{ required: true }]}>
                            <InputNumber controls={false} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeAdItem != null && (
                <Modal open title="删除广告"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveAdItem(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeAd();
                    }}>
                    是否删除&nbsp;{removeAdItem.url}&nbsp;?
                </Modal>
            )}
        </Card>
    );
};

export default AdAdmin;