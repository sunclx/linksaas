import { Form, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { get_admin_session } from '@/api/admin_auth';
import { request } from "@/utils/request";
import { add_package } from "@/api/dev_container_admin";



export interface AddPkgModalProps {
    onCancel: () => void;
    onOk: () => void;
}


const AddPkgModal = (props: AddPkgModalProps) => {
    const [pkgName, setPkgName] = useState("");

    const addPkg = async () => {
        const sessionId = await get_admin_session();
        await request(add_package({
            admin_session_id: sessionId,
            package_name: pkgName,
        }));
        message.info(`增加软件包${pkgName}成功`);
        props.onOk();
    };

    return (
        <Modal open title="增加软件包"
            okText="增加" okButtonProps={{ disabled: pkgName == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addPkg();
            }}>
            <Form>
                <Form.Item label="软件包名称">
                    <Input value={pkgName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setPkgName(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPkgModal;