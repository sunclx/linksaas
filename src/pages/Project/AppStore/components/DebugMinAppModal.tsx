import { Button, Form, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import MinAppPermPanel from "./MinAppPermPanel";
import type { MinAppPerm } from "@/api/project_app";
import { observer } from 'mobx-react';
import { start_debug } from '@/api/min_app';
import { useStores } from "@/hooks";

interface DebugMinAppModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const DebugMinAppModal: React.FC<DebugMinAppModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [localPath, setLocalPath] = useState("");
    const [debugPerm, setDebugPerm] = useState<MinAppPerm>({
        net_perm: {
            cross_domain_http: false,
        },
        member_perm: {
            list_member: false,
            list_goal_history: false,
        },
        issue_perm: {
            list_my_task: false,
            list_all_task: false,
            list_my_bug: false,
            list_all_bug: false,
        },
        event_perm: {
            list_my_event: false,
            list_all_event: false,
        },
        fs_perm: {
            read_file: false,
            write_file: false,
        },
    });

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "打开本地应用目录",
            directory: true,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setLocalPath(selected);
    };

    const startDebug = async () => {
        if (localPath.trim() == "") {
            message.error("请选择本地目录");
            return;
        }

        await start_debug({
            project_id: projectStore.curProjectId,
            project_name: projectStore.curProject?.basic_info.project_name ?? "",
            member_user_id: userStore.userInfo.userId,
            member_display_name: userStore.userInfo.displayName,
            token_url: "",
            label: "minApp:debug",
            title: `调试微应用(${localPath})`,
            path: localPath,
        }, debugPerm);
        props.onOk();
    };

    return (
        <Modal open title="调试微应用"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                startDebug();
            }}>
            <Form>
                <Form.Item label="本地路径">
                    <Input value={localPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLocalPath(e.target.value);
                    }}
                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePath();
                        }} />} />
                </Form.Item>
            </Form>
            <MinAppPermPanel disable={false} onChange={perm => setDebugPerm(perm)} showTitle />
        </Modal>
    );
};

export default observer(DebugMinAppModal);