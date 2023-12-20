import { Card } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Command } from '@tauri-apps/api/shell';

export interface StartContainerProps {
    containerId: string;
    serverPort: number;
}

const StartContainer = (props: StartContainerProps) => {
    const endRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState("");

    const startContainer = async () => {
        const cmd = Command.sidecar("bin/devc", ["container", "start", props.containerId, `${props.serverPort}`]);
        cmd.on("close", () => {
            window.location.href = `http://127.0.0.1:${props.serverPort}/`;
        });
        cmd.stdout.on("data", line => {
            setLogs(oldValue => oldValue + line);
            endRef.current?.scrollIntoView();
        });
        await cmd.spawn();
    };

    useEffect(() => {
        startContainer();
    }, []);

    return (
        <Card title="启动容器中(第一次启动需要数分钟)..." bodyStyle={{ height: "calc(100vh - 40px)", overflowY: "scroll", backgroundColor: "black", color: "white" }}>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {logs}
                <div ref={endRef}/>
            </pre>
        </Card>
    );
};

export default StartContainer;