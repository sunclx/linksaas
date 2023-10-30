import { Layout, message } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_rpc } from "@/api/api_collection";
import { get_session, get_user_id } from "@/api/user";
import { request } from "@/utils/request";
import { download_file } from "@/api/fs";
import ServiceList from "./ServiceList";
import type { MethodWithServiceInfo } from "./types";
import MethodCallList from "./MethodCallList";

const GrpcPage = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") ?? "";
    const apiCollId = urlParams.get("apiCollId") ?? "";
    const fsId = urlParams.get("fsId") ?? "";
    const remoteAddr = urlParams.get("remoteAddr") ?? "";
    const canAdminStr = (urlParams.get("admin") ?? "false").toLocaleLowerCase();

    const [protoPath, setProtoPath] = useState("");
    const [secure, setSecure] = useState(false);
    const [curMethodList, setCurMethodList] = useState<MethodWithServiceInfo[]>([]);
    const [userId, setUserId] = useState("");

    const loadGrpcInfo = async () => {
        const sessionId = await get_session();
        const infoRes = await request(get_rpc({
            session_id: sessionId,
            project_id: projectId,
            api_coll_id: apiCollId,
        }));
        const downloadRes = await download_file(sessionId, fsId, infoRes.extra_info.proto_file_id, "", "grpc.data");
        if (downloadRes.exist_in_local == false) {
            message.error("GRPC定义不存在");
            return;
        }
        setProtoPath(downloadRes.local_path);
        setSecure(infoRes.extra_info.secure);
    };

    useEffect(() => {
        loadGrpcInfo();
        get_user_id().then(value => setUserId(value));
    }, []);

    return (
        <Layout hasSider style={{ height: "100vh" }}>
            <Layout.Sider width={"200px"} theme="light">
                {protoPath !== "" && (
                    <ServiceList protoPath={protoPath} curMethodList={curMethodList} onSelect={method => {
                        const tmpList = curMethodList.slice();
                        const index = tmpList.findIndex(item => item.serviceName == method.serviceName && item.method.methodName == method.method.methodName);
                        if (index == -1) {
                            tmpList.push(method);
                            setCurMethodList(tmpList);
                        }
                    }} />
                )}
            </Layout.Sider>
            <Layout.Content>
                {protoPath !== "" && (
                    <>
                        {userId != "" && (
                            <MethodCallList remoteAddr={remoteAddr} secure={secure} protoPath={protoPath} curMethodList={curMethodList} onClose={method => {
                                const tmpList = curMethodList.filter(item => !(item.serviceName == method.serviceName && item.method.methodName == method.method.methodName));
                                setCurMethodList(tmpList);
                            }}
                                projectId={projectId} canAdmin={canAdminStr == "true"} apiCollId={apiCollId} userId={userId}
                            />
                        )}


                    </>
                )}
            </Layout.Content>
        </Layout>
    );
};

export default GrpcPage;