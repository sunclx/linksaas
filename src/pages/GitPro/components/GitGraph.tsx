import React, { useEffect, useRef } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "../stores";
import { list_commit_graph } from "@/api/local_repo";
import { createGitgraph, type CommitOptions } from "@gitgraph/js";
import s from "./GitGraph.module.less";

const GitGraph = () => {
    const gitProStore = useGitProStores();

    const graphRef = useRef<HTMLDivElement>(null);

    const initGraph = async () => {
        if (gitProStore.repoInfo == null || gitProStore.commitIdForGraph == "" || graphRef.current == null) {
            return;
        }
        graphRef.current.innerText = "";
        const gitgraph = createGitgraph(graphRef.current, { responsive: true });
        const commitList = await list_commit_graph(gitProStore.repoInfo.path, gitProStore.commitIdForGraph);
        for (const commit of commitList) {
            (commit as any as CommitOptions).onClick = () => {
                gitProStore.curCommit = commit;
                gitProStore.curDiffFile = null;
            };
            (commit as any as CommitOptions).onMessageClick = () => {
                gitProStore.curCommit = commit;
                gitProStore.curDiffFile = null;
            };
        }
        gitgraph.import(commitList);
    };

    useEffect(() => {
        initGraph();
    }, [gitProStore.repoInfo, gitProStore.commitIdForGraph, graphRef]);

    return (
        <div style={{ height: gitProStore.curDiffFile == null ? "100vh" : "50vh" }} className={s.graphWrap}>
            {gitProStore.commitIdForGraph != "" && <div ref={graphRef} />}
        </div>
    );
};

export default observer(GitGraph);