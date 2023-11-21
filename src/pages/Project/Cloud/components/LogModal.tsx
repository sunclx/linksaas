import React, { useEffect, useState } from "react";
import { type RESOURCE_TYPE, open_log, read_log } from "@/api/k8s_proxy";
import { Modal } from "antd";
import { uniqId } from "@/utils/utils";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { gen_one_time_token } from "@/api/project_member";

const readIdSet = new Set();
console.log("abcdefghijklmnopq");


export interface LogModalProps {
    nameSpace: string;
    resourceType: RESOURCE_TYPE;
    resourceName: string;
    podName: string;
    containerName: string;
    onCancel: () => void;
}

const LogModal = (props: LogModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [content, setContent] = useState("");

    const readLog = async (readId: string) => {
        const servAddr = projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        const openRes = await request(open_log(servAddr, {
            token: tokenRes.token,
            namespace: props.nameSpace,
            resource_type: props.resourceType,
            resource_name: props.resourceName,
            pod_name: props.podName,
            container_name: props.containerName,
        }));

        while (readIdSet.has(readId)) {
            const res = await request(read_log(servAddr, {
                log_id: openRes.log_id,
            }));
            setContent(oldValue => oldValue + res.data);
        }
    }

    useEffect(() => {
        const readId = uniqId();
        readIdSet.add(readId);
        readLog(readId);
        return () => {
            readIdSet.delete(readId)
        };
    }, []);

    return (
        <Modal open title="日志" width="calc(100vw - 200px)"
            bodyStyle={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}
            footer={null} onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {content}
            </pre>
        </Modal>
    );
};

export default LogModal;