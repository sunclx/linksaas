import { Form, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { add_package_version } from "@/api/dev_container_admin";
import { get_admin_session } from "@/api/admin_auth";
import { request } from "@/utils/request";

export interface AddVersionModalProps {
    pkgName: string;
    onCancel: () => void;
    onOk: () => void;
}

const AddVersionModal = (props: AddVersionModalProps) => {
    const [version, setVersion] = useState("");


    const addVersion = async () => {
        const sessionId = await get_admin_session();
        await request(add_package_version({
            admin_session_id: sessionId,
            package_name: props.pkgName,
            version: version,
        }));
        message.info(`增加版本成功`);
        props.onOk();
    };

    return (
        <Modal open title="增加版本"
            okText="增加" okButtonProps={{ disabled: version == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addVersion();
            }}>
            <Form>
                <Form.Item label="软件包版本">
                    <Input value={version} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setVersion(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddVersionModal;