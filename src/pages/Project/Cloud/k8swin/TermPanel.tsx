import React, { useEffect, useRef, useState } from "react";
import { type RESOURCE_TYPE, open_term, read_term, write_term, set_term_size } from "@/api/k8s_proxy";
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";
import { Terminal } from 'xterm';
import "xterm/css/xterm.css";
import { useSize } from 'ahooks';
import { FitAddon } from 'xterm-addon-fit';
import { get_session } from "@/api/user";
import { Button, Popover, Space, message } from "antd";
import { writeText, readText } from '@tauri-apps/api/clipboard';

export interface TermPanelProps {
    servAddr: string;
    projectId: string;
    nameSpace: string;
    resourceType: RESOURCE_TYPE;
    resourceName: string;
    podName: string;
    containerName: string;
}

interface Position {
    x: number;
    y: number;
}

const TermPanel = (props: TermPanelProps) => {
    const termRef = useRef<HTMLDivElement | null>(null);
    const termSize = useSize(termRef);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_termInit, setTermInit] = useState(false);
    const [shellTerm, setShellTerm] = useState<Terminal | null>(null);
    const [fitAddon, setFitAddon] = useState<FitAddon | null>(null);

    const [termId, setTermId] = useState("");
    const [position, setPosition] = useState<Position | null>();

    const initTermId = async (term: Terminal) => {
        const sessionId = await get_session();
        const tokenRes = await request(gen_one_time_token({
            session_id: sessionId,
            project_id: props.projectId,
        }));
        const openRes = await request(open_term(props.servAddr, {
            token: tokenRes.token,
            namespace: props.nameSpace,
            resource_type: props.resourceType,
            resource_name: props.resourceName,
            pod_name: props.podName,
            container_name: props.containerName,
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
            setPosition(null);
            setTimeout(() => {
                setPosition({
                    x: ev.clientX,
                    y: ev.clientY,
                });
            }, 100);
        });
        termRef.current.addEventListener("click", () => {
            setPosition(null);
        })
        const addon = new FitAddon();
        term.loadAddon(addon);
        setShellTerm(term);
        setFitAddon(addon);
        term.onKey(ev => {
            writeData(ev.key, destTermId);
            setPosition(null);
        });
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
        <div style={{ position: "relative" }}>
            <div style={{ height: "calc(100vh - 2px)" }} ref={termRef} />
            {position != null && (
                <div style={{ position: "absolute", left: position.x, top: position.y }}>
                    <Popover open placement="right" destroyTooltipOnHide showArrow={false} content={
                        <Space direction="vertical">
                            <Button type="link" disabled={shellTerm?.getSelection() == ""} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                writeText(shellTerm?.getSelection() ?? "");
                                message.info("复制成功");
                                setPosition(null);
                            }}>复制</Button>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                readText().then(txt => {
                                    if (txt == null || txt == "") {
                                        return;
                                    }
                                    writeData(txt, termId);
                                    console.log(txt);
                                    message.info("粘贴成功");
                                    setPosition(null);
                                });

                            }}>粘贴</Button>
                        </Space>
                    } >
                        <span />
                    </Popover>
                </div>
            )}
        </div>
    );
}
export default TermPanel;
