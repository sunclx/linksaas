import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';
import { Card, message } from "antd";
import { get_open_api } from "@/api/api_collection";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import { download_file } from "@/api/fs";
import { readTextFile } from '@tauri-apps/api/fs';
import YAML from 'yaml'
import { EditText } from "@/components/EditCell/EditText";

const SwaggerPage = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") ?? "";
    const apiCollId = urlParams.get("apiCollId") ?? "";
    const fsId = urlParams.get("fsId") ?? "";
    const remoteAddr = urlParams.get("remoteAddr") ?? "";

    const [spec, setSpec] = useState<object | null>(null);
    const [addr, setAddr] = useState("");

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
            <div style={{ height: "30px", width: "200px" }}>
                {spec !== null && (
                    <EditText editable={true} content={addr} showEditIcon={true}
                        onChange={async value => {
                            if (!(value.startsWith("http://") || value.startsWith("https://"))) {
                                message.error("非法的http地址")
                                return false;
                            }
                            const tmpSpec = Object.assign({}, spec);
                            (tmpSpec as any).servers = [
                                {
                                    url: value.trim(),
                                }
                            ];
                            setSpec(tmpSpec);
                            return true;
                        }} />
                )}
            </div>
        }>
            {spec !== null && (
                <SwaggerUI spec={spec} />
            )}
        </Card>
    );
}

export default SwaggerPage;