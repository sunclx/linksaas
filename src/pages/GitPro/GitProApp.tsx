import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGitProStores } from "./stores";
import { observer } from 'mobx-react';
import { Layout } from "antd";
import PrimaryPanel from "./PrimaryPanel";
import GraphPanel from "./GraphPanel";

const GitProApp = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("id") ?? "";

    const gitProStore = useGitProStores();

    useEffect(() => {
        gitProStore.loadRepoInfo(id);
    }, []);


    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Sider theme="light" width={200}>
                <PrimaryPanel/>
            </Layout.Sider>
            <Layout.Content>
                {gitProStore.commitIdForGraph !== "" && <GraphPanel />}
            </Layout.Content>
        </Layout>
    );
};

export default observer(GitProApp);