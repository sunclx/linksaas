import { Checkbox, Form, Modal } from "antd";
import React, { useState } from "react";
import { update_app_os } from "@/api/appstore_admin";
import { request } from "@/utils/request";
import { get_admin_session } from '@/api/admin_auth';

interface UpdateAppOsModalProps {
    appId: string;
    osWindows: boolean;
    osMac: boolean;
    osLinux: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const UpdateAppOsModal: React.FC<UpdateAppOsModalProps> = (props) => {
    const [osWindows, setOsWindows] = useState(props.osWindows);
    const [osMac, setOsMac] = useState(props.osMac);
    const [osLinux, setOsLinux] = useState(props.osLinux);

    const updateAppOs = async () => {
        const sessionId = await get_admin_session();
        await request(update_app_os({
            admin_session_id: sessionId,
            app_id: props.appId,
            os_windows: osWindows,
            os_mac: osMac,
            os_linux: osLinux,
        }));
        props.onOk();
    };

    return (
        <Modal open title="更新发布系统"
            okText="更新"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateAppOs();
            }}>
            <Form>
                <Form.Item label="发布系统">
                    <Checkbox checked={osWindows} onChange={e => {
                        e.stopPropagation();
                        setOsWindows(e.target.checked);
                    }}>windows</Checkbox>
                    <Checkbox checked={osMac} onChange={e => {
                        e.stopPropagation();
                        setOsMac(e.target.checked);
                    }}>mac</Checkbox>
                    <Checkbox checked={osLinux} onChange={e => {
                        e.stopPropagation();
                        setOsLinux(e.target.checked);
                    }}>linux</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateAppOsModal;