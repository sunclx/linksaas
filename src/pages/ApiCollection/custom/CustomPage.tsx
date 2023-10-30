import { Layout } from "antd";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCustomStores } from "./stores";
import { observer } from 'mobx-react';
import CustomGroupList from "./CustomGroupList";
import ApiList from "./ApiList";
import { get_user_id } from "@/api/user";

const CustomPage = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") ?? "";
    const apiCollId = urlParams.get("apiCollId") ?? "";
    const remoteAddr = urlParams.get("remoteAddr") ?? "";
    const editStr = urlParams.get("edit") ?? "";
    const canAdmin = (urlParams.get("admin") ?? "false").toLocaleLowerCase();

    const store = useCustomStores();


    useEffect(() => {
        store.api.canEdit = editStr.toLowerCase().includes("true");
        store.api.apiCollId = apiCollId;
        store.api.projectId = projectId;
        store.api.remoteAddr = remoteAddr;
        store.api.canAdmin = canAdmin == "true";
        get_user_id().then(userId => store.api.userId = userId);
        store.api.initUser().then(() => {
            store.api.loadApiCollInfo();
            store.api.loadGroupList();
            store.api.loadApiItemList();
        });
    }, []);

    return (
        <Layout hasSider style={{ height: "100vh" }}>
            <Layout.Sider width={"200px"} theme="light" style={{ borderRight: "1px solid #e4e4e8" }}>
                {store.api.apiCollInfo != null && (
                    <CustomGroupList />
                )}

            </Layout.Sider>
            <Layout.Content style={{ backgroundColor: "white" }}>
                {store.api.apiCollInfo != null && (
                    <ApiList />
                )}
            </Layout.Content>
        </Layout>
    );
};

export default observer(CustomPage);