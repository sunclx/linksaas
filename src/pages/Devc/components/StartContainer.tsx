import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { Command } from '@tauri-apps/api/shell';

export interface StartContainerProps {
    containerId: string;
    serverPort: number;
}

const StartContainer = (props: StartContainerProps) => {

    const [logs, setLogs] = useState("");

    const startContainer = async () => {
        const cmd = Command.sidecar("bin/devc", ["container", "start", props.containerId, `${props.serverPort}`]);
        cmd.on("close", () => {
            window.location.href = `http://127.0.0.1:${props.serverPort}/`;
        });
        cmd.stdout.on("data", line => {
            setLogs(oldValue => oldValue + line);
        });
        await cmd.spawn();
    };

    useEffect(() => {
        startContainer();
    }, []);

    return (
        <Card title="启动容器中..." bodyStyle={{ height: "calc(100vh - 40px)", overflowY: "scroll" }}>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{logs}</pre>
        </Card>
    );
};

export default StartContainer;