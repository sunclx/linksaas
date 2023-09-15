import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';
import { Button, Card, Form, Input, Modal, Space, message } from "antd";
import { get_open_api } from "@/api/api_collection";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import { download_file } from "@/api/fs";
import { readTextFile } from '@tauri-apps/api/fs';
import YAML from 'yaml'
import { EditOutlined } from "@ant-design/icons";

const SwaggerPage = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") ?? "";
    const apiCollId = urlParams.get("apiCollId") ?? "";
    const fsId = urlParams.get("fsId") ?? "";
    const remoteAddr = urlParams.get("remoteAddr") ?? "";
    const editStr = urlParams.get("edit") ?? "";

    const [spec, setSpec] = useState<object | null>(null);
    const [addr, setAddr] = useState("");
    const [tmpAddr, setTmpAddr] = useState("");
    const [inEdit, setInEdit] = useState(false);

    const loadSpec = async () => {
        const sessionId = await get_session();
        const infoRes = await request(get_open_api({
            session_id: sessionId,
            project_id: projectId,
            api_coll_id: apiCollId,
        }));
        //下载文件
        const downloadRes = await download_file(sessionId, fsId, infoRes.extra_info.proto_file_id, "", "swagger.data");
        if (downloadRes.exist_in_local == false) {
            message.error("OPENAPI定义不存在");
            return;
        }
        const specData = await readTextFile(downloadRes.local_path);
        //解析文件
        let tmpSpec: object | null = null;
        try {
            tmpSpec = JSON.parse(specData);
        } catch (e) {
            console.log(e);
        }
        if (tmpSpec == null) {
            try {
                tmpSpec = YAML.parse(specData)
            } catch (e) {
                console.log(e);
            }
        }
        if (tmpSpec == null) {
            message.error("无法解析OPENAPI定义");
            return;
        }
        //设置servers
        (tmpSpec as any).servers = [
            {
                url: `${infoRes.extra_info.net_protocol}://${remoteAddr}`
            }
        ];
        setAddr(`${infoRes.extra_info.net_protocol}://${remoteAddr}`);
        setSpec(tmpSpec);
    };

    useEffect(() => {
        loadSpec();
    }, []);

    return (
        <Card bodyStyle={{ height: "calc(100vh - 40px)", overflowY: "auto" }} extra={
            <div style={{ height: "30px", display: "flex", justifyContent: "flex-end" }}>
                {spec !== null && (
                    <Space>
                        <span>{addr}</span>
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setTmpAddr(addr);
                            setInEdit(true);
                        }} disabled={editStr.toLowerCase().includes("false")}><EditOutlined /></Button>
                    </Space>
                )}
            </div>
        }>
            {spec !== null && (
                <SwaggerUI spec={spec} />
            )}
            {inEdit == true && (
                <Modal open title="更新访问地址"
                    okText="更新" okButtonProps={{ disabled: tmpAddr == "" || tmpAddr == addr }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setInEdit(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!(tmpAddr.startsWith("http://") || (tmpAddr.startsWith("https://")))) {
                            message.error("不是合法的URL")
                            return;
                        }
                        setInEdit(false);
                        setAddr(tmpAddr);
                        const tmpSpec = Object.assign({}, spec);
                        (tmpSpec as any).servers = [
                            {
                                url: tmpAddr,
                            }
                        ];
                        setSpec(tmpSpec);
                    }}>
                    <Form>
                        <Form.Item label="URL" help={
                            <>
                                {!(tmpAddr.startsWith("http://") || (tmpAddr.startsWith("https://"))) && (
                                    <span style={{ color: "red" }}>不是合法的URL</span>
                                )}
                            </>
                        }>
                            <Input value={tmpAddr} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setTmpAddr(e.target.value.trim());
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </Card>
    );
}

export default SwaggerPage;