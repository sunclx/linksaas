import React, { useState } from "react";
import type { AppPerm } from '@/api/appstore'
import { Modal } from "antd";
import AppPermPanel from "./AppPermPanel";
import { get_admin_session } from '@/api/admin_auth';
import { update_app_perm } from "@/api/appstore_admin";
import { request } from "@/utils/request";

interface UpdateAppPermModalProps {
    appId: string;
    appPerm: AppPerm;
    onCancel: () => void;
    onOk: () => void;
}

const UpdateAppPermModal: React.FC<UpdateAppPermModalProps> = (props) => {
    const [appPerm, setAppPerm] = useState(props.appPerm);

    const updatePerm = async () => {
        const sessionId = await get_admin_session();
        await request(update_app_perm({
            admin_session_id: sessionId,
            app_id: props.appId,
            app_perm: appPerm,
        }));
        props.onOk();
    };

    return (
        <Modal open title="更新应用权限"
            okText="更新"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updatePerm();
            }}>
            <AppPermPanel disable={false} showTitle={false} onChange={(perm) => setAppPerm(perm)}
                perm={props.appPerm} />
        </Modal>)
}

export default UpdateAppPermModal;