import React, { useEffect, useRef, useState } from "react";
import { type RESOURCE_TYPE, open_term, read_term, write_term, set_term_size } from "@/api/k8s_proxy";
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";
import { Terminal } from 'xterm';
import "xterm/css/xterm.css";
import { useSize } from 'ahooks';
import { FitAddon } from 'xterm-addon-fit';
import { get_session } from "@/api/user";

export interface TermPanelProps {
    servAddr: string;
    projectId: string;
    nameSpace: string;
    resourceType: RESOURCE_TYPE;
    resourceName: string;
    podName: string;
    containerName: string;
}

const TermPanel = (props: TermPanelProps) => {

    const termRef = useRef<HTMLDivElement | null>(null);
    const termSize = useSize(termRef);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_termInit, setTermInit] = useState(false);
    const [shellTerm, setShellTerm] = useState<Terminal | null>(null);
    const [fitAddon, setFitAddon] = useState<FitAddon | null>(null);

    const [termId, setTermId] = useState("");


    const readTermResponse = async () => {
        const sessionId = await get_session();
        const tokenRes = await request(gen_one_time_token({
            session_id: sessionId,
            project_id: props.projectId,
        }));
        if (shellTerm == null) {
            return;
        }
        const openRes = await request(open_term(props.servAddr, {
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
        while (true) {
            const res = await request(read_term(props.servAddr, {
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
        await request(write_term(props.servAddr, {
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
        if (termId != "") {
            await request(set_term_size(props.servAddr, {
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
        readTermResponse();
    }, [shellTerm]);

    return (

        <div style={{ height: "calc(100vh - 2px)" }} ref={termRef} />
    );
}
export default TermPanel;
