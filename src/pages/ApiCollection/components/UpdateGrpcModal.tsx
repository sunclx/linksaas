import { Button, Card, Checkbox, Form, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";
import { get_rpc, update_rpc } from "@/api/api_collection";
import { useStores } from "@/hooks";
import { uniqId } from "@/utils/utils";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { make_tmp_dir, write_file, set_file_owner, FILE_OWNER_TYPE_API_COLLECTION } from "@/api/fs";
import { Command } from '@tauri-apps/api/shell';

export interface UpdateGrpcModalProps {
    apiCollId: string;
    onClose: () => void;
}

interface PathWrap {
    id: string;
    path: string;
}

const UpdateGrpcModal = (props: UpdateGrpcModalProps) => {
    const appStore = useStores("appStore");
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");

    const [grpcRootPath, setGrpcRootPath] = useState("");
    const [grpcImportPathList, setGrpcImportPathList] = useState<PathWrap[]>([]);
    const [grpcSecure, setGrpcSecure] = useState(false);

    const loadGrpcInfo = async () => {
        const res = await request(get_rpc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: props.apiCollId,
        }));
        setGrpcSecure(res.extra_info.secure);
    };

    const choiceRootPath = async () => {
        const selected = await open_dialog({
            title: "选择grpc接口定义路径",
            directory: true,
        });
        if ((selected == null) || (Array.isArray(selected))) {
            return;
        }
        setGrpcRootPath(selected);
    };

    const choiceImportPath = async (id: string) => {
        const selected = await open_dialog({
            title: "选择导入路径",
            directory: true,
        });
        if ((selected == null) || (Array.isArray(selected))) {
            return;
        }
        const tmpList = grpcImportPathList.slice();
        const index = tmpList.findIndex(item => item.id == id);
        if (index != -1) {
            tmpList[index].path = selected;
            setGrpcImportPathList(tmpList);
        }
    };

    const checkValid = (): boolean => {
        if (grpcRootPath == "") {
            return false;
        }
        for (const importPath of grpcImportPathList) {
            if (importPath.path == "") {
                return false;
            }
        }
        return true;
    }

    const updateGrpcApi = async () => {
        const tmpDir = await make_tmp_dir();
        let tmpFile = `${tmpDir}/grpc.data`;
        if (appStore.isOsWindows) {
            tmpFile = `${tmpDir}\\grpc.data`;
        }
        const args: string[] = ["parse", "--rootPath", grpcRootPath, "--outPath", tmpFile];
        for (const importPath of grpcImportPathList) {
            args.push("--importPath");
            args.push(importPath.path);
        }
        const cmd = Command.sidecar("bin/grpcutil", args);
        const output = await cmd.execute();
        const result = JSON.parse(output.stdout);
        if (result.error != undefined) {
            message.error(`无法编译grpc协议文件。${result.error}`)
            return;
        }
        //上传文件
        const upRes = await request(write_file(userStore.sessionId, projectStore.curProject?.api_coll_fs_id ?? "", tmpFile, ""));
        //更新api
        await request(update_rpc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            api_coll_id: props.apiCollId,
            proto_file_id: upRes.file_id,
            secure: grpcSecure,
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
        loadGrpcInfo();
    }, []);

    return (
        <Modal open title="更新GRPC协议" okText="更新" okButtonProps={{ disabled: !checkValid() }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateGrpcApi();
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="grpc路径">
                    <Input addonAfter={<Button type="text" style={{ height: "20px", minWidth: 0, padding: "0px 0px" }} icon={<FolderOpenOutlined />} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        choiceRootPath();
                    }} />} value={grpcRootPath} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGrpcRootPath(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="安全模式(tls)">
                    <Checkbox checked={grpcSecure} onChange={e => {
                        e.stopPropagation();
                        setGrpcSecure(e.target.checked);
                    }} />
                </Form.Item>
            </Form>
            <div>
                <Card title="导入路径" style={{ border: "none" }} headStyle={{ padding: "0px 0px 0px 20px" }} bodyStyle={{ padding: "10px 0px 0px 0px" }}
                    extra={
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const tmpList = grpcImportPathList.slice();
                            tmpList.push({
                                id: uniqId(),
                                path: "",
                            });
                            setGrpcImportPathList(tmpList);
                        }}>增加导入路径</Button>
                    }>
                    <Form labelCol={{ span: 5 }}>
                        {grpcImportPathList.map((item, index) => (
                            <Form.Item key={item.id} label={`路径${index + 1}`}>
                                <div style={{ display: "flex" }}>
                                    <Input addonAfter={<Button type="text" style={{ height: "20px", minWidth: 0, padding: "0px 0px" }} icon={<FolderOpenOutlined />} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        choiceImportPath(item.id);
                                    }} />} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        const tmpList = grpcImportPathList.slice();
                                        const itemIndex = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                        if (itemIndex != -1) {
                                            tmpList[itemIndex].path = e.target.value.trim();
                                            setGrpcImportPathList(tmpList);
                                        }
                                    }} value={item.path} />
                                    <Button type="text" danger style={{ minWidth: 0, padding: "0px 0px", marginLeft: "10px" }} icon={<DeleteOutlined />} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        const tmpList = grpcImportPathList.filter(tmpItem => tmpItem.id != item.id);
                                        setGrpcImportPathList(tmpList);
                                    }} />
                                </div>
                            </Form.Item>
                        ))}
                    </Form>
                </Card>
            </div>
        </Modal>
    );
}

export default observer(UpdateGrpcModal);