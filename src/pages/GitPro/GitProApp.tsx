import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGitProStores } from "./stores";
import { observer } from 'mobx-react';
import { Layout } from "antd";
import PrimaryPanel from "./PrimaryPanel";
import GraphPanel from "./GraphPanel";
import ProcessCommitPanel from "./ProcessCommitPanel";
import StashPanel from "./StashPanel";
import RemotePanel from "./RemotePanel";

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
                <PrimaryPanel />
            </Layout.Sider>
            <Layout.Content style={{ backgroundColor: "white" }}>
                {gitProStore.mainItem.menuType == "gitGraph" && <GraphPanel />}
                {gitProStore.mainItem.menuType == "commitProcess" && <ProcessCommitPanel />}
                {gitProStore.mainItem.menuType == "stashList" && <StashPanel />}
                {gitProStore.mainItem.menuType == "remote" && <RemotePanel />}
            </Layout.Content>
        </Layout>
    );
};

export default observer(GitProApp);