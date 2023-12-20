import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { Command } from '@tauri-apps/api/shell';

export interface BuildImageProps {
    onOk: () => void;
}

const BuildImage = (props: BuildImageProps) => {

    const [logs, setLogs] = useState("");

    const runBuildImage = async () => {
        const cmd = Command.sidecar("bin/devc", ["image", "build"]);
        cmd.on("close", () => props.onOk());
        cmd.stdout.on("data", line => {
            const obj = JSON.parse(line);
            if ("stream" in obj) {
                setLogs(oldValue => oldValue + obj.stream)
            }
        });
        await cmd.spawn();
    };

    useEffect(() => {
        runBuildImage();
    }, []);

    return (
        <Card title="构建研发镜像中(需要等待数分钟)..." bodyStyle={{ height: "calc(100vh - 40px)", overflowY: "scroll", backgroundColor: "black", color: "white" }}>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{logs}</pre>
        </Card>
    )
};

export default BuildImage;