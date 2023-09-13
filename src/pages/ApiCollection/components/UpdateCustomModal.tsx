import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Form, Modal, Select, message } from "antd";
import { get_custom, update_custom } from "@/api/http_custom";
import { request } from "@/utils/request";

export interface UpdateCustomModalProps {
    apiCollId: string;
    onClose: () => void;
}

const UpdateCustomModal = (props: UpdateCustomModalProps) => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");

    const [netProtocol, setNetProtocol] = useState("https");
    const [hasChange, setHasChange] = useState(false);

    const loadCustomApiInfo = async () => {
        const res = await request(get_custom({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: props.apiCollId,
        }));
        setNetProtocol(res.extra_info.net_protocol);
    };

    const updateCustomApiInfo = async () => {
        await request(update_custom({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: props.apiCollId,
            net_protocol: netProtocol,
        }));
        message.info("更新成功");
        props.onClose();
    };

    useEffect(() => {
        loadCustomApiInfo();
    }, []);

    return (
        <Modal open title="更新自定义接口设置" okText="更新" okButtonProps={{ disabled: !hasChange }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateCustomApiInfo();
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="网络协议">
                    <Select value={netProtocol} onChange={value => {
                        setNetProtocol(value);
                        setHasChange(true);
                    }}>
                        <Select.Option value="http">http</Select.Option>
                        <Select.Option value="https">https</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(UpdateCustomModal);