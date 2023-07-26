import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { get_open_api, update_open_api } from "@/api/api_collection";
import { request } from "@/utils/request";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { FILE_OWNER_TYPE_API_COLLECTION, set_file_owner, write_file } from "@/api/fs";
import { FolderOpenOutlined } from "@ant-design/icons";

export interface UpdateSwaggerModalProps {
    apiCollId: string;
    onClose: () => void;
}

const UpdateSwaggerModal = (props: UpdateSwaggerModalProps) => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");

    const [openApiPath, setOpenApiPath] = useState("");
    const [openApiProtocol, setOpenApiProtocol] = useState("http");

    const loadOpenApiInfo = async () => {
        const res = await request(get_open_api({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: props.apiCollId,
        }));
        setOpenApiProtocol(res.extra_info.net_protocol);
    };

    const choiceOpenApiPath = async () => {
        const selected = await open_dialog({
            title: "选择openapi定义文件",
            filters: [
                {
                    name: "json文件",
                    extensions: ["json"],
                },
                {
                    name: "yaml文件",
                    extensions: ["yml", "yaml"]
                }
            ],
        });
        if ((selected == null) || (Array.isArray(selected))) {
            return;
        }
        setOpenApiPath(selected);
    };

    const checkValid = (): boolean => {
        if (openApiPath == "") {
            return false;
        }
        return true;
    }

    const updateOpenApi = async () => {
        //上传文件
        const upRes = await request(write_file(userStore.sessionId, projectStore.curProject?.api_coll_fs_id ?? "", openApiPath, ""));
        //更新api
        await request(update_open_api({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: props.apiCollId,
            proto_file_id: upRes.file_id,
            net_protocol: openApiProtocol,
        }));
        //设置file owner
        await request(set_file_owner({
            session_id: userStore.sessionId,
            fs_id: projectStore.curProject?.api_coll_fs_id ?? "",
            file_id: upRes.file_id,
            owner_type: FILE_OWNER_TYPE_API_COLLECTION,
            owner_id: props.apiCollId,
        }));
        message.info("更新成功");
        props.onClose();
    };

    useEffect(() => {
        loadOpenApiInfo();
    }, []);

    return (
        <Modal open title="更新OPENAPI协议" okText="更新" okButtonProps={{ disabled: !checkValid() }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateOpenApi();
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="openapi文件路径">
                    <Input addonAfter={<Button type="text" style={{ height: "20px", minWidth: 0, padding: "0px 0px" }} icon={<FolderOpenOutlined />} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        choiceOpenApiPath();
                    }} />} value={openApiPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenApiPath(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="网络协议">
                    <Select value={openApiProtocol} onChange={value => setOpenApiProtocol(value)}>
                        <Select.Option value="http">http</Select.Option>
                        <Select.Option value="https">https</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default observer(UpdateSwaggerModal);