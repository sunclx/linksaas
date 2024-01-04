import React, { useEffect, useRef } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "../stores";
import { list_commit_graph } from "@/api/local_repo";
import { createGitgraph, type CommitOptions, MergeStyle } from "@gitgraph/js";
import s from "./GitGraph.module.less";

const GitGraph = () => {
    const gitProStore = useGitProStores();

    const graphRef = useRef<HTMLDivElement>(null);

    const initGraph = async () => {
        if (gitProStore.repoInfo == null || gitProStore.mainItem.menuType != "gitGraph" || graphRef.current == null) {
            return;
        }
        graphRef.current.innerText = "";
        const gitgraph = createGitgraph(graphRef.current, {
            responsive: true,
            template: {
                colors: ["#6963FF", "#47E8D4", "#6BDB52", "#E84BA5", "#FFA657"],
                branch: {
                    lineWidth: 4,
                    spacing: 50,
                    mergeStyle: MergeStyle.Straight,
                    label: {
                        display: true,
                        bgColor: "white",
                        borderRadius: 10,
                    },
                },
                commit: {
                    spacing: 60,
                    hasTooltipInCompactMode: true,
                    dot: {
                        size: 8,
                        font: "normal 14px monospace",
                    },
                    message: {
                        color: "black",
                        display: true,
                        displayAuthor: false,
                        displayHash: true,
                        font: "normal 14px monospace",
                    },
                },
                arrow: {
                    color: null,
                    size: 8,
                    offset: -1.5,
                },
                tag: {},
            },
        });
        const commitList = await list_commit_graph(gitProStore.repoInfo.path, gitProStore.mainItem.menuValue);
        for (const commit of commitList) {
            const options = commit as any as CommitOptions;
            options.onClick = () => {
                gitProStore.curCommit = commit;
                gitProStore.curDiffFile = null;
            };
            options.onMessageClick = () => {
                gitProStore.curCommit = commit;
                gitProStore.curDiffFile = null;
            };
        }
        gitgraph.import(commitList);
    };

    useEffect(() => {
        initGraph();
    }, [gitProStore.repoInfo, gitProStore.mainItem, graphRef]);

    return (
        <div style={{ height: gitProStore.curDiffFile == null ? "calc(100vh - 45px)" : "calc(50vh - 45px)" }} className={s.graphWrap}>
            {gitProStore.mainItem.menuValue != "" && <div ref={graphRef} />}
        </div>
    );
};

export default observer(GitGraph);