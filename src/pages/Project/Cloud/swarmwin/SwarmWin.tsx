import React from "react";
import { useLocation } from "react-router-dom";
import LogPanel from "./LogPanel";
import TermPanel from "./TermPanel";

const SwarmWin = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const winType = urlParams.get("winType") ?? "";
    const projectId = urlParams.get("projectId") ?? "";
    const servAddr = urlParams.get("servAddr") ?? "";
    const nameSpace = urlParams.get("nameSpace") ?? "";
    const containerId = urlParams.get("containerId") ?? "";

    return (
        <div>
            {winType == "log" && (
                <LogPanel servAddr={servAddr} projectId={projectId} nameSpace={nameSpace}
                    containerId={containerId} />
            )}
            {winType == "term" && (
                <TermPanel servAddr={servAddr} projectId={projectId} nameSpace={nameSpace}
                    containerId={containerId} />
            )}
        </div>
    )
};

export default SwarmWin;