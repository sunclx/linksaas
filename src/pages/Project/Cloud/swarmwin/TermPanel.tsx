import React, { useEffect, useRef, useState } from "react";
import { open_term, read_term, write_term, set_term_size } from "@/api/swarm_proxy";
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
    containerId: string;
}

const TermPanel = (props: TermPanelProps) => {
    const termRef = useRef<HTMLDivElement | null>(null);
    const termSize = useSize(termRef);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_termInit, setTermInit] = useState(false);
    const [shellTerm, setShellTerm] = useState<Terminal | null>(null);
    const [fitAddon, setFitAddon] = useState<FitAddon | null>(null);

    const [termId, setTermId] = useState("");


    const initTermId = async (term: Terminal) => {
        const sessionId = await get_session();
        const tokenRes = await request(gen_one_time_token({
            session_id: sessionId,
            project_id: props.projectId,
        }));
        const openRes = await request(open_term(props.servAddr, {
            token: tokenRes.token,
            name_space: props.nameSpace,
            container_id: props.containerId,
            shell_cmd: "/bin/sh",
            term_width: term.cols,
            term_height: term.rows,
        }));
        setTermId(openRes.term_id);
        return openRes.term_id;
    }

    const readTermResponse = async (term: Terminal, destTermId: string) => {
        while (true) {
            const res = await request(read_term(props.servAddr, {
                term_id: destTermId,
            }));
            term.write(Uint8Array.from(res.data));
        }
    }

    const writeData = async (data: string, destTermId: string) => {
        const rawData: number[] = [];
        for (let i = 0; i < data.length; i++) {
            rawData.push(data.charCodeAt(i));
        }
        await request(write_term(props.servAddr, {
            term_id: destTermId,
            data: rawData,
        }));
    }

    const initTerm = async () => {
        if (termRef.current == null) {
            return;
        }
        const term = new Terminal();
        term.open(termRef.current);
        const destTermId = await initTermId(term);
        readTermResponse(term, destTermId);
        termRef.current.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        const addon = new FitAddon();
        term.loadAddon(addon);
        setShellTerm(term);
        setFitAddon(addon);
        term.onKey(ev => writeData(ev.key, destTermId));
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


    return (

        <div style={{ height: "calc(100vh - 2px)" }} ref={termRef} />
    );
}
export default TermPanel;
