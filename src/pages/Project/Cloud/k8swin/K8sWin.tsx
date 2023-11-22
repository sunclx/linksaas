import React from "react";
import { useLocation } from "react-router-dom";
import { type RESOURCE_TYPE } from "@/api/k8s_proxy";
import LogPanel from "./LogPanel";
import TermPanel from "./TermPanel";

const K8sWin = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const winType = urlParams.get("winType") ?? "";
    const projectId = urlParams.get("projectId") ?? "";
    const servAddr = urlParams.get("servAddr") ?? "";
    const nameSpace = urlParams.get("nameSpace") ?? "";
    const resourceTypeStr = urlParams.get("resourceType") ?? "0";
    const resourceType = parseInt(resourceTypeStr) as RESOURCE_TYPE;
    const resourceName = urlParams.get("resourceName") ?? "";
    const podName = urlParams.get("podName") ?? "";
    const containerName = urlParams.get("containerName") ?? "";

    return (
        <div>
            {winType == "log" && (
                <LogPanel servAddr={servAddr} projectId={projectId} nameSpace={nameSpace}
                    resourceType={resourceType} resourceName={resourceName}
                    podName={podName} containerName={containerName} />
            )}
            {winType == "term" && (
                <TermPanel servAddr={servAddr} projectId={projectId} nameSpace={nameSpace}
                    resourceType={resourceType} resourceName={resourceName}
                    podName={podName} containerName={containerName} />
            )}
        </div>
    )
};

export default K8sWin;