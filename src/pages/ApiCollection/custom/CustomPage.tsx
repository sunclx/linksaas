import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomGroupList from "./CustomGroupList";
import type { ApiCollInfo } from "@/api/api_collection";
import { get as get_coll_info } from "@/api/api_collection";
import { get_session, get_user_id } from "@/api/user";
import { request } from "@/utils/request";
import { get_custom } from "@/api/http_custom";

const CustomPage = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") ?? "";
    const apiCollId = urlParams.get("apiCollId") ?? "";
    const remoteAddr = urlParams.get("remoteAddr") ?? "";
    const adminStr = urlParams.get("admin") ?? "";


    const [curUserId, setCurUserId] = useState("");
    const [collInfo, setCollInfo] = useState<ApiCollInfo | null>(null);
    const [customProtocol, setCustomProtocol] = useState("https");
    const [curApiIdList, setCurApiIdList] = useState<string[]>([]);

    const loadCustomInfo = async () => {
        const sessionId = await get_session();
        const res = await request(get_coll_info({
            session_id: sessionId,
            project_id: projectId,
            api_coll_id: apiCollId,
        }));
        setCollInfo(res.info);
        const res2 = await request(get_custom({
            session_id: sessionId,
            project_id: projectId,
            api_coll_id: apiCollId,
        }));
        setCustomProtocol(res2.extra_info.net_protocol);
        const userId = await get_user_id();
        setCurUserId(userId);
    };

    useEffect(() => {
        loadCustomInfo();
    }, []);
    return (
        <Layout hasSider style={{ height: "100vh" }}>
            <Layout.Sider width={"200px"} theme="light">
                {collInfo != null && (
                    <CustomGroupList projectId={projectId} collInfo={collInfo} curUserId={curUserId} isAdminUser={adminStr.toLowerCase().includes("true")}
                        curApiIdList={curApiIdList} setCurApiIdList={apiItemIdList => setCurApiIdList(apiItemIdList)} />
                )}

            </Layout.Sider>
            <Layout.Content>
                xxx
            </Layout.Content>
        </Layout>
    );
};

export default CustomPage;