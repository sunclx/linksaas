import { Card, Checkbox, Form, Input, Modal, Select, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { API_COLL_GRPC, API_COLL_OPENAPI, create_rpc, create_open_api, API_COLL_CUSTOM } from "@/api/api_collection";
import Button from "@/components/Button";
import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { make_tmp_dir, write_file, set_file_owner, FILE_OWNER_TYPE_API_COLLECTION } from "@/api/fs";
import { Command } from '@tauri-apps/api/shell';
import { request } from "@/utils/request";
import { create_custom } from "@/api/http_custom";

export interface CreateApiCollModalProps {
    onCancel: () => void;
    onOk: () => void;
}

interface PathWrap {
    id: string;
    path: string;
}

const CreateApiCollModal = (props: CreateApiCollModalProps) => {
    const appStore = useStores("appStore");
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");

    const [apiName, setApiName] = useState("");
    const [apiCollType, setApiCollType] = useState(-1);
    const [defaultAddr, setDefaultAddr] = useState("");

    //grpc相关字段
    const [grpcRootPath, setGrpcRootPath] = useState("");
    const [grpcImportPathList, setGrpcImportPathList] = useState<PathWrap[]>([]);
    const [grpcSecure, setGrpcSecure] = useState(false);

    //openapi相关字段
    const [openApiPath, setOpenApiPath] = useState("");
    const [openApiProtocol, setOpenApiProtocol] = useState("http");

    //自定义接口相关字段
    const [customProtocol, setCustomProtocol] = useState("https");

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
        if (apiName == "") {
            return false;
        }
        if (defaultAddr.trim() == "") {
            return false;
        }
        if (apiCollType == API_COLL_GRPC) {
            if (defaultAddr.split(":").length != 2) {
                return false;
            }
            if (grpcRootPath == "") {
                return false;
            }
            for (const pathWrap of grpcImportPathList) {
                if (pathWrap.path == "") {
                    return false;
                }
            }
            return true;
        } else if (apiCollType == API_COLL_OPENAPI) {
            return openApiPath != "";
        } else if (apiCollType == API_COLL_CUSTOM) {
            return true;
        } else {
            return false;
        }
    };

    const createGrpcApi = async () => {
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
        //创建api
        const createRes = await request(create_rpc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            name: apiName,
            default_addr: defaultAddr,
            proto_file_id: upRes.file_id,
            secure: grpcSecure,
        }));
        //设置file owner
        await request(set_file_owner({
            session_id: userStore.sessionId,
            fs_id: projectStore.curProject?.api_coll_fs_id ?? "",
            file_id: upRes.file_id,
            owner_type: FILE_OWNER_TYPE_API_COLLECTION,
            owner_id: createRes.api_coll_id,
        }));
        message.info("创建成功");
        props.onOk();
    };

    const createOpenApi = async () => {
        //上传文件
        const upRes = await request(write_file(userStore.sessionId, projectStore.curProject?.api_coll_fs_id ?? "", openApiPath, ""));
        //创建api
        const createRes = await request(create_open_api({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            name: apiName,
            default_addr: defaultAddr,
            proto_file_id: upRes.file_id,
            net_protocol: openApiProtocol,
        }));
        //设置file owner
        await request(set_file_owner({
            session_id: userStore.sessionId,
            fs_id: projectStore.curProject?.api_coll_fs_id ?? "",
            file_id: upRes.file_id,
            owner_type: FILE_OWNER_TYPE_API_COLLECTION,
            owner_id: createRes.api_coll_id,
        }));
        message.info("创建成功");
        props.onOk();
    };

    const createCustomApi = async () => {
        await request(create_custom({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            name: apiName,
            default_addr: defaultAddr,
            net_protocol: customProtocol,
        }));
        message.info("创建成功");
        props.onOk();
    };

    return (
        <Modal open title="创建接口集合" okText="创建" okButtonProps={{ disabled: !checkValid() }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (apiCollType == API_COLL_GRPC) {
                    createGrpcApi();
                } else if (apiCollType == API_COLL_OPENAPI) {
                    createOpenApi();
                } else if (apiCollType == API_COLL_CUSTOM) {
                    createCustomApi();
                }
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="名称">
                    <Input value={apiName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setApiName(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="类型">
                    <Select value={apiCollType} onChange={value => setApiCollType(value)}>
                        <Select.Option value={-1}>未选择</Select.Option>
                        <Select.Option value={API_COLL_GRPC}>GRPC接口</Select.Option>
                        <Select.Option value={API_COLL_OPENAPI}>OPENAPI接口</Select.Option>
                        <Select.Option value={API_COLL_CUSTOM}>自定义接口</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="服务地址" help={
                    <>
                        {apiCollType == API_COLL_GRPC && defaultAddr !== "" && defaultAddr.split(":").length != 2 && (
                            <span style={{ color: "red" }}>请输入 地址:端口</span>
                        )}
                    </>
                }>
                    <Input value={defaultAddr} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDefaultAddr(e.target.value.trim());
                    }} />
                </Form.Item>
                {apiCollType == API_COLL_GRPC && (
                    <>
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
                    </>
                )}
                {apiCollType == API_COLL_OPENAPI && (
                    <>
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
                    </>
                )}
                {apiCollType == API_COLL_CUSTOM && (
                    <Form.Item label="网络协议">
                        <Select value={customProtocol} onChange={value => setCustomProtocol(value)}>
                            <Select.Option value="http">http</Select.Option>
                            <Select.Option value="https">https</Select.Option>
                        </Select>
                    </Form.Item>
                )}
            </Form>
            {apiCollType == API_COLL_GRPC && (
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
            )}
        </Modal>
    );
};

export default observer(CreateApiCollModal);