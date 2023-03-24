import { useStores } from "@/hooks";
import { Button, Checkbox, Form, Input, Modal, Tooltip, message } from "antd";
import React, { useState } from "react";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { FolderOpenOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import { get_local_api_token, renew_local_api_token } from "@/api/project";
import { request } from "@/utils/request";
import { set_git_hook } from "@/api/project_tool";


const GitHookToolModal = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [gitPath, setGitPath] = useState("");
    const [postHook, setPostHook] = useState(true);

    const choicePath = async () => {
        const selected = await open_dialog({
            title: "GIT仓库路径",
            directory: true,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        setGitPath(selected);
    };

    const setHooks = async () => {
        const tokenRes = await request(get_local_api_token(userStore.sessionId, projectStore.curProjectId));
        if (tokenRes.token == "") {
            if (!projectStore.isAdmin) {
                message.error("项目访问令牌为空，请管理员生成项目访问令牌。")
                return;
            }
            const renewRes = await request(renew_local_api_token(userStore.sessionId, projectStore.curProjectId));
            tokenRes.token = renewRes.token;
        }
        await set_git_hook(gitPath, projectStore.curProjectId, tokenRes.token, postHook);
        message.info("设置git hooks成果");
        projectStore.projectTool = null;
    };

    return (
        <Modal open mask={false} title="设置Git Hooks"
            okText="设置" okButtonProps={{ disabled: gitPath.trim() == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                projectStore.projectTool = null;
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                setHooks();
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="GIT仓库路径">
                    <Input value={gitPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGitPath(e.target.value);
                    }}
                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePath();
                        }} />} />
                </Form.Item>
                <Form.Item label="Hooks">
                    <Checkbox checked={postHook} onChange={e => {
                        e.stopPropagation();
                        setPostHook(e.target.checked);
                    }}>POST_COMMIT 唤醒应用&nbsp;
                        <Tooltip title="在运行git comment命令后，唤起应用界面进行通知同事和变更任务/缺陷。"><QuestionCircleOutlined /></Tooltip>
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(GitHookToolModal);