import React, { useEffect, useRef, useState } from "react";
import { type RESOURCE_TYPE, open_term, read_term, write_term, set_term_size } from "@/api/k8s_proxy";
import { Modal } from "antd";
import { uniqId } from "@/utils/utils";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { gen_one_time_token } from "@/api/project_member";
import { Terminal } from 'xterm';
import "xterm/css/xterm.css";
import { useSize } from 'ahooks';
import { FitAddon } from 'xterm-addon-fit';


const readIdSet = new Set();

export interface TermModalProps {
    nameSpace: string;
    resourceType: RESOURCE_TYPE;
    resourceName: string;
    podName: string;
    containerName: string;
    onCancel: () => void;
}

const TermModal = (props: TermModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const termRef = useRef<HTMLDivElement | null>(null);
    const termSize = useSize(termRef);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_termInit, setTermInit] = useState(false);
    const [shellTerm, setShellTerm] = useState<Terminal | null>(null);
    const [fitAddon, setFitAddon] = useState<FitAddon | null>(null);

    const [termId, setTermId] = useState("");


    const readTermResponse = async (readId: string) => {
        const servAddr = projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        if (shellTerm == null) {
            return;
        }
        const openRes = await request(open_term(servAddr, {
            token: tokenRes.token,
            namespace: props.nameSpace,
            resource_type: props.resourceType,
            resource_name: props.resourceName,
            pod_name: props.podName,
            container_name: props.containerName,
            shell_cmd: "/bin/sh",
            term_width: shellTerm.cols,
            term_height: shellTerm.rows,
        }));
        setTermId(openRes.term_id);
        while (readIdSet.has(readId)) {
            const res = await request(read_term(servAddr, {
                term_id: openRes.term_id,
            }));
            shellTerm.write(Uint8Array.from(res.data));
        }
    }

    const writeData = async (data: string) => {
        let destTermId = "";
        setTermId(oldValue => {
            destTermId = oldValue;
            return oldValue;
        })
        if (destTermId == "") {
            return;
        }
        const rawData: number[] = [];
        for (let i = 0; i < data.length; i++) {
            rawData.push(data.charCodeAt(i));
        }
        const servAddr = projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        await request(write_term(servAddr, {
            term_id: destTermId,
            data: rawData,
        }));
    }

    const initTerm = () => {
        if (termRef.current == null) {
            return;
        }
        const term = new Terminal();
        term.onKey(ev => writeData(ev.key));
        term.open(termRef.current);
        termRef.current.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        const addon = new FitAddon();
        term.loadAddon(addon);
        setShellTerm(term);
        setFitAddon(addon);
    };

    const adjustTerm = async () => {
        if (shellTerm == null || fitAddon == null) {
            return;
        }
        fitAddon.fit();
        console.log("xxxxxx", termId);
        if (termId != "") {
            const servAddr = projectStore.curProject?.setting.k8s_proxy_addr ?? "";
            await request(set_term_size(servAddr, {
                term_id: termId,
                term_width: shellTerm.cols,
                term_height: shellTerm.rows,
            }));
        }
    };


    useEffect(() => {
        if (termRef !== null && termRef.current !== null) {
            setTermInit(init => {
                if (init) {
                    return init;
                }
                initTerm();
                return true;
            });
        }
    }, [termRef]);

    useEffect(() => {
        adjustTerm();
    }, [termSize, shellTerm]);

    useEffect(() => {
        if (shellTerm == null) {
            return;
        }
        const readId = uniqId();
        readIdSet.add(readId);
        readTermResponse(readId);
        return () => {
            readIdSet.delete(readId)
        };
    }, [shellTerm]);

    return (
        <Modal open title={`终端(${props.podName}/${props.containerName})`} width="calc(100vw - 200px)"
            footer={null} onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <div style={{ height: "calc(100vh - 300px)" }} ref={termRef} />
        </Modal>
    );
}
export default TermModal;
