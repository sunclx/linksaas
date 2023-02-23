import { Checkbox, Form, Modal } from "antd";
import React, { useState } from "react";
import { update_app_scope } from "@/api/appstore_admin";
import { request } from "@/utils/request";
import { get_admin_session } from '@/api/admin_auth';

interface UpdateAppScopeModalProps {
    appId: string;
    userApp: boolean;
    projectApp: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const UpdateAppScopeModal: React.FC<UpdateAppScopeModalProps> = (props) => {
    const [userApp, setUserApp] = useState(props.userApp);
    const [projectApp, setProjectApp] = useState(props.projectApp);

    const updateAppScope = async () => {
        const sessionId = await get_admin_session();
        await request(update_app_scope({
            admin_session_id: sessionId,
            app_id: props.appId,
            user_app: userApp,
            project_app: projectApp,
        }));
        props.onOk();
    };

    return (
        <Modal open title="更新应用范围"
            okText="更新"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateAppScope();
            }}>
            <Form>
                <Form.Item label="应用范围">
                    <Checkbox checked={userApp} onChange={e => {
                        e.stopPropagation();
                        setUserApp(e.target.checked);
                    }}>用户应用</Checkbox>
                    <Checkbox checked={projectApp} onChange={e => {
                        e.stopPropagation();
                        setProjectApp(e.target.checked);
                    }}>项目应用</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateAppScopeModal;