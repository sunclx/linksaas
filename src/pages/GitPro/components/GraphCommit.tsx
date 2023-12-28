import React from "react";
import { observer } from 'mobx-react';
import GitGraph from "./GitGraph";
import { useGitProStores } from "../stores";
import CommitAndFileList from "./CommitAndFileList";

const GraphCommit = () => {
    const gitProStore = useGitProStores();

    return (
        <div style={{ display: "flex", flex: 1 }}>
            <div style={{ flex: 1 }}>
                <GitGraph />
            </div>
            {gitProStore.curCommit != null && (
                <div style={{ width: "300px" }}>
                    <CommitAndFileList />
                </div>
            )}
        </div>
    );
};

export default observer(GraphCommit);