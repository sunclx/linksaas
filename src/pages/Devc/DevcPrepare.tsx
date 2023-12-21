import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Command } from '@tauri-apps/api/shell';
import { message } from "antd";
import BuildImage from "./components/BuildImage";
import type { CommandResult, ContainerInfo } from "./components/types";
import ResolveContainer from "./components/ResolveContainer";
import StartContainer from "./components/StartContainer";

const DevcPrepare = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const repoId = urlParams.get("repoId") ?? "";
    const repoPath = urlParams.get("repoPath") ?? "";

    const [imageExist, setImageExist] = useState<boolean | null>(null);
    const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);

    const checkImageExist = async () => {
        const cmd = Command.sidecar("bin/devc", ["image", "exist"]);
        const output = await cmd.execute();
        const result = JSON.parse(output.stdout) as CommandResult;
        if (result.success) {
            setImageExist(result.data ?? false);
        } else {
            message.error("未安装/启动Docker");
        }
    };


    useEffect(() => {
        if (imageExist == null) {
            checkImageExist()
        }
    }, [imageExist]);

    return (
        <>
            {imageExist == false && (<BuildImage onOk={() => checkImageExist()} />)}
            {imageExist == true && (
                <>
                    {containerInfo == null && (<ResolveContainer repoId={repoId} repoPath={repoPath} onOk={info => setContainerInfo(info)} />)}
                    {containerInfo != null && (<StartContainer containerId={containerInfo.containerId} serverPort={containerInfo.serverPort} />)}
                </>
            )}
        </>
    )
};

export default DevcPrepare;