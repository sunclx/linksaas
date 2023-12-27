import React from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "./stores";
import GraphCommit from "./components/GraphCommit";
import DiffFile from "./components/DiffFile";

const GraphPanel = () => {
    const gitProStore = useGitProStores();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <GraphCommit />
            {gitProStore.curCommit != null && gitProStore.curDiffFile != null && <DiffFile />}
        </div>
    );
};

export default observer(GraphPanel);