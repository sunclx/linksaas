import React, { useEffect, useState } from "react";
import { open_log, read_log } from "@/api/swarm_proxy";
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";
import { get_session } from "@/api/user";


export interface LogPanelProps {
    servAddr: string;
    projectId: string;
    nameSpace: string;
    containerId: string;
}

const LogPanel = (props: LogPanelProps) => {

    const [content, setContent] = useState("");

    const readLog = async () => {
        const sessionId = await get_session();
        const tokenRes = await request(gen_one_time_token({
            session_id: sessionId,
            project_id: props.projectId,
        }));
        const openRes = await request(open_log(props.servAddr, {
            token: tokenRes.token,
            name_space: props.nameSpace,
            container_id: props.containerId,
        }));

        while (true) {
            const res = await request(read_log(props.servAddr, {
                log_id: openRes.log_id,
            }));
            setContent(oldValue => oldValue + res.data);
        }
    }

    useEffect(() => {
        readLog();
    }, []);

    return (
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", width: "100vw", height: "calc(100vh - 2px)", overflowY: "scroll" }}>
            {content}
        </pre>
    );
};

export default LogPanel;