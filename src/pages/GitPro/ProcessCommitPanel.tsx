import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "./stores";
import { Transfer } from "antd";
import { get_repo_status, add_to_index, remove_from_index } from "@/api/local_repo";


type FileStatus = {
    key: string;
    title: string;
    status: string;
    path: string;
};

const ProcessCommitPanel = () => {
    const gitProStore = useGitProStores();

    const [fileStatusList, setFileStatusList] = useState<FileStatus[]>([]);

    const loadFileStatus = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const res = await get_repo_status(gitProStore.repoInfo.path);
        const tmpList: FileStatus[] = [];
        for (const pathInfo of res.path_list) {
            for (const status of pathInfo.status) {
                tmpList.push({
                    key: `${status}:${pathInfo.path}`,
                    title: `${pathInfo.path}(${status})`,
                    path: pathInfo.path,
                    status: status,
                });
            }
        }
        setFileStatusList(tmpList);
    };

    const addToIndex = async (keyList: string[]) => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const pathList = fileStatusList.filter(item => keyList.includes(item.key)).map(item => item.path);
        await add_to_index(gitProStore.repoInfo.path, pathList);
        await loadFileStatus();
    };

    const removeFromIndex = async (keyList: string[]) => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const pathList = fileStatusList.filter(item => keyList.includes(item.key)).map(item => item.path);
        await remove_from_index(gitProStore.repoInfo.path, pathList);
        await loadFileStatus();
    };

    useEffect(() => {
        loadFileStatus();
    }, []);

    return (
        <div>
            <Transfer dataSource={fileStatusList} targetKeys={fileStatusList.filter(item => item.status.startsWith("INDEX_")).map(item => item.key)}
                titles={["工作目录", "暂存区"]} showSelectAll={false}
                render={item => item.title}
                oneWay
                listStyle={{ width: "calc(50vw - 130px)", height: "50vh" }}
                onChange={(_, direction, moveKeys) => {
                    if (direction == "right") {
                        addToIndex(moveKeys);
                    } else if (direction == "left") {
                        removeFromIndex(moveKeys);
                    }
                }} />
        </div>
    );
};

export default observer(ProcessCommitPanel);