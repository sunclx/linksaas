import { Card } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Command } from '@tauri-apps/api/shell';

export interface BuildImageProps {
    onOk: () => void;
}

const BuildImage = (props: BuildImageProps) => {
    const endRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState("");

    const runBuildImage = async () => {
        const cmd = Command.sidecar("bin/devc", ["image", "build"]);
        cmd.on("close", () => props.onOk());
        cmd.stdout.on("data", line => {
            const obj = JSON.parse(line);
            if ("stream" in obj) {
                setLogs(oldValue => oldValue + obj.stream)
                endRef.current?.scrollIntoView();
            }
        });
        await cmd.spawn();
    };

    useEffect(() => {
        runBuildImage();
    }, []);

    return (
        <Card title="构建研发镜像中(需要等待数分钟)..." bodyStyle={{ height: "calc(100vh - 40px)", overflowY: "scroll", backgroundColor: "black", color: "white" }}>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {logs}
                <div ref={endRef} />
            </pre>
        </Card>
    )
};

export default BuildImage;